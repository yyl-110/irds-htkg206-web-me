import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class ParameterConfigRequestDTOModel extends BaseModel {
  fileId?: string = '';
  id?: string = '';
  businessId?: string;
  type?: string;
  knowledgeParseId?: string;
}
