import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListHelpSimpleResponseDTO } from '../../tags/data-contracts';

import { HelpSimpleResponseDTOModel } from './HelpSimpleResponseDTOModel';

export class CommonResultListHelpSimpleResponseDTOModel extends BaseModel implements CommonResultListHelpSimpleResponseDTO {
  /** @format int32 */
  data?: HelpSimpleResponseDTOModel = new HelpSimpleResponseDTOModel();
  msg?: string = '';
  code?: number = 0;
}
