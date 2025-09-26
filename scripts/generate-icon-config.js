/**
 * 图标配置生成脚本
 * 用于将 k-icon.json 文件转换为 k-icon.uts 配置文件
 * 
 * 使用方法:
 * node scripts/generate-icon-config.js
 */

const fs = require('fs')
const path = require('path')

// 文件路径配置
const JSON_FILE_PATH = path.join(__dirname, '../uni_modules/kit-ui/components/k-icon/fonts/k-icon.json')
const UTS_FILE_PATH = path.join(__dirname, '../uni_modules/kit-ui/components/k-icon/fonts/k-icon.uts')

/**
 * 读取 JSON 文件
 */
function readIconJson() {
	try {
		const jsonContent = fs.readFileSync(JSON_FILE_PATH, 'utf8')
		return JSON.parse(jsonContent)
	} catch (error) {
		console.error('读取 JSON 文件失败:', error.message)
		process.exit(1)
	}
}

/**
 * 图标分类和排序函数
 */
function categorizeAndSortIcons(glyphs) {
	const categories = {
		fill: [],
		line: [],
		other: []
	}

	// 按类型分类
	glyphs.forEach(glyph => {
		const { font_class } = glyph
		if (font_class.endsWith('-fill')) {
			categories.fill.push(glyph)
		} else if (font_class.endsWith('-line')) {
			categories.line.push(glyph)
		} else {
			categories.other.push(glyph)
		}
	})

	// 对每个分类进行排序
	const sortByName = (a, b) => a.font_class.localeCompare(b.font_class)
	categories.fill.sort(sortByName)
	categories.line.sort(sortByName)
	categories.other.sort(sortByName)

	return categories
}

/**
 * 生成 Unicode 映射表
 */
function generateUnicodeMap(iconData) {
	const unicodeMap = {}

	if (!iconData.glyphs || !Array.isArray(iconData.glyphs)) {
		console.error('JSON 文件格式错误: 缺少 glyphs 数组')
		process.exit(1)
	}

	// 先分类排序
	const categories = categorizeAndSortIcons(iconData.glyphs)

	// 按分类顺序处理图标：fill -> line -> other
	const sortedGlyphs = [...categories.fill, ...categories.line, ...categories.other]

	sortedGlyphs.forEach(glyph => {
		const { name, font_class, unicode } = glyph
		const unicodeChar = `\\u${unicode}`

		// 使用 font_class 作为主键
		if (font_class) {
			unicodeMap[font_class] = unicodeChar
		}

		// 如果 name 与 font_class 不同，也添加 name 作为别名
		if (name && name !== font_class) {
			unicodeMap[name] = unicodeChar
		}
	})

	return { unicodeMap, categories }
}

/**
 * 生成辅助函数
 */
function generateHelperFunctions() {
	return `// 辅助函数

/**
 * 获取图标的 Unicode 字符
 * @param iconName 图标名称
 * @returns Unicode 字符或 null
 */
export function getIconUnicode(iconName: string): string | null {
  return ICON_UNICODE_MAP[iconName] as string ?? null
}

/**
 * 检查图标是否存在
 * @param iconName 图标名称
 * @returns 是否存在
 */
export function hasIcon(iconName: string): boolean {
  return iconName in ICON_UNICODE_MAP
}

/**
 * 获取所有图标名称
 * @returns 图标名称数组
 */
export function getAllIconNames(): string[] {
  return UTSJSONObject.keys(ICON_UNICODE_MAP)
}

/**
 * 根据类型获取图标名称
 * @param type 图标类型 ('fill' | 'line' | 'other')
 * @returns 图标名称数组
 */
export function getIconNamesByType(type: 'fill' | 'line' | 'other'): string[] {
  const allNames = UTSJSONObject.keys(ICON_UNICODE_MAP)
  
  switch (type) {
    case 'fill':
      return allNames.filter(name => name.endsWith('-fill')).sort()
    case 'line':
      return allNames.filter(name => name.endsWith('-line')).sort()
    case 'other':
      return allNames.filter(name => !name.endsWith('-fill') && !name.endsWith('-line')).sort()
    default:
      return []
  }
}

/**
 * 搜索图标
 * @param keyword 关键词
 * @returns 匹配的图标名称数组
 */
export function searchIcons(keyword: string): string[] {
  if (keyword != '') return []
  
  const lowerKeyword = keyword.toLowerCase()
  return UTSJSONObject.keys(ICON_UNICODE_MAP)
    .filter(name => name.toLowerCase().includes(lowerKeyword))
    .sort()
}

/**
 * 获取图标的基础名称（去除 -fill 或 -line 后缀）
 * @param iconName 图标名称
 * @returns 基础名称
 */
export function getIconBaseName(iconName: string): string {
  return iconName.replace(/-(fill|line)$/, '')
}

/**
 * 获取图标的所有变体（fill 和 line 版本）
 * @param baseName 基础名称
 * @returns 变体数组
 */
export function getIconVariants(baseName: string): string[] {
  const variants: string[] = []
  const fillName = \`\${baseName}-fill\`
  const lineName = \`\${baseName}-line\`
  
  if (hasIcon(fillName)) variants.push(fillName)
  if (hasIcon(lineName)) variants.push(lineName)
  if (hasIcon(baseName)) variants.push(baseName)
  
  return variants
}
`
}

