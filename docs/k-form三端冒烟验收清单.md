# k-form 三端冒烟验收清单

> 目标：对 `pages/form-validate/form-validate.uvue` 做 WEB / APP / 微信 MP 最小可用验收。  
> 适用版本：Phase 3（含 `validateStatus`、message 优先级、`uni.request` 异步兜底）。

---

## 1. 执行前准备

- 使用 HBuilderX 最新稳定版，确保 `uni-app x` 编译器可用。
- 清理旧缓存后重新运行（避免热更新残留影响）。
- 确认可进入页面：`pages/form-validate/form-validate.uvue`。

---

## 2. 验收范围

- 基础规则：`required`、`type`、`pattern/regexp`、`enum/len/whitespace`
- 触发器：`submit`、`blur`、`change`
- 自定义能力：`validator`、`asyncValidator`
- UI 状态：`error`、`validating`、`success`、`validateStatus` 手动控制
- API：`validate`、`validateAsync`、`validateField`、`getFieldsError`
- 文案优先级：项级 > 表单级 > 默认

---

## 3. 三端执行记录

| 端 | 环境信息 | 结果 | 备注 |
| --- | --- | --- | --- |
| WEB | HBuilderX 运行到浏览器（用户实测，2026-06-25） | ☑ 通过 / ☐ 失败 | 页面交互、校验文案、异步流程正常 |
| APP(Android/iOS) | HBuilderX 运行到 APP（用户实测，2026-06-25） | ☑ 通过 / ☐ 失败 | Kotlin 编译通过，无新增 uvue 样式报错 |
| 微信 MP | HBuilderX + 微信开发者工具（用户实测，2026-06-25） | ☑ 通过 / ☐ 失败 | 触发器、组合控件校验与异步兜底正常 |

---

## 4. 用例清单（逐项勾选）

| 用例 | WEB | APP | 微信 MP | 预期结果 |
| --- | --- | --- | --- | --- |
| 基础信息校验 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 手机号/邮箱/URL/年龄规则生效 |
| 规则扩展校验 | ☑ 通过 | ☑ 通过 | ☑ 通过 | `len`、`enum`、`whitespace` 文案正确 |
| 提交错误汇总 | ☑ 通过 | ☑ 通过 | ☑ 通过 | `getFieldsError()` 返回字段错误 map |
| 手动状态控制 | ☑ 通过 | ☑ 通过 | ☑ 通过 | `validateStatus` 可切换 validating/error/success |
| 文案优先级 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 项级 > 表单级 > 默认文案 |
| 文案匹配（非同索引） | ☑ 通过 | ☑ 通过 | ☑ 通过 | 项级规则顺序变化后，仍可回退命中表单级 message |
| 原生输入框校验 | ☑ 通过 | ☑ 通过 | ☑ 通过 | `validateField('phone','blur')` 生效 |
| 失焦即时校验 | ☑ 通过 | ☑ 通过 | ☑ 通过 | `blur` 触发规则即时反馈 |
| change→blur 竞态回归 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 快速输入后立刻 blur，不出现旧 change 结果覆盖 blur 结果 |
| 密码确认校验 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 跨字段不一致时提示 |
| 选项控件校验 | ☑ 通过 | ☑ 通过 | ☑ 通过 | radio/checkbox/switch 的 `change` 校验生效 |
| 异步可用性校验 | ☑ 通过 | ☑ 通过 | ☑ 通过 | `uni.request` 优先，失败回退本地兜底 |
| 非法正则容错 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 规则 `pattern` 非法时组件不崩溃，返回校验失败提示 |
| 重复 prop 卸载回归 | ☑ 通过 | ☑ 通过 | ☑ 通过 | 动态移除一个同 prop 的表单项，不影响其他项注册状态 |

---

## 5. 失败记录模板

```base
[端]: WEB / APP / 微信MP
[用例]: 例如“文案优先级”
[现象]: 例如“项级 message 未覆盖表单级”
[复现步骤]:
1. ...
2. ...
[期望]: ...
[实际]: ...
[截图/日志]: ...
```

---

## 6. 收口标准

- 三端用例全部勾选通过。
- APP 无 Kotlin 编译错误、无 uvue CSS 非法属性报错。
- 交接文档与开发计划中的待验收项同步为已完成。

---

## 7. 本轮验证结论（2026-06-25）

- 已执行 CLI 基础检查：`npm run build:h5`、`npm run build:app`、`npm run build:mp-weixin`（脚本为提示型命令）。
- 已由用户在 HBuilderX 完成 WEB / APP / 微信 MP 三端运行态实测，且本清单全部用例通过。
- 自动化与静态检查结论：`k-form` 相关改动文件 lint 无新增错误。
