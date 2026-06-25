# k-form 开发进度交接（复制给新会话用）

> 更新说明：Phase 1 ~ Phase 3 核心目标已完成，`k-form` 三端冒烟验收已通过；当前进入 **Phase 4 收口与沉淀**。
>
> 关联：`docs/k-form表单校验开发计划.md`（总计划）、`docs/UTS与APP编译约束.md`（全项目 UTS 红线）
>
> 验收清单：`docs/k-form三端冒烟验收清单.md`

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
| **Phase 1** 规则+引擎 | ✅ 已完成 | 三端冒烟已通过 |
| **Phase 2** 自定义+异步+trigger | ✅ 已完成 | async 链路、trigger、validating、示例、严格提交已落地 |
| **Phase 3** 体验增强 | ✅ 已完成 | `enum/len/whitespace`、`resetValidation(props?)/clearValidate`、`validateStatus`、message 优先级、disabled 生效已落地 |
| **Phase 4** 沉淀规范 | 🔶 进行中 | UTS 技能、规则参考、发布说明、看板状态已同步；待专项约束与性能基线实测 |

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

### 3.4 Phase 1 DoD 自检（已完成）

- [x] WEB / APP / 微信 MP 三端冒烟（手机、邮箱、pattern、提交失败展示）
- [x] APP 全量编译无 Kotlin 错误
- [x] 原生 `input` + v-model 校验在 APP 实测
- [x] 计划文档 `k-form表单校验开发计划.md` 中 Phase 1 任务勾选更新

---

## 4. Phase 2 当前进度（2026-06-25）

### 4.1 已完成（代码已落地）

- [x] `validator` 同步回调（true/false/string）
- [x] `asyncValidator` + `validateAsync`（含 `ruleAsync`）
- [x] `k-form.validateAsync()` / `validateFieldAsync()`
- [x] `trigger`：submit / blur / change
- [x] `k-input` / `k-textarea` blur/change 联动
- [x] `k-radio(-group)` / `k-checkbox(-group)` / `k-switch` change 联动
- [x] `k-form-item--validating` 状态与“校验中...”提示
- [x] async 防抖（change 300ms）+ 竞态保护（仅回写最新结果）
- [x] 跨字段校验 demo（密码 / 确认密码）
- [x] 异步可用性 demo（本地模拟远程查重）

### 4.2 待收尾（进入 Phase 3 前）

- [x] 将异步 demo 从 `setTimeout` 升级为 `uni.request`（失败回落本地兜底）
- [x] WEB / APP / 微信 MP 三端完整冒烟记录
- [x] `docs/k-form表单校验开发计划.md` 勾选与里程碑状态同步到最新

### 4.3 Phase 3 进度（下一步）

- [x] `enum` / `len` / `whitespace` 规则扩展（引擎 + 工厂 + demo）
- [x] `resetValidation(props?)`、`clearValidate(props?)`（k-form expose）
- [x] `validateStatus` 手动控制（k-form-item + demo）
- [x] 错误文案优先级（项级 > 表单级 > 默认模板）
- [ ] `scrollToError`（可选，APP `scroll-view` 方案）

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

## 6. 推荐下一步（Phase 2 收尾 → Phase 3）

建议按以下顺序推进：

```text
1. 评估可选项：scrollToError（APP scroll-view 方案）
2. 补充 Phase 4 沉淀项：规则专项约束、cross-platform 扩展
3. 完成一期验收清单勾选与性能基线记录
```

**Phase 2 任务 ID（计划原文）**：P2-1 ~ P2-10，见 `docs/k-form表单校验开发计划.md` §6 Phase 2。

---

## 7. 关键代码约定（续开发勿改坏）

### 规则工厂用法

```uts
import { ruleRequired, rulePhone, ruleRange, ruleWithTrigger } from '@/uni_modules/kit-ui/components/k-form/validators.uts'

const rules = {
  phone: [ruleRequired('请输入手机号'), rulePhone('')],
  age: [ruleRequired('请输入年龄'), ruleRange(1, 120, '')],
  username: [ruleWithTrigger({ minLength: 2, message: '至少 2 个字符' }, 'blur')]
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

- 在 **能 inject 到 k-form-item 的子组件** 内：`createFieldHandler('blur')`
- 页面级 slot 内原生 input：`formRef.value?.validateField?.('phone', 'blur')`

---

## 8. 给新会话的提示词模板

```text
继续 kit-ui k-form 开发，从 Phase 4 收口开始：
- 先读 docs/k-form开发进度交接.md 与 docs/k-form表单校验开发计划.md Phase 4
- 遵守 docs/UTS与APP编译约束.md / skill kit-ui-uts-app-compat
- 收口文档与看板状态
- 评估 scrollToError 可选能力
- 产出表单专项规则参考文档
```

---

## 9. 相关技能命令

| 技能 | 用途 |
| --- | --- |
| `kit-ui-uts-app-compat` | UTS / Kotlin 编译红线 |
| `kit-ui-cross-platform-check` | 条件编译、CSS 红线 |
| `kit-ui-app-animation` | validating 动效勿用 :style |
| `kit-ui-doc-sync` | API 变更后文档同步 |
