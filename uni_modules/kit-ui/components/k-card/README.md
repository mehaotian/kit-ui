# k-card 卡片组件

卡片组件用于承载信息，支持标题、内容、操作区域等功能。

## 基础用法

```vue
<k-card title="卡片标题">
  <text>卡片内容</text>
</k-card>
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| title | String | '' | 卡片标题 |
| subtitle | String | '' | 卡片副标题 |
| bordered | Boolean | true | 是否显示边框 |
| shadow | Boolean | false | 是否显示阴影 |
| radius | String | 'medium' | 圆角大小，可选值：none, small, medium, large |
| padding | String | 'medium' | 内边距大小，可选值：none, small, medium, large |
| clickable | Boolean | false | 是否可点击 |
| disabled | Boolean | false | 是否禁用 |
| customStyle | String | '' | 自定义样式 |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击卡片时触发（需要设置 clickable 为 true） | - |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| default | 卡片内容 |
| header | 自定义头部内容 |
| footer | 自定义底部内容 |

## 示例

### 基础卡片

```vue
<k-card title="基础卡片" subtitle="这是一个基础卡片">
  <text>卡片内容区域</text>
</k-card>
```

### 带阴影的卡片

```vue
<k-card title="阴影卡片" shadow>
  <text>带阴影效果的卡片</text>
</k-card>
```

### 可点击的卡片

```vue
<k-card title="可点击卡片" clickable @click="handleClick">
  <text>点击这个卡片</text>
</k-card>
```

### 自定义头部和底部

```vue
<k-card>
  <template #header>
    <view class="custom-header">
      <text>自定义头部</text>
    </view>
  </template>
  
  <text>卡片内容</text>
  
  <template #footer>
    <k-button type="primary" size="small">操作</k-button>
  </template>
</k-card>
```

### 不同圆角和内边距

```vue
<k-card title="小圆角" radius="small" padding="small">
  <text>小圆角，小内边距</text>
</k-card>

<k-card title="大圆角" radius="large" padding="large">
  <text>大圆角，大内边距</text>
</k-card>
```