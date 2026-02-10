import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class WorkBenchPageRequestDTOModel extends BaseModel {
  userid?: number = 0;
  id?: number = 0;
  project?: string = '';
  taskId?: number = 0;
  userId?: number = 0;
  userName?: string = '';
}
