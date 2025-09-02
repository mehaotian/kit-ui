# k-tag 标签组件

用于标记和选择的标签组件，支持多种样式、尺寸和交互功能。

## 基础用法

```vue
<template>
  <k-tag text="默认标签" />
  <k-tag text="主要标签" type="primary" />
  <k-tag text="成功标签" type="success" />
</template>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| text | String | '' | 标签文本内容 |
| type | String | 'default' | 标签类型，可选值：default/primary/success/warning/error/info |
| size | String | 'medium' | 标签大小，可选值：small/medium/large 或具体数值（如 '16', '18px'） |
| shape | String | 'square' | 标签形状，可选值：square/round/circle |
| variant | String | 'filled' | 标签变体，可选值：filled/outlined/text/gradient |
| color | String | '' | 自定义文字颜色 |
| backgroundColor | String | '' | 自定义背景颜色 |
| borderColor | String | '' | 自定义边框颜色 |
| closable | Boolean | false | 是否可关闭 |
| disabled | Boolean | false | 是否禁用 |
| icon | String | '' | 图标名称 |
| iconPosition | String | 'left' | 图标位置，可选值：left/right |
| customStyle | String | '' | 自定义样式 |
| customClass | String | '' | 自定义类名 |

## 组件事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击标签时触发 | event: Event |
| close | 点击关闭按钮时触发 | event: Event |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| default | 自定义标签内容 |

## 使用示例

### 不同类型

```vue
<template>
  <k-tag text="默认" type="default" />
  <k-tag text="主要" type="primary" />
  <k-tag text="成功" type="success" />
  <k-tag text="警告" type="warning" />
  <k-tag text="错误" type="error" />
  <k-tag text="信息" type="info" />
</template>
```

### 不同尺寸

```vue
<template>
  <k-tag text="小标签" size="small" />
  <k-tag text="中标签" size="medium" />
  <k-tag text="大标签" size="large" />
  <!-- 自定义尺寸 -->
  <k-tag text="16px" size="16" />
  <k-tag text="20px" size="20" />
</template>
```

### 不同形状

```vue
<template>
  <k-tag text="方形" shape="square" />
  <k-tag text="圆角" shape="round" />
  <k-tag text="99" shape="circle" />
</template>
```

### 不同变体

```vue
<template>
  <k-tag text="填充" variant="filled" type="primary" />
  <k-tag text="描边" variant="outlined" type="primary" />
  <k-tag text="文本" variant="text" type="primary" />
  <k-tag text="渐变" variant="gradient" type="primary" />
</template>
```

### 渐变背景

```vue
<template>
  <k-tag text="默认渐变" type="default" variant="gradient" />
  <k-tag text="主要渐变" type="primary" variant="gradient" />
  <k-tag text="成功渐变" type="success" variant="gradient" />
  <k-tag text="警告渐变" type="warning" variant="gradient" />
  <k-tag text="错误渐变" type="error" variant="gradient" />
  <k-tag text="信息渐变" type="info" variant="gradient" />
</template>
```

### 带图标

```vue
<template>
  <k-tag text="左图标" icon="star" icon-position="left" />
  <k-tag text="右图标" icon="arrow-right" icon-position="right" />
</template>
```

### 可关闭

```vue
<template>
  <k-tag 
    text="可关闭标签" 
    closable 
    @close="handleClose"
  />
</template>

<script setup>
const handleClose = (event) => {
  console.log('标签被关闭', event)
}
</script>
```

### 自定义颜色

```vue
<template>
  <k-tag text="自定义文字" color="#FF6B6B" />
  <k-tag text="自定义背景" background-color="#FFE66D" color="#333" />
  <k-tag text="自定义边框" variant="outlined" border-color="#4ECDC4" color="#4ECDC4" />
</template>
```

### 插槽用法

```vue
<template>
  <k-tag type="primary">
    <text>自定义内容</text>
  </k-tag>
</template>
```

### 主题注入

通过 `k-config` 组件可以注入自定义主题：

```vue
<template>
  <k-config :theme="customTheme">
    <k-tag text="主题标签" type="primary" />
  </k-config>
</template>

<script setup>
const customTheme = {
  colorPrimary: '#FF8C00',
  colorSuccess: '#32CD32',
  colorWarning: '#FFD700',
  colorError: '#FF6347',
  colorInfo: '#1E90FF'
}
</script>
```

#### 支持的主题变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| colorPrimary | 主要颜色 | #007AFF |
| colorSuccess | 成功颜色 | #34C759 |
| colorWarning | 警告颜色 | #FF9500 |
| colorError | 错误颜色 | #FF3B30 |
| colorInfo | 信息颜色 | #5AC8FA |

## 注意事项

1. 组件基于 uni-app x 开发，支持跨平台使用
2. 使用 UTS 语言编写，类型安全且性能优异
3. 支持 easycom 规范，无需手动导入即可使用
4. 自定义尺寸支持数值和带单位的字符串（如 '16', '18px'）
5. 圆形标签（circle）建议使用较短的文本或数字
6. 禁用状态下点击和关闭事件不会触发
7. 支持通过 `k-config` 组件进行主题注入，实现统一的视觉风格
8. 所有颜色属性都支持 CSS 颜色值格式
9. 组件内部使用 CSS 变量实现主题切换，确保良好的性能表现
10. 建议在列表场景中合理使用，避免过多标签影响页面性能