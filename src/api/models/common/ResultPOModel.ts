import { BaseModel } from '@/utils/BaseModel';
import type { ResultDictionaryPO } from '../../tags/data-contracts';
import { DictionaryPOModel } from './DictionaryPOModel';

/** 分页结果 */
export class ResultPOModel extends BaseModel implements ResultDictionaryPO {
  forEach(arg0: (item: any) => void) {
    throw new Error('Method not implemented.');
  }
  list: Array<DictionaryPOModel> = [];

  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
