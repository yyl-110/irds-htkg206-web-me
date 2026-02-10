import { BaseModel } from '@/utils/BaseModel';
import type { DeptSimpleResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 部门精简信息 Response DTO */
export class DeptSimpleResponseDTOModel extends BaseModel implements DeptSimpleResponseDTO {
  /**
   * 部门编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 部门代码
   * @example "10086"
   */
  code: string = '';
  /**
   * 部门名称
   * @example ""
   */
  name: string = '';
  /**
   * 父部门 ID
   * @format int64
   * @example 1024
   */
  parentId: number = 0;
}
