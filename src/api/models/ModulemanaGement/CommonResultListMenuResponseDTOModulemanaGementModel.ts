import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListMenuResponseDTO } from '../../tags/data-contracts';

import { MenuResponseDTOModel } from '../MenuResponseDTOModel';

export class CommonResultListMenuResponseDTOModulemanaGementModel extends BaseModel implements CommonResultListMenuResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<MenuResponseDTOModel> = [];
  msg?: string = '';
}
