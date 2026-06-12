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

/**
 * 侧栏折叠时，点击当前已打开页签以展开二/三级菜单路径
 */
export const RevealSiderMenuEventKey: EventBusKey<string> = Symbol('RevealSiderMenu')

/** 侧栏再次点击带平台选择抽屉的菜单时打开抽屉（payload 为目标菜单 path） */
export const OpenPlatformPickerDrawerEventKey: EventBusKey<string> = Symbol('OpenPlatformPickerDrawer')

/** @deprecated 使用 OpenPlatformPickerDrawerEventKey */
export const OpenModuleLibDrawerEventKey = OpenPlatformPickerDrawerEventKey
