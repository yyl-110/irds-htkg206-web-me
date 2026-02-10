import { BaseModel } from '@/utils/BaseModel';
/** 管理后台 -针脚图 */
export class PinDiagramRequestDTO extends BaseModel {
  /**
   * 零件编号
   * @example 1
   */
  partNumber?: string = '';

  industry?: string = '';

  series?: string = '';

  emission?: string = '';

  fuelType?: string = '';
}
