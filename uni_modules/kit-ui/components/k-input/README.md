# k-input 输入框组件

用于接收用户单行文本输入的表单组件，支持清除、密码切换、前后缀图标、错误提示与字数统计，适用于 uni-app x 项目中的登录、搜索、表单录入等场景。

## 基础用法

通过 `v-model` 绑定输入值，使用 `placeholder` 设置占位提示：

```vue
<template>
  <k-input v-model="value" placeholder="请输入内容" />
</template>

<script setup lang="uts">
const value = ref('')
</script>
```

监听 `input` 事件可实时获取输入内容：

```vue
<template>
  <k-input
    v-model="keyword"
    placeholder="请输入关键词"
    @input="handleInput"
  />
</template>

<script setup lang="uts">
const keyword = ref('')

const handleInput = (val: string) => {
  console.log('当前输入：', val)
}
</script>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue / v-model | String | `''` | 输入框绑定值 |
| type | String | `'text'` | 输入类型，可选值见下方 [InputType](#inputtype) |
| placeholder | String | `''` | 占位提示文字 |
| disabled | Boolean | `false` | 是否禁用 |
| readonly | Boolean | `false` | 是否只读 |
| clearable | Boolean | `false` | 是否显示清除按钮 |
| clearTrigger | String | `'focus'` | 清除按钮显示时机，可选值：`focus`（聚焦且有内容时）/ `always`（有内容时始终显示） |
| showPassword | Boolean | `false` | 当 `type="password"` 时，是否显示密码可见性切换按钮 |
| maxlength | Number | `-1` | 最大输入长度，`-1` 表示不限制 |
| size | String | `'medium'` | 输入框尺寸，可选值：`small` / `medium` / `large` |
| error | Boolean | `false` | 是否显示错误状态（边框变红） |
| errorMessage | String | `''` | 错误提示文案，需配合 `error` 使用 |
| prefixIcon | String | `''` | 前缀图标名称，需配合 `k-icon` 支持的图标名 |
| suffixIcon | String | `''` | 后缀图标名称，需配合 `k-icon` 支持的图标名 |
| border | Boolean | `true` | 是否显示边框 |
| round | Boolean | `false` | 是否为胶囊圆角形态 |
| confirmType | String | `'done'` | 键盘右下角按钮文字，可选值：`done` / `search` / `send` / `next` / `go`（仅 `type="text"` 时生效） |
| showWordLimit | Boolean | `false` | 是否显示字数统计，需同时设置 `maxlength` 且大于 0 |
| inputAlign | String | `'left'` | 输入文字对齐方式，可选值：`left` / `center` / `right` |
| customStyle | String | `''` | 自定义内联样式，追加到组件根节点 |
| name | String | `''` | 表单字段名称，供表单提交时使用 |
| adjustPosition | Boolean | `true` | 键盘弹起时是否自动上推页面 |

## 组件事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入值变化时触发，用于 `v-model` 双向绑定 | `value: string` |
| input | 用户输入时触发 | `value: string` |
| change | 失焦且内容发生变化时触发 | `value: string` |
| focus | 获得焦点时触发 | `value: string` |
| blur | 失去焦点时触发 | `value: string` |
| clear | 点击清除按钮时触发 | 无 |
| confirm | 点击键盘右下角确认按钮时触发 | `value: string` |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| prefix | 自定义前缀内容，可与 `prefixIcon` 同时使用 |
| suffix | 自定义后缀内容，可与 `suffixIcon`、清除按钮等同时使用 |

## 类型定义

### InputType

```typescript
type InputType = 'text' | 'password' | 'number' | 'digit' | 'tel' | 'email' | 'idcard'
```

| 值 | 说明 |
| --- | --- |
| text | 文本输入 |
| password | 密码输入，可配合 `showPassword` 切换可见性 |
| number | 数字输入 |
| digit | 带小数点的数字输入 |
| tel | 电话号码输入 |
| email | 邮箱输入 |
| idcard | 身份证号输入 |

### InputSize

```typescript
type InputSize = 'small' | 'medium' | 'large'
```

| 值 | 高度（约） |
| --- | --- |
| small | 32px |
| medium | 40px |
| large | 48px |

### ClearTrigger

```typescript
type ClearTrigger = 'focus' | 'always'
```

## 使用示例

### 不同尺寸

```vue
<template>
  <k-input v-model="value" size="small" placeholder="小尺寸" />
  <k-input v-model="value" size="medium" placeholder="中等尺寸" />
  <k-input v-model="value" size="large" placeholder="大尺寸" />
