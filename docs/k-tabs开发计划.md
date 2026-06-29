# k-tabs / k-tab-pane 开发计划（属性与设计）

> 版本：v1.0  
> 日期：2026-06-29  
> 状态：**v1 已验收收尾（2026-06-29）** — WEB / APP / 微信三端通过；文档见 `docs/k-tabs三端冒烟验收清单.md`、`docs/k-tabs跨端实现说明.md`  
> 关联：`docs/一期下一步开发计划.md`、`docs/k-popup方案分析报告.md`（方案文档结构参考）

---

## 1. 背景与定位

### 1.1 为什么 k-tabs 是一期迭代 3 的首项

标签页是移动端 **页面内分区导航** 的基础能力，典型场景：

- 订单列表「全部 / 待付款 / 已完成」
- 个人中心「作品 / 收藏 / 点赞」
- 设置页分组切换后下方挂 `k-list` / `k-cell-group`

与 `k-navbar`（页面顶栏）、原生 `tabBar`（应用级底栏，**本期不做自定义组件**，见 `docs/k-tabbar二期规划备忘.md`）职责不同：

```text
k-navbar          页面标题 / 返回 / 右侧操作
k-tabs            同页内容分区切换（Tab 头 + 内容区）
k-list / k-cell   分区下的列表承载
```

### 1.2 设计原则（对齐 kit-ui 既有组件）

| 原则 | 说明 |
| --- | --- |
| 容器与项分离 | `k-tabs` 管导航与激活态，`k-tab-pane` 管标题元数据与内容 slot |
| 与 collapse / radio-group 同构 | 子项 `register` / `unregister` + `provide` / `inject` |
| v-model 双轨 | 支持按 `name`（推荐）或 `index` 激活，与 `k-collapse` 一致 |
| 主题一致 | 主色 `#6366f1`，走 `--k-*` 与 `buildThemeStyle` |
| APP 动效 | 指示器位移走 `kit-ui-app-animation`，禁止响应式 `:style` 驱动 |
| 样式红线 | 无 `grid` / `gap` / `@media`；Tab 文案样式写在 `text` / `button` |

### 1.3 一期非目标（明确边界）

- **不实现** `k-tabbar` / `k-tabbar-item`（二期，见备忘文档）
- **不实现** 内容区左右滑动手势切换（`swipeable`，二期）
- **不实现** 吸顶 `k-sticky-tabs`（二期独立组件）
- **不实现** 垂直侧栏 Tab（`placement="left"`，二期）
- **不实现** 可拖拽排序 Tab 头
- **不实现** 与 `scroll-view` 嵌套滚动的「嵌套滚动协调」专项（一期仅文档说明注意事项）

---

## 2. 竞品 API 参考（取舍依据）

| 库 | 值得借鉴 | 一期不跟 |
| --- | --- | --- |
| Vant Tabs | `type` line/card、`sticky`、`swipeable` | sticky/swipe 二期 |
| uView Tabs | `scrollable`、`bar` 指示器 | 过度 props 收敛 |
| Element Plus | `before-leave`、lazy | DOM 测量逻辑过重 |
| Ant Design Mobile | 胶囊 Tab、徽标 | — |

**kit-ui 一期收敛**：3 种视觉 `type` + `scrollable` + `lazy` + `beforeChange` + 徽标，足够覆盖 80% 业务。

---

## 3. 组件结构

```text
k-tabs
├── 导航区 k-tabs__nav（横向 flex）
│   ├── [slot nav-left]
│   ├── k-tabs-nav-body → k-tabs-nav-wrap
│   │   ├── [scrollable] scroll-view（与 Tab 项 id 同组件，满足 MP scroll-into-view）
│   │   └── k-tabs__nav-wrap
│   │       ├── k-tabs__item × N（来自 tab-pane 元数据）
│   │       └── 指示器（line / card / button 轨道）
│   └── [slot nav-right]
└── 内容区 k-tabs__content
    └── k-tab-pane × N（默认 slot 子节点）
```

**子组件命名**：`k-tab-pane`（与 Element / kit-ui `k-collapse-item` 命名习惯一致；不用 `k-tab-item`）。

---

