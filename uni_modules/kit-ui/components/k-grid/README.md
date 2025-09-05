# Grid 宫格

宫格可以在水平方向上把页面分隔成等宽度的区块，用于展示内容或进行页面导航。

## 基础用法

通过 `icon` 和 `text` 属性设置宫格内容。

```vue
<template>
  <k-grid>
    <k-grid-item icon="home-line" text="首页" />
    <k-grid-item icon="search-line" text="搜索" />
    <k-grid-item icon="user-line" text="用户" />
    <k-grid-item icon="settings-line" text="设置" />
  </k-grid>
</template>
```

## 自定义列数

默认一行展示四个格子，可以通过 `column` 属性自定义列数。

```vue
<template>
  <k-grid :column="3">
    <k-grid-item icon="image-line" text="图片" />
    <k-grid-item icon="video-line" text="视频" />
    <k-grid-item icon="music-line" text="音乐" />
  </k-grid>
</template>
```

## 正方形格子

设置 `square` 属性后，格子的高度会和宽度保持一致。

```vue
<template>
  <k-grid square>
    <k-grid-item icon="star-line" text="收藏" />
    <k-grid-item icon="heart-line" text="喜欢" />
  </k-grid>
</template>
```

## 格子间距

通过 `gutter` 属性设置格子之间的距离。

```vue
<template>
  <k-grid :gutter="10">
    <k-grid-item icon="mail-line" text="邮件" />
    <k-grid-item icon="phone-line" text="电话" />
  </k-grid>
</template>
```

## 内容横排

将 `direction` 属性设置为 `horizontal`，可以让宫格的内容呈横向排列。

```vue
<template>
  <k-grid direction="horizontal" :column="2">
    <k-grid-item icon="shopping-cart-line" text="购物车" />
    <k-grid-item icon="wallet-line" text="钱包" />
  </k-grid>
</template>
```

## 调换图标和文本位置

设置 `reverse` 属性后，图标和文本的位置会调换。

```vue
<template>
  <k-grid reverse>
    <k-grid-item icon="camera-line" text="相机" />
    <k-grid-item icon="gallery-line" text="相册" />
  </k-grid>
</template>
```

## 页面导航

通过 `to` 或 `url` 属性设置跳转链接，配合 `clickable` 属性使用。

```vue
<template>
  <k-grid clickable>
    <k-grid-item icon="home-line" text="首页" to="/pages/index/index" />
    <k-grid-item icon="user-line" text="个人中心" url="/pages/user/user" />
  </k-grid>
</template>
```

## 徽标提示

设置 `dot` 或 `badge` 属性后，会在图标右上角展示徽标。

```vue
<template>
  <k-grid>
    <k-grid-item icon="message-line" text="消息" dot />
    <k-grid-item icon="notification-line" text="通知" badge="99+" />
  </k-grid>
</template>
```

## 自定义内容

通过插槽可以自定义格子展示的内容。

```vue
<template>
  <k-grid :border="false">
    <k-grid-item>
      <k-image src="/static/logo.png" width="40" height="40" />
    </k-grid-item>
    <k-grid-item>
      <view class="custom-content">
        <text>自定义</text>
      </view>
    </k-grid-item>
  </k-grid>
</template>
```

## 点击事件

监听格子的点击事件。

```vue
<template>
  <k-grid clickable @click="onGridClick">
    <k-grid-item icon="add-line" text="添加" name="add" @click="onItemClick" />
    <k-grid-item icon="minus-line" text="减少" name="minus" @click="onItemClick" />
  </k-grid>
</template>

<script setup>
const onGridClick = (index, event) => {
  console.log('Grid clicked:', index, event)
}

const onItemClick = (name, event) => {
  console.log('Grid item clicked:', name, event)
}
</script>
```

## API

### Grid Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| column | 列数 | number | 4 |
| border | 是否显示边框 | boolean | true |
| gutter | 格子之间的间距，单位为px | number | 0 |
| square | 是否将格子固定为正方形 | boolean | false |
| center | 是否将格子内容居中显示 | boolean | true |
| clickable | 是否开启格子点击反馈 | boolean | false |
| direction | 格子内容排列的方向 | string | 'vertical' |
| reverse | 是否调换图标和文本的位置 | boolean | false |
| icon-size | 图标大小，单位为px | number | 28 |
| custom-class | 自定义样式类名 | string | '' |

### GridItem Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| text | 文字 | string | '' |
| icon | 图标名称 | string | '' |
| icon-prefix | 图标类名前缀 | string | 'k-icon' |
| icon-color | 图标颜色 | string | '' |
| dot | 是否显示图标右上角小红点 | boolean | false |
| badge | 图标右上角徽标的内容 | string \| number | '' |
| name | 标识符，可以在点击事件的回调参数中获取到 | string | '' |
| url | 点击后跳转的链接地址 | string | '' |
| to | 点击后跳转的目标路由对象 | string | '' |
| link-type | 链接跳转类型 | string | 'navigateTo' |
| custom-class | 自定义样式类名 | string | '' |

### Grid Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击格子时触发 | index: 格子的索引, event: 点击事件对象 |

### GridItem Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击格子时触发 | name: 格子的标识符, event: 点击事件对象 |

### Grid Slots

| 名称 | 说明 |
|------|------|
| default | 默认插槽，用于放置 GridItem |

### GridItem Slots

| 名称 | 说明 |
|------|------|
| default | 自定义宫格的所有内容 |
| icon | 自定义图标 |
| text | 自定义文字 |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式。

| 名称 | 默认值 | 描述 |
|------|--------|------|
| --k-grid-background-color | #fff | 宫格背景色 |
| --k-grid-border-color | #ebedf0 | 宫格边框颜色 |
| --k-grid-item-padding | 16px | 宫格内边距 |
| --k-grid-item-text-color | #323233 | 宫格文字颜色 |
| --k-grid-item-text-font-size | 12px | 宫格文字字号 |
| --k-grid-item-icon-size | 28px | 宫格图标大小 |
| --k-grid-item-active-color | #f2f3f5 | 宫格点击时的背景色 |

## 注意事项

1. Grid 组件使用 `provide/inject` 机制向子组件传递配置，请确保 GridItem 组件在 Grid 组件内部使用。
2. 当设置 `square` 属性时，格子的高度会根据宽度自动计算，请注意内容的布局。
3. 使用 `gutter` 属性时，会在格子之间添加间距，可能会影响整体布局。
4. 图标名称需要与项目中使用的图标库保持一致。