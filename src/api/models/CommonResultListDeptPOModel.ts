import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListDeptPO } from '../tags/data-contracts';

import { DeptPOModel } from './DeptPOModel';

export class CommonResultListDeptPOModel extends BaseModel implements CommonResultListDeptPO {
  /** @format int32 */
  code?: number = 0;
  data?: Array<DeptPOModel> = [];
  msg?: string = '';
}
