import { BaseModel } from '@/utils/BaseModel';
import type { DeptDeleteRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 部门删除 Request DTO */
export class DeptDeleteRequestDTOModel extends BaseModel implements DeptDeleteRequestDTO {
  /**
   * 部门编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
}
