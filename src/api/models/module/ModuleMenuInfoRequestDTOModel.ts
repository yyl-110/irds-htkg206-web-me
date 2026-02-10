import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class ModuleMenuInfoRequestDTOModel extends BaseModel {
  id?: number = 0;
  content?: string = '';
  standard?: string = 0;
  text?: string = 0;
  term?: string = 0;
  userid?: string = 0;
  auditId?: string = 0;
  termString?: string = 0;
}
