import dayjs from 'dayjs'
import type { VxeUI } from 'vxe-table'

/** vxe-table 格式化配置 Key */
export enum VxeFormatsKey {
  /** 时间格式化 */
  dateTime = 'dateTime',
}

/** vxe-table 格式化配置参数 */
export type VxeFormat = Parameters<typeof VxeUI.formats.add>[1]

/** vxe-table formats */
export const vxeFormats: Record<VxeFormatsKey, VxeFormat> = {
  [VxeFormatsKey.dateTime]: {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
