import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class ProjectUserRequestDTOModel extends BaseModel {
  userId?: string = '';
  project?: string = '';
  userName?: string = '';
}
