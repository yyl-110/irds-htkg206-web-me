import { BaseModel } from '@/utils/BaseModel';

import { OperateLogResponseDTOModel } from './OperateLogResponseDTOModel';
import type { CommonResultPageResultOperateLogDTO } from '../../tags/data-contracts';

export class CommonResultPageResultOperateLogPOModel extends BaseModel implements CommonResultPageResultOperateLogDTO {
  /** @format int32 */
  data?: OperateLogResponseDTOModel = new OperateLogResponseDTOModel();
  msg?: string = '';
  code?: number = 0;
}
