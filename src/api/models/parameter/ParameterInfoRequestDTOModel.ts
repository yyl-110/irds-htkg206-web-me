import { BaseModel } from '@/utils/BaseModel';
import type { ParameterInfoRequestPO } from '../../tags/parameter/ParameterInfoRequestPO';

/** 数据 */
export class ParameterInfoRequestDTOModel extends BaseModel implements ParameterInfoRequestPO {
  id?: number = 0;
  parameterName?: string = '';
  parameterNum?: string = '';
  parameterType?: string = '';
  cmpany?: string = '';
  categoryid?: string = '';
  rootNodeId?: string = '';
  userid?: string = '';
  treeKey?: number = 0;
  englishName?: string = '';
  remarks?: string = '';
  status?: string = '';
  statusUser?: string = '';
  parameterGroup?: string = '';
  staknowledgetus?: string = '';
  propAlias?: string = '';
  systemType?: string = '';
  propSymbol?: string = '';
  combineFormula?: string = '';
  exampleVal?: string = '';
  secParentid?: string = '';
  unitId?: string = '';
  dimension?: string = '';
  unitName?: string = '';
}
