import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class processTaskPage extends BaseModel {
  pageNo?: number = 0;
  pageSize?: number = 0;
  pageType?: number | string = 1;
  name?: string = '';
}
