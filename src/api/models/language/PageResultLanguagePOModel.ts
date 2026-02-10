import { BaseModel } from '@/utils/BaseModel';
import type { PageResultLanguagePO } from '../../tags/data-contracts';

import { LanguagePOModel } from './LanguagePOModel';
import { ColumnsLanguagePOModel } from '@/api/models/language/LanguagePOModel';

/** 分页结果 */
export class PageResultLanguagePOModel extends BaseModel implements PageResultLanguagePO {
  forEach(arg0: (item: any) => void) {
    throw new Error('Method not implemented.');
  }
  list: Array<LanguagePOModel> = [];
  language: Array<ColumnsLanguagePOModel> = [];
  data: Array<LanguagePOModel> = [];

  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
