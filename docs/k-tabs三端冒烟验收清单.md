# k-tabs v1 三端冒烟验收清单

> 目标：验证 `k-tabs` + `k-tab-pane` 一期 v1 能力  
> 适用版本：k-tabs v1（2026-06-29 验收）  
> 演示页：`pages-demo/tabs/tabs.uvue`

---

## 1. 执行前准备

- HBuilderX 最新稳定版，uni-app x 可用
- 清理缓存后 **全量运行**（APP / 微信勿单靠 HMR）
- 微信：改组件结构后须重新编译到开发者工具
- 进入页面：`/pages-demo/tabs/tabs`

---

## 2. 验收范围（v1）

### 2.1 核心能力

- `v-model`（`name` / `index`）
- `type`：line / card / button
- `size`：small / medium / large
- `scrollable` + `swipeThreshold` 自动滚动
- `stretch` 均分（非 scrollable）
- `lazy` + `destroyOnHide`
- `beforeChange` 同步拦截
- `disabled`（项 / 组）
- `dot` / `badge` / `icon`
- `nav-left` / `nav-right`
- 动态增删 pane（`v-for`）

### 2.2 跨端专项

- APP 指示器过渡（`setProperty`，非跳变）
- MP 滚动导航 `scroll-into-view`（含点击首项回左）
- MP card/button 导航高度与指示器尺寸
- 非法 `v-model` 回退首项

### 2.3 一期不包含

- `label` slot、`swipeable`、吸顶、垂直 Tab、`beforeChange` Promise

---

## 3. 三端执行记录

| 端 | 环境信息 | 结果 | 备注 |
| --- | --- | --- | --- |
| WEB | | ☑ 通过 | |
| APP | | ☑ 通过 | Kotlin 编译无报错 |
| 微信 MP | | ☑ 通过 | 滚动吸附、card/button 尺寸 |

---

## 4. 用例清单

### 4.1 基础与视觉

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| 基础 name 切换 | ☑ | ☑ | ☑ | 面板与导航同步 |
| line / card / button | ☑ | ☑ | ☑ | 三种视觉正确 |
| 自定义 active/inactive 色 | ☑ | ☑ | ☑ | 文字与指示器同色 |
| small / medium / large | ☑ | ☑ | ☑ | 高度与字号阶梯 |

### 4.2 滚动导航

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| 横向滑动 8+ Tab | ☑ | ☑ | ☑ | 可左右滑动不挤压 |
| 点击右侧 Tab 滚入视区 | ☑ | ☑ | ☑ | 激活项可见 |
| 点击第一个 Tab 回左 | ☑ | ☑ | ☑ | 滚到最左侧 |
| 指示器跟随滚动后 Tab | ☑ | ☑ | ☑ | 位置与激活项对齐 |

### 4.3 状态与交互

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| 单项 disabled | ☑ | ☑ | ☑ | 不可点、灰色 |
| 整组 disabled | ☑ | ☑ | ☑ | 全部不可点 |
| dot / badge | ☑ | ☑ | ☑ | 徽标不裁切 |
| icon + title | ☑ | ☑ | ☑ | 图标颜色随激活态 |
| beforeChange 拦截 | ☑ | ☑ | ☑ | 返回 false 不切换 |
| lazy 面板 | ☑ | ☑ | ☑ | 未访问不渲染内容 |

### 4.4 边界

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| 动态增删 Tab | ☑ | ☑ | ☑ | 指示器与宽度重测 |
| value-type=index | ☑ | ☑ | ☑ | 按索引绑定 |
| nav-left / nav-right | ☑ | ☑ | ☑ | 附加区不挤压导航 |

---

## 5. 已知设计取舍

| 项 | 说明 |
| --- | --- |
| scroll-view 位置 | 放在 `k-tabs-nav-wrap` 内，满足 MP `scroll-into-view` |
| nav-wrap 模板双分支 | scrollable / 非 scrollable 各一份 DOM，避免跨组件滚动失效 |
| 指示器首次无动画 | `indicatorLayoutReady` 避免首屏飞入 |
| icon 替代 label | 一期 slot 转发限制，见开发计划 R-01 |

---

## 6. 回归入口

- 组件 README：`uni_modules/kit-ui/components/k-tabs/README.md`
- 跨端说明：`docs/k-tabs跨端实现说明.md`
- 方案文档：`docs/k-tabs开发计划.md`
