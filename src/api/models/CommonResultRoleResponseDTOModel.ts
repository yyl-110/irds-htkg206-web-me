import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultRoleResponseDTO } from '../tags/data-contracts';

import { RoleResponseDTOModel } from './RoleResponseDTOModel';

export class CommonResultRoleResponseDTOModel extends BaseModel implements CommonResultRoleResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: RoleResponseDTOModel = new RoleResponseDTOModel();
  msg?: string = '';
}
