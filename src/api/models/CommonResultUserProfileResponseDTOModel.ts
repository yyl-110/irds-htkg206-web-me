import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultUserProfileResponseDTO } from '../tags/data-contracts';

import { UserProfileResponseDTOModel } from './UserProfileResponseDTOModel';

export class CommonResultUserProfileResponseDTOModel extends BaseModel implements CommonResultUserProfileResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: UserProfileResponseDTOModel = new UserProfileResponseDTOModel();
  msg?: string = '';
}
