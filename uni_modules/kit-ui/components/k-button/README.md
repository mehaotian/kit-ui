# k-button 按钮组件

用于触发操作、提交表单或页面跳转的按钮组件，支持多种类型、尺寸与视觉样式，适用于 uni-app x 项目。

## 基础用法

通过 `text` 属性设置按钮文字，通过 `type` 区分语义类型：

```vue
<template>
  <k-button text="默认按钮" />
  <k-button type="primary" text="主要按钮" />
  <k-button type="success" text="成功按钮" />
  <k-button type="warning" text="警告按钮" />
  <k-button type="danger" text="危险按钮" />
</template>
```

监听 `click` 事件处理点击逻辑：

```vue
<template>
  <k-button type="primary" text="提交" @click="handleSubmit" />
</template>

<script setup>
const handleSubmit = () => {
  console.log('按钮被点击')
}
</script>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | String | `'default'` | 按钮类型，可选值：`default` / `primary` / `success` / `warning` / `danger` |
| size | String | `'medium'` | 按钮尺寸，可选值：`small` / `medium` / `large` |
| text | String | `''` | 按钮文字，也可通过默认插槽自定义内容 |
| disabled | Boolean | `false` | 是否禁用 |
| loading | Boolean | `false` | 是否显示加载状态 |
| plain | Boolean | `false` | 是否为朴素按钮（透明背景 + 描边） |
| round | Boolean | `false` | 是否为圆角按钮 |
| circle | Boolean | `false` | 是否为圆形按钮 |
| icon | String | `''` | 左侧图标名称，需配合 `k-icon` 支持的图标名使用 |
| gradient | Boolean | `false` | 是否启用渐变背景 |
| shadow | Boolean | `false` | 是否启用阴影效果 |

## 组件事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发 | 无 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义按钮内容，优先级高于 `text` 属性 |

## 类型定义

### ButtonType

```typescript
type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'
```

### ButtonSize

```typescript
type ButtonSize = 'small' | 'medium' | 'large'
```

## 使用示例

### 朴素按钮

适合次要操作或需要弱化视觉重量的场景：

```vue
<template>
  <k-button plain text="默认按钮" />
  <k-button type="primary" plain text="朴素主要" />
  <k-button type="success" plain text="朴素成功" />
  <k-button type="warning" plain text="朴素警告" />
  <k-button type="danger" plain text="朴素危险" />
</template>
```

### 渐变按钮

为强调类操作增加渐变背景效果：

```vue
<template>
  <k-button type="primary" gradient text="渐变主要" />
  <k-button type="success" gradient text="渐变成功" />
  <k-button type="warning" gradient text="渐变警告" />
  <k-button type="danger" gradient text="渐变危险" />
</template>
```

### 阴影按钮

为按钮增加投影，突出层级感：

```vue
<template>
  <k-button type="default" shadow text="默认阴影" />
  <k-button type="primary" shadow text="主要阴影" />
  <k-button type="success" shadow text="成功阴影" />
</template>
```

### 不同尺寸

```vue
<template>
  <k-button type="primary" size="small" text="小按钮" />
  <k-button type="primary" size="medium" text="中按钮" />
  <k-button type="primary" size="large" text="大按钮" />
</template>
```

### 特殊形状

```vue
<template>
  <!-- 圆角按钮 -->
  <k-button type="primary" round text="圆角按钮" />

  <!-- 圆形按钮，建议配合简短文字或符号 -->
  <k-button type="primary" circle text="+" />
  <k-button type="primary" circle icon="add-line" />
</template>
```

### 带图标

通过 `icon` 在文字左侧展示图标；加载中时图标会被加载动画替代：

```vue
<template>
  <k-button type="primary" icon="ball-pen-fill" text="编辑" />
  <k-button type="success" plain icon="layout-3-line" text="布局" />
</template>
```

### 加载状态

加载中时按钮不可再次点击，`click` 事件不会触发：

```vue
<template>
  <k-button
    type="primary"
    :loading="isLoading"
    text="点击提交"
    @click="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)

