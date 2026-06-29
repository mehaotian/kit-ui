# k-navbar 开发计划（属性与设计）

> 版本：v1.0  
> 日期：2026-06-29  
> 状态：**v1 已验收收尾（2026-06-29，v1.1 三端复验通过）** — 见 `docs/k-navbar三端冒烟验收清单.md`、`docs/k-navbar跨端实现说明.md`  
> 前置：`k-tabs` v1 已验收（`docs/k-tabs三端冒烟验收清单.md`）  
> 关联：`docs/一期下一步开发计划.md`、`docs/k-tabbar二期规划备忘.md`

---

## 1. 背景与定位

### 1.1 为什么 k-navbar 是迭代 3 的收尾项

顶部导航栏是移动端 **页面级导航** 的基础能力，典型场景：

- 二级页标题 + 返回上一页
- 列表详情页右侧「分享 / 更多」操作
- 与 `k-tabs` 组合：顶栏固定 + 下方 Tab 分区 + `k-list` 承载内容

与 `k-tabs`（页内分区）、原生 `tabBar`（应用级底栏，**二期**）职责划分：

```text
k-navbar         页面标题 / 返回 / 左右操作（需 navigationStyle: custom）
k-tabs           同页内容分区切换
k-list / k-cell  分区下的列表承载
原生 tabBar      pages.json 配置，一期不封装 k-tabbar
```

### 1.2 设计原则（对齐 kit-ui 既有组件）

| 原则 | 说明 |
| --- | --- |
| 单组件交付 | 一期仅 `k-navbar`，不拆 left/right 子组件 |
| 安全区优先 | 顶部 padding 复用 `uni.getWindowInfo()` + `readToastSafeAreaInsets` 同类逻辑 |
| 主题一致 | 主色 `#6366f1`，走 `--k-*` 与 `buildThemeStyle` |
| 与 k-icon 联动 | 返回 / 关闭 / 右侧操作统一 `k-icon` |
| 样式红线 | 无 `grid` / `gap` / `@media`；标题与按钮文案样式写在 `text` / `button` |
| 演示页规范 | 使用 `navigationStyle: custom` 展示真实顶栏场景 |

### 1.3 一期非目标（明确边界）

- **不实现** `k-tabbar` / `k-tabbar-item`（二期，见 `docs/k-tabbar二期规划备忘.md`）
- **不实现** 搜索框内嵌模式（`search` prop，二期或与 `k-input` 组合示例）
- **不实现** 大标题折叠（`large-title` 随滚动缩放，二期）
- **不实现** 多层级面包屑（`k-breadcrumb` 为二期）
- **不封装** 系统默认导航栏（继续用 `pages.json` `navigationBarTitleText`）
- **不实现** `k-safe-area` 独立组件（navbar 内置 safeAreaInsetTop 即可）

---

## 2. 竞品 API 参考（取舍依据）

| 库 | 值得借鉴 | 一期不跟 |
| --- | --- | --- |
| Vant NavBar | `title` / `left-arrow` / `fixed` / `placeholder` | 过度 props |
| uView Navbar | 沉浸式、背景渐变 | 渐变与 blur 二期 |
| uni-ui NavBar | 状态栏高度适配 | 直接抄 API 命名 |
| Ant Design Mobile NavBar | `back` 文案 + 图标 | 复杂 back 层级 |

**kit-ui 一期收敛**：标题 + 返回 + 左右 slot + fixed/placeholder + 安全区 + 边框，覆盖 80% 二级页场景。

---

## 3. 组件结构

```text
k-navbar
├── [fixed 时] k-navbar__placeholder（占位，高度 = 安全区 + 导航栏）
└── k-navbar__bar（flex 行）
    ├── k-navbar__left（返回箭头 / leftText / slot left）
    ├── k-navbar__title（title / slot title）
    └── k-navbar__right（rightText / slot right）
```

导航栏内容区默认高度 **44px**（不含状态栏），与 iOS 人机指南一致。

---

## 4. k-navbar Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 标题文案 |
| `leftText` | `string` | `''` | 左侧文字（与 leftArrow 二选一展示） |
| `leftArrow` | `boolean` | `true` | 是否显示返回箭头 |
| `rightText` | `string` | `''` | 右侧文字 |
| `fixed` | `boolean` | `false` | 是否固定在顶部 |
| `placeholder` | `boolean` | `false` | fixed 时是否渲染占位（防内容被遮挡） |
| `safeAreaInsetTop` | `boolean` | `true` | 是否加上状态栏 / 刘海区 padding |
| `border` | `boolean` | `true` | 底部分割线 |
| `zIndex` | `number` | `100` | 层级（fixed 时生效） |
| `background` | `string` | `''` | 背景色，空则 `--k-bg-color` |
| `titleColor` | `string` | `''` | 标题色，空则 `--k-text-color-primary` |
| `leftColor` | `string` | `''` | 左侧色，空则 `--k-text-color-primary` |
| `rightColor` | `string` | `''` | 右侧色，空则 `--k-text-color-primary` |
| `autoBack` | `boolean` | `true` | 点击左侧时是否自动 `uni.navigateBack` |
| `delta` | `number` | `1` | `navigateBack` 层数 |
| `customStyle` | `string` | `''` | 根节点内联样式 |
| `customClass` | `string` | `''` | 根节点类名 |

### 4.1 Props 设计说明

**`fixed` + `placeholder`**

- `fixed=false`：随文档流，适合 demo 区块内嵌展示
- `fixed=true` + `placeholder=true`：真实业务页（内容从顶栏下方开始）
- demo 页可同时展示两种模式

**`leftArrow` + `leftText` + slot `left`**

- 优先级：`slot left` > `leftText` > `leftArrow`（仅箭头）
- `leftArrow=true` 且无任何 left 内容时，显示 `arrow-left-s-line` 类图标

**`autoBack`**

- `true`：emit `click-left` 后执行 `uni.navigateBack({ delta })`（无栈时静默失败或 toast，需三端验证）
- `false`：仅 emit，由业务自行路由

**安全区**

- `safeAreaInsetTop` **仅在 `fixed=true` 时生效**；内嵌 `:fixed="false"` 示例始终为 44px 标准高度
- 复用 `readNavbarLayout(fixed, safeAreaInsetTop)`，避免 demo 卡片内误套胶囊宽度

---

## 5. Slots

| 名称 | 说明 |
| --- | --- |
| `left` | 自定义左侧区域 |
| `title` | 自定义标题（如图片 Logo） |
| `right` | 自定义右侧（如图标组） |

---

## 6. Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `click-left` | — | 点击左侧区域 |
| `click-right` | — | 点击右侧区域 |

---

## 7. 视觉设计

### 7.1 尺寸

| 项 | 值 |
| --- | --- |
| 内容区高度 | 44px |
| 左右区内边距 | 16px |
| 标题字号 | 16px，加粗 |
| 左右文字字号 | 14px |
| 返回图标 | 20px（`k-icon` size） |
| 底部分割线 | 1px `--k-border-color-light` |

### 7.2 布局

- 根容器 `display: flex; flex-direction: column`
- `__bar` 为横向 flex：`left` / `title` / `right` 三区
- `title` 区 `flex: 1`，文字居中；左右区 `flex-shrink: 0`
- 左右区间距用 **margin**，不用 gap

### 7.3 暗色主题

- 背景、文字、边框均走 `--k-*` 变量，不写死暗色分支

---

## 8. 跨端注意事项

| 端 | 要点 |
| --- | --- |
| APP | `getWindowInfo().safeAreaInsets`；fixed 用 `position: fixed; top: 0; left: 0; right: 0` |
| WEB | demo 页保留系统 nav 时内嵌模式为主；另开「全屏 custom」示例需 `pages.json` 设 `navigationStyle: custom` |
| 微信 MP | custom 导航页须在 `pages.json` 声明；通过 `getMenuButtonBoundingClientRect` 避让胶囊，见组件 README |

**pages.json 示例（组合 demo 页）**：

```json
{
  "path": "navbar-composite/navbar-composite",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": ""
  }
}
```

---

## 9. 演示页规划

### 9.1 `pages-demo/navbar/navbar.uvue`（基础）

| 区块 | 内容 |
| --- | --- |
| 基础用法 | title + leftArrow |
| 左右文字 | leftText / rightText |
| 长标题省略 | 单行 ellipsis + 左右操作区示例 |
| 自定义 slot | title 插槽、right 双图标 |
| 无返回 | leftArrow=false |
| 禁用 autoBack | 自定义 click-left 逻辑 |
| 边框 / 背景 | border=false、自定义 background |
| fixed + placeholder | 区块内模拟（或跳转 composite 页） |

### 9.2 `pages-demo/navbar-composite/navbar-composite.uvue`（组合，迭代 3 DoD）

| 区块 | 内容 |
| --- | --- |
| 顶栏 + Tabs | `k-navbar` fixed + `k-tabs` line |
| 列表页 | 某 Tab 下挂 `k-list` + `k-cell` + `k-load-more` |
| 滚动 | APP 用 `#ifdef APP` 包裹 `scroll-view` |

---

## 10. 开发任务拆分（预估 2 天）

| 阶段 | 任务 | 预估 |
| --- | --- | --- |
| D1 上午 | 目录脚手架、`navbar-utils.uts` 安全区、基础布局 + title/arrow | 0.5d |
| D1 下午 | fixed/placeholder、slot、主题变量、事件与 autoBack | 0.5d |
| D2 上午 | navbar + navbar-composite 演示页、`pages.json` custom 配置 | 0.5d |
| D2 下午 | README、三端冒烟、`docs/k-navbar三端冒烟验收清单.md` | 0.5d |

---

## 11. 风险与待评审项

| ID | 问题 | 建议 | 决策 |
| --- | --- | --- | --- |
| N-01 | WEB demo 双顶栏 | 基础 demo 用非 fixed；composite 页 custom | 待开发确认 |
| N-02 | navigateBack 无历史栈 | click-left 仍 emit；back 失败不抛错 | 一期静默 |
| N-03 | 是否抽 `k-safe-area` | navbar 内置 top inset，不单独建组件 | **一期不抽** |
| N-04 | 与 k-tabs 吸顶联动 | 二期 `k-sticky-tabs` | 一期仅组合 demo |
| N-05 | 标题过长省略 | 单行 ellipsis，写在 `text` | 一期实现 |

---

## 12. 验收标准（DoD）

- [x] props / emits / slots 与 README 一致
- [x] `pages-demo/navbar/navbar.uvue` + `pages-demo/navbar-composite/navbar-composite.uvue` 已注册
- [x] navbar + tabs + list 组合 demo 可运行
- [x] WEB / MP / APP 冒烟（见 `docs/k-navbar三端冒烟验收清单.md`）
- [x] 无 grid / gap / @media 红线
- [x] 首页 Navbar 状态更新为 `completed`

---

## 13. v1 收尾记录（2026-06-29）

### 13.1 关键实现决策

| 决策 | 原因 |
| --- | --- |
| `isPageNavLayout` 门控 | 内嵌 demo 不套状态栏/胶囊 |
| fixed 标题整屏居中 | absolute 全宽 overlay，对齐原生 navbar |
| 内嵌三列 flex | `:fixed="false"` 卡片内等宽侧栏，避免 WEB 错乱 |
| `estimateTitleSafePadding` | 长标题 ellipsis 时对称 padding，不压左右按钮 |
| 默认右色 = 主文字色 | 与标题/左侧一致，避免默认主题蓝突兀 |
| `leftArrow + leftText` | 常见「← 返回」组合 |
| `onWindowResize` 重算 | WEB/MP 横竖屏；APP 用 `syncLayout()` 手动重算 |
| `getCurrentPages` 守卫 | 无栈时不 navigateBack |
| `MP_CAPSULE_CONTENT_GAP=10` | 右侧内容与胶囊间距 |

### 13.3 v1.1 验收补丁（2026-06-29）

| 项 | 变更 |
| --- | --- |
| 标题居中 | fixed 顶栏改为 absolute 整屏居中（MP 右侧有按钮时不再偏左） |
| 长标题 | 演示页新增「长标题省略」；`overflow` + `max-lines` + APP `lines:1` |
| 右侧默认色 | `resolvePrimaryTextColor`，三端统一黑色系 |
| 三端验收 | WEB / APP / 微信 MP 冒烟通过，见验收清单 §3～§4 |

### 13.2 相关文件

| 路径 | 说明 |
| --- | --- |
| `uni_modules/kit-ui/components/k-navbar/k-navbar.uvue` | 主组件 |
| `uni_modules/kit-ui/components/k-navbar/navbar-utils.uts` | 布局计算 |
| `uni_modules/kit-ui/components/k-navbar/navbar.type.uts` | 类型 |
| `uni_modules/kit-ui/components/k-navbar/README.md` | 组件文档 |
| `pages-demo/navbar/navbar.uvue` | 基础演示 |
| `pages-demo/navbar-composite/navbar-composite.uvue` | 组合演示 |
| `docs/k-navbar跨端实现说明.md` | 跨端维护说明 |
| `docs/k-navbar三端冒烟验收清单.md` | 验收记录 |

---

## 14. 迭代 3 收尾后

- 迭代 3 标记 **已完成**，进入迭代 4（`k-swiper` 可与 navbar 收尾并行启动）
- 同步：`docs/一期下一步开发计划.md`、`docs/一期组件迭代看板.md`、`docs/组件开发清单.md`
