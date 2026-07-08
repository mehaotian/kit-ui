# k-swiper / k-swiper-item 开发计划

> 版本：v1.1  
> 日期：2026-06-30  
> 状态：**v1.1 已验收**  
> 关联：`docs/一期下一步开发计划.md` §4

---

## 1. 定位（修订）

### 1.1 核心优势（v1.1 产品价值）

完整说明见 `uni_modules/kit-ui/components/k-swiper/README.md` §核心优势。摘要：

| 维度 | 原生 swiper | k-swiper 优势 |
| --- | --- | --- |
| 开发效率 | 多文件样板：item + image + 指示器 + 样式 | **`list` + `mode` 一行 Banner** |
| 场景切换 | 换布局要改 markup + CSS | **`mode="banner/card/vertical"`** 换预设即可 |
| 指示器 | 仅圆点 | **line / number 自绘** + 主题色 |
| 数据层 | 自行 v-for、解析字段 | **list 驱动** + 自定义 `*Key` + `@click(index, item)` |
| 图片体验 | 原生 image，无统一占位 | **k-image 集成** + 标题浮层 |
| 跨端 | MP slot 限制需业务自查 | **内置 MP 原生项 / APP 补丁** |
| 性能 | 原生引擎 | **同样原生引擎**，不重复造轮子 |

### 1.2 为什么要做 k-swiper

**不是**原生 prop 透传改名；**是**在原生 `swiper` 之上提供 kit-ui 独有能力：

| 痛点 | k-swiper 解法 |
| --- | --- |
| Banner 每次 v-for + image + 指示器样式 | `list` + `mode="banner"` 一行 |
| Banner 与卡片轮播混用同一 markup | **`mode` 切换布局**：banner 全幅浮层 / card 白底卡片+阴影 |
| 记不住 autoplay/circular/margin 组合 | `mode` 场景预设 |
| 原生仅圆点指示器 | `indicator-type="line"` / `number` 自绘 |
| 图片轮播重复写 image 标签 | `k-swiper-item` 的 `image` + 标题浮层 |
| 主题色不统一 | 指示器自动跟 `--k-color-primary` |
| 微信 slot 滑不动、APP autoplay 异常 | 组件内跨端补丁，业务统一用 `list` |

### 1.3 设计原则

| 原则 | 说明 |
| --- | --- |
| 原生为引擎 | 手势/性能仍靠 `<swiper>`，不重写滑动 |
| 数据驱动优先 | 80% Banner 场景用 `list`，复杂布局才用 slot |
| 显式 props 覆盖 mode | `autoplay: null` 表示跟随 mode |
| 组件要有存在理由 | 若与原生等价则不做（见产品决策 2026-06-30） |

---

## 2. 组件结构

```text
k-swiper (components/k-swiper/k-swiper.uvue)
├── swiper（原生引擎）
│   ├── [MP + list] swiper-item × N → k-swiper-item-body
│   ├── [非 MP + list] k-swiper-item × N
│   └── [非 MP + slot] k-swiper-item × N（业务传入）
├── k-swiper-line-indicator（line 自绘指示器）
├── 数字指示器 overlay
└── swiper-utils.uts（mode 预设、list 解析、MP 门禁）

k-swiper-item (components/k-swiper-item/k-swiper-item.uvue)
└── swiper-item → k-swiper-item-body

k-swiper-item-body (components/k-swiper-item-body/k-swiper-item-body.uvue)
└── k-image + 标题浮层 / card 布局 / default slot
```

跨端细节见 `docs/k-swiper跨端实现说明.md`。

---

## 3. v1.1 能力清单

| 能力 | API | 状态 |
| --- | --- | --- |
| 数据驱动 | `list` + `imageKey` / `titleKey` / `descKey` | ✅ |
| 场景预设 | `mode="banner"` / `card` / `vertical` | ✅ |
| 自绘指示器 | `indicator-type="line"` / `number` / `dot` / `none` | ✅ |
| 图片项 | `k-swiper-item` `image` / `title` / `desc` | ✅ |
| 点击事件 | `@click="(index, item)"` | ✅ |
| WEB 悬停暂停 | `pause-on-hover` | ✅ |
| 外部切屏 | `ref.prev()` / `ref.next()` | ✅ |
| slot 指示器数量 | `item-count` | ✅ |
| MP list 原生项 | 条件编译 `swiper-item` | ✅ |

---

## 4. 一期非目标

- 3D / 视差轮播
- 视频轮播专项
- `#indicator` slot 完全自定义（二期）
- 与 k-tabs swipeable 联动（tabs 二期）

---

## 5. DoD

- [x] v1.1 核心 API 实现
- [x] demo 覆盖 mode / 指示器 / list / autoplay / 交互 / 边界
- [x] README 与跨端说明
- [x] 三端冒烟：`docs/k-swiper三端冒烟验收清单.md`

---

## 6. 相关文档

| 文档 | 用途 |
| --- | --- |
| `docs/k-swiper产品价值说明.md` | **产品价值与选型** |
| `uni_modules/kit-ui/components/k-swiper/README.md` | 产品价值 + 组件 API |
| `docs/k-swiper跨端实现说明.md` | MP / APP 差异 |
| `docs/k-swiper三端冒烟验收清单.md` | 验收 |
