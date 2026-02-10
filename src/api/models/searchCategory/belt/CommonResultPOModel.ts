import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultResultBeltPO } from '../../../tags/data-contracts';

import { RequestAllDTOModel, RequestApplyDTOModel, RequestDTOModel, RequestDTOModel2, RequestReplaceDTOModel } from './ResultPOModel';

export class CommonResultPOModel extends BaseModel implements CommonResultResultBeltPO {
  /** @format int32 */
  code?: number = 0;
  // data: Array<RequestDTOModel> = [];
  // data?: Array<RequestDTOModel>;

  data?: RequestDTOModel = new RequestDTOModel();
  msg?: string = '';
}

export class CommonResultPOModel2 extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data: Array<RequestDTOModel2> = [];
  msg?: string = '';
}

export class CommonAllResultPOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: RequestAllDTOModel = new RequestAllDTOModel();
  msg?: string = '';
}

export class CommonApplyResultPOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: RequestApplyDTOModel = new RequestApplyDTOModel();
  msg?: string = '';
}

export class CommonReplaceResultPOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: RequestReplaceDTOModel = new RequestReplaceDTOModel();
  msg?: string = '';
}
