# k-textarea 多行文本输入组件

用于接收用户多行文本输入的表单组件，支持固定高度、自动增高、清除、字数统计与错误提示，适用于 uni-app x 项目中的备注、评论、反馈、描述等录入场景。

## 基础用法

通过 `v-model` 绑定输入值，使用 `placeholder` 设置占位提示：

```vue
<template>
  <k-textarea v-model="content" placeholder="请输入备注内容" />
</template>

<script setup lang="uts">
const content = ref('')
</script>
```

监听 `input` 事件可实时获取输入内容：

```vue
<template>
  <k-textarea
    v-model="content"
    placeholder="请输入反馈"
    @input="handleInput"
  />
</template>

<script setup lang="uts">
const content = ref('')

const handleInput = (val: string) => {
  console.log('当前输入：', val)
}
</script>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue / v-model | String | `''` | 文本域绑定值 |
| placeholder | String | `''` | 占位提示文字 |
| disabled | Boolean | `false` | 是否禁用 |
| readonly | Boolean | `false` | 是否只读 |
| clearable | Boolean | `false` | 是否显示清除按钮 |
| clearTrigger | String | `'focus'` | 清除按钮显示时机，可选值：`focus` / `always` |
| maxlength | Number | `-1` | 最大输入长度，`-1` 表示不限制 |
| size | String | `'medium'` | 文本域尺寸，可选值：`small` / `medium` / `large` |
| height | String | `'120px'` | 固定高度（`autoHeight` 为 `false` 时生效） |
| error | Boolean | `false` | 是否显示错误状态（边框变红） |
| errorMessage | String | `''` | 错误提示文案，需配合 `error` 使用 |
| border | Boolean | `true` | 是否显示边框 |
| round | Boolean | `false` | 是否使用较大圆角 |
| autoHeight | Boolean | `false` | 是否自动增高（开启后 `height` 不生效） |
| showWordLimit | Boolean | `false` | 是否显示字数统计，需同时设置 `maxlength > 0` |
| confirmType | String | `'return'` | 键盘右下角按钮文字，可选值见 [ConfirmType](#confirmtype) |
| confirmHold | Boolean | `false` | 点击键盘确认按钮后是否保持键盘不收起 |
| showConfirmBar | Boolean | `true` | 是否显示键盘上方确认栏（部分平台） |
| holdKeyboard | Boolean | `false` | 聚焦时点击页面是否保持键盘不收起 |
| inputAlign | String | `'left'` | 文本对齐方式，可选值：`left` / `center` / `right` |
| customStyle | String | `''` | 自定义内联样式，追加到组件根节点 |
| name | String | `''` | 表单字段名称 |
| adjustPosition | Boolean | `true` | 键盘弹起时是否自动上推页面 |
| cursorSpacing | Number | `0` | 光标与键盘的距离（px） |

## 组件事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入值变化时触发，用于 `v-model` 双向绑定 | `value: string` |
| input | 用户输入时触发 | `value: string` |
| change | 失焦且内容发生变化时触发 | `value: string` |
| focus | 获得焦点时触发 | `value: string` |
| blur | 失去焦点时触发 | `value: string` |
| clear | 点击清除按钮时触发 | 无 |
| confirm | 点击键盘确认按钮时触发 | `value: string` |
| linechange | 行数变化时触发（常用于 `autoHeight`） | `{ height, heightRpx, lineCount }` |

## 插槽

当前版本不提供插槽，后续如需顶部说明、底部自定义操作区可扩展。

## 类型定义

### TextareaSize

```typescript
type TextareaSize = 'small' | 'medium' | 'large'
```

| 值 | 默认最小高度（约） |
| --- | --- |
| small | 80px |
| medium | 120px |
| large | 160px |

### ClearTrigger

```typescript
type ClearTrigger = 'focus' | 'always'
```

### ConfirmType

```typescript
type ConfirmType = 'return' | 'done' | 'send' | 'search' | 'next' | 'go'
```

| 值 | 说明 |
| --- | --- |
| return | 换行（textarea 默认值） |
| done | 完成 |
| send | 发送 |
| search | 搜索 |
| next | 下一个 |
| go | 前往 |

## 使用示例

### 不同尺寸

```vue
<template>
  <k-textarea v-model="content" size="small" placeholder="小尺寸" />
  <k-textarea v-model="content" size="medium" placeholder="中等尺寸" />
  <k-textarea v-model="content" size="large" placeholder="大尺寸" />
</template>
```

### 自动增高

适合内容长度不确定的场景，高度随输入自动增长：

```vue
<template>
  <k-textarea
    v-model="content"
    auto-height
    placeholder="输入越多，高度越高"
  />
</template>
```

### 固定高度

内容超出时在文本域内部滚动：

```vue
<template>
  <k-textarea
    v-model="content"
    height="180px"
    placeholder="固定高度 180px"
  />
</template>
```

### 清除按钮

清除按钮位于底部工具栏，避免与原生文本域重叠，跨端点击更稳定：

```vue
<template>
  <k-textarea v-model="content" clearable placeholder="聚焦后显示清除" />
  <k-textarea
    v-model="content"
    clearable
    clear-trigger="always"
    placeholder="始终显示清除"
  />
