import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultTenantResponseDTO } from '../tags/data-contracts';

import { PageResultTenantResponseDTOModel } from './PageResultTenantResponseDTOModel';

export class CommonResultPageResultTenantResponseDTOModel extends BaseModel implements CommonResultPageResultTenantResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultTenantResponseDTOModel = new PageResultTenantResponseDTOModel();
  msg?: string = '';
}
