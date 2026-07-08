# k-swiper 三端冒烟验收清单

> 版本：v1.1  
> 日期：2026-06-30  
> 状态：**已验收**  
> 关联：`pages-demo/swiper/swiper.uvue`、`docs/k-swiper开发计划.md`

---

## 1. 验收环境

| 端 | 版本 / 设备 | 验收人 | 日期 |
| --- | --- | --- | --- |
| WEB | HBuilderX / 浏览器 | — | 2026-06-30 |
| APP | iOS / Android 模拟器或真机 | — | 2026-06-30 |
| MP-WEIXIN | 微信开发者工具 | — | 2026-06-30 |

---

## 2. 核心价值（v1.1）

| # | 用例 | WEB | APP | MP | 备注 |
| --- | --- | --- | --- | --- | --- |
| S-01 | `mode="banner"` + `list` 一行 Banner | ✅ | ✅ | ✅ | 自动播放 + 长条指示器 |
| S-02 | `mode="card"` 卡片边距 | ✅ | ✅ | ✅ | 相邻项可见 |
| S-03 | `indicator-type="number"` | ✅ | ✅ | ✅ | 右下角 1/3 |
| S-04 | list 项 image/title/desc | ✅ | ✅ | ✅ | k-image 正常加载 |
| S-05 | `@click` 返回 index + item | ✅ | ✅ | ✅ | toast 显示标题 |
| S-06 | slot + `item-count` + line（WEB/APP） | ✅ | ✅ | N/A | MP 改用 list |
| S-07 | `ref.prev()` / `next()` | ✅ | ✅ | ✅ | disableTouch 场景 |
| S-08 | WEB `pause-on-hover` | ✅ | — | — | 悬停暂停自动播放 |

---

## 3. 基础能力

| # | 用例 | WEB | APP | MP | 备注 |
| --- | --- | --- | --- | --- | --- |
| S-09 | v-model 索引同步 | ✅ | ✅ | ✅ | |
| S-10 | 单屏 `indicator-type="none"` | ✅ | ✅ | ✅ | |
| S-11 | 主题指示器激活色 | ✅ | ✅ | ✅ | 主色 #6366f1 |

---

## 4. 规范

| # | 用例 | WEB | APP | MP | 备注 |
| --- | --- | --- | --- | --- | --- |
| S-12 | 无 grid / gap / @media | ✅ | ✅ | ✅ | 代码审查 |
| S-13 | README / 跨端说明与实现一致 | ✅ | ✅ | ✅ | |
| S-14 | 首页入口可跳转 | ✅ | ✅ | ✅ | |

---

## 5. 已知限制

| 项 | 说明 |
| --- | --- |
| MP slot | 不可用，请用 `:list` |
| slot + line/number | WEB/APP 需 `item-count` |
| list 与 slot | 二选一，list 优先 |
| `#indicator` slot | v1.1 预留，二期 |

---

## 6. 验收结论

- [x] 三端冒烟通过
- [x] 可标记 v1.1 已验收
