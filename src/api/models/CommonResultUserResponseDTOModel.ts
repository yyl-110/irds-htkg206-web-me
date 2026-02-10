import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultUserResponseDTO } from '../tags/data-contracts';

import { UserResponseDTOModel } from './UserResponseDTOModel';

export class CommonResultUserResponseDTOModel extends BaseModel implements CommonResultUserResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: UserResponseDTOModel = new UserResponseDTOModel();
  msg?: string = '';
}
