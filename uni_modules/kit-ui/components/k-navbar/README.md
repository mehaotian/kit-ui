# k-navbar 导航栏

页面级顶部导航栏，适用于 `navigationStyle: custom` 场景。内置状态栏安全区适配，**微信小程序自动避让右侧胶囊**。

> v1 范围：fixed/placeholder、三列布局、leftArrow+leftText、disabled、主题色、窗口 resize 重算。不含搜索栏/透明沉浸（见 `docs/k-navbar开发计划.md` §1.3）。

## 基础用法

页面 `pages.json` 需关闭系统导航栏：

```json
{
  "path": "pages/order/detail",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": ""
  }
}
```

```vue
<k-navbar title="订单详情" fixed placeholder />
```

内嵌演示（卡片内展示）使用 `:fixed="false"`，不会套用状态栏与胶囊逻辑。

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | string | '' | 标题文案；超出中间区域时单行省略（`…`） |
| leftText | string | '' | 左侧文字，可与 leftArrow 同时显示 |
| leftArrow | boolean | true | 是否显示返回箭头 |
| rightText | string | '' | 右侧文字 |
| fixed | boolean | false | 是否固定在顶部 |
| placeholder | boolean | false | fixed 时是否渲染占位块（需配合 fixed） |
| safeAreaInsetTop | boolean | true | 是否预留状态栏；**仅 fixed=true 时生效** |
| border | boolean | true | 底部分割线 |
| disabled | boolean | false | 禁用，左右操作不可点 |
| zIndex | number | 100 | fixed 时层级 |
| background | string | '' | 背景色，空则 `--k-bg-color` |
| titleColor | string | '' | 标题色，空则主题主文字色 |
| leftColor | string | '' | 左侧色，空则主题主文字色 |
| rightColor | string | '' | 右侧色，空则与标题同色（主文字色） |
| autoBack | boolean | true | 点击左侧是否 `navigateBack`（无历史栈时不调用） |
| delta | number | 1 | 返回层数 |
| customStyle | string | '' | 根节点内联样式 |
| customClass | string | '' | 根节点类名 |

## Slots

| 名称 | 说明 |
| --- | --- |
| left | 自定义左侧 |
| title | 自定义标题 |
| right | 自定义右侧 |

左侧默认：`slot left` > `leftArrow` + `leftText` 组合 > 仅箭头。

## Events

| 事件 | 说明 |
| --- | --- |
| click-left | 点击左侧（有内容且非 disabled） |
| click-right | 点击右侧（有内容且非 disabled） |

## 暴露方法

| 名称 | 说明 |
| --- | --- |
| getNavbarHeight() | 当前导航栏总高度（px，含状态栏） |
| syncLayout() | 手动重算布局（一般无需调用） |

## 主题变量

根节点注入：

| 变量 | 说明 |
| --- | --- |
| `--k-navbar-content-height` | 内容区高度（动态，MP fixed 时与胶囊对齐） |
| `--k-navbar-side-width` | 左右操作区宽度 |
| `--k-navbar-title-color` | 标题色（可被 titleColor 覆盖） |
| `--k-navbar-left-color` | 左侧文字色 |
| `--k-navbar-right-color` | 右侧文字色 |

## 小程序胶囊避让

**仅 `fixed` + `safeAreaInsetTop`（页面级 custom 顶栏）时启用**。

- 导航内容区高度与胶囊垂直对齐
- `padding-right = windowWidth - capsule.left + 10px`
- 标题 absolute 全宽 overlay，相对**整屏**居中（与原生 navbar 一致）
- 仅 `#ifdef MP-WEIXIN`；其他端走 APP/WEB 逻辑

详见 `docs/k-navbar跨端实现说明.md`。

## 演示页

- 基础：`pages-demo/navbar/navbar.uvue`
- 组合：`pages-demo/navbar-composite/navbar-composite.uvue`（navbar + tabs + list）

## 注意事项

1. `placeholder` 仅在与 `fixed` 组合时有意义。
2. 内嵌 `:fixed="false"` 时固定 44px，无状态栏/胶囊。
3. 无右侧内容时点击右侧不会触发 `click-right`。
4. fixed 顶栏标题相对**整屏**居中；内嵌 demo 为 flex 中间列居中。
5. 标题过长时单行省略（`overflow` + `max-lines`）；演示见「长标题省略」区块。
6. WEB / 微信 MP 横竖屏切换时通过 `uni.onWindowResize` 自动重算；APP 请按需调用 `syncLayout()`。

## 相关文档

- 方案：`docs/k-navbar开发计划.md`
- 跨端：`docs/k-navbar跨端实现说明.md`
- 验收：`docs/k-navbar三端冒烟验收清单.md`
