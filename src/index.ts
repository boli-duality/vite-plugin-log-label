import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
import { generate } from '@babel/generator'
import * as t from '@babel/types'
import type { Plugin } from 'vite'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { Options } from './index.type'
import { isPackageExists } from 'local-pkg'

const TS = isPackageExists('typescript')

const traverse: typeof _traverse = (_traverse as any).default || _traverse

let hasDts = false
function createDts(dts: string, identifier: string) {
  // 解析最终路径（处理相对路径和绝对路径）
  const path = resolve(process.cwd(), dts)

  // 确保目录存在
  const dir = dirname(path)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  // 生成 .d.ts 内容
  const dtsContent = `declare const ${identifier}: {
  (label?: any, ...data: any[]): void
  error: (label?: any, ...data: any[]) => void
  warn: (label?: any, ...data: any[]) => void
  /** key: \`\${bg},\${color}\` */
  [key: string]: (label?: any, ...data: any[]) => void
}
`

  // 写入文件
  writeFileSync(path, dtsContent)
  hasDts = true
}

function createStyledConsoleLog(node: t.CallExpression, bg: string, color: string = '#fff') {
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
      t.templateLiteral(
        [t.templateElement({ raw: `%c${labelStr}`, cooked: `%c${labelStr}` }, true)],
        []
      ),
      t.templateLiteral(
        [
          t.templateElement(
            {
              raw: `background:${bg};color:${color};padding:2px 5px;border-radius:4px;`,
              cooked: `background:${bg};color:${color};padding:2px 5px;border-radius:4px;`,
            },
            true
          ),
        ],
        []
      ),
      ...data // 保留原始数据参数
    )
  }

  const newNode = t.callExpression(
    t.memberExpression(t.identifier('console'), t.identifier('log')),
    args
  )

  return newNode
}

export default function VitePluginLogLabel(options: Options = {}): Plugin {
  const dts = options.dts ?? (TS && './logs.d.ts')
  const identifier = options.identifier || 'logs'

  return {
    name: 'vite-plugin-log-label',
    transform(code: string, id: string) {
      // 仅处理 JS/TS 文件
      if (!/\.([tj]sx?|vue)$/.test(id)) return
      if (!code.includes(identifier)) return

      let needCreateDts = false

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
            // 1. 匹配 logs() 调用
            if (t.isIdentifier(node.callee, { name: identifier })) {
              // 2. 创建带样式的 console.log 节点
              const newNode = createStyledConsoleLog(node, '#67C23A')
              // 3. 替换原始节点
              path.replaceWith(newNode)

              needCreateDts = true
            }
            // 匹配 logs.[type]() 调用
            if (
              t.isMemberExpression(node.callee) &&
              t.isIdentifier(node.callee.object, { name: 'logs' })
            ) {
              // 匹配 logs.warn()
              if (t.isIdentifier(node.callee.property, { name: 'warn' })) {
                const newNode = createStyledConsoleLog(node, '#E6A23C')
                path.replaceWith(newNode)
              }
              // 匹配 logs.error()
              else if (t.isIdentifier(node.callee.property, { name: 'error' })) {
                const newNode = createStyledConsoleLog(node, '#F56C6C')
                path.replaceWith(newNode)
              } else if (t.isStringLiteral(node.callee.property)) {
                const colors = node.callee.property.value.split(',').map(v => v.trim()) as [
                  string,
                  string,
                ]
                const newNode = createStyledConsoleLog(node, ...colors)
                path.replaceWith(newNode)
              }
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

                needCreateDts = true
              }
            }
          },
        })

        // 3. 生成代码
        const output = generate(ast, {
          retainLines: true,
          comments: true, // 保留其他注释
          compact: false, // 不压缩代码
        })

        if (dts && !hasDts && needCreateDts) createDts(dts, identifier)

        return { code: output.code, map: output.map }
      } catch (error: any) {
        console.warn(`Error processing ${id}:`, error)
      }
    },
  }
}
