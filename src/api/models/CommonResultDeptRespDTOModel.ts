import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultDeptRespDTO } from '../tags/data-contracts';

import { DeptRespDTOModel } from './DeptRespDTOModel';

export class CommonResultDeptRespDTOModel extends BaseModel implements CommonResultDeptRespDTO {
  /** @format int32 */
  code?: number = 0;
  data?: DeptRespDTOModel = new DeptRespDTOModel();
  msg?: string = '';
}
