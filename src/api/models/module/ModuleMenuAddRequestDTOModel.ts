import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class ModuleMenuAddRequestDTOModel extends BaseModel {
  id?: string;
  categoryid?: string;
  creator?: string = '';
  remarks?: string = '';
  fileRemarks?: string = '';
  fileName?: string = '';
  modelNumber?: string = '';
  codeNum?: string = '';
  modelName?: string = '';
  modelEngName?: string = '';
  modelType?: string = '';
  createUser?: string = '';
  modelState?: string = '';
  para5?: string = '';
  para7?: string = '';
  para6: string = '';
  para8?: string = '';
  para9?: string = '';
  para10?: string = '';
  para11?: string = '';
  para12?: string = '';
  para13?: string = '';
  para14?: string = '';
  para15?: string = '';
  para16: string = '';
  para17: string = '';
  para18: string = '';
  para19: string = '';
  para20: string = '';
}
/** 数据 */
export class ModuleimgdeleteRequestDTOModel extends BaseModel {
  userId?: string;
  categoryId?: string;
  moduleAttachmentIdList?: any;
  moduleInfoList?: any;
}
