import { BaseModel } from '@/utils/BaseModel';
import type { MenuListRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 菜单列表 Request DTO */
export class MenuListRequestDTOModel extends BaseModel implements MenuListRequestDTO {
  /**
   * 菜单名称，模糊匹配
   * @example ""
   */
  name?: string = '';
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number = 0;
}
