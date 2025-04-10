import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
import { generate } from '@babel/generator'
import * as t from '@babel/types'
import type { Plugin } from 'vite'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { Options, ThemeConfig } from './index.type'
import { isPackageExists } from 'local-pkg'
import { baseTheme, getStyle } from './style'

const TS = isPackageExists('typescript')

const traverse: typeof _traverse = (_traverse as any).default || _traverse

let hasDts = false
function createDts(dts: string, identifier: string) {
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
  hasDts = true
}

function createStyledConsoleLog(node: t.CallExpression, style: string | undefined) {
  const args: Array<t.Expression | t.SpreadElement | t.ArgumentPlaceholder> = []

  if (node.arguments.length) {
    const [label, ...data] = node.arguments

    let labelStr: string

    if (t.isStringLiteral(label)) labelStr = label.value
    else {
      labelStr = generate(label).code.trim()
      if (labelStr.startsWith('__props.')) labelStr = labelStr.replace('__props.', 'props.')
      data.unshift(label)
    }

    args.push(
      t.stringLiteral(`%c${labelStr}`),
      style ? t.stringLiteral(style) : t.identifier('undefined'),
      ...data // 保留原始数据参数
    )
  }

  const newNode = t.callExpression(
    t.memberExpression(t.identifier('console'), t.identifier('log')),
    args
  )

  return newNode
}

// 默认root，兼容uniapp
function baseRoot() {
  return process.env.UNI_INPUT_DIR || process.env.VITE_ROOT_DIR || process.cwd()
}

export default function VitePluginLogLabel(options: Options = {}, root = baseRoot()): Plugin {
  let dts: string | boolean | undefined
  if (options.dts === false) dts = false
  else if (typeof options.dts === 'string') dts = resolve(root, options.dts)
  else if (options.dts === true || TS) dts = resolve(root, 'log-label.d.ts')

  const identifier = options.identifier || 'logl'
  const themes = Object.assign(baseTheme, options.theme) as { [k: string]: ThemeConfig }

  return {
    name: 'vite-plugin-log-label',
    transform(code: string, id: string) {
      // 仅处理 JS/TS 文件
      if (!/\.([tj]sx?|vue)$/.test(id)) return
      if (!code.includes(identifier)) return

      let isTransformed = false

      try {
        // 1. 解析为 AST
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['typescript'],
        })

        // 2. AST 转换
        traverse(ast, {
          CallExpression(path) {
            const node = path.node
            let newNode: t.CallExpression | undefined
            // 1. 匹配 logl() 调用
            if (t.isIdentifier(node.callee, { name: identifier })) {
              // 2. 创建带样式的 console.log 节点
              newNode = createStyledConsoleLog(node, getStyle(themes.base))
            }
            // 匹配 logl[style]() 调用
            else if (
              t.isMemberExpression(node.callee) &&
              t.isIdentifier(node.callee.object, { name: 'logl' })
            ) {
              const property = node.callee.property
              // 匹配 logl.identifier()
              if (t.isIdentifier(property)) {
                if (Object.hasOwn(themes, property.name)) {
                  newNode = createStyledConsoleLog(node, getStyle(themes[property.name]))
                } else {
                  newNode = createStyledConsoleLog(node, undefined)
                }
              }
              // 匹配 logl[custom]()
              else if (t.isStringLiteral(property)) {
                const colors = property.value.split(',').map(v => v.trim()) as [string, string]
                newNode = createStyledConsoleLog(node, getStyle(colors))
              }
            }
            // 3. 替换原始节点
            if (newNode) {
              path.replaceWith(newNode)
              isTransformed = true
            }
          },
          Identifier(path) {
            // 条件1：标识符名为logs
            if (path.node.name === identifier) {
              // 条件2：不是变量声明语句
              const isDeclaration =
                t.isVariableDeclarator(path.parent) || t.isFunctionDeclaration(path.parent)

              // 条件3：不是属性访问（如obj.logs）
              const isPropertyAccess =
                t.isMemberExpression(path.parent) && path.parent.property === path.node

              // 条件4：确保是独立引用
              if (!isDeclaration && !isPropertyAccess) {
                path.replaceWith(t.memberExpression(t.identifier('console'), t.identifier('log')))
                isTransformed = true
              }
            }
          },
        })

        if (!isTransformed) return
        if (typeof dts === 'string' && !hasDts) createDts(dts, identifier)

        // 3. 生成代码
        const output = generate(ast, {
          retainLines: true,
          compact: false, // 不压缩代码
        })

        return output
      } catch (error: any) {
        console.log(`[vite-plugin-log-label] Error processing ${id}:`, error)
      }
    },
  }
}
