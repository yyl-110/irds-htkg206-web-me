import { writeFile } from 'node:fs'
import path from 'node:path'
import type { ConfigEnv, IndexHtmlTransformResult, Plugin, UserConfig } from 'vite'
import packageJSON from '../../../package.json'
import { CheckUpdateConfig } from './config'

interface Html {
  enable?: boolean
  toMeta?: boolean
  toConsole?: boolean
  toGlobal?: boolean
}

interface Json {
  enable?: boolean
  fileName: string
}

interface VitePluginVersionInput {
  name?: string
  version?: string
  html?: Html
  json?: Json
}

/**
 * 获取版本号
 * @description 版本号取自 `package.json` `version`, 并加入时间戳作为后缀
 *
 * 这里没有使用自增的版本号, 因为在云上打包时无法将自增后的版本号提交到 git 仓库;
 * 下次打包时无法获取最新的版本号, 所以在版本号中增加了时间戳后缀
 */
const generateVersion = () => `${packageJSON.version}.${Date.now()}`

export const vitePluginVersionOutput: (input?: VitePluginVersionInput) => Plugin = (input = {}) => {
  const {
    name = CheckUpdateConfig.NAME,
    version = generateVersion(),
    html = { enable: true, toMeta: true, toConsole: true, toGlobal: true },
    json = { enable: true, fileName: CheckUpdateConfig.VERSION_FILE_NAME },
  } = input
  let config: any

  const writeVersion = (versionFile: string, content: string) => {
    writeFile(versionFile, content, (err) => {
      if (err)
        throw err
    })
  }

  /** 当前运行环境 */
  let _mode: string = 'production'

  return {
    name: 'vite-plugin-version-output',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async transformIndexHtml() {
      const els: IndexHtmlTransformResult = []

      if (!html?.enable)
        return els

      const printName = name
      const printInfo = `${printName}: ${version}`

      html.toMeta && els.push({
        tag: 'meta',
        injectTo: 'head-prepend',
        attrs: {
          name: printName,
          content: printInfo,
        },
      })
      html.toConsole && els.push({
        tag: 'script',
        injectTo: 'body',
        children: `console.log("${printInfo}")`,
      })
      html.toGlobal && els.push({
        tag: 'script',
        injectTo: 'body',
        children: `var ${printName} = "${version}";`,
      })

      return els
    },

    buildStart() {
      if (!json?.enable)
        return

      // // 开发环境不写入 json 文件
      // if (mode === 'development') return
      const file = path.resolve(config.root, config.publicDir, json.fileName)
      const content = JSON.stringify({ version })
      writeVersion(file, content)
    },
    config(config: UserConfig, env: ConfigEnv) {
      _mode = env.mode || ''
    },
  }
}
