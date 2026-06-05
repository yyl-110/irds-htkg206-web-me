import { BaseModel } from '@/utils/BaseModel';
import type { ProductModuleTreeRequestPO } from '../../tags/product/ProductModuleTreeRequestPO';

/** 数据 */
export class ProductModuleTreeInfoRequestDTOModel extends BaseModel implements ProductModuleTreeRequestPO {
  id?: number = 0;
  /** 参数字典树节点名称（create/update 接口字段名为 name） */
  name?: string = '';
  categoryName?: string = '';
  categoryType?: number = 1;
  type?: number = 1;
  menuId?: number = 9;
  parentId?: number | string = 0;
  categoryId?: string = '4086';
  creator?: number = 60;
  fileId?: number = 0;
}
