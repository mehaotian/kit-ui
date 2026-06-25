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

const handleSubmit = async () => {
  const valid = await (formRef.value?.submit?.() ?? Promise.resolve(false))
  if (valid) {
    // 提交逻辑
  }
}
</script>
```

## FormRules 工厂

推荐使用独立函数（跨端一致）：`ruleRequired`、`rulePhone`、`ruleEmail`、`ruleEnum`、`ruleLen`、`ruleNoWhitespace` 等。

```uts
import { ruleRequired, rulePhone, ruleEmail, ruleRange, ruleEnum, ruleLen, ruleNoWhitespace } from '@/uni_modules/kit-ui/components/k-form/validators.uts'

const rules = {
  phone: [ruleRequired('请输入手机号'), rulePhone('')],
  email: [ruleRequired('请输入邮箱'), ruleEmail('')],
  age: [ruleRequired('请输入年龄'), ruleRange(1, 120, '')],
  role: [ruleEnum(['admin', 'user'], '角色不合法')],
  code: [ruleLen(6, '验证码必须为 6 位')],
  nickname: [ruleNoWhitespace('昵称不能只有空格')]
}
```

## 原生 input 校验（双轨）

校验绑定在 `model[prop]`，不依赖 k- 组件。页面 slot 内无法 inject 表单项上下文，请用 `validateField`：

```vue
<k-form ref="formRef" :model="form" :rules="rules">
  <k-form-item label="手机号" prop="phone">
    <input v-model="form.phone" @blur="onPhoneBlur" />
  </k-form-item>
</k-form>

<script setup lang="uts">
const formRef = ref<KFormComponentPublicInstance | null>(null)
const onPhoneBlur = () => {
  formRef.value?.validateField?.('phone', 'blur')
}
</script>
```

在 **k-form-item 子组件** 内可使用 `createFieldHandler('blur')`（见 `form-context.uts`）。

## blur / change 触发

- 规则配置 `trigger: 'blur'` 或 `trigger: 'change'`；未配置时仅在 `validate()` / 提交时校验。
- `k-input` / `k-textarea` 在表单项内会自动转发 blur / change 触发项级校验。
- 触发器通过 `ruleWithTrigger` 附加：`ruleWithTrigger(rulePhone(''), 'blur')`、`ruleWithTrigger(ruleMinLength(2, '至少 2 字符'), 'blur')`。

## 自定义 validator

使用 `ruleCustom`（返回 `UTSJSONObject`，APP 保留函数引用）：

```uts
import { ruleCustom } from '@/uni_modules/kit-ui/components/k-form/validators.uts'
import { readModelProperty } from '@/uni_modules/kit-ui/components/k-form/form-utils.uts'

const confirmPasswordRules = [
  ruleCustom((value, _rule, model) => {
    const pwd = readModelProperty(model, 'password')
    if (value != pwd) return '两次密码不一致'
    return true
  }, '', 'blur')
]
```

推荐将含 `validator` 的规则放在 **k-form-item `:rules`** 或 `ruleCustom` 工厂，避免表单级 rules 经 JSON 路径丢失函数。

## 异步校验 asyncValidator

使用 `ruleAsync` 声明异步规则，推荐配置 `trigger: blur`：

```uts
import { ruleRequired, ruleAsync } from '@/uni_modules/kit-ui/components/k-form/validators.uts'

const usernameRules = [
  ruleRequired('请输入用户名'),
  ruleAsync((value, _rule, _model) => {
    return new Promise((resolve) => {
      uni.request({
        url: `https://api.github.com/users/${value}`,
        method: 'GET',
        success: (res) => {
          resolve(res.statusCode == 404 ? true : '用户名已被占用')
        },
        fail: () => {
          // 本地兜底，保证离线或网络异常时示例可验证
          resolve(value == 'admin' ? '用户名已被占用' : true)
        }
      })
    })
  }, '用户名校验失败，请稍后重试', 'blur')
]
```

异步校验进行中会显示“校验中...”，并在完成后回写最新一次结果（内置防抖与竞态保护，支持 `uni.request` + 本地兜底）。

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| model | Object | `{}` | 表单数据对象 |
| rules | Object | `{}` | 字段校验规则，key 为 prop |
| labelWidth | String | `'80px'` | 默认标签宽度 |
| labelAlign | String | `'left'` | 标签对齐：`left` / `right` |
| labelPosition | String | `'left'` | 标签位置：`left` / `top` |
| disabled | Boolean | `false` | 是否禁用（form 内控件统一禁用） |
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
| validate | 校验全部表单项（全部规则） | `boolean` |
| validateField | 校验单个字段，可选 trigger | `boolean` |
| validateAsync | 异步校验全部表单项（同步+异步规则全量） | `Promise<boolean>` |
| validateFieldAsync | 异步校验单字段，可选 trigger | `Promise<boolean>` |
| resetValidation | 清除校验提示；可传 `prop` 或 `prop[]` 仅清除指定字段 | - |
| clearValidate | `resetValidation` 别名；参数一致 | - |
| submit | 严格校验（含异步）通过后触发 submit 事件 | `Promise<boolean>` |
| getFieldsError | 获取各字段错误 map | `UTSJSONObject` |

## 校验规则

### 规则字段

| 字段 | 说明 |
| --- | --- |
| required | 是否必填 |
| message | 错误提示 |
| enum | 枚举值列表（值必须命中其中之一） |
| len | 固定长度（字符串/数组） |
| type | 见下表 |
| minLength / maxLength | 字符串长度 |
| min / max | 数值范围 |
| whitespace | 设为 `false` 时，禁止仅空白字符（string） |
| pattern / regexp | 正则字符串 |
| trigger | `submit` / `blur` / `change`（默认仅 submit 时校验） |
| validator | 自定义同步校验，返回 `true` / `false` / 错误字符串 |
| asyncValidator | 自定义异步校验，返回 `Promise<boolean \| string>` |
| asyncMessage | 异步失败默认文案 |

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
- 含 `validator` 的规则请用 `ruleCustom` 或项级 `:rules`，勿依赖 JSON 序列化路径。
- 错误文案优先级：`k-form-item :rules` 的 `message` > `k-form :rules` 的 `message` > 引擎默认文案。
- `submit()` 为严格校验入口，返回 `Promise<boolean>`；校验通过后才触发 `submit` 事件。
- `validateField(prop)` 在重复 `prop` 场景默认命中首个已注册项，建议保持 `prop` 唯一。
