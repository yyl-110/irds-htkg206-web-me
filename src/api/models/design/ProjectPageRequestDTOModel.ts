import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class ProjectPageRequestDTOModel extends BaseModel {
  userId?: number = 0;
  id?: number = 0;
  keywords?: string = '';
}
