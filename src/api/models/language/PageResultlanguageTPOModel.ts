import { BaseModel } from '@/utils/BaseModel';
import type { PageResultlanguagePO } from '../../tags/data-contracts';
import { languagelistPOMtype } from './languagelistPOMtype';
/** 分页结果 */
export class PageResultlanguageTPOModel extends BaseModel implements PageResultlanguagePO {
  forEach(arg0: (item: any) => void) {
    throw new Error('Method not implemented.');
  }
  /** 数据 */
  list: Array<languagelistPOMtype> = [];
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
