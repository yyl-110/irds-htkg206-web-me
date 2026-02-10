import { BaseModel } from '@/utils/BaseModel';
import type { NoticeRequestPO } from '../../tags/notice/notice';

/** 数据 */
export class NoticePageRequestDTOModel extends BaseModel implements NoticeRequestPO {
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
   * 名称，模糊匹配
   * @example ""
   */
  title?: string = '';
  /**
   * 角色标识，模糊匹配
   * @example ""
   */
  type?: string = '';
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  releaseFlag?: number = 0;

  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  userid?: number = 0;

  id?: string = '';
}
