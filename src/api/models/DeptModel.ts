import { BaseModel } from '@/utils/BaseModel';
import type { Dept } from '../tags/data-contracts';

/** 部门 */
export class DeptModel extends BaseModel implements Dept {
  /**
   * 部门编号
   * @format int64
   * @example 1
   */
  id: number = 0;
  /**
   * 部门名称
   * @example "研发部"
   */
  name: string = '';
}
