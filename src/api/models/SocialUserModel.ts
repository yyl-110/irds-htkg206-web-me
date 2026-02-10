import { BaseModel } from '@/utils/BaseModel';
import type { SocialUser } from '../tags/data-contracts';

/** 社交用户 */
export class SocialUserModel extends BaseModel implements SocialUser {
  /**
   * 社交平台的类型,参见 SocialTypeEnum 枚举类
   * @format int32
   * @example 10
   */
  type: number = 0;
  /**
   * 社交用户的 openid
   * @example "IPRmJ0wvBptiPIlGEZiPewGwiEiE"
   */
  openid: string = '';
}
