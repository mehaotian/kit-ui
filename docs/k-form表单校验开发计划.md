# k-form 表单校验开发计划

> 版本：v1.4  
> 状态：执行中（Phase 1/2 核心已完成，Phase 3 已启动）  
> 关联组件：`k-form`、`k-form-item`、`k-input`、`k-textarea` 及表单生态控件  
> 关联文档：`docs/k-button双轨策略规范.md`、`docs/跨端适配开发文档.md`、`docs/一期组件迭代看板.md`

---

## 1. 背景与目标

### 1.1 背景

kit-ui 已完成 `k-form` / `k-form-item` 基础骨架，并在 APP 端打通「model + rules + 提交校验」最小链路。当前能力仍偏简陋：

- 规则类型少（必填、长度、数值、简单 `pattern`）
- 无预设校验（手机、邮箱、URL 等）
- 无自定义 / 异步校验
- 无 `blur` / `change` 触发策略
- 原生 `input` / `textarea` 未形成规范用法
- `validate` 错误汇总、单字段校验 API 不完整

业务侧需要一套**覆盖录入、校验、提交、反馈全链路**的表单方案，且必须适配 **WEB / APP / 小程序** 的 uni-app x 约束。

### 1.2 目标（一期表单校验专项）

| 维度 | 目标 |
|------|------|
| 功能 | 对标优秀三方库核心能力，取长补短，不做全量复制 |
| 生态 | 模型驱动、easycom 友好、与 `uni.request` 等原生能力自然结合 |
| 跨端 | WEB / APP / MP-* 行为一致，差异用条件编译隔离 |
| 扩展 | 支持 k- 组件与原生控件双轨（类比 k-button 双轨策略） |
| 可维护 | 规则引擎与 UI 解耦，UTS 类型与运行时分离 |

### 1.3 非目标（明确边界）

- 不实现完整 JSON Schema 引擎
- 不为每个原生控件属性做代理层组件
- 不封装具体业务接口（注册、登录流程由业务实现，组件只提供 `asyncValidator` 钩子）
- 不在一期做嵌套对象 `user.address.city` 级联（列入二期）
- 不依赖 `grid`、`gap`、`@media` 等 kit-ui 红线样式

---

## 2. 对标分析与取舍

### 2.1 参考对象

| 库 | 可借鉴 | 不采纳 / 需改造 |
|----|--------|----------------|
| **Element Plus Form** | `rules` 声明式、`prop` 字段绑定、`trigger`、同步 `validator` | Vue 3 纯 JS 运行时假设；部分 API 在 UTS 需改写 |
| **Ant Design Form** | `validateFields`、`resetFields`、错误汇总 | React Hooks 模式；依赖动态对象遍历 |
| **Vant Form** | 移动端交互、轻量 rules、失焦校验 | 部分 H5 专用实现 |
| **async-validator** | 规则管道、type 预设、async 规则链 | 强依赖 JS 动态特性，需 UTS 重写核心 |
| **uni-ui / uView** | uni 场景习惯、`uni.request` 结合 | 非 uni-app x / 非 UTS 体系 |

### 2.2 kit-ui 差异化定位

**「uni-app x 原生友好的模型驱动表单」**：

1. **值来源统一**：校验只读 `model[prop]`，控件是 `k-input` 还是原生 `input` 不影响校验
2. **UTS 安全**：规则读取不走 `JSON.stringify` 丢函数；`any` 上不滥用 `obj[key]` / `for...in`
3. **双轨控件**：k- 组件负责体验；原生控件 + 文档 / 工具函数负责平台能力
4. **实例类型规范**：页面 ref 使用 `KFormComponentPublicInstance`，不用自定义 Expose 强转

---

## 3. 总体架构

### 3.1 分层结构