/**
 * 生成 UTS 文件内容
 */
function generateUtsContent(iconData, { unicodeMap, categories }) {
	const { name, font_family, css_prefix_text, description } = iconData

	// 生成文件头部注释
	const header = `/**
 * ${name || 'k-icon'} 图标映射配置
 * ${description || '基于 iconfont.json 生成的图标 Unicode 映射关系'}
 * 字体文件：iconfont.ttf
 * 字体族：${font_family || 'iconfont'}
 * CSS 前缀：${css_prefix_text || 'kit-'}
 * 
 * 图标分类统计：
 * - Fill 类型：${categories.fill.length} 个
 * - Line 类型：${categories.line.length} 个
 * - 其他类型：${categories.other.length} 个
 * 
 * 自动生成文件，请勿手动修改
 * 生成时间：${new Date().toLocaleString('zh-CN')}
 */\n\n`

	// 生成 Unicode 映射表（按分类排序：fill -> line -> other）
	const mapEntries = Object.entries(unicodeMap)
		.sort(([a], [b]) => {
			// 按类型分组排序：fill -> line -> other
			const getTypeOrder = (name) => {
				if (name.endsWith('-fill')) return 0
				if (name.endsWith('-line')) return 1
				return 2
			}

			const typeOrderA = getTypeOrder(a)
			const typeOrderB = getTypeOrder(b)

			if (typeOrderA !== typeOrderB) {
				return typeOrderA - typeOrderB
			}

			// 同类型内按字母排序
			return a.localeCompare(b)
		})
		.map(([key, value]) => `  '${key}': '${value}'`)
		.join(',\n')

	const unicodeMapContent = `// 图标 Unicode 映射表\nexport const ICON_UNICODE_MAP: UTSJSONObject = {\n${mapEntries}\n}\n\n`

	// 生成辅助函数
	const helperFunctions = generateHelperFunctions()

	return header + unicodeMapContent + helperFunctions
}

/**
 * 写入 UTS 文件
 */
function writeUtsFile(content) {
	try {
		// 确保目录存在
		const dir = path.dirname(UTS_FILE_PATH)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		fs.writeFileSync(UTS_FILE_PATH, content, 'utf8')
		console.log('✅ UTS 文件生成成功:', UTS_FILE_PATH)
	} catch (error) {
		console.error('❌ 写入 UTS 文件失败:', error.message)
		process.exit(1)
	}
}

/**
 * 生成统计信息
 */
function generateStats(iconData, { unicodeMap, categories }) {
	const totalIcons = iconData.glyphs ? iconData.glyphs.length : 0
	const totalMappings = Object.keys(unicodeMap).length

	console.log('\n📊 生成统计:')
	console.log(`   原始图标数量: ${totalIcons}`)
	console.log(`   映射关系数量: ${totalMappings}`)
	console.log(`   字体族名称: ${iconData.font_family || 'iconfont'}`)
	console.log(`   CSS 前缀: ${iconData.css_prefix_text || 'kit-'}`)
	console.log('\n🎨 图标分类统计:')
	console.log(`   Fill 类型: ${categories.fill.length} 个`)
	console.log(`   Line 类型: ${categories.line.length} 个`)
	console.log(`   其他类型: ${categories.other.length} 个`)

	// 显示一些示例
	if (categories.fill.length > 0) {
		const fillExamples = categories.fill.slice(0, 3).map(g => g.font_class).join(', ')
		console.log(`   Fill 示例: ${fillExamples}${categories.fill.length > 3 ? '...' : ''}`)
	}
	if (categories.line.length > 0) {
		const lineExamples = categories.line.slice(0, 3).map(g => g.font_class).join(', ')
		console.log(`   Line 示例: ${lineExamples}${categories.line.length > 3 ? '...' : ''}`)
	}
}

/**
 * 主函数
 */
function main() {
	console.log('🚀 开始生成图标配置文件...')

	// 检查源文件是否存在
	if (!fs.existsSync(JSON_FILE_PATH)) {
		console.error('❌ 源文件不存在:', JSON_FILE_PATH)
		process.exit(1)
	}

	// 读取 JSON 数据
	console.log('📖 读取图标 JSON 文件...')
	const iconData = readIconJson()

	// 生成 Unicode 映射表
	console.log('🔄 生成 Unicode 映射表...')
	const mapResult = generateUnicodeMap(iconData)

	// 生成 UTS 文件内容
	console.log('📝 生成 UTS 文件内容...')
	const utsContent = generateUtsContent(iconData, mapResult)

	// 写入文件
	console.log('💾 写入 UTS 文件...')
	writeUtsFile(utsContent)

	// 显示统计信息
	generateStats(iconData, mapResult)

	console.log('\n🎉 图标配置文件生成完成!')
}

// 执行主函数
if (require.main === module) {
	main()
}

module.exports = {
	readIconJson,
	generateUnicodeMap,
	generateUtsContent,
	writeUtsFile
}