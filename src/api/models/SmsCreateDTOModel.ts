import { BaseModel } from '@/utils/BaseModel';
import type { SmsCreateDTO } from '../tags/data-contracts';

export class SmsCreateDTOModel extends BaseModel implements SmsCreateDTO {
  /**
   * 验证码
   * @example "123456"
   */
  code?: string = '';
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile: string = '';
}
