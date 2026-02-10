import { BaseModel } from '@/utils/BaseModel';
import type { PageResultDictDataResponseDTO } from '../tags/data-contracts';

import { DictDataResponseDTOModel } from './DictDataResponseDTOModel';

/** 分页结果 */
export class PageResultDictDataResponseDTOModel extends BaseModel implements PageResultDictDataResponseDTO {
  list: Array<DictDataResponseDTOModel> = [];
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
