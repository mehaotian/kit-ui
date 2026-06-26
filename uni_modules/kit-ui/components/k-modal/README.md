# k-modal 模态框

基于 `<k-popup position="center">` 的对话框语义层，预设标题、内容与确认/取消按钮，不 fork 弹层动画。

## 基础用法

```vue
<k-modal
  v-model:show="show"
  title="提示"
  content="确认删除该记录吗？"
  @confirm="onConfirm"
/>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show / v-model:show | 是否显示 | `boolean` | `false` |
| title | 标题 | `string` | `''` |
| content | 内容文案 | `string` | `''` |
| showCancelButton | 显示取消按钮 | `boolean` | `true` |
| showConfirmButton | 显示确认按钮 | `boolean` | `true` |
| confirmText | 确认按钮文案 | `string` | `'确定'` |
| cancelText | 取消按钮文案 | `string` | `'取消'` |
| confirmType | 确认按钮类型 | `string` | `'primary'` |
| cancelType | 取消按钮类型 | `string` | `'default'` |
| confirmDisabled | 禁用确认按钮 | `boolean` | `false` |
| confirmLoading | 确认按钮 loading（手动控制） | `boolean` | `false` |
| closeOnClickOverlay | 点击遮罩是否关闭 | `boolean` | `false` |
| beforeClose | 关闭拦截，见下文 | `(action) => boolean \| Promise<boolean>` | — |
| duration | 动画时长 ms | `number` | `300` |
| overlayOpacity | 遮罩透明度 | `number` | `0.5` |
| width | 弹层宽度 | `string` | `''` |
| lazyRender | 懒渲染 | `boolean` | `true` |
| destroyOnClose | 关闭后销毁 | `boolean` | `false` |
| zIndex | 层级，`0` 自动分配 | `number` | `0` |

### beforeClose

`action`：`confirm` | `cancel` | `overlay`

| 返回值 | 行为 |
| --- | --- |
| `true` / `null` / 未返回 | 允许关闭，并 emit 对应事件（overlay 除外，见 Events） |
| `false` | 阻止关闭，`show` 不变 |
| `Promise<true>` | 异步结束后关闭；**全程锁定底部按钮** |
| `Promise<false>` | 异步结束后仍保持打开 |

异步 `confirm` 时：确认按钮自动 `loading` + 禁用；取消按钮同步禁用。

同步示例：

```uts
function handleBeforeClose(action: string): boolean {
  if (action == 'confirm' && !agreeChecked.value) {
    return false
  }
  return true
}
```

异步示例：

```uts
function handleAsyncClose(action: string): boolean | Promise<boolean> {
  if (action != 'confirm') return true
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1500)
  })
}
```

## Events

| 事件 | 说明 |
| --- | --- |
| update:show | v-model 同步 |
| open / opened | 打开前 / 动画结束 |
| close / closed | 关闭前 / 动画结束 |
| confirm | 点击确定且允许关闭 |
| cancel | 点击取消且允许关闭 |
| clickOverlay | 点击遮罩（不论是否关闭） |

> `overlay` 动作关闭时 **不** emit `confirm` / `cancel`。

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 自定义内容区 |
| title | 自定义标题 |

## Expose

| 方法 | 说明 |
| --- | --- |
| open() | 打开 |
| close() | 关闭（**不经过 beforeClose**，与 `v-model=false` 一致） |

## 与 k-popup 的配合

modal 固定传入：

- `body-padding="0"` — 内边距由 modal 区块自行控制
- `:default-safe-area="false"` — 避免 center 模式底部 safe-area 空隙过大
- `:close-on-click-overlay="false"` — 遮罩关闭由 modal 层 `beforeClose` 统一处理

## 层级

- 语义基准 `Z_INDEX_MODAL (4000)`，实际值由 `nextZIndex` 全局单调分配
- 每个打开周期仅 `nextZIndex` 一次（`ensureZIndexOnce`）

## 与 k-toast 同屏

- toast 后开时会叠在 modal 之上（见 `overlay-stack.uts`）
- modal 未关时更新 toast 内容：只改 toast 的 message/type，勿关 modal

## 页面滚动

配合 `page-meta` + `resolvePageMetaOverflow`，参见 `pages/modal/modal.uvue`。

## 注意事项

- 打开期间 `title` / `content` 响应式更新，不重播 popup 动画
- APP 端改动后需全量运行，不单靠 HMR
