import { BaseModel } from '@/utils/BaseModel';
import type { ProductSeriesGBOMInfoRequestPO } from '../../tags/product/ProductSeriesGBOMInfoRequestPO';

/** 数据 */
export class ProductSeriesGBOMModuleInfoDTOModel extends BaseModel implements ProductSeriesGBOMInfoRequestPO {
  id?:number=0
  userId?:number=0;
  categoryId?:number=0;
  currentPage?:number=1;
  moduleParaList?:string []=[];
  numberPage?:number=100000;
  userName?:string="";
  moduleInfoIdList?:string []=[];
  seriesGBOMId?:number=0
  keyIndicators?:boolean=true;
  move?:boolean=true;
  ids?:string []=[];
  idList?:string []=[];
}
