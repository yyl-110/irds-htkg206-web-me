import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class ModuleTypeRequestDTOModel extends BaseModel {
  id?: number = 0;
  categoryid?: string = '';
  nodeType?: string = '';
  categoryType?: string = '';
  rootType?: string = '';
  userId?: string = '';
}

/** 数据 */
export class parameterDictionaryRequestDTOModel extends BaseModel {
  userid?: number = 0;
  categoryid?: string = '';
  pageNo?: number = 1;
  organizationID?: string = '';
  parameterName?: string = '';
  parameterNum?: string = '';
  currentPage?: number = 1;
  pageSize?: number = 10;
}
