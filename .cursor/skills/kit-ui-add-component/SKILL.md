---
name: kit-ui-add-component
description: 为 kit-ui 新建组件与演示页脚手架，统一创建组件文件、README、demo 页面与页面注册。用户提到“新增组件/新建 k-xxx/补 demo”时使用。
---

# kit-ui 新建组件技能

## 目标

- 在 `uni_modules/kit-ui/components/` 下创建 `k-[name]` 组件目录与主文件。
- 在 `pages/[name]/` 下创建演示页并注册到 `pages.json`。
- 同步最小文档，保证组件可继续迭代。

## 输入参数

- 组件名：`[name]`（不带 `k-` 前缀）。
- 组件定位：基础组件 / 表单组件 / 反馈组件。
- 首期能力：props、events、slots、是否支持主题变量。

## 执行步骤

1. 创建组件目录 `uni_modules/kit-ui/components/k-[name]/`。
2. 创建主文件 `k-[name].uvue`：
   - 使用 `<script setup lang="uts">`。
   - 事件函数与复杂逻辑添加函数级注释。
   - 样式使用 `--k-*` 变量，不写 `gap` 与 `grid`。
3. 创建组件文档 `README.md`：
   - 写明 props、events、示例、注意事项（跨端与样式约束）。
4. 创建演示页 `pages/[name]/[name].uvue`：
   - 包含基础用法、状态用法、主题用法三个区块。
   - 需要滚动时用 `#ifdef APP` 包裹 `scroll-view`。
5. 更新 `pages.json` 注册新页面。
6. 更新 `pages/index/index.uvue`（若有组件入口列表）以便可导航。
7. 运行自检：
   - 命名一致：目录、文件、组件名统一。
   - 无禁用样式：`gap`、`grid`、`@media`。
   - 文档与页面已关联。

## 输出要求

- 输出变更文件列表。
- 说明新增组件的默认 props/events。
- 明确后续补充项（测试、视觉细节、发布前检查）。
