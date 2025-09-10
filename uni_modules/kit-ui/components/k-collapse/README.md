# Collapse 折叠面板

可以折叠/展开的内容区域。

## 基础用法

基础的折叠面板用法。

```vue
<template>
  <k-collapse title="面板标题" :expanded="expanded" @change="onChange">
    <text>这里是面板内容</text>
  </k-collapse>
</template>

<script setup>
import { ref } from 'vue'

const expanded = ref(false)
const onChange = (value) => {
  expanded.value = value
  console.log('面板状态:', value)
}
</script>
```

## 默认展开

通过 `expanded` 属性控制面板的默认展开状态。

```vue
<template>
  <k-collapse title="默认展开" :expanded="true">
    <text>这个面板默认是展开状态</text>
  </k-collapse>
</template>
```

## 禁用状态

通过 `disabled` 属性禁用折叠面板。

```vue
<template>
  <k-collapse title="禁用面板" :disabled="true">
    <text>这个面板被禁用了</text>
  </k-collapse>
</template>
```

## 自定义图标位置

通过 `icon-position` 属性设置展开/收起图标的位置。

```vue
<template>
  <k-collapse title="图标在左侧" icon-position="left">
    <text>图标位置在左侧</text>
  </k-collapse>
  
  <k-collapse title="图标在右侧" icon-position="right">
    <text>图标位置在右侧（默认）</text>
  </k-collapse>
</template>
```

## 自定义标题

通过 `title` 插槽可以自定义标题内容。

```vue
<template>
  <k-collapse>
    <template #title>
      <view class="custom-title">
        <text>🎉 自定义标题</text>
        <view class="badge">NEW</view>
      </view>
    </template>
    <text>使用自定义标题插槽</text>
  </k-collapse>
</template>
```

## 多个面板

多个折叠面板可以组合使用。

```vue
<template>
  <k-collapse 
    v-for="(item, index) in list" 
    :key="index"
    :title="item.title"
    :expanded="item.expanded"
    @change="onChange(index, $event)"
  >
    <text>{{ item.content }}</text>
  </k-collapse>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([
  { title: '面板1', content: '内容1', expanded: false },
  { title: '面板2', content: '内容2', expanded: true },
  { title: '面板3', content: '内容3', expanded: false }
])

const onChange = (index, expanded) => {
  list.value[index].expanded = expanded
}
</script>
```

## 自定义动画时长

通过 `animation-duration` 属性设置展开/收起动画的持续时间。

```vue
<template>
  <k-collapse title="快速动画" :animation-duration="200">
    <text>200ms 动画时长</text>
  </k-collapse>
  
  <k-collapse title="慢速动画" :animation-duration="800">
    <text>800ms 动画时长</text>
  </k-collapse>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 面板标题 | `string` | `''` |
| expanded | 是否展开面板 | `boolean` | `false` |
| disabled | 是否禁用面板 | `boolean` | `false` |
| icon-position | 图标位置 | `'left' \| 'right'` | `'right'` |
| animation-duration | 动画持续时间（毫秒） | `number` | `300` |
| custom-style | 自定义样式 | `string` | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 面板展开状态改变时触发 | `(expanded: boolean)` |

### Slots

| 名称 | 说明 |
|------|------|
| default | 面板内容 |
| title | 自定义标题内容 |

## 样式变量

组件提供了以下 CSS 变量，可用于自定义样式：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| --k-collapse-border-color | 边框颜色 | `#e8e8e8` |
| --k-collapse-header-bg | 头部背景色 | `#fafafa` |
| --k-collapse-header-active-bg | 头部激活背景色 | `#f0f0f0` |
| --k-collapse-header-disabled-bg | 头部禁用背景色 | `#f5f5f5` |
| --k-collapse-content-bg | 内容背景色 | `#ffffff` |
| --k-collapse-duration | 动画持续时间 | `300ms` |

### 使用样式变量

```vue
<template>
  <k-collapse 
    title="自定义样式" 
    custom-style="--k-collapse-header-bg: #e6f7ff; --k-collapse-border-color: #1890ff"
  >
    <text>自定义样式的面板</text>
  </k-collapse>
</template>
```

## 注意事项

1. **动画实现**：组件使用 `UniElement.animate()` 方法实现动画效果，确保在 uni-app x 环境下的兼容性。

2. **内容高度**：组件会自动计算内容高度来实现平滑的展开/收起动画。

3. **嵌套使用**：支持在折叠面板内嵌套其他组件，但要注意避免过深的嵌套影响性能。

4. **事件处理**：`change` 事件会在面板状态改变时触发，可用于同步外部状态。

5. **样式定制**：可以通过 CSS 变量或 `custom-style` 属性来定制组件样式。

## 更新日志

### v1.0.0

- 🎉 新增 Collapse 折叠面板组件
- ✨ 支持展开/收起动画效果
- ✨ 支持禁用状态
- ✨ 支持自定义图标位置
- ✨ 支持自定义标题插槽
- ✨ 支持自定义动画时长
- ✨ 提供完整的样式变量定制