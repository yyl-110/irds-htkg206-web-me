import { BaseModel } from '@/utils/BaseModel';
import type { PageResultDictTypeResponseDTO } from '../tags/data-contracts';

import { DictTypeResponseDTOModel } from './DictTypeResponseDTOModel';

/** 分页结果 */
export class PageResultDictTypeResponseDTOModel extends BaseModel implements PageResultDictTypeResponseDTO {
  list: Array<DictTypeResponseDTOModel> = [];
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
