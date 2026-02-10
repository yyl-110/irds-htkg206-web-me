import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultResultOrderNumberReportPO } from '../../../tags/data-contracts';
import { PageResultOrderNumberPOModel } from './PageResultOrderNumberPOModel';
import { OrderNumberPOModel } from './OrderNumberPOModel';

export class CommonResultPageResultOrderNumberPOModel extends BaseModel implements CommonResultResultOrderNumberReportPO {
  /** @format int32 */
  code?: number = 0;
  /** 分页结果 */
  data?: PageResultOrderNumberPOModel = new PageResultOrderNumberPOModel();
  msg?: string = '';
}

export class CommonResultPageResultHotPOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  /** 分页结果 */
  data?: Array<any> = [];
  msg?: string = '';
}
