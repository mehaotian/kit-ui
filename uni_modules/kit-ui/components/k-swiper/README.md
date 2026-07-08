# k-swiper 轮播

场景化轮播组件：在原生 `swiper` 之上提供 **数据驱动 Banner**、**mode 场景预设**、**自绘指示器** 与 **图片项封装**，减少重复样板代码。

> v1.1 定位：**不是**原生 prop 透传改名，而是「一行 Banner + 主题指示器 + k-image 集成 + 跨端补丁内置」。详见下文「核心优势」。

---

## 核心优势（相对原生 swiper）

### 1. 少写代码：一行 Banner

原生要写 `swiper` + 多个 `swiper-item` + `image` + 指示器样式 + `autoplay/circular` 组合；k-swiper 用 **`list` + `mode="banner"`** 即可。

```vue
<!-- 原生：约 20+ 行 -->
<swiper :current="current" :autoplay="true" :circular="true" indicator-dots ...>
  <swiper-item v-for="item in list" :key="item.id">
    <image :src="item.image" mode="aspectFill" />
    <view class="overlay">...</view>
  </swiper-item>
</swiper>

<!-- k-swiper：1 行 -->
<k-swiper mode="banner" :list="list" @click="onBanner" />
```

### 2. 场景预设：换 mode 即换布局

| 业务场景 | 用法 | 自动获得 |
| --- | --- | --- |
| 活动 Banner | `mode="banner"` | 全幅图 + 标题浮层 + 自动播放 + 长条指示器 |
| 商品卡片横滑 | `mode="card"` | 白底卡片 + 阴影 + 相邻项露出 + 指示器在下方 |
| 公告 / 消息 | `mode="vertical"` | 纵向滑动 + 圆点指示器 |
| 通用手动轮播 | `mode="default"` | 圆点指示器 + 手动滑动 |

显式 props（如 `:autoplay="false"`）可覆盖 mode 默认值，不必记 6～8 个 prop 组合。

### 3. 指示器超出原生能力

| 类型 | 说明 |
| --- | --- |
| `dot` | 原生圆点，自动跟主题主色 |
| `line` | 自绘长条指示器（Banner / 卡片常用） |
| `number` | 右下角 `1/3` 分页 |
| `none` | 无指示器 |

### 4. 数据驱动 + 字段灵活

- `list` 支持 **对象数组** `{ image, title, desc }` 或 **纯 `string[]` 图片 URL**
- `imageKey` / `titleKey` / `descKey` 适配业务字段名（如 `cover`、`name`）
- `@click="(index, item)"` 直接拿索引与原始数据，适合跳转详情

### 5. 图片与浮层内置

- `k-swiper-item` 的 `image` / `title` / `desc` 内置 **k-image**（占位、加载态）与 **渐变标题浮层**
- Banner 与 Card **布局不同**（全幅浮层 vs 白底卡片），由 `mode` 切换，无需业务侧写两套 CSS

### 6. 主题与 kit-ui 体系一致

- 指示器激活色默认 `--k-color-primary`（`#6366f1`）
- 圆角、高度等走 `--k-*` 变量，与全库视觉统一

### 7. 跨端补丁内置（业务无感）

| 端 | k-swiper 内置处理 |
| --- | --- |
| 微信小程序 | `list` 模式走原生 `swiper-item` 直子节点，避免滑不动 |
| APP | autoplay 切换重建 swiper、浮层实色兜底 |
| WEB | `pause-on-hover` 悬停暂停自动播放 |

业务侧 **统一写 `:list`**，不必为各端分别处理 swiper 结构。详见 `docs/k-swiper跨端实现说明.md`。

### 8. 交互能力补齐

| 能力 | API |
| --- | --- |
| 双向绑定 | `v-model` 当前索引 |
| 外部切屏 | `ref.prev()` / `ref.next()` |
| 禁止手势 | `disable-touch`（配合按钮切屏） |
| 事件溯源 | `change(current, source)`，`source` 区分 `touch` / `autoplay` / `programmatic` |

### 什么时候仍用原生 swiper？

- 极度自定义的 3D / 视差 / 视频轮播
- 微信小程序下必须用 slot 且布局无法改为 `list`（需在页面层写原生 `swiper`）

---

## 一行 Banner（推荐）

```vue
<k-swiper mode="banner" :list="banners" @click="onBanner" />
```

```uts
const banners = [
  { image: 'https://example.com/1.jpg', title: '春季上新', desc: '全场 8 折' },
  { image: 'https://example.com/2.jpg', title: '会员日', desc: '积分翻倍' }
]
```

`mode="banner"` 自动启用：自动播放、衔接滑动、160px 高度、长条指示器。

## 卡片轮播

```vue
<k-swiper mode="card" :list="banners" />
```

预设 `previousMargin` / `nextMargin` / `radius`，露出相邻卡片。

