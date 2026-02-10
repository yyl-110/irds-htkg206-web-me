import { BaseModel } from '@/utils/BaseModel';
import type { SsoResult } from '../tags/data-contracts';

export class SsoResultModel extends BaseModel implements SsoResult {
  empty?: boolean = false;
  [key: string]: any;
}
