# 图标配置生成脚本

这个脚本用于将 `k-icon.json` 文件转换为 `k-icon.uts` 配置文件，为 kit-ui 组件库提供图标支持。

## 🎯 主要特性

- **自动转换**：从 iconfont.json 自动生成 uni-app x 兼容的 UTS 配置文件
- **智能分类**：自动识别并分类 fill、line 和其他类型图标
- **排序优化**：按类型分组排序（fill → line → other），同类型内按字母排序
- **Unicode 映射**：生成完整的图标名称到 Unicode 字符映射关系
- **纯净命名**：只保留 JSON 中的原始图标名称，不生成前缀别名
- **精简结构**：只生成 ICON_UNICODE_MAP，避免冗余数据，减小文件体积
- **类型安全**：生成 TypeScript 类型定义，确保类型安全
- **增强函数**：提供丰富的辅助函数，支持图标查询、搜索、分类等操作

## 使用方法

### 通过 npm 脚本运行（推荐）

```bash
# 生成图标配置
npm run generate:icons
# 或者
npm run icons
```

### 直接运行脚本

```bash
node scripts/generate-icon-config.js
```

### 使用批处理脚本（Windows）

```bash
# 运行批处理脚本
scripts\generate-icons.bat
```

### 使用 PowerShell 脚本（推荐）

```powershell
# 运行 PowerShell 脚本
.\scripts\generate-icons.ps1

# 强制重新生成
.\scripts\generate-icons.ps1 -Force
```

## 工作流程

### 1. 准备图标文件

确保以下文件存在：
- `uni_modules/kit-ui/components/k-icon/fonts/k-icon.json`：源图标数据文件

### 2. 运行生成脚本

执行上述任一命令来生成配置文件。

### 3. 验证生成结果

脚本会生成：
- `uni_modules/kit-ui/components/k-icon/fonts/k-icon.uts`：图标配置文件

## 生成的文件结构

### k-icon.uts 文件内容

```typescript
// 图标 Unicode 映射表（按分类排序：fill → line → other）
export const ICON_UNICODE_MAP: UTSJSONObject = {
  'home-fill': '\ue001',
  'user-fill': '\ue003',
  // ... 所有 fill 类型图标
  'home-line': '\ue002',
  'user-line': '\ue004',
  // ... 所有 line 类型图标
  // ... 其他类型图标（如果有）
}

// 辅助函数（动态分析 ICON_UNICODE_MAP）
export function getIconUnicode(iconName: string): string | null
export function hasIcon(iconName: string): boolean
export function getAllIconNames(): string[]
export function getIconNamesByType(type: 'fill' | 'line' | 'other'): string[]
export function searchIcons(keyword: string, type?: 'fill' | 'line' | 'other'): string[]
export function getIconBaseName(iconName: string): string
export function getIconVariants(iconName: string): { fill: boolean, line: boolean }
```

### 🎯 优化说明

- **精简结构**：移除了 `FILL_ICON_NAMES`、`LINE_ICON_NAMES`、`OTHER_ICON_NAMES` 和 `ICON_NAMES` 数组
- **动态分析**：所有辅助函数现在基于 `ICON_UNICODE_MAP` 动态分析图标类型
- **减小体积**：避免重复数据，显著减小文件大小
- **保持功能**：所有原有功能完全保留，API 接口不变

## 图标命名规则

### 基础命名
- 使用小写字母和连字符
- 格式：`{name}-{type}`
- 示例：`home-fill`、`user-line`

### 图标类型
- **fill**：填充样式图标（实心）
- **line**：线条样式图标（空心）
- **other**：其他特殊样式图标

### 图标命名
脚本仅保留 JSON 文件中的原始图标名称：
- 原始名称：`home-fill`
- 不生成前缀别名（如 `kit-home-fill`、`icon-home-fill`）

## 使用示例

### 基础使用

```typescript
import { getIconUnicode, hasIcon } from '@/uni_modules/kit-ui/components/k-icon/fonts/k-icon.uts'

// 获取图标 Unicode
const homeIcon = getIconUnicode('home-fill') // '\ue001'

// 检查图标是否存在
const exists = hasIcon('home-fill') // true
```

### 分类查询

```typescript
import { getIconNamesByType, searchIcons } from '@/uni_modules/kit-ui/components/k-icon/fonts/k-icon.uts'

// 获取所有填充类型图标
const fillIcons = getIconNamesByType('fill')

// 搜索特定类型的图标
const homeIcons = searchIcons('home', 'fill')
```

### 变体检测

```typescript
import { getIconVariants, getIconBaseName } from '@/uni_modules/kit-ui/components/k-icon/fonts/k-icon.uts'

// 获取图标基础名称
const baseName = getIconBaseName('home-fill') // 'home'

// 检查图标变体
const variants = getIconVariants('home-fill')
// { fill: true, line: true }
```

## 配置选项

脚本支持以下配置（在脚本文件中修改）：

```javascript
// 文件路径配置
const JSON_FILE_PATH = '...' // 源 JSON 文件路径
const UTS_FILE_PATH = '...'   // 目标 UTS 文件路径
```

## 错误处理

脚本包含完善的错误处理机制：

- **文件不存在**：检查源文件是否存在
- **JSON 格式错误**：验证 JSON 文件格式
- **写入失败**：处理文件写入权限问题
- **数据验证**：确保图标数据完整性

## 生成统计

脚本运行后会显示详细统计信息：

```
📊 生成统计:
   原始图标数量: 464
   映射关系数量: 1392
   字体族名称: iconfont
   CSS 前缀: kit-

🎨 图标分类统计:
   Fill 类型: 234 个
   Line 类型: 230 个
   其他类型: 0 个
   Fill 示例: account-box-fill, account-circle-fill, advertisement-fill...
   Line 示例: account-box-line, account-circle-line, advertisement-line...
```

## 注意事项

1. **自动生成文件**：`k-icon.uts` 是自动生成的，请勿手动修改
2. **源文件更新**：当 `k-icon.json` 更新时，需要重新运行脚本
3. **版本控制**：建议将生成的 `k-icon.uts` 文件提交到版本控制系统
4. **性能考虑**：生成的文件包含大量图标数据，注意内存使用
5. **类型安全**：使用 TypeScript 时，充分利用生成的类型定义

## 更新日志

### v2.0.0
- ✨ 新增图标智能分类功能（fill/line/other）
- ✨ 新增按类型排序功能
- ✨ 新增分类图标数组导出
- ✨ 新增 `getIconNamesByType` 函数
- ✨ 新增 `searchIcons` 类型过滤参数
- ✨ 新增 `getIconBaseName` 函数
- ✨ 新增 `getIconVariants` 函数
- 📈 优化生成统计信息显示
- 📝 完善文档和注释

### v1.0.0
- 🎉 初始版本
- ✨ 基础图标配置生成功能
- ✨ Unicode 映射表生成
- ✨ 别名支持
- ✨ 基础辅助函数

## 贡献指南

如需修改或扩展脚本功能：

1. 修改 `scripts/generate-icon-config.js`
2. 测试脚本功能
3. 更新文档
4. 提交代码

## 技术支持

如遇到问题，请检查：

1. Node.js 版本是否兼容
2. 源文件路径是否正确
3. 文件权限是否充足
4. JSON 文件格式是否正确

更多技术支持，请参考项目文档或提交 Issue。