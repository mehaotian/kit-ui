# k-navbar v1 三端冒烟验收清单

> 目标：验证 `k-navbar` 一期 v1 能力  
> 适用版本：k-navbar v1（2026-06-29 验收通过）  
> 演示页：`pages-demo/navbar/navbar.uvue`、`pages-demo/navbar-composite/navbar-composite.uvue`

---

## 1. 执行前准备

- HBuilderX 最新稳定版，uni-app x 可用
- 清理缓存后 **全量运行**（APP / 微信勿单靠 HMR）
- 微信：改组件后须重新编译到开发者工具
- 页面须设 `navigationStyle: custom`（见 `pages.json`）

---

## 2. 验收范围（v1）

### 2.1 核心能力

- `title` / `leftText` / `rightText` / `leftArrow`
- `leftArrow + leftText` 组合
- slot：`left` / `title` / `right`
- `fixed` + `placeholder`
- `safeAreaInsetTop`（仅 fixed 生效）
- `border` / `background` / 颜色 props
- `disabled`
- `autoBack` / `click-left` / `click-right`
- `defineExpose`：`getNavbarHeight()` / `syncLayout()`

### 2.2 跨端专项

- MP fixed：胶囊避让 + 右侧 10px 间距
- MP / APP fixed：状态栏高度正确
- 内嵌 `:fixed="false"`：无状态栏、无胶囊，标题完整
- fixed 顶栏：标题相对**整屏**居中（非 flex 中间列居中）
- 内嵌 demo：三列 flex，右侧文字在最右
- 长标题单行 ellipsis
- 横竖屏切换后顶栏高度仍正确（抽测）

### 2.3 一期不包含

- 搜索栏、透明沉浸、size 阶梯、其它 MP 胶囊单独适配

---

## 3. 三端执行记录

| 端 | 环境信息 | 结果 | 备注 |
| --- | --- | --- | --- |
| WEB | Chrome | ☑ 通过 | fixed 顶栏、内嵌 demo、组合页 |
| APP | Kotlin 编译 | ☑ 通过 | 状态栏、指示器联动 tabs 无抖动 |
| 微信 MP | custom 导航 | ☑ 通过 | 胶囊避让、标题整屏居中、右侧「说明」 |

---

## 4. 用例清单

### 4.1 页面级 fixed 顶栏

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| fixed + placeholder | ☑ | ☑ | ☑ | 内容不被遮挡 |
| 状态栏区域 | ☑ | ☑ | ☑ | fixed 有；内嵌无 |
| 标题整屏居中 | ☑ | ☑ | ☑ | 相对屏幕居中，非中间 flex 区居中 |
| 右侧「说明/筛选」 | ☑ | ☑ | ☑ | 最右侧，MP 距胶囊有间距；默认主文字色 |
| 返回 navigateBack | ☑ | ☑ | ☑ | 有栈时返回 |
| 首页无栈点击返回 | ☑ | ☑ | ☑ | 不报错、不崩溃 |

### 4.2 内嵌示例（navbar 演示页卡片内）

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| 基础 title + arrow | ☑ | ☑ | ☑ | 标题完整、44px |
| 左右文字 | ☑ | ☑ | ☑ | 分享在最右 |
| 箭头 + 返回文字 | ☑ | ☑ | ☑ | 箭头在左、文字紧随其后 |
| 长标题省略 | ☑ | ☑ | ☑ | 单行 ellipsis，左右操作区不被挤占 |
| 自定义 slot | ☑ | ☑ | ☑ | 标题/图标/右侧图标分区正确 |
| 品牌色 background | ☑ | ☑ | ☑ | 白字可读 |
| disabled | ☑ | ☑ | ☑ | 点击无响应 |

### 4.3 组合页

| 用例 | WEB | APP | MP | 预期 |
| --- | --- | --- | --- | --- |
| navbar + tabs(stretch) + list | ☑ | ☑ | ☑ | Tab 均分、不被截断 |
| 切换 Tab | ☑ | ☑ | ☑ | 列表/空态正常 |
| load-more | ☑ | ☑ | ☑ | 加载更多可用 |

---

## 5. 已知设计取舍

| 项 | 说明 |
| --- | --- |
| fixed 门控 | 非 fixed 不套安全区/胶囊 |
| 页面级标题居中 | absolute 全宽 overlay + 对称安全 padding |
| 内嵌三列 flex | `:fixed="false"` 卡片内用等宽侧栏，避免绝对定位错乱 |
| 默认右色 | 与标题一致（主文字色），非主题蓝 |
| MP 仅 WEIXIN 胶囊 | 其它 MP 走 16px 内边距 |
| navigateBack | 无栈静默跳过 |

---

## 6. 回归入口

- 组件 README：`uni_modules/kit-ui/components/k-navbar/README.md`
- 跨端说明：`docs/k-navbar跨端实现说明.md`
- 方案文档：`docs/k-navbar开发计划.md`
