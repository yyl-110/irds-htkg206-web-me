import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListDictTypeSimpleResponseDTO } from '../tags/data-contracts';

import { DictTypeSimpleResponseDTOModel } from './DictTypeSimpleResponseDTOModel';

export class CommonResultListDictTypeSimpleResponseDTOModel extends BaseModel implements CommonResultListDictTypeSimpleResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<DictTypeSimpleResponseDTOModel> = [];
  msg?: string = '';
}
