export interface Options {
  /**
   * .d.ts 文件路径
   * @default './logs.d.ts'
   */
  dts?: string
  /**
   * 需要替换的log函数名
   * @default 'logs'
   */
  identifier?: string
}
