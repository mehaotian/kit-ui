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
| borderBottom | Boolean | `true` | 是否显示底部分割线 |
| errorMessage | String | `''` | 手动错误提示（优先级高于校验结果） |
| customStyle | String | `''` | 自定义内联样式 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 表单控件内容 |

## 注意事项

- 通过 `k-form` 的 `validate()` 触发校验，不会自动监听 input 实时校验（一期最小实现）。
- 手动设置 `errorMessage` 可展示服务端返回错误。
