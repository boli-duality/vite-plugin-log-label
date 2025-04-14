import { parse } from '@babel/parser'
import cjs_traverse from '@babel/traverse'
import { generate } from '@babel/generator'
import * as t from '@babel/types'
import { getDefaultExportFromCjs } from './utils/utils'
import { createStyledConsoleLog, getStyle } from './createStyledConsoleLog'

const traverse = getDefaultExportFromCjs(cjs_traverse)

export function transformTs(
  code: string,
  { identifier, themes }: { identifier: string; themes: any }
) {
  let isTransformed = false

  // 1. 解析为 AST
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })

  // 2. AST 转换
  traverse(ast, {
    CallExpression(path) {
      const node = path.node
      let newNode: t.CallExpression | undefined
      // 1. 匹配 _log() 调用
      if (t.isIdentifier(node.callee, { name: identifier })) {
        // 2. 创建带样式的 console.log 节点
        newNode = createStyledConsoleLog(node, getStyle(themes.base))
      }
      // 匹配 _log[style]() 调用
      else if (
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object, { name: '_log' })
      ) {
        const property = node.callee.property
        // 匹配 _log.identifier()
        if (t.isIdentifier(property)) {
          if (Object.hasOwn(themes, property.name)) {
            newNode = createStyledConsoleLog(node, getStyle(themes[property.name]))
          } else {
            newNode = createStyledConsoleLog(node, undefined)
          }
        }
        // 匹配 _log[custom]()
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

  // 3. 生成代码
  const output = generate(ast, {
    retainLines: true,
    compact: false, // 不压缩代码
  })

  return output
}
