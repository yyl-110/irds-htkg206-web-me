import { BaseModel } from '@/utils/BaseModel';
import type { ProductPlatformParameterInfoUpdatePO } from '../../tags/product/ProductPlatformParameterInfoUpdatePO';

/** 数据 */
export class ProductPlatformParameterInfoUpdateDTOModel extends BaseModel implements ProductPlatformParameterInfoUpdatePO {

  id?: number=0;
  customString?: string="";
  note?: string="10000";
  type?:string="";
  userId?:number=0;
  value?:string="";
  move?:boolean=true;
  ids?:string[]=[];
  bigType?: string="";
  bigValue?: string="";
  smallType?: string="";
  smallValue?: string="";
  tabulationVoList?:string[]=[];
  major?:string="";
  keyIndicators?:boolean=true;
}
