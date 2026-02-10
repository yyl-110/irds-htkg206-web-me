import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultMenuResponseDTO } from '../tags/data-contracts';

import { MenuResponseDTOModel } from './MenuResponseDTOModel';

export class CommonResultMenuResponseDTOModel extends BaseModel implements CommonResultMenuResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: MenuResponseDTOModel = new MenuResponseDTOModel();
  msg?: string = '';
}
