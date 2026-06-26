# k-toast 轻提示

轻量消息提示，支持 top / center / bottom 三位置与自动消失。动画与 `k-popup` 同模式（APP `setProperty` / WEB·MP CSS + 双帧延迟）。

## 基础用法（声明式）

```vue
<k-toast v-model:show="show" message="操作成功" />
```

## 命令式 API

页面根节点挂载全局宿主后，可调用 `showToast`：

```vue
<k-toast global />
```

```uts
import { showToast, showToastOptions, hideToast } from '@/uni_modules/kit-ui/components/k-toast/toast-api.uts'

showToast('保存成功')
showToastOptions({
  message: '网络异常',
  type: 'fail',
  position: 'top',
  duration: 2500,
  overlay: false,
  icon: ''
})
hideToast()
```

> uni-app x 暂无 Teleport：`global` 宿主需放在 App 或页面级。已显示时再次调用 API **只更新内容**，不会 `show=false→true` 重播动画。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show / v-model:show | 是否显示 | `boolean` | `false` |
| global | 作为命令式 API 宿主 | `boolean` | `false` |
| message | 提示文案 | `string` | `''` |
| type | 类型 | `'text' \| 'success' \| 'fail' \| 'loading'` | `'text'` |
| position | 位置 | `'top' \| 'center' \| 'bottom'` | `'center'` |
| duration | 自动关闭 ms，`0` 不自动关 | `number` | `2000` |
| overlay | 是否显示遮罩 | `boolean` | `false` |
| overlayOpacity | 遮罩透明度 | `number` | `0` |
| icon | 自定义图标 | `string` | `''` |
| durationAnim | 动画时长 ms | `number` | `300` |
| zIndex | 层级，`0` 自动分配 | `number` | `0` |
| customStyle | 根节点自定义样式 | `string` | `''` |

## Events

| 事件 | 说明 |
| --- | --- |
| update:show | v-model 同步 |
| open / opened | 打开前 / 动画结束 |
| close / closed | 关闭前 / 动画结束 |

## Expose

| 方法 | 说明 |
| --- | --- |
| open() | 打开 |
| close() | 关闭 |

## 状态协调（实现要点）

所有 `show` / 内容变更经 **`reconcileToastState()`** 单入口（`scheduleReconcileToastState` 合并同帧多次变更）：

| 场景 | 行为 |
| --- | --- |
| `show: false` | `playLeave()` 淡出 |
| 首次 `show: true` | `playEnter()` 完整进入 |
| 已展示且 message/type/position/duration 变更 | `switchToastContent()` 直接换内容并重分配 z-index，**不 bump 动画代次** |
| autoHide | 绑定 `toastSession`，避免 toast A 的定时器误关 toast B |
| 卡死恢复 | `recoverToastVisible()` 重播进入 |

## 层级与复用

- `Z_INDEX_TOAST` 为语义基准；实际值由 `overlay-stack.nextZIndex` **全局单调递增**
- modal 未关闭时打开 toast，toast 会自动叠在 modal 之上
- loading 使用 `k-ring-spinner`（20×20 同心圆环），非字体 loader
- 缓动：`POPUP_TRANSITION_EASING`；帧延迟：`POPUP_APP_FRAME_DELAY` / `POPUP_WEB_ANIM_FRAME_GAP_*`

## 注意事项

- `loading` 类型不会自动关闭，需手动 `close()` 或 `hideToast()`
- 退出动画为 **淡出**（不再 slide 滑出）
- 命令式与声明式勿同时展示；切换前先 `hideToast()` 或 `toastShow=false`
- 与 `k-modal` 同屏：toast 可见于 modal 之上，无需关闭 modal
- APP 改动后需全量运行，不单靠 HMR
