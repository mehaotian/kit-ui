# k-load-more 加载更多

列表底部加载状态，与 `k-list` 的 `finished` / footer 联动。

## 基础用法

```vue
<k-load-more
  :loading="loadingMore"
  :finished="finished"
  @load="loadNextPage"
/>
```

## 在 k-list footer 中使用

```vue
<k-list :finished="finished" :loading-more="loadingMore" @load-more="loadNextPage">
  <k-cell v-for="item in list" :key="item.id" ... />
</k-list>
```

也可使用 `#footer` slot 自定义。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否加载中 | `boolean` | `false` |
| finished | 是否已全部加载 | `boolean` | `false` |
| error | 是否加载失败 | `boolean` | `false` |
| loadingText | 加载中文案 | `string` | `'加载中...'` |
| finishedText | 完成文案 | `string` | `'没有更多了'` |
| errorText | 失败文案 | `string` | `'加载失败，点击重试'` |
| idleText | 可点击加载文案 | `string` | `'点击加载更多'` |
| customStyle | 自定义样式 | `string` | `''` |

## Events

| 事件 | 说明 |
| --- | --- |
| load | 点击触发加载（非 loading/finished/error 时） |
| retry | 失败态点击重试 |

## 注意事项

- 上拉触底检测由页面 `scroll-view` / 业务侧实现，本组件只负责底部 UI 与点击。
- 与 `k-list` footer 组合见 `pages/list/list.uvue` 分页演示区块。

## 多状态优先级

当 `loading` / `finished` / `error` 同时为 `true` 时，展示优先级为：

**loading > finished > error > idle**

业务侧应保证互斥；若误传多态，以上规则决定最终文案与样式。
