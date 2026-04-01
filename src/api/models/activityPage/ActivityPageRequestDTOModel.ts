import { BaseModel } from '@/utils/BaseModel';
import type { ActivityPageRequestPO } from '../../tags/activityPage/activityPage';

/** 数据 */
export class ActivityPageRequestDTOModel extends BaseModel implements ActivityPageRequestPO {
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
   *  活动名称
   * @example ""
   */
  pageName: string = '';

  treeId: string = '';

  userid?: number = 0;
}
