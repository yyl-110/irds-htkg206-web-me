import { BaseModel } from '@/utils/BaseModel';
import type { ProductModuleTreeRequestPO } from '../../tags/product/ProductModuleTreeRequestPO';

/** 数据 */
export class ProductModuleTreeInfoRequestDTOModel extends BaseModel implements ProductModuleTreeRequestPO {
  categoryType?: number = 1;
  categoryid?: string = '4086';
  productType?: string = '1';
  titleid?: string = '11';
  treeType?: string = '0';
  userid?: number = 60;
  categoryName?: string = '';
  englishName?: string = '';
  ifRecurse?: string = '0';
  nodeLevel?: string = '';
  nodeType?: string = '2';
  organizationID?: string = '64';
  parentid?: string = '';
  pdmType?: string = '';
  rootNodeid?: string = '4086';
  secret?: '';
  sketchMapId?: '';
  id?: string = '';
  type?: number = 0;
}
