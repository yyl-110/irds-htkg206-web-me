import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class MaterialPageRequestDTOModel extends BaseModel {
  userId?: string = '';
  folderId?: string = '';
  keywords?: string = '';
}
