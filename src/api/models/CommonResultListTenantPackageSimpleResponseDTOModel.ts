import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListTenantPackageSimpleResponseDTO } from '../tags/data-contracts';

import { TenantPackageSimpleResponseDTOModel } from './TenantPackageSimpleResponseDTOModel';

export class CommonResultListTenantPackageSimpleResponseDTOModel extends BaseModel implements CommonResultListTenantPackageSimpleResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<TenantPackageSimpleResponseDTOModel> = [];
  msg?: string = '';
}
