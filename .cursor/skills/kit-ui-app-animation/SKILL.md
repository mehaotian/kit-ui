---
name: kit-ui-app-animation
description: uni-app x 组件在 APP 端实现过渡动画的标准流程。用户提到 APP 动画不生效、transition 无效、switch/checkbox/radio 动效、ref setProperty 动画时使用。
---

# kit-ui APP 过渡动画技能

## 适用场景

- 组件存在选中、展开、开关、缩放等 **状态驱动** 的视觉变化。
- WEB/MP 有动画，APP 无动画或瞬间跳变。
- 依赖 `:class` 或 `:style` 绑定动效属性但 APP 不生效。

## 问题根因（必读）

1. APP 对 class 态过渡支持较低，不能单靠 `--checked` 等状态类做动画。
2. 响应式 `:style="{ width: active ? '20px' : '0px' }"` 会在每次状态变化时 **整对象替换**，打断 CSS transition。
3. `setProperty('background-color', 'var(--k-color-primary)')` 在 APP 端常无法正确解析，需 UTS 解析实色。

## 标准方案

参考 `k-collapse-item`、`k-switch`、`k-checkbox`、`k-radio`（均已验证）。

### 1. 声明 ref（仅 APP）

```uts
// #ifdef APP
const trackRef = ref<UniElement | null>(null)
const nodeRef = ref<UniElement | null>(null)
const ANIM_TRANSITION = '0.2s'
// #endif
```

模板绑定：`ref="trackRef"`。

### 2. 拆分静态与动效样式

```uts
const nodeStyle = computed((): UTSJSONObject => {
  // #ifdef APP
  return {}
  // #endif
  return {
    width: `${size}px`,
    left: `${left}px`
  }
})
```

**动效属性**（会随状态变化）在 APP 端 **不得** 出现在 `:style` computed 中。

### 3. 写入过渡与静态尺寸

```uts
// #ifdef APP
const applyStaticStyles = () => {
  if (nodeRef.value == null) return
  const node = nodeRef.value!.style!
  node.setProperty('width', `${size}px`)
  node.setProperty('transition-property', 'left')
  node.setProperty('transition-duration', ANIM_TRANSITION)
  node.setProperty('transition-timing-function', 'ease')
}
// #endif
```

### 4. 同步动效状态

```uts
// #ifdef APP
const syncVisual = (active: boolean) => {
  if (nodeRef.value == null) return
  nodeRef.value!.style!.setProperty('left', active ? `${activeLeft}px` : `${inactiveLeft}px`)
}
// #endif
```

主题色：

```uts
import { resolvePrimaryColor } from '../../utils/theme.uts'
const color = resolvePrimaryColor(themeConfig)
node.setProperty('background-color', color)
```

### 5. 生命周期与监听

```uts
// #ifdef APP
onMounted(() => {
  applyStaticStyles()
  syncVisual(isActive.value)
})

watch(
  (): any[] => [isActive.value, props.size, primaryColor.value],
  () => {
    applyStaticStyles()
    syncVisual(isActive.value)
  }
)
// #endif
```

### 6. 样式表分支

SCSS 中 APP 不写与 setProperty 冲突的 transition；WEB/MP 保留：

```scss
/* #ifndef APP */
transition: left var(--k-transition-duration-fast, 0.2s) ease;
/* #endif */
```

## 动效属性对照

| 组件 | ref 目标 | setProperty 动效属性 |
| --- | --- | --- |
| k-switch | track / node | `background-color`、`left` |
| k-checkbox | icon / fill | `border-color`、`width`、`height` |
| k-radio dot | icon / dot | `border-color`、`width`、`height` |
| k-radio button | button | `background-color`、`border-color` |
| k-collapse-item | wrapper | `height` |

## 自检清单

1. APP 分支下，动效属性是否已从 `:style` computed 移除？
2. 是否 `onMounted` + `watch` 调用 sync？
3. `setProperty` 是否使用实色而非 CSS 变量？
4. 条件编译是否使用 `APP` / `WEB` / `MP-*`，未使用 `H5`？
5. 函数级注释是否齐全？

## 降级方案

若 `setProperty` + `transition-*` 仍无动画，再考虑 APP 专用 `requestAnimationFrame` 手动插值（参考 `k-loading-pulse`）。**默认优先 ref + setProperty**，与 collapse/switch 保持一致。

## 相关规则

- `.cursor/rules/app-animation.mdc`
- `.cursor/rules/style-system.mdc`（禁止 grid/gap/@media）
- skill：`kit-ui-cross-platform-check`（发版前一并执行）
