# k-popup / k-overlay 三端冒烟验收清单

> 目标：对 `pages/popup/popup.uvue` 及关联的 `k-popup`、`k-overlay` 做 WEB / APP / 微信 MP 最小可用验收。  
> 适用版本：k-popup v1（2026-06-25 三端动画验收通过）。

---

## 1. 执行前准备

- 使用 HBuilderX 最新稳定版，确保 `uni-app x` 编译器可用。
- 清理旧缓存后重新运行（避免热更新残留影响动画）。
- 确认可进入页面：`pages/popup/popup.uvue`。
- 动画相关改动后需 **全量运行到 APP**，不单靠 HMR。

---

## 2. 验收范围

### 2.1 k-overlay

- show 控制显隐 + opacity 进入/离开动画
- APP ref + setProperty 动效
- click / open / opened / close / closed 事件
- zIndex / opacity / duration / customStyle

### 2.2 k-popup（P0 + 部分 P1）

- v-model:show、五方向 position
- overlay / overlayOpacity / closeOnClickOverlay
- round / duration / bgColor / safeArea
- closeable / zoom / lazyRender / destroyOnClose
- 生命周期事件 + expose open/close
- page-meta 滚动锁定示例

### 2.3 v1.x 待完善（本清单记录状态，不阻塞 k-toast / k-modal）

> 缺陷 ID 与验收标准见 **`docs/k-popup系列已知缺陷与后续计划.md`**

| 项 | 优先级 | 状态 | 说明 |
| --- | --- | --- | --- |
| beforeClose 关闭拦截 | P1 | ☐ 待实现（D-01） | popup 核心暂未接入；k-modal 已实现 |
| safeAreaInsetBottom 显式关闭 | P1 | ☐ 待实现（D-02） | bottom 模式 tri-state |
| k-loading 复用 k-overlay | P1 | ☐ 待实现（D-03） | 消除 loading overlay 重复 |
| 嵌套 popup z-index 实测 | P2 | ☐ 待实测（D-05） | nextZIndex 多实例叠层 |
| closeTimer 重命名 animTimer | P2 | ☐ 待优化（D-06） | 命名与注释 |

---

## 3. 三端执行记录

| 端 | 环境信息 | 结果 | 备注 |
| --- | --- | --- | --- |
| WEB | HBuilderX 运行到浏览器（用户实测，2026-06-25） | ☑ 通过 / ☐ 失败 | 五方向动画、遮罩 opacity transition 正常 |
| APP(Android/iOS) | HBuilderX 运行到 APP（用户实测，2026-06-25） | ☑ 通过 / ☐ 失败 | setProperty 动效正常，Kotlin 编译通过 |
| 微信 MP | HBuilderX + 微信开发者工具（用户实测，2026-06-25） | ☑ 通过 / ☐ 失败 | 双帧 20ms 延迟启动，动画稳定 |

---

## 4. 用例清单（逐项勾选）

### 4.1 基础能力

| 用例 | WEB | APP | 微信 MP | 预期结果 |
| --- | --- | --- | --- | --- |
| bottom 默认弹出 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 自底部滑入，遮罩同步淡入 |
| top / left / right / center | ☑ 通过 | ☑ 通过 | ☑ 通过 | 五方向 transform/opacity 正确 |
| center zoom 缩放 | ☑ 通过 | ☑ 通过 | ☑ 通过 | scale 0.85→1 + opacity 0→1 |
| v-model 开关 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 按钮控制 show 双向绑定 |
| 关闭动画后再卸载 DOM | ☑ 通过 | ☑ 通过 | ☑ 通过 | closed 后弹层消失 |

### 4.2 遮罩与交互

| 用例 | WEB | APP | 微信 MP | 预期结果 |
| --- | --- | --- | --- | --- |
| overlay 默认半透明 | ☑ 通过 | ☑ 通过 | ☑ 通过 | rgba 背景 + opacity 动画 |
| overlay=false 无遮罩 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 仅面板，可点击背后内容 |
| closeOnClickOverlay=true | ☑ 通过 | ☑ 通过 | ☑ 通过 | 点击空白区关闭 |
| closeOnClickOverlay=false | ☑ 通过 | ☑ 通过 | ☑ 通过 | 点击遮罩不关闭，emit clickOverlay |
| closeable 关闭图标 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 图标点击关闭 |

### 4.3 状态与样式

| 用例 | WEB | APP | 微信 MP | 预期结果 |
| --- | --- | --- | --- | --- |
| round 圆角 | ☑ 通过 | ☑ 通过 | ☑ 通过 | top/bottom/center 圆角生效 |
| safeArea 底部/顶部 | ☑ 通过 | ☑ 通过 | ☑ 通过 | bottom/center 默认底部安全区 |
| lazyRender | ☑ 通过 | ☑ 通过 | ☑ 通过 | 未打开不渲染 slot |
| page-meta 滚动锁定 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 弹层打开时 overflow:hidden |

### 4.4 k-overlay 独立用法

| 用例 | WEB | APP | 微信 MP | 预期结果 |
| --- | --- | --- | --- | --- |
| 独立遮罩显隐 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 与 popup 内 overlay 动画一致 |
| 自定义 z-index | ☑ 通过 | ☑ 通过 | ☑ 通过 | 层级可覆盖默认 POPPER 基准 |

### 4.5 生命周期事件

| 用例 | WEB | APP | 微信 MP | 预期结果 |
| --- | --- | --- | --- | --- |
| open → opened 顺序 | ☑ 通过 | ☑ 通过 | ☑ 通过 | opened 在动画结束后触发 |
| close → closed 顺序 | ☑ 通过 | ☑ 通过 | ☑ 通过 | closed 在动画结束后触发 |

