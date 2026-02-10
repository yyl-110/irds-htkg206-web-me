import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { platform } from 'node:os'

const FILE_PATH = path.resolve('./src/utils/WeiTheme.ts')

/** Theme */
class Theme {
  /**
   * constructor
   * @param key
   * @param primaryColor
   */
  constructor(
    /** 主题名 */
    public key: string,
    /** 主题色 */
    public primaryColor: string,
  ) {}

  /**
   * get args
   */
  getArgs(): Array<string> {
    return [
      '--js',
      '--compress',
      `--modify-var="primary-color=${this.primaryColor}"`,
      './node_modules/ant-design-vue/dist/antd.dark.less',
      `public/style/antd.dark.${this.key}.min.css`,
    ]
  }
}

/** get themes */
export function getThemes(): Array<Theme> {
  const content = fs.readFileSync(FILE_PATH).toString()
  const themeMathes = content.match(/\(\s*WeiThemeKey\.(\w+)[\s\S]*?\)/g)
  if (!themeMathes)
    throw new Error('Missing theme code')
  const themes: Array<Theme> = []
  for (const content of themeMathes) {
    const contentMatches = content.match(/WeiThemeKey\.(\w+).*'(#\w+)'/)
    if (!contentMatches)
      throw new Error('Invalid new WeiTheme code')
    themes.push(new Theme(contentMatches[1], contentMatches[2]))
  }
  return themes
}

/** main */
export async function main() {
  const themes = getThemes()
  await Promise.all(themes.map((t) => {
    return new Promise((resolve) => {
      const process = spawn(
        './node_modules/.bin/lessc',
        t.getArgs(),
        {
          shell: platform() !== 'win32', // 在 *unix 下使用默认 shell
        },
      )
      process.stdout.on('data', data => console.log(`[${t.key}]`, data.toString()))
      process.on('close', () => {
        console.log(`[${t.key}]`, 'done.')
        resolve(0)
      })
      process.stderr.on('data', (err) => {
        console.log(`[${t.key}]`, 'stderr: ', err.toString())
        resolve(err)
      })
    })
  }))
  console.log('success.')
}

main()
