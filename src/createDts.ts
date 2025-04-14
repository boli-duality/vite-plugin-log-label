import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

let created = false

export function createDts(dts: string | boolean | undefined, identifier: string) {
  if (typeof dts != 'string' || created) return
  // 确保目录存在
  const dir = dirname(dts)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  // 生成 .d.ts 内容
  const dtsContent = `declare const ${identifier}: {
  (label?: any, ...data: any[]): void
  base: (label?: any, ...data: any[]) => void
  info: (label?: any, ...data: any[]) => void
  success: (label?: any, ...data: any[]) => void
  warn: (label?: any, ...data: any[]) => void
  error: (label?: any, ...data: any[]) => void
  /** key: \`\${bg},\${color}\` */
  [key: string]: (label?: any, ...data: any[]) => void
}
`
  // 写入文件
  writeFileSync(dts, dtsContent)
  created = true
}
