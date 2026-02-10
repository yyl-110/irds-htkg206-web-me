import { BaseModel } from '@/utils/BaseModel';
/** 竞争对手信息 */
export class CompetitorInfoRequestDTOModel extends BaseModel {
  id?: number = 0;
  competitorName?: string = '';
  sortIndex?: number = 0;
}
