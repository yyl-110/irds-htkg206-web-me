import type { EventBusKey } from '@vueuse/core'

/**
 * 关闭页面顶部标签页的事件 key
 * @description 参考: https://vueuse.org/core/useEventBus/#useeventbus
 */
export const CloseLayoutTabEventKey: EventBusKey<string> = Symbol('LayoutTab')

/**
 * 设置页面顶部标签页标题的事件 key
 * @description 参考: https://vueuse.org/core/useEventBus/#useeventbus
 */
export const SetTabTitleEventKey: EventBusKey<string> = Symbol('SetTabTitle')
