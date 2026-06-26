# k-overlay 遮罩层

全屏遮罩原语组件，供 `k-popup`、`k-modal`、`k-loading` 等复用。

## 基础用法

```vue
<k-overlay :show="visible" @click="visible = false" />
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示 | `boolean` | `false` |
| opacity | 遮罩透明度 0~1 | `number` | `0.5` |
| zIndex | 层级 | `number` | `2000` |
| duration | 动画时长 ms | `number` | `300` |
| customStyle | 自定义样式 | `string` | `''` |

## Events

| 事件 | 说明 |
| --- | --- |
| click | 点击遮罩 |
| open / opened | 打开前 / 打开动画结束 |
| close / closed | 关闭前 / 关闭动画结束 |

## 主题变量

- 遮罩色通过 `opacity` 控制，默认 `rgba(0,0,0,0.5)`
- 层级基准见 `overlay-stack.uts`：`Z_INDEX_POPPER = 2000`

## 注意事项

- APP 端 opacity 动效使用 `ref + setProperty`，见 `kit-ui-app-animation` 技能
- 业务场景优先使用 `k-popup`；仅在自定义全屏蒙层时使用本组件
