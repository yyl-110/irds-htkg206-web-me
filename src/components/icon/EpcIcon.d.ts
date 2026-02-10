import { createFromIconfontCN } from '@ant-design/icons-vue'
import '@/assets/font/iconfont.js'

declare namespace deepmerge {
  export const EpcIcon = createFromIconfontCN({
    scriptUrl: '',
  })
  export { EpcIcon }
}
export = deepmerge