## 4. k-tabs Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `0` | 当前激活项：`name` 或索引（见 `valueType`） |
| `valueType` | `'name' \| 'index'` | `'name'` | `modelValue` 语义；未给 pane 设 `name` 时回退 index |
| `type` | `'line' \| 'card' \| 'button'` | `'line'` | 视觉类型：下划线 / 卡片 / 胶囊按钮 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tab 头尺寸 |
| `animated` | `boolean` | `true` | 指示器 / 激活态是否过渡（APP 走 setProperty） |
| `stretch` | `boolean` | `false` | Tab 项是否均分宽度（仅非 scrollable 时生效） |
| `scrollable` | `boolean` | `false` | 超出时导航区横向滚动；为 `true` 时 `stretch` 无效 |
| `lazy` | `boolean` | `false` | 全局懒加载：未激活 pane 不渲染内容 |
| `destroyOnHide` | `boolean` | `false` | 隐藏时销毁 pane 内容（与 lazy 组合使用） |
| `swipeThreshold` | `number` | `5` | 超过该数量自动开启 scrollable（`scrollable=false` 时生效） |
| `duration` | `number` | `300` | 指示器动画时长（ms） |
| `lineWidth` | `string` | `''` | `type=line` 时指示器宽度；空则按内容区自适应（约 94%） |
| `lineHeight` | `string` | `'2px'` | `type=line` 时指示器高度 |
| `activeColor` | `string` | `''` | 激活色，空则 `--k-color-primary` |
| `inactiveColor` | `string` | `''` | 未激活文字色，空则 `--k-text-color-secondary` |
| `background` | `string` | `''` | 导航区背景色 |
| `beforeChange` | `(name, index) => boolean` | — | 切换前拦截，返回 `false` 不切换 |
| `disabled` | `boolean` | `false` | 整组禁用 |
| `customStyle` | `string` | `''` | 根节点内联样式 |
| `customClass` | `string` | `''` | 根节点类名 |

### 4.1 Props 设计说明

**`valueType` 与 `modelValue`**

- 业务推荐 `name`（稳定，与接口状态码一致）
- 快速 demo 可用 `index`
- 与 `k-collapse` 手风琴模式对齐，降低学习成本

**`scrollable` 与 `swipeThreshold`**

- 默认 `scrollable=false` + `stretch=false`：Tab 靠内容宽度排列
- 项数 > `swipeThreshold` 时自动 `scrollable`（可关闭）
- scrollable 场景导航区使用条件编译包裹的 `scroll-view`（横向）

**`lazy` / `destroyOnHide`**

- `lazy=false`：所有 pane 内容常驻 DOM（简单场景）
- `lazy=true`：仅激活 pane 渲染 default slot
- `destroyOnHide=true`：切走后卸载，再次激活重新 mount（适合重列表）

**`beforeChange`**

- 同步返回 `false` 拦截切换
- 一期 **不支持** Promise 异步（与 k-modal beforeClose 二期对齐，避免 UTS 复杂度）

---

## 5. k-tab-pane Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string \| number` | `''` | 唯一标识；空则使用注册索引 |
| `title` | `string` | `''` | Tab 头文案 |
| `disabled` | `boolean` | `false` | 禁用该项 |
| `dot` | `boolean` | `false` | 红点（无数字） |
| `badge` | `string \| number` | `''` | 徽标数字/文案，复用 `k-badge` 视觉 |
| `lazy` | `boolean` | — | 未传则继承父级 `lazy` |
| `icon` | `string` | `''` | 标题前图标（一期替代 label slot） |
| `customStyle` | `string` | `''` | 内容区样式 |

---

## 6. Slots

### k-tabs

| 名称 | 说明 |
| --- | --- |
| `default` | 放置 `k-tab-pane` |
| `nav-left` | 导航区左侧附加区（如筛选图标） |
| `nav-right` | 导航区右侧附加区 |

### k-tab-pane

| 名称 | 说明 |
| --- | --- |
| `default` | 面板内容 |

> **`label` slot 一期未实现**（决策 R-01），使用 `icon` + `title`。

---

## 7. Events

### k-tabs

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model |
| `change` | `name, index` | 激活项变化后 |
| `click` | `name, index` | 点击 Tab 头（含点击当前项） |

### k-tab-pane

一期无独立事件（点击由 tabs 统一处理）。

---

## 8. 视觉设计（一期三种 type）

### 8.1 通用尺寸

| size | 导航高度 | 字号 | 水平内边距（item） |
| --- | --- | --- | --- |
| small | 36px | 13px | 12px |
| medium | 44px | 14px | 16px |
| large | 48px | 16px | 20px |

