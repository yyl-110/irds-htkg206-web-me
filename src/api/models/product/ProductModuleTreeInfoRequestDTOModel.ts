import { BaseModel } from '@/utils/BaseModel';
import type { ProductModuleTreeRequestPO } from '../../tags/product/ProductModuleTreeRequestPO';

/** 数据 */
export class ProductModuleTreeInfoRequestDTOModel extends BaseModel implements ProductModuleTreeRequestPO {
  id?: number = 0;
  categoryName?: string = '';
  categoryType?: number = 1;
  menuId?: number = 9;
  parentId?: string = '';
  categoryId?: string = '4086';
  creator?: number = 60;
  fileId?: number = 0;
}
