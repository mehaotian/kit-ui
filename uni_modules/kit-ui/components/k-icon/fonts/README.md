# 字体文件目录

此目录用于存放图标字体文件。

## 需要的文件

- `k-icons.ttf` - 主要图标字体文件（必需）
- `k-icons.woff` - Web 字体文件（可选，用于 H5 平台优化）
- `k-icons.woff2` - Web 字体文件（可选，用于 H5 平台优化）

## 字体文件获取方式

### 1. 使用 Iconfont
1. 访问 [iconfont.cn](https://www.iconfont.cn/)
2. 选择需要的图标并添加到项目
3. 下载字体文件
4. 将 `.ttf` 文件重命名为 `k-icons.ttf` 并放置在此目录

### 2. 使用 Fontello
1. 访问 [fontello.com](http://fontello.com/)
2. 选择图标并生成字体
3. 下载并提取字体文件
4. 重命名并放置在此目录

### 3. 自定义字体
如果您有自己的图标字体文件，请确保：
1. 文件格式为 `.ttf`
2. 文件名为 `k-icons.ttf`
3. 在 `config.uts` 中配置对应的 Unicode 映射

## 注意事项

- 字体文件较大，建议压缩后使用
- 确保字体文件的 Unicode 编码与 `config.uts` 中的配置一致
- 不同平台对字体文件的支持可能有差异，建议测试各平台兼容性

## 示例配置

在 `config.uts` 中配置图标映射：

```typescript
export const BUILTIN_ICONS: Record<string, string> = {
  'home': '\uE001',
  'user': '\uE002',
  'setting': '\uE003',
  'search': '\uE004',
  'heart': '\uE005',
  'star': '\uE006',
  // ... 更多图标
}
```

确保 Unicode 编码与字体文件中的图标对应。