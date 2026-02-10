import { BaseModel } from '@/utils/BaseModel';
import type { PageResultOperateLogResponseDTO } from '../tags/data-contracts';

import { OperateLogResponseDTOModel } from './OperateLogResponseDTOModel';

/** 分页结果 */
export class PageResultOperateLogResponseDTOModel extends BaseModel implements PageResultOperateLogResponseDTO {
  list: Array<OperateLogResponseDTOModel> = [];

  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
