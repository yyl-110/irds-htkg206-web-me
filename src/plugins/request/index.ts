import type { Plugin } from 'vue'
import { isPending } from '@/httpRequest/pending'

/** 请求相关的注册 plugin */
const requestPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$isPending = isPending
  },
}

export default requestPlugin
