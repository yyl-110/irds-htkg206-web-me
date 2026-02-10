import { BaseModel } from '@/utils/BaseModel';
import type { DictTypeUpdateRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 字典类型更新 Request DTO */
export class DictTypeUpdateRequestDTOModel extends BaseModel implements DictTypeUpdateRequestDTO {
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
   * 字典类型编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
}
