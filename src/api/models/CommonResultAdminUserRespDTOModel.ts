import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultAdminUserRespDTO } from '../tags/data-contracts';

import { AdminUserRespDTOModel } from './AdminUserRespDTOModel';

export class CommonResultAdminUserRespDTOModel extends BaseModel implements CommonResultAdminUserRespDTO {
  /** @format int32 */
  code?: number = 0;
  data?: AdminUserRespDTOModel = new AdminUserRespDTOModel();
  msg?: string = '';
}
