---
name: kit-ui-uts-app-compat
description: kit-ui 全项目 uni-app x UTS 语法与 APP（Kotlin）编译约束、自检清单与常见报错对照。编写或修改 .uvue/.uts、provide/inject、工具库导出、页面 ref 类型，或出现 kotlin编译失败、找不到名称 value、Function invocation expected、No value passed for parameter 时使用；不限于单个组件。
---

# kit-ui UTS 与 APP 编译兼容技能

## 定位

本技能覆盖 **kit-ui 全项目** 在 uni-app x 下的 UTS 写法与 **APP → Kotlin** 编译门禁，与 `kit-ui-cross-platform-check`（条件编译、CSS 红线）互补。

- 权威案例集：`docs/UTS与APP编译约束.md`
- 表单校验实战：`docs/k-form-APP编译问题修复总结.md`（案例，非独立规范）

## 何时必须读本技能

- 新增/修改 `uni_modules/kit-ui/**/*.uts`
- 组件 `provide` / `inject` 父子通信
- 页面通过 `ref` 调用组件 `defineExpose` 方法
- WEB 能跑、APP Kotlin 编译失败
- 从 TypeScript/Vue3 Web 习惯直接写 UTS

## 一、UTS 基础语法（全项目）

| 规则 | 说明 |
| --- | --- |
| 比较 | 使用 `==` / `!=`，不用 `===` / `!==` |
| 空值 | 显式 `== null`、`!= ''`，不依赖隐式转换 |
| 脚本 | 页面/组件：`<script setup lang="uts">`，不用 `lang="ts"` |
| 条件编译 | `WEB` / `APP` / `MP-*`，禁止新增 `H5` |
| 类型文件 | 复杂类型放组件目录 `types.uts` / `*.type.uts` |

**类型定义里的 `field ?: string`（type/interface）** 通常可用；**函数形参 `fn(x ?: string)`** 在 APP 上不可靠，见下文。

## 二、`.uts` 工具库导出（高频 APP 失败点）

### 2.1 函数可选参数

```uts
// ❌ APP：调用 fn() 报 No value passed for parameter
export function fn(message ?: string) : string { ... }

// ✅ 顶层 export function + 字面量默认值
export function fn(message : string = '') : string {
  if (message != '') return message
  return '默认文案'
}
```

### 2.2 对象内挂函数

```uts
// ❌ APP：Function invocation 'xxx(...)' expected
export const Factory = { create: createItem }

// ❌ APP：return { register, unregister } 同样失败
export function createRegistry() : Registry {
  function register() {}
  return { register, unregister }
}

// ✅ 多个独立 export function，调用方直接 import
export function createItem(message : string = '') : any { ... }

// ✅ 有状态的 register/unregister 用 class（参考 cell-border.uts）
export class CellBorderRegistry {
  register(child : ItemChildType) : void { ... }
  unregister(child : ItemChildType) : void { ... }
}
export function createCellBorderRegistry() : CellBorderRegistry {
  return new CellBorderRegistry()
}
```

provide 方法引用时避免裸 `.unregister`，用箭头函数保留 `this`：

```uts
provide('k-cell-unregister-child', (child : ItemChildType) => {
  registry.unregister(child)
})
```

### 2.3 注释与 HMR

- 保持 `/** ... */` 完整；HMR 可能留下半截注释导致整文件解析失败。
- `.uts` 大改后 **全量运行到 APP**，不单靠热更新。

## 三、动态对象与 UTSJSONObject

| ❌ 禁止 | ✅ 正确 |
| --- | --- |
| `(reactiveObj as UTSJSONObject).get(k)` | 专用读取函数：先 `instanceof UTSJSONObject`，否则 `JSON.stringify` + `JSON.parse` |
| `for (let k in anyObj)` 遍历未知 `any` | 已知 `UTSJSONObject` 或工具函数封装 |
| `anyObj[key]` 读写字段 | `UTSJSONObject.get` / 序列化路径 |
| 对含 **函数** 的对象整棵 `JSON.stringify` | 只序列化纯数据；函数走直读或项级配置 |

主题等纯数据对象可参考 `utils/theme.uts`；表单 model 参考 `k-form/form-utils.uts`。

## 四、Vue 响应式与 inject（error18）

### 4.1 provide 的是 computed / ref

