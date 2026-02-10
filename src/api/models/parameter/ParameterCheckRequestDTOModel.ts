import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class ParameterCheckRequestDTOModel extends BaseModel {
  checkList?: any = [];
  userId?: number = 0;
}
