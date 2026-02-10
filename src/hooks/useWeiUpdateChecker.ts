import { useIdle } from '@vueuse/core'
import { Button, notification } from 'ant-design-vue'
import { get } from 'lodash-es'
import { computed, h, reactive, ref, watch } from 'vue'
import { WeiI18n } from '@/utils/WeiI18n'
import { CheckUpdateConfig } from '@/plugins/checkUpdate/config'

/** 获取本地的版本号 */
const getLocalVersion = () => get(window, CheckUpdateConfig.NAME) || ''

/** 获取远程服务器的版本号 */
async function getRemoteVersion() {
  try {
    const response = await fetch(`/${CheckUpdateConfig.VERSION_FILE_NAME}`)
    const json = await response.json()
    return (get(json, 'version') || '') as string
  }
  catch (error) {
    console.error(error)
  }
}

/** 版本信息 */
const version = reactive<WeiUpdateCheckerVersion>({ local: '', remote: undefined })

/** 根据本地与服务器版本号判断是否需要更新 */
const allowUpdate = computed(() => version.local && version.remote && version.local !== version.remote)

/** 是否已显示更新提示弹窗 */
const showUpdateTips = ref(false)
function showUpdateTipsDialog() {
  showUpdateTips.value = true
  notification.open({
    message: WeiI18n.$t('更新提示'),
    description: WeiI18n.$t('检测到新版本, 请刷新页面"'),
    duration: 0,
    btn() {
      return h(
        Button,
        { size: 'small', onClick: () => window.location.reload() },
        { default: () => WeiI18n.$t('刷新') },
      )
    },
  })
}

/** 版本信息 */
export interface WeiUpdateCheckerVersion {
  /** 本地版本号 */
  local: string
  /** 远程版本号 */
  remote: string | undefined
}

// const focused = useWindowFocus()
// watch(focused, check)

const { idle } = useIdle(10000)

/** 检测版本更新 */
async function check() {
  // 开发环境不启用更新检测
  if (import.meta.env.DEV)
    return
  // 当用户处于空闲状态(无操作 10s 后)时暂停轮询请求, 参考 http://www.vueusejs.com/core/useIdle/#useidle
  if (idle.value || showUpdateTips.value)
    return
  // if (!focused.value || showUpdateTips.value) return
  version.local = getLocalVersion()
  version.remote = await getRemoteVersion()
  if (allowUpdate.value) {
    console.log(`update version: ${version.local} => ${version.remote}`)
    if (!showUpdateTips.value)
      showUpdateTipsDialog()
    stop()
  }
}

watch(idle, check)

let checkInterval: any
/** 更新检测间隔时间 */
const timeout = ref<number>(7000)

/**
 * 启动更新检测
 * @param updateTimeout 更新检测间隔时间 ms
 * @param clear 是否停止已有的更新检测
 */
function start(updateTimeout?: number, clear?: boolean) {
  if (import.meta.env.DEV)
    return
  if (updateTimeout)
    timeout.value = updateTimeout
  if (clear)
    stop()
  if (checkInterval)
    return
  check()
  checkInterval = setInterval(check, timeout.value)
}

/** 停止更新检测 */
function stop() {
  if (checkInterval)
    clearInterval(checkInterval)
  checkInterval = undefined
}

export function useWeiUpdateChecker() {
  return {
    timeout,
    start,
    stop,
    version,
    showUpdateTips,
    showUpdateTipsDialog,
  }
}
