import { BaseModel } from '@/utils/BaseModel';
import type { ProductParameterInfoRequestPO } from '../../tags/product/ProductParameterInfoRequestPO';

/** 数据 */
export class ProductPlatformParameterInfoRequestDTOModel extends BaseModel implements ProductParameterInfoRequestPO {

  currentPage?: number=1;
  keywords?: string="";
  numberPage?: string="10000";
  userid?: number=0;
  proId?:string="";
  ids?: String[] = [];
  associationId?:number=0;
  descript?:string="";
  id?:number=0;
  sign?:string="";
  userId?: number=0;
}
