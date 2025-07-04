# k-icon 图标组件

轻量、扩展方便、用法简单的图标组件，支持多种图标类型和丰富的功能特性。

## 特性

- 🎯 **轻量级**：核心代码精简，按需加载
- 🔧 **易扩展**：支持多种图标源，配置灵活
- 📱 **跨平台**：完美适配 H5/小程序/App/鸿蒙
- 🎨 **主题化**：深度集成 kit-ui 主题系统
- ⚡ **高性能**：智能缓存，优化渲染
- 🛠 **TypeScript**：完整的类型定义

## 支持的图标类型

### 1. 内置图标（Unicode）

```vue
<k-icon name="home" size="24" />
<k-icon name="user" size="24" />
<k-icon name="setting" size="24" />
```

### 2. 图片图标

```vue
<!-- 网络图片 -->
<k-icon name="https://example.com/icon.png" size="32" />
<!-- 本地图片 -->
<k-icon name="/static/logo.png" size="32" />
```

### 3. SVG 图标

```vue
<!-- Iconify 图标 -->
<k-icon name="mdi:home" size="24" />
<k-icon name="heroicons:user" size="24" />
```

### 4. 自定义字体图标

```vue
<k-icon name="\uE001" size="24" prefix="custom-font" />
```

## 基础用法

### 图标尺寸

```vue
<!-- 预设尺寸 -->
<k-icon name="home" size="xs" />   <!-- 12px -->
<k-icon name="home" size="sm" />   <!-- 14px -->
<k-icon name="home" size="md" />   <!-- 16px -->
<k-icon name="home" size="lg" />   <!-- 18px -->
<k-icon name="home" size="xl" />   <!-- 20px -->
<k-icon name="home" size="2xl" />  <!-- 24px -->

<!-- 自定义尺寸 -->
<k-icon name="home" size="32" />
<k-icon name="home" size="48" />
```

### 图标颜色

```vue
<!-- 主题颜色 -->
<k-icon name="heart" color="primary" />
<k-icon name="heart" color="success" />
<k-icon name="heart" color="warning" />
<k-icon name="heart" color="danger" />
<k-icon name="heart" color="info" />

<!-- 自定义颜色 -->
<k-icon name="star" color="#ff6b6b" />
<k-icon name="star" color="rgb(255, 107, 107)" />
```

## 高级功能

### 加载状态

```vue
<!-- 加载动画 -->
<k-icon name="loading" loading />
<!-- 旋转动画 -->
<k-icon name="refresh" spin />
<!-- 动态加载状态 -->
<k-icon name="setting" :loading="isLoading" />
```

### 徽标功能

```vue
<!-- 红点徽标 -->
<k-icon name="home" dot />
<!-- 数字徽标 -->
<k-icon name="user" badge="5" />
<k-icon name="setting" badge="99" />
<!-- 文字徽标 -->
<k-icon name="heart" badge="new" />
```

### 禁用状态

```vue
<k-icon name="home" disabled />
```

### 自定义样式

```vue
<k-icon 
  name="heart" 
  size="32" 
  color="#ff6b6b" 
  custom-style="border: 2px solid #ff6b6b; border-radius: 50%; padding: 8px;"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 图标名称/URL/Unicode | `string` | - |
| size | 图标尺寸 | `string \| number` | `'md'` |
| color | 图标颜色 | `string` | - |
| prefix | 字体图标前缀 | `string` | `'k-icon'` |
| custom-style | 自定义样式 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否显示加载状态 | `boolean` | `false` |
| spin | 是否旋转 | `boolean` | `false` |
| dot | 是否显示红点徽标 | `boolean` | `false` |
| badge | 徽标内容 | `string \| number` | - |
| inherit | 是否继承父元素颜色 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击图标时触发 | `event: Event` |
| load | 图片加载完成时触发 | `event: Event` |
| error | 图片加载失败时触发 | `event: Event` |

## 配置

### 全局配置

可以通过修改 `config.uts` 文件来自定义全局配置：

```typescript
// 修改默认配置
const customConfig: IconConfig = {
  host: 'https://your-icon-host.com',
  prefix: 'your-prefix',
  cache: true,
  lazyLoad: true
}

// 应用配置
setIconConfig(customConfig)
```

### 添加自定义图标

```typescript
// 添加内置图标
addBuiltinIcon('custom-icon', '\uE100')

// 批量添加
addBuiltinIcons({
  'icon1': '\uE101',
  'icon2': '\uE102',
  'icon3': '\uE103'
})
```

## 字体文件说明

组件需要字体文件支持，请确保以下文件存在：

- `fonts/k-icons.ttf` - 主要图标字体文件
- `fonts/k-icons.woff` - Web 字体文件（可选）
- `fonts/k-icons.woff2` - Web 字体文件（可选）

> **注意**：由于字体文件较大，本示例未包含实际字体文件。在实际使用时，您需要：
>
> 1. 准备图标字体文件（.ttf 格式）
> 2. 将字体文件放置在 `fonts/` 目录下
> 3. 根据字体文件更新 `k-icon.scss` 中的字体路径
> 4. 在 `config.uts` 中配置对应的 Unicode 映射

## 主题定制

组件深度集成了 kit-ui 主题系统，支持以下 CSS 变量：

```scss
:root {
  --k-color-primary: #007aff;
  --k-color-success: #28a745;
  --k-color-warning: #ffc107;
  --k-color-danger: #dc3545;
  --k-color-info: #17a2b8;
  --k-color-text-primary: #303133;
  --k-color-text-secondary: #606266;
  --k-color-text-disabled: #c0c4cc;
}
```

## 性能优化

1. **按需加载**：只加载使用到的图标
2. **智能缓存**：自动缓存已加载的图标
3. **懒加载**：支持图片图标的懒加载
4. **预设尺寸**：使用预设尺寸减少计算开销

## 兼容性

- ✅ H5
- ✅ 微信小程序
- ✅ 支付宝小程序
- ✅ 百度小程序
- ✅ 字节跳动小程序
- ✅ QQ 小程序
- ✅ App (Android/iOS)
- ✅ 鸿蒙 OS

## 更新日志

### v1.0.0

- 🎉 初始版本发布
- ✨ 支持多种图标类型
- ✨ 完整的主题系统集成
- ✨ 丰富的功能特性
- ✨ 完善的 TypeScript 支持
