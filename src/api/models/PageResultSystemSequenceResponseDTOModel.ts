import { BaseModel } from '@/utils/BaseModel';
import type { PageResultSystemSequenceResponseDTO } from '../tags/data-contracts';

import { SystemSequenceResponseDTOModel } from './SystemSequenceResponseDTOModel';

/** 分页结果 */
export class PageResultSystemSequenceResponseDTOModel extends BaseModel implements PageResultSystemSequenceResponseDTO {
  list: Array<SystemSequenceResponseDTOModel> = [];

  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
