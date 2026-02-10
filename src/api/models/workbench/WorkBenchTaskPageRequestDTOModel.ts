import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class WorkBenchTaskPageRequestDTOModel extends BaseModel {
  userId?: number = 0;
  projectName?: string = '';
  code?: string = '';
  keywords?: string = '';
  workStatus?: string = '';
  currentPage?: number = 1;
  numberPage?: number = 10;
  finishType?: string = '';
}