```text
┌──────────────────────────────────────────────────────────┐
│  业务层：pages/form、业务页面 rules 声明                  │
└─────────────────────────┬────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────┐
│  API 层：k-form / k-form-item / useFormItem（可选）        │
│  - 布局、错误展示、注册表单项、对外 validate API           │
└─────────────────────────┬────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────┐
│  规则层：validators.uts / form-rules.uts                   │
│  - 预设 type、正则库、FormRules 工厂、message 模板         │
└─────────────────────────┬────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────┐
│  引擎层：validate-engine.uts                               │
│  - validateSync / validateAsync / 规则管道 / 错误结构      │
└─────────────────────────┬────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────┐
│  基础层：form-utils.uts（读写 model/rules，跨端兼容）      │
│  - asJSONObject / readObjectProperty（含函数保留路径）     │
└──────────────────────────────────────────────────────────┘
```

### 3.2 核心数据流（逻辑闭环）

```text
[用户输入]
    → v-model 写入 model[prop]
    →（可选）trigger: change/blur 触发单字段校验
    → validate-engine 读取 model[prop] + rules[prop]
    → 同步规则 → 立即得到 valid/message
    → 异步规则 → validating 态 → Promise → 更新 message
    → k-form-item 展示 error / validating
    → k-form 汇总 errors → emit('validate')
    → 全部通过 → submit / 业务提交
```

### 3.3 模块文件规划（目标态）

| 文件 | 职责 |
|------|------|
| `k-form/k-form.uvue` | 容器、provide、实例 API、submit |
| `k-form-item/k-form-item.uvue` | 标签、错误 UI、注册、trigger 响应 |
| `k-form/form.type.uts` | 对外类型（规则、结果、实例方法签名文档） |
| `k-form/form-utils.uts` | model/rules 安全读写（从 `utils.uts` 拆分） |
| `k-form/validators.uts` | 内置 type、正则、FormRules 工厂 |
| `k-form/validate-engine.uts` | 同步/异步校验引擎 |
| `k-form/form-context.uts` | inject key 常量、`useFormItemContext` |
| `k-form/README.md` | 组件 API 与示例 |
| `docs/k-form表单校验开发计划.md` | 本文档 |

---

## 4. 能力规划（功能清单）

### 4.1 规则字段（Rule Schema）

#### 4.1.1 同步规则（P0 ~ P1）

| 字段 | 类型 | 说明 | 阶段 |
|------|------|------|------|
| `required` | boolean | 必填 | 已有 |
| `message` | string | 错误文案 | 已有 |
| `type` | string | 见 4.2 预设类型 | P0 |
| `min` / `max` | number | 数值范围 | 已有 |
| `minLength` / `maxLength` | number | 字符串长度 | 已有 |
| `pattern` | string | 正则字符串 | 已有 |
| `regexp` | string | `pattern` 别名 | P0 |
| `enum` | array | 枚举值 | P1 |
| `len` | number | 固定长度 | P1 |
| `whitespace` | boolean | 是否允许仅空白 | P1 |
| `trigger` | string | `submit` / `blur` / `change` | P1 |
| `validator` | function | 自定义同步校验 | P1 |

#### 4.1.2 异步规则（P1）

| 字段 | 类型 | 说明 |
|------|------|------|
| `asyncValidator` | function | 返回 `Promise<boolean \| string>` |
| `asyncMessage` | string | 异步失败默认文案 |

#### 4.1.3 校验结果结构（统一）

```base
type FormValidateResult = {
  valid: boolean
  message: string
  field?: string
  rule?: any
}
```

表单级汇总：

```base
type FormErrors = UTSJSONObject  // { [prop: string]: string }
```

### 4.2 预设 type（P0）

| type | 说明 | 实现要点 |
|------|------|----------|
| `string` | 非空字符串（配合 required） | 类型检查 |
| `number` | 数字或可解析数字 | `parseFloat` |
| `integer` | 整数 | 正则或取模 |
| `email` | 邮箱 | 内置正则 |
| `phone` / `mobile` | 大陆手机号 | 内置正则，可配置 |
| `url` | URL | 内置正则 |
| `idCard` | 身份证 | P2，校验位可选 |
| `array` | 数组 | 已有 |
| `boolean` | 布尔 | 已有 |
| `date` | 日期字符串 | P2 |

### 4.3 FormRules 工厂（P0）

提供声明式之外的便捷构造（参考 Element Plus 常用写法）：

