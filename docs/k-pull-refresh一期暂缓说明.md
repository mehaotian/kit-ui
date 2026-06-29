# k-pull-refresh 一期暂缓说明

## 结论

**一期不交付**以下整页/增强能力：

| 能力 | 状态 |
| --- | --- |
| `k-pull-refresh` 下拉刷新 | 骨架保留，二期修复 |
| `pages/list-scroll` 标准列表页 | 不展示，二期再启 |

**一期列表验收**统一在 `pages/list/list.uvue`：

- `k-list` 三态壳（loading / error / empty）
- `k-empty` / `k-load-more` footer
- 分页与 load-more 演示区块（`list-demo-utils.uts`）

## 原因

1. **k-pull-refresh**：scroll-view refresher 三端状态不同步，刷新头循环闪烁
2. **标准列表页**：scroll-view 嵌套 k-list 的滚动与触底在部分端上不稳定

继续修复会阻塞一期列表组件主线验收。

## 入口调整

- 首页已移除「ListScroll｜标准列表页」
- `pages/list` 相关组件区不再链到 list-scroll
- `pages/list-scroll`、`pages/pull-refresh` 保留为说明页（深链可访问，引导回 list 演示）

## 二期再启条件

- 参照 uni-app x 官方 refresher / 整页滚动方案
- 三端冒烟：idle / 下拉 / 刷新中 / 完成 / 触底 load-more 全通过

## 相关文档

- `docs/k-list三端冒烟验收清单.md`
- `docs/组件开发清单.md`
- `uni_modules/kit-ui/components/k-list/README.md`
