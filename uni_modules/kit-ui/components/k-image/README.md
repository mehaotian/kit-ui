# k-image 图片组件

基于原生 `image` 组件封装的增强图片组件，提供了占位符、加载状态、错误处理、图片预览等功能，简化使用方式，提升开发效率。

## 基础用法
请使用绝对路径和网络路径图片地址。

```vue
<template>
  <!-- 基础用法 -->
  <k-image 
    src="https://picsum.photos/200/200" 
    width="200px" 
    height="200px"
  />
  
  <!-- 圆角图片 -->
  <k-image 
    src="https://picsum.photos/200/200" 
    width="200px" 
    height="200px"
    shape="round"
  />
  
  <!-- 圆形头像 -->
  <k-image 
    src="https://picsum.photos/200/200" 
    width="100px" 
    height="100px"
    shape="circle"
  />
</template>
```

## 加载状态

```vue
<template>
  <k-image 
    src="https://picsum.photos/200/200?delay=2000" 
    width="200px" 
    height="200px"
    show-loading
    loading-text="加载中..."
  />
</template>
```

## 错误处理

```vue
<template>
  <!-- 显示错误状态 -->
  <k-image 
    src="https://invalid-url.com/image.jpg" 
    width="200px" 
    height="200px"
    show-error
    error-text="加载失败"
  />
  
  <!-- 使用备用图片 -->
  <k-image 
    src="https://invalid-url.com/image.jpg" 
    fallback="https://picsum.photos/200/200"
    width="200px" 
    height="200px"
  />
</template>
```

## 占位符

```vue
<template>
  <k-image 
    width="200px" 
    height="200px"
    show-placeholder
    placeholder-text="暂无图片"
  />
</template>
```

## 图片预览

```vue
<template>
  <k-image 
    src="https://picsum.photos/800/600" 
    width="200px" 
    height="200px"
    preview
    @click="handleImageClick"
    @preview="handlePreview"
  />
</template>

<script setup>
const handleImageClick = () => {
  console.log('图片被点击')
}

const handlePreview = (src) => {
  console.log('预览图片:', src)
}
</script>
```

## 懒加载

```vue
<template>
  <k-image 
    src="https://picsum.photos/200/200" 
    width="200px" 
    height="200px"
    lazy
  />
</template>
```

## API

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| src | String | '' | 图片资源地址 |
| mode | String | 'scaleToFill' | 图片裁剪、缩放的模式 |
| width | String | null | 图片宽度 |
| height | String | null | 图片高度 |
| shape | String | 'square' | 图片形状：square/round/circle |
| radius | String\|Number | '8px' | 圆角大小（shape为round时生效） |
| lazy | Boolean | false | 是否开启懒加载 |
| fadeShow | Boolean | true | 图片显示动画效果 |
| webp | Boolean | false | 在系统不支持webp的情况下是否单独启用webp |
| showMenuByLongpress | Boolean | true | 开启长按图片显示识别小程序码菜单 |
| showLoading | Boolean | false | 是否显示加载状态 |
| loadingText | String | '加载中' | 加载状态文本 |
| showError | Boolean | false | 是否显示错误状态 |
| errorText | String | '加载失败' | 错误状态文本 |
| showPlaceholder | Boolean | false | 是否显示占位符 |
| placeholderText | String | '暂无图片' | 占位符文本 |
| fallback | String | null | 备用图片地址 |
| preview | Boolean | false | 是否开启点击预览 |
| disabled | Boolean | false | 是否禁用 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| load | 图片加载完成时触发 | (event) |
| error | 图片加载失败时触发 | (event) |
| click | 点击图片时触发 | - |
| preview | 预览图片时触发 | (src) |

### Mode 值说明

| 值 | 说明 |
|----|------|
| scaleToFill | 缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素 |
| aspectFit | 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来 |
| aspectFill | 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来 |
| widthFix | 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变 |
| heightFix | 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变 |
| top | 裁剪模式，不缩放图片，只显示图片的顶部区域 |
| bottom | 裁剪模式，不缩放图片，只显示图片的底部区域 |
| center | 裁剪模式，不缩放图片，只显示图片的中间区域 |
| left | 裁剪模式，不缩放图片，只显示图片的左边区域 |
| right | 裁剪模式，不缩放图片，只显示图片的右边区域 |
| top left | 裁剪模式，不缩放图片，只显示图片的左上边区域 |
| top right | 裁剪模式，不缩放图片，只显示图片的右上边区域 |
| bottom left | 裁剪模式，不缩放图片，只显示图片的左下边区域 |
| bottom right | 裁剪模式，不缩放图片，只显示图片的右下边区域 |

## 样式定制

组件提供了丰富的 CSS 类名，可以通过覆盖这些类名来自定义样式：

```css
/* 容器样式 */
.k-image {
  /* 自定义容器样式 */
}

/* 图片样式 */
.k-image__img {
  /* 自定义图片样式 */
}

/* 占位符样式 */
.k-image__placeholder {
  /* 自定义占位符样式 */
}

/* 加载状态样式 */
.k-image__loading {
  /* 自定义加载状态样式 */
}

/* 错误状态样式 */
.k-image__error {
  /* 自定义错误状态样式 */
}

/* 遮罩层样式 */
.k-image__mask {
  /* 自定义遮罩层样式 */
}
```

