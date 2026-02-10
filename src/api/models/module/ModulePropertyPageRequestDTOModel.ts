import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class ModulePropertyPageRequestDTOModel extends BaseModel {
  id?: number = 0;
  categoryid?: string = '';
  nodeType?: string = '';
  categoryType?: string = '';
  rootType?: string = '';
  userId?: string = '';
}
