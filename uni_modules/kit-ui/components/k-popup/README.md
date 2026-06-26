# k-popup 弹出层

通用弹出层容器，支持五方向弹出、遮罩、圆角、安全区与生命周期事件。是 `k-modal`、`k-action-sheet` 的底层基座。

## 基础用法

```vue
<k-popup v-model:show="show" position="bottom">
  <text>内容</text>
</k-popup>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show / v-model:show | 是否显示 | `boolean` | `false` |
| position | 弹出位置 | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center'` | `'bottom'` |
| overlay | 是否显示遮罩 | `boolean` | `true` |
| overlayOpacity | 遮罩透明度 | `number` | `0.5` |
| closeOnClickOverlay | 点击遮罩是否关闭 | `boolean` | `true` |
| round | 是否圆角 | `boolean` | `false` |
| duration | 动画时长 ms | `number` | `300` |
| zIndex | 层级，0 为自动分配 | `number` | `0` |
| safeAreaInsetTop | 顶部安全区 | `boolean` | `false` |
| safeAreaInsetBottom | 底部安全区（bottom/center 默认开启） | `boolean` | `false` |
| bgColor | 内容区背景色 | `string` | `'#ffffff'` |
| closeable | 显示关闭图标 | `boolean` | `false` |
| closeIcon | 关闭图标名 | `string` | `'close-line'` |
| closeIconPosition | 关闭图标位置 | `string` | `'top-right'` |
| zoom | center 模式缩放动画 | `boolean` | `true` |
| lazyRender | 未打开不渲染内容 | `boolean` | `true` |
| destroyOnClose | 关闭后销毁内容 | `boolean` | `false` |
| width / height | 内容区尺寸 | `string` | `''` |
| customStyle | 自定义样式 | `string` | `''` |
| bodyPadding | 内容区内边距 CSS 值 | `string` | `'16px'` |
| defaultSafeArea | 是否按 position 应用默认安全区 | `boolean` | `true` |

`defaultSafeArea=false` 用于 center 浮层（如 `k-modal`），避免底部多余 safe-area 空隙。`bodyPadding="0"` 时由子组件自行控制 padding。

## Events

| 事件 | 说明 |
| --- | --- |
| update:show | v-model 同步 |
| open / opened | 打开前 / 动画结束 |
| close / closed | 关闭前 / 动画结束 |
| clickOverlay | 点击遮罩 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 弹层主体 |
| header | 可选头部 |

## Expose

| 方法 | 说明 |
| --- | --- |
| open() | 打开 |
| close() | 关闭 |

## 滚动穿透

MP/APP 需配合页面级 `page-meta` 设置 `overflow: hidden`，参见演示页 `pages/popup/popup.uvue`。

工具函数：`popup-utils.uts` → `resolvePageMetaOverflow(show)`

## 三轨策略

| 场景 | 方案 |
| --- | --- |
| 页面内弹层 | `k-popup`（本组件） |
| 需拦截返回键 | 原生 `page-container` 包裹 + 文档示例 |
| 覆盖 navbar/tabbar | `uni.openDialogPage` + 透明页 |

## 后续完善项

- `beforeClose` 关闭拦截
- `page-container` 内置模式
- 嵌套弹层 z-index 栈增强
