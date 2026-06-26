# k-popup 系列已知缺陷与后续计划

> 更新日期：2026-06-26  
> 评审结论：**96 / 100（A+）**，三端冒烟已通过，一期 v1 可交付  
> 本文档收录 **暂不阻塞交付** 的缺陷与增强项，供 v1.x 迭代实现

---

## 1. 文档说明

| 项 | 说明 |
| --- | --- |
| 适用范围 | `k-overlay`、`k-popup`、`k-toast`、`k-modal` 及关联 `k-ring-spinner` |
| 缺陷来源 | v1 代码 Review（2026-06-26）+ `docs/k-popup三端冒烟验收清单.md` §4.6 |
| 状态定义 | `待实现` / `进行中` / `已修复` / `不修复` |
| 验收标准 | 每项实现后需更新对应 README，并回写本表状态 + 冒烟清单 |

---

## 2. 缺陷清单（按优先级）

### P1 — 功能缺口（影响 API 完整性）

| ID | 组件 | 缺陷描述 | 现状 | 建议方案 | 验收要点 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| D-01 | `k-popup` | **未实现 `beforeClose` 关闭拦截** | `popup.type.uts` 已有类型定义，组件未接入；`k-modal` 层已实现 | 复用 `k-modal/modal-utils.uts` 的 `invokeBeforeClose` 模式；action 对齐现有类型：`overlay` / `close-icon` / `programmatic` | 返回 `false` 不关闭；Promise 异步期间防重复关闭；README 与演示页补示例 | 待实现 |
| D-02 | `k-popup` | **`safeAreaInsetBottom` 无法显式关闭** | bottom/center 在 `defaultSafeArea=true` 时强制底部安全区，无 tri-state | 增加 `safe-area-mode` 或约定：`false` 强制关 / 不传走默认 / `true` 强制开；与 top 对称 | bottom 弹层在「无刘海设备 / 业务自定义 padding」场景无多余底部空隙 | 待实现 |
| D-03 | `k-loading` | **遮罩未复用 `k-overlay`** | loading 自实现 overlay，与 popup 系列动画/常量可能分叉 | 内部改为 `<k-overlay>` + `overlay-stack` 常量；对齐 opacity 动效与事件 | 与 popup 遮罩视觉/时序一致；删除重复 overlay 逻辑 | 待实现 |

### P2 — 体验一致性与工程债

| ID | 组件 | 缺陷描述 | 现状 | 建议方案 | 验收要点 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| D-04 | `k-popup` | **APP center 宽度与 WEB 不一致** | APP 硬编码 `320px`；WEB 为 `85% / max-width 360px` | 抽 `--k-popup-center-width` 或 prop `centerWidth`；三端尽量统一视觉 | 同内容在三端 center 弹层宽度观感接近 | 待实现 |
| D-05 | `k-popup` | **嵌套 popup z-index 未专项实测** | `nextZIndex` 全局单调递增逻辑已实现，冒烟 §4.6 未勾选 | 演示页增加「双 popup 叠开」用例；记录 WEB/APP/MP 层级顺序 | 后开 popup 始终高于先开；关闭先开不影响后开层级 | 待实现 |
| D-06 | `k-popup` | **定时器命名误导** | 开/关/重试共用 `closeTimer`，实际也用于进入动画 | 重命名为 `animTimer`，补充注释说明职责 | 无行为变更，仅可读性提升 | 待实现 |
| D-07 | `k-overlay` | **README 未说明 z-index 栈规则** | 单调递增规则仅在 `overlay-stack.uts` 文件头 | README 增加「层级分配」小节，链接 stack 文档 | 使用者理解 modal/toast/popup 同屏叠层行为 | 待实现 |

### P3 — 文档与类型清理

| ID | 组件 | 缺陷描述 | 现状 | 建议方案 | 验收要点 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| D-08 | `k-popup` | **`popup.type.uts` 类型与实现不同步** | `BeforeCloseHandler` 等已定义但未使用 | D-01 实现时一并接入；或暂标 `@deprecated` 注释 | 类型与 props/events 一致 | 待实现 |
| D-09 | 全局 | **`resetZIndexStack` 仅测试场景使用** | 长会话 z-index 持续递增，无关闭回退 | v1.x 评估是否按「弹层实例」pop；或文档明确「业务勿依赖绝对 z 值」 | 文档说明设计取舍；极端多开场景无异常 | 待评估 |

---

## 3. 设计取舍（非缺陷，勿当 bug 修）

以下项已在冒烟清单 §5 记录，**保持现状**，实现上述缺陷时勿破坏：

| 项 | 说明 |
| --- | --- |
| `internalOverlayShow` | 与 `props.show` 解耦，保证遮罩/面板同帧动画；k-modal 依赖此行为 |
| MP 双帧启动延迟 | WEB 8ms×2 / MP 20ms×2，换稳定性略慢于 WEB |
| `k-modal.close()` 绕过 beforeClose | 与 `v-model=false` 一致，已在 README 说明 |
| 多 modal 同时 `show=true` | 演示页允许多实例；业务侧需自行互斥 |
| toast 命令式无 Teleport | 需页面级 `<k-toast global />`，平台限制已文档化 |
| left/right 默认宽 280px 仅 CSS | 无 JS 常量；抽屉类场景需在 README 说明 |

---

## 4. 实现顺序建议（v1.x）

```text
1. D-05 嵌套 popup 实测（先验证现有 stack 逻辑，再决定要不要改代码）
2. D-01 k-popup beforeClose（API 对齐 k-modal）
3. D-02 safeArea tri-state
4. D-04 center 宽度统一
5. D-03 k-loading 复用 k-overlay
6. D-06 / D-07 / D-08 文档与命名清理
7. D-09 按需评估
```

---

## 5. 实现完成检查项

每项关闭缺陷时需同步：

- [ ] 更新 `uni_modules/kit-ui/components/*/README.md`
- [ ] 演示页补最小用例（`pages/popup` / `pages/modal` / `pages/toast` 按需）
- [ ] 回写 `docs/k-popup三端冒烟验收清单.md` 对应勾选
- [ ] 本表「状态」改为 `已修复` 并注明日期
- [ ] 若 API 变更，同步 `docs/组件开发清单.md`

---

## 6. 相关文档

| 文档 | 用途 |
| --- | --- |
| `docs/k-popup三端冒烟验收清单.md` | 三端验收用例与 §4.6 待测项 |
| `docs/k-popup开发进度与后续计划.md` | 迭代排期与 DoD |
| `docs/k-popup方案分析报告.md` | 架构与竞品分析 |
| `uni_modules/kit-ui/components/k-overlay/overlay-stack.uts` | z-index 栈实现 |

---

## 7. 修订记录

| 日期 | 说明 |
| --- | --- |
| 2026-06-26 | 初版：Review 96 分后收录 9 项缺陷/待办，冒烟已通过 |
