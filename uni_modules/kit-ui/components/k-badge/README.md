# Badge 徽标组件

用于显示数字、文字或圆点形式的徽标，支持独立显示和嵌套使用。

## 基础用法

### 独立显示

```vue
<template>
  <!-- 数字徽标 -->
  <k-badge :value="5" />
  
  <!-- 文字徽标 -->
  <k-badge value="New" />
  
  <!-- 圆点徽标 -->
  <k-badge :dot="true" />
</template>
```

### 嵌套使用

```vue
<template>
  <k-badge :value="5">
    <view class="target">消息</view>
  </k-badge>
</template>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value | string \| number | '' | 显示内容 |
| max | number | 99 | 最大数值，超出显示为 max+ |
| type | BadgeType | 'primary' | 徽标类型 |
| size | SizeType \| number | 'medium' | 尺寸大小 |
| color | string | - | 自定义文字颜色 |
| backgroundColor | string | - | 自定义背景色 |
| borderColor | string | - | 自定义边框颜色 |
| position | PositionType | 'top-right' | 位置（嵌套模式） |
| offset | OffsetType | - | 偏移量 |
| show | boolean | true | 是否显示 |
| dot | boolean | false | 圆点模式 |
| showZero | boolean | false | 是否显示0 |

## 类型定义

### BadgeType

```typescript
type BadgeType = 'primary' | 'success' | 'warning' | 'error' | 'info'
```

### SizeType

```typescript
type SizeType = 'small' | 'medium' | 'large'
```

### PositionType

```typescript
type PositionType = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
```

### OffsetType

```typescript
type OffsetType = {
  x: number
  y: number
}
```

## 使用示例

### 不同类型

```vue
<template>
  <k-badge :value="5" type="primary" />
  <k-badge :value="5" type="success" />
  <k-badge :value="5" type="warning" />
  <k-badge :value="5" type="error" />
  <k-badge :value="5" type="info" />
</template>
```

### 不同尺寸

```vue
<template>
  <!-- 预设尺寸 -->
  <k-badge :value="5" size="small" />
  <k-badge :value="5" size="medium" />
  <k-badge :value="5" size="large" />
  
  <!-- 自定义尺寸 -->
  <k-badge :value="5" :size="24" />
</template>
```

### 最大值处理

```vue
<template>
  <k-badge :value="99" />        <!-- 显示: 99 -->
  <k-badge :value="100" />       <!-- 显示: 99+ -->
  <k-badge :value="200" :max="99" />  <!-- 显示: 99+ -->
  <k-badge :value="1000" :max="999" /> <!-- 显示: 999+ -->
</template>
```

### 自定义颜色

```vue
<template>
  <k-badge :value="5" background-color="#f56c6c" />
  <k-badge :value="5" background-color="#67c23a" />
  <k-badge :value="5" background-color="#909399" color="#000" />
  <k-badge :value="5" background-color="#e6a23c" border-color="#f56c6c" />
</template>
```

### 位置控制

```vue
<template>
  <k-badge :value="5" position="top-right">
    <view class="target">右上</view>
  </k-badge>
  
  <k-badge :value="5" position="top-left">
    <view class="target">左上</view>
  </k-badge>
  
  <k-badge :value="5" position="bottom-right">
    <view class="target">右下</view>
  </k-badge>
  
  <k-badge :value="5" position="bottom-left">
    <view class="target">左下</view>
  </k-badge>
</template>
```

### 偏移量

```vue
<template>
  <k-badge :value="5" :offset="{x: 10, y: 10}">
    <view class="target">偏移</view>
  </k-badge>
</template>
```

### 显示控制

```vue
<template>
  <!-- 不显示0 -->
  <k-badge :value="0" :show-zero="false">
    <view class="target">不显示0</view>
  </k-badge>
  
  <!-- 显示0 -->
  <k-badge :value="0" :show-zero="true">
    <view class="target">显示0</view>
  </k-badge>
  
  <!-- 动态控制显示 -->
  <k-badge :value="5" :show="showBadge">
    <view class="target">动态控制</view>
  </k-badge>
</template>
```

## 主题注入

k-badge 组件支持通过 `k-config` 组件进行主题注入，可以自定义各种类型的颜色：

```vue
<template>
  <!-- 默认主题 -->
  <k-badge :value="5" type="primary" />
  
  <!-- 自定义主题 -->
  <k-config :theme="customTheme">
    <k-badge :value="5" type="primary" />
    <k-badge :value="8" type="success" />
    <k-badge :value="3" type="warning" />
  </k-config>
</template>

<script setup>
  // 自定义主题配置
  const customTheme = {
    colorPrimary: '#ff8c00',    // 主色调
    colorSuccess: '#ffa500',    // 成功色
    colorWarning: '#ff7f50',    // 警告色
    colorError: '#ff6347',      // 错误色
    colorInfo: '#87ceeb'        // 信息色
  }
</script>
