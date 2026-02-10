import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultDeptResponseDTO } from '../tags/data-contracts';

import { DeptResponseDTOModel } from './DeptResponseDTOModel';

export class CommonResultDeptResponseDTOModel extends BaseModel implements CommonResultDeptResponseDTO {
  /** @format int32 */
  code?: number = 0;
  /** 管理后台 - 部门信息 Response DTO */
  data?: DeptResponseDTOModel = new DeptResponseDTOModel();
  msg?: string = '';
}
