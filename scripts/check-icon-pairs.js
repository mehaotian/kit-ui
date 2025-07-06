/**
 * 图标配对检查脚本
 * 检查所有图标的 fill 和 line 版本配对情况
 */

const fs = require('fs')
const path = require('path')

// 文件路径
const UTS_FILE_PATH = path.join(__dirname, '../uni_modules/kit-ui/components/k-icon/fonts/k-icon.uts')

/**
 * 解析 UTS 文件获取图标数组
 */
function parseIconArrays() {
  try {
    const content = fs.readFileSync(UTS_FILE_PATH, 'utf8')
    
    // 提取 FILL_ICON_NAMES
    const fillMatch = content.match(/export const FILL_ICON_NAMES: string\[\] = \[([\s\S]*?)\]/)
    if (!fillMatch) throw new Error('无法找到 FILL_ICON_NAMES')
    
    // 提取 LINE_ICON_NAMES
    const lineMatch = content.match(/export const LINE_ICON_NAMES: string\[\] = \[([\s\S]*?)\]/)
    if (!lineMatch) throw new Error('无法找到 LINE_ICON_NAMES')
    
    // 解析数组内容
    const fillIcons = parseArrayContent(fillMatch[1])
    const lineIcons = parseArrayContent(lineMatch[1])
    
    return { fillIcons, lineIcons }
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
 * 检查图标配对情况
 */
function checkIconPairs() {
  console.log('🔍 检查图标配对情况...\n')
  
  const { fillIcons, lineIcons } = parseIconArrays()
  
  // 获取所有基础名称
  const fillBases = new Set(fillIcons.map(getBaseName))
  const lineBases = new Set(lineIcons.map(getBaseName))
  const allBases = new Set([...fillBases, ...lineBases])
  
  console.log(`📊 统计信息:`)
  console.log(`   Fill 图标数量: ${fillIcons.length}`)
  console.log(`   Line 图标数量: ${lineIcons.length}`)
  console.log(`   唯一基础名称: ${allBases.size}`)
  console.log()
  
  // 检查只有 fill 没有 line 的图标
  const onlyFill = [...fillBases].filter(base => !lineBases.has(base))
  if (onlyFill.length > 0) {
    console.log(`⚠️ 只有 Fill 版本的图标 (${onlyFill.length} 个):`)
    onlyFill.sort().forEach(base => {
      console.log(`   ${base}-fill`)
    })
    console.log()
  }
  
  // 检查只有 line 没有 fill 的图标
  const onlyLine = [...lineBases].filter(base => !fillBases.has(base))
  if (onlyLine.length > 0) {
    console.log(`⚠️ 只有 Line 版本的图标 (${onlyLine.length} 个):`)
    onlyLine.sort().forEach(base => {
      console.log(`   ${base}-line`)
    })
    console.log()
  }
  
  // 检查完整配对的图标
  const paired = [...fillBases].filter(base => lineBases.has(base))
  console.log(`✅ 完整配对的图标 (${paired.length} 个):`)
  if (paired.length > 0) {
    console.log(`   示例: ${paired.slice(0, 10).join(', ')}${paired.length > 10 ? '...' : ''}`)
  }
  console.log()
  
  // 总结
  console.log(`📈 配对分析:`)
  console.log(`   完整配对: ${paired.length} 个基础图标`)
  console.log(`   仅 Fill: ${onlyFill.length} 个基础图标`)
  console.log(`   仅 Line: ${onlyLine.length} 个基础图标`)
  console.log(`   配对率: ${((paired.length / allBases.size) * 100).toFixed(1)}%`)
  
  return {
    paired,
    onlyFill,
    onlyLine,
    stats: {
      fillCount: fillIcons.length,
      lineCount: lineIcons.length,
      baseCount: allBases.size,
      pairedCount: paired.length,
      pairRate: (paired.length / allBases.size) * 100
    }
  }
}

/**
 * 生成配对报告
 */
function generatePairReport() {
  const result = checkIconPairs()
  
  // 生成详细报告文件
  const reportPath = path.join(__dirname, 'icon-pair-report.md')
  let report = '# 图标配对分析报告\n\n'
  
  report += `## 统计概览\n\n`
  report += `- Fill 图标数量: ${result.stats.fillCount}\n`
  report += `- Line 图标数量: ${result.stats.lineCount}\n`
  report += `- 唯一基础名称: ${result.stats.baseCount}\n`
  report += `- 完整配对: ${result.stats.pairedCount}\n`
  report += `- 配对率: ${result.stats.pairRate.toFixed(1)}%\n\n`
  
  if (result.onlyFill.length > 0) {
    report += `## 仅有 Fill 版本的图标 (${result.onlyFill.length} 个)\n\n`
    result.onlyFill.sort().forEach(base => {
      report += `- ${base}-fill\n`
    })
    report += '\n'
  }
  
  if (result.onlyLine.length > 0) {
    report += `## 仅有 Line 版本的图标 (${result.onlyLine.length} 个)\n\n`
    result.onlyLine.sort().forEach(base => {
      report += `- ${base}-line\n`
    })
    report += '\n'
  }
  
  if (result.paired.length > 0) {
    report += `## 完整配对的图标 (${result.paired.length} 个)\n\n`
    result.paired.sort().forEach(base => {
      report += `- ${base} (${base}-fill + ${base}-line)\n`
    })
    report += '\n'
  }
  
  fs.writeFileSync(reportPath, report, 'utf8')
  console.log(`\n📄 详细报告已生成: ${reportPath}`)
}

// 执行检查
if (require.main === module) {
  // 检查文件是否存在
  if (!fs.existsSync(UTS_FILE_PATH)) {
    console.error('❌ UTS 文件不存在:', UTS_FILE_PATH)
    console.log('请先运行生成脚本: npm run generate:icons')
    process.exit(1)
  }
  
  generatePairReport()
}

module.exports = {
  checkIconPairs,
  generatePairReport,
  getBaseName
}