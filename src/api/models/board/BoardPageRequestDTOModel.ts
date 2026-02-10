import { BaseModel } from '@/utils/BaseModel';
import type { BoardPageRequestPO } from '../../tags/board/BoardPageRequestPO';

/** 数据 */
export class BoardPageRequestDTOModel extends BaseModel implements BoardPageRequestPO {
  /**
   * 区域模糊查询
   */
  reportIndex: String = '';
  /**
   * 看板名称
   */
  reportName: String = '';
}
