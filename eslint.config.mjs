/**
 * @file Eslint 配置
 * @see {@link https://zh-hans.eslint.org/docs/latest/use/configure/configuration-files-new#%E9%85%8D%E7%BD%AE%E5%AF%B9%E8%B1%A1 | 配置规则}
 */

import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      // 这是代码生成库生成的目录, 生成的代码暂时无法通过 jsdoc lint, 需等待 @wei/openapi-codegen 更新生成的代码格式后移除
      'src/api/models/**/*.ts',
      'src/api/tags/**/*.ts',
      'src/api/templates/*',
      'src/api/codegen.log.json',
      'src/api/swagger.json',
      'src/router/routes.ts',
      'dist/**/*',
      '**/fixtures',
      '**/__test__',
      'node_modules',
      'docs/*',
      '*.mjs',
      'report.json'
    ],
    formatters: {
      css: true,
    },
  },
  {
    rules: {
      'no-console': 'warn',
      // jsdoc 规则(参考 https://www.npmjs.com/package/eslint-plugin-jsdoc#rules)
      'jsdoc/require-jsdoc': [
        'off',
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            // ClassExpression: true,
            FunctionDeclaration: true,
            // FunctionExpression: true,
            MethodDefinition: true,
          },
          checkGetters: false,
          checkSetters: false,
        },
      ], // 需要添加 JSDoc 注释
      'jsdoc/require-description': 'off', // 需要添加 JSDoc 注释内容
      'jsdoc/require-param': 'error', // 需要添加 JSDoc @param 注释
      'jsdoc/require-param-name': 'error', // 需要添加 JSDoc @param name 注释
      'jsdoc/require-param-description': 'off', // 需要添加 JSDoc @param 的 description 部分
      'jsdoc/check-indentation': 'error', // 检查 JSDoc 注释的缩进
      'jsdoc/no-bad-blocks': 'error', // 检查 JSDoc 注释的开头 * 数量及开头和结尾的格式
      'jsdoc/no-multi-asterisks': 'error', // 检查 JSDoc 注释的 * 数量
      // 'jsdoc/no-types': 'error', // 禁止在 @param 或 @returns 上增加类型, 对于 TypeScript 来说, 类型信息是多余的
      'jsdoc/require-asterisk-prefix': 'error', // 要求每个 JSDoc 行都以 * 开头
      'jsdoc/check-types': 'error', // 检查 JSDoc 注释中的类型
      'jsdoc/check-values': 'error', // 检查 JSDoc 注释中部分 tag 的内容是否符合预期
      'jsdoc/check-tag-names': 'error', // 检查 JSDoc 注释中的 tag 是否有效
      'jsdoc/require-returns-description':'off',
      'jsdoc/check-param-names':'off',
      'format/prettier': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-dupe-characters-character': 'off',
      'regexp/no-useless-quantifier': 'off',
      'regexp/no-dupe-characters-character-class': 'off',
      'regexp/optimal-quantifier-concatenation': 'off',
      'regexp/strict': 'off',
      'unused-imports/no-unused-vars': 'off',
      'ts/no-unused-expressions': 'off',
      'ts/no-unsafe-function-type': 'off',
      'style/space-infix-ops': 'off',
      'vue/require-explicit-emits':'off',
      'vue/no-template-shadow':'off',
      'jsonc/indent':'off'
    },
  },
)
