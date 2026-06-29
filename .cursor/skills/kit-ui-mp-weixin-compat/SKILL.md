---
name: kit-ui-mp-weixin-compat
description: kit-ui 微信小程序编译、代码质量扫描、分包结构与嵌套徽标/角标布局的专项约束。用户提到小程序预览/代码质量未通过、主包超限、lazyCodeLoading、徽标截断、嵌套 badge 定位异常、分包 root 冲突时使用。
---

# kit-ui 微信小程序兼容技能

## 定位

覆盖 **MP-WEIXIN** 独有门禁与布局陷阱，与以下技能互补：

- `kit-ui-cross-platform-check`：通用条件编译与 CSS 红线
- `kit-ui-uts-app-compat`：APP Kotlin 编译（本技能不重复）
- 演示页分包结构：主包 `pages/index`，演示 `pages-demo/`

## 一、代码质量扫描三项（预览/上传前）

| 扫描项 | 配置位置 | 要求 |
| --- | --- | --- |
| 主包 ≤ 1.5MB | `pages.json` 分包 | 主包仅首页；演示页放独立分包目录 |
| JS 压缩 | `manifest.json` → `mp-weixin.setting.minified` | `true` |
| 组件按需注入 | `manifest.json` → `mp-weixin.lazyCodeLoading` | `"requiredComponents"` |

推荐一并开启：

```json
"mp-weixin": {
  "lazyCodeLoading": "requiredComponents",
  "setting": {
    "minified": true,
    "es6": true,
    "postcss": true
  },
  "optimization": {
    "subPackages": true
  }
}
```

改 `manifest.json` / `pages.json` 后须 **全量重新编译** 到微信开发者工具，再扫代码质量。

## 二、分包目录硬约束（高频报错）

### ❌ 禁止：分包 root 与主包页同目录

```json
{
  "pages": [{ "path": "pages/index/index" }],
  "subPackages": [{ "root": "pages", "pages": ["button/button"] }]
}
```

微信报错：`pages/index/index 不应该在 subPackages[0] 中`

### ✅ 正确：演示页独立目录

```json
{
  "pages": [{ "path": "pages/index/index" }],
  "subPackages": [{
    "root": "pages-demo",
    "name": "demo",
    "pages": [{ "path": "button/button" }]
  }]
}
```

- 物理目录：`pages/index/`（主包）+ `pages-demo/**`（分包）
- 路由仍为 `/pages-demo/button/button`，首页跳转路径须同步
- **禁止** `root: "pages"` 即使只把 index 留在主包

## 三、嵌套徽标 / 角标布局（仅 MP 易出问题）

### 根因（与 k-badge 同类）

1. 小程序 ucss 对 **`transform: translate(50%, -50%)` 百分比** 支持差 → 角标偏移、裁切
2. 固定宽高 + 圆角容器 **`overflow: hidden`** → 内部 absolute 角标被裁
3. 嵌套包装器 **`display: flex` + 居中** → 包装器被撑大，角标相对错误盒子定位
4. **内层 fill + transform 居中**（k-checkbox solid）→ fill 与 border 间 1px 白缝

### ✅ k-checkbox solid 选中（MP）

- fill 用 **left/top 贴边 px 定位**，不用 `translate(-50%, -50%)`
- 外框选中时 **backgroundColor 与 fill 同色**，兜底亚像素缝隙
- `inset` 模式仍保留缩放动画，不受影响

### ✅ k-badge 嵌套模式（标准）

- 角标挂在 **包装器** 上，不放在内容容器内部
- 嵌套包装器：`inline-flex` + `align-self: flex-start` + `overflow: visible`
- 定位用 **像素锚点**（内联 style），不用 transform 百分比

参考：`uni_modules/kit-ui/components/k-badge/k-badge.uvue` → `appendNestedBadgePosition`

### ✅ k-avatar 带徽标

必须用 **k-badge 包裹头像**，不得在 `.k-avatar` 内部 absolute 挂徽标：

```vue
<k-badge :dot="dot" :value="badge" :max="badgeMax" :color="badgeColor">
  <view class="k-avatar" ...>...</view>
</k-badge>
```

### 演示页 flex 容器

嵌套徽标示例的 `.demo-row` 建议：

```scss
.demo-row {
  overflow: visible;
  align-items: flex-start;
}
```

## 四、与 APP 共用但 MP 也须知的 ucss

| 属性 | MP | APP | 处理 |
| --- | --- | --- | --- |
| `min-height: 100%` | 通常可用 | **不支持** | `#ifndef APP` 包裹 |
| `transform` 百分比 | 不稳定 | 视场景 | 角标改用 px 定位 |
| `overflow: visible` | 父级 flex 仍可能裁切 | 同左 | 包装器 inline-flex + 演示页 visible |

## 五、提交前自检（MP 专项）

```text
- [ ] manifest mp-weixin：lazyCodeLoading / minified / optimization.subPackages
- [ ] 主包仅 pages/index；演示页在 pages-demo 分包
- [ ] 无 subPackage root 与主包 pages 目录冲突
- [ ] 嵌套角标组件未在固定尺寸圆角容器内 absolute
- [ ] k-badge 嵌套模式未依赖 transform 百分比
- [ ] 全量编译后微信开发者工具代码质量三项通过
- [ ] 嵌套徽标/头像徽标在 MP 真机或模拟器目视验收
```

## 六、本轮案例索引（2026-06）

| 问题 | 修复 |
| --- | --- |
| 代码质量三项未通过 | manifest 三项 + pages-demo 分包 |
| 分包 root 冲突 | `pages` → `pages-demo` 物理迁移 |
| 徽标/头像角标 MP 截断 | k-badge px 锚点 + avatar 外包 k-badge |
| APP min-height 100% | pull-refresh / list-scroll 条件编译 |

## 七、推荐工作流

```text
改组件/演示页
  → kit-ui-mp-weixin-compat（本技能，含分包与角标）
  → kit-ui-cross-platform-check
  → kit-ui-uts-app-compat（若动 .uts / ref / provide）
  → 全量编译 MP + APP
  → kit-ui-doc-sync（若改 API）
```