### 4.6 v1.x 待测项（未通过 / 未实现）

| 用例 | WEB | APP | 微信 MP | 预期结果 | 状态 |
| --- | --- | --- | --- | --- | --- |
| beforeClose 拦截 | ☐ | ☐ | ☐ | 返回 false 时不关闭 | 待 popup 核心；k-modal 已实现 |
| 嵌套 popup z-index | ☐ | ☐ | ☐ | 后开层级高于先开 | 待实测 |
| k-loading 复用 overlay | ☐ | ☐ | ☐ | 与 k-overlay 动画一致 | 待迁移 |

---

## 5. 已知设计取舍（document only）

| 项 | 说明 |
| --- | --- |
| internalOverlayShow | 与 props.show 解耦，保证遮罩/面板同帧动画；k-modal 复用时保持 |
| MP 双帧 40ms 启动 | WEB=8ms / MP=20ms×2，换稳定性略慢于 WEB |
| APP center 宽 320px | 与 WEB 85%/360px 不一致，v1.x 可抽变量 |

---

## 6. 失败记录模板

```base
[端]: WEB / APP / 微信MP
[用例]: 例如“center zoom 动画”
[现象]: ...
[复现步骤]:
1. ...
2. ...
[期望]: ...
[实际]: ...
[截图/日志]: ...
```

---

## 7. 收口标准

- §4.1 ~ §4.5 三端用例全部勾选通过（**已于 2026-06-25 用户确认**）。
- §4.6 待测项在 v1.x 迭代中补测并回写本清单。
- APP 无 Kotlin 编译错误、无 uvue CSS 非法属性报错。

---

## 8. k-modal 验收补充（继承 popup，2026-06-26）

> modal 动画与安全区完全委托 `k-popup center`，本节仅覆盖 modal 语义层与组合场景。

### 8.1 无需复测（继承 popup 已通过）

- center zoom 动画、遮罩同帧、APP setProperty、MP 双帧延迟
- safeArea 底部（center 默认开启）
- lazyRender / page-meta 滚动锁定

### 8.2 modal 专项用例（2026-06-26 用户确认通过）

| 用例 | WEB | APP | 微信 MP | 预期结果 |
| --- | --- | --- | --- | --- |
| 基础 confirm/cancel | ☑ | ☑ | ☑ | 按钮关闭，事件顺序正确 |
| beforeClose 返回 false | ☑ | ☑ | ☑ | modal 不关闭，可继续操作 |
| beforeClose Promise 异步 | ☑ | ☑ | ☑ | 确认 loading、底栏锁定，完成后才关 |
| beforeClose 异步期间点取消 | ☑ | ☑ | ☑ | 取消无效（footerLocked），无重复提交 |
| beforeClose + toast 反馈 | ☑ | ☑ | ☑ | modal 仍显示，toast 切换内容不闪退 |
| 提交确认 → toast 成功 | ☑ | ☑ | ☑ | modal 关闭后 toast 正常 |
| 打开期间 content 变更 | ☑ | ☑ | ☑ | 文案响应式更新，无闪退 |
| 遮罩不可关闭 | ☑ | ☑ | ☑ | closeOnClickOverlay=false |
| z-index 高于 popup/toast | ☑ | ☑ | ☑ | 同页多组件层级正确 |

### 8.3 已知差异（document only）

| 项 | 说明 |
| --- | --- |
| 无 toast 式 switch 逻辑 | 打开期间改 props 即可，勿 fork 动画 |
| z-index 单次分配 | 修复 watch/open/@open 重复 nextZIndex |
| 多 modal 同时 show=true | 演示页允许多实例叠层，业务侧需自行互斥 |

---

## 9. k-toast 验收补充（2026-06-26）

> toast 动画基于 `k-overlay` + 面板分轨，与 popup 模式一致；命令式 API 见 `toast-api.uts`。

| 用例 | WEB | APP | 微信 MP | 预期结果 |
| --- | --- | --- | --- | --- |
| 声明式 v-model 开关 | ☑ | ☑ | ☑ | 三位置显示/隐藏正常 |
| showToast 命令式 | ☑ | ☑ | ☑ | global 宿主下调用成功 |
| 自动消失 duration | ☑ | ☑ | ☑ | 到时关闭，可 hideToast 提前关 |
| loading 类型 + k-ring-spinner | ☑ | ☑ | ☑ | 圆环 spinner 显示 |
| 打开期间切换 message | ☑ | ☑ | ☑ | 不重播开启动画 |
| 与 modal 同页层级 | ☑ | ☑ | ☑ | toast z-index 高于 modal |

---

## 10. 相关文档（modal / toast）

| 文档 | 用途 |
| --- | --- |
| `docs/k-popup系列已知缺陷与后续计划.md` | v1.x 缺陷台账 |
| `docs/k-popup开发进度与后续计划.md` | 进度与 v1.x 待办 |
| `docs/k-list开发计划.md` | 迭代 2 当前主线 |
| `docs/k-popup方案分析报告.md` | 架构与竞品分析 |
| `uni_modules/kit-ui/components/k-popup/README.md` | popup API |
| `uni_modules/kit-ui/components/k-modal/README.md` | modal API 与 popup/toast 对照 |
| `uni_modules/kit-ui/components/k-toast/README.md` | toast API（组合链路） |
| `uni_modules/kit-ui/components/k-overlay/README.md` | 遮罩原语 |
