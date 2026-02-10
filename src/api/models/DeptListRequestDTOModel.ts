import { BaseModel } from '@/utils/BaseModel';
import type { DeptListRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 部门列表 Request DTO */
export class DeptListRequestDTOModel extends BaseModel implements DeptListRequestDTO {
  /**
   * 部门名称,模糊匹配
   * @example ""
   */
  name?: string = '';
  /**
   * 展示状态,参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number = 0;
  /**
   * 父部门ID
   * @format int32
   * @example 0
   */
  parentId?: number = 0;
}
