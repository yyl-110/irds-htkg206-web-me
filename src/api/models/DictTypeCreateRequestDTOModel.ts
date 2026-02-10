import { BaseModel } from '@/utils/BaseModel';
import type { DictTypeCreateRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 字典类型创建 Request DTO */
export class DictTypeCreateRequestDTOModel extends BaseModel implements DictTypeCreateRequestDTO {
  /**
   * 字典名称
   * @minLength 0
   * @maxLength 100
   * @example "性别"
   */
  name: string = '';
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number = 0;
  /**
   * 备注
   * @example "快乐的备注"
   */
  remark?: string = '';
  /**
   * 字典类型
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  type: string = '';
}
