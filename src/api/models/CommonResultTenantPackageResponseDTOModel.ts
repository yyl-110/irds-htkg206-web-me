import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultTenantPackageResponseDTO } from '../tags/data-contracts';

import { TenantPackageResponseDTOModel } from './TenantPackageResponseDTOModel';

export class CommonResultTenantPackageResponseDTOModel extends BaseModel implements CommonResultTenantPackageResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: TenantPackageResponseDTOModel = new TenantPackageResponseDTOModel();
  msg?: string = '';
}
