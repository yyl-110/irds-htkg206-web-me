import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultUserPageItemResponseDTO } from '../tags/data-contracts';

import { PageResultUserPageItemResponseDTOModel } from './PageResultUserPageItemResponseDTOModel';

export class CommonResultPageResultUserPageItemResponseDTOModel extends BaseModel implements CommonResultPageResultUserPageItemResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultUserPageItemResponseDTOModel = new PageResultUserPageItemResponseDTOModel();
  msg?: string = '';
}
