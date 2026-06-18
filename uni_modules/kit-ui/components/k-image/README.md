# k-image 图片组件

基于原生 `image` 封装的增强图片组件，提供占位符、加载/错误状态、备用图、遮罩与预览等能力。

## 基础用法

请使用绝对路径或网络图片地址。

```vue
<k-image src="https://picsum.photos/200/200" width="200px" height="200px" />
<k-image src="https://picsum.photos/200/200" width="200px" height="200px" shape="round" radius="12px" />
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" shape="circle" />
```

## 填充模式

通过 `mode` 控制图片裁剪与缩放，完整取值见下方 Mode 说明。

```vue
<k-image src="https://picsum.photos/300/200" width="100px" height="100px" mode="aspectFill" />
```

## 加载状态

设置 `src` 后，图片加载期间自动展示加载态，无需额外开关。

```vue
<!-- 默认旋转图标 -->
<k-image src="https://picsum.photos/800/800" width="100px" height="100px" />

<!-- 使用 k-loading 动画 -->
<k-image
  src="https://picsum.photos/800/800"
  width="100px"
  height="100px"
  loading-type="spinner"
  loading-color="primary"
/>
```

## 错误处理

加载失败时自动展示错误态；可通过 `fallback-src` 依次尝试备用地址。

```vue
<k-image
  src="https://invalid-url.com/image.jpg"
  width="100px"
  height="100px"
  error-text="加载失败"
/>

<k-image
  src="https://invalid-url.com/image.jpg"
  :fallback-src="['https://picsum.photos/200/200']"
  width="100px"
  height="100px"
/>
```

## 占位符

`src` 为空时自动展示占位符。

```vue
<k-image width="100px" height="100px" />
<k-image width="100px" height="100px" placeholder-text="暂无图片" />
<k-image width="100px" height="100px" placeholder-icon="image-fill" placeholder-icon-color="#6366f1" />
```

## 遮罩层

```vue
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" show-mask />

<k-image
  src="https://picsum.photos/200/200"
  width="100px"
  height="100px"
  show-mask
  mask-color="#6366f1"
  :mask-opacity="0.4"
>
  <template #mask>
    <view><!-- 自定义遮罩内容 --></view>
  </template>
</k-image>
```

## 懒加载

```vue
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" lazy />
```

## 点击预览

开启 `preview` 后，点击图片触发 `uni.previewImage` 预览。

```vue
<k-image
  src="https://picsum.photos/800/600"
  width="100px"
  height="100px"
  preview
  @click="handleClick"
  @preview="handlePreview"
/>
```

## 禁用状态

```vue
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" preview disabled />
```

## 自定义插槽

| 插槽名 | 说明 |
| --- | --- |
| placeholder | 自定义占位内容，替代默认图标与文案 |
| loading | 自定义加载内容，替代默认 loading 图标或 k-loading |
| error | 自定义错误内容，替代默认错误图标与文案 |
| mask | 遮罩层内容，需配合 `show-mask` 使用 |

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | String | '' | 图片资源地址 |
| mode | String | 'scaleToFill' | 图片裁剪、缩放模式 |
| width | String | null | 容器宽度，支持数值或带单位字符串 |
| height | String | null | 容器高度，支持数值或带单位字符串 |
| shape | String | 'square' | 图片形状：`square` / `round` / `circle` |
| radius | String | '8px' | 圆角大小，仅 `shape="round"` 时生效 |
| lazy | Boolean | false | 是否开启懒加载 |
| fadeShow | Boolean | true | 是否显示淡入动画 |
| webp | Boolean | true | 是否启用 webP |
| show-menu-by-longpress | Boolean | false | 长按是否显示菜单（小程序码识别等） |
| draggable | Boolean | false | 是否可拖拽，仅 WEB 平台 |
| placeholder-text | String | '' | 占位符文案 |
| placeholder-icon | String | 'image-line' | 占位符图标名称 |
| placeholder-icon-size | String | '32' | 占位符图标大小 |
| placeholder-icon-color | String | '#c8c9cc' | 占位符图标颜色 |
| loading-icon | String | 'donut-chart-line' | 加载态图标名称 |
| loading-icon-size | String | '24' | 加载态图标大小 |
| loading-icon-color | String | '#c8c9cc' | 加载态图标颜色 |
| loading-type | String | '' | 加载动画类型，非空时使用 k-loading（如 `spinner`、`dots`） |
| loading-size | String | '24' | k-loading 尺寸 |
| loading-color | String | '#c8c9cc' | k-loading 颜色 |
| error-text | String | '' | 错误态文案 |
| error-icon | String | 'finder-fill' | 错误态图标名称 |
| error-icon-size | String | '32' | 错误态图标大小 |
| error-icon-color | String | '#c8c9cc' | 错误态图标颜色 |
| fallback-src | Array | [] | 备用图片地址列表，主图失败后依次尝试 |
| preview | Boolean | false | 是否开启点击预览 |
| preview-icon | String | 'eye' | 预览按钮图标名称 |
| preview-icon-size | String | '20' | 预览按钮图标大小 |
| preview-icon-color | String | '#ffffff' | 预览按钮图标颜色 |
| show-mask | Boolean | false | 是否显示遮罩层 |
| mask-opacity | Number | 0.3 | 遮罩层透明度 |
| mask-color | String | '#000000' | 遮罩层颜色 |
| disabled | Boolean | false | 是否禁用点击与预览 |

## 组件事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击图片容器时触发 | - |
| load | 图片加载完成时触发 | event |
| error | 图片加载失败且备用图均无效时触发 | event |
| preview | 预览成功时触发 | src |

## Mode 值说明

| 值 | 说明 |
| --- | --- |
| scaleToFill | 不保持纵横比，拉伸填满容器 |
| aspectFit | 保持纵横比，完整显示图片 |
| aspectFill | 保持纵横比，短边填满容器 |
| widthFix | 宽度不变，高度自适应 |
| heightFix | 高度不变，宽度自适应 |
| top | 裁剪，仅显示顶部 |
| bottom | 裁剪，仅显示底部 |
| center | 裁剪，仅显示中间 |
| left | 裁剪，仅显示左侧 |
| right | 裁剪，仅显示右侧 |
| top left | 裁剪，仅显示左上 |
| top right | 裁剪，仅显示右上 |
| bottom left | 裁剪，仅显示左下 |
| bottom right | 裁剪，仅显示右下 |

## 使用注意

1. **状态自动控制**：占位符、加载态、错误态由组件内部根据 `src` 与加载结果自动切换，无需 `show-loading` 等开关属性。
2. **备用图**：`fallback-src` 为数组，主图和所有备用图均失败后才会进入错误态并触发 `error` 事件。
3. **预览**：`preview` 为 `true` 时点击图片会调用 `uni.previewImage`；预览图标仅在 WEB 端 hover 时显示。
4. **禁用**：`disabled` 为 `true` 时不会触发 `click` 与预览。
5. **平台差异**：`draggable` 仅 WEB 平台生效；`show-menu-by-longpress` 主要用于小程序场景。

## 样式定制

组件提供以下 CSS 类名供覆盖：

```css
.k-image { /* 容器 */ }
.k-image__img { /* 图片元素 */ }
.k-image__placeholder { /* 占位符 */ }
.k-image__loading { /* 加载态 */ }
.k-image__error { /* 错误态 */ }
.k-image__mask { /* 遮罩层 */ }
.k-image__preview-icon { /* 预览按钮 */ }
```

## 演示页

- 图片示例：`pages/image/image`
