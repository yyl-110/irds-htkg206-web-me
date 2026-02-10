import { BaseModel } from '@/utils/BaseModel';
import type { DictTypeSimpleResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 字典类型精简信息 Response DTO */
export class DictTypeSimpleResponseDTOModel extends BaseModel implements DictTypeSimpleResponseDTO {
  /**
   * 字典类型编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 字典类型名称
   * @example ""
   */
  name: string = '';
  /**
   * 字典类型
   * @example "sys_common_sex"
   */
  type: string = '';
}
