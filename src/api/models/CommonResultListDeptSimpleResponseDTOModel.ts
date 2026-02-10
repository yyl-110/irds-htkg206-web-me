import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListDeptSimpleResponseDTO } from '../tags/data-contracts';

import { DeptSimpleResponseDTOModel } from './DeptSimpleResponseDTOModel';

export class CommonResultListDeptSimpleResponseDTOModel extends BaseModel implements CommonResultListDeptSimpleResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<DeptSimpleResponseDTOModel> = [];
  msg?: string = '';
}
