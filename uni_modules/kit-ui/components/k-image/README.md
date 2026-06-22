# k-image 图片组件

用于展示图片，支持多种形状、填充模式、加载与错误提示、备用图、遮罩及点击预览。

## 基础用法

通过 `src` 设置图片地址，支持网络图片和本地路径；通过 `width`、`height` 设置尺寸。

```vue
<k-image src="https://picsum.photos/200/200" width="200px" height="200px" />
```

## 图片形状

支持方形、圆角和圆形，圆角大小通过 `radius` 调整（仅 `shape="round"` 时生效）。

```vue
<!-- 方形（默认） -->
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" />

<!-- 圆角 -->
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" shape="round" radius="12px" />

<!-- 圆形，常用于头像 -->
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" shape="circle" />
```

## 填充模式

通过 `mode` 控制图片在容器内的裁剪与缩放方式，常用值如下：

| 值 | 说明 |
| --- | --- |
| scaleToFill | 拉伸填满容器，不保持比例 |
| aspectFit | 保持比例，完整显示图片 |
| aspectFill | 保持比例，短边填满容器（常用） |
| widthFix | 宽度固定，高度自适应 |
| heightFix | 高度固定，宽度自适应 |

```vue
<k-image src="https://picsum.photos/300/200" width="100px" height="100px" mode="aspectFill" />
```

完整取值见下方「mode 取值说明」。

## 加载提示

传入 `src` 后，图片加载过程中会自动显示加载提示，可自定义图标或动画样式。

```vue
<!-- 默认加载图标 -->
<k-image src="https://picsum.photos/800/800" width="100px" height="100px" />

<!-- 自定义加载动画 -->
<k-image
  src="https://picsum.photos/800/800"
  width="100px"
  height="100px"
  loading-type="spinner"
  loading-color="primary"
/>
```

`loading-type` 可选值：`spinner`、`dots`、`bands`、`wave`、`pulse`。

## 加载失败

加载失败时自动显示错误提示，可设置文案和图标；也可配置备用图片，主图失败后依次尝试。

```vue
<!-- 显示错误文案 -->
<k-image
  src="https://invalid-url.com/image.jpg"
  width="100px"
  height="100px"
  error-text="加载失败"
/>

<!-- 使用备用图片 -->
<k-image
  src="https://invalid-url.com/image.jpg"
  :fallback-src="['https://picsum.photos/200/200']"
  width="100px"
  height="100px"
/>
```

## 占位符

未设置 `src` 时显示占位内容，可自定义文案和图标。

```vue
<k-image width="100px" height="100px" />
<k-image width="100px" height="100px" placeholder-text="暂无图片" />
<k-image width="100px" height="100px" placeholder-icon="image-fill" placeholder-icon-color="#6366f1" />
```

## 遮罩层

在图片上方叠加半透明遮罩，适合展示状态标签或操作提示。

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
    <view><!-- 遮罩上的自定义内容 --></view>
  </template>
</k-image>
```

## 懒加载

开启后，图片进入可视区域才开始加载，适合长列表场景。

```vue
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" lazy />
```

## 点击预览

开启 `preview` 后，点击图片即可全屏预览。

```vue
<k-image
  src="https://picsum.photos/800/600"
  width="100px"
  height="100px"
  preview
  @preview="onPreview"
/>
```

## 点击事件

未开启 `preview` 时，可通过 `@click` 监听点击；也可配合 `@load`、`@error` 处理加载结果。

```vue
<k-image
  src="https://picsum.photos/200/200"
  width="100px"
  height="100px"
  @click="onClick"
  @load="onLoad"
  @error="onError"
