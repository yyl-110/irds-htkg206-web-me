import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListTenantResponseDTO } from '../tags/data-contracts';

import { TenantResponseDTOModel } from './TenantResponseDTOModel';

export class CommonResultListTenantResponseDTOModel extends BaseModel implements CommonResultListTenantResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<TenantResponseDTOModel> = [];
  msg?: string = '';
}
