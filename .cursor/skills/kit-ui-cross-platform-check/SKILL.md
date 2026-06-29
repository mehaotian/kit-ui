---
name: kit-ui-cross-platform-check
description: 对 uni-app x 组件代码做跨端与语法合规检查，重点覆盖条件编译、UTS 类型、样式禁用项。用户提到“跨端兼容/条件编译/uni-app x 规范检查”时使用。
---

# kit-ui 跨端合规检查技能

## 检查目标

- 让组件在 uni-app x 支持端保持一致行为。
- 在提交前发现高频平台兼容问题。

## 必查清单

1. 条件编译标识统一：
   - 使用 `WEB / APP / MP-*`。
   - 不新增 `H5` 写法。
2. UTS 语法约束：
   - 比较使用 `==` / `!=`。
   - 空值判断显式，不依赖隐式转换。
3. 样式约束：
   - 禁止 `grid`、`gap`、`@media`。
   - 文本样式只作用于 `text/button`。
4. 页面滚动容器：
   - 需要滚动的演示页在 APP 场景使用 `scroll-view` 条件包裹。
5. 命名与目录：
   - 组件文件是 `.uvue`。
   - 页面新增后已在 `pages.json` 注册。
6. UTS APP（Kotlin）编译：
   - 全项目 UTS 语法与 APP 门禁见 skill `kit-ui-uts-app-compat`。
   - 文档：`docs/UTS与APP编译约束.md`；案例：`docs/k-form-APP编译问题修复总结.md`。
7. APP 过渡动画（状态驱动的 left/width/height/background-color/border-color 等）：
   - 禁止写入会随状态变化的 `:style` computed。
   - 必须使用 `ref<UniElement>` + `style.setProperty()`；详见 skill `kit-ui-app-animation`。
   - 参考：`k-switch`、`k-checkbox`、`k-radio`、`k-collapse-item`。
8. 微信小程序专项：
   - 分包、代码质量、嵌套徽标/角标布局见 skill `kit-ui-mp-weixin-compat`。
9. APP ucss 百分比：
   - `min-height: 100%` 等 APP 不支持项用 `#ifndef APP` 条件编译。
10. 嵌套角标/徽标（k-badge、k-avatar）：
   - 禁止在固定尺寸圆角容器内 absolute 挂角标；嵌套模式用 px 锚点，不用 transform 百分比。

## 推荐执行动作

- 用搜索检查禁用项：`gap`、`display: grid`、`@media`、`#ifdef H5`。
- 对命中的代码给出修复建议并直接修改。
- 修改后再次检查，直到无命中或命中均有合理说明。

## 输出要求

- 输出风险清单（高/中/低）。
- 给出已修复项与剩余风险项。
