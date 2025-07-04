// k-icon 组件入口文件
// 注意：uni-app x 中组件导出方式与传统 Vue 项目不同
// 组件文件 .uvue 和配置文件 .uts 会被 uni-app x 自动处理

// 组件导出（uni-app x 会自动处理 .uvue 文件）
// export { default } from './k-icon.uvue'

// 配置导出（uni-app x 会自动处理 .uts 文件）
// export * from './config.uts'

// 在 uni-app x 中，组件通过目录结构自动识别
// 使用时直接通过组件名 <k-icon> 引用即可

// 类型定义（供 TypeScript 开发时参考）
export interface KIconProps {
  name: string
  size?: string | number
  color?: string
  prefix?: string
  customStyle?: string
  disabled?: boolean
  loading?: boolean
  spin?: boolean
  dot?: boolean
  badge?: string | number
  inherit?: boolean
}

export interface KIconEvents {
  click: (event: Event) => void
  load: (event: Event) => void
  error: (event: Event) => void
}