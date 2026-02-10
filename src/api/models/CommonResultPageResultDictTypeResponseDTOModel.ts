import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultDictTypeResponseDTO } from '../tags/data-contracts';

import { PageResultDictTypeResponseDTOModel } from './PageResultDictTypeResponseDTOModel';

export class CommonResultPageResultDictTypeResponseDTOModel extends BaseModel implements CommonResultPageResultDictTypeResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultDictTypeResponseDTOModel = new PageResultDictTypeResponseDTOModel();
  msg?: string = '';
}
