# `.trae` 迁移归档说明（一期）

## 迁移目标

- 消除 `.cursor` 与 `.trae` 双配置源。
- 将仍有效的规则与 MCP 配置迁入 `.cursor` 与 `docs`。

## 迁移来源

- `.trae/rules/project_rules.md`
- `.trae/mcp.json`

## 内容迁移映射

| `.trae` 内容 | 处理结果 | 迁移目标 |
| --- | --- | --- |
| `.uvue` / UTS 基础约束 | 保留并收敛为硬约束 | `.cursor/rules/base.mdc` |
| 条件编译 `WEB/APP/MP-*` 口径 | 保留 | `.cursor/rules/base.mdc` + `docs/规则冲突治理清单.md` |
| 样式禁用项（`grid/gap/@media`） | 保留并提级为红线 | `.cursor/rules/base.mdc`、`demo-page-architecture.mdc`、`style-system.mdc` |
| 字体样式作用域限制 | 保留 | `.cursor/rules/base.mdc`、`style-system.mdc` |
| `uni-app-x` MCP 配置 | 保留并迁移到 Cursor | `.cursor/mcp.json` |
| 旧模板化大段规则 | 下线（改用 skills） | `.cursor/skills/*` |

## 删除项说明

- 删除 `.trae` 的原因：
  1. 与 `.cursor` 存在重复规则来源，易冲突。
  2. 旧规则以模板堆叠为主，维护成本高。
  3. 一期改造后已形成“rules 最小集 + skills 工作流”新结构。

## 迁移后唯一入口

- 硬约束：`.cursor/rules/`
- 工作流技能：`.cursor/skills/`
- 治理文档：`docs/规则冲突治理清单.md`、`docs/MCP接入与使用说明.md`
