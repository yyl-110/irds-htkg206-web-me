import type { LocationQuery, RouteParams } from 'vue-router'

export interface WeiPageTabItem {
  tabKey: string
  title: string
  path: string
  fullPath: string
  hash?: string
  query?: LocationQuery
  params?: RouteParams
  componentName: string
}

export interface WeiPageTabMenuComponentProps {
  /** 所有标签页 */
  tabs: Array<WeiPageTabItem>
  /** 当前标签页 */
  tab: WeiPageTabItem
  /** 当前页面标签页 key */
  currentTabKey: string
}

export enum WeiPageTabMenus {
  /** 重新加载 */
  refresh = 'refresh',
  /** 关闭标签页 */
  close = 'close',
  /** 关闭左侧标签页 */
  closeLeft = 'closeLeft',
  /** 关闭右侧标签页 */
  closeRight = 'closeRight',
  /** 关闭其他标签页 */
  closeOther = 'closeOther',
  /** 关闭全部标签页 */
  closeAll = 'closeAll',
}
