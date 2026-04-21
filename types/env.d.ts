/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_PORT: number
  readonly VITE_OPEN: string
  readonly VITE_DEV: string
  readonly VITE_APP_CAPTCHA_ENABLE: string
  readonly VITE_APP_TENANT_ENABLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_UPLOAD_URL: string
  readonly VITE_API_BASEPATH: string
  readonly VITE_API_URL: string
  readonly VITE_BASE_PATH: string
  readonly VITE_DROP_DEBUGGER: string
  readonly VITE_DROP_CONSOLE: string
  readonly VITE_SOURCEMAP: string
  readonly VITE_OUT_DIR: string
  /** 在登录时是否自动拖动验证码 */
  readonly VITE_AUTO_DRAG_CAPTCHA_IMAGE: number | undefined
  /** 菜单栏是否显示在顶部(默认显示在左侧) */
  readonly VITE_APP_MENU_POSITION: 'top' | 'left'
  /** iconify 图标使用内网代理的地址 */
  readonly VITE_APP_ICONIFY_RESOURCES: string | undefined
  /** 下载文件路径 */
  readonly VITE_BASE_PREVIEW_URL: string | undefined
  /** 本地下载落地目录（WebSocket ApiDownload 的 dir 参数） */
  readonly VITE_BASE_FILE_DOWNLOAD_URL: string | undefined

}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