```base
FormRules.required('请输入用户名')
FormRules.phone('手机号格式不正确')
FormRules.email()
FormRules.range(1, 100, '年龄范围 1-100')
FormRules.pattern(/^\d{6}$/, '验证码为 6 位数字')
FormRules.custom(validatorFn, '自定义失败')
FormRules.async(asyncFn, '远程校验失败')
```

### 4.4 表单 / 表单项 API（P0 ~ P2）

#### k-form 实例方法

| 方法 | 说明 | 阶段 |
|------|------|------|
| `validate()` | 同步校验（跳过 async 规则或仅标记） | 已有，增强 |
| `validateAsync()` | 全量校验含异步 | P1 |
| `validateField(prop)` | 单字段异步校验 | P1 |
| `resetValidation()` | 清除错误 | 已有 |
| `resetValidation(props?)` | 按字段清除 | P1 |
| `submit()` | 校验通过后 emit submit | 已有 |
| `getFieldsError()` | 获取错误 map | P1 |
| `clearValidate(props?)` | 同 reset，对齐三方命名 | P2 |

#### k-form props（扩展）

| 属性 | 说明 | 阶段 |
|------|------|------|
| `model` | 表单数据 | 已有 |
| `rules` | 规则对象 | 已有 |
| `validateOnRuleChange` | rules 变化是否重校验 | P2 |
| `scrollToError` | 校验失败滚动到错误项 | P2（APP scroll-view） |

#### k-form-item props（扩展）

| 属性 | 说明 | 阶段 |
|------|------|------|
| `prop` | 字段名 | 已有 |
| `rules` | 项级规则 | 已有 |
| `required` | 展示必填星号 | 已有 |
| `validateStatus` | `success` / `error` / `validating` | P1 |
| `showMessage` | 是否展示错误 | P1 |
| `for` | 关联原生控件 id（无障碍，可选） | P2 |

#### k-form-item 实例 / 注入

| 能力 | 说明 | 阶段 |
|------|------|------|
| `validate()` | 同步 | 已有 |
| `validateAsync()` | 异步 | P1 |
| provide `validateField` | 供子控件 blur/change 调用 | P1 |
| `useFormItemContext()` | 组合式工具 | P1 |

### 4.5 触发策略（P1）

| trigger | 触发源 | k- 组件 | 原生控件 |
|---------|--------|---------|----------|
| `submit` | 表单 validate / 提交按钮 | 默认 | 默认 |
| `blur` | 失焦 | k-input / k-textarea 转发 | `@blur` + `useFormItem` |
| `change` | 值变化 | 组件 change 事件 | `@input` / change |

**默认策略**：未配置 `trigger` 时仅 `submit` 校验，避免移动端过早打扰。

### 4.6 原生控件双轨（P0 文档 + P1 工具）

与 `k-button` 双轨一致：

| 轨道 | 适用 | 校验绑定方式 |
|------|------|--------------|
| A：k-input / k-textarea 等 | 默认推荐 | v-model + k-form-item prop |
| B：原生 input / textarea | 平台能力、轻量场景 | v-model 到 model + blur 钩子 |

**一期交付**：

- README 与 demo 章节「原生控件校验」
- `form-context.uts`：`useFormItemContext()`、`createFormFieldHandler(trigger)`

**二期可选**：

- `k-form-control` 薄包装（无样式，仅绑定 blur）
- `theme/k-input-native.scss`（`#ifndef APP`，类名选择器）

### 4.7 与表单控件的联动（P1）

| 组件 | 联动内容 |
|------|----------|
| `k-input` | `@blur` / `@change` → 触发项级校验；错误态边框（变量） |
| `k-textarea` | 同上 |
| `k-radio-group` / `k-checkbox-group` | change 触发；`type: array` |
| `k-switch` | `type: boolean` |
| `k-picker`（若有） | change 触发；值类型约定 |

---

## 5. 跨端兼容策略

### 5.1 平台矩阵

