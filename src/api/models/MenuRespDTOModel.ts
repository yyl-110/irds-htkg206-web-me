import { BaseModel } from '@/utils/BaseModel';
import type { MenuRespDTO } from '../tags/data-contracts';

/** 角色菜单resp */
export class MenuRespDTOModel extends BaseModel implements MenuRespDTO {
  /**
   * id
   * @format int64
   */
  id?: number = 0;
  /** name */
  name?: string = '';
  /** permission */
  permission?: string = '';
  /**
   * type
   * @format int32
   */
  type?: number = 0;
  /**
   * sort
   * @format int32
   */
  sort?: number = 0;
  /**
   * parentId
   * @format int64
   */
  parentId?: number = 0;
  /** path */
  path?: string = '';
  /** icon */
  icon?: string = '';
  /** component */
  component?: string = '';
  /** componentName */
  componentName?: string = '';
  /**
   * status
   * @format int32
   */
  status?: number = 0;
  /** visible */
  visible?: boolean = false;
  /** keepAlive */
  keepAlive?: boolean = false;
  /** alwaysShow */
  alwaysShow?: boolean = false;
}
