import { BaseModel } from '@/utils/BaseModel';
/** 竞品数据库信息 */
export class ParameterPageRequestDTOModel extends BaseModel {
  columns?: any = [];
  categoryid?: string = '';
  userId?: number = 0;
}