项间距用 **margin-right**（如 `12px`），末项 `margin-right: 0`，**不用 gap**。

### 8.2 type = line（默认）

- 导航底部分割线：`--k-border-color`
- 激活项文字：`activeColor` / `--k-color-primary`
- 底部指示器：`lineWidth` × `lineHeight`，圆角 `lineHeight/2`
- 指示器水平位置跟随激活项中心（APP 动画）

### 8.3 type = card

- 导航区背景：`--k-bg-color-secondary`
- 激活项：白底 / 暗色模式下 `--k-bg-color`，轻微圆角 `8px`
- 内容区与导航区间距：`12px`（margin-top）

### 8.4 type = button（胶囊）

- 整体轨道：圆角容器 + 浅色背景
- 激活项：主色填充或主色描边（一期采用 **主色浅底 + 主色字**，与 `k-tag` primary 一致）
- 项之间：`margin-right: 8px`

### 8.5 状态

| 状态 | 表现 |
| --- | --- |
| disabled（项） | 文字 `--k-text-color-disabled`，不可点击 |
| disabled（组） | 全部项不可点击 |
| dot / badge | Tab 头右侧，`k-badge` 尺寸 `small` |

### 8.6 主题 CSS 变量（组件级）

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `--k-tabs-nav-height` | 44px | 导航高度 |
| `--k-tabs-line-color` | `--k-color-primary` | 指示器颜色 |
| `--k-tabs-active-color` | `--k-color-primary` | 激活文字 |
| `--k-tabs-inactive-color` | `--k-text-color-secondary` | 未激活文字 |
| `--k-tabs-nav-bg` | transparent | 导航背景 |
| `--k-tabs-content-padding` | 0 | 内容区 padding |

---

## 9. 技术架构

### 9.1 父子通信（参考 k-collapse）

```text
k-tabs provide（键名见 tab.constants.uts）:
  k-tabs-active-value / k-tabs-value-type
  k-tabs-lazy / k-tabs-destroy-on-hide
  k-tabs-register-pane / k-tabs-unregister-pane / k-tabs-update-pane
  k-tabs-register-indicator / k-tabs-register-nav-query-scope

k-tab-pane inject + onMounted register / onBeforeUnmount unregister
k-tabs-nav-wrap onMounted 注册 indicatorRef 与 navQueryScope
```

**TabPaneContext**（`tab.type.uts`）建议字段：

- `elId`、`name`、`title`、`disabled`、`dot`、`badge`
- `slots` 是否有 `label`
- `isActive` ComputedRef
- `renderContent` 是否应渲染（lazy 计算）

### 9.2 导航渲染策略

- Tab 头由 **tabs 父组件统一渲染**（非 pane 自绘头），避免指示器定位分散
- pane 仅通过 register 上报元数据 + 提供内容 slot
- 自定义 `label` slot：通过 context 标记，tabs 渲染时 `v-if` 切换（注意 uni-app x slot 转发限制，需实测）

### 9.3 指示器动画（APP）

| 端 | 方案 |
| --- | --- |
| WEB / MP | 内联 `left` / `width` / `top` + CSS `transition` |
| APP | `setProperty('left' | 'width' | ...)` + `transition-duration` |

开发前阅读：`kit-ui-app-animation`、`kit-ui-uts-app-compat`。

### 9.4 与 k-form 联动（二期预留）

一期不 inject form-item；`change` 触发校验可在表单扩展迭代补 `validateTrigger: 'change'` 注入点。

---

## 10. 演示页规划（`pages-demo/tabs/tabs.uvue`）

| 区块 | 内容 |
| --- | --- |
| 基础用法 | 3 个 pane，`v-model` 按 name |
| 三种 type | line / card / button 各一组 |
| 尺寸 | small / medium / large |
| 禁用 | 单项 disabled + 整组 disabled |
| 徽标 | dot + badge |
| 自定义 label | ~~slot + k-icon~~ | 一期用 `icon` 属性（R-01） |
| 懒加载 | lazy + 列表 pane 内 k-list 简例 |
| 滚动导航 | 8+ Tab + scrollable |
| beforeChange | 拦截切换到某一项 |
| 边界 | 仅 1 个 pane、动态增删 pane（v-for） |

APP 场景整页滚动：`#ifdef APP` 包裹 `scroll-view`。

---

## 11. 开发任务拆分（预估 2～3 天）

