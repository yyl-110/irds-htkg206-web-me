import { BaseModel } from '@/utils/BaseModel';
import type { ParameterUnitRequestPO } from '../../tags/parameter/ParameterUnitRequestPO';

/** 数据 */
export class ParameterUnitRequestDTOModel extends BaseModel implements ParameterUnitRequestPO {
  id?: number = 0;
  name?: string = '';
  pid?: number = 0;
  userId?: number = 0;
}
