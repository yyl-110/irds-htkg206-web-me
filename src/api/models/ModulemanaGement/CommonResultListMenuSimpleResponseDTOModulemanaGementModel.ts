import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListMenuSimpleResponseDTO } from '../../tags/data-contracts';

import { MenuSimpleResponseDTOModel } from '../MenuSimpleResponseDTOModel';

export class CommonResultListMenuSimpleResponseDTOModulemanaGementModel extends BaseModel implements CommonResultListMenuSimpleResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<MenuSimpleResponseDTOModel> = [];
  msg?: string = '';
}
