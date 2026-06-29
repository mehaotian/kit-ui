# k-list v2 三端冒烟验收清单

> 目标：验证 `k-list` 状态容器 + `k-cell` 行承载（**无 k-list-item**）  
> 适用版本：k-list v2（2026-06-26 架构重构）  
> 演示页：`pages/list/list.uvue`

---

## 1. 执行前准备

- HBuilderX 最新稳定版，uni-app x 可用
- 清理缓存后全量运行（APP 不单靠 HMR）
- 进入页面：`pages/list/list.uvue`

---

## 2. 验收范围

### 2.1 k-list v2 + L1/L2

- loading / error / empty 三态（`:empty` 显式绑定）
- 透明背景、无容器 border/inset
- `@retry` 错误重试
- default slot 承载 k-cell / k-cell-group
- 默认 empty 内嵌 `k-empty`，支持 `#empty-action`
- footer 内置 `k-load-more`（`finished` / `loadingMore` / `loadMoreError`）
- `@load-more` / `@load-more-retry`

### 2.2 质量增强（9.5+ 批次）

- 动态 `v-for` 删项后 cell 底线正确（`cell-border.uts` + unregister）
- 自定义 `#error` 不触发外层 `@retry` 冒泡
- 空态无双层 padding（`k-list__status--empty` padding 归零）
- MP loading 正圆（`k-ring-spinner` + `__spinner-box`）

### 2.3 已移除（不应出现）

- `k-list-item` 组件
- k-list 的 `border` / `inset` props
- v1 itemChildren 空态自动计数

---

## 3. 三端执行记录

| 端 | 环境信息 | 结果 | 备注 |
| --- | --- | --- | --- |
| WEB | | ☐ 通过 / ☐ 失败 | |
| APP | | ☐ 通过 / ☐ 失败 | Kotlin 编译无报错 |
| 微信 MP | | ☐ 通过 / ☐ 失败 | loading 圆环不变形 |

---

## 4. 用例清单

### 4.1 基础 cell 列表

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| 订单通栏 cell | ☐ | ☐ | ☐ | 三行展示，无容器边框 |
| icon + extra slot | ☐ | ☐ | ☐ | 头像、标签正常 |
| 长 label 文案 | ☐ | ☐ | ☐ | 换行/省略不溢出 |

### 4.2 容器三态

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| loading | ☐ | ☐ | ☐ | 正圆 spinner + 文案 |
| empty | ☐ | ☐ | ☐ | k-empty 图标 +「暂无数据」 |
| empty-action | ☐ | ☐ | ☐ | 空态底部按钮可点击 |
| error + retry | ☐ | ☐ | ☐ | 点击重试后恢复列表 |
| 恢复正常 | ☐ | ☐ | ☐ | 动态 cell 重新出现 |

### 4.3 分页 load-more

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| 首屏 loading | ☐ | ☐ | ☐ | spinner 后出列表 |
| 点击加载更多 | ☐ | ☐ | ☐ | 底部 loading → 追加 cell |
| 全部加载完成 | ☐ | ☐ | ☐ | 显示「没有更多了」 |
| load-more 失败重试 | ☐ | ☐ | ☐ | 失败文案可点，重试成功 |

### 4.4 分组与边界

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| cell-group inset | ☐ | ☐ | ☐ | 卡片在 list 内正常，非空态 |
| clickable / disabled | ☐ | ☐ | ☐ | 点击反馈、禁用无效 |
| 动态删项底线 | ☐ | ☐ | ☐ | v-for 删首项后最后一项无多余横线 |
| 自定义 error 不冒泡 | ☐ | ☐ | ☐ | `#error` 内按钮不触发外层 retry |

### 4.5 整页列表范式（二期）

> 一期不验收 `pages/list-scroll` 与 `k-pull-refresh`。分页 / load-more 在 `pages/list/list.uvue` 各区块验收。

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| list 演示 首屏 loading | ☐ | ☐ | ☐ | k-list loading → 列表 |
| list 演示 分页 load-more | ☐ | ☐ | ☐ | 点击/逻辑追加 + finished |
| loadMoreTexts 对象 | ☐ | ☐ | ☐ | 底部文案来自对象配置 |

---

## 5. 收口标准

- §4 全部勾选通过
- APP 无 ClassCastException / Kotlin 编译错误
- 组件库内无 `k-list-item` 引用

---

## 6. 相关文档

| 文档 | 用途 |
| --- | --- |
| `docs/k-list架构重构与二期列表规划.md` | v2 架构与二期规划 |
| `uni_modules/kit-ui/components/k-list/README.md` | API |
| `uni_modules/kit-ui/components/k-cell/README.md` | 行原语 |
| `docs/k-list质量提升与9.8目标方案.md` | 质量提升批次与 9.8 门禁 |