## k-swiper 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue / v-model | number | `0` | 当前索引 |
| mode | string | `default` | `default` / `banner` / `card` / `vertical` |
| list | array | `null` | 数据驱动；有值时自动生成 item |
| imageKey | string | `image` | list 项图片字段 |
| titleKey | string | `title` | list 项标题字段 |
| descKey | string | `desc` | list 项描述字段 |
| itemCount | number | `0` | slot 模式下自定义指示器数量 |
| autoplay | boolean | `null` | `null` 表示跟随 mode 预设 |
| interval | number | `3000` | 自动切换间隔 ms |
| duration | number | `500` | 动画时长 ms |
| circular | boolean | `null` | `null` 表示跟随 mode 预设 |
| vertical | boolean | `null` | `null` 表示跟随 mode 预设 |
| indicatorType | string | `''` | `dot` / `line` / `number` / `none`；空则跟随 mode |
| indicatorColor | string | `''` | 原生圆点颜色 |
| indicatorActiveColor | string | `''` | 激活色，空则主题主色 |
| height | string | `''` | 高度，空则跟随 mode |
| radius | string | `''` | 圆角，空则跟随 mode |
| disableTouch | boolean | `false` | 禁止手势 |
| previousMargin | string | `''` | 前边距，空则跟随 mode |
| nextMargin | string | `''` | 后边距，空则跟随 mode |
| displayMultipleItems | number | `1` | 同屏显示项数 |
| easingFunction | string | `default` | 缓动类型 |
| pauseOnHover | boolean | `true` | WEB 悬停暂停自动播放 |
| customStyle | string | `''` | 根节点样式 |
| customClass | string | `''` | 根节点类名 |

### mode 预设

| mode | 视觉 | 预设行为 |
| --- | --- | --- |
| `banner` | **全幅贴边** + 底部渐变标题浮层 | autoplay + circular + line 指示器叠在图上 |
| `card` | **白底卡片** + 阴影 + 图在上/文在下 + 相邻项露出 | 52px 边距 + 指示器在卡片下方 |
| `vertical` | 纵向滑动 | 180px + dot 指示器 |
| `default` | 与 banner 类似，手动滑动 | dot 指示器 |

显式 props 优先于 mode（如 `:autoplay="false"` 覆盖 banner 默认）。

## k-swiper 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | v-model | `current` |
| change | 索引变化 | `current, source` |
| animationfinish | 动画结束 | `current, source` |
| click | 点击项（list 模式） | `index, item` |

`source` 常见值：`touch`、`autoplay`、`programmatic`（`prev()` / `next()` 触发）。

## k-swiper 方法（ref）

| 方法 | 说明 |
| --- | --- |
| prev() | 上一屏（更新 `:current`，`change` 的 source 为 `programmatic`） |
| next() | 下一屏 |

## k-swiper 插槽

| 插槽 | 说明 |
| --- | --- |
| default | `k-swiper-item`（无 list 时；**MP 不可用**） |
| indicator | 完全自定义指示器（**v1.1 预留，二期**） |

## k-swiper-item 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| index | number | `-1` | 项索引（card 非激活态弱化） |
| image | string | `''` | 图片地址，内置 k-image aspectFill |
| title | string | `''` | 底部标题浮层 |
| desc | string | `''` | 底部描述浮层 |
| imageRadius | string | `0px` | 图片圆角 |
| customStyle | string | `''` | 项样式 |
| customClass | string | `''` | 项类名 |

## k-swiper-item 插槽

| 插槽 | 说明 |
| --- | --- |
| default | 无 image 时的自定义内容 |

## 与原生 swiper 的差异（速查）

| 能力 | 原生 swiper | k-swiper |
| --- | --- | --- |
| Banner 数据驱动 | v-for + 手写 image + 指示器 | `list` + `mode="banner"` 一行 |
| Banner vs 卡片布局 | 同一套 markup + 自写 CSS | `mode` 切换（浮层 / 白底卡片） |
| 指示器 | 仅圆点 | `line` / `number` / `dot` / `none` |
| 主题色 | 手动写 `indicator-active-color` | 自动 `--k-color-primary` |
| 图片项 | 每页 `<image>` + 浮层 DOM | `image` / `title` / `desc` prop |
| 场景参数 | 记 autoplay/circular/margin 组合 | `mode` 预设，props 可覆盖 |
| 点击回调 | 自行在 item 上绑事件 | `@click="(index, item)"` |
| 外部切屏 | 手动改 `:current` | `ref.prev()` / `ref.next()` |
| 跨端结构 | 业务自行处理 MP slot 限制 | `list` 模式内置 MP/APP 补丁 |
| 滑动引擎 | 原生 | **仍是原生**（性能不降级） |

## 注意事项

- `list` 与 default slot **二选一**；有 `list` 时忽略 slot。
- **微信小程序**：须用 `:list` 数据驱动；slot / `k-swiper-item` 子组件不可用（见 `docs/k-swiper跨端实现说明.md`）。
- slot + `indicator-type="line"` / `number` 需设置 `item-count`（WEB / APP）。
- `list` 项可为 `string`（纯图片 URL）或 `{ image, title, desc }` 对象。
- 底层仍为原生 `swiper`，手势与性能与原生一致。

## 演示与文档

- 演示页：`pages-demo/swiper/swiper.uvue`
- 产品价值：`docs/k-swiper产品价值说明.md`
- 开发计划：`docs/k-swiper开发计划.md`
- 跨端说明：`docs/k-swiper跨端实现说明.md`
