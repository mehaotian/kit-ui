# k-form 开发进度交接（复制给新会话用）

> 更新说明：Phase 1 代码主体已落地，APP Kotlin 编译问题已按全项目 UTS 约束修复；**Phase 2（自定义/异步/trigger）尚未开始**。
>
> 关联：`docs/k-form表单校验开发计划.md`（总计划）、`docs/UTS与APP编译约束.md`（全项目 UTS 红线）

---

## 1. 项目与仓库

- **仓库**：kit-ui（uni-app x 组件库）
- **组件路径**：`uni_modules/kit-ui/components/k-form/`、`k-form-item/`
- **演示页**：`pages/form/form.uvue`（基础）、`pages/form-validate/form-validate.uvue`（校验增强）
- **pages.json** 已注册上述两页；首页入口 `pages/index/index.uvue` → 表单分类

---

## 2. 阶段进度总览

| 阶段 | 状态 | 说明 |
| --- | --- | --- |
| **Phase 0** 基线稳定 | ✅ 基本完成 | APP model/rules、ComponentPublicInstance ref、button-native 条件编译 |
| **Phase 1** 规则+引擎 | ✅ 代码完成 / ⚠️ 三端冒烟待确认 | 见下文「已完成清单」 |
| **Phase 2** 自定义+异步+trigger | ❌ 未开始 | **建议下一步** |
| **Phase 3** 体验增强 | ❌ 未开始 | enum、scrollToError、控件协同等 |
| **Phase 4** 沉淀规范 | 🔶 部分 | UTS 技能/文档已做；表单专项规则参考未写 |

---

## 3. Phase 1 已完成（代码层面）

### 3.1 文件清单

| 文件 | 职责 |
| --- | --- |
| `k-form/k-form.uvue` | 容器、provide、validate/reset/submit/getFieldsError |
| `k-form-item/k-form-item.uvue` | 标签、错误 UI、注册表单项、validate |
| `k-form/form-utils.uts` | model/rules 读写（reactive 兼容）、规则列表规范化 |
| `k-form/validators.uts` | 内置正则、`ruleRequired`/`rulePhone` 等 **独立 export 函数** |
| `k-form/validate-engine.uts` | `validateSync`、`validateFormField`（兼容） |
| `k-form/form-context.uts` | inject 键、`useFormItemContext`、`createFormBlurHandler` |
| `k-form/form.type.uts` | `FormItemInstance`、`KFormExpose` 等 |
| `k-form/utils.uts` | 统一 re-export |
| `k-form/README.md` | API、rule 工厂、原生双轨说明 |

### 3.2 已实现能力

- **规则**：`required`、`minLength`/`maxLength`、`min`/`max`、`pattern`/`regexp`
- **type 预设**：`string`、`number`、`integer`、`phone`/`mobile`、`email`、`url`、`array`、`boolean`
- **规则工厂**：`ruleRequired`、`rulePhone`、`ruleEmail`、`ruleUrl`、`ruleRange`、`ruleMinLength`、`ruleMaxLength`、`rulePattern`（**无 `FormRules` 对象**，APP 不支持）
- **表单 API**：`validate()`、`resetValidation()`、`submit()`、`getFieldsError()`
- **事件**：`validate(valid, errors)`、`submit(model)`
- **表单项**：错误态样式、`getErrorMessage` 注册、主题变量
- **跨端数据**：`readModelProperty` 不强转 reactive；`inject<ComputedRef<T> | null>`

### 3.3 演示页

| 页面 | 内容 |
| --- | --- |
| `pages/form/form.uvue` | 基础用法、状态、边界（radio/checkbox/switch/textarea）、主题 |
| `pages/form-validate/form-validate.uvue` | rule 工厂、type 预设、pattern/regexp、getFieldsError、原生 input |

### 3.4 Phase 1 DoD 自检（待新会话确认）

- [ ] WEB / APP / 微信 MP 三端冒烟（手机、邮箱、pattern、提交失败展示）
- [ ] APP 全量编译无 Kotlin 错误
- [ ] 原生 `input` + v-model 校验在 APP 实测
- [ ] 计划文档 `k-form表单校验开发计划.md` 中 Phase 1 任务勾选更新

---

## 4. 明确未做（Phase 2 及以后）

### 4.1 引擎层（validate-engine.uts）

- [ ] 规则字段 `validator` 同步回调（true/false/string）
- [ ] `asyncValidator` + `validateAsync`
- [ ] 按 `trigger` 过滤规则（submit / blur / change）
- [ ] 含 `validator` 的 rules **不能** JSON 序列化整对象（需直读或项级 rules）

### 4.2 API 层

- [ ] `k-form.validateField(prop)` / 异步校验入口
- [ ] `k-form-item` 响应 `trigger`（blur/change 自动校验）
- [ ] `k-input` / `k-textarea` 转发 blur/change 到表单项
- [ ] `k-form-item--validating` 状态类
- [ ] async 防抖（同字段约 300ms）

### 4.3 演示与文档

- [ ] 异步 demo（uni.request 模拟用户名占用）
- [ ] 跨字段校验 demo（密码/确认密码）
- [ ] `docs/k-form校验规则参考.md`（Phase 4）
- [ ] `k-form-item/README.md` 与代码同步（若有 API 变更）

### 4.3 Phase 3 摘录（更远）

- `resetValidation(props?)`、`clearValidate`、`validateStatus` 手动控制
- radio/checkbox/switch change 触发
- scrollToError（APP scroll-view）
- 可选 `k-form-control` 薄包装

---

## 5. APP 编译踩坑（必读，已沉淀）

**全项目规范**：`docs/UTS与APP编译约束.md`  
**AI 技能**：`.cursor/skills/kit-ui-uts-app-compat/SKILL.md`  
**k-form 案例**：`docs/k-form-APP编译问题修复总结.md`

要点摘要：

1. 函数参数用 `message : string = ''`，不用 `message ?: string`
2. 禁止 `export const X = { fn: ruleFn }` 与对象内带默认参的箭头函数
3. `inject` computed 用 `ComputedRef<T> | null`，并 `import { type ComputedRef } from 'vue'`
4. 禁止 `reactive` 强转 `UTSJSONObject`；读值走 `readModelProperty`
5. 页面 ref：`KFormComponentPublicInstance`，`formRef.value?.validate?.()`
6. 改 `.uts` 后 **全量运行到 APP**，不单靠 HMR

---

## 6. 推荐下一步（Phase 2 实施顺序）

与计划「关键路径」一致：

```text
1. form-utils：rules 含 validator 时的安全读取（不 JSON 整对象）
2. validate-engine：validator 同步 → validateAsync + asyncValidator
3. k-form / k-form-item：validateField、trigger 过滤
4. k-input / k-textarea：blur/change 转发（或文档约定）
5. form-validate 页：async demo + 跨字段 demo
6. 三端冒烟 + README/trigger 说明 + 更新计划文档 Phase 2 勾选
```

**Phase 2 任务 ID（计划原文）**：P2-1 ~ P2-10，见 `docs/k-form表单校验开发计划.md` §6 Phase 2。

---

## 7. 关键代码约定（续开发勿改坏）

### 规则工厂用法

```uts
import { ruleRequired, rulePhone, ruleRange } from '@/uni_modules/kit-ui/components/k-form/validators.uts'

const rules = {
  phone: [ruleRequired('请输入手机号'), rulePhone()],
  age: [ruleRequired('请输入年龄'), ruleRange(1, 120)]
}
```

### 页面 ref

```uts
const formRef = ref<KFormComponentPublicInstance | null>(null)
formRef.value?.validate?.()
formRef.value?.getFieldsError?.()
```

### provide 键（form-context.uts）

`K_FORM_MODEL_KEY`、`K_FORM_RULES_KEY`、`K_FORM_ITEM_VALIDATE_KEY` 等，子项用 `ComputedRef` inject。

### 原生 input blur

- 在 **能 inject 到 k-form-item 的子组件** 内：`createFormBlurHandler()`
- 页面级 slot 内原生 input：提交时 `formRef.validate()` 或待 Phase 2 trigger

---

## 8. 给新会话的提示词模板

```text
继续 kit-ui k-form 开发，从 Phase 2 开始：
- 先读 docs/k-form开发进度交接.md 与 docs/k-form表单校验开发计划.md Phase 2
- 遵守 docs/UTS与APP编译约束.md / skill kit-ui-uts-app-compat
- 实现 validator、asyncValidator、trigger、validateField
- k-input blur 联动、form-validate 异步 demo
- 改完后 APP 全量编译 + 更新 README
```

---

## 9. 相关技能命令

| 技能 | 用途 |
| --- | --- |
| `kit-ui-uts-app-compat` | UTS / Kotlin 编译红线 |
| `kit-ui-cross-platform-check` | 条件编译、CSS 红线 |
| `kit-ui-app-animation` | validating 动效勿用 :style |
| `kit-ui-doc-sync` | API 变更后文档同步 |
