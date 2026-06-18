# k-button 双轨策略规范（草案）

## 1. 背景与问题

当前 `k-button` 组件承担了统一视觉与交互的职责，但原生 `button` 在不同平台（尤其小程序）存在大量扩展属性（如用户信息、授权能力、开放能力等）。  
若在组件库内完整重写全部平台属性，会带来以下问题：

- 维护成本高：平台属性持续变化，组件库需长期跟进。
- 价值不匹配：这些属性多数属于平台能力，不是组件库核心竞争力。
- API 复杂化：业务开发者需要理解更多组件侧“转译规则”。

因此，`k-button` 不应演变为“原生 button 全量代理层”，而应回归“设计系统基础按钮”定位。

## 2. 目标与非目标

### 2.1 目标

- 保持 `k-button` 的跨端一致视觉与常用交互能力。
- 提供“原生 button + k-button 样式类”能力，覆盖平台特有属性场景。
- 控制组件库 API 规模，降低长期维护成本。

### 2.2 非目标

- 不追求在 `k-button` 中重建各平台全部 `button` 属性。
- 不在组件库内封装平台业务语义（如授权流程、订阅消息流程）。

## 3. 总体方案：双轨并行

### 3.1 轨道 A：`k-button` 组件（默认推荐）

适用场景：常规按钮交互、样式统一、主题一致性要求高的页面。

建议仅保留“设计系统相关”核心能力：

- 视觉类：`type`、`size`、`plain`、`gradient`、`shadow`、`round`、`circle`
- 状态类：`disabled`、`loading`
- 内容类：`text`、`icon`、`slot`
- 事件类：`click`

说明：  
`k-button` 负责“好看、统一、常用”，不负责“平台能力大全”。

### 3.2 轨道 B：原生 `button` + `k-button` 样式类

适用场景：需要平台扩展属性（例如小程序开放能力）的按钮。

使用方式：  
业务直接写原生 `button`，并挂载 `k-button` 样式体系类名（如 `k-button`、`k-button--primary`、`k-button--gradient` 等），从而复用组件库视觉能力。

说明：  
平台属性由原生组件直接承接，组件库只提供样式与状态规范，避免重复封装。

## 4. 类名体系建议（统一两条轨道）

为避免视觉分裂，`k-button` 组件与原生 `button` 必须共用一套类名语义：

- 基础类：`k-button`
- 类型类：`k-button--default`、`k-button--primary`、`k-button--success`、`k-button--warning`、`k-button--danger`
- 尺寸类：`k-button--small`、`k-button--medium`、`k-button--large`
- 形态类：`k-button--plain`、`k-button--gradient`、`k-button--shadow`、`k-button--round`、`k-button--circle`
- 状态类：`k-button--disabled`、`k-button--loading`

补充约束：

- 状态类优先级高于类型类。
- 类名只表达“视觉与交互状态”，不表达业务语义。
- 不新增全局污染选择器，保持局部可控。

## 5. 使用决策规则（给业务方）

当页面开发选择按钮方案时，按以下规则判断：

- 不需要平台特有能力：优先用 `k-button`
- 需要平台特有能力：用原生 `button` + `k-button` 样式类
- 需要深度业务流程（授权、订阅、能力拉起）：由业务层实现流程，组件库仅提供视觉层

## 6. 文档结构建议（README 与 demo 同步）

`k-button` 文档建议增加“何时不用 k-button”章节，明确边界，避免误用：

- 基础用法：`k-button` 常规示例
- 样式增强：`plain / gradient / shadow`
- 平台能力场景：原生 `button` + `k-button` 样式类示例
- 选型建议：一张决策说明（优先级规则）

## 7. 渐进落地计划

### 阶段 1（低风险）

- 固化本规范与选型边界。
- 将 `k-button` 现有样式抽象为“可复用类语义”（若尚未完全统一）。
- 在 demo 页新增“原生 button 复用样式”示例。

### 阶段 2（增强）

- 提供 `k-button` 样式能力清单（类型、尺寸、形态、状态）。
- 统一 hover / active / disabled 视觉反馈在两条轨道上的表现。

### 阶段 3（治理）

- 在组件库文档首页增加“基础组件边界说明”。
- 在 PR 检查中增加“是否错误封装平台能力”的人工审查项。

## 8. 风险与应对

- 风险：业务侧出现两套写法导致心智分裂  
  应对：文档给出明确选型规则，demo 同时展示正反例。

- 风险：原生 `button` 样式覆盖不完整  
  应对：先保障主流组合（type + size + disabled + plain/gradient），逐步补齐边界状态。

- 风险：后续有人继续向 `k-button` 填充平台属性  
  应对：在组件 README 中声明“非设计系统属性不新增”原则。

## 9. 最终建议

该需求与方案方向合理，建议正式采纳“双轨策略”：

- `k-button` 作为标准化基础按钮；
- 原生 `button` 作为平台能力承载；
- 统一类名体系确保视觉一致。

这可以在保证组件库价值的同时，显著降低维护成本并提升跨平台可持续性。

## 10. 当前落地状态（2026-06）

已完成：

- 已新增独立页面 `pages/button-style/button-style.uvue`，用于演示原生 `button` 样式覆盖与平台能力场景。
- `uni_modules/kit-ui/theme/k-button-native.scss` 已提供原生按钮复用的全局样式能力。
- `uni_modules/kit-ui/theme/index.scss` 已接入 `k-button-native.scss`，保证全局可用。
- 微信能力示例已通过条件编译隔离（`MP-WEIXIN`），非微信平台提供兜底交互提示。

使用注意：

- 原生按钮建议同时挂载 `kit-ui--root` 与 `k-button` 类，确保主题变量生效。
- 推荐写法示例：`class="kit-ui--root k-button k-button--primary"`。
- 如需按压反馈，建议配合 `hover-class` 使用状态类（如 `k-button--primary--active`、`k-button--gradient--primary--active`）。
- 原生按钮样式覆盖当前不提供 `shadow` 变体，阴影效果统一保留在 `k-button` 组件内使用。
