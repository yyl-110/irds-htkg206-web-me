import { BaseModel } from '@/utils/BaseModel';
import { PageResultLoginLogPOModel } from './PageResultLoginLogPOModel';
import type { CommonResultPageResultLoginLogDTO } from '../../tags/data-contracts';

export class CommonResultPageResultLoginLogPOModel extends BaseModel implements CommonResultPageResultLoginLogDTO {
  /** @format int32 */
  data?: PageResultLoginLogPOModel = new PageResultLoginLogPOModel();
  msg?: string = '';
  code?: number = 0;
}
