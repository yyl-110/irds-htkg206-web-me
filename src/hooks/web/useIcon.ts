import { h } from 'vue'
import type { VNode } from 'vue'
import type { IconTypes } from '../../../types/icon'
import { Icon } from '@/wei-components/WeiIcon'

export function useIcon(props: IconTypes): VNode {
  return h(Icon, props)
}
