import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultTenantPackageResponseDTO } from '../tags/data-contracts';

import { PageResultTenantPackageResponseDTOModel } from './PageResultTenantPackageResponseDTOModel';

export class CommonResultPageResultTenantPackageResponseDTOModel extends BaseModel implements CommonResultPageResultTenantPackageResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultTenantPackageResponseDTOModel = new PageResultTenantPackageResponseDTOModel();
  msg?: string = '';
}