```uts
import { inject, type ComputedRef } from 'vue'

// ✅ 整颗 inject 可 null
const groupSize = inject<ComputedRef<string> | null>('key', null)
if (groupSize != null) {
  const size = groupSize.value
}

// ❌ APP：找不到名称 value
const groupSize = inject<any | null>('key', null)
groupSize.value

// ❌ 类型写法易与 WEB 混淆
inject<ComputedRef<string | null>>('key', null)
```

`k-checkbox`、`k-radio`、`k-form-item` 均为参考实现。

### 4.2 页面 ref 与 defineExpose

```uts
// ❌ 自定义 Expose 类型强转
const formRef = ref<KFormExpose | null>(null)

// ✅ easycom 生成的 ComponentPublicInstance
const formRef = ref<KFormComponentPublicInstance | null>(null)

// ❌ APP：?.resetValidation?.() / ?.validate?.() 可能报 Function invocation expected
complexFormRef.value?.resetValidation?.()

// ✅ 先取 ref，判空后直接调用
const form = complexFormRef.value
if (form != null) {
  form.resetValidation()
}
let valid = false
if (form != null) {
  valid = form.validate()
}
```

新增组件若暴露方法，页面 ref 类型以编译器生成的 `K[Name]ComponentPublicInstance` 为准。

### 4.3 生命周期 + 可变变量 Smart cast

```uts
// ❌ APP：registeredChild 在闭包中被修改，Smart cast 失败
onBeforeUnmount(() => {
  if (cellUnregister != null && registeredChild != null) {
    cellUnregister(registeredChild)
  }
})

// ✅ 复制到局部 val 再使用
onBeforeUnmount(() => {
  const unregister = cellUnregister
  const childToUnregister = registeredChild
  if (unregister != null && childToUnregister != null) {
    unregister(childToUnregister)
    registeredChild = null
  }
})
```

## 五、`.uvue` 组件开发补充

与 `kit-ui-cross-platform-check` 叠加：

1. **样式**：禁止 `grid`、`gap`、`@media`；字体相关只写在 `text`/`button`。
2. **APP 状态动效**：动效属性不得写在响应式 `:style`；用 `ref<UniElement>` + `setProperty` → skill `kit-ui-app-animation`。
3. **演示页**：需滚动时 APP 用 `scroll-view` 条件包裹；新页面同步 `pages.json`。

## 六、常见 Kotlin 报错 → 处理

| 报错关键词 | 优先检查 |
| --- | --- |
| `Function invocation '...' expected` | 对象属性是否直接引用了函数名 |
| `No value passed for parameter` | 函数是否仍用 `?:` 可选参且调用时省略 |
| `Anonymous functions cannot specify default values` | 对象内箭头函数是否带默认参 |
| `找不到名称 value`（error18） | `inject<any>` + `.value`；改 `ComputedRef` |
| `ClassCastException` + ReactiveObject | 是否强转 `UTSJSONObject` |
| 随机 `TS1005` / 注释当代码 | `.uts` 文件头注释是否损坏；全量重编译 |

官方已知问题索引：<https://doc.dcloud.net.cn/uni-app-x/uts/compiler-known-issues.html>

## 七、提交前自检清单

### `.uts` 文件

```text
- [ ] 对外函数无 `param ?: type`（改为 param : T = 默认值）
- [ ] 无 { method: fnName } 函数引用赋值
- [ ] 无 return { register, unregister } 对象挂函数（改用 class）
- [ ] 无对象内 (x : T = v) => 箭头默认参
- [ ] 动态对象读取有 UTSJSONObject / JSON 路径，无 any 强转
- [ ] 注释块完整
```

### `.uvue` 组件（含 inject / expose）

```text
- [ ] inject computed/ref 使用 ComputedRef<T> | null + type ComputedRef 导入
- [ ] defineExpose 与页面 ref 类型一致（ComponentPublicInstance）
- [ ] 页面 ref 调用 expose 方法：先 const form = ref.value，再 if (form != null) form.method()
- [ ] onMounted/onBeforeUnmount 中可变 let 先复制到局部 const 再传入回调
- [ ] 未在 APP 用 :style 驱动过渡动效属性
```

### 编译验证

```text
- [ ] 全量运行到 APP（Android）通过 Kotlin 编译
- [ ] WEB 冒烟无阻塞性错误
- [ ] 改 API 后执行 kit-ui-doc-sync
```

## 八、推荐工作流

