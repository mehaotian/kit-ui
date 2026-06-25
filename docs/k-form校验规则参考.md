# k-form 校验规则参考

> 版本：v1.0  
> 更新日期：2026-06-25  
> 适用范围：`k-form`、`k-form-item`、`k-input`、`k-textarea`、`k-radio(-group)`、`k-checkbox(-group)`、`k-switch`

---

## 1. 目标与口径

- 本文档用于统一 `k-form` 校验行为，避免“代码行为、README、demo、验收口径”不一致。
- 默认口径为**严格校验**：提交场景走 `submit()`（内部 `validateAsync()` 全量校验）或显式 `validateAsync()`。
- 文案优先级固定为：**项级规则 > 表单级规则 > 引擎默认文案**。

---

## 2. 校验执行模型

### 2.1 规则来源

- 表单级：`k-form :rules="{}"`。
- 项级：`k-form-item :rules="[]"`。
- 最终字段规则：`getFieldRules()` 合并结果。
- 合并策略：
  - 项级规则存在时，优先采用项级规则结构。
  - 若项级缺失 `message/asyncMessage`，会尝试回退匹配表单级同特征规则。

### 2.2 触发器

- `submit`：提交时触发；未声明 `trigger` 的规则默认归属 `submit`。
- `blur`：失焦触发。
- `change`：值变化触发（异步规则内置防抖）。

### 2.3 严格提交

- `submit()` 行为：先执行 `validateAsync()`（同步+异步全量），成功后才 emit `submit`。
- 返回：`Promise<boolean>`。

---

## 3. 规则字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `required` | `boolean` | 是否必填 |
| `message` | `string` | 同步校验失败文案 |
| `asyncMessage` | `string` | 异步校验失败兜底文案 |
| `type` | `string` | 类型校验（见下文） |
| `pattern` / `regexp` | `string` | 正则字符串，非法正则按失败处理（不抛崩） |
| `enum` | `any[]` | 枚举命中校验 |
| `len` | `number` | 固定长度（字符串/数组） |
| `minLength` / `maxLength` | `number` | 长度边界（字符串/数组） |
| `min` / `max` | `number` | 数值边界 |
| `whitespace` | `boolean` | `false` 时禁止纯空白字符串 |
| `trigger` | `submit/blur/change` | 规则触发时机 |
| `validator` | `function` | 自定义同步校验：返回 `true/false/string` |
| `asyncValidator` | `function` | 自定义异步校验：返回 `Promise<boolean \| string>` |

---

## 4. `type` 预设

- `string`
- `number`
- `integer`
- `phone` / `mobile`
- `email`
- `url`
- `array`
- `boolean`

---

## 5. 执行顺序与失败中断

单条规则执行顺序（同步阶段）：

1. `required`
2. 空值短路（非必填且空值时跳过后续）
3. `whitespace`
4. `type`（含类型/格式）
5. `len` / `minLength` / `maxLength`
6. `enum`
7. `min` / `max`
8. `pattern` / `regexp`
9. `validator`

字段异步校验：

- 先跑同步阶段，若失败直接返回失败。
- 同步通过后再跑 `asyncValidator`。
- 任意阶段失败即中断并返回首个失败信息。

---

## 6. 触发行为细节

- `validate()`：仅同步校验，适合快速检查。
- `validateAsync()`：同步+异步全量校验，适合提交前最终判断。
- `validateField(prop, trigger)`：单字段同步校验。
- `validateFieldAsync(prop, trigger)`：单字段同步+异步校验。
- `change` 异步规则：300ms 防抖。
- `blur/submit`：立即执行异步校验，并会清理挂起的 `change` 防抖任务，避免旧结果覆盖。

---

## 7. disabled 生效规则

- `k-form.disabled=true` 时，会通过 `k-form-item` 向下透传禁用状态。
- 以下组件会统一进入禁用态：
  - `k-input`
  - `k-textarea`
  - `k-switch`
  - `k-radio` / `k-radio-group`
  - `k-checkbox` / `k-checkbox-group`
- 组件自身 `disabled` 与表单透传禁用为“或”关系（任一为真即禁用）。

---

## 8. 边界行为说明

- `validateField(prop)` 在重复 `prop` 场景默认命中首个已注册项，建议表单内 `prop` 唯一。
- `pattern/regexp` 非法时不会抛异常导致中断，按“校验失败”返回。
- 规则特征匹配用于项级/表单级文案回退，不再仅依赖数组索引。

---

## 9. 推荐写法示例

### 9.1 声明式规则

```base
const rules = {
  phone: [
    { required: true, message: '请输入手机号' },
    { type: 'phone', trigger: 'blur', message: '手机号格式不正确' }
  ],
  code: [
    { required: true, message: '请输入验证码' },
    { len: 6, message: '验证码必须为 6 位' },
    { pattern: '^\\d{6}$', message: '验证码必须为 6 位数字' }
  ]
}
```

### 9.2 工厂规则（推荐）

```base
import {
  ruleRequired,
  rulePhone,
  ruleLen,
  rulePattern,
  ruleWithTrigger
} from '@/uni_modules/kit-ui/components/k-form/validators.uts'

const rules = {
  phone: [ruleRequired('请输入手机号'), ruleWithTrigger(rulePhone(''), 'blur')],
  code: [ruleRequired('请输入验证码'), ruleLen(6, ''), rulePattern('^\\d{6}$', '')]
}
```

### 9.3 自定义同步校验

```base
import { ruleCustom } from '@/uni_modules/kit-ui/components/k-form/validators.uts'

const rules = {
  amount: [
    ruleCustom((value, _rule, _model) => {
      if (value == null || `${value}` == '') return '请输入金额'
      if (parseFloat(`${value}`) <= 0) return '金额必须大于 0'
      return true
    }, '', 'blur')
  ]
}
```

### 9.4 自定义异步校验

```base
import { ruleRequired, ruleAsync, ruleWithTrigger, ruleMinLength } from '@/uni_modules/kit-ui/components/k-form/validators.uts'

const rules = {
  username: [
    ruleRequired('请输入用户名'),
    ruleWithTrigger(ruleMinLength(3, '用户名至少 3 个字符'), 'blur'),
    ruleAsync((value, _rule, _model) => {
      return new Promise((resolve) => {
        uni.request({
          url: `https://api.github.com/users/${value}`,
          method: 'GET',
          success: (res) => resolve(res.statusCode == 404 ? true : '用户名已被占用'),
          fail: () => resolve(true)
        })
      })
    }, '用户名校验失败，请稍后重试', 'blur')
  ]
}
```

---

## 10. 验收建议

- 优先使用 `docs/k-form三端冒烟验收清单.md` 逐项勾选。
- 每次改动以下任一能力后，至少回归以下 4 项：
  - `validateAsync` 全量校验
  - `submit` 严格校验
  - `change -> blur` 竞态
  - `k-form.disabled` 全链路禁用生效
