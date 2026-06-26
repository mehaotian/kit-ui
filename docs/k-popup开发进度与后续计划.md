# k-popup / k-overlay 开发进度与后续计划

> 更新日期：2026-06-25  
> 状态：**v1 三端动画验收通过，可进入 k-toast 开发**

---

## 0. v1 代码 Review 结论（2026-06-25）

### 架构评价（保留）

| 层级 | 职责 | 评价 |
| --- | --- | --- |
| `k-overlay` | 遮罩原语 + z-index 栈 | 清晰，可被 toast/modal/loading 复用 |
| `k-popup` | 五方向容器 + 面板动效 | 三端分轨合理（APP setProperty / WEB·MP CSS transition） |
| `overlay-stack.uts` | 常量 + z-index + 背景色 | 合适，后续 toast/modal 直接 import 层级常量 |
| `popup-animation.uts` | transform/opacity 工具 | 职责单一，APP 与后续扩展共用 |

### 已清理项（本次 review）

- 合并 `handleOverlayClick` / `handleContainerClick` → `handleMaskClick`（容器层级高于 overlay，遮罩点击本就由容器接管）
- 移除 `runPanelEnterAnimation` 薄包装，直接调用 `beginPanelEnterAnim`
- 移除 `overlayLayerZIndex` 冗余 computed
- APP 三处 watch 合并为 `syncAppPanelState()`
- `defaultSafeAreaBottom/Top` 工具函数与安全区 computed 对齐，删除未使用的 `isCenterPosition`
- `WEB_ANIM_FRAME_GAP` 数值统一到 `overlay-stack.uts`（WEB=8 / MP=20）

### 已知设计取舍（暂不改，document only）

| 项 | 说明 | 后续 |
| --- | --- | --- |
| `internalOverlayShow` | 与 `props.show` 解耦，保证遮罩/面板同帧动画 | k-modal 复用时保持 |
| 单定时器 `closeTimer` | 开/关/重试共用，命名略误导 | v1.x 可改名为 `animTimer` |
| APP center 宽 320px 硬编码 | 与 WEB 85%/360px 不一致 | 可抽 `--k-popup-center-width` 或 prop 默认值 |
| left/right 280px 仅 CSS | 无 JS 侧默认常量 | k-modal 抽屉模式需文档说明 |
| `panelVisible` 在 APP 仍维护 | 不驱动 CSS 动效，用于 guard + sync | 保留，删会影响 open 防重入 |
| MP 双帧 40ms 启动延迟 | 换动画稳定性，略慢于 WEB | 勿随意改回单帧 |

### 待 v1.x 完善（不阻塞 k-toast / k-modal）

| 项 | 优先级 | 说明 |
| --- | --- | --- |
| 三端冒烟验收记录 | P0 | 写入 `docs/k-popup三端冒烟验收清单.md` |
| `beforeClose` | P1 | 关闭拦截（同步 boolean 先行） |
| `safeAreaInsetBottom` 显式关闭 | P1 | bottom 模式 tri-state |
| k-loading 复用 k-overlay | P1 | 消除 loading overlay 重复 |
| 单定时器重命名 + 注释 | P2 | `closeTimer` → `animTimer` |
| 嵌套 popup z-index 实测 | P2 | nextZIndex 多实例 |

---

## 1. 本次交付（v1）

### 1.1 新增组件

| 组件 | 路径 | 说明 |
| --- | --- | --- |
| `k-overlay` | `uni_modules/kit-ui/components/k-overlay/` | 独立遮罩原语 + `overlay-stack.uts` z-index 管理 |
| `k-popup` | `uni_modules/kit-ui/components/k-popup/` | 五方向弹出层，内聚使用 k-overlay |

### 1.2 已实现能力

**k-overlay**

- [x] show 控制显隐 + opacity 进入/离开动画
- [x] APP 端 ref + setProperty 动效
- [x] click / open / opened / close / closed 事件
- [x] zIndex / opacity / duration / customStyle

**k-popup（P0 + 部分 P1）**

