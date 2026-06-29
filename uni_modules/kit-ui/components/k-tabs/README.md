# k-tabs 标签页

页内分区切换：Tab 导航头由 `k-tabs` 统一渲染，内容区由 `k-tab-pane` 承载。

## 基础用法

```vue
<k-tabs v-model="active">
  <k-tab-pane name="a" title="标签 A">内容 A</k-tab-pane>
  <k-tab-pane name="b" title="标签 B">内容 B</k-tab-pane>
</k-tabs>
```

默认 `value-type="name"`，请为每个 pane 设置唯一 `name`。

## k-tabs 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue / v-model | string \| number | `''` | 当前激活项 |
| valueType | string | `name` | `name` 或 `index` |
| type | string | `line` | `line` / `card` / `button` |
| size | string | `medium` | `small` / `medium` / `large` |
| animated | boolean | `true` | 指示器 / 轨道过渡动画 |
| stretch | boolean | `false` | 均分宽度（非 scrollable 时） |
| scrollable | boolean | `false` | 横向滚动导航 |
| lazy | boolean | `false` | 懒渲染未访问面板 |
| destroyOnHide | boolean | `false` | 隐藏时销毁内容（配合 lazy） |
| swipeThreshold | number | `5` | 超过数量自动 scrollable |
| duration | number | `300` | 动画时长 ms |
| lineWidth | string | `''` | line 指示器宽度；空则按内容区宽度自适应（约 94%） |
| lineHeight | string | `2px` | line 指示器高度 |
| activeColor | string | `''` | 激活色 |
| inactiveColor | string | `''` | 未激活文字色 |
| background | string | `''` | 导航区背景 |
| beforeChange | function | — | `(name, index) => boolean`，`false` 拦截 |
| disabled | boolean | `false` | 整组禁用 |
| customStyle | string | `''` | 根节点样式 |
| customClass | string | `''` | 根节点类名 |

## k-tabs 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | v-model | `value` |
| change | 切换完成 | `name, index` |
| click | 点击 Tab 头 | `name, index` |

## k-tabs 插槽

| 插槽 | 说明 |
| --- | --- |
| default | `k-tab-pane` |
| nav-left | 导航左侧附加区 |
| nav-right | 导航右侧附加区 |

## k-tab-pane 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | string \| number | `''` | 唯一标识，空则用索引 |
| title | string | `''` | Tab 头文案 |
| disabled | boolean | `false` | 禁用 |
| dot | boolean | `false` | 红点 |
| badge | string \| number | `''` | 徽标 |
| icon | string | `''` | 标题前图标（一期替代 label slot） |
| lazy | boolean | — | 未传则继承父级 `lazy` |
| customStyle | string | `''` | 内容区样式 |

## k-tab-pane 插槽

| 插槽 | 说明 |
| --- | --- |
| default | 面板内容 |

> 自定义 `label` slot 一期未实现，可用 `icon` + `title` 组合。

## 视觉说明

- **line**：默认；非 stretch 时激活项底边；`stretch` 时底部滑动指示器
- **card**：浅底轨道 + 激活白底卡片
- **button**：胶囊轨道 + 激活浅主色底 + 主色字

## 主题变量

| 变量 | 说明 |
| --- | --- |
| `--k-tabs-nav-height` | 导航高度 |
| `--k-tabs-active-color` | 激活色 |
| `--k-tabs-inactive-color` | 未激活文字色 |
| `--k-tabs-nav-bg` | 导航背景 |
| `--k-tabs-button-indicator-bg` | button 型轨道浅底色 |
| `--k-tabs-content-padding` | 内容区 padding |

## 组件结构

```text
k-tabs                 状态、测量调度、provide
k-tabs-nav-body        滚动容器（scroll-view 与 nav-wrap 编排）
k-tabs-nav-wrap        导航 DOM、Tab 项、指示器（跨端 query / 样式落地）
k-tab-pane             面板注册与 lazy 挂载
```

相关工具：`tab-indicator.uts`（几何）、`tabs-layout.uts`（selectorQuery）、`tabs-style.uts`（样式变量与类名）。

## 注意事项

1. `value-type="name"` 时请勿混用未设 `name` 的 pane 与字符串 name 随意切换逻辑。
2. 非法 `v-model`（无对应 pane）会在布局同步时自动回退到首项。
3. 面板内嵌 `scroll-view` 时需注意与页面滚动协调，见演示页注释。
4. APP 端 line / card / button 指示器动画走 `setProperty`；`k-tabs-nav-wrap` 通过 inject 向父级注册指示器 DOM ref 与 query 作用域。
