# k-pull-refresh 下拉刷新

> **一期状态：暂不交付。** scroll-view 自定义 refresher 在 WEB / 小程序 / APP 的状态同步尚未稳定，组件骨架保留，二期专项修复后再启用。  
> 一期列表请在 `pages/list/list.uvue` 演示页验收（loading / 空态 / 分页 load-more）。

基于 `scroll-view` 的下拉刷新容器（实验性），默认自定义 `k-ring-spinner` 头。

## 一期替代方案

```vue
<k-list
  :loading="loading"
  :empty="empty"
  :finished="finished"
  :loading-more="loadingMore"
  @load-more="onLoadMore"
>
  <k-cell v-for="item in list" :key="item.id" ... />
</k-list>
```

完整演示见 `pages/list/list.uvue` 分页与 load-more 区块。

## 二期 API（预留，勿用于生产）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 刷新中（支持 v-model） | `boolean` | `false` |
| disabled | 禁用下拉 | `boolean` | `false` |
| threshold | 下拉阈值 px | `string` | `'45'` |
| lowerThreshold | 触底阈值 px | `string` | `'50'` |
| pullingText | 下拉中文案 | `string` | `'下拉刷新'` |
| loosingText | 释放文案 | `string` | `'释放刷新'` |
| loadingText | 刷新中文案 | `string` | `'刷新中...'` |
| completeText | 刷新完成文案 | `string` | `'刷新成功'` |
| completeDuration | 完成文案展示时长 ms | `string` | `'600'` |

## Events

| 事件 | 说明 |
| --- | --- |
| update:loading | v-model 同步 |
| refresh | 下拉触发刷新 |
| scrolltolower | 滚动触底 |

## 已知问题（二期修复）

- refresher-triggered 与 v-model 在三端同步不稳定
- 完成态可能循环闪烁
- 自定义 refresher slot 需作为 scroll-view 直接子节点
