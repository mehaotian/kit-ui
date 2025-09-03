# Cell 单元格

单元格为列表中的单个展示项。

## 基础用法

`Cell` 可以单独使用，也可以与 `CellGroup` 搭配使用，`CellGroup` 可以为 `Cell` 提供上下文。

```vue
<template>
  <k-cell title="单元格" value="内容" />
  <k-cell title="单元格" value="内容" label="描述信息" />
</template>
```

## 单元格大小

通过 `size` 属性可以控制单元格的大小。

```vue
<template>
  <k-cell title="大号单元格" value="内容" size="large" />
  <k-cell title="默认单元格" value="内容" />
  <k-cell title="小号单元格" value="内容" size="small" />
</template>
```

## 展示图标

通过 `icon` 属性在标题左侧展示图标。

```vue
<template>
  <k-cell title="单元格" value="内容" icon="location" />
  <k-cell title="单元格" value="内容" icon="phone" />
</template>
```

## 展示箭头

设置 `is-link` 属性后会在单元格右侧显示箭头，并且可以通过 `right-text` 属性设置右侧文本。

```vue
<template>
  <k-cell title="单元格" is-link />
  <k-cell title="单元格" value="内容" is-link />
  <k-cell title="单元格" right-text="详细信息" is-link />
</template>
```

## 页面跳转

可以通过 `url` 属性进行页面跳转，通过 `link-type` 属性控制跳转类型。

```vue
<template>
  <k-cell title="跳转到按钮页面" is-link url="/pages/button/button" />
  <k-cell title="跳转到布局页面" is-link url="/pages/layout/layout" link-type="redirectTo" />
</template>
```

## 分组标题

通过 `CellGroup` 的 `title` 属性可以指定分组标题。

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

通过 `CellGroup` 的 `inset` 属性，可以将单元格转换为圆角卡片风格（目前只在 iOS 下生效）。

```vue
<template>
  <k-cell-group title="卡片分组" inset>
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
    <k-cell title="单元格" value="内容" />
  </k-cell-group>
</template>
```

## 必填项

通过 `required` 属性可以在标题前显示红色星号，表示必填项。

```vue
<template>
  <k-cell title="姓名" required />
  <k-cell title="手机号" required />
  <k-cell title="邮箱" />
</template>
```

## 自定义插槽

如以上用法不能满足你的需求，可以使用插槽来自定义内容。

```vue
<template>
  <k-cell title="自定义右侧内容" is-link>
    <template #extra>
      <k-badge :value="99" />
    </template>
  </k-cell>
  
  <k-cell>
    <template #title>
      <text style="color: #1989fa;">自定义标题</text>
    </template>
    <template #default>
      <text style="color: #999;">自定义内容</text>
    </template>
  </k-cell>
</template>
```

## 点击事件

可以监听单元格的点击事件，通过 `clickable` 属性开启点击反馈。

```vue
<template>
  <k-cell title="点击单元格" clickable @click="handleCellClick" />
  <k-cell title="禁用状态" disabled />
</template>

<script setup>
const handleCellClick = () => {
  uni.showToast({
    title: '单元格被点击',
    icon: 'none'
  })
}
</script>
```

## API

### CellGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 分组标题 | _string_ | - |
| inset | 是否展示为圆角卡片风格 | _boolean_ | `false` |
| border | 是否显示外边框 | _boolean_ | `true` |
| custom-class | 自定义类名 | _string_ | - |

### Cell Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 左侧标题 | _string_ | - |
| value | 右侧内容 | _string_ | - |
| label | 标题下方的描述信息 | _string_ | - |
| size | 单元格大小，可选值为 `large` `small` | _string_ | `medium` |
| icon | 左侧图标名称 | _string_ | - |
| right-text | 右侧文本 | _string_ | - |
| is-link | 是否展示右侧箭头并开启点击反馈 | _boolean_ | `false` |
| clickable | 是否开启点击反馈 | _boolean_ | `false` |
| border | 是否显示内边框 | _boolean \| null_ | `null` |
| disabled | 是否禁用单元格 | _boolean_ | `false` |
| url | 点击后跳转的链接地址 | _string_ | - |
| link-type | 链接跳转类型，可选值为 `redirectTo` `reLaunch` `switchTab` | _string_ | `navigateTo` |
| required | 是否显示表单必填星号 | _boolean_ | `false` |
| custom-class | 自定义类名 | _string_ | - |

### Cell Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击单元格时触发 | _event: Event_ |

### CellGroup Slots

| 名称 | 说明 |
| --- | --- |
| default | 默认插槽 |
| title | 自定义分组标题 |

### Cell Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义右侧内容 |
| icon | 自定义左侧图标 |
| title | 自定义标题 |
| label | 自定义标题下方的描述信息 |
| right-icon | 自定义右侧图标 |
| extra | 自定义单元格最右侧的额外内容 |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](#/config)。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --k-cell-font-size | _16px_ | 单元格字体大小 |
| --k-cell-line-height | _24px_ | 单元格行高 |
| --k-cell-vertical-padding | _10px_ | 单元格垂直内边距 |
| --k-cell-horizontal-padding | _16px_ | 单元格水平内边距 |
| --k-cell-text-color | _#323233_ | 单元格文字颜色 |
| --k-cell-background | _#fff_ | 单元格背景色 |
| --k-cell-border-color | _#ebedf0_ | 单元格边框颜色 |
| --k-cell-active-color | _#f2f3f5_ | 单元格点击时背景色 |
| --k-cell-required-color | _#ee0a24_ | 单元格必填项颜色 |
| --k-cell-label-color | _#969799_ | 单元格标签颜色 |
| --k-cell-label-font-size | _12px_ | 单元格标签字体大小 |
| --k-cell-label-line-height | _18px_ | 单元格标签行高 |
| --k-cell-label-margin-top | _4px_ | 单元格标签上边距 |
| --k-cell-value-color | _#969799_ | 单元格内容颜色 |
| --k-cell-icon-size | _16px_ | 单元格图标大小 |
| --k-cell-right-icon-color | _#969799_ | 单元格右侧图标颜色 |
| --k-cell-large-vertical-padding | _13px_ | 大号单元格垂直内边距 |
| --k-cell-large-title-font-size | _16px_ | 大号单元格标题字体大小 |
| --k-cell-small-vertical-padding | _8px_ | 小号单元格垂直内边距 |
| --k-cell-small-title-font-size | _14px_ | 小号单元格标题字体大小 |
| --k-cell-group-background | _#fff_ | 单元格组背景色 |
| --k-cell-group-title-color | _#969799_ | 单元格组标题颜色 |
| --k-cell-group-title-padding | _16px 16px 8px_ | 单元格组标题内边距 |
| --k-cell-group-title-font-size | _14px_ | 单元格组标题字体大小 |
| --k-cell-group-title-line-height | _16px_ | 单元格组标题行高 |
| --k-cell-group-inset-padding | _0 16px_ | 单元格组圆角卡片模式内边距 |
| --k-cell-group-inset-radius | _8px_ | 单元格组圆角卡片模式圆角大小 |
| --k-cell-group-inset-title-padding | _16px 16px 8px 32px_ | 单元格组圆角卡片模式标题内边距 |