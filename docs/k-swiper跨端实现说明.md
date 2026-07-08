# k-swiper 跨端实现说明

> 版本：v1.1  
> 日期：2026-06-30  
> 状态：**已验收**  
> 关联：`uni_modules/kit-ui/components/k-swiper/`、`pages-demo/swiper/swiper.uvue`

---

## 0. 产品价值

k-swiper 在原生 `swiper` 之上提供场景化封装（`list` + `mode`、自绘指示器、跨端补丁），**不是** prop 透传改名。

详见：`docs/k-swiper产品价值说明.md`、`uni_modules/kit-ui/components/k-swiper/README.md` §核心优势。

---

## 1. 组件结构

```text
k-swiper (k-swiper.uvue)
├── swiper（原生引擎）
│   ├── [MP + list] 原生 swiper-item × N → k-swiper-item-body
│   ├── [非 MP + list] k-swiper-item × N
│   └── [非 MP + slot] k-swiper-item（业务传入）
├── k-swiper-line-indicator（line 指示器）
├── 数字指示器 overlay
└── swiper-utils.uts（mode 预设、list 解析、MP 门禁）

k-swiper-item (k-swiper-item.uvue)
└── swiper-item → k-swiper-item-body

k-swiper-item-body (k-swiper-item-body.uvue)
└── banner 浮层 / card 卡片 / default slot
```

---

## 2. 平台差异

| 能力 | WEB | APP | MP-WEIXIN |
| --- | --- | --- | --- |
| `:list` 数据驱动 | ✅ | ✅ | ✅（原生 swiper-item） |
| default slot + k-swiper-item | ✅ | ✅ | ❌ 不可用 |
| line / number 自绘指示器 | ✅ | ✅ | ✅ |
| pause-on-hover | ✅ | — | — |
| autoplay 动态切换 | ✅ | ✅（重建 swiper + 恢复索引） | ✅ |

### 2.1 微信小程序

- **硬约束**：`swiper` 的直接子节点必须是原生 `swiper-item`。
- **实现**：list 模式在 `#ifdef MP` 分支内渲染原生 `swiper-item`，内容走 `k-swiper-item-body`。
- **业务建议**：MP 统一使用 `:list`；slot 模式请在页面层使用原生 `swiper` 或 list 等效数据。

### 2.2 APP

- **autoplay 切换**：原生 swiper 在 `autoplay` prop 变化时可能清空子项；组件通过 `swiperRenderKey` 重建并 `nextTick` 恢复 `current`。
- **标题浮层**：`linear-gradient` 支持不稳定处，overlay 增加 `background-color: rgba(0,0,0,0.35)` 兜底。
- **provide/inject**：使用 `Ref<string>` / `Ref<number>`，不用 `ComputedRef`（Kotlin 编译门禁）。

---

## 3. MP 滑动门禁（utils）

| 函数 | 作用 |
| --- | --- |
| `resolveSwiperDisplayMultipleItems` | `display-multiple-items` 不得大于 item 数 |
| `resolveSwiperCircularSafe` | 项数 ≤ 1 时强制关闭 `circular` |

---

## 4. slot 模式约定

- `list` 与 slot **二选一**；有 `list` 时忽略 slot。
- slot + `indicator-type="line"` / `number` 必须设置 **`item-count`**（与 k-swiper-item 数量一致）。
- `#indicator` 插槽为二期预留，v1.1 无 demo。

---

## 5. prev / next 行为

- 通过更新 `innerCurrent`（绑定原生 `:current`）切屏。
- `change` 事件的 `source` 为 `'programmatic'`。
- 与手势触发的 `source: 'touch'` / `'autoplay'` 区分。

---

## 6. 相关文档

| 文档 | 用途 |
| --- | --- |
| `uni_modules/kit-ui/components/k-swiper/README.md` | API |
| `docs/k-swiper开发计划.md` | 版本与 DoD |
| `docs/k-swiper三端冒烟验收清单.md` | 验收记录 |
