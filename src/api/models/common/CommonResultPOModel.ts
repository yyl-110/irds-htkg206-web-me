import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultPO } from '../../tags/data-contracts';
import { ResultPOModel } from './ResultPOModel';

export class CommonResultPOModel extends BaseModel implements CommonResultPageResultPO {
  /** @format int32 */
  code?: number = 0;
  data?: ResultPOModel = new ResultPOModel();
  msg?: string = '';
}
