# k-ring-spinner 圆环加载

toast / button 等场景共用的同心圆环 loading，固定尺寸旋转，避免字体 loader 图标偏心晃动。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 直径 px（纯数字字符串） | `string` | `'16'` |
| color | 高亮边颜色 | `string` | `'#ffffff'` |
| trackColor | 轨道色，空则按 color 自动推导 | `string` | `''` |
| speed | 旋转一周 ms（APP rAF） | `number` | `800` |

## 使用

```vue
<k-ring-spinner size="20" color="#ffffff" />
<k-ring-spinner size="16" color="#6366f1" />
```

## 说明

- WEB/MP：CSS `@keyframes` 旋转
- APP：`requestAnimationFrame` 驱动 `transform: rotate`
- 仅供组件内部或演示使用，一期不单独列入组件清单
