import { BaseModel } from '@/utils/BaseModel';
import type { ParameterPageRequestPO } from '../../tags/parameter/ParameterPageRequestPO';

/** 数据 */
export class ParameterPageRequestDTOModel extends BaseModel implements ParameterPageRequestPO {
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

  parameterName?: string = '';
  parameterNum?: string = '';

  categoryid?: string = '';
  userId?: number = 0;
}
