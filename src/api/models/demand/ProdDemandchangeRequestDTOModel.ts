import { BaseModel } from '@/utils/BaseModel';

/** 需求验收-请求列表数据 */
export class ProdDemandchangeRequestDTOModel extends BaseModel {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo?: number = 0;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize?: number = 0;
  /**
   * 需求编号
   * @example ''
   */
  demandNum?: string = '';
  /**
   * 需求标题
   * @example ''
   */
  demandTitle?: string = '';
  /**
   * 需求来源
   * @example ''
   */
  demandSource?: string = '';
  /**
   * 区域市场
   * @example ''
   */
  regionalMarket?: string = '';
  /**
   * 任务状态
   * @example ''
   */
  taskStatus?: string = '';
  /**
   * 需求状态
   * @example ''
   */
  status?: string = '';
}
