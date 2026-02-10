import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class ProjectTaskRequestDTOModel extends BaseModel {
  taskType?: number = 0;
  taskNum?: number = 0;
  taskId?: number = 0;
}