| 阶段 | 任务 | 预估 |
| --- | --- | --- |
| D1 上午 | `tab.type.uts`、register 机制、`k-tab-pane` 骨架 | 0.5d |
| D1 下午 | `k-tabs` 导航区 + line 类型 + v-model | 0.5d |
| D2 上午 | card / button 类型、scrollable、badge/dot | 0.5d |
| D2 下午 | lazy、beforeChange、APP 指示器动画 | 0.5d |
| D3 | demo 页、README、三端冒烟、文档同步 | 0.5～1d |

---

## 12. 风险与待评审项

| ID | 问题 | 建议 | 决策 |
| --- | --- | --- | --- |
| R-01 | 自定义 `label` slot 跨组件转发 | 一期用 `icon` + `title` 替代 | **一期 icon 属性** |
| R-02 | scroll-view 横向 + 指示器同步滚动 | 激活项变化时 `scroll-into-view` | 一期实现 |
| R-03 | 动态 v-for 增删 pane | 复用 cell-border 式 unregister | 一期实现 |
| R-04 | `valueType=index` 与 `name` 混用 | README 明确禁止混用 | 文档约束 |
| R-05 | pane 内嵌套 scroll-view 与页面滚动 | demo 注释说明，不封装 | 一期仅文档 |

---

## 13. 验收标准（DoD）

- [x] props / emits / slots 与 README 一致（`label` slot 一期除外）
- [x] `pages-demo/tabs/tabs.uvue` + `pages.json` 注册
- [x] README 与跨端说明、验收清单已补齐
- [x] WEB / MP / APP 冒烟：切换、禁用、scrollable、lazy（见 `docs/k-tabs三端冒烟验收清单.md`）
- [x] 无 grid / gap / @media 红线
- [x] APP 指示器动画可感知（非跳变）

---

## 14. 相关文件（已创建）

| 路径 | 说明 |
| --- | --- |
| `uni_modules/kit-ui/components/k-tabs/k-tabs.uvue` | 容器主控 |
| `uni_modules/kit-ui/components/k-tabs/tab.type.uts` | 类型 |
| `uni_modules/kit-ui/components/k-tabs/tab.constants.uts` | provide / inject 键 |
| `uni_modules/kit-ui/components/k-tabs/tab-utils.uts` | 颜色与 key 解析 |
| `uni_modules/kit-ui/components/k-tabs/tab-indicator.uts` | 指示器几何 |
| `uni_modules/kit-ui/components/k-tabs/tabs-layout.uts` | selectorQuery |
| `uni_modules/kit-ui/components/k-tabs/tabs-style.uts` | 样式变量与类名 |
| `uni_modules/kit-ui/components/k-tabs/tabs-nav.style.scss` | 导航样式 |
| `uni_modules/kit-ui/components/k-tabs-nav-body/` | 导航编排入口 |
| `uni_modules/kit-ui/components/k-tabs-nav-wrap/` | 导航 DOM + scroll-view |
| `uni_modules/kit-ui/components/k-tab-pane/k-tab-pane.uvue` | 面板项 |
| `uni_modules/kit-ui/components/k-tabs/README.md` | 组件文档 |
| `pages-demo/tabs/tabs.uvue` | 演示 |
| `docs/k-tabs跨端实现说明.md` | 跨端维护说明 |
| `docs/k-tabs三端冒烟验收清单.md` | 验收记录 |

---

## 15. v1 收尾记录（2026-06-29）

### 15.1 交付结论

- 一期 v1 **可发版**；综合质量约 95/100（三端验收后）
- 迭代 3 剩余项：`k-navbar`（`k-tabs` 已闭环）

### 15.2 关键实现决策

| 决策 | 原因 |
| --- | --- |
| 拆 `k-tabs-nav-body` + `k-tabs-nav-wrap` | 消除 scroll / 非 scroll 模板重复；测量 scope 与 DOM 同组件 |
| `scroll-view` 放在 `nav-wrap` 内 | 微信 `scroll-into-view` 不能跨自定义组件找 `id` |
| card/button 修饰类挂在 `nav-wrap` | 小程序样式隔离 |
| 文字颜色内联 + CSS 变量注入 | APP / MP 子组件不继承父级变量 |
| `icon` 替代 `label` slot | slot 跨组件转发限制（R-01） |

### 15.3 二期预留

- `swipeable`、`k-sticky-tabs`、垂直 `placement`、`label` slot、`beforeChange` Promise
- 与 `k-form` validateTrigger 联动