| 能力 | WEB | APP | MP-* | 策略 |
|------|-----|-----|------|------|
| 同步 rules 声明 | ✅ | ✅ | ✅ | 统一引擎 |
| `validator` 函数 | ✅ | ✅ | ✅ | rules 禁止 JSON 序列化 |
| `asyncValidator` + `uni.request` | ✅ | ✅ | ✅ | demo 用 uni API |
| `RegExp` | ✅ | ✅ | ✅ | 避免极端复杂正则 |
| model `reactive<T>` | ✅ | ⚠️ | ✅ | 读值走安全工具；推荐 `UTSJSONObject` |
| ref 实例方法 | ✅ | ✅ | ✅ | `KFormComponentPublicInstance` |
| blur 触发 | ✅ | ✅ | ✅ | 事件名统一 |
| validating 动画 | ✅ | ⚠️ | ✅ | APP 状态类，不用响应式 :style 动效 |
| scrollToError | ✅ | ⚠️ | ⚠️ | 二期；APP 用 scroll-view 偏移 |

### 5.2 UTS / Kotlin 红线（必须遵守）

来源于近期 APP 修复经验 + `kit-ui-cross-platform-check`：

1. **禁止**对 `any` 使用 `for...in`、`obj[key]`（改用 `UTSJSONObject.get` 或专用读取器）
2. **禁止**对 `reactive` 对象 `as UTSJSONObject` 强转
3. **禁止**对含 `validator` 的 rules 做 `JSON.stringify`
4. `inject` 默认值类型：`ComputedRef<T> | null`，非 `ComputedRef<T | null>`
5. 条件编译：`WEB / APP / MP-*`，不写 `H5`
6. 文本样式仅写在 `text` / `button` / `input` / `textarea`
7. CSS 仅 classname 选择器（APP uvue）；原生样式文件 `#ifndef APP`

### 5.3 条件编译落点

| 场景 | 编译指令 | 说明 |
|------|----------|------|
| 原生样式轨 | `#ifndef APP` | 与 k-button-native 一致 |
| scrollToError | `#ifdef APP` | scroll-view 容器 |
| 性能采样 | `#ifdef WEB` | 可选 dev 日志 |

### 5.4 各端冒烟用例（每阶段必跑）

| 用例 | WEB | APP | 微信小程序 |
|------|-----|-----|------------|
| 必填 + 提交 | ✓ | ✓ | ✓ |
| 手机 / 邮箱 type | ✓ | ✓ | ✓ |
| pattern 正则 | ✓ | ✓ | ✓ |
| 自定义 validator | ✓ | ✓ | ✓ |
| asyncValidator + request | ✓ | ✓ | ✓ |
| blur 触发 | ✓ | ✓ | ✓ |
| 原生 input + v-model | ✓ | ✓ | ✓ |
| resetValidation | ✓ | ✓ | ✓ |
| k-radio / checkbox 组合 | ✓ | ✓ | ✓ |

---

## 6. 分阶段迭代计划

### Phase 0：基线稳定（已完成 / 维护）

**目标**：APP 编译通过，基础提交校验可用。

- [x] model / rules APP 类型兼容
- [x] `KFormComponentPublicInstance` ref 调用
- [x] k-button-native 条件编译隔离
- [ ] 补充 Phase 0 回归清单进 CI 人工表

**DoD**：`pages/form` 基础用法在 WEB / APP / 微信 MP 冒烟通过。

---

### Phase 1：规则丰富 + 引擎重构（1 ~ 1.5 周）

**目标**：对标三方库「基础校验」能力，原生控件可校验，错误可汇总。

#### 任务清单

| ID | 任务 | 产出 |
|----|------|------|
| P1-1 | 拆分 `form-utils.uts` | 读写 model/rules，函数保留路径 |
| P1-2 | 新增 `validators.uts` | type 预设 + 正则 + `FormRules` |
| P1-3 | 新增 `validate-engine.uts` | `validateSync`，管道顺序执行 |
| P1-4 | 扩展 `type` | string/number/integer/email/phone/url |
| P1-5 | `k-form` 补全 `errors` 汇总 | validate 事件、getFieldsError |
| P1-6 | `k-form-item` 错误态样式 | `--k-color-error` 边框/文案 |
| P1-7 | `form-context.uts` | inject 常量 + 文档化 |
| P1-8 | 扩展 `pages/form` demo | 预设规则区块 |
| P1-9 | 原生 input demo + 文档 | 双轨说明 |
| P1-10 | 更新 README / form.type.uts | API 表同步 |
| P1-11 | 跨端冒烟 | 三端记录 |

