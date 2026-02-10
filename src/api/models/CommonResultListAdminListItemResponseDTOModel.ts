import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListAdminListItemResponseDTO } from '../tags/data-contracts';

import { AdminListItemResponseDTOModel } from './AdminListItemResponseDTOModel';

export class CommonResultListAdminListItemResponseDTOModel extends BaseModel implements CommonResultListAdminListItemResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<AdminListItemResponseDTOModel> = [];
  msg?: string = '';
}
