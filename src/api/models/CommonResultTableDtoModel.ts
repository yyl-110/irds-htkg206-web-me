import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultTableDto } from '../tags/data-contracts';

import { TableDtoModel } from './TableDtoModel';

export class CommonResultTableDtoModel extends BaseModel implements CommonResultTableDto {
  /** @format int32 */
  code?: number = 0;
  data?: TableDtoModel = new TableDtoModel();
  msg?: string = '';
}
