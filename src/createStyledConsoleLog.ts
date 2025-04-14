import { generate } from '@babel/generator'
import * as t from '@babel/types'
import { ThemeConfig } from './index.type'

export function createStyledConsoleLog(node: t.CallExpression, style: string | undefined) {
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

export function getStyle(config: ThemeConfig) {
  if (Array.isArray(config)) {
    return `background:${config[0]};color:${config[1]};padding:2px 5px;border-radius:4px;`
  }
  return config
}
