import { BaseModel } from '@/utils/BaseModel';
import type { MenuResponseDTO } from '../../tags/data-contracts';

/** 管理后台 - 菜单信息 Response DTO */
export class CommonResponseDTOModulemanaGementModel extends BaseModel implements MenuResponseDTO {
  /**
   * 菜单名称
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  name: string = '';
  /**
   * 权限标识,仅菜单类型为按钮时，才需要传递
   * @minLength 0
   * @maxLength 100
   * @example "sys:menu:add"
   */
  permission?: string = '';
  /**
   * 类型,参见 MenuTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: number = 0;
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort: number = 0;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId: number = 0;
  /**
   * 路由地址,仅菜单类型为菜单或者目录时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "post"
   */
  path?: string = '';
  /**
   * 菜单图标,仅菜单类型为菜单或者目录时，才需要传
   * @example "/menu/list"
   */
  icon?: string = '';
  /**
   * 组件路径,仅菜单类型为菜单时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "system/post/index"
   */
  component?: string = '';
  /**
   * 组件名
   * @example "SystemUser"
   */
  componentName?: string = '';
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number = 0;
  /**
   * 是否可见
   * @example false
   */
  visible?: boolean = false;
  /**
   * 是否缓存
   * @example false
   */
  keepAlive?: boolean = false;
  /**
   * 是否总是显示
   * @example false
   */
  alwaysShow?: boolean = false;
  /**
   * 菜单编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string = '';
}
