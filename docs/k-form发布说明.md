# k-form 发布说明（2026-06-25）

## 1. 适用范围

- 组件：`k-form`、`k-form-item`
- 相关控件：`k-input`、`k-textarea`、`k-radio(-group)`、`k-checkbox(-group)`、`k-switch`
- 演示页：`pages/form-validate/form-validate.uvue`

---

## 2. 主要新增能力

- 支持 `validator` / `asyncValidator` 自定义校验。
- 支持 `submit` / `blur` / `change` 触发器。
- 支持 `validateAsync` / `validateFieldAsync` 异步校验 API。
- 支持 `enum` / `len` / `whitespace` 规则。
- 支持 `validateStatus` 手动控制状态（`success/error/validating`）。
- 支持错误文案优先级：项级 > 表单级 > 默认。
- 支持 `resetValidation(props?)` / `clearValidate(props?)` 指定字段清理。
- 支持 `k-form.disabled` 向表单内控件统一透传禁用态。

---

## 3. 重要行为变更

### 3.1 `submit()` 严格校验语义

- 新语义：`submit()` 会先执行严格校验（同步+异步全量），通过后才触发 `submit` 事件。
- 返回值：`Promise<boolean>`。

### 3.2 异步校验一致性

- `validateAsync` / `validateFieldAsync` 会覆盖同步+异步规则，不再因“无 asyncValidator”跳过同步规则。

### 3.3 disabled 生效一致性

- `k-form.disabled` 生效范围：`k-input`、`k-textarea`、`k-radio`、`k-checkbox`、`k-switch` 及对应 group。

---

## 4. 升级建议

- 旧代码若将 `submit()` 当同步方法使用，请改为 `await formRef.value?.submit?.()`。
- 如业务中存在重复 `prop`，建议改为唯一；`validateField(prop)` 默认命中首个已注册项。
- 对含 `validator/asyncValidator` 的规则，优先使用 `ruleCustom/ruleAsync` 或项级 `:rules`，避免 JSON 路径丢失函数。

---

## 5. 验收与证据

- 三端冒烟：见 `docs/k-form三端冒烟验收清单.md`（WEB/APP/微信MP 已通过）。
- 规则口径：见 `docs/k-form校验规则参考.md`。
- 计划状态：见 `docs/k-form表单校验开发计划.md`。