- [x] v-model:show
- [x] position：top / bottom / left / right / center
- [x] overlay / overlayOpacity / closeOnClickOverlay
- [x] round / duration / bgColor / customStyle
- [x] safeArea（bottom/center 默认底部安全区，top 默认顶部）
- [x] closeable / closeIcon / closeIconPosition
- [x] zoom（center 缩放）
- [x] lazyRender / destroyOnClose
- [x] width / height
- [x] 生命周期事件 + expose open/close
- [x] 演示页 `pages/popup/popup.uvue` + page-meta 滚动锁定示例

### 1.3 待 v1.x 完善（见 §0 Review，不阻塞迭代 2）

---

## 2. 迭代 2 剩余任务（按推荐顺序）

### 阶段 A：反馈闭环（当前主线）

| 顺序 | 组件 | 依赖 | 预估 | 状态 |
| --- | --- | --- | --- | --- |
| ~~1~~ | ~~k-popup + k-overlay~~ | — | — | ✅ v1 三端动画 OK |
| 2 | **k-toast** | 复用 k-overlay | 1~2 天 | **← 下一步** |
| 3 | **k-modal** | 内部复用 k-popup | 2~3 天 | 待开发 |
| 4 | k-popup 三端冒烟 + P1 完善 | — | 0.5~1 天 | 待执行 |

**k-toast 要点（基于 review 结论）**

- 直接 import `k-overlay` + `Z_INDEX_TOAST` + `POPUP_TRANSITION_EASING`
- WEB/MP 走 CSS transition + 双帧延迟常量；APP 走 ref + setProperty（与 popup 同模式）
- 命令式 API 预研（`showToast`），备选声明式 + ref
- 自动消失、位置 top/center/bottom
- 无需 `internalOverlayShow` 解耦（toast 无面板分轨问题）

**k-modal 要点**

- `<k-popup position="center" :close-on-click-overlay="false">` + 标题/内容/按钮区
- props：title、content、showCancelButton、confirmText/cancelText
- z-index：`Z_INDEX_MODAL (4000)`；可包一层默认 props 而非 fork 动画逻辑

### 阶段 B：列表承载

| 顺序 | 组件 | 预估 | 状态 |
| --- | --- | --- | --- |
| 5 | k-list | 2~3 天 | 待开发 |
| 6 | k-list-item | 1~2 天 | 待开发 |

### 阶段 C：增强（可并行）

| 组件 | 说明 | 状态 |
| --- | --- | --- |
| k-swiper / k-swiper-item | 轮播增强 | 待开发 |

---

## 3. 迭代 2 DoD 检查项

- [x] k-popup API 与 README 一致
- [x] demo 已注册 pages.json
- [x] APP / WEB / MP 动画冒烟通过（用户确认 2026-06-25）
- [ ] 冒烟记录写入验收清单文档
- [ ] k-toast 最小可用
- [ ] k-modal 最小可用
- [ ] 表单提交 → modal 确认 → toast 反馈 可串联 demo
- [ ] k-list 空态/长内容/边界项

---

## 4. 迭代 3 预览（迭代 2 完成后）

- `k-tabs` / `k-tab-pane`
- `k-navbar`
- `k-tabbar` / `k-tabbar-item`
- `k-pull-refresh` / `k-load-more`

---

## 5. 建议下一步行动（立即可执行）

```text
1. ~~三端动画冒烟~~ ✅
2. 开发 k-toast（复用 k-overlay + overlay-stack 常量，1~2 天）← 当前
3. 开发 k-modal（基于 k-popup 预设，2~3 天）
4. 补写 docs/k-popup三端冒烟验收清单.md
5. 组合 demo：form 提交 → modal 确认 → toast 结果
6. 并行 k-list / k-list-item
```

---

## 6. 相关文档

| 文档 | 用途 |
| --- | --- |
| `docs/k-popup方案分析报告.md` | 架构与竞品分析 |
| `docs/一期下一步开发计划.md` | 迭代 2 总排期 |
| `docs/一期组件迭代看板.md` | Issue 级任务 |
| `uni_modules/kit-ui/components/k-popup/README.md` | API 说明 |
| `uni_modules/kit-ui/components/k-overlay/README.md` | 遮罩原语 |
