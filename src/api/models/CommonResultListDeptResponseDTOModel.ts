import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListDeptResponseDTO } from '../tags/data-contracts';

import { DeptResponseDTOModel } from './DeptResponseDTOModel';

export class CommonResultListDeptResponseDTOModel extends BaseModel implements CommonResultListDeptResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: any = [];
  msg?: string = '';
}
