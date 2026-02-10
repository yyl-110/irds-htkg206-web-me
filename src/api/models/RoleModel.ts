import { BaseModel } from '@/utils/BaseModel';
import type { Role } from '../tags/data-contracts';

/** 角色 */
export class RoleModel extends BaseModel implements Role {
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  id: number = 0;
  /**
   * 角色名称
   * @example "普通角色"
   */
  name: string = '';
}
