import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListUserListItemResponseDTO } from '../tags/data-contracts';

import { UserListItemResponseDTOModel } from './UserListItemResponseDTOModel';

export class CommonResultListUserListItemResponseDTOModel extends BaseModel implements CommonResultListUserListItemResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<UserListItemResponseDTOModel> = [];
  msg?: string = '';
}
