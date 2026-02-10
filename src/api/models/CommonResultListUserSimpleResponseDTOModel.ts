import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListUserSimpleResponseDTO } from '../tags/data-contracts';

import { UserSimpleResponseDTOModel } from './UserSimpleResponseDTOModel';

export class CommonResultListUserSimpleResponseDTOModel extends BaseModel implements CommonResultListUserSimpleResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<UserSimpleResponseDTOModel> = [];
  msg?: string = '';
}