</template>
```

### 输入类型

```vue
<template>
  <k-input v-model="text" type="text" placeholder="文本" />
  <k-input v-model="pwd" type="password" show-password placeholder="密码" />
  <k-input v-model="phone" type="tel" placeholder="手机号" />
  <k-input v-model="amount" type="digit" placeholder="金额" />
</template>
```

### 清除按钮

`clearTrigger` 默认为 `focus`：聚焦且有内容时显示清除按钮；设为 `always` 则只要有内容就显示。

```vue
<template>
  <!-- 聚焦时显示清除 -->
  <k-input v-model="value1" clearable placeholder="聚焦后显示清除" />

  <!-- 始终显示清除 -->
  <k-input
    v-model="value2"
    clearable
    clear-trigger="always"
    placeholder="始终显示清除"
  />
</template>
```

### 前后缀图标

图标名称需使用 [k-icon](../k-icon/README.md) 支持的图标名：

```vue
<template>
  <k-input v-model="keyword" prefix-icon="search-line" placeholder="搜索" />
  <k-input v-model="email" suffix-icon="mail-line" placeholder="邮箱" />
</template>
```

### 前后缀插槽

需要自定义前缀/后缀文案或结构时，可使用插槽：

```vue
<template>
  <k-input v-model="domain" placeholder="请输入域名">
    <template #prefix>
      <text class="slot-text">https://</text>
    </template>
    <template #suffix>
      <text class="slot-text">.com</text>
    </template>
  </k-input>
</template>

