# kit-ui rules 与 skills 总索引

## 设计原则

- `rules` 只保留硬约束与禁用项。
- 流程型内容全部迁移到 `.cursor/skills/`。
- 冲突裁决以 `docs/规则冲突治理清单.md` 为准。

## 当前规则（最小集）

1. `base.mdc`：项目级硬约束与统一口径。
2. `component-architecture.mdc`：组件目录与结构红线。
3. `demo-page-architecture.mdc`：演示页结构与样式红线。
4. `style-system.mdc`：主题变量与视觉约束。
5. `app-animation.mdc`：APP 端过渡动画硬约束（组件 `*.uvue`）。

## rules -> skills 映射

| 场景 | 入口 skill |
| --- | --- |
| 新建组件与 demo | `kit-ui-add-component` |
| 文档同步 | `kit-ui-doc-sync` |
| 跨端与语法合规 | `kit-ui-cross-platform-check` |
| APP 过渡动画 | `kit-ui-app-animation` |
| 视觉精修 | `kit-ui-visual-polish-check` |
| 发版检查 | `kit-ui-release-checklist` |
| MCP 使用策略 | `kit-ui-mcp-usage-guide` |

## 本期迁移说明

- 已移除冗余规则文件：`parent-child-communication.mdc`、`code-quality.mdc`。
- 原规则中的流程模板改由 skills 维护，减少重复和冲突。
