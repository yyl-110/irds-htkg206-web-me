import type { VxeUI } from 'vxe-table'

/** vxe-table 格式化配置 Key */
export enum VxeRenderersKey {
  /** 显示为开关, 点击后会触发二次确认弹窗 */
  switchConfirm = 'switchConfirm',
}

type VxeRenderer = Parameters<typeof VxeUI.renderer.add>[1]

/** vxe-table renderers */
export const vxeRenderers: Record<VxeRenderersKey, VxeRenderer> = {
  [VxeRenderersKey.switchConfirm]: {
    renderTableDefault(renderOpts, params) {
      return [
      ]
    },
  },
}
