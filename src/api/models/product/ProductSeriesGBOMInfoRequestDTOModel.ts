import { BaseModel } from '@/utils/BaseModel';
import type { ProductSeriesGBOMInfoRequestPO } from '../../tags/product/ProductSeriesGBOMInfoRequestPO';

/** 数据 */
export class ProductSeriesGBOMInfoRequestDTOModel extends BaseModel implements ProductSeriesGBOMInfoRequestPO {
  id?: number = 0;
  required?: boolean = true;
  userid?: number = 0;
  associationId?: number | string;
  descript?: string = '';
  seriesId?: string = '';

  sign?: string = '';
  idList?: string[] = [];
}
