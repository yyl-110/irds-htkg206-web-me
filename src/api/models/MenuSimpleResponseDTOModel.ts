import { BaseModel } from '@/utils/BaseModel';
import type { MenuSimpleResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 菜单精简信息 Response DTO */
export class MenuSimpleResponseDTOModel extends BaseModel implements MenuSimpleResponseDTO {
  /**
   * 菜单编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 菜单名称
   * @example ""
   */
  name: string = '';
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId: number = 0;
  /**
   * 类型，参见 MenuTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: number = 0;
}
