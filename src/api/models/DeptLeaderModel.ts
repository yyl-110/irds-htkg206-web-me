import { BaseModel } from '@/utils/BaseModel';
import type { DeptLeader } from '../tags/data-contracts';

/**
 * 部门负责人
 * @example "部门负责人"
 */
export class DeptLeaderModel extends BaseModel implements DeptLeader {
  /**
   * 负责人ID
   * @format int64
   * @example 1
   */
  id: number = 0;
  /**
   * 负责人名称
   * @example "admin"
   */
  name: string = '';
  /**
   * 负责人nickname
   * @example "admin"
   */
  nickname: string = '';
}
