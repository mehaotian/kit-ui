# k-list / k-list-item 开发计划

> 更新日期：2026-06-26  
> 前置条件：迭代 2 反馈闭环已验收  
> 状态：**v1 已归档；v2 已实施** — 见 `docs/k-list架构重构与二期列表规划.md`

---

## 1. 背景与目标

### 1.1 为什么现在做

- 迭代 2 第一梯队（弹层 + 反馈）已闭环，业务页面「提交 → 确认 → 提示」链路已在 `pages/modal/modal.uvue` 演示。
- 迭代 2 DoD 剩余项：**列表场景可承载真实数据项（空态、长内容、边界项）**。
- 首页 `List｜列表` 仍为 `planning`，`pages/list/` 尚未创建。

### 1.2 迭代目标（v1 最小可用）

| 目标 | 说明 |
| --- | --- |
| 列表容器 | 提供统一的外层容器，承载 slot 子项 |
| 状态展示 | loading / empty / error 三态可切换 |
| 列表项原语 | `k-list-item` 提供左/主/右三区 slot + 点击态 |
| 与 k-cell 分工 | 不重复建设「设置页单元格」能力，见 §2 |

### 1.3 非目标（v1 不做）

- 虚拟滚动 / 长列表性能优化（二期 `k-virtual-list`）
- 下拉刷新 / 上拉加载（迭代 3 `k-pull-refresh` / `k-load-more`）
- 滑动删除 / 批量选择（二期评估）
- 与 `scroll-view` 的深度封装（优先业务侧组合）

---

## 2. 与 k-cell 的差异（开发前必读）

| 维度 | `k-cell` / `k-cell-group` | `k-list` / `k-list-item` |
| --- | --- | --- |
| 定位 | 设置页、表单详情、分组导航 | 数据列表、消息流、订单列表等 |
| 结构 | title / value / label / icon / isLink | 左 slot + 主内容 + 右 slot，偏横向信息流 |
| 容器能力 | `k-cell-group` 提供分组标题、inset 卡片 | `k-list` 提供 loading / empty / error 容器态 |
| 交互 | url 跳转、必填星号、disabled | 行点击、可选分割线、长文本省略 |
| 组合关系 | 独立使用 | **可内嵌 `k-cell`**，但不互相替代 |

**原则**：v1 不 fork `k-cell` 样式逻辑；`k-list-item` 走独立 BEM（`k-list-item`），必要时 demo 展示「list 包 cell」组合用法。

---

## 3. API 草案（v1）

### 3.1 k-list

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否加载中 | `boolean` | `false` |
| finished | 是否已加载完成（配合后续 load-more 预留） | `boolean` | `true` |
| error | 是否错误态 | `boolean` | `false` |
| emptyText | 空态文案 | `string` | `'暂无数据'` |
| errorText | 错误态文案 | `string` | `'加载失败，请重试'` |
| loadingText | 加载文案 | `string` | `'加载中...'` |
| border | 是否显示项间分割线 | `boolean` | `true` |
| inset | 卡片式内边距（对齐 cell-group inset 视觉） | `boolean` | `false` |
| customStyle | 容器自定义样式 | `string` | `''` |

**Slots**

| 名称 | 说明 |
| --- | --- |
| default | 列表项（`k-list-item` 或 `k-cell`） |
| empty | 自定义空态 |
| loading | 自定义 loading（默认 `k-loading` spinner） |
| error | 自定义错误态 |
| footer | 列表底部（预留 load-more 挂载点） |

**Events**

| 事件 | 说明 |
| --- | --- |
| retry | 错误态点击重试 |

### 3.2 k-list-item

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 主标题 | `string` | `''` |
| description | 副标题/描述 | `string` | `''` |
| clickable | 是否可点击 | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| border | 底部分割线（最后一项可由 list 统一控制） | `boolean` | `null` |
| customStyle | 自定义样式 | `string` | `''` |

**Slots**

| 名称 | 说明 |
| --- | --- |
| prefix | 左侧（头像、图标、checkbox 等） |
| default | 主内容区（无 title/description 时完全自定义） |
| suffix | 右侧（状态、按钮、箭头） |

