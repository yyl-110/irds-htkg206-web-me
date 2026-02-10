import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultWPSResultDto } from '../tags/data-contracts';

import { WPSResultDtoModel } from './WPSResultDtoModel';

export class CommonResultWPSResultDtoModel extends BaseModel implements CommonResultWPSResultDto {
  /** @format int32 */
  code?: number = 0;
  data?: WPSResultDtoModel = new WPSResultDtoModel();
  msg?: string = '';
}
