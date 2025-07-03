# k-config 组件使用说明

## 概述

`k-config` 组件是 kit-ui 组件库的主题配置组件，通过 Vue 3 的 `provide/inject` 机制向子组件注入主题变量，实现动态主题配置和样式定制。

## 功能特性

- **主题注入**：通过 `provide/inject` 向子组件注入主题配置
- **动态样式**：支持运行时动态修改主题变量
- **CSS 变量映射**：自动将主题配置转换为 CSS 变量
- **响应式更新**：主题配置变化时自动更新子组件样式
- **命名规范**：自动将驼峰命名转换为 kebab-case CSS 变量

## 基础用法

### 1. 默认主题

```vue
<template>
  <k-config>
    <k-button type="success" text="成功按钮" />
    <k-button type="primary" text="主要按钮" />
  </k-config>
</template>
```

默认情况下，`k-config` 会应用内置的主题变量（如 `--k-color-success: red`）。

### 2. 自定义主题配置

```vue
<template>
  <k-config :theme="customTheme">
    <k-button type="success" text="成功按钮" />
    <k-button type="primary" text="主要按钮" />
  </k-config>
</template>

<script setup>
const customTheme = {
  colorSuccess: '#52c41a',
  colorPrimary: '#1890ff',
  colorWarning: '#faad14',
  borderRadiusMd: '12px'
}
</script>
```

### 3. 动态主题切换

```vue
<template>
  <view>
    <button @click="switchTheme">切换主题</button>
    <k-config :theme="dynamicTheme">
      <k-button type="success" text="成功按钮" />
      <k-button type="primary" text="主要按钮" />
    </k-config>
  </view>
</template>

<script setup>
import { reactive } from 'vue'

const dynamicTheme = reactive({
  colorSuccess: '#4cd964',
  colorPrimary: '#007aff'
})

const switchTheme = () => {
  dynamicTheme.colorSuccess = '#ff6b35'
  dynamicTheme.colorPrimary = '#ff8c42'
}
</script>
```

## API 参考

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| theme | Object | `{}` | 主题配置对象 |
| mode | String | `'light'` | 主题模式（light/dark） |

### 主题配置对象

主题配置对象支持以下属性（驼峰命名，会自动转换为 kebab-case CSS 变量）：

#### 颜色配置

```javascript
{
  colorPrimary: '#007aff',        // --k-color-primary
  colorSuccess: '#4cd964',        // --k-color-success
  colorWarning: '#ff9500',        // --k-color-warning
  colorError: '#ff3b30',          // --k-color-error
  colorInfo: '#5ac8fa',           // --k-color-info
}
```

#### 尺寸配置

```javascript
{
  borderRadiusXs: '2px',          // --k-border-radius-xs
  borderRadiusSm: '4px',          // --k-border-radius-sm
  borderRadiusBase: '6px',        // --k-border-radius-base
  borderRadiusMd: '8px',          // --k-border-radius-md
  borderRadiusLg: '12px',         // --k-border-radius-lg
  
  spacingXs: '4px',               // --k-spacing-xs
  spacingSm: '8px',               // --k-spacing-sm
  spacingBase: '12px',            // --k-spacing-base
  spacingMd: '16px',              // --k-spacing-md
  spacingLg: '20px',              // --k-spacing-lg
}
```

#### 字体配置

```javascript
{
  fontSizeXs: '10px',             // --k-font-size-xs
  fontSizeSm: '12px',             // --k-font-size-sm
  fontSizeBase: '14px',           // --k-font-size-base
  fontSizeMd: '16px',             // --k-font-size-md
  fontSizeLg: '18px',             // --k-font-size-lg
}
```

## 工作原理

### 1. 主题注入机制

`k-config` 组件使用 Vue 3 的 `provide/inject` API：

```javascript
// k-config 组件中
const themeConfig = reactive({
  mode: props.mode,
  ...props.theme
})

provide('kit-theme', themeConfig)
```

```javascript
// k-button 组件中
const themeConfig = inject('kit-theme', {})
```

### 2. CSS 变量生成

主题配置会自动转换为 CSS 变量：

```javascript
// 驼峰命名转换为 kebab-case
const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
styles.push(`--k-${cssVar}: ${value}`)

// 例如：
// colorPrimary: '#007aff' → --k-color-primary: #007aff
// borderRadiusMd: '8px' → --k-border-radius-md: 8px
```

### 3. 样式应用

生成的 CSS 变量通过 `:style` 属性应用到组件根元素：

```vue
<!-- k-config 组件 -->
<view :style="customStyle">
  <slot></slot>
</view>

<!-- k-button 组件 -->
<view :style="buttonStyle" class="k-button">
  <!-- 按钮内容 -->
</view>
```

## 最佳实践

### 1. 主题配置组织

建议将主题配置抽取为独立的配置文件：

```javascript
// themes/index.js
export const lightTheme = {
  colorPrimary: '#007aff',
  colorSuccess: '#4cd964',
  borderRadiusBase: '6px'
}

export const darkTheme = {
  colorPrimary: '#0a84ff',
  colorSuccess: '#30d158',
  borderRadiusBase: '6px'
}

export const orangeTheme = {
  colorPrimary: '#ff6b35',
  colorSuccess: '#4ecdc4',
  borderRadiusBase: '12px'
}
```

### 2. 响应式主题管理

使用 `reactive` 创建响应式主题配置：

```javascript
import { reactive } from 'vue'
import { lightTheme, darkTheme } from '@/themes'

const currentTheme = reactive({ ...lightTheme })

const switchToDark = () => {
  Object.assign(currentTheme, darkTheme)
}

const switchToLight = () => {
  Object.assign(currentTheme, lightTheme)
}
```

### 3. 嵌套主题配置

支持多层嵌套的主题配置：

```vue
<template>
  <!-- 全局主题 -->
  <k-config :theme="globalTheme">
    <view class="page">
      <!-- 局部主题覆盖 -->
      <k-config :theme="localTheme">
        <k-button type="primary" text="局部主题按钮" />
      </k-config>
      
      <k-button type="success" text="全局主题按钮" />
    </view>
  </k-config>
</template>
```

### 4. 主题变量命名规范

遵循统一的命名规范：

```javascript
// ✅ 推荐：语义化命名
{
  colorPrimary: '#007aff',      // 主色
  colorSuccess: '#4cd964',      // 成功色
  borderRadiusBase: '6px',      // 基础圆角
  spacingMd: '16px'             // 中等间距
}

// ❌ 不推荐：具体值命名
{
  blue: '#007aff',
  green: '#4cd964',
  radius6: '6px',
  spacing16: '16px'
}
```

## 注意事项

1. **变量命名**：主题配置对象的属性名会自动转换为 kebab-case，请使用驼峰命名
2. **CSS 变量前缀**：所有生成的 CSS 变量都会添加 `--k-` 前缀
3. **响应式更新**：使用 `reactive` 包装主题配置以支持响应式更新
4. **性能考虑**：避免频繁修改主题配置，建议批量更新
5. **兼容性**：确保目标平台支持 CSS 变量特性

## 示例项目

完整的示例代码可以在 `/pages/config/config.uvue` 中查看，包含：

- 默认主题演示
- 自定义主题配置
- 动态主题切换
- 多种主题预设

通过运行项目并访问「主题配置演示」页面，可以直观地体验 `k-config` 组件的各种功能。