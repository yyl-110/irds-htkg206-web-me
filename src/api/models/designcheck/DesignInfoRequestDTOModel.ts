import { BaseModel } from '@/utils/BaseModel';
/** 数据 */
export class DesignInfoRequestDTOModel extends BaseModel {
  id?: number = 0;
  content?: string = '';
  standard?: string = '';
  text?: string = '';
  term?: string = '';
  userid?: string = '';
  auditId?: string = '';
  termString?: string = '';
  num?: string = '';
  requirementLevel?: string = '';
  productPlatform?: string = '';
  sys?: string = '';
  part?: string = '';
  importance?: string = '';
  businessClassification?: string = '';
  requirementsClassification?: string = '';
}
