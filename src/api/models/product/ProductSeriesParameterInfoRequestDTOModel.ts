import { BaseModel } from '@/utils/BaseModel';
import type { ProductParameterInfoRequestPO } from '../../tags/product/ProductParameterInfoRequestPO';

/** 数据 */
export class ProductSeriesParameterInfoRequestDTOModel extends BaseModel implements ProductParameterInfoRequestPO {

  currentPage?: number=1;
  keywords?: string="";
  numberPage?: string="10000";
  userid?: number=0;
  seriesId?:string="";
  categoryid?:string="147";
  organizationID?:string="64"
  pageSize:string="10000"
  parameterName:string="";
  parameterNum:string="";
  keyIndicators?:boolean=true;
  id?:number=0
  ids?: String[] = [];
  move?:boolean=true;
}
