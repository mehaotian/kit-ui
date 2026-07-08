# k-swiper 产品价值说明

> 版本：v1.1  
> 日期：2026-07-08  
> 状态：已验收  
> API 详表：`uni_modules/kit-ui/components/k-swiper/README.md`

---

## 1. 一句话定位

**k-swiper = 原生 swiper 的滑动引擎 + kit-ui 的场景化封装层。**

不重写手势与性能，解决的是：**Banner / 卡片 / 公告轮播的重复样板代码、指示器样式、跨端结构差异**。

---

## 2. 八大优势

### ① 开发效率：一行 Banner

```vue
<k-swiper mode="banner" :list="banners" @click="onBanner" />
```

等价于原生侧：`swiper` + N 个 `swiper-item` + `image` + 浮层 + 指示器 + autoplay/circular 配置。

### ② 场景预设：mode 即产品语义

| mode | 典型页面 | 预设行为 |
| --- | --- | --- |
| `banner` | 首页活动、秒杀 | 自动播放、衔接、长条指示器、全幅浮层 |
| `card` | 商品横滑、推荐位 | 卡片阴影、相邻露出、指示器在下方 |
| `vertical` | 系统通知、滚动公告 | 纵向、圆点 |
| `default` | 通用图集 | 手动滑动、圆点 |

### ③ 指示器：dot / line / number / none

原生仅支持圆点；k-swiper 提供 **长条** 与 **数字分页**，并统一主题色。

### ④ 数据驱动

- 对象数组或 `string[]` 图片 URL
- `imageKey` / `titleKey` / `descKey` 映射业务字段
- `@click(index, item)` 适合列表跳转

### ⑤ 图片与布局内置

- k-image：占位、加载、错误态
- Banner：底部渐变标题
- Card：白底 + 图在上 / 文在下（与 Banner 不是简单 margin 区别）

### ⑥ 主题体系

指示器、圆角等与 kit-ui `--k-*` 变量一致，无需每页写 `#6366f1`。

### ⑦ 跨端无感

| 端 | 业务写法 | 组件内部 |
| --- | --- | --- |
| WEB | `:list` | 标准 k-swiper-item |
| APP | `:list` | autoplay 切换重建、浮层兜底 |
| 微信小程序 | `:list` | 原生 swiper-item 直子节点 |

业务 **不必** 为 MP 单独写一套 swiper 结构。

### ⑧ 交互 API 完整

`v-model`、`ref.prev()/next()`、`disable-touch`、`change` 的 `source` 区分手势 / 自动播放 / 编程切屏。

---

## 3. 与薄封装的区别（v1 → v1.1）

| 版本 | 能力 | 业务感受 |
| --- | --- | --- |
| v1 薄封装 | prop 透传 + 主题圆点 | 「和原生差不多」 |
| **v1.1** | list + mode + 自绘指示器 + 布局预设 + 跨端补丁 | 「一行 Banner、换 mode 换场景」 |

---

## 4. 不适用场景（仍用原生）

- 3D / 视差 / 视频流轮播
- 微信小程序下强依赖 slot 且无法改为 `list` 的极端自定义结构

---

## 5. 相关文档

- API 与示例：`uni_modules/kit-ui/components/k-swiper/README.md`
- 跨端实现：`docs/k-swiper跨端实现说明.md`
- 开发计划：`docs/k-swiper开发计划.md`
