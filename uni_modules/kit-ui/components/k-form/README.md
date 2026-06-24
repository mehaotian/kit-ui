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

## FormRules 工厂

推荐使用独立函数（跨端一致）：`ruleRequired`、`rulePhone`、`ruleEmail` 等。

```uts
import { ruleRequired, rulePhone, ruleEmail, ruleRange } from '@/uni_modules/kit-ui/components/k-form/validators.uts'

const rules = {
  phone: [ruleRequired('请输入手机号'), rulePhone()],
  email: [ruleRequired('请输入邮箱'), ruleEmail()],
  age: [ruleRequired('请输入年龄'), ruleRange(1, 120)]
}
```

也可使用 `rulePhone()`、`ruleEmail()` 等独立函数（APP / WEB 均推荐）。

## 原生 input 校验（双轨）

校验绑定在 `model[prop]`，不依赖 k- 组件。原生 `input` 需 `v-model` 到 model：

```vue
<k-form :model="form" :rules="rules">
  <k-form-item label="手机号" prop="phone">
    <input v-model="form.phone" @blur="onPhoneBlur" />
  </k-form-item>
</k-form>

<script setup lang="uts">
import { createFormBlurHandler } from '@/uni_modules/kit-ui/components/k-form/form-context.uts'
const onPhoneBlur = createFormBlurHandler()
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
| getFieldsError | 获取各字段错误 map | `UTSJSONObject` |

## 校验规则

### 规则字段

| 字段 | 说明 |
| --- | --- |
| required | 是否必填 |
| message | 错误提示 |
| type | 见下表 |
| minLength / maxLength | 字符串长度 |
| min / max | 数值范围 |
| pattern / regexp | 正则字符串 |
| trigger | `submit` / `blur` / `change`（Phase 2 完整支持） |

### type 预设

| type | 说明 |
| --- | --- |
| string | 字符串类型 |
| number | 数字 |
| integer | 整数 |
| phone / mobile | 大陆手机号 |
| email | 邮箱 |
| url | URL |
| array | 数组 |
| boolean | 布尔 |

## 注意事项

- 表单项需设置 `prop` 且与 `model` 字段名一致才能参与校验。
- 复杂控件（radio-group、checkbox-group）需在 rules 中指定 `type: 'array'` 等。
- APP 页面 ref 使用 `KFormComponentPublicInstance`，勿自定义 `KFormExpose` 强转。
- 含 `validator` 函数的规则勿经 JSON 序列化（Phase 2）；项级 `rules` 或 `UTSJSONObject` 传递。
