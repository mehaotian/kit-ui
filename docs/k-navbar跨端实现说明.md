# k-navbar 跨端实现说明

> 版本：v1（v1.1 2026-06-29 复验）  
> 日期：2026-06-29  
> 状态：三端验收通过，与代码一致  
> 关联：`uni_modules/kit-ui/components/k-navbar/README.md`、`docs/k-navbar开发计划.md`

---

## 1. 架构分层

```text
k-navbar (k-navbar.uvue)
  ├── navbar-utils.uts   布局计算、fixed 门控、胶囊公式
  ├── navbar.type.uts    NavbarLayout 类型
  └── 结构：
        [placeholder]  fixed 时占位块
        k-navbar__wrap
          ├── k-navbar__status   状态栏（仅页面级顶栏）
          └── k-navbar__bar      左 | 中 | 右 三列 flex
```

**设计原则**：布局计算与渲染分离；`fixed + safeAreaInsetTop` 才走页面级顶栏逻辑。

---

## 2. 页面级 vs 内嵌

| 模式 | 条件 | 状态栏 | 胶囊避让 | 内容高度 |
| --- | --- | --- | --- | --- |
| 页面级顶栏 | `fixed && safeAreaInsetTop` | 是 | MP 是 | MP 与胶囊对齐 / 其它 44px |
| 内嵌示例 | `fixed=false` | 否 | 否 | 固定 44px |

`isPageNavLayout(fixed, safeAreaInsetTop)` 为唯一门控，避免 demo 卡片内误套胶囊宽度。

---

## 3. 标题居中策略

### 3.1 页面级顶栏（`fixed && safeAreaInsetTop`）

对齐原生 navbar：**标题相对整屏宽度居中**，而非 flex 中间列居中。

```text
k-navbar__bar (relative)
  ├── k-navbar__title--screen-center   absolute 全宽 overlay，pointer-events: none
  ├── k-navbar__left                   z-index: 2，padding-left，内容自适应宽度
  └── k-navbar__right                  z-index: 2，padding-right（含胶囊避让），margin-left: auto
```

- 标题 `text-align: center` 作用于整栏宽度，短标题视觉与系统导航栏一致
- 左右操作不对称时（如左箭头 + 右「说明」+ 胶囊），通过 `estimateTitleSafePadding()` 取左右占用较大值作为**对称** padding，长标题 ellipsis 时不压住按钮且仍保持屏幕居中

### 3.2 内嵌示例（`:fixed="false"`）

三列 flex：左 / 中 / 右固定 `sideWidth`，标题在中间列居中。卡片内无需整屏居中。

---

## 4. 小程序胶囊（MP-WEIXIN）

### 4.1 计算公式

```text
statusBarHeight  ← getWindowInfo().safeAreaInsets / statusBarHeight
contentHeight    ← (capsule.top - statusBar) × 2 + capsule.height
rightInset       ← windowWidth - capsule.left + MP_CAPSULE_CONTENT_GAP(10)
```

### 4.2 限制

- 仅 `#ifdef MP-WEIXIN`；支付宝等 MP 一期走 APP 逻辑（16px 内边距）
- 部分安卓机型 `getMenuButtonBoundingClientRect` 有误差，依赖 `onWindowResize` 重算
- custom 页须在 `pages.json` 设 `navigationStyle: custom`

---

## 5. 窗口尺寸变化

| 端 | 实现 |
| --- | --- |
| WEB / 微信 MP | `onMounted` 注册 `uni.onWindowResize` → `syncNavbarLayout()`；`onUnmounted` 注销 |
| APP | **不使用** `onWindowResize`（UTS/Kotlin 不支持该 API）；依赖 `onMounted` + props `watch`；横竖屏后可调用 `syncLayout()` |

```uts
// #ifndef APP
uni.onWindowResize(handler)
// #endif
```

---

## 6. 主题与颜色

| 场景 | 实现 |
| --- | --- |
| 默认标题/左色 | CSS `--k-navbar-title-color` / `--k-text-color-primary` |
| 默认右色 | `--k-navbar-right-color` / `--k-text-color-primary` |
| props 自定义色 | 内联 `color` 覆盖 |
| k-icon 箭头 | `resolvePrimaryTextColor(themeConfig)` 实色传入 |

根节点 `--k-navbar-content-height`、`--k-navbar-side-width` 随测量动态更新。

---

## 7. 交互边界

| 项 | 行为 |
| --- | --- |
| 无左侧内容 | 不触发 `click-left` / `navigateBack` |
| 无右侧内容 | 不触发 `click-right` |
| `autoBack` + 无历史栈 | `getCurrentPages().length <= 1` 时不调用 `navigateBack` |
| `disabled` | 左右点击均拦截，opacity 0.6 |
| `leftArrow + leftText` | 箭头与文字横向排列，间距 4px |

---

## 8. 一期已知限制

| 项 | 说明 |
| --- | --- |
| 搜索栏内嵌 | 二期 |
| 透明 / 沉浸顶栏 | 二期 |
| 仅 MP-WEIXIN 胶囊 | 其它 MP 未单独适配 |
| size 阶梯 | 一期固定 44px 内容区 |

---

## 9. 维护者自检

改动布局 / 胶囊 / fixed 门控后：

1. `kit-ui-cross-platform-check`（grid/gap/@media）
2. `kit-ui-uts-app-compat`（getCurrentPages、defineExpose；APP 勿用 onWindowResize）
3. 微信全量编译，对照 `docs/k-navbar三端冒烟验收清单.md`
4. 验证 `:fixed="false"` 内嵌 demo 无状态栏空白