</template>
```

### 字数限制

```vue
<template>
  <k-textarea
    v-model="content"
    placeholder="最多 200 字"
    :maxlength="200"
    show-word-limit
    clearable
  />
</template>
```

### 禁用与只读

```vue
<template>
  <k-textarea v-model="content" disabled placeholder="禁用状态" />
  <k-textarea v-model="content" readonly placeholder="只读状态" />
</template>
```

### 错误状态

```vue
<template>
  <k-textarea
    v-model="content"
    placeholder="至少 10 个字符"
    :error="content.length > 0 && content.length < 10"
    :error-message="content.length > 0 && content.length < 10 ? '长度不能少于 10 个字符' : ''"
  />
</template>
```

### 发送场景

配合 `confirm-type="send"` 与 `confirm-hold` 可用于评论、聊天等场景：

```vue
<template>
  <k-textarea
    v-model="message"
    auto-height
    confirm-type="send"
    :confirm-hold="true"
    placeholder="输入消息后点击发送"
    @confirm="handleSend"
  />
</template>

<script setup lang="uts">
const message = ref('')

const handleSend = (val: string) => {
  console.log('发送：', val)
  message.value = ''
}
</script>
```

### 无边框与圆角

```vue
<template>
  <k-textarea v-model="content" :border="false" placeholder="无边框" />
  <k-textarea v-model="content" round placeholder="圆角文本域" />
</template>
```

### 事件监听

```vue
<template>
  <k-textarea
    v-model="content"
    auto-height
    clearable
    @input="onInput"
    @change="onChange"
    @focus="onFocus"
    @blur="onBlur"
    @clear="onClear"
    @confirm="onConfirm"
    @linechange="onLineChange"
  />
</template>

<script setup lang="uts">
const content = ref('')

const onInput = (val: string) => { console.log('input', val) }
const onChange = (val: string) => { console.log('change', val) }
const onFocus = (val: string) => { console.log('focus', val) }
const onBlur = (val: string) => { console.log('blur', val) }
const onClear = () => { console.log('clear') }
const onConfirm = (val: string) => { console.log('confirm', val) }
const onLineChange = (detail: UTSJSONObject) => { console.log('linechange', detail) }
</script>
```

## 主题定制

可通过 `k-config` 包裹文本域，统一调整边框色、主色等主题变量：

```vue
<template>
  <k-config :theme="customTheme">
    <k-textarea v-model="content" placeholder="主题色文本域" />
  </k-config>
</template>

<script setup lang="uts">
const content = ref('')

const customTheme = {
  colorPrimary: '#6366f1',
  colorError: '#ef4444'
}
</script>
```

聚焦态边框使用 `--k-color-primary`，错误态使用 `--k-color-error`。更多变量请参考 [k-config 文档](../k-config/README.md)。

## 平台兼容说明

| 能力 | WEB | APP | 小程序 |
| --- | --- | --- | --- |
| 基础输入与 v-model | ✅ | ✅ | ✅ |
| autoHeight 自动增高 | ✅ | ✅ | ✅ |
| clearable 清除 | ✅ | ✅ | ✅ |
| showWordLimit 字数统计 | ✅ | ✅ | ✅ |
| confirmType / confirmHold | ✅ | ✅ | ✅（部分输入法表现可能有差异） |
| linechange 行变化 | ✅ | ✅ | ✅ |

### 与 k-input 的区别

| 对比项 | k-input | k-textarea |
| --- | --- | --- |
| 适用场景 | 单行输入 | 多行输入 |
| 自动增高 | 不支持 | 支持 `autoHeight` |
| 清除按钮位置 | 右侧后缀区 | 底部工具栏 |
| 默认 confirmType | `done` | `return` |
| 密码输入 | 支持 | 不支持 |

单行输入请使用 [k-input](../k-input/README.md)。

## 注意事项

1. 组件遵循 easycom 规范，安装 kit-ui 后可直接使用 `<k-textarea />`，无需手动注册。
2. `autoHeight` 为 `true` 时，`height` 属性不生效，高度由内容与 `size` 决定的最小高度共同影响。
3. `maxlength` 设为 `-1` 时不限制长度；开启 `showWordLimit` 时必须设置大于 0 的 `maxlength`。
4. `disabled` 与 `readonly` 状态下，清除按钮不会显示，输入事件也不会触发。
5. 清除按钮放在底部工具栏，相比覆盖在原生控件上方，在微信小程序端点击更可靠。
6. `round` 使用较大圆角（12px），适合卡片式表单；不建议使用过大的百分比圆角，避免视觉变形。
7. `errorMessage` 仅在 `error` 为 `true` 且文案不为空时展示；校验逻辑建议由业务侧控制。
8. 不要在原生 `textarea` 上写 `line-height`、`color` 等字体样式；占位符样式通过 `placeholder-style` 设置，符合 uni-app x 规范。
9. 需要单行输入（手机号、密码、搜索框等）请使用 `k-input`，不要用 `k-textarea` 代替。
10. 更多交互示例可参考演示页 `pages/textarea/textarea.uvue`。
