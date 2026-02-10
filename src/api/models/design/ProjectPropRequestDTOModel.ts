import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class ProjectPropRequestDTOModel extends BaseModel {
  userId?: number = 0;
  seriesId?: string = '';
  currentPage?: number = 1;
  numberPage?: number = 10000;
}
