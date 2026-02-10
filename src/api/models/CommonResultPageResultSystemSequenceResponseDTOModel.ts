import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultSystemSequenceResponseDTO } from '../tags/data-contracts';

import { PageResultSystemSequenceResponseDTOModel } from './PageResultSystemSequenceResponseDTOModel';

export class CommonResultPageResultSystemSequenceResponseDTOModel extends BaseModel implements CommonResultPageResultSystemSequenceResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultSystemSequenceResponseDTOModel = new PageResultSystemSequenceResponseDTOModel();

  msg?: string = '';
}
