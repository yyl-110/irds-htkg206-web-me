import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class productPlanTaskDetail extends BaseModel {
  /** 主键id */
  id?: number = 0;
  /** 产品规划ID */
  planId?: number = 0;

  /** 任务ID */
  taskId?: number = 0;

  /** 公司战略愿景 */
  strategicVision?: string = '';

  /** 销售目标 */
  salesTarget?: string = '';

  /** 收入目标 */
  revenueTarget?: string = '';

  /** 盈利增长 */
  profitGrowth?: string = '';

  /** 竞争目标 */
  competitiveTarget?: string = '';

  /** 产品规划组长 */
  teamLeaderUserId?: number = 0;

  /** 研发代表用户ID */
  devUserId?: number = 0;

  /** 市场代表用户ID */
  marketUserId?: number = 0;

  /** 财务代表用户ID */
  financeUserId?: number = 0;

  /** 研发打分标识 */
  devFlag?: number = 0;

  /** 市场打分标识 */
  marketFlag?: number = 0;

  /** 财务打分标识 */
  financeFlag?: number = 0;
}
