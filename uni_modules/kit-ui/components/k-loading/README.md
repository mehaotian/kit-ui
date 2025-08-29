# k-loading 加载组件

用于页面和区块的加载中状态，支持多种加载样式和自定义配置。

## 基础用法

```vue
<template>
  <k-loading />
</template>
```

## 加载样式

支持四种加载样式：

- `spinner`：旋转圆圈（默认）
- `dots`：点状加载
- `bars`：条状加载
- `pulse`：脉冲加载

```vue
<template>
  <k-loading type="spinner" />
  <k-loading type="dots" />
  <k-loading type="bars" />
  <k-loading type="pulse" />
</template>
```

## 尺寸设置

### 预定义尺寸

```vue
<template>
  <k-loading size="xs" />
  <k-loading size="sm" />
  <k-loading size="md" />
  <k-loading size="lg" />
  <k-loading size="xl" />
</template>
```

### 自定义尺寸

```vue
<template>
  <k-loading size="24" />
  <k-loading size="32px" />
  <k-loading size="2em" />
</template>
```

## 颜色主题

### 预定义颜色

```vue
<template>
  <k-loading color="primary" />
  <k-loading color="success" />
  <k-loading color="warning" />
  <k-loading color="danger" />
  <k-loading color="info" />
</template>
```

### 自定义颜色

```vue
<template>
  <k-loading color="#FF6B6B" />
  <k-loading color="rgb(255, 107, 107)" />
</template>
```

## 加载文本

```vue
<template>
  <k-loading text="加载中..." />
  <k-loading type="dots" text="请稍候" />
</template>
```

## 布局方向

```vue
<template>
  <!-- 垂直布局（默认） -->
  <k-loading text="加载中..." :vertical="true" />
  
  <!-- 水平布局 -->
  <k-loading text="加载中..." :vertical="false" />
</template>
```

## 遮罩模式

```vue
<template>
  <k-loading 
    :overlay="true"
    text="加载中..."
    :close-on-click-overlay="true"
    @close="handleClose"
  />
</template>

<script setup>
const handleClose = () => {
  console.log('遮罩被关闭')
}
</script>
```

## 自定义样式

```vue
<template>
  <k-loading 
    custom-style="margin: 20px; padding: 10px;"
  />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 加载样式类型 | `'spinner' \| 'dots' \| 'bars' \| 'pulse'` | `'spinner'` |
| size | 尺寸 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` |
| color | 颜色主题 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| string` | `'primary'` |
| text | 加载文本 | `string` | `''` |
| overlay | 是否显示全屏遮罩 | `boolean` | `false` |
| overlayColor | 遮罩背景色 | `string` | `'rgba(0, 0, 0, 0.5)'` |
| closeOnClickOverlay | 点击遮罩是否可关闭 | `boolean` | `false` |
| customStyle | 自定义样式 | `string` | `''` |
| vertical | 是否垂直排列 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| close | 遮罩关闭时触发 | - |

## 尺寸对照表

| 尺寸 | 加载器大小 | 文本大小 |
|------|------------|----------|
| xs | 16px | 12px |
| sm | 20px | 14px |
| md | 24px | 16px |
| lg | 32px | 18px |
| xl | 40px | 20px |

## 颜色对照表

| 颜色 | 色值 |
|------|------|
| primary | #007AFF |
| success | #34C759 |
| warning | #FF9500 |
| danger | #FF3B30 |
| info | #5AC8FA |
