import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class ProjectInfoRequestDTOModel extends BaseModel {
  id?: number = 0;
  platformId?: string = '';
  createUserId?: number = 0;
  code?: string = '';
  nameCN?: string = '';
  projectCategory?: string = '';
  projectType?: string = '';
  startTime?: string = '';
  endTime?: string = '';
  seriesId?: string = '';
  designManagerName?: string = '';
  mechanicalName?: string = '';
  electricalName?: string = '';
  type?: number = 0;
  taskId?: number = 0;
}