<style lang="scss">
.slot-text {
  font-size: 12px;
  color: var(--k-text-color-secondary, #6b7280);
}
</style>
```

### 禁用与只读

```vue
<template>
  <k-input v-model="disabledVal" disabled placeholder="禁用状态" />
  <k-input v-model="readonlyVal" readonly placeholder="只读状态" />
</template>
```

### 错误状态

适合配合表单校验，在输入不合法时给出提示：

```vue
<template>
  <k-input
    v-model="username"
    placeholder="至少 6 个字符"
    :error="username.length > 0 && username.length < 6"
    :error-message="username.length > 0 && username.length < 6 ? '长度不能少于 6 个字符' : ''"
  />
</template>
```

### 字数限制

```vue
<template>
  <k-input
    v-model="content"
    placeholder="最多 10 个字符"
    :maxlength="10"
    show-word-limit
    clearable
  />
</template>
```

### 搜索场景

配合 `confirm-type="search"` 可将键盘右下角按钮设为「搜索」：

```vue
<template>
  <k-input
    v-model="keyword"
    prefix-icon="search-line"
    confirm-type="search"
    clearable
    placeholder="搜索关键词"
    @confirm="handleSearch"
  />
</template>

<script setup lang="uts">
const keyword = ref('')

const handleSearch = (val: string) => {
  console.log('搜索：', val)
}
</script>
```

### 无边框与圆角

```vue
<template>
  <k-input v-model="value1" :border="false" placeholder="无边框输入框" />
  <k-input v-model="value2" round clearable placeholder="圆角输入框" />
</template>
```

### 事件监听

```vue
<template>
  <k-input
    v-model="value"
    clearable
    placeholder="输入内容查看事件"
    @input="onInput"
    @change="onChange"
    @focus="onFocus"
    @blur="onBlur"
    @clear="onClear"
    @confirm="onConfirm"
  />
</template>

<script setup lang="uts">
const value = ref('')

const onInput = (val: string) => { console.log('input', val) }
const onChange = (val: string) => { console.log('change', val) }
const onFocus = (val: string) => { console.log('focus', val) }
const onBlur = (val: string) => { console.log('blur', val) }
const onClear = () => { console.log('clear') }
const onConfirm = (val: string) => { console.log('confirm', val) }
</script>
```

## 主题定制

可通过 `k-config` 包裹输入框，统一调整边框色、主色等主题变量：

```vue
<template>
  <k-config :theme="customTheme">
    <k-input v-model="value" placeholder="主题色输入框" />
  </k-config>
</template>

<script setup lang="uts">
const value = ref('')

const customTheme = {
  colorPrimary: '#6366f1',
  colorError: '#ef4444'
}
</script>
```

聚焦态边框会使用 `--k-color-primary`，错误态会使用 `--k-color-error`。更多变量说明请参考 [k-config 文档](../k-config/README.md)。

## 平台兼容说明

| 能力 | WEB | APP | 小程序 |
| --- | --- | --- | --- |
| 基础输入与 v-model | ✅ | ✅ | ✅ |
| clearable 清除 | ✅ | ✅ | ✅ |
| showPassword 密码切换 | ✅ | ✅ | ✅ |
| prefixIcon / suffixIcon | ✅ | ✅ | ✅ |
| showWordLimit 字数统计 | ✅ | ✅ | ✅ |
| confirmType 键盘确认 | ✅ | ✅ | ✅（部分输入法表现可能有差异） |

### 清除按钮

- 默认 `clearTrigger="focus"`：输入框**聚焦且有内容**时显示清除按钮，失焦后隐藏。
- 设为 `clear-trigger="always"`：只要有内容就显示清除按钮。
- 微信小程序端原生 `input` 层级较高，清除按钮已做点击区域适配；若清除无响应，请确认已更新到最新版本并在真机验证。

### 密码输入

设置 `type="password"` 并开启 `show-password` 后，可通过右侧按钮切换密码可见性。推荐始终使用此方式，而非手动切换 `type`，跨端兼容性更好。

### 表单配合

当前 `k-input` 提供单行输入能力；完整表单校验、标签布局请等待后续 `k-form` / `k-form-item` 组件。在此之前，可通过 `error` + `errorMessage` 自行实现简单校验提示。

## 注意事项

1. 组件遵循 easycom 规范，安装 kit-ui 后可直接使用 `<k-input />`，无需手动注册。
2. `v-model` 绑定值类型为 `string`；数字类输入（`type="number"` / `digit`）返回内容仍为字符串，如需数值请自行转换。
3. `maxlength` 设为 `-1` 时不限制长度；开启 `showWordLimit` 时必须设置大于 0 的 `maxlength` 才会显示统计。
4. `disabled` 与 `readonly` 状态下，清除按钮、密码切换按钮均不会显示，输入事件也不会触发。
5. `prefixIcon`、`suffixIcon` 需使用 [k-icon](../k-icon/README.md) 支持的图标名称，否则无法正常显示。
6. `round` 为胶囊圆角样式，与 `k-button` 的圆角按钮视觉保持一致；过宽的容器下仍保持矩形比例，不会变为椭圆。
7. `errorMessage` 仅在 `error` 为 `true` 且文案不为空时展示；建议校验逻辑由业务侧控制，组件只负责展示。
8. 插槽内的文字样式请写在 `<text>` 上，符合 uni-app x 字体样式规范。
9. 需要多行文本输入时，请使用 [k-textarea](../k-textarea/README.md) 组件，不要使用 `k-input` 模拟多行。
10. 更多交互示例可参考演示页 `pages/input/input.uvue`。
