# UTS 与 APP 编译约束

本文档为 **kit-ui 全项目** 在 uni-app x 下编写 UTS / 运行到 APP（Kotlin）的约束说明，适用于所有组件、页面与 `uni_modules/kit-ui` 下的工具库。

AI 自检技能：`.cursor/skills/kit-ui-uts-app-compat/SKILL.md`

跨端样式与条件编译：`.cursor/skills/kit-ui-cross-platform-check/SKILL.md`、`docs/跨端适配开发文档.md`

---

## 1. 为什么 WEB 能过、APP 不过

uni-app x 在 WEB 端多走 JS/TS 检查，APP 端将 UTS **编译为 Kotlin**。二者能力不一致：

- WEB 常仅为 **warning**，APP 为 **编译失败**
- **以全量运行到 Android/iOS 的 Kotlin 编译结果为门禁**
- 修改 `.uts` 后优先 **全量重编译**，避免 HMR 缓存损坏文件

---

## 2. UTS 语法红线（全项目）

| 项 | 要求 |
| --- | --- |
| 相等比较 | `==` / `!=` |
| 空值判断 | 显式 `== null`、`!= ''` |
| 页面/组件脚本 | `<script setup lang="uts">` |
| 条件编译 | `WEB` / `APP` / `MP-*`，不用 `H5` |
| 类型定义位置 | 组件目录 `types.uts`、`*.type.uts` |

**区分**：`type` / `interface` 里 `field ?: string` 一般可用；**函数参数** `fn(x ?: string)` 在 APP 上不可靠（见第 3 节）。

---

## 3. `.uts` 工具库规范

### 3.1 函数可选参数

```uts
// ❌ 调用 rulePhone() 时 APP 报：No value passed for parameter 'message'
export function rulePhone(message ?: string) : any { ... }

// ✅ 使用字面量默认值
export function rulePhone(message : string = '') : any {
  const msg = message != '' ? message : '手机号格式不正确'
  return { type: 'phone', message: msg }
}
```

### 3.2 禁止「对象聚合函数」

Kotlin 不允许把函数名直接赋给对象属性，也不允许对象内箭头函数带默认参数。

```uts
// ❌ Function invocation 'ruleRequired(...)' expected
export const FormRules = { required: ruleRequired }

// ❌ Anonymous functions cannot specify default values
export const FormRules = { required: (m : string = '') => ruleRequired(m) }

// ✅ 独立 export，文档写明 import 方式
export function ruleRequired(message : string = '') : any { ... }
export function rulePhone(message : string = '') : any { ... }
```

### 3.3 注释完整性

`/**` 与 `*/` 必须成对。热更新中断可能导致注释块损坏，引发整文件语法错误（如误报 `toNumberValue` 重复定义）。

---

## 4. 动态对象与 UTSJSONObject

`reactive()` 返回的对象 **不是** `UTSJSONObject`，禁止强转。

| 场景 | 做法 |
| --- | --- |
| 读字段 | `instanceof UTSJSONObject` 则 `.get(key)`，否则 `JSON.stringify` + `JSON.parse<UTSJSONObject>` |
| 遍历 | 不对 `any` 使用 `for...in` / `obj[key]`；用工具函数封装 |
| 含函数的配置 | 不对整对象 JSON 序列化（函数会丢失） |

项目参考：`uni_modules/kit-ui/components/k-form/form-utils.uts`

---

## 5. provide / inject 与 ComputedRef

父组件 `provide` 的若是 `computed()` / `ref()`，子组件必须按 **ComputedRef** 注入：

```uts
import { inject, type ComputedRef } from 'vue'

const formModel = inject<ComputedRef<any> | null>(K_FORM_MODEL_KEY, null)
if (formModel != null) {
  const model = formModel.value  // ✅
}

// ❌ APP error18：找不到名称 value
const formModel = inject<any | null>(K_FORM_MODEL_KEY, null)
formModel.value
```

类型约定：

- 整颗 inject 可 null：`inject<ComputedRef<T> | null>(key, null)`
- 不要写成 `inject<ComputedRef<T | null>>(key, null)`（与 WEB/APP 语义易混）

参考：`k-checkbox.uvue`、`k-radio.uvue`、`k-form-item.uvue`

---

## 6. 页面 ref 与 defineExpose

页面通过 `ref` 调用组件暴露方法时，使用 easycom 生成的 **ComponentPublicInstance**，勿自定义 Expose 类型强转。

```uts
const formRef = ref<KFormComponentPublicInstance | null>(null)
const ok = formRef.value?.validate?.() ?? false
```

---

## 7. 与样式、动画的边界

本约束专注 **UTS → Kotlin**；以下内容由其他文档/技能负责：

| 主题 | 文档/技能 |
| --- | --- |
| 禁止 grid、gap、@media；字体只在 text/button | `kit-ui-cross-platform-check` |
| APP 状态动效禁止响应式 `:style` | `kit-ui-app-animation` |
| 平台 API 差异 | `docs/跨端适配开发文档.md` |

---

## 8. 常见报错对照

| 报错 | 常见原因 | 处理 |
| --- | --- | --- |
| `Function invocation 'xxx(...)' expected` | 对象属性引用函数名 | 改为独立 `export function` |
| `No value passed for parameter` | `?:` 可选参 + 省略调用 | `param : T = 默认值` |
| `Anonymous functions cannot specify default values` | 对象内箭头函数默认参 | 顶层命名函数 |
| `找不到名称 value`（error18） | `inject<any>` + `.value` | `ComputedRef<T> \| null` |
| `ClassCastException`（ReactiveObject） | reactive 强转 UTSJSONObject | JSON / 专用读值函数 |
| `.uts` 随机语法错误 | 注释块损坏 | 检查文件头，全量重编译 |

更多：https://doc.dcloud.net.cn/uni-app-x/uts/compiler-known-issues.html

---

## 9. 提交前检查（全项目）

**`.uts`**

- [ ] 无函数形参 `?:`
- [ ] 无对象内函数引用 / 带默认参的箭头函数
- [ ] 动态对象读取路径正确，无 reactive 强转
- [ ] 注释块完整

**`.uvue`**

- [ ] inject 响应式数据用 `ComputedRef` + 正确导入
- [ ] 页面 ref 类型为 `K*ComponentPublicInstance`
- [ ] 条件编译、样式、APP 动效符合跨端技能

**编译**

- [ ] 全量运行到 APP 通过
- [ ] API 变更已 `kit-ui-doc-sync`

---

## 10. 案例：k-form 校验（非独立规范）

k-form Phase 1 踩坑与修复明细见：`docs/k-form-APP编译问题修复总结.md`（作为本约束的 **实战案例**，规则以本文为准）。
