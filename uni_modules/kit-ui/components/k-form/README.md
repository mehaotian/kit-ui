# k-form 表单

表单容器，统一管理 `k-form-item` 校验、布局与提交。常与 `k-input`、`k-radio`、`k-checkbox`、`k-switch` 等组合。

## 基础用法

```vue
<template>
  <k-form ref="formRef" :model="form" :rules="rules">
    <k-form-item label="用户名" prop="username">
      <k-input v-model="form.username" placeholder="请输入" />
    </k-form-item>
    <k-button type="primary" text="提交" @click="handleSubmit" />
  </k-form>
</template>

<script setup lang="uts">
const formRef = ref<KFormComponentPublicInstance | null>(null)
const form = reactive({ username: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名' }]
}

const handleSubmit = () => {
  const valid = formRef.value?.validate?.() ?? false
  if (valid) {
    // 提交逻辑
  }
}
</script>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| model | Object | `{}` | 表单数据对象 |
| rules | Object | `{}` | 字段校验规则，key 为 prop |
| labelWidth | String | `'80px'` | 默认标签宽度 |
| labelAlign | String | `'left'` | 标签对齐：`left` / `right` |
| labelPosition | String | `'left'` | 标签位置：`left` / `top` |
| disabled | Boolean | `false` | 是否禁用（预留，子控件需自行传递） |
| showErrorMessage | Boolean | `true` | 是否显示错误提示 |
| border | Boolean | `false` | 是否显示表单外边框 |
| customStyle | String | `''` | 自定义内联样式 |

## 组件事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 调用 `submit()` 且校验通过时 | `model: object` |
| validate | 调用 `validate()` 后 | `valid, errors` |

## 实例方法（defineExpose）

| 方法名 | 说明 | 返回值 |
| --- | --- | --- |
| validate | 校验全部表单项 | `boolean` |
| resetValidation | 清除全部错误提示 | - |
| submit | 校验通过后触发 submit 事件 | - |

## 校验规则

规则字段支持：

| 字段 | 说明 |
| --- | --- |
| required | 是否必填 |
| message | 错误提示 |
| minLength / maxLength | 字符串长度 |
| min / max | 数值范围 |
| pattern | 正则字符串 |
| type | 类型：`array` / `boolean` 等 |

## 注意事项

- 表单项需设置 `prop` 且与 `model` 字段名一致才能参与校验。
- 复杂控件（radio-group、checkbox-group）需在 rules 中指定 `type: 'array'` 等。
