import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class ProdProductpackageRequestDTOModel extends BaseModel {
  pageNo?: number = 0;
  pageSize?: number = 0;
  packageName?: string = '';
}
