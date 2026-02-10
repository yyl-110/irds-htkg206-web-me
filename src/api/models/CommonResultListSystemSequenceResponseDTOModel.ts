import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListSystemSequenceResponseDTO } from '../tags/data-contracts';

import { SystemSequenceResponseDTOModel } from './SystemSequenceResponseDTOModel';

export class CommonResultListSystemSequenceResponseDTOModel extends BaseModel implements CommonResultListSystemSequenceResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<SystemSequenceResponseDTOModel> = [];

  msg?: string = '';
}
