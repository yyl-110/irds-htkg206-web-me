import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListDeptRespDTO } from '../tags/data-contracts';

import { DeptRespDTOModel } from './DeptRespDTOModel';

export class CommonResultListDeptRespDTOModel extends BaseModel implements CommonResultListDeptRespDTO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<DeptRespDTOModel> = [];
  msg?: string = '';
}
