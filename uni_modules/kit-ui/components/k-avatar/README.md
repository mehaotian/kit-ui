# k-avatar 头像组件

头像组件，支持图片、文字、图标等多种展示形式，提供丰富的配置选项。

## 基础用法

```vue
<template>
  <!-- 图片头像 -->
  <k-avatar src="https://example.com/avatar.jpg" />
  
  <!-- 文字头像 -->
  <k-avatar text="张" />
  
  <!-- 图标头像 -->
  <k-avatar icon="user" />
</template>
```

## 尺寸

支持多种预设尺寸，也可以自定义尺寸。

```vue
<template>
  <!-- 预设尺寸 -->
  <k-avatar size="small" text="小" />
  <k-avatar size="medium" text="中" />
  <k-avatar size="large" text="大" />
  
  <!-- 自定义尺寸 -->
  <k-avatar :size="60" text="60" />
</template>
```

## 形状

支持圆形和方形两种形状。

```vue
<template>
  <!-- 圆形（默认） -->
  <k-avatar shape="circle" text="圆" />
  
  <!-- 方形 -->
  <k-avatar shape="square" text="方" />
</template>
```

## 带徽标

可以在头像右上角显示徽标。

```vue
<template>
  <k-avatar 
    text="张" 
    :badge="{ count: 5, color: '#ff4757' }" 
  />
</template>
```

## 可点击

设置 `clickable` 属性使头像可点击，并监听点击事件。

```vue
<template>
  <k-avatar 
    text="点" 
    clickable 
    @click="handleClick" 
  />
</template>

<script setup>
function handleClick() {
  console.log('头像被点击了')
}
</script>
```

## 头像组

多个头像可以组合展示。

```vue
<template>
  <view class="avatar-group">
    <k-avatar 
      v-for="user in users" 
      :key="user.id"
      :src="user.avatar" 
      :text="user.name" 
      size="medium"
    />
  </view>
</template>

<style>
.avatar-group {
  display: flex;
  flex-direction: row;
}
.avatar-group .k-avatar {
  margin-right: -8px;
}
</style>
```

## 自定义内容

通过默认插槽可以自定义头像内容。

```vue
<template>
  <k-avatar size="large">
    <k-icon name="star" size="24" color="#ffd700" />
  </k-avatar>
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| src | 图片地址 | string | - |
| text | 文字内容 | string | - |
| icon | 图标名称 | string | - |
| iconSize | 图标大小 | string \| number | - |
| size | 头像尺寸，可选值：small/medium/large 或数字 | string \| number | 'medium' |
| shape | 头像形状，可选值：circle/square | string | 'circle' |
| bgColor | 背景颜色 | string | '#ccc' |
| textColor | 文字颜色 | string | '#fff' |
| clickable | 是否可点击 | boolean | false |
| badge | 徽标配置 | string \| number | null |
| badgeColor | 徽标颜色 | string | '#ff4757' |


## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击头像时触发（需设置 clickable 为 true） | - |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义头像内容 |

## 样式变量

组件提供了以下 CSS 变量，可用于自定义样式：

```css
.k-avatar {
  --k-avatar-bg-color: #ccc;           /* 默认背景色 */
  --k-avatar-text-color: #fff;         /* 默认文字颜色 */
  --k-avatar-border-radius: 50%;       /* 圆形边框半径 */
  --k-avatar-square-border-radius: 4px; /* 方形边框半径 */
}
```

## 注意事项

1. 当同时设置 `src`、`text` 和 `icon` 时，优先级为：插槽内容 > src > icon > text
2. 图片加载失败时会自动降级显示文字或图标
3. 文字头像会自动截取第一个字符显示
4. 自定义尺寸时建议使用偶数值以获得更好的显示效果
5. 在 uni-app x 中，某些样式可能在不同平台有差异，请注意测试