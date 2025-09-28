# k-input 输入框组件

输入框组件，支持多种输入类型、状态和验证功能。

## 基础用法

```vue
<template>
  <k-input v-model="value" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 输入框值 | String \| Number | '' |
| type | 输入框类型 | String | 'text' |
| placeholder | 占位符文本 | String | '请输入内容' |
| disabled | 是否禁用 | Boolean | false |
| readonly | 是否只读 | Boolean | false |
| clearable | 是否显示清除按钮 | Boolean | false |
| showPassword | 是否显示密码切换按钮 | Boolean | false |
| maxlength | 最大输入长度 | String \| Number | -1 |
| size | 输入框尺寸 | String | 'medium' |
| error | 错误状态 | Boolean | false |
| errorMessage | 错误提示信息 | String | '' |
| prefixIcon | 前缀图标 | String | '' |
| suffixIcon | 后缀图标 | String | '' |
| inputStyle | 输入框样式 | Object | {} |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 值变化时触发 | (value) |
| input | 输入时触发 | (value, event) |
| change | 值改变时触发 | (value, event) |
| focus | 获得焦点时触发 | (event) |
| blur | 失去焦点时触发 | (event) |
| clear | 点击清除按钮时触发 | - |
| confirm | 点击确认按钮时触发 | (event) |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| focus | 使输入框获得焦点 | - |
| blur | 使输入框失去焦点 | - |

## 类型定义

### InputType

```typescript
type InputType = 'text' | 'password' | 'number' | 'tel' | 'email' | 'url'
```

### InputSize

```typescript
type InputSize = 'small' | 'medium' | 'large'
```