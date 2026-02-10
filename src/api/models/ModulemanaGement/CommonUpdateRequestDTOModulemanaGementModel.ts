import { BaseModel } from '@/utils/BaseModel';
import type { MenuUpdateRequestDTO, PriceUpdateRequestDTO } from '../../tags/data-contracts';

/** 管理后台 - 菜单更新 Request DTO */
export class CommonUpdateRequestDTOModulemanaGementModel extends BaseModel implements MenuUpdateRequestDTO {
  /**
   * 菜单名称
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  name: string = '';
  /**
   * 类型,参见 MenuTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: string = '';
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort?: number = 0;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId?: number = 0;
  /**
   * 路由地址,仅菜单类型为菜单或者目录时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "post"
   */
  path?: string = '';
  /**
   * 菜单编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 销售编号
   * @format int64
   * @example 1024
   */
  salesOfficeNumber?: string = '';
}

/** 管理后台 - 价格更新 Request DTO */
export class CommonUpdateRequestDTOPriceGementModel extends BaseModel implements PriceUpdateRequestDTO {
  /**
   * 零件编号
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  partNumber: string = '';
  /**
   * 海外价格
   * @format int32
   * @example 1
   */
  overseaPrice: string = '';
  /**
   * 零售价格
   * @format int32
   * @example 1024
   */
  retailPrice?: string = '';
  /**
   * 三包回购价格
   * @format int64
   * @example 1024
   */
  threePacks?: string = '';
  /**
   * 通用价格
   * @minLength 0
   * @maxLength 200
   * @example "post"
   */
  universalPrice?: string = '';
  /**
   * 	ID;主键
   * @format int64
   * @example 1024
   */
  id: number = 0;
}
