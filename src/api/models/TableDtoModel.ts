import { BaseModel } from '@/utils/BaseModel';
import type { TableDto } from '../tags/data-contracts';

import { ParamModel } from './ParamModel';

/** 管理后台 -表格组件 */
export class TableDtoModel extends BaseModel implements TableDto {
  tableId?: string = '';
  paramsList?: Array<ParamModel> = [];
}