#### DoD（2026-06-25）

- [x] 手机、邮箱、数字、字符串 type 有 demo 可验证
- [x] `pattern` / `regexp` 可用
- [x] 提交失败展示字段级错误
- [x] 原生 `input` 在文档与 demo 中可校验
- [x] 无新增 grid/gap/@media
- [x] APP 无 ClassCastException / Kotlin 编译错误

---

### Phase 2：自定义 + 异步 + 触发器（1.5 ~ 2 周）

**目标**：覆盖接口校验、失焦校验、跨字段校验等真实业务场景。

#### 任务清单

| ID | 任务 | 产出 |
|----|------|------|
| P2-1 | `validator` 同步回调 | 支持 true/false/string |
| P2-2 | `asyncValidator` | Promise 链路 |
| P2-3 | `validateAsync` / `validateField` | k-form / k-form-item |
| P2-4 | `trigger` | submit / blur / change |
| P2-5 | k-input / k-textarea 转发 blur/change | 自动触发项校验 |
| P2-6 | `useFormItemContext` | 原生控件 blur 钩子 |
| P2-7 | validating 状态 | 类名 `k-form-item--validating` |
| P2-8 | 异步 demo | 模拟用户名占用（uni.request） |
| P2-9 | 防抖（async） | 同字段 300ms debounce |
| P2-10 | 跨字段校验 demo | 密码与确认密码 |

**当前完成情况（2026-06-25）**：

- [x] P2-1 `validator` 同步回调
- [x] P2-2 `asyncValidator` 引擎链路
- [x] P2-3 `validateAsync` / `validateFieldAsync`
- [x] P2-4 `trigger`（submit / blur / change）
- [x] P2-5 k-input / k-textarea blur/change 联动
- [x] P2-6 `useFormItemContext` / `createFieldHandler`
- [x] P2-7 `k-form-item--validating` 状态
- [x] P2-8 异步 demo（本地模拟版，待 uni.request 真请求版）
- [x] P2-9 异步防抖（300ms）+ 竞态保护
- [x] P2-10 跨字段校验 demo（密码确认）

#### DoD

- [x] asyncValidator 在 WEB / APP / MP 至少一端真实请求 demo（已接入 `uni.request` + 本地兜底）
- [x] blur 触发不引发重复校验风暴
- [x] validating 态可见且 APP 无 transition :style 违规
- [x] 自定义 validator 不经 JSON 丢失

---

### Phase 3：体验增强 + 控件协同（1 ~ 1.5 周）

**目标**：接近三方库完整体验，表单页可开箱用于生产。

| ID | 任务 | 产出 |
|----|------|------|
| P3-1 | `enum` / `len` / `whitespace` 规则 | 引擎扩展 |
| P3-2 | `resetValidation(props?)` / `clearValidate` | API 对齐 |
| P3-3 | `validateStatus` 手动控制 | 表单项 prop |
| P3-4 | radio/checkbox/switch 协同 | change 触发 |
| P3-5 | 错误 message 优先级 | 项级 > 表单级 > 默认模板 |
| P3-6 | `k-form-control`（可选） | 薄包装 |
| P3-7 | scrollToError（可选） | 首错滚动 |
| P3-8 | 国际化 message key（可选） | 对接 i18n 文档 |

**当前完成情况（2026-06-25）**：

- [x] P3-1 `enum` / `len` / `whitespace` 规则（引擎 + 工厂）
- [x] P3-2 `resetValidation(props?)` / `clearValidate(props?)`
- [x] P3-3 `validateStatus` 手动控制（`k-form-item` + demo）
- [x] P3-4 radio/checkbox/switch 协同（change 触发）
- [x] P3-5 错误 message 优先级梳理（项级 > 表单级 > 默认模板）

#### DoD

