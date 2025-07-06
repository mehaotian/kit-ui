/**
 * 图标配置测试脚本
 * 用于验证生成的 k-icon.uts 文件功能是否正常
 */

const fs = require('fs')
const path = require('path')

// 文件路径
const UTS_FILE_PATH = path.join(__dirname, '../uni_modules/kit-ui/components/k-icon/fonts/k-icon.uts')
const JSON_FILE_PATH = path.join(__dirname, '../uni_modules/kit-ui/components/k-icon/fonts/k-icon.json')

/**
 * 解析 UTS 文件内容
 */
function parseUtsFile() {
  try {
    const content = fs.readFileSync(UTS_FILE_PATH, 'utf8')
    
    // 提取 ICON_UNICODE_MAP
    const mapMatch = content.match(/export const ICON_UNICODE_MAP: UTSJSONObject = \{([\s\S]*?)\}/)
    if (!mapMatch) throw new Error('无法找到 ICON_UNICODE_MAP')
    
    return {
      mapContent: mapMatch[1],
      fullContent: content
    }
  } catch (error) {
    console.error('解析 UTS 文件失败:', error.message)
    process.exit(1)
  }
}

/**
 * 解析数组内容
 */
function parseArrayContent(content) {
  return content
    .split(',')
    .map(item => item.trim().replace(/'/g, ''))
    .filter(item => item.length > 0)
}

/**
 * 解析映射内容
 */
function parseMapContent(content) {
  const map = {}
  const lines = content.split(',')
  
  lines.forEach(line => {
    const match = line.trim().match(/'([^']+)':\s*'([^']+)'/)
    if (match) {
      map[match[1]] = match[2]
    }
  })
  
  return map
}

/**
 * 读取原始 JSON 数据
 */
function readOriginalJson() {
  try {
    const content = fs.readFileSync(JSON_FILE_PATH, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error('读取原始 JSON 失败:', error.message)
    process.exit(1)
  }
}

/**
 * 测试图标分类
 */
function testIconClassification() {
  console.log('\n🧪 测试图标分类...')
  
  const { mapContent } = parseUtsFile()
  const iconMap = parseMapContent(mapContent)
  const allIcons = Object.keys(iconMap)
  
  // 动态分析图标分类
  const fillIcons = allIcons.filter(name => name.endsWith('-fill'))
  const lineIcons = allIcons.filter(name => name.endsWith('-line'))
  const otherIcons = allIcons.filter(name => !name.endsWith('-fill') && !name.endsWith('-line'))
  
  console.log(`   Fill 图标数量: ${fillIcons.length}`)
  console.log(`   Line 图标数量: ${lineIcons.length}`)
  console.log(`   Other 图标数量: ${otherIcons.length}`)
  
  // 验证分类正确性（这里实际上是验证我们的分类逻辑）
  const wrongFill = fillIcons.filter(icon => !icon.endsWith('-fill'))
  const wrongLine = lineIcons.filter(icon => !icon.endsWith('-line'))
  const wrongOther = otherIcons.filter(icon => icon.endsWith('-fill') || icon.endsWith('-line'))
  
  if (wrongFill.length > 0) {
    console.error(`   ❌ Fill 分类错误: ${wrongFill.slice(0, 5).join(', ')}${wrongFill.length > 5 ? '...' : ''}`)
  } else {
    console.log('   ✅ Fill 分类正确')
  }
  
  if (wrongLine.length > 0) {
    console.error(`   ❌ Line 分类错误: ${wrongLine.slice(0, 5).join(', ')}${wrongLine.length > 5 ? '...' : ''}`)
  } else {
    console.log('   ✅ Line 分类正确')
  }
  
  if (wrongOther.length > 0) {
    console.error(`   ❌ Other 分类错误: ${wrongOther.slice(0, 5).join(', ')}${wrongOther.length > 5 ? '...' : ''}`)
  } else {
    console.log('   ✅ Other 分类正确')
  }
}

/**
 * 测试排序
 */
function testSorting() {
  console.log('\n🔤 测试排序...')
  
  const { mapContent } = parseUtsFile()
  const iconMap = parseMapContent(mapContent)
  const allIcons = Object.keys(iconMap)
  
  // 动态分析图标分类
  const fillIcons = allIcons.filter(name => name.endsWith('-fill'))
  const lineIcons = allIcons.filter(name => name.endsWith('-line'))
  const otherIcons = allIcons.filter(name => !name.endsWith('-fill') && !name.endsWith('-line'))
  
  // 检查 fill 图标排序
  const sortedFill = [...fillIcons].sort()
  const fillSorted = JSON.stringify(fillIcons) === JSON.stringify(sortedFill)
  console.log(`   Fill 图标排序: ${fillSorted ? '✅ 正确' : '❌ 错误'}`)
  
  // 检查 line 图标排序
  const sortedLine = [...lineIcons].sort()
  const lineSorted = JSON.stringify(lineIcons) === JSON.stringify(sortedLine)
  console.log(`   Line 图标排序: ${lineSorted ? '✅ 正确' : '❌ 错误'}`)
  
  // 检查总体排序（fill -> line -> other）
  const expectedOrder = [...sortedFill, ...sortedLine, ...otherIcons.sort()]
  // 实际顺序应该是从映射表中按顺序提取的键
  const actualOrder = allIcons // allIcons 已经是按映射表顺序排列的
  const overallSorted = JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)
  console.log(`   总体排序: ${overallSorted ? '✅ 正确' : '❌ 错误'}`)
  
  if (!overallSorted) {
    console.log(`   期望顺序前5个: ${expectedOrder.slice(0, 5).join(', ')}`)
    console.log(`   实际顺序前5个: ${actualOrder.slice(0, 5).join(', ')}`)
  }
}

/**
 * 测试数据完整性
 */
function testDataIntegrity() {
  console.log('\n🔍 测试数据完整性...')
  
  const originalData = readOriginalJson()
  const { mapContent } = parseUtsFile()
  const iconMap = parseMapContent(mapContent)
  const allIcons = Object.keys(iconMap)
  
  const originalCount = originalData.glyphs ? originalData.glyphs.length : 0
  const generatedCount = allIcons.length
  
  console.log(`   原始图标数量: ${originalCount}`)
  console.log(`   生成图标数量: ${generatedCount}`)
  console.log(`   映射表条目: ${Object.keys(iconMap).length}`)
  
  // 检查是否有遗漏的图标
  const originalIcons = originalData.glyphs.map(g => g.font_class)
  const missingIcons = originalIcons.filter(icon => !allIcons.includes(icon))
  
  if (missingIcons.length > 0) {
    console.error(`   ❌ 遗漏图标: ${missingIcons.slice(0, 5).join(', ')}${missingIcons.length > 5 ? '...' : ''}`)
  } else {
    console.log('   ✅ 无遗漏图标')
  }
  
  // 检查 Unicode 映射
  const missingUnicode = allIcons.filter(icon => !iconMap[icon])
  if (missingUnicode.length > 0) {
    console.error(`   ❌ 缺少 Unicode 映射: ${missingUnicode.slice(0, 5).join(', ')}${missingUnicode.length > 5 ? '...' : ''}`)
  } else {
    console.log('   ✅ Unicode 映射完整')
  }
}

/**
 * 测试函数存在性
 */
function testFunctions() {
  console.log('\n⚙️ 测试函数存在性...')
  
  const { fullContent } = parseUtsFile()
  
  const expectedFunctions = [
    'getIconUnicode',
    'hasIcon',
    'getAllIconNames',
    'getIconNamesByType',
    'searchIcons',
    'getIconBaseName',
    'getIconVariants'
  ]
  
  expectedFunctions.forEach(funcName => {
    const exists = fullContent.includes(`export function ${funcName}`)
    console.log(`   ${funcName}: ${exists ? '✅ 存在' : '❌ 缺失'}`)
  })
}

/**
 * 获取图标基础名称（去掉 -fill 或 -line 后缀）
 */
function getBaseName(iconName) {
  if (iconName.endsWith('-fill')) {
    return iconName.slice(0, -5)
  }
  if (iconName.endsWith('-line')) {
    return iconName.slice(0, -5)
  }
  return iconName
}

/**
 * 测试图标配对情况
 */
function testIconPairs() {
  console.log('\n🔗 测试图标配对...')
  
  const { mapContent } = parseUtsFile()
  const iconMap = parseMapContent(mapContent)
  const allIcons = Object.keys(iconMap)
  
  // 动态分析图标分类
  const fillIcons = allIcons.filter(name => name.endsWith('-fill'))
  const lineIcons = allIcons.filter(name => name.endsWith('-line'))
  
  // 获取所有基础名称
  const fillBases = new Set(fillIcons.map(getBaseName))
  const lineBases = new Set(lineIcons.map(getBaseName))
  
  // 检查只有 fill 没有 line 的图标
  const onlyFill = [...fillBases].filter(base => !lineBases.has(base))
  if (onlyFill.length > 0) {
    console.log(`   ⚠️ 只有 Fill 版本: ${onlyFill.length} 个`)
    console.log(`      ${onlyFill.slice(0, 3).join(', ')}${onlyFill.length > 3 ? '...' : ''}`)
  }
  
  // 检查只有 line 没有 fill 的图标
  const onlyLine = [...lineBases].filter(base => !fillBases.has(base))
  if (onlyLine.length > 0) {
    console.log(`   ⚠️ 只有 Line 版本: ${onlyLine.length} 个`)
    console.log(`      ${onlyLine.slice(0, 3).join(', ')}${onlyLine.length > 3 ? '...' : ''}`)
  }
  
  // 检查完整配对的图标
  const paired = [...fillBases].filter(base => lineBases.has(base))
  const totalBases = new Set([...fillBases, ...lineBases]).size
  const pairRate = ((paired.length / totalBases) * 100).toFixed(1)
  
  console.log(`   ✅ 完整配对: ${paired.length} 个 (${pairRate}%)`)
  
  if (onlyFill.length > 0 || onlyLine.length > 0) {
    console.log(`   💡 提示: 运行 'node scripts/check-icon-pairs.js' 查看详细配对报告`)
  }
}

/**
 * 测试示例图标
 */
function testSampleIcons() {
  console.log('\n🎯 测试示例图标...')
  
  const { mapContent } = parseUtsFile()
  const iconMap = parseMapContent(mapContent)
  const allIcons = Object.keys(iconMap)
  
  // 动态分析图标分类
  const fillIcons = allIcons.filter(name => name.endsWith('-fill')).sort()
  const lineIcons = allIcons.filter(name => name.endsWith('-line')).sort()
  
  // 显示一些示例
  console.log(`   Fill 示例: ${fillIcons.slice(0, 5).join(', ')}${fillIcons.length > 5 ? '...' : ''}`)
  console.log(`   Line 示例: ${lineIcons.slice(0, 5).join(', ')}${lineIcons.length > 5 ? '...' : ''}`)
  
  // 检查常见图标对
  const commonBases = ['home', 'user', 'heart', 'star', 'search']
  commonBases.forEach(base => {
    const hasFill = fillIcons.some(icon => icon.includes(base) && icon.endsWith('-fill'))
    const hasLine = lineIcons.some(icon => icon.includes(base) && icon.endsWith('-line'))
    
    if (hasFill && hasLine) {
      console.log(`   ${base}: ✅ 有 fill 和 line 版本`)
    } else if (hasFill || hasLine) {
      console.log(`   ${base}: ⚠️ 只有 ${hasFill ? 'fill' : 'line'} 版本`)
    }
  })
}

/**
 * 主测试函数
 */
function runTests() {
  console.log('🚀 开始测试图标配置文件...')
  
  // 检查文件是否存在
  if (!fs.existsSync(UTS_FILE_PATH)) {
    console.error('❌ UTS 文件不存在:', UTS_FILE_PATH)
    console.log('请先运行生成脚本: npm run generate:icons')
    process.exit(1)
  }
  
  if (!fs.existsSync(JSON_FILE_PATH)) {
    console.error('❌ JSON 文件不存在:', JSON_FILE_PATH)
    process.exit(1)
  }
  
  try {
    testIconClassification()
    testSorting()
    testDataIntegrity()
    testFunctions()
    testIconPairs()
    testSampleIcons()
    
    console.log('\n🎉 所有测试完成!')
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error.message)
    process.exit(1)
  }
}

// 执行测试
if (require.main === module) {
  runTests()
}

module.exports = {
  runTests,
  testIconClassification,
  testSorting,
  testDataIntegrity,
  testFunctions,
  testIconPairs,
  testSampleIcons,
  getBaseName
}