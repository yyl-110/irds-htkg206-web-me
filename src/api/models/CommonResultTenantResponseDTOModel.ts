import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultTenantResponseDTO } from '../tags/data-contracts';

import { TenantResponseDTOModel } from './TenantResponseDTOModel';

export class CommonResultTenantResponseDTOModel extends BaseModel implements CommonResultTenantResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: TenantResponseDTOModel = new TenantResponseDTOModel();
  msg?: string = '';
}
