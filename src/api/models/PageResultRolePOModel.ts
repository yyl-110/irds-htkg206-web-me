import { BaseModel } from '@/utils/BaseModel';
import type { PageResultRolePO } from '../tags/data-contracts';

import { RolePOModel } from './RolePOModel';

/** 分页结果 */
export class PageResultRolePOModel extends BaseModel implements PageResultRolePO {
  list: Array<RolePOModel> = [];
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