- [x] 组合控件表单 demo 完整
- [x] API 与 README 一致
- [x] `kit-ui-doc-sync` 技能可一键核对

---

### Phase 4：沉淀与规范（0.5 ~ 1 周）

**目标**：可复用、可评审、可发版。

| ID | 任务 | 产出 |
|----|------|------|
| P4-1 | `docs/k-form校验规则参考.md` | 规则字段完整说明 |
| P4-2 | `.cursor/rules` 表单专项约束（可选） | 与 component-architecture 对齐 |
| P4-3 | `kit-ui-cross-platform-check` 表单扩展项 | 技能更新 |
| P4-4 | 一期验收清单勾选 | `docs/一期升级验收清单.md` |
| P4-5 | 性能基线 | 20 字段同步校验 < 50ms（WEB 参考） |

**当前完成情况（2026-06-25）**：

- [x] P4-1 `docs/k-form校验规则参考.md`（规则字段、触发器、执行顺序、边界行为）
- [x] 看板同步：`docs/一期组件迭代看板.md`、`docs/组件开发清单.md` 中 k-form 相关状态已更新
- [x] P4-4 一期验收清单勾选（`docs/一期升级验收清单.md` 增加 k-form 专项验收）
- [ ] P4-2 `.cursor/rules` 表单专项约束（可选）
- [ ] P4-3 `kit-ui-cross-platform-check` 表单扩展项
- [ ] P4-5 性能基线（记录文档：`docs/k-form性能基线记录.md`）

---

## 7. 迭代依赖关系

```text
Phase 0（基线）
    │
    ▼
Phase 1（规则+引擎+原生双轨）
    │
    ├──► k-input blur 联动（可并行，但依赖 P2-4 trigger 时完整）
    │
    ▼
Phase 2（自定义+异步+trigger）
    │
    ▼
Phase 3（体验+组合控件）
    │
    ▼
Phase 4（文档+验收）
```

**关键路径**：P1-1 form-utils（函数保留）→ P1-3 引擎 → P1-5 errors → P2 异步。

---

## 8. 验收标准（总 DoD）

### 8.1 功能验收

- [x] 支持 8+ 种 type 预设
- [x] 支持 pattern / 自定义 validator / asyncValidator
- [x] 支持 submit / blur / change 触发
- [x] k- 组件与原生 input 均可校验
- [x] 表单级与字段级 API 完整
- [x] demo 覆盖：基础、状态、边界、异步、原生、组合控件

### 8.2 跨端验收

- [x] WEB 浏览器手动冒烟
- [x] APP Android（必选）+ iOS（推荐）冒烟
- [x] 微信 MP 开发者工具冒烟
- [x] 无 uvue CSS 选择器编译错误
- [x] 无 UTS Kotlin 编译错误

### 8.3 文档验收

- [x] `k-form/README.md` 与代码一致
- [x] `pages/form` 示例与 props/events 一致
- [x] 本计划状态更新为「已执行 / 版本号」

### 8.4 质量红线

- [x] 不新增 `grid`、`gap`、`@media`
- [x] 不污染全局样式
- [x] 函数级注释覆盖对外 API
- [x] 主题变量使用 `--k-*`

---

## 9. 风险登记与缓解

| 风险 | 等级 | 缓解 |
|------|------|------|
| rules 含函数被 JSON 序列化丢失 | 高 | form-utils 专用路径；单测/demo 覆盖 validator |
| reactive 读值性能 | 中 | 优先 UTSJSONObject model；文档推荐 |
| 异步校验竞态（旧请求覆盖新结果） | 中 | 请求序号 / 取消标记 |
| APP validating 动效 | 低 | 仅用 class，参考 app-animation 技能 |
| 小程序 request 域名 | 中 | demo 用 mock 或合法域名说明 |
| API 膨胀 | 中 | 非目标清单 + 分阶段发布 |

---

## 10. 里程碑时间表（建议）

