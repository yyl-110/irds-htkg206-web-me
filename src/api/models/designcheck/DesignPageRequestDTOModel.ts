import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class DesignPageRequestDTOModel extends BaseModel {
  auditId?: string = '';
  keywords?: string = '';
  requirementLevel?: string = '';
  userId?: string = '';
  contents?: Array<any> = [];
  terms?: Array<any> = [];
}
