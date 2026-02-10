import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListLanguageResponseDTO } from '../tags/data-contracts';

import { LanguageResponseDTOModel } from './LanguageResponseDTOModel';

export class CommonResultListLanguageResponseDTOModel extends BaseModel implements CommonResultListLanguageResponseDTO {
  /** @format int32 */
  data?: Array<LanguageResponseDTOModel> = [];
  msg?: string = '';
}
