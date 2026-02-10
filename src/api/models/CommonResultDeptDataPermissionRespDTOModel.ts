import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultDeptDataPermissionRespDTO } from '../tags/data-contracts';

import { DeptDataPermissionRespDTOModel } from './DeptDataPermissionRespDTOModel';

export class CommonResultDeptDataPermissionRespDTOModel extends BaseModel implements CommonResultDeptDataPermissionRespDTO {
  /** @format int32 */
  code?: number = 0;
  data?: DeptDataPermissionRespDTOModel = new DeptDataPermissionRespDTOModel();
  msg?: string = '';
}
