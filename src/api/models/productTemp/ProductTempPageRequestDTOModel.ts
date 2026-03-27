import { BaseModel } from '@/utils/BaseModel';
import type { ProductTempRequestPO } from '../../tags/productTemp/productTemp';

/** 数据 */
export class ProductTempPageRequestDTOModel extends BaseModel implements ProductTempRequestPO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  currentPage: number = 0;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  numberPage: number = 0;

  pageNo: number = 0;
  pageSize: number = 0;

  /**
   *  模板编号
   * @example ""
   */
  tempNum?: string = '';
  /**
   * 模板名称
   * @example ""
   */
  tempName?: string = '';

  id?: string = '';

  userid?: number = 0;
}
