# k-form-item 表单项

表单字段容器，提供标签、控件插槽与错误提示。需放在 `k-form` 内使用（也可单独用于展示错误态）。

## 基础用法

```vue
<k-form-item label="手机号" prop="phone" required>
  <k-input v-model="form.phone" type="tel" />
</k-form-item>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| label | String | `''` | 标签文字 |
| prop | String | `''` | 对应 model 字段名 |
| required | Boolean | `false` | 是否显示必填星号 |
| rules | Array | `[]` | 项级规则，优先级高于 form.rules |
| labelWidth | String | `''` | 标签宽度，空则继承 form |
| contentAlign | String | `'center'` | 控件区对齐方式：`center`/`top`（多行控件建议 `top`） |
| validateStatus | String | `''` | 手动状态：`success` / `error` / `validating`，有值时优先于自动校验态 |
| borderBottom | Boolean | `true` | 是否显示底部分割线 |
| errorMessage | String | `''` | 手动错误提示（优先级高于校验结果） |
| customStyle | String | `''` | 自定义内联样式 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 表单控件内容 |

## 注意事项

- 规则可配置 `trigger: 'blur'/'change'`，`k-input` 与 `k-textarea` 在 `k-form-item` 内会自动触发对应校验。
- `contentAlign='top'` 适合 `k-textarea` 等多行控件，标签与控件顶部对齐更易读。
- 当父级 `k-form` 设置 `disabled` 时，项内 `k-input` / `k-textarea` / `k-radio` / `k-checkbox` / `k-switch` 及其 group 统一禁用。
- 手动设置 `errorMessage` 可展示服务端返回错误。
- 手动传入 `validateStatus` 后，会覆盖自动状态显示；例如接口保存中可传 `validating`，保存成功后切到 `success`。
- 文案优先级：项级 `:rules.message` > 表单级 `k-form.rules.message` > 引擎默认提示。
