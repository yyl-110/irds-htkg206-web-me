import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListDictDataSimpleResponseDTO } from '../tags/data-contracts';

import { DictDataSimpleResponseDTOModel } from './DictDataSimpleResponseDTOModel';

export class CommonResultListDictDataSimpleResponseDTOModel extends BaseModel implements CommonResultListDictDataSimpleResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<DictDataSimpleResponseDTOModel> = [];
  msg?: string = '';
}