```text
写 uvue/uts → kit-ui-uts-app-compat（本技能）
           → kit-ui-cross-platform-check（CSS/条件编译）
           → 有状态动效 → kit-ui-app-animation
           → 全量 APP 编译
           → kit-ui-doc-sync（若改 API）
```

## 九、项目内参考实现

| 场景 | 参考文件 |
| --- | --- |
| inject ComputedRef | `k-checkbox.uvue`、`k-radio.uvue`、`k-form-item.uvue` |
| UTSJSONObject / reactive 读值 | `k-form/form-utils.uts` |
| 独立 export 工具函数 | `k-form/validators.uts`、`k-text/utils.uts` |
| 有状态 registry（class） | `k-cell/cell-border.uts` |
| APP setProperty 动画 | `k-switch.uvue`、`k-checkbox.uvue` |
| 主题 provide | `k-config.uvue` |

## 十、k-form 实战补充（2026-06-25）

### 10.1 UTS Promise 与 Kotlin 映射

- `catch((_err : any) => ...)` 在 APP 端可能触发 `error25`（候选签名不匹配）。
- 建议写法：`catch((_err) => ...)`，避免显式 `: any`。
- 涉及场景：`validate-engine.uts`、`k-form-item.uvue`、`k-form.uvue`、页面 demo 的 Promise 链。

### 10.2 函数表达式递归限制

- UTS 不支持函数表达式递归调用（`UTS110111165`）。
- 不要在表达式函数里自调用（如 `run(index + 1)`）。
- 改为：
  - 命名函数声明（非表达式）且先定义后调用，或
  - `forEach + Promise 链` 的非递归顺序执行。

### 10.3 APP uvue 样式白名单（表单场景）

- `display` 仅支持 `flex | none`，禁止 `display: block`。
- `<input>` 上禁止 `line-height`（仅 `text | button | textarea` 支持）。
- 原生输入样式建议：
  - 用 `min-height + padding + box-sizing` 控制高度，
  - 不写 `line-height`，不写非白名单布局值。

### 10.4 本次已验证修复点（k-form）

- 已修：`display: block` 警告、`input line-height` 警告。
- 已修：`catch` 签名导致的 `error25`。
- 已修：`validateAsync` 递归表达式导致的 `UTS110111165`。
- 已落地：`asyncValidator` / `validateAsync` / `validateFieldAsync` / `validating` 状态链路。

### 10.5 新增案例：error17 参数可空性不匹配（`Any?` -> `Any`）

- 典型报错：`参数类型不匹配：实际类型为 'Any?'，预期类型为 'Any'`（error17）。
- 高频场景：工具函数返回 `any | null`，但下游函数形参写成 `any`（非可空）。
- 本次示例：`form-utils.uts` 中 `readObjectProperty(...)` 返回可空值，传给 `resolveEnumSignature(value : any)` 触发 Kotlin 编译失败。
- 标准修法：统一可空链路，形参改为 `any | null`，并在函数内部显式判空。

```uts
// ❌ 形参非可空，调用方传入 any | null
function resolveEnumSignature(value : any) : string { ... }

// ✅ 与调用方保持可空一致
function resolveEnumSignature(value : any | null) : string {
  if (!Array.isArray(value)) return ''
  ...
}
```

### 10.6 新增案例：error18 名称找不到（const 前向引用）

- 典型报错：`找不到名称“xxx”`（error18）。
- 高频场景：`const` 变量/计算属性在声明前被引用（尤其是 `computed` 之间互相依赖时）。
- 本次示例：`k-form-item.uvue` 中 `showStatusMessage` 先引用 `statusText`，后声明 `statusText`，APP Kotlin 编译失败。
- 标准修法：被依赖的 `const/computed` 必须先声明；或改为 `function` 声明（可提升）再调用。

```uts
// ❌ 前向引用（APP 可能报 error18）
const showStatusMessage = computed(() => statusText.value != '')
const statusText = computed(() => ...)

// ✅ 先声明被依赖项
const statusText = computed(() => ...)
const showStatusMessage = computed(() => statusText.value != '')
```

### 10.7 针对本轮报错的提交前加查项

```text
- [ ] 调用链中凡是来源于 readObjectProperty/readModelProperty 的值，形参与变量可空性一致（any | null）
- [ ] computed/const 无前向引用，依赖项声明顺序为“被依赖在前、依赖者在后”
- [ ] APP 全量编译至少执行一次，避免 HMR 掩盖声明顺序问题
```
