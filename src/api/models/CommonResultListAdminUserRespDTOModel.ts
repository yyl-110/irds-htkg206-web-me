import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListAdminUserRespDTO } from '../tags/data-contracts';

import { AdminUserRespDTOModel } from './AdminUserRespDTOModel';

export class CommonResultListAdminUserRespDTOModel extends BaseModel implements CommonResultListAdminUserRespDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<AdminUserRespDTOModel> = [];
  msg?: string = '';
}