/>
```

## 禁用

禁用后无法点击，也无法预览。

```vue
<k-image src="https://picsum.photos/200/200" width="100px" height="100px" disabled />
```

## 自定义内容

可通过插槽替换默认的占位、加载、错误和遮罩内容。

| 插槽名 | 说明 |
| --- | --- |
| placeholder | 占位内容 |
| loading | 加载提示内容 |
| error | 错误提示内容 |
| mask | 遮罩层内容，需配合 `show-mask` |

```vue
<k-image width="100px" height="100px">
  <template #placeholder>
    <text>自定义占位</text>
  </template>
</k-image>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | String | '' | 图片地址 |
| mode | String | 'scaleToFill' | 填充模式 |
| width | String | - | 宽度，如 `100px`、`100` |
| height | String | - | 高度，如 `100px`、`100` |
| shape | String | 'square' | 形状：`square` / `round` / `circle` |
| radius | String | '8px' | 圆角，仅 `round` 时生效 |
| lazy | Boolean | false | 是否懒加载 |
| fade-show | Boolean | true | 是否淡入显示 |
| webp | Boolean | true | 是否启用 webP |
| show-menu-by-longpress | Boolean | false | 长按是否弹出菜单 |
| draggable | Boolean | false | 是否可拖拽（WEB 端） |
| placeholder-text | String | '' | 占位文案 |
| placeholder-icon | String | 'image-line' | 占位图标 |
| placeholder-icon-size | String | '32' | 占位图标大小 |
| placeholder-icon-color | String | '#c8c9cc' | 占位图标颜色 |
| loading-icon | String | 'donut-chart-line' | 加载图标 |
| loading-icon-size | String | '24' | 加载图标大小 |
| loading-icon-color | String | '#c8c9cc' | 加载图标颜色 |
| loading-type | String | '' | 加载动画类型，见「加载提示」 |
| loading-size | String | '24' | 加载动画大小 |
| loading-color | String | '#c8c9cc' | 加载动画颜色 |
| error-text | String | '' | 错误文案 |
| error-icon | String | 'finder-fill' | 错误图标 |
| error-icon-size | String | '32' | 错误图标大小 |
| error-icon-color | String | '#c8c9cc' | 错误图标颜色 |
| fallback-src | Array | [] | 备用图片地址列表 |
| preview | Boolean | false | 是否点击预览 |
| show-mask | Boolean | false | 是否显示遮罩 |
| mask-opacity | Number | 0.3 | 遮罩透明度，0 ~ 1 |
| mask-color | String | '#000000' | 遮罩颜色 |
| disabled | Boolean | false | 是否禁用 |

## 组件事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击图片时触发 | - |
| load | 图片加载成功 | event |
| error | 图片加载失败 | event |
| preview | 预览打开成功 | 图片地址 |

## mode 取值说明

| 值 | 说明 |
| --- | --- |
| scaleToFill | 拉伸填满，不保持比例 |
| aspectFit | 保持比例，完整显示 |
| aspectFill | 保持比例，短边填满 |
| widthFix | 宽度固定，高度自适应 |
| heightFix | 高度固定，宽度自适应 |
| top | 裁剪，显示顶部 |
| bottom | 裁剪，显示底部 |
| center | 裁剪，显示中间 |
| left | 裁剪，显示左侧 |
| right | 裁剪，显示右侧 |
| top left | 裁剪，显示左上 |
| top right | 裁剪，显示右上 |
| bottom left | 裁剪，显示左下 |
| bottom right | 裁剪，显示右下 |

## 使用注意

1. **图片地址**：支持网络 URL 和本地绝对路径。
2. **备用图**：`fallback-src` 传入地址数组，按顺序依次尝试，全部失败后才显示错误态。
3. **预览与点击**：开启 `preview` 后，点击只触发 `@preview`，不触发 `@click`；需要自定义点击逻辑时不要同时开启 `preview`。
4. **禁用**：`disabled` 为 `true` 时，点击和预览均无效。
5. **平台差异**：`draggable` 仅在 WEB 端生效；`show-menu-by-longpress` 主要用于小程序。

## 演示页

- 图片示例：演示各场景用法
