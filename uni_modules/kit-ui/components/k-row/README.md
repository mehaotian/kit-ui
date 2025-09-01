# k-row 栅格布局行组件

基于24栅格系统的布局行组件，提供灵活的水平布局容器。

## 基础用法

```vue
<template>
  <k-row>
    <k-col :span="12">col-12</k-col>
    <k-col :span="12">col-12</k-col>
  </k-row>
</template>
```

## 区块间隔

通过 `gutter` 属性设置栅格间隔：

```vue
<template>
  <k-row :gutter="16">
    <k-col :span="6">col-6</k-col>
    <k-col :span="6">col-6</k-col>
    <k-col :span="6">col-6</k-col>
    <k-col :span="6">col-6</k-col>
  </k-row>
</template>
```

## 对齐方式

通过 `justify` 和 `align` 属性设置水平和垂直对齐：

```vue
<template>
  <!-- 水平居中 -->
  <k-row justify="center">
    <k-col :span="4">col-4</k-col>
    <k-col :span="4">col-4</k-col>
  </k-row>
  
  <!-- 垂直居中 -->
  <k-row align="middle">
    <k-col :span="12">col-12</k-col>
    <k-col :span="12">col-12</k-col>
  </k-row>
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| gutter | 栅格间隔，单位px | number | 0 |
| justify | 水平排列方式 | 'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly' | 'start' |
| align | 垂直对齐方式 | 'top' \| 'middle' \| 'bottom' \| 'stretch' | 'top' |
| wrap | 是否自动换行 | boolean | true |

## 注意事项

- 必须与 `k-col` 组件配合使用
- 基于24栅格系统，所有 `k-col` 的 `span` 值总和不应超过24
- `gutter` 间隔通过负边距实现，确保在有边框的容器中正确显示