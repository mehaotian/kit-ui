# k-popup 方案分析报告

> 版本：v1.0  
> 日期：2026-06-25  
> 状态：**分析阶段，未进入开发**  
> 关联：`docs/一期下一步开发计划.md`、`docs/k-button双轨策略规范.md`、`.cursor/skills/kit-ui-app-animation/SKILL.md`

---

## 1. 背景与定位

### 1.1 为什么 k-popup 是一期迭代 2 的基石

`k-popup` 不是单一 UI 组件，而是 kit-ui **反馈层（Feedback Layer）** 的底层容器。后续组件均依赖其能力：

```text
k-overlay（遮罩原语，可选独立）
    └── k-popup（位置 + 动效 + 生命周期）
            ├── k-modal（对话框语义）
            ├── k-action-sheet（底部操作表，二期）
            ├── k-drawer（侧滑抽屉，二期）
            └── k-toast（轻提示，可独立或复用 overlay）
```

一期目标：**通用、可扩展、跨端一致**；不做业务语义封装（如登录弹窗、支付面板）。

### 1.2 kit-ui 差异化定位（对标 k-form 思路）

参考 `k-form` 专项的取舍方式，k-popup 的定位应为：

**「uni-app x 原生友好的分层弹层容器」**

1. **容器与语义分离**：popup 只管「怎么弹」，modal/action-sheet 管「弹什么」
2. **双轨/三轨并行**：页面内组件 + 平台原生容器（page-container / dialogPage）分工，类比 k-button 双轨
3. **UTS 安全**：生命周期回调、z-index 管理避免动态对象遍历与 JS 特有 API
4. **APP 动画可预期**：动效走已验证的 ref + setProperty 方案，不赌 CSS transition

### 1.3 非目标（一期明确边界）

- 不实现 draggable / overflow 拖拽弹窗（Element Plus 高级能力）
- 不实现 backdrop blur 毛玻璃（APP 不支持模糊，kit-ui 样式红线）
- 不在 k-popup 内封装 dialogPage 全屏路由弹层（提供文档与工具，不做 API 代理）
- 不追求 H5 Teleport 到 `document.body` 的 DOM 层级魔法（uni-app x 跨端语义不同）
- 不做命令式 `showPopup()` 全局单例（留给 k-toast；k-popup 以声明式为主）

---

## 2. 竞品与参考库对比

### 2.1 对比总览

| 维度 | Vant 4 Popup | Element Plus Dialog | Ant Design Mobile Popup | uView / uView-plus | uni-ui uni-popup | uni-app x 原生 |
| --- | --- | --- | --- | --- | --- | --- |
| **核心模型** | 声明式 + Teleport | Dialog 内置 Overlay | Mask + Popup 分层 | 声明式 mode 方向 | 声明式 type + transition 子组件 | page-container / dialogPage |
| **弹出位置** | top/bottom/left/right/center | center（Dialog 专用） | top/bottom/left/right | mode 同左 | top/bottom/left/right/center | position 同左 |
| **遮罩** | overlay + overlayStyle | modal + modalClass | 独立 Mask 组件 | overlay + overlayOpacity | mask-click / is-mask-click | overlay + overlay-style |
| **关闭策略** | 遮罩/关闭图标/beforeClose/popstate | ESC/遮罩/before-close | closeOnMaskClick + onClose | closeOnClickOverlay | mask-click | clickoverlay + 返回键拦截 |
| **滚动锁定** | lock-scroll | lock-scroll（body class） | disableBodyScroll | 文档建议 page-meta | page-meta + overflow | page-container 内置 |
| **安全区** | safeAreaInsetTop/Bottom | — | — | safeAreaInsetBottom 默认 true | safe-area | 需自行 padding |
| **挂载位置** | teleport | append-to-body | getContainer → body | 组件树内 | 组件树内 | 页面级 API |
| **覆盖导航栏** | ❌ | ❌ | ❌ | ❌ | ❌ | dialogPage ✅ |
| **返回键拦截** | close-on-popstate（H5） | — | — | — | ❌ | page-container ✅ |
| **销毁策略** | lazy-render | destroy-on-close | destroyOnClose | — | — | — |
| **层级管理** | z-index 固定值 | nextZIndex 递增 | CSS 变量 --z-index | zIndex 10075 硬编码 | — | z-index prop |
| **uni-app x 适配** | ❌ Web Vue | ❌ Web Vue | ❌ React H5 | uview-plus 宣称兼容 | 旧 uni-app | ✅ 官方原生 |

### 2.2 各库可借鉴点

#### Vant 4 Popup（移动端标杆）

**借鉴：**

- API 命名直观：`v-model:show`、`position`、`round`、`close-on-click-overlay`
- `before-close` 拦截关闭（同步 boolean / Promise）
- `lazy-render`：未展示不渲染内容，性能友好
- `safe-area-inset-bottom` 与 `position` 联动
- 生命周期事件：`open` / `opened` / `close` / `closed`

**不采纳：**

- `teleport` 在小程序端语义受限，不能作为默认方案
- `lock-scroll` 的 body 操作在 uni-app x 需改为 page-meta / 页面级方案

#### Element Plus Dialog（桌面端标杆）

**借鉴：**

- `destroy-on-close` + `rendered` 懒渲染状态机
- `nextZIndex()` 多层弹窗自动叠层（modal 场景）
- `append-to-body` 解决层级与 overflow 裁剪
- `before-close(done)` 异步关闭网关
- Overlay 与 Dialog 职责分离的内部架构

**不采纳：**

- draggable / align-center / overflow 等桌面向能力
- `close-on-press-escape`（APP/MP 无统一 ESC 语义）

#### Ant Design Mobile（架构最佳实践）

**借鉴：**

- **Mask 与 Popup 硬分层**：Mask 管遮罩与透明度，Popup 管位移动效
- `PopupBaseProps` 作为 modal/action-sheet 的公共基类
- `afterShow` / `afterClose` 明确区分动画前后期
- `destroyOnClose` + `forceRender` 组合控制 DOM 留存
- `getContainer` 挂载点抽象（kit-ui 可映射为「挂载策略」而非 DOM API）

**不采纳：**

- React 特有的 `stopPropagation` 事件枚举
- spring 动画（@react-spring），UTS 难以等价

#### uView / uView-plus（uni 生态直接竞品）

**借鉴：**

- `mode` 与 `position` 语义一致，默认 `bottom` 符合移动端习惯
- `bgColor="transparent"` 支持无底色容器（嵌套 modal 场景）
- `zoom` 控制 center 模式缩放
- `overlayOpacity` 与 `overlayStyle` 互斥，避免样式冲突
- uview-plus 的 `pageInline` 内嵌模式思路（页面内局部弹层）

**教训（Issue #585）：**

- `safeAreaInsetBottom` 默认值不应在所有 position 下生效，需 **按 position 智能默认**（bottom/center 开，top/left/right 关）

#### uni-ui uni-popup（同生态历史方案）

**借鉴：**

- 与 `uni-transition` 组合实现动效（kit-ui 可内聚，不暴露子组件）
- 滚动穿透文档：MP/APP 用 `page-meta` 动态改 `overflow`

**不采纳：**

- `mask-click` / `is-mask-click` 双 prop 历史包袱
- 依赖大量 Vue 2/3 混编实现，非 UTS 体系

#### uni-app x 原生能力（必须纳入方案）

| 能力 | 组件/API | 适用场景 | 限制 |
| --- | --- | --- | --- |
| 页面内弹层 + 返回拦截 | `page-container` | 小程序/App 需拦截物理返回键 | 不能覆盖 navbar/tabbar |
| 全屏透明页弹层 | `openDialogPage` | 需覆盖导航栏/TabBar | 非组件，是页面级 API；小程序行为与 App 不一致 |
| 滚动穿透 | `page-meta` overflow | MP/APP 配合 popup | 每页仅一个 page-meta |

**结论：** kit-ui 的 k-popup **不能**简单复制 Vant/uView 的 Web 弹层模型，必须叠加 uni-app x 的**三轨策略**（见 §4）。

---

## 3. uni-app x 约束对方案的核心影响

### 3.1 动画（高优先级风险）

来源：`kit-ui-app-animation` 技能、`app-animation.mdc`

| 平台 | 可行方案 | 禁止方案 |
| --- | --- | --- |
| WEB / MP | CSS `transform` + `transition`，`:class` 状态驱动 | — |
| APP | `ref<UniElement>` + `setProperty('transform', 'translateY(...)')` | 响应式 `:style` 绑定 transform |
| 全端 | 静态样式写 SCSS，动效属性 APP 走 sync 函数 | `var(--k-*)` 写入 setProperty |

**各 position 动效映射：**

| position | 进入动效 | APP setProperty 属性 |
| --- | --- | --- |
| bottom | translateY(100%) → 0 | transform |
| top | translateY(-100%) → 0 | transform |
| left | translateX(-100%) → 0 | transform |
| right | translateX(100%) → 0 | transform |
| center | scale(0.85) → 1 或 opacity 0 → 1 | transform / opacity |

遮罩层：opacity 0 → 1，APP 同样走 setProperty。

### 3.2 样式红线

- 禁止 `gap`、`grid`、`@media`
- 文本样式只在 `text` / `button`
- 圆角不用 `50%`，用固定 px/rpx
- 主题色 APP 动效用 `resolveThemeColor()` 实色，不用 CSS var

### 3.3 UTS 实现约束

- 函数参数默认值用 `prop : Type = default`，不用 `?:`
- `beforeClose` 回调类型需显式定义，Promise 支持要谨慎验证 APP 编译
- 避免 `export const PopupConfig = { ... }` 对象聚合
- 组件 ref 类型：`KPopupComponentPublicInstance`，遵循 k-form 规范

### 3.4 层级（z-index）体系

kit-ui 已有主题变量（`variables.scss`）：

```text
$k-z-index-popper:  2000   ← k-popup 默认
$k-z-index-toast:   3000   ← k-toast
$k-z-index-modal:   4000   ← k-modal
$k-z-index-loading: 5000   ← k-loading 全屏遮罩
```

**问题：** `k-loading.scss` 硬编码 `z-index: 9999`，与主题变量不一致，popup 开发时应一并治理。

**建议：** 新增 `overlay-stack.uts` 轻量 z-index 分配器（借鉴 Element Plus `nextZIndex`），同一页面多 popup 时自动 +1，而不是业务手动传 z-index。

---

## 4. 推荐架构：分层 + 三轨策略

### 4.1 内部分层（代码架构）

```text
┌─────────────────────────────────────────────────────────────┐
│  业务层：picker 面板、分享面板、确认框内容                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  语义层：k-modal / k-action-sheet / k-toast（二期）            │
│  - 复用 popup 容器，只加标题/按钮/预设布局                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  容器层：k-popup                                             │
│  - show / position / round / safeArea / 生命周期              │
│  - 默认 slot + optional header/footer slot                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  原语层：k-overlay（建议独立，也可 popup 内聚）                 │
│  - 遮罩显隐、透明度、点击穿透、z-index                         │
│  - 供 k-loading 全屏态复用，消除重复实现                       │
└─────────────────────────────────────────────────────────────┘
```

**是否独立 k-overlay？**

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| A. popup 内聚 overlay | 一期交付快 | k-loading / toast 重复遮罩逻辑 |
| B. 独立 k-overlay + k-popup 组合 | 架构清晰、可复用 | 多一个组件维护 |

**推荐：方案 B（独立 k-overlay）**，但一期可 **同目录实现、同批交付**，不强制单独 demo 页。

### 4.2 三轨策略（对外使用方式）

类比 `k-button` 双轨，popup 建议 **三轨并行**：

| 轨道 | 方式 | 适用场景 | kit-ui 职责 |
| --- | --- | --- | --- |
| **A. k-popup 组件** | 声明式，页面 template 内 | 90% 业务：底部面板、居中弹窗、侧边抽屉 | 完整实现 + demo |
| **B. page-container** | 原生组件包裹 | 需拦截返回键/侧滑关闭，且不需覆盖 navbar | 文档示例 + 样式类复用 |
| **C. dialogPage** | `uni.openDialogPage` | 需覆盖 navbar/tabbar 的全屏模态 | 文档指南 + 示例页，不封装 API |

```text
需要覆盖 TabBar/导航栏？
  ├─ 是 → 轨道 C：dialogPage 示例（业务自建透明页 + k-popup 样式）
  └─ 否 → 需要拦截物理返回键？
           ├─ 是 → 轨道 B：page-container 包裹 或 k-popup usePageContainer 模式
           └─ 否 → 轨道 A：k-popup
```

**扩展点：** k-popup 增加 `nativeMode?: 'none' | 'page-container'`（一期可选，二期完善），内部条件编译渲染 `page-container` 包裹层。

---

## 5. API 设计方案

### 5.1 命名原则

- 与 uni-app x `page-container` 对齐：用 **`position`** 而非 uView 的 `mode`
- 与 Vant 对齐：用 **`show`** + **`update:show`**（v-model:show）
- kit-ui 前缀：类名 `k-popup`、`k-popup--bottom`、`k-overlay`

### 5.2 一期 P0 API（最小可用）

#### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| show | boolean | false | 是否显示 |
| position | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center'` | `'bottom'` | 弹出位置 |
| overlay | boolean | true | 是否显示遮罩 |
| overlayOpacity | number | 0.5 | 遮罩透明度 0~1 |
| closeOnClickOverlay | boolean | true | 点击遮罩是否关闭 |
| round | boolean | false | 是否圆角（top/bottom/center 生效） |
| duration | number | 300 | 动画时长 ms |
| zIndex | number | `$k-z-index-popper` | 层级 |
| safeAreaInsetTop | boolean | false | 顶部安全区（position=top 时建议 true） |
| safeAreaInsetBottom | boolean | 智能默认 | bottom/center 默认 true，其余 false |
| lockScroll | boolean | true | 是否锁背景滚动 |
| bgColor | string | `'#ffffff'` | 内容区背景，`transparent` 可透明 |

#### Events

| 事件 | 说明 | 触发时机 |
| --- | --- | --- |
| update:show | v-model 同步 | show 变化 |
| open | 打开 | 动画开始前 |
| opened | 已打开 | 动画结束后 |
| close | 关闭 | 动画开始前 |
| closed | 已关闭 | 动画结束后 |
| clickOverlay | 点击遮罩 | 点击时（无论是否关闭） |

#### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 弹层主体内容 |
| header | 可选头部（不内置样式逻辑，仅布局位置） |

#### Expose Methods

| 方法 | 说明 |
| --- | --- |
| open() | 程序化打开 |
| close() | 程序化关闭 |

### 5.3 一期 P1 API（迭代 2 内补齐）

| 属性/能力 | 说明 | 参考来源 |
| --- | --- | --- |
| closeable | 显示关闭图标 | Vant |
| closeIcon / closeIconPosition | 关闭图标定制 | Vant / uView |
| beforeClose | 关闭前拦截 | Vant / Element Plus |
| lazyRender | 未打开不渲染 default slot | Vant |
| destroyOnClose | 关闭后销毁 slot 内容 | Element Plus / Ant Design Mobile |
| width / height | 内容区尺寸（left/right/center） | uView Next |
| customStyle | 内容区自定义样式字符串 | kit-ui 惯例 |
| lockScrollStrategy | `'page-meta' \| 'none'` | uni-ui 经验 |

### 5.4 二期 API（不在 k-popup 一期做）

| 能力 | 说明 |
| --- | --- |
| 命令式 createPopup | 函数式调用，UTS 全局挂载复杂 |
| nested popup 自动叠层 | 需 overlay-stack 完整实现 |
| page-container 内置模式 | nativeMode 封装 |
| swipe-to-close | page-container close-on-slide-down |
| teleport / getContainer | 平台差异大，文档说明即可 |

---

## 6. 关键机制设计

### 6.1 状态机（show 生命周期）

借鉴 Element Plus `use-dialog` 与 Ant Design Mobile `ShouldRender`：

```text
                    ┌──────────┐
         show=true  │  closed  │
        ──────────► │ rendered │──► open event
                    └────┬─────┘
                         │ enter animation
                         ▼
                    ┌──────────┐
                    │  opened  │──► opened event
                    └────┬─────┘
                         │ show=false
                         ▼
                    ┌──────────┐
                    │ closing  │──► close event
                    └────┬─────┘
                         │ leave animation
                         ▼
                    ┌──────────┐
                    │  closed  │──► closed event
                    └──────────┘
                         │
              destroyOnClose=true → 卸载 slot 内容
              lazyRender=true     → 下次 open 才渲染
```

**UTS 实现要点：**

- 用 `closed` / `rendered` / `visible` 三个 boolean 分离「DOM 留存」与「动画可见」
- 遮罩与内容层动画时长可共用 `duration`，P1 可考虑 `overlayDuration` 分离

### 6.2 滚动穿透（lockScroll）

| 平台 | 推荐方案 |
| --- | --- |
| WEB | popup 打开时父容器 `overflow: hidden`（H5 通常可不处理） |
| MP-* / APP | 配合 **`page-meta`** 动态设置 `overflow: hidden` |
| 轨道 B page-container | 原生已处理，k-popup 无需重复 |

**kit-ui 做法：**

- k-popup  emit `update:show` 时，文档要求业务页用 `page-meta` 联动（与 uni-ui 一致）
- 可选提供 **`usePopupScrollLock(show: Ref<boolean>)`** 工具函数（`popup-utils.uts`），减少业务重复代码
- **不在组件内直接操作 page-meta**（一个页面只能有一个 page-meta，组件内嵌会破坏页面结构）

### 6.3 安全区策略

```text
safeAreaInsetBottom 默认值：
  position === 'bottom' || position === 'center' → true
  其余 → false

safeAreaInsetTop 默认值：
  position === 'top' → true
  其余 → false
```

实现：内容区底部/顶部增加 padding，使用 `--k-safe-area-inset-*` CSS 变量（与主题体系一致），APP 读取系统 safe area。

### 6.4 多实例叠层

场景：popup 上再弹 confirm modal。

```text
默认 z-index：$k-z-index-popper (2000)
每次 open 无显式 zIndex 时：nextZIndex() → 2001, 2002...
k-modal 默认：$k-z-index-modal (4000)，保证高于普通 popup
k-loading 全屏：$k-z-index-loading (5000)，最高优先级
```

### 6.5 与 k-modal / k-toast 的边界

| 组件 | 职责 | 与 popup 关系 |
| --- | --- | --- |
| k-popup | 纯容器：位置、遮罩、动效 | 基座 |
| k-modal | 标题 + 内容 + 确认/取消按钮 | 内部 `<k-popup position="center">` + 预设布局 |
| k-toast | 轻量文字、自动消失 | **独立轻量实现**更合适（无需完整 popup 动效）；可复用 k-overlay |
| k-loading | 加载指示 | 已有 overlay 模式，迁移复用 k-overlay |

---

## 7. 文件结构建议（开发阶段参考）

```text
uni_modules/kit-ui/components/
├── k-overlay/
│   ├── k-overlay.uvue
│   ├── overlay.type.uts
│   ├── overlay-utils.uts      # nextZIndex、resolveOverlayColor
│   └── README.md
└── k-popup/
    ├── k-popup.uvue
    ├── popup.type.uts         # PopupPosition、BeforeCloseHandler
    ├── popup-animation.uts    # APP syncVisual / WEB 空实现
    ├── popup-utils.uts        # usePopupScrollLock（文档向工具）
    └── README.md

pages/popup/popup.uvue         # demo：五方向 + 遮罩 + 安全区 + 表单嵌套
```

---

## 8. 取舍决策表（最终结论）

| 能力 | 决策 | 理由 |
| --- | --- | --- |
| position 五方向 | ✅ 一期 P0 | 行业标准，page-container 原生支持 |
| overlay 遮罩 | ✅ 一期 P0 | 基础能力 |
| round 圆角 | ✅ 一期 P0 | 移动端底部面板刚需 |
| safeArea | ✅ 一期 P0 | uni-app 核心差异 |
| closeable 关闭图标 | ✅ 一期 P1 | 低成本高价值 |
| beforeClose | ✅ 一期 P1 | 表单未保存拦截场景 |
| lazyRender / destroyOnClose | ✅ 一期 P1 | 性能与内存 |
| 独立 k-overlay | ✅ 同批交付 | 消除 loading 重复 |
| page-container 模式 | 📋 文档 + 二期 | 降低一期复杂度 |
| dialogPage | 📋 文档示例 | 非组件职责 |
| Teleport | ❌ 不实现 | uni-app x 跨端不一致 |
| blur 背景 | ❌ 不实现 | APP 不支持 |
| draggable | ❌ 二期也不做 | 性价比低 |
| 命令式 API | ❌ 留给 toast | UTS 全局挂载复杂 |
| lock-scroll 组件内嵌 page-meta | ❌ | 破坏页面结构 |

---

## 9. Demo 页规划（分析预留）

| 区块 | 验证点 |
| --- | --- |
| 基础用法 | 五方向打开关闭 |
| 遮罩控制 | 无遮罩、自定义透明度、点击不关闭 |
| 圆角与安全区 | bottom + round + safeArea |
| 关闭拦截 | beforeClose 返回 false |
| 嵌套场景 | popup 内 k-form 提交 |
| 组合预览 | 说明 k-modal / page-container / dialogPage 选型（静态文案） |
| 边界 | 连续快速开关、destroyOnClose |

---

## 10. 风险清单与验证计划

| 风险 | 等级 | 验证方式 |
| --- | --- | --- |
| APP 端 transform 动画不生效 | 🔴 高 | 首个 PR 即跑 APP 五方向冒烟 |
| 小程序 scroll 穿透 | 🟠 中 | MP 真机 + page-meta 文档示例 |
| 多 popup z-index 遮挡 | 🟠 中 | demo 嵌套打开 |
| beforeClose Promise APP 编译 | 🟡 中 | UTS 编译门禁 |
| safeArea 双重留白 | 🟡 中 | iPhone 刘海机 + bottom 面板 |
| k-loading z-index 冲突 | 🟡 中 | loading + popup 同屏 |

---

## 11. 开发顺序建议（分析结论，非执行）

```text
Step 0：overlay-stack.uts + k-overlay（半日）
Step 1：k-popup 静态布局 + 无动画 show/hide（半日）
Step 2：WEB/MP CSS 动效（1 日）
Step 3：APP ref 动效（1 日，关键路径）
Step 4：P1 能力 + demo + 三端冒烟（1 日）
Step 5：文档三轨策略 + k-modal 设计输入（半日）
```

预估：**2~3 天**（与 `docs/一期下一步开发计划.md` 一致），其中 APP 动效占 30%+ 时间。

---

## 12. 待决策项（开发前需确认）

1. **k-overlay 是否对业务暴露？** 建议暴露（供自定义全屏蒙层），但文档标注「优先用 k-popup」。
2. **center 模式默认是否 zoom？** 建议默认 `true`（uView 惯例），可 prop `zoom` 关闭。
3. **position=left/right 一期是否必做？** 建议做（API 一次到位），demo 可简化为 bottom + center 为主。
4. **是否与 page-container 合并为一个组件？** 建议不合并，保持 k-popup 纯 UI；page-container 作为可选包裹层文档化。

---

## 13. 相关文档

| 文档 | 用途 |
| --- | --- |
| `docs/一期下一步开发计划.md` | 迭代排期 |
| `docs/k-button双轨策略规范.md` | 三轨策略参考 |
| `.cursor/skills/kit-ui-app-animation/SKILL.md` | APP 动效 |
| `.cursor/skills/kit-ui-uts-app-compat/SKILL.md` | UTS 编译 |
| [uni-app x page-container](https://doc.dcloud.net.cn/uni-app-x/component/page-container.html) | 原生返回拦截 |
| [uni-app x dialogPage](https://doc.dcloud.net.cn/uni-app-x/api/dialog-page.html) | 全屏弹层 API |
| [Vant 4 Popup](https://vant-ui.github.io/vant/#/zh-CN/popup) | 移动端 API 参考 |
