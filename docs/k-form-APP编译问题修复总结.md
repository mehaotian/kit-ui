# k-form APP 编译问题修复总结（案例）

> **说明**：本文记录 k-form 表单校验在 APP 联调中的具体问题与修复，作为全项目 UTS 约束的 **实战案例**。
>
> **全项目通用规范**见：`docs/UTS与APP编译约束.md`
>
> **AI 自检技能**：`.cursor/skills/kit-ui-uts-app-compat/SKILL.md`

## 一、问题与修复对照

| 现象（编译/运行） | 根因 | 修复方式 | 涉及文件 |
| --- | --- | --- | --- |
| `ClassCastException: BasicFormDataReactiveObject` | 将 `reactive` 强转为 `UTSJSONObject` | `provide` 原始 `model`；读值走 `readModelProperty` | `form-utils.uts`、`k-form.uvue`、`k-form-item.uvue` |
| `找不到名称 validate` / `KFormExpose` 强转失败 | 页面 ref 类型与 easycom 实例不一致 | `KFormComponentPublicInstance`，`formRef.value?.validate?.()` | `pages/form/*.uvue` |
| `Function invocation 'ruleRequired(...)' expected` | 对象属性直接引用函数名 | 移除 `FormRules` 聚合，仅 `export function ruleXxx` | `validators.uts` |
| `No value passed for parameter 'message'` | 函数 `?:` 可选参 | `message : string = ''` + `resolveRuleMessage` | `validators.uts` |
| `Anonymous functions cannot specify default values` | 对象内箭头函数默认参 | 不用 `FormRules` 对象字面量 | `validators.uts` |
| `找不到名称 value`（error18） | `inject<any>` + `.value` | `inject<ComputedRef<T> \| null>` + `type ComputedRef` | `k-form-item.uvue` |
| `getErrorMessage` 缺失 | 注册表单项不完整 | `registerFormItem` 传入 `getErrorMessage` | `k-form-item.uvue` |
| `form-utils.uts` 语法错误 / 重复定义 | HMR 损坏注释块 | 恢复文件；全量重编译 APP | `form-utils.uts` |

## 二、本模块正确写法摘要

### model / rules

- `provide(computed(() => props.model))`，不转 `UTSJSONObject`
- 字段值：`readModelProperty`；含 `validator` 的 rules 不整对象 JSON 序列化

### 规则工厂

```uts
import { ruleRequired, rulePhone, ruleRange } from '.../validators.uts'

const rules = {
  phone: [ruleRequired('请输入手机号'), rulePhone()],
  age: [ruleRequired('请输入年龄'), ruleRange(1, 120)]
}
```

### inject

```uts
const formModel = inject<ComputedRef<any> | null>(K_FORM_MODEL_KEY, null)
```

## 三、模块文件清单（Phase 1）

| 文件 | 作用 |
| --- | --- |
| `form-utils.uts` | model/rules 读写 |
| `validators.uts` | `ruleRequired` 等独立函数 |
| `validate-engine.uts` | `validateSync` |
| `form-context.uts` | inject 键、blur 辅助 |
| `form.type.uts` | 类型定义 |
| `utils.uts` | 统一 re-export |

## 四、演示页

| 页面 | 职责 |
| --- | --- |
| `pages/form/form.uvue` | 基础布局、状态、组合控件 |
| `pages/form-validate/form-validate.uvue` | rule 工厂、type、pattern、getFieldsError |

开发计划：`docs/k-form表单校验开发计划.md`
