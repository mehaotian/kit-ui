# k-icon 图标组件

用于展示图标的组件，支持内置图标、网络/本地图片，以及第三方 Iconify 图标。

## 基础用法

```vue
<k-icon name="account-box-fill" size="24" />
<k-icon name="settings-fill" size="24" color="primary" />
```

## 图标来源

### 内置图标

直接传入图标名称即可，完整列表见演示页「图标列表」。

```vue
<k-icon name="account-box-fill" size="24" />
<k-icon name="settings-fill" size="24" color="primary" />
```

### 图片图标

传入图片地址，支持网络图片和本地路径。

```vue
<k-icon name="https://example.com/icon.png" size="32" />
<k-icon name="/static/logo.png" size="32" />
```

### Iconify 图标

使用 `图标集:图标名` 格式，需联网加载。

```vue
<k-icon name="tabler:alarm-plus" size="32" />
<k-icon name="mdi:home" size="24" color="primary" />
```

## 尺寸

支持预设尺寸和自定义数值：

| 预设 | 大小 |
| --- | --- |
| xs | 12px |
| sm | 16px |
| md | 20px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

```vue
<k-icon name="account-box-fill" size="md" />
<k-icon name="account-box-fill" size="32" />
<k-icon name="account-box-fill" size="48px" />
```

## 颜色

支持主题色和自定义色值：

```vue
<k-icon name="account-box-fill" color="primary" />
<k-icon name="account-box-fill" color="success" />
<k-icon name="account-box-fill" color="warning" />
<k-icon name="account-box-fill" color="danger" />
<k-icon name="account-box-fill" color="info" />
<k-icon name="account-box-fill" color="#6366f1" />
```

可选主题色：`primary`、`success`、`warning`、`danger`、`info`、`text`、`text-secondary`、`text-placeholder`。

## 加载与旋转

```vue
<k-icon name="settings-line" loading />
<k-icon name="donut-chart-line" spin />
<k-icon name="settings-line" :spin-speed="3000" loading />
<k-icon name="donut-chart-line" :spin-reverse="true" spin />
<k-icon name="settings-fill" :loading="isLoading" />
```

## 禁用与点击

```vue
<k-icon name="settings-fill" disabled @click="onClick" />
<k-icon name="volume-up-line" size="24" @click="onClick" />
```

## 自定义样式

通过 `custom-style` 传入行内样式字符串：

```vue
<k-icon
  name="mic-line"
  size="32"
  color="#ff6b6b"
  custom-style="border: 2px solid #ff6b6b; border-radius: 100px; padding: 8px;"
/>
```

## 自定义字体

通过 `prefix` 追加 CSS 类名，配合自定义 iconfont 使用：

```vue
<k-icon name="account-box-fill" size="24" prefix="my-icon-font" />
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | String | '' | 图标名称、图片地址，或 Iconify 名称（`collection:name`） |
| size | String | '' | 图标尺寸，支持预设（xs/sm/md 等）或数值（如 `32`、`48px`） |
| color | String | '' | 图标颜色，支持主题色和 `#hex`、`rgb()` 等 |
| prefix | String | '' | 追加到字体图标的 CSS 类名 |
| custom-style | String | '' | 自定义行内样式 |
| disabled | Boolean | false | 是否禁用，禁用后无法触发点击 |
| loading | Boolean | false | 是否显示加载旋转 |
| spin | Boolean | false | 是否持续旋转 |
| spin-speed | Number | 1000 | 旋转一圈耗时（毫秒） |
| spin-reverse | Boolean | false | 是否反向旋转 |

## 组件事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击图标时触发 | event |
| load | 图片或 Iconify 图标加载成功时触发 | - |
| error | 图片或 Iconify 图标加载失败时触发 | error |

## 使用注意

1. **内置图标改色**：设置 `color` 即可，支持主题色和自定义色值。
2. **Iconify 图标改色**：设置 `color` 可改单色图标颜色；彩色图标无法改色。
3. **图片图标**：不支持通过 `color` 改色。
4. **Iconify 格式**：必须为 `图标集:图标名`（如 `mdi:home`），本地 `.svg` 文件路径会被当作普通图片处理。
5. **网络要求**：Iconify 图标和图片地址需能正常访问网络资源。
6. **点击限制**：`disabled` 或 `loading` 为 `true` 时，不会触发 `click` 事件。
7. **自定义样式**：`custom-style` 仅支持字符串写法。

## 演示页

- 图标示例：演示各属性与事件
- 图标列表：浏览全部内置图标名称
