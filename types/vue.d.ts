import type { isPending } from '../src/httpRequest/pending'

declare module 'vue' {
  interface ComponentCustomProperties {
    $isPending: typeof isPending
  }
}
