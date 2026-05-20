import { reactive } from 'vue'

export interface dialogOptions {
  isShowContent?: boolean
  content?: string
  component?: any
  props?: Record<string, any>
  width?: string
  visible?: any
  isShowHeader?: boolean
  headerIconType?: string
  headerTitle?: string
  isShowFooter?: boolean
  isShowLeftButton?: boolean
  isShowRightButton?: boolean
  isShowMiddleButton?: boolean
  footerLeftButtonDisabled?: boolean
  footerRightButtonDisabled?: boolean
  footerMiddleButtonDisabled?: boolean
  footerLeftButtonText?: string
  footerRightButtonText?: string
  footerMiddleButtonText?: string
  tooltip?: any
  closeable?: boolean // 默认值为true
  callback?: (args: any, isNativeClose?: boolean) => any
  closeOnClickModal?: boolean
  beforeClose?: (action: any) => void | Promise<void>
}
export const DIALOG_LIST = reactive<dialogOptions[]>([])
// 默认初始化
const initDialogOptions = (options: dialogOptions) => {
  // 默认都给带上closeable
  if (options.closeable === undefined) {
    options.closeable = true
  }
  // 默认禁用底部按钮的tooltip
  if (options.tooltip === undefined) {
    options.tooltip = {
      leftButton: {
        disabled: true
      },
      middleButton: {
        disabled: true
      },
      rightButton: {
        disabled: true
      }
    }
  }
  // 默认显示头部
  if (options.isShowHeader === undefined) {
    options.isShowHeader = true
  }
  // 默认显示内容
  if (options.isShowContent === undefined) {
    options.isShowContent = true
  }
  // 默认显示底部
  if (options.isShowFooter === undefined) {
    options.isShowFooter = true
  }
  // 默认显示底部左侧按钮、右侧按钮
  if (options.isShowLeftButton === undefined) {
    options.isShowLeftButton = true
    if (options.footerLeftButtonText === undefined) {
      options.footerLeftButtonText = '取消'
    }
  }
  if (options.isShowRightButton === undefined) {
    options.isShowRightButton = true
    if (options.footerRightButtonText === undefined) {
      options.footerRightButtonText = '确定'
    }
  }
}
const useAppDialog = () => {
  const showAppDialog = (options: dialogOptions) => {
    initDialogOptions(options)
    DIALOG_LIST.push({ ...options, visible: true })
  }
  const closeAppDialog = (item: dialogOptions, index: number, args?: any, isNativeClose?: boolean) => {
    DIALOG_LIST.splice(index, 1)
    if (item.callback) {
      item.callback(args, isNativeClose)
    }
  }
  return {
    showAppDialog,
    closeAppDialog
  }
}
export default useAppDialog
