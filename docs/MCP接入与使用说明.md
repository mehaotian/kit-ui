# kit-ui MCP 接入与使用说明（一期）

## 目标

- 让 MCP 与 `uni-app x + kit-ui` 技术栈一致。
- 避免误用无关 MCP 造成建议偏差。

## 项目默认 MCP

- 配置文件：`.cursor/mcp.json`
- 当前默认：`uni-app-x`

```json
{
  "mcpServers": {
    "uni-app-x": {
      "command": "npx",
      "args": ["-y", "uni-app-x-mcp"]
    }
  }
}
```

## 使用优先级

1. 必选：`uni-app-x`（组件可用性、easycom、跨端语义）
2. 可选：Git 相关 MCP（分支、PR、协作流程）
3. 非默认：与项目栈无关的 MCP（如 Laya 系列）

## 使用边界

- 查询 uni-app x API、组件能力、平台差异时，优先走 `uni-app-x`。
- 与仓库协作相关信息可走 Git 工具。
- 非相关 MCP 不作为默认信息源。

## 安全建议

- 优先本地/stdio MCP，减少外发风险。
- 远程 MCP 使用最小权限凭证。
- MCP 信息与仓库代码冲突时，以仓库代码为准并标注差异。
