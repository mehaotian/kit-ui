---
name: kit-ui-mcp-usage-guide
description: 指导 kit-ui 项目中 MCP 的优先级与使用边界，避免误用无关 MCP。用户提到“是否使用 MCP/MCP 配置/AI 工具提效”时使用。
---

# kit-ui MCP 使用技能

## 目标

- 让 MCP 选择与项目技术栈一致。
- 降低错误建议、隐私泄露与维护成本。

## MCP 优先级

1. 必须优先：`uni-app-x-mcp`
   - 用于识别项目可用组件、easycom 与 uni-app x 语义。
2. 协作辅助：Git 相关 MCP
   - 用于分支、提交、PR 与审查流程信息。
3. 非本项目默认：Laya 相关 MCP
   - 与 kit-ui 技术栈不一致，不作为默认建议来源。

## 使用边界

- 涉及 uni-app x API、组件可用性、跨端能力时，优先使用 `uni-app-x-mcp` 信息。
- 涉及仓库协作信息时，使用 Git 相关 MCP。
- 对跨技术栈问题先确认场景，再决定是否调用非默认 MCP。

## 安全与维护

- 优先本地/stdio MCP，尽量减少外发。
- 远程 MCP 使用最小权限凭证。
- MCP 无法覆盖的能力，回退到仓库代码与官方文档。

## 输出要求

- 对每次 MCP 选择给出“为何选它”的一句说明。
- 若拒绝某 MCP，也要说明原因与替代方案。
