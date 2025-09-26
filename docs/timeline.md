# Timeline 时间轴

垂直展示的时间流信息，用于展示事件的时间顺序和状态。

## 基础用法

最简单的时间轴用法。

```vue
<template>
  <k-timeline>
    <k-timeline-item>
      <text>创建服务现场 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item>
      <text>初步排除网络异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item>
      <text>技术测试异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item>
      <text>网络异常正在修复 2015-09-01</text>
    </k-timeline-item>
  </k-timeline>
</template>
```

## 圆圈颜色

用各种颜色来标识不同状态的时间轴节点。

```vue
<template>
  <k-timeline>
    <k-timeline-item color="green">
      <text>创建服务现场 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item color="red">
      <text>初步排除网络异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item color="blue">
      <text>技术测试异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item color="gray">
      <text>网络异常正在修复 2015-09-01</text>
    </k-timeline-item>
  </k-timeline>
</template>
```

## 自定义时间轴点

可以设置为图标或其它自定义元素。

```vue
<template>
  <k-timeline>
    <k-timeline-item>
      <text>创建服务现场 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item color="green">
      <text>初步排除网络异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item icon="clock">
      <text>技术测试异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item color="red">
      <text>网络异常正在修复 2015-09-01</text>
    </k-timeline-item>
  </k-timeline>
</template>
```

## 标签展示

可以在时间轴节点旁边显示时间标签。

```vue
<template>
  <k-timeline>
    <k-timeline-item time="2015-09-01">
      <text>创建服务现场</text>
    </k-timeline-item>
    <k-timeline-item time="2015-09-01 09:12:11">
      <text>初步排除网络异常</text>
    </k-timeline-item>
    <k-timeline-item>
      <text>技术测试异常</text>
    </k-timeline-item>
    <k-timeline-item time="2015-09-01 09:12:11">
      <text>网络异常正在修复</text>
    </k-timeline-item>
  </k-timeline>
</template>
```

## 自定义颜色

支持使用自定义颜色值。

```vue
<template>
  <k-timeline>
    <k-timeline-item color="green">
      <text>创建服务现场 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item color="#00CCFF">
      <text>自定义颜色测试</text>
    </k-timeline-item>
    <k-timeline-item color="red">
      <text>网络异常正在修复 2015-09-01</text>
    </k-timeline-item>
  </k-timeline>
</template>
```

## Pending 状态

当任务状态正在发生，还在记录过程中，可用幽灵节点来表示当前的时间节点。

```vue
<template>
  <k-timeline pending>
    <k-timeline-item>
      <text>创建服务现场 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item>
      <text>初步排除网络异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item>
      <text>技术测试异常 2015-09-01</text>
    </k-timeline-item>
  </k-timeline>
</template>
```

## 反向排序

节点排序可以倒序。

```vue
<template>
  <k-timeline direction="reverse">
    <k-timeline-item>
      <text>创建服务现场 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item color="green">
      <text>初步排除网络异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item>
      <text>技术测试异常 2015-09-01</text>
    </k-timeline-item>
    <k-timeline-item color="red">
      <text>网络异常正在修复 2015-09-01</text>
    </k-timeline-item>
  </k-timeline>
</template>
```

## API

### Timeline Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| pending | 指定最后一个幽灵节点是否存在或内容 | boolean | false |
| direction | 时间轴方向 | 'normal' \| 'reverse' | 'normal' |

### Timeline Item Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| color | 指定圆圈颜色 | string | 'blue' |
| icon | 自定义时间轴点图标 | string | - |
| time | 时间标签 | string | - |

### Timeline Item Slots

| 名称 | 说明 |
|------|------|
| default | 时间轴节点内容 |

## 主题定制

组件提供了下列 CSS 变量，可用于自定义样式：

| 名称 | 默认值 | 描述 |
|------|--------|------|
| --k-timeline-line-color | #e5e7eb | 时间轴线条颜色 |
| --k-timeline-dot-size | 12px | 时间轴节点大小 |
| --k-timeline-dot-border-width | 2px | 时间轴节点边框宽度 |
| --k-timeline-content-margin | 16px | 内容区域左边距 |
| --k-timeline-item-padding | 16px | 时间轴项目下边距 |
| --k-timeline-time-color | #6b7280 | 时间标签颜色 |
| --k-timeline-time-font-size | 12px | 时间标签字体大小 |

## 注意事项

1. 时间轴组件基于 flex 布局实现，确保在支持 flex 的容器中使用
2. 自定义图标需要确保图标库已正确引入
3. 在小程序环境下，某些 CSS 特性可能受限，建议在目标平台进行充分测试
4. 组件内容区域支持任意内容，但建议保持内容结构的一致性以获得最佳视觉效果