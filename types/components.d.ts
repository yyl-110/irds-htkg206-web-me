import { ComposerTranslation } from 'vue-i18n'

declare module 'vue' {
  interface ComponentCustomProperties {
    t: ComposerTranslation
  }
  export interface GlobalComponents {
    Icon: typeof import('@/components/Icon')['Icon']
    DictTag: typeof import('@/components/DictTag')['DictTag']
  }
}

export {}
