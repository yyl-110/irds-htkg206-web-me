import { BaseModel } from '@/utils/BaseModel';
import { OrderNumberPOModel } from './OrderNumberPOModel';

/** 分页结果 */
export class PageResultOrderNumberPOModel extends BaseModel {
  forEach(arg0: (item: any) => void) {
    throw new Error('Method not implemented.');
  }
  /** 数据 */
  list: Array<OrderNumberPOModel> = [];
  dataList?: Array<OrderNumberPOModel> = [];
  /**
   * 年份数据
   * @format int64
   */
  yearList?: Array<OrderNumberPOModel> = [];
  /**
   * 图标数据
   * @format int64
   */
  chartDataList?: Array<OrderNumberPOModel> = [];
  /**
   * 件号
   * @format int64
   */
  fittingCode?: string = '';
  /**
   * 城市名称
   * @format int64
   */
  fittingName?: string = '';
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
