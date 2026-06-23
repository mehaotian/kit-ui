# k-radio 单选框

用于在多个互斥选项中选择一项。通常与 `k-radio-group` 组合使用，也支持独立布尔绑定。

## 基础用法

```vue
<template>
  <k-radio-group v-model="gender">
    <k-radio name="male" label="男" />
    <k-radio name="female" label="女" />
  </k-radio-group>
</template>

<script setup lang="uts">
const gender = ref('')
</script>
```

## k-radio 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | String / Number | `''` | 选项值，在 group 内用于标识 |
| label | String | `''` | 选项文字 |
| disabled | Boolean | `false` | 是否禁用 |
| labelDisabled | Boolean | `false` | 是否禁止点击标签触发选中 |
| modelValue / v-model | Boolean | `false` | 独立使用时的选中状态 |
| size | String | `''` | 尺寸，继承 group；可选 `small` / `medium` / `large` |
| shape | String | `''` | 形态，继承 group；可选 `dot` / `button` |
| iconPlacement | String | `''` | 图标位置，继承 group；可选 `left` / `right` |
| customStyle | String | `''` | 自定义内联样式 |

## k-radio 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 独立模式下选中状态变化 | `value: boolean` |
| change | 选中变化时触发 | `name: string \| number` |

## k-radio 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义标签内容 |

## k-radio-group 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue / v-model | String / Number | `''` | 当前选中值 |
| disabled | Boolean | `false` | 是否禁用整组 |
| direction | String | `'horizontal'` | 排列方向：`horizontal` / `vertical` |
| size | String | `'medium'` | 组内默认尺寸 |
| shape | String | `'dot'` | 组内默认形态：`dot` / `button` |
| iconPlacement | String | `'left'` | 组内默认图标位置 |
| customStyle | String | `''` | 自定义内联样式 |

## k-radio-group 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | `value: string \| number` |
| change | 选中值变化 | `value: string \| number` |

## 主题变量

组件支持通过 `k-config` 注入 `kit-theme`，常用变量：

| 变量 | 说明 |
| --- | --- |
| `--k-color-primary` | 选中态主色 |
| `--k-text-color` | 标签文字色 |
| `--k-border-color` | 未选中边框色 |

## 注意事项

- 组内每个 `k-radio` 的 `name` 应唯一。
- `shape="button"` 时以按钮形态展示，适合分段选择场景。
- 样式使用 flex 布局，未使用 `grid`、`gap`、`@media`。
