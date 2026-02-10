import { BaseModel } from '@/utils/BaseModel';
import type { UserLoginMobileDTO } from '../tags/data-contracts';

export class UserLoginMobileDTOModel extends BaseModel implements UserLoginMobileDTO {
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile: string = '';
  /**
   * 验证码
   * @example "123456"
   */
  code: string = '';
}
