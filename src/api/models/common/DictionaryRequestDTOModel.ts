import { BaseModel } from '@/utils/BaseModel';
import type { DictionaryPO } from '../../tags/data-contracts';
/** 管理后台 -分页搜索条件  Request DTO */
export class DictionaryRequestDTOModel extends BaseModel implements DictionaryPO {
  /**
   * 行业（字典：INDUSTRY）
   */
  category?: string = '';

  /**
   * list （字典：INDUSTRY）
   */
  categoryList?: Array<any> = [];
}