**Events**

| 事件 | 说明 |
| --- | --- |
| click | 行点击 |

---

## 4. 文件结构

```text
uni_modules/kit-ui/components/k-list/
├── k-list.uvue
├── list.type.uts          # 可选：状态枚举
└── README.md

uni_modules/kit-ui/components/k-list-item/
├── k-list-item.uvue
└── README.md

pages/list/
└── list.uvue              # 演示页

docs/k-list三端冒烟验收清单.md   # 开发完成后补写
```

---

## 5. 演示页规划（pages/list/list.uvue）

| 区块 | 内容 |
| --- | --- |
| 基础用法 | 3~5 条 `k-list-item`，title + description |
| 自定义 slot | prefix 头像 / suffix 状态标签 |
| 长内容 | description 多行省略或换行边界 |
| 空态 | `loading=false` + 无子项 → empty |
| 加载态 | `loading=true` → 居中 spinner |
| 错误态 | `error=true` + retry 事件 |
| 与 k-cell 组合 | `k-list` 内嵌 `k-cell-group` 说明分工 |
| 边界 | disabled 项、最后一项 border、inset 卡片 |

APP 端滚动：`#ifdef APP` 包裹 `scroll-view`。

---

## 6. 样式与主题

- 类名前缀：`k-list`、`k-list-item`
- 状态类：`--loading`、`--empty`、`--error`、`--disabled`、`--clickable`
- 变量建议（写入 README）：
  - `--k-list-background`
  - `--k-list-item-padding`
  - `--k-list-item-title-color`
  - `--k-list-item-description-color`
  - `--k-list-divider-color`
- **红线**：禁止 `grid`、`gap`、`@media`；文本样式只写在 `text` / `button`

---

## 7. 开发顺序（建议 3~4 天）

```text
Day 1  设计与脚手架
├── 确认 API 草案（本文 §3）
├── kit-ui-add-component：k-list + pages/list + pages.json
└── k-list 容器：default slot + empty / loading / error 三态

Day 2  k-list-item
├── prefix / default / suffix slot
├── title / description + 长文本边界
└── click / disabled / border

Day 3  演示页 + 文档
├── list.uvue 全区块
├── README × 2 + 组件开发清单状态
└── 首页 List 入口 → completed

Day 4  三端冒烟
├── WEB / APP / MP 基础 + 三态 + 长内容
├── 补 docs/k-list三端冒烟验收清单.md
└── 看板 / 一期下一步计划 状态终态
```

---

## 8. DoD（完成标准）

- [ ] `k-list` / `k-list-item` props、slots、events 与 README 一致
- [ ] demo 覆盖：基础、slot、空态、loading、error、长内容、边界
- [ ] `pages.json` 已注册；首页 `List` 为 `completed`
- [ ] APP / WEB / 微信 MP 冒烟通过
- [ ] 无 `grid` / `gap` / `@media` 违规
- [ ] 与 `k-cell` 差异在 README 中写清

---

## 9. 风险与决策

| 风险 | 应对 |
| --- | --- |
| 与 k-cell 能力重叠 | 严格按 §2 分工；demo 显式对比 |
| 空态与 loading 同时 true | 优先级：`loading` > `error` > `empty` > default slot |
| APP 列表滚动 | 容器不内置 scroll-view；演示页按规范条件编译 |
| 后续 pull-refresh 接入 | `footer` slot + `finished` prop 预留，v1 不实现刷新逻辑 |

---

## 10. 相关文档

| 文档 | 用途 |
| --- | --- |
| **`docs/k-list架构重构与二期列表规划.md`** | **v2 重构 + 二期列表生态（当前执行依据）** |
| `docs/一期下一步开发计划.md` | 迭代 2 总排期 |
| `docs/一期组件迭代看板.md` | Issue 级任务 |
| `docs/k-popup开发进度与后续计划.md` | 上一阶段收口 |
| `uni_modules/kit-ui/components/k-cell/README.md` | 单元格 API 参考 |
| `.cursor/skills/kit-ui-add-component` | 脚手架流程 |
