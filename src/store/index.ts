import { useDictStore } from './modules/dict'
import { usePermissionStore } from './modules/permission'
import { useUserStore } from '@/store/modules/userStore/userStore'
import { useLayoutStore } from '@/store/modules/layout/layout'
import { useUserStore as useUser } from '@/store/modules/user'

interface AppStore {
  useUserStore: ReturnType<typeof useUserStore>
  useLayoutStore: ReturnType<typeof useLayoutStore>
  useDictStore: ReturnType<typeof useDictStore>
  useUser: ReturnType<typeof useUser>
  usePermissionStore: ReturnType<typeof usePermissionStore>
}

const appStore: AppStore = {} as AppStore

// 注册app状态库
export function registerStore() {
  appStore.useUserStore = useUserStore()
  appStore.useLayoutStore = useLayoutStore()
  appStore.useDictStore = useDictStore()
  appStore.useUser = useUser()
  appStore.usePermissionStore = usePermissionStore()
}

export default appStore
