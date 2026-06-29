# k-tabs 跨端实现说明

> 版本：v1（v1.1 2026-06-29 复验）  
> 日期：2026-06-29  
> 状态：三端验收通过，与代码一致  
> 关联：`uni_modules/kit-ui/components/k-tabs/README.md`、`docs/k-tabs开发计划.md`

---

## 1. 架构分层

```text
k-tabs (k-tabs.uvue)
  ├── provide：pane 注册、activeValue、lazy 等（键见 tab.constants.uts）
  ├── 调度：scheduleNavLayoutSync（合并测量、指示器、滚动宽度）
  └── 子树：
        k-tabs-nav-body
          └── k-tabs-nav-wrap
                ├── [scrollable] scroll-view → nav-wrap → items#k-tabs-item-*
                └── [非 scrollable] nav-wrap → items
        k-tab-pane × N（default slot）
```

**设计原则**：Tab 头由父级统一渲染；pane 仅 register 元数据 + 提供内容 slot（对齐 `k-collapse`）。

---

## 2. 指示器与测量

### 2.1 几何计算

- `tabs-layout.uts`：`queryIndicatorMetrics`、`queryScrollNavWidth`
- `tab-indicator.uts`：line 与 card/button 轨道 metrics
- line 型优先用 `#k-tabs-inner-*` 宽度作为指示器锚点

### 2.2 query 作用域

- 导航 DOM 在 `k-tabs-nav-wrap` 内，`navQueryScope` 由 wrap `onMounted` 注册（`K_TABS_REGISTER_NAV_QUERY_SCOPE`）
- **必须在 DOM 所在组件实例上** `.in(scope)`，否则小程序 / APP 测不到节点

### 2.3 指示器动画

| 端 | 实现 |
| --- | --- |
| WEB / MP | `indicatorStyle` 内联 `left` / `width` / `top` + CSS `transition` |
| APP | `applyIndicatorToDom` + `setProperty`；wrap 注册 `indicatorRef`（`K_TABS_REGISTER_INDICATOR`） |

首屏：`indicatorLayoutReady` 首次定位禁用过渡，避免从左上角飞入。

---

## 3. 横向滚动（scrollable）

### 3.1 原生可滚动条件

1. `scroll-view` 使用 `direction="horizontal"`（非废弃 `scroll-x`）
2. `scroll-view` 设明确高度：`var(--k-tabs-nav-height)`
3. `nav-wrap` 设 **像素宽度**（各 Tab 项宽度累加，`navScrollWidth`）
4. Tab 项 `flex-shrink: 0`

### 3.2 激活项滚入可视区

- `syncScrollIntoView`：先 `scrollIntoViewActive = ''`，`nextTick` 再设 `k-tabs-item-${elId}`
- **微信 MP 硬约束**：`scroll-view` 与带 `id` 的 Tab 项必须在 **同一自定义组件**（`k-tabs-nav-wrap`）内；跨组件 `scroll-into-view` 找不到目标

### 3.3 swipeThreshold

`scrollable=false` 且 `stretch=false` 时，pane 数量 > `swipeThreshold` 自动开启横向滚动。

### 3.4 宽度溢出自动 scrollable

未显式 `scrollable` 且未 `stretch`、Tab 数量 ≤ `swipeThreshold` 时，若各 Tab 总宽超出导航容器（徽标/长标题等），`measureScrollNavWidth` 会设置 `forceScrollByOverflow`。

**维护注意**：

- **禁止**对 `forceScrollByOverflow` 添加 `watch` 并回调 `scheduleNavLayoutSync` — 会与 scroll / 非 scroll DOM 切换形成死循环，导致三端页面抖动或 WEB 卡死
- 模式切换仅在测量回调内完成，切换后 **一次** `nextTick` 补测
- 使用 `OVERFLOW_SCROLL_HYSTERESIS`（8px）避免临界宽度来回切换

---

## 4. 样式与主题

### 4.1 CSS 变量注入

子组件无法继承 `k-tabs` 根上的 `--k-tabs-*`。`buildNavWrapCssVars`（`tabs-style.uts`）生成内联样式，经 `nav-wrap-style` 传到 `k-tabs-nav-wrap`。

### 4.2 激活色

- 图标 / 文字：`resolveItemTextStyle` 内联 `color`（APP / MP）
- line 指示器：APP `setProperty('background-color')`；WEB / MP CSS

### 4.3 小程序 card / button 尺寸

修饰类 `k-tabs__nav-wrap--{type}`、`k-tabs__nav-wrap--{size}` 写在 **nav-wrap 子组件** 内（`tabs-nav.style.scss`），避免样式隔离导致 Tab 仍用默认 44px 高度。

---

## 5. lazy 与 destroyOnHide

- `k-tab-pane` inject `K_TABS_LAZY`、`K_TABS_DESTROY_ON_HIDE`
- `hasVisited` 标记：lazy 时未访问不 mount default slot
- `destroyOnHide=true`：切走后卸载，再次激活重新 mount

---

## 6. 一期已知限制（勿在 v1 扩展）

| 项 | 说明 |
| --- | --- |
| label slot | 用 `icon` + `title` 替代 |
| swipeable | 内容区手势切换，二期 |
| sticky / 垂直 Tab | 二期 |
| beforeChange Promise | 仅同步 `boolean` |
| 嵌套 scroll-view 协调 | 文档说明，不封装 |

---

## 7. 维护者自检

改动导航 DOM / 滚动 / 测量后建议：

1. 跑 `kit-ui-cross-platform-check`（grid/gap/@media）
2. 跑 `kit-ui-uts-app-compat`（provide/inject、query scope）
3. 微信端跑 `kit-ui-mp-weixin-compat`（scroll-into-view 组件边界、card 尺寸）
4. APP 指示器走 `kit-ui-app-animation` 约束（禁止响应式 `:style` 驱动 APP 动效）
5. 全量编译三端，对照 `docs/k-tabs三端冒烟验收清单.md`
