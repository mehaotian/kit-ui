# CellGroup 单元格组

单元格组为 Cell 单元格提供上下文，用于将多个单元格组合在一起。

## 基础用法

`CellGroup` 为 `Cell` 提供上下文，可以控制边框显示和分组标题。

```vue
<template>
  <k-cell-group>
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
  </k-cell-group>
</template>
```

## 分组标题

通过 `title` 属性可以指定分组标题。

```vue
<template>
  <k-cell-group title="分组1">
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
  </k-cell-group>
  
  <k-cell-group title="分组2">
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
  </k-cell-group>
</template>
```

## 卡片风格

通过 `inset` 属性，可以将单元格转换为圆角卡片风格。

```vue
<template>
  <k-cell-group title="卡片分组" inset>
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
  </k-cell-group>
</template>
```

## 边框控制

通过 `border` 属性可以控制是否显示外边框。

```vue
<template>
  <k-cell-group title="无边框分组" :border="false">
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
  </k-cell-group>
</template>
```

## 自定义标题

通过 `title` 插槽可以自定义分组标题。

```vue
<template>
  <k-cell-group>
    <template #title>
      <text style="color: #1989fa; font-weight: bold;">自定义标题</text>
    </template>
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
  </k-cell-group>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 分组标题 | _string_ | - |
| inset | 是否展示为圆角卡片风格 | _boolean_ | `false` |
| border | 是否显示外边框 | _boolean_ | `true` |
| custom-class | 自定义类名 | _string_ | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 默认插槽，用于放置 Cell 组件 |
| title | 自定义分组标题 |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](#/config)。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --k-cell-group-background | _#fff_ | 单元格组背景色 |
| --k-cell-group-title-color | _#969799_ | 单元格组标题颜色 |
| --k-cell-group-title-padding | _16px 16px 8px_ | 单元格组标题内边距 |
| --k-cell-group-title-font-size | _14px_ | 单元格组标题字体大小 |
| --k-cell-group-title-line-height | _16px_ | 单元格组标题行高 |
| --k-cell-group-inset-padding | _0 16px_ | 单元格组圆角卡片模式内边距 |
| --k-cell-group-inset-radius | _8px_ | 单元格组圆角卡片模式圆角大小 |
| --k-cell-group-inset-title-padding | _16px 16px 8px 32px_ | 单元格组圆角卡片模式标题内边距 |