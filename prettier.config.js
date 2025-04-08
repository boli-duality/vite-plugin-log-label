/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
  /**
   * 指定打印器自动换行的行长度
   * @默认值 80
   */
  printWidth: 100,

  /**
   * 指定每个缩进级别的空格数
   * @默认值 2
   */
  tabWidth: 2,

  /**
   * 使用制表符（tab）而非空格进行缩进
   * @默认值 false
   */
  useTabs: false,

  /**
   * 在语句末尾打印分号
   * @默认值 true
   */
  semi: false,

  /**
   * 使用单引号而非双引号
   * @默认值 false
   */
  singleQuote: true,

  /**
   * 在 JSX 中使用单引号
   * @默认值 false
   */
  jsxSingleQuote: true,

  /**
   * 尽可能打印尾随逗号
   * @默认值 "all"
   */
  trailingComma: 'es5',

  /**
   * 在对象字面量中打印括号间的空格
   * @默认值 true
   */
  bracketSpacing: true,

  /**
   * 如何换行包裹对象字面量
   * @默认值 "preserve"
   */
  objectWrap: 'preserve',

  /**
   * 将多行 HTML（HTML/JSX/Vue/Angular）元素的 `>` 放在最后一行的末尾而非单独一行（不适用于自闭合元素）
   * @默认值 false
   */
  bracketSameLine: false,

  /**
   * 控制 Markdown 文本的换行方式
   * @默认值 "preserve"
   */
  proseWrap: 'preserve',

  /**
   * 当箭头函数只有一个参数时是否加括号
   * @默认值 "always"
   */
  arrowParens: 'avoid',

  /**
   * 如何处理 HTML 中的空白字符
   * @默认值 "css"
   */
  htmlWhitespaceSensitivity: 'css',

  /**
   * 指定换行符类型
   * @默认值 "lf"
   */
  endOfLine: 'lf',

  /**
   * 控制对象属性何时使用引号
   * @默认值 "as-needed"
   */
  quoteProps: 'as-needed',

  /**
   * 是否缩进 Vue 文件中 <script> 和 <style> 标签内的代码
   * @默认值 false
   */
  vueIndentScriptAndStyle: false,

  /**
   * 控制是否格式化文件中嵌入的引用代码
   * @默认值 "auto"
   */
  embeddedLanguageFormatting: 'auto',

  /**
   * 在 HTML/Vue/JSX 中强制每行单个属性
   * @默认值 false
   */
  singleAttributePerLine: false,

  /**
   * 当二元表达式换行时操作符的位置
   * @默认值 "end"
   */
  experimentalOperatorPosition: 'end',

  /**
   * 使用非常规的三元运算符格式（问号跟在条件后，而非与结果同行）
   * @默认值 false
   */
  experimentalTernaries: false,

  /**
   * 仅格式化文件的某部分
   * @默认值 0
   */
  rangeStart: 0,

  /**
   * 仅格式化文件的某部分
   * @默认值 Number.POSITIVE_INFINITY
   */
  rangeEnd: Number.POSITIVE_INFINITY,

  /**
   * Prettier 可以限制自己仅格式化包含特殊注释（称为编译指示）的文件
   * 这在逐步将大型未格式化代码库迁移到 Prettier 时非常有用
   * @默认值 false
   */
  requirePragma: false,

  /**
   * Prettier 可以在文件顶部插入特殊的 @format 标记
   * 与 --require-pragma 选项配合使用时效果很好
   * @默认值 false
   */
  insertPragma: false,

  /**
   * 提供支持新语言的插件
   */
  // plugins: Array<string | Plugin>,

  /**
   * 指定要使用的解析器
   */
  // parser: LiteralUnion<BuiltInParserName>,

  /**
   * 指定输入文件路径（用于解析器推断）
   */
  // filepath: string,
}
