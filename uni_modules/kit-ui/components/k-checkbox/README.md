# k-checkbox 复选框

用于多选场景，通常与 `k-checkbox-group` 组合使用，支持半选态与最大/最小选中数量限制。

## 基础用法

```vue
<template>
  <k-checkbox-group v-model="hobbies">
    <k-checkbox name="read" label="阅读" />
    <k-checkbox name="sport" label="运动" />
  </k-checkbox-group>
</template>

<script setup lang="uts">
const hobbies = ref<string[]>([])
</script>
```

## k-checkbox 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | String / Number | `''` | 选项值 |
| label | String | `''` | 选项文字 |
| disabled | Boolean | `false` | 是否禁用 |
| labelDisabled | Boolean | `false` | 是否禁止点击标签触发 |
| modelValue / v-model | Boolean | `false` | 独立使用时的选中状态 |
| indeterminate | Boolean | `false` | 半选态（常用于全选中间态） |
| size | String | `''` | 尺寸，继承 group |
| shape | String | `'square'` | 形态：`square` / `round` |
| fillMode | String | `''` | 填充形态：`solid` 完全填充 / `inset` 内留白边，继承 group |
| iconPlacement | String | `''` | 图标位置：`left` / `right` |
| customStyle | String | `''` | 自定义内联样式 |

## k-checkbox 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 独立模式下选中变化 | `value: boolean` |
| change | 选中变化 | `name, checked` |

## k-checkbox-group 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue / v-model | Array | `[]` | 已选值数组 |
| disabled | Boolean | `false` | 是否禁用整组 |
| direction | String | `'horizontal'` | 排列方向 |
| size | String | `'medium'` | 组内默认尺寸 |
| fillMode | String | `'solid'` | 组内默认填充形态：`solid` / `inset` |
| max | Number | `-1` | 最大可选数量，`-1` 不限制 |
| min | Number | `0` | 最小保留数量 |
| customStyle | String | `''` | 自定义内联样式 |

## k-checkbox-group 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中数组变化 | `value: array` |
| change | 选中数组变化 | `value: array` |

## 注意事项

- 达到 `max` 后无法继续选中；达到 `min` 后无法取消最后一项。
- 半选态 `indeterminate` 仅影响展示，需自行控制选中逻辑。
- `fillMode="solid"` / `fillMode="inset"` 均通过内层 fill 缩放动画；inset 留白边约 1px。
