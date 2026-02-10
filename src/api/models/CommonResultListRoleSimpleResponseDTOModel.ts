import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListRoleSimpleResponseDTO } from '../tags/data-contracts';

import { RoleSimpleResponseDTOModel } from './RoleSimpleResponseDTOModel';

export class CommonResultListRoleSimpleResponseDTOModel extends BaseModel implements CommonResultListRoleSimpleResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<RoleSimpleResponseDTOModel> = [];
  msg?: string = '';
}
