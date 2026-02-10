import { BaseModel } from '@/utils/BaseModel';
import type { RoleMenuRespDTO } from '../tags/data-contracts';

/** 角色菜单resp */
export class RoleMenuRespDTOModel extends BaseModel implements RoleMenuRespDTO {
  /**
   * id
   * @format int64
   */
  id?: number = 0;
  /**
   * 角色ID
   * @format int64
   */
  roleId?: number = 0;
  /**
   * 菜单ID
   * @format int64
   */
  menuId?: number = 0;
}
