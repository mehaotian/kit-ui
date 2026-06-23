# k-switch 开关

用于两种状态的切换，支持加载态、自定义颜色与非布尔值绑定。

## 基础用法

```vue
<template>
  <k-switch v-model="enabled" />
</template>

<script setup lang="uts">
const enabled = ref(true)
</script>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue / v-model | Any | `false` | 绑定值 |
| disabled | Boolean | `false` | 是否禁用 |
| loading | Boolean | `false` | 是否加载中（禁止切换） |
| size | String | `'medium'` | 尺寸：`small` / `medium` / `large` |
| activeColor | String | `''` | 开启态轨道颜色，空则使用主题主色 |
| inactiveColor | String | `''` | 关闭态轨道颜色 |
| activeValue | Any | `true` | 开启时对应的值 |
| inactiveValue | Any | `false` | 关闭时对应的值 |
| customStyle | String | `''` | 自定义内联样式 |

## 组件事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `value: any` |
| change | 切换时触发 | `value: any` |

## 自定义开关值

```vue
<k-switch v-model="status" :active-value="1" :inactive-value="0" />
```

## 主题变量

| 变量 | 说明 |
| --- | --- |
| `--k-color-primary` | 默认开启态颜色 |

## 注意事项

- `loading` 状态下点击无效。
- 滑块动画使用 `transform`，跨端兼容。
