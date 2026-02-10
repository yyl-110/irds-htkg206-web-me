import { BaseModel } from '@/utils/BaseModel';
import type { DictTypeResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 字典类型信息 Response DTO */
export class DictTypeResponseDTOModel extends BaseModel implements DictTypeResponseDTO {
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
  /**
   * 字典类型
   * @example "sys_common_sex"
   */
  type: string = '';
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string = '';
}
