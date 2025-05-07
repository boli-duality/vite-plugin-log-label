import type { Plugin } from 'vite'
import { resolve } from 'node:path'
import { Options, ThemeConfig } from './index.type'
import { isPackageExists } from 'local-pkg'
import { generateDts } from './generateDts'
import { getRoot, themePresets } from './config'
import { transformTs, transformVue } from './transform'

const TS = isPackageExists('typescript')

export default function VitePluginLogLabel(options: Options = {}): Plugin {
  const root = options.root || getRoot()
  let dts: string | boolean | undefined
  if (options.dts === false) dts = false
  else if (typeof options.dts === 'string') dts = resolve(root, options.dts)
  else if (options.dts === true || TS) dts = resolve(root, 'log-label.d.ts')

  const identifier = options.identifier || '_log'

  generateDts(dts, identifier)

  const themes = Object.assign(themePresets, options.theme) as { [k: string]: ThemeConfig }

  return {
    name: 'vite-plugin-log-label',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!code.includes(identifier)) return

      try {
        // 处理 vue 文件
        if (/\.vue$/.test(id)) return transformVue(code, { identifier, themes })
        // 处理 js/jsx/ts/tsx 文件
        if (!/\.[tj]sx?$/.test(id)) return transformTs(code, { identifier, themes })?.code
      } catch (error: any) {
        console.log(`[vite-plugin-log-label] Error processing ${id}:`, error)
      }
    },
  }
}
