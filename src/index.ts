import type { Plugin } from 'vite'
import { resolve } from 'path'
import { Options, ThemeConfig } from './index.type'
import { isPackageExists } from 'local-pkg'
import { resolveCompiler } from './utils/vueCompiler'
import { createDts } from './createDts'
import { baseRoot, baseTheme } from './config'
import { transformTs } from './transform'

const TS = isPackageExists('typescript')

export default function VitePluginLogLabel(options: Options = {}): Plugin {
  const root = options.root || baseRoot()
  let dts: string | boolean | undefined
  if (options.dts === false) dts = false
  else if (typeof options.dts === 'string') dts = resolve(root, options.dts)
  else if (options.dts === true || TS) dts = resolve(root, 'log-label.d.ts')

  const identifier = options.identifier || '_log'
  const themes = Object.assign(baseTheme, options.theme) as { [k: string]: ThemeConfig }

  const compiler = resolveCompiler(process.cwd())

  return {
    name: 'vite-plugin-log-label',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!code.includes(identifier)) return

      // 处理 vue 文件
      if (/\.vue$/.test(id)) {
        if (!compiler) return
        const { descriptor } = compiler.parse(code)

        let isTransformed = false

        const s = new compiler.MagicString(code)
        if (descriptor.scriptSetup) {
          const result = transformTs(descriptor.scriptSetup.content, {
            identifier,
            themes,
          })
          if (result) {
            s.update(
              descriptor.scriptSetup.loc.start.offset,
              descriptor.scriptSetup.loc.end.offset,
              result.code
            )
            isTransformed = true
          }
        }
        if (descriptor.script) {
          const result = transformTs(descriptor.script.content, {
            identifier,
            themes,
          })
          if (result) {
            s.update(
              descriptor.script.loc.start.offset,
              descriptor.script.loc.end.offset,
              result.code
            )
            isTransformed = true
          }
        }

        if (!isTransformed) return

        const result = s.toString()

        return result
      }

      // 处理 js/jsx/ts/tsx 文件
      if (!/\.[tj]sx?$/.test(id)) return

      try {
        const result = transformTs(code, { identifier, themes })
        if (!result) return
        createDts(dts, identifier)
        return result.code
      } catch (error: any) {
        console.log(`[vite-plugin-log-label] Error processing ${id}:`, error)
      }
    },
  }
}
