import { BaseModel } from '@/utils/BaseModel';
import type { DictTypePageRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 字典类型分页列表 Request DTO */
export class DictTypePageRequestDTOModel extends BaseModel implements DictTypePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number = 0;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 0;
  /**
   * 字典类型名称，模糊匹配
   * @example ""
   */
  name?: string = '';
  /**
   * 字典类型，模糊匹配
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  type?: string = '';
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number = 0;
  /** 创建时间 */
  createTime?: Array<string> = [];
}
