# k-text 文本组件

`k-text` 是一个功能丰富的文本组件，支持多种类型、尺寸和状态的文本显示，并提供文本溢出处理、格式化和装饰等功能。

## 基础用法

```html
<k-text>默认文本</k-text>
<k-text type="primary">主要文本</k-text>
<k-text type="success">成功文本</k-text>
<k-text type="warning">警告文本</k-text>
<k-text type="danger">危险文本</k-text>
<k-text type="info">信息文本</k-text>
```

## 文本尺寸

```html
<k-text size="xs">超小号文本</k-text>
<k-text size="sm">小号文本</k-text>
<k-text size="base">基础文本</k-text>
<k-text size="md">中号文本</k-text>
<k-text size="lg">大号文本</k-text>
<k-text size="xl">超大号文本</k-text>
<k-text size="xxl">特大号文本</k-text>
```

## 文本粗细

```html
<k-text weight="light">细体文本</k-text>
<k-text weight="normal">常规文本</k-text>
<k-text weight="medium">中粗文本</k-text>
<k-text weight="bold">粗体文本</k-text>
```

## 文本溢出

### 单行溢出

```html
<k-text ellipsis>这是一段很长的文本，超出部分将显示省略号...</k-text>
```

### 多行溢出

```html
<k-text ellipsis :lines="2">这是一段很长的文本，将在第二行结束时显示省略号...</k-text>
```

## 文本格式化

### 日期格式化

```html
<k-text format="date" text="2023-05-20"></k-text>
<k-text format="date" text="2023-05-20" :formatOptions="{ format: 'YYYY年MM月DD日' }"></k-text>
```

### 金额格式化

```html
<k-text format="price" text="1234.56"></k-text>
<k-text format="price" text="1234.56" :formatOptions="{ symbol: '$', digits: 2, thousandsSeparator: true }"></k-text>
```

### 文本脱敏

```html
<k-text format="mask" text="13812345678" :formatOptions="{ type: 'phone' }"></k-text>
<k-text format="mask" text="example@email.com" :formatOptions="{ type: 'email' }"></k-text>
<k-text format="mask" text="张三" :formatOptions="{ type: 'name' }"></k-text>
<k-text format="mask" text="123456789012345678" :formatOptions="{ type: 'idcard' }"></k-text>
<k-text format="mask" text="自定义脱敏文本" :formatOptions="{ type: 'custom', startLen: 2, endLen: 2, maskChar: '#' }"></k-text>
```

## 文本装饰

```html
<k-text decoration="underline">下划线文本</k-text>
<k-text decoration="line-through">删除线文本</k-text>
```

## 文本对齐

```html
<k-text align="left">左对齐文本</k-text>
<k-text align="center">居中对齐文本</k-text>
<k-text align="right">右对齐文本</k-text>
```

## 自定义颜色

```html
<k-text color="#8a2be2">自定义颜色文本</k-text>
```

## 自定义样式

```html
<k-text customStyle="letter-spacing: 2px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">自定义样式文本</k-text>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 文本类型，可选值为 `default`、`primary`、`success`、`warning`、`danger`、`info` | String | `default` |
| size | 文本尺寸，可选值为 `xs`、`sm`、`base`、`md`、`lg`、`xl`、`xxl` | String | `base` |
| weight | 文本粗细，可选值为 `light`、`normal`、`medium`、`bold` | String | `normal` |
| color | 自定义文本颜色 | String | - |
| customStyle | 自定义样式 | String | - |
| ellipsis | 是否显示省略号 | Boolean | `false` |
| lines | 最大行数，仅在 `ellipsis` 为 `true` 时生效 | Number | `1` |
| selectable | 是否可选择 | Boolean | `false` |
| space | 空格处理方式，可选值为 `ensp`、`emsp`、`nbsp` | String | - |
| decode | 是否解码 | Boolean | `false` |
| text | 文本内容 | String | - |
| format | 格式化类型，可选值为 `date`、`price`、`mask` | String | - |
| formatOptions | 格式化选项 | Object | `{}` |
| decoration | 装饰类型，可选值为 `underline`、`line-through`、`none` | String | `none` |
| align | 对齐方式，可选值为 `left`、`center`、`right` | String | `left` |

### 格式化选项

#### 日期格式化选项 (format="date")

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| format | 日期格式，如 `YYYY-MM-DD HH:mm:ss` | String | `YYYY-MM-DD` |
| locale | 地区，如 `zh-CN` | String | - |

#### 金额格式化选项 (format="price")

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| digits | 小数位数 | Number | `2` |
| symbol | 货币符号 | String | `¥` |
| thousandsSeparator | 是否使用千分位分隔符 | Boolean | `true` |

#### 脱敏选项 (format="mask")

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 脱敏类型，可选值为 `phone`、`email`、`name`、`idcard`、`custom` | String | `custom` |
| startLen | 起始保留长度，仅在 `type` 为 `custom` 时生效 | Number | `0` |
| endLen | 结尾保留长度，仅在 `type` 为 `custom` 时生效 | Number | `0` |
| maskChar | 掩码字符 | String | `*` |

### 插槽

| 名称 | 说明 |
| --- | --- |
| default | 文本内容，优先级高于 `text` 属性 |