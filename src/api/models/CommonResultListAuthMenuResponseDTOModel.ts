import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListAuthMenuResponseDTO } from '../tags/data-contracts';

import { AuthMenuResponseDTOModel } from './AuthMenuResponseDTOModel';

export class CommonResultListAuthMenuResponseDTOModel extends BaseModel implements CommonResultListAuthMenuResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<AuthMenuResponseDTOModel> = [];
  msg?: string = '';
}