| 里程碑 | 内容 | 建议工期 |
|--------|------|----------|
| M0 | Phase 0 回归稳定 | 已完成 |
| Phase 1 | 规则丰富 + 引擎重构 | ✅ 已完成（2026-06-25） |
| M2 | Phase 2 异步 + trigger | ✅ 已完成（`uni.request` 示例 + 三端验收通过） |
| M3 | Phase 3 体验完善 | ✅ 已完成（P3-1 ~ P3-5） |
| M4 | Phase 4 文档与验收 | 🔶 进行中（P4-1 已完成） |

可与 `docs/一期组件迭代看板.md` 中「迭代 1 表单基础闭环」对齐，将本计划作为迭代 1 的**深度子计划**。

---

## 11. Issue 拆分模板（可直接建任务）

每个任务建议包含：

```text
标题：[k-form] P1-2 新增 validators.uts 预设规则
范围：uni_modules/kit-ui/components/k-form/
子任务：
  - [ ] 实现
  - [ ] demo
  - [ ] README
  - [ ] WEB 冒烟
  - [ ] APP 冒烟
  - [ ] MP 冒烟
验收：关联本文档 Phase X DoD 条目
```

---

## 12. 附录：规则示例（目标 API）

### 12.1 声明式 rules

```base
const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 2, maxLength: 20, trigger: 'blur' }
  ],
  phone: [
    { type: 'phone', message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { type: 'email', trigger: 'blur' }
  ],
  age: [
    { type: 'integer', min: 1, max: 120 }
  ],
  password: [
    { required: true, minLength: 6 }
  ],
  confirmPassword: [
    {
      validator: (value, rule, model) => {
        if (value != model['password']) {
          return '两次密码不一致'
        }
        return true
      },
      trigger: 'blur'
    }
  ],
  usernameRemote: [
    {
      asyncValidator: (value) => {
        return new Promise((resolve) => {
          uni.request({
            url: 'https://example.com/check',
            data: { username: value },
            success: (res) => resolve(res.data['ok'] == true),
            fail: () => resolve('校验服务异常')
          })
        })
      },
      trigger: 'blur'
    }
  ]
}
```

### 12.2 原生 input 用法

```base
<k-form :model="form" :rules="rules">
  <k-form-item label="手机号" prop="phone">
    <input v-model="form.phone" type="number" @blur="onPhoneBlur" />
  </k-form-item>
</k-form>

// script（页面 slot 场景）
const formRef = ref<KFormComponentPublicInstance | null>(null)
const onPhoneBlur = () => {
  formRef.value?.validateField?.('phone', 'blur')
}
```

### 12.3 表单提交

```base
const formRef = ref<KFormComponentPublicInstance | null>(null)

const onSubmit = async () => {
  const valid = await formRef.value?.validateAsync?.() ?? false
  if (valid) {
    // 提交业务
  }
}
```

---

## 13. 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-23 | 初版：需求分析、架构、四阶段计划、跨端策略、DoD |
| v1.1 | 2026-06-25 | 更新 Phase 1/2 进度：validator/asyncValidator/trigger/validating 与示例已落地 |
| v1.2 | 2026-06-25 | 启动 Phase 3：完成 enum/len/whitespace 与 clearValidate/resetValidation(props?) |
| v1.3 | 2026-06-25 | 继续 Phase 3：完成 validateStatus 手动控制与演示页示例 |
| v1.4 | 2026-06-25 | 完成 Phase 3-5：错误文案优先级（项级 > 表单级 > 默认模板） |
| v1.5 | 2026-06-25 | 三端冒烟验收通过；同步 strict submit、disabled 生效与里程碑状态 |
| v1.6 | 2026-06-25 | 完成 Phase 4-1 规则参考文档；同步迭代看板与组件开发清单状态 |
| v1.7 | 2026-06-25 | 完成 P4-4 一期验收清单勾选；新增发布说明与性能基线记录文档 |

---

## 14. 下一步行动

1. **可选能力评估**：`scrollToError`（APP `scroll-view` 方案）
2. **Phase 4 沉淀**：补充 P4-2 / P4-3（规则专项约束、cross-platform 扩展）
3. **性能收口**：完成 P4-5 基线实测数据回填（`docs/k-form性能基线记录.md`）

> 执行用清单：`docs/k-form三端冒烟验收清单.md`
