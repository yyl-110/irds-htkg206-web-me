import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultOperateLogResponseDTO } from '../tags/data-contracts';

import { PageResultOperateLogResponseDTOModel } from './PageResultOperateLogResponseDTOModel';

export class CommonResultPageResultOperateLogResponseDTOModel extends BaseModel implements CommonResultPageResultOperateLogResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultOperateLogResponseDTOModel = new PageResultOperateLogResponseDTOModel();

  msg?: string = '';
}