const handleSubmit = () => {
  isLoading.value = true
  // 异步操作完成后关闭 loading
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>
```

### 禁用状态

禁用后按钮不可点击，`click` 事件不会触发：

```vue
<template>
  <k-button disabled text="禁用按钮" />
  <k-button type="primary" disabled text="禁用主要" />
  <k-button type="success" disabled gradient text="禁用渐变" />
</template>
```

### 插槽用法

需要自定义内容时，可直接使用默认插槽：

```vue
<template>
  <k-button type="warning" icon="mail-line">
    自定义内容
  </k-button>
</template>
```

## 主题定制

可通过 `k-config` 包裹按钮，统一调整主色、成功色等主题变量，子级按钮会自动跟随：

```vue
<template>
  <k-config :theme="customTheme">
    <k-button type="primary" text="主要按钮" />
    <k-button type="success" text="成功按钮" />
  </k-config>
</template>

<script setup>
const customTheme = {
  colorPrimary: '#6366f1',
  colorSuccess: '#10b981',
  colorWarning: '#f59e0b',
  colorError: '#ef4444'
}
</script>
```

常用主题变量：

| 变量名 | 说明 |
| --- | --- |
| colorPrimary | 主要按钮颜色 |
| colorSuccess | 成功按钮颜色 |
| colorWarning | 警告按钮颜色 |
| colorError | 危险按钮颜色 |

更多变量说明请参考 [k-config 文档](../k-config/README.md)。

## 原生按钮样式覆盖

常规交互优先使用 `k-button` 组件。当需要使用**平台原生能力**（如微信小程序的 `open-type`、表单提交、`form-type` 等）时，可直接使用原生 `<button>`，并挂载 kit-ui 提供的样式类，复用与 `k-button` 一致的视觉效果。

### 何时使用

| 场景 | 推荐方案 |
| --- | --- |
| 普通点击、页面内操作 | `k-button` 组件 |
| 需要图标、加载态 | `k-button` 组件 |
| 需要阴影效果（`shadow`） | `k-button` 组件 |
| 需要微信小程序开放能力（如获取手机号） | 原生 `<button>` + 样式类 |
| 需要表单提交（`form-type="submit"` 等） | 原生 `<button>` + 样式类 |

### 基础写法

样式类已通过 kit-ui 主题全局引入，按以下方式组合即可：

```vue
<template>
  <!-- 主要按钮 -->
  <button
    class="kit-ui--root k-button k-button--primary"
    hover-class="k-button--primary--active"
  >
    原生主要按钮
  </button>

  <!-- 朴素按钮 -->
  <button
    class="kit-ui--root k-button k-button--danger k-button--plain"
    hover-class="k-button--plain--danger--active"
  >
    原生镂空按钮
  </button>

  <!-- 渐变按钮 -->
  <button
    class="kit-ui--root k-button k-button--primary k-button--gradient"
    hover-class="k-button--gradient--primary--active"
  >
    原生渐变按钮
  </button>
</template>
```

> 建议同时添加 `kit-ui--root` 与 `k-button` 基础类，以确保主题变量正常生效。

### 可用样式类

与 `k-button` 组件共用同一套类名语义：

| 类别 | 类名示例 |
| --- | --- |
| 基础 | `k-button` |
| 类型 | `k-button--default` / `k-button--primary` / `k-button--success` / `k-button--warning` / `k-button--danger` |
| 尺寸 | `k-button--small` / `k-button--medium` / `k-button--large` |
| 形态 | `k-button--plain` / `k-button--gradient` / `k-button--round` / `k-button--circle` |
| 状态 | `k-button--disabled` |

按压反馈通过 `hover-class` 绑定对应的 `--active` 类名，例如：

- 实心主要按钮：`hover-class="k-button--primary--active"`
- 朴素危险按钮：`hover-class="k-button--plain--danger--active"`
- 渐变主要按钮：`hover-class="k-button--gradient--primary--active"`

### 尺寸与禁用

```vue
<template>
  <button
    class="kit-ui--root k-button k-button--warning k-button--small"
    hover-class="k-button--warning--active"
  >
    小号按钮
  </button>

  <button
    class="kit-ui--root k-button k-button--primary k-button--large"
    hover-class="k-button--primary--active"
  >
    大号按钮
  </button>

  <button
    class="kit-ui--root k-button k-button--default k-button--disabled"
    disabled
  >
    禁用按钮
  </button>
</template>
```

禁用需同时设置原生 `disabled` 属性与 `k-button--disabled` 样式类。

### 平台能力示例

需要调用平台开放能力时，在原生 `<button>` 上直接使用对应属性，样式类保持不变：

```vue
<!-- #ifdef MP-WEIXIN -->
<template>
  <button
    class="kit-ui--root k-button k-button--success"
    open-type="getPhoneNumber"
    hover-class="k-button--success--active"
    @getphonenumber="handleGetPhoneNumber"
  >
    获取手机号
  </button>
</template>
<!-- #endif -->
```

> 平台开放能力因端而异，请查阅 uni-app 文档并按需做条件编译。完整示例可参考演示页 `pages/button-style/button-style.uvue`。

### 样式覆盖的能力边界

原生 `<button>` + 样式类**仅复用视觉样式**，以下能力请继续使用 `k-button` 组件：

- `shadow` 阴影效果
- `loading` 加载状态
- `icon` 图标
- 内置的 `click` 防抖（禁用/加载时自动拦截）

## 平台兼容说明

kit-ui 按钮在 WEB、APP、小程序等平台均可使用，但部分能力存在端差异，开发时请注意：

| 能力 | WEB | APP | 小程序 |
| --- | --- | --- | --- |
| `k-button` 基础样式 | ✅ | ✅ | ✅ |
| 原生 `<button>` 样式覆盖 | ✅ | ✅ | ✅ |
| `gradient` 渐变 | ✅ | ✅ | ✅ |
| `shadow` 阴影 | ✅（仅组件） | ✅（仅组件） | ✅（仅组件） |
| `loading` / `icon` | ✅（仅组件） | ✅（仅组件） | ✅（仅组件） |
| 平台开放能力（`open-type` 等） | ❌ | ❌ | ✅（视平台而定） |

### 渐变效果

`gradient` 在 APP 与 WEB/小程序上的渲染方式略有差异，各端会尽量保持视觉一致。若对某一端渐变表现有特殊要求，建议在该端单独验收。

### WEB 端

`k-button` 在 WEB 端内置了透明的原生 `<button>` 覆盖层，用于改善浏览器下的点击体验，业务侧无需额外处理，正常使用组件即可。

### APP 端

APP 端原生 `<button>` 样式覆盖在布局上与 WEB/小程序略有差异（如文字对齐方式），但整体尺寸、颜色与圆角保持一致。

### 小程序端

- 需要 `open-type`、`form-type` 等能力时，**必须使用原生 `<button>` + 样式类**，`k-button` 组件无法替代。
- 微信等平台能力仅在该平台可用，请配合条件编译（如 `MP-WEIXIN`）编写，避免在其他端报错。
- 小程序原生按钮默认带有边框样式，kit-ui 样式类已处理常见默认样式，若仍有残留边框可检查是否遗漏 `k-button` 基础类。

### 选型建议

1. **默认选 `k-button`**：绝大多数页面内按钮交互。
2. **平台能力选原生 `<button>`**：仅在确实需要原生属性时使用，并挂载 kit-ui 样式类保持视觉统一。
3. **按端验收**：涉及渐变、开放能力、表单提交的按钮，建议在目标平台各做一次冒烟验证。

## 注意事项

1. 组件遵循 easycom 规范，安装 kit-ui 后可直接使用，无需手动注册。
2. `disabled` 与 `loading` 状态下，`click` 事件均不会触发，请避免重复提交。
3. `loading` 为 `true` 时，左侧 `icon` 会被加载动画替代。
4. 圆形按钮（`circle`）建议配合单个字符、符号或纯图标使用，文字过长可能影响展示效果。
5. `gradient`、`plain`、`shadow` 可与 `type` 组合使用，按业务场景选择一种主视觉风格即可，避免叠加过多效果。
6. `icon` 需使用 `k-icon` 组件支持的图标名称，具体可参考 [k-icon 文档](../k-icon/README.md)。
7. 同一页面中建议通过 `type` 区分操作优先级：主要操作用 `primary`，危险操作用 `danger`，次要操作用 `default` 或 `plain`。
8. 如需全局统一按钮配色，推荐通过 `k-config` 配置主题，而非逐个按钮写死颜色。
9. 原生 `<button>` 样式覆盖不支持 `shadow`，阴影效果请使用 `k-button` 组件。
10. 原生按钮的禁用状态需同时设置 `disabled` 属性与 `k-button--disabled` 类名。
