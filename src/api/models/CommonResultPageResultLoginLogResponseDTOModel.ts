import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultLoginLogResponseDTO } from '../tags/data-contracts';

import { PageResultLoginLogResponseDTOModel } from './PageResultLoginLogResponseDTOModel';

export class CommonResultPageResultLoginLogResponseDTOModel extends BaseModel implements CommonResultPageResultLoginLogResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultLoginLogResponseDTOModel = new PageResultLoginLogResponseDTOModel();
  msg?: string = '';
}
