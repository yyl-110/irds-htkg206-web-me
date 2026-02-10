import { BaseModel } from '@/utils/BaseModel';
import type { AuthMenuResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 登录用户的菜单信息 Response DTO */
export class AuthMenuResponseDTOModel extends BaseModel implements AuthMenuResponseDTO {
  /**
   * 菜单名称
   * @format int64
   */
  id: number = 0;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId: number = 0;
  /**
   * 菜单名称
   * @example ""
   */
  name: string = '';
  /**
   * 路由地址,仅菜单类型为菜单或者目录时，才需要传
   * @example "post"
   */
  path?: string = '';
  /**
   * 组件路径,仅菜单类型为菜单时，才需要传
   * @example "system/post/index"
   */
  component?: string = '';
  /**
   * 组件名
   * @example "SystemUser"
   */
  componentName?: string = '';
  /**
   * 菜单图标,仅菜单类型为菜单或者目录时，才需要传
   * @example "/menu/list"
   */
  icon?: string = '';
  /**
   * 是否可见
   * @example false
   */
  visible: boolean = false;
  /**
   * 是否缓存
   * @example false
   */
  keepAlive: boolean = false;
  /**
   * 是否总是显示
   * @example false
   */
  alwaysShow?: boolean = false;
}
