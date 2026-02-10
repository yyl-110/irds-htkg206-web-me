import type { RowProps } from 'ant-design-vue'

export enum WeiQueryColGrid {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  xxxl,
}

export class WeiQueryColGridConfig {
  /** ant-design-vue 的媒体查询 breakpoint 值 */
  static readonly BREAKPOINTS: Record<keyof typeof WeiQueryColGrid, number> = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 993,
    xl: 1200,
    xxl: 1600,
    xxxl: 2000,
  }

  /** 在数据表格的查询栏中的表单项的栅格 grid 配置 */
  static readonly COL_SIZE: Record<keyof typeof WeiQueryColGrid, number> = {
    xxxl: 4,
    xxl: 4,
    xl: 6,
    lg: 8,
    md: 12,
    sm: 24,
    xs: 24,
  }

  /** 在数据表格的查询栏中的表单项的栅格 grid gutter 配置 */
  static readonly ROW_GUTTER: RowProps['gutter'] = [20, 0]
}
