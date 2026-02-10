import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListTableDto } from '../tags/data-contracts';

import { TableDtoModel } from './TableDtoModel';

export class CommonResultListTableDtoModel extends BaseModel implements CommonResultListTableDto {
  /** @format int32 */
  code?: number = 0;
  data?: Array<TableDtoModel> = [];
  msg?: string = '';
}
