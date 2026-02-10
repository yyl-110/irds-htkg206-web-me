import { BaseModel } from '@/utils/BaseModel';
import type { WPSResultDto } from '../tags/data-contracts';

export class WPSResultDtoModel extends BaseModel implements WPSResultDto {
  code?: string = '';
  msg?: string = '';
  servertime?: string = '';
  data?: object;
}
