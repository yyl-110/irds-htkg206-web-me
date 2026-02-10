import { BaseModel } from '@/utils/BaseModel';
import type { DeptUserRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 组织架构 Request DTO */
export class DeptUserRequestDTOModel extends BaseModel implements DeptUserRequestDTO {
  /** @format int64 */
  parentId?: number = 0;
}
