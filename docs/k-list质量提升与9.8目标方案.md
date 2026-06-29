# k-list 质量提升与 9.8 目标方案

> 基线评审：综合 **8.0/10**（2026-06-26）  
> 目标：**9.5+**，冲刺 **9.8+**  
> 原则：架构不反复、API 少 breaking、边界可验证

---

## 1. 评分差距拆解

| 维度 | 8.0 基线 | 9.8 目标 | 差距根因 |
| --- | ---: | ---: | --- |
| 架构与设计 | 8.5 | 9.5 | cell-border 职责未文档化、inject 命名混淆 |
| API 边界 | 7.5 | 9.5 | footer 隐式规则未说明、error 冒泡 |
| 代码质量 | 8.0 | 9.5 | 主题/工具未复用、无效 computed |
| 冗余控制 | 6.5 | 9.0 | border 逻辑三处复制 |
| 状态逻辑 | 7.5 | 9.5 | 动态 cell 无 unregister、空态双层 padding |
| 跨端 | 8.5 | 9.5 | spinner-box 已修，需固化规范 |
| 文档演示 | 8.5 | 9.8 | footer 规则、架构与实现一致 |

---

## 2. 批次实施（已落地 / 待验收）

### 批次 A — 正确性（P0/P1）✅ 已实施

| 项 | 方案 | 文件 |
| --- | --- | --- |
| 动态 cell 底线错乱 | `createCellBorderRegistry` + `onBeforeUnmount` unregister | `cell-border.uts`、`k-cell.uvue`、`k-list.uvue`、`k-cell-group.uvue` |
| error 自定义 slot 冒泡 | `@retry` 仅绑在默认 error 内层 | `k-list.uvue` |
| 空态双层 padding | `k-list__status--empty` padding 归零 | `k-list.uvue` |
| footer 规则不透明 | 抽 `list-utils.uts` + README 专节 | `list-utils.uts`、`k-list/README.md` |

### 批次 B — 工程化（P1/P2）✅ 已实施

| 项 | 方案 | 文件 |
| --- | --- | --- |
| 主题样式重复 | 统一 `buildThemeStyle` | `k-list` / `k-empty` / `k-load-more` / `k-cell-group` |
| 硬编码色值 | loading/error 走 `--k-*` 变量 | `k-list.uvue` |
| border 逻辑重复 | `syncCellItemBorders` 单点 | `cell-border.uts` |
| inject 可读性 | 新增 `k-cell-unregister-child`，保留旧键兼容 | 各 provider |

### 批次 C — API 精修（P2）✅ 已实施

| 项 | 方案 |
| --- | --- |
| 强制隐藏「没有更多了」 | 新增 `hideFinishedFooter`（默认 `false`） |
| 无效 computed | 移除 `showLoadingState`、`emptyClass` 等 |

### 批次 D — 文档与架构一致（P0）✅ 已实施

| 项 | 方案 |
| --- | --- |
| 架构文档 | 明确「平铺 cell 的 border 代理」为 v2.1 有意保留 |
| 冒烟清单 | 增加动态 v-for 删项、自定义 error 不冒泡 |
| 演示页 | 增加「动态删项」交互区块 |

### 批次 E — 9.8 冲刺 ✅ 已实施

| 项 | 预期收益 | 状态 |
| --- | --- | --- |
| load-more 文案 props 收敛为 `loadMoreTexts` 对象（保留旧 props 兼容） | API +0.2 | ✅ |
| 演示页分页逻辑抽 `list-demo-utils.uts` | 演示 +0.1 | ✅ |
| APP 全量编译 + MP 动态列表验收 | 跨端 +0.2 | **待执行** |
| L2 标准列表页（scroll-view + load-more） | 可扩展 +0.2 | **二期**（一期在 list 演示页验收） |
| L3 pull-refresh | 可扩展 +0.2 | **二期**（一期暂不交付） |

---

### 批次 F — 评审快速收益 ✅ 已实施

| 项 | 方案 | 文件 |
| --- | --- | --- |
| 删除 dead code | 移除 `runDemoRefreshPageLoad` | `list-demo-utils.uts` |
| load-more 文案合并 | `resolveAllLoadMoreTexts` 单 computed | `list-utils.uts`、`k-list.uvue` |
| watch 合并 | 三个 watch → 一个 | `k-list.uvue` |
| 主题色统一 | error/empty icon、load-more spinner 走 `resolveSecondaryColor` | `k-list` / `k-empty` / `k-load-more`、`theme.uts` |
| 演示补全 | `loadMoreTexts` / `hideFinishedFooter` 区块 | `pages/list/list.uvue` |
| load-more 文档 | 多态优先级说明 | `k-load-more/README.md` |

---

## 3. 目标评分（实施后预估）

| 维度 | 批次 E 后 | 批次 F 后 |
| --- | ---: | ---: |
| 架构与设计 | 9.5 | **9.5** |
| API 边界 | 9.3 | **9.4** |
| 代码质量 | 9.4 | **9.6** |
| 冗余控制 | 9.0 | **9.2** |
| 状态逻辑 | 9.5 | **9.5** |
| 跨端 | 9.3 | **9.3** |
| 文档演示 | 9.6 | **9.7** |
| 可扩展性 | 9.5 | **9.5** |
| **综合** | 9.7～9.8 | **9.2～9.4**（代码落地）；**9.5～9.6**（三端冒烟通过后） |

> 公开评审基线 **8.7/10**；批次 A～F 代码已全部落地，**仅剩三端冒烟勾选**即可正式收口 9.5+。

---

## 4. footer 显示规则（权威说明）

内置 `k-load-more` 在**同时满足**时展示：

1. 未传 `#footer` slot  
2. 非 loading / error / empty 三态  
3. 满足以下**任一**：
   - `finished == false`（分页进行中）
   - `loadingMore == true`
   - `loadMoreError == true`
   - 曾进入过分页流程且 `finished == true` 且 `hideFinishedFooter == false`（显示「没有更多了」）

静态列表：`finished` 默认 `true` 且未触发过分页 → **不展示 footer**。

---

## 5. 验收门禁（9.5+ 必过）

- [ ] MP：动态 `v-for` 删项后 cell 底线正确（list 页「动态删项」区块）
- [ ] MP：自定义 `#error` 内按钮不触发外层 `@retry`
- [ ] WEB：无 k-icon size 类型 warn
- [ ] APP：Kotlin 编译通过
- [ ] 文档：README / 架构 / 本方案 三处 footer 规则一致

**通过后预估综合分：9.5～9.6；批次 E 可选 API 收敛 + 三端全绿 → 9.7～9.8**

---

## 6. 相关文件

| 文件 | 用途 |
| --- | --- |
| `uni_modules/kit-ui/components/k-cell/cell-border.uts` | cell 分割线注册表 |
| `uni_modules/kit-ui/components/k-list/list-utils.uts` | footer 显示纯函数 |
| `docs/k-list架构重构与二期列表规划.md` | 架构权威 |
| `docs/k-list三端冒烟验收清单.md` | 三端验收 |
