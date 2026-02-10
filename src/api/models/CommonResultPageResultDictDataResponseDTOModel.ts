import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultDictDataResponseDTO } from '../tags/data-contracts';

import { PageResultDictDataResponseDTOModel } from './PageResultDictDataResponseDTOModel';

export class CommonResultPageResultDictDataResponseDTOModel extends BaseModel implements CommonResultPageResultDictDataResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultDictDataResponseDTOModel = new PageResultDictDataResponseDTOModel();
  msg?: string = '';
}
