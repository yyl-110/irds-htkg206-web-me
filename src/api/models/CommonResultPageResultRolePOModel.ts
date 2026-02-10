import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultRolePO } from '../tags/data-contracts';

import { PageResultRolePOModel } from './PageResultRolePOModel';

export class CommonResultPageResultRolePOModel extends BaseModel implements CommonResultPageResultRolePO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultRolePOModel = new PageResultRolePOModel();
  msg?: string = '';
}
