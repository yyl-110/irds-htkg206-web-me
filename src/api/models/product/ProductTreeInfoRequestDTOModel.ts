import { BaseModel } from '@/utils/BaseModel';
import type { ProductTreeRequestPO } from '../../tags/product/ProductTreeRequestPO';

/** 数据 */
export class ProductTreeInfoRequestDTOModel extends BaseModel implements ProductTreeRequestPO {
  type?: number = 1;
  fileId?: number = 0;
  fileUrl?: string = '';
  level?: number = 0;
  name?: string = '';
  pid?: number = 0;
  text?: string = '';
  userId?: number = 60;
  id?: number = 0;
  ids?: String[] = [];
  managerIds?: String[] = [];
}
