# k-list 列表状态容器

异步列表页的 **loading / empty / error** 状态壳 + **footer 分页位**。容器透明、无边框；**行内容请用 `k-cell` 或自定义 slot**。

> v2 定位见 `docs/k-list架构重构与二期列表规划.md`

## 基础用法

```vue
<k-list :empty="orders.length == 0">
  <k-cell
    v-for="item in orders"
    :key="item.id"
    :title="item.title"
    :label="item.time"
    is-link
  />
</k-list>
```

## 容器三态

优先级：`loading` > `error` > `empty` > default slot

```vue
<k-list loading loading-text="加载中..." />
<k-list :empty="list.length == 0" empty-text="暂无订单" />
<k-list error error-text="加载失败" @retry="loadData" />
```

动态 `v-for` 列表**必须**显式绑定 `:empty="items.length == 0"`。

## 空态与 k-empty

默认 empty slot 内嵌 `k-empty`，可通过 `#empty-action` 追加操作按钮：

```vue
<k-list :empty="list.length == 0" empty-text="暂无收藏">
  <template #empty-action>
    <k-button type="primary" text="去发现" size="small" />
  </template>
  <k-cell v-for="item in list" :key="item.id" ... />
</k-list>
```

也可完全自定义 `#empty` slot。

## 分页 load-more

未传 `#footer` 且 `finished=false` 时，底部自动展示 `k-load-more`：

```vue
<k-list
  :loading="loading"
  :empty="list.length == 0"
  :finished="finished"
  :loading-more="loadingMore"
  :load-more-error="loadMoreError"
  @load-more="loadNextPage"
  @load-more-retry="retryLoadMore"
>
  <k-cell v-for="item in list" :key="item.id" ... />
</k-list>
```

也可使用 `loadMoreTexts` 一次性配置（字段优先于同名独立 prop）：

```vue
<k-list
  :load-more-texts="{
    idleText: '上拉加载更多',
    finishedText: '— 没有更多了 —',
    errorText: '加载失败，点击重试',
    loadingText: '加载中...'
  }"
/>
```

列表分页与 load-more 演示见 `pages/list/list.uvue`。

**注意**：一期不包含 `k-pull-refresh` 与独立标准列表页；见二期规划。

## 与 k-cell 分工

| 组件 | 职责 |
| --- | --- |
| `k-list` | 三态壳、footer load-more |
| `k-cell` / `k-cell-group` | 通栏行、分组、inset 卡片、链接 |
| `k-empty` | 空态插画/图标与操作区 |
| `k-load-more` | 底部加载/完成/失败 UI |
| 自定义 slot | 订单卡、商品卡等业务块 |

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 加载中 | `boolean` | `false` |
| finished | 是否已全部加载 | `boolean` | `true` |
| error | 错误态 | `boolean` | `false` |
| empty | 空态（建议显式绑定） | `boolean` | `false` |
| emptyText | 空态文案 | `string` | `'暂无数据'` |
| emptyIcon | 空态图标（k-icon） | `string` | `'file-list-3-line'` |
| errorText | 错误态文案 | `string` | `'加载失败，请重试'` |
| loadingText | 加载文案 | `string` | `'加载中...'` |
| loadingMore | 底部加载中 | `boolean` | `false` |
| loadMoreError | 底部加载失败 | `boolean` | `false` |
| finishedText | 全部加载完成文案 | `string` | `'没有更多了'` |
| loadMoreLoadingText | 底部加载中文案 | `string` | `'加载中...'` |
| loadMoreErrorText | 底部失败文案 | `string` | `'加载失败，点击重试'` |
| loadMoreIdleText | 底部可点击加载文案 | `string` | `'点击加载更多'` |
| loadMoreTexts | 底部文案对象（与独立 prop 二选一，对象优先） | `ListLoadMoreTexts \| null` | `null` |
| hideFinishedFooter | 分页完成后隐藏「没有更多了」 | `boolean` | `false` |
| customStyle | 自定义样式 | `string` | `''` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 列表内容（`k-cell` / `k-cell-group` / 业务组件） |
| empty | 自定义空态（默认内嵌 `k-empty`） |
| empty-action | 空态底部操作区（传给默认 `k-empty`） |
| loading | 自定义 loading（默认 ring-spinner） |
| error | 自定义错误态 |
| footer | 自定义底部（覆盖内置 `k-load-more`） |

## Events

| 事件 | 说明 |
| --- | --- |
| retry | 默认 error 内层点击；自定义 `#error` 需自行触发 |
| load-more | 底部触发加载更多 |
| load-more-retry | 底部加载失败重试 |

## footer 显示规则

内置 `k-load-more` 在**同时满足**时展示：

1. 未传 `#footer` slot  
2. 非 loading / error / empty 三态  
3. 满足以下**任一**：
   - `finished == false`（分页进行中）
   - `loadingMore == true`
   - `loadMoreError == true`
   - 曾进入过分页且 `finished == true` 且 `hideFinishedFooter == false`（显示「没有更多了」）

静态列表：`finished` 默认 `true` 且未触发过分页 → **不展示 footer**。

逻辑实现见 `list-utils.uts`，与 `docs/k-list质量提升与9.8目标方案.md` 一致。

## v1 → v2 迁移

| v1（已移除） | v2 |
| --- | --- |
| `k-list-item` | `k-cell` |
| `border` / `inset` on k-list | `k-cell-group inset` |
| 自动 empty 计数 | `:empty="items.length == 0"` |

## 注意事项

- 不内置 `scroll-view`；长列表由页面组合。
- 平铺 `k-cell` 时，`k-list` 通过 `cell-border.uts` 代理项间分割线（最后一项无底线），与 `k-cell-group` 一致；动态 `v-for` 删项已支持 unregister。
- 嵌套 `k-cell-group` 时，分组边框由 group 自身控制。
- 自定义 `#error` slot 时，`@retry` 不会自动绑定外层，需自行处理重试。
- 自定义 `#loading` 推荐 `k-ring-spinner` + 固定尺寸容器，避免 MP flex 下 spinner 变形。
- 触底检测由页面 `scroll-view` 或业务侧实现；`k-load-more` 负责底部 UI 与点击。
