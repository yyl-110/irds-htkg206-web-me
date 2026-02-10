import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultUserPageItemResponseDTO } from '../tags/data-contracts';

import { UserPageItemResponseDTOModel } from './UserPageItemResponseDTOModel';

export class CommonResultUserPageItemResponseDTOModel extends BaseModel implements CommonResultUserPageItemResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: UserPageItemResponseDTOModel = new UserPageItemResponseDTOModel();

  msg?: string = '';
}
