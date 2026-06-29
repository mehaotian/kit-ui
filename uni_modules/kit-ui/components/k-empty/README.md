# k-empty 空状态

用于列表、页面无数据时的占位展示，可与 `k-list` 空态 slot 配合。

## 基础用法

```vue
<k-empty description="暂无订单" />
```

## 带操作按钮

```vue
<k-empty description="购物车是空的">
  <k-button type="primary" text="去逛逛" size="small" />
</k-empty>
```

## 在 k-list 中使用

```vue
<k-list :empty="list.length == 0" empty-text="暂无消息" />
<!-- k-list 默认 empty slot 已内嵌 k-empty -->

<k-list :empty="list.length == 0" empty-text="暂无收藏">
  <template #empty-action>
    <k-button type="primary" text="去逛逛" size="small" />
  </template>
</k-list>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| description | 描述文案 | `string` | `'暂无数据'` |
| icon | 图标名（`k-icon`） | `string` | `'file-list-3-line'` |
| iconSize | 图标尺寸 px | `string` | `'48'` |
| customStyle | 自定义样式 | `string` | `''` |

## Slots

| 名称 | 说明 |
| --- | --- |
| icon | 自定义图标区域 |
| default | 底部操作区（按钮等） |

## 主题变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--k-empty-description-color` | `#969799` | 描述文字色 |

## 注意事项

- v1 使用图标占位，插画图片见二期扩展。
- 文本样式写在 `text` / `button` 内，符合 kit-ui 样式红线。
