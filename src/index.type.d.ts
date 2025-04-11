type ThemeConfig = [bg: string, color: string] | string

export interface Options {
  /**
   * .d.ts 文件路径
   * @default './log-label.d.ts'
   */
  dts?: string | boolean

  /**
   * log function name to be replaced
   * @default 'logl'
   */
  identifier?: string

  theme?: {
    base?: ThemeConfig
    info?: ThemeConfig
    success?: ThemeConfig
    error?: ThemeConfig
    warn?: ThemeConfig
    [key: string]: ThemeConfig
  }

  root?: string
}
