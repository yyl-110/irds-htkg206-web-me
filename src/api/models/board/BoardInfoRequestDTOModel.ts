import { BaseModel } from '@/utils/BaseModel';
import type { BoardInfoRequestPO } from '../../tags/board/BoardInfoRequestPO';

/** 数据 */
export class BoardInfoRequestDTOModel extends BaseModel implements BoardInfoRequestPO {
  id?: number = 0;
  reportType?: string = '';
  reportIndex?: string = '';
  reportName?: string = '';
  reportJSON?: string = '';
  userid?: string = '';
  apiReturn?: string = '';
}
