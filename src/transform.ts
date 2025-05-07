import { parse } from '@babel/parser'
import cjs_traverse from '@babel/traverse'
import { generate } from '@babel/generator'
import * as t from '@babel/types'
import { getDefaultExportFromCjs } from './utils/utils'
import { createStyledConsoleLog, getStyle } from './createStyledConsoleLog'
import { resolveCompiler } from './utils/vueCompiler'

const traverse = getDefaultExportFromCjs(cjs_traverse)
const compiler = resolveCompiler(process.cwd())

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
        // 创建带样式的 console.log 节点
        newNode = createStyledConsoleLog(node, getStyle(themes.default))
      }
      // 2.匹配 _log[style]() 调用
      else if (
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object, { name: identifier })
      ) {
        const property = node.callee.property
        // 2.1.匹配 _log.theme()
        if (t.isIdentifier(property)) {
          if (Object.hasOwn(themes, property.name)) {
            newNode = createStyledConsoleLog(node, getStyle(themes[property.name]))
          } else newNode = createStyledConsoleLog(node, undefined)
        }
        // 2.2.匹配 _log[bg,color]()
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
      // 条件1：标识符名为_log
      if (path.node.name === identifier) {
        // 条件2：不是变量声明语句
        const isDeclaration =
          t.isVariableDeclarator(path.parent) || t.isFunctionDeclaration(path.parent)

        // 条件3：不是属性访问（如obj._log）
        const isPropertyAccess =
          t.isMemberExpression(path.parent) && path.parent.property === path.node

        // 条件4：不是类方法
        const isClassMethod = t.isClassMethod(path.parent)

        // 确保是独立引用
        if (!isDeclaration && !isPropertyAccess && !isClassMethod) {
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

export function transformVue(
  code: string,
  { identifier, themes }: { identifier: string; themes: any }
) {
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
      s.update(descriptor.script.loc.start.offset, descriptor.script.loc.end.offset, result.code)
      isTransformed = true
    }
  }

  if (!isTransformed) return

  const result = s.toString()

  return result
}
