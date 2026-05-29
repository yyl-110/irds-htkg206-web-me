import { onActivated, onMounted } from 'vue'
import { useEventBus } from '@vueuse/core'
import { OpenPlatformPickerDrawerEventKey } from '@/utils/EventBus'
import { consumeSkipPlatformPickerDrawerOnTab } from '@/utils/platformPickerDrawerNav'

type GetMenuListDataFn = (options?: { forceOpenDrawer?: boolean }) => void | Promise<void>

/**
 * 平台选择抽屉页统一生命周期：侧栏进入/重复点击弹抽屉，顶部 Tab 切换不弹。
 */
export function usePlatformPickerDrawerLifecycle(
  getMenuListData: GetMenuListDataFn,
  options?: {
    /** Tab 切回且跳过抽屉时的回调（如仅关闭 visible、保留 menuId） */
    onTabSkip?: () => void
  },
) {
  let skipActivatedAfterMount = false

  onMounted(() => {
    skipActivatedAfterMount = true
    void getMenuListData()
  })

  onActivated(() => {
    if (skipActivatedAfterMount) {
      skipActivatedAfterMount = false
      return
    }
    if (consumeSkipPlatformPickerDrawerOnTab()) {
      options?.onTabSkip?.()
      return
    }
    void getMenuListData({ forceOpenDrawer: true })
  })

  const openDrawerBus = useEventBus(OpenPlatformPickerDrawerEventKey)
  openDrawerBus.on(() => void getMenuListData({ forceOpenDrawer: true }))
}
