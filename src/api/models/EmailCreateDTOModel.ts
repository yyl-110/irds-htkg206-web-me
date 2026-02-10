import { BaseModel } from '@/utils/BaseModel';
import type { EmailCreateDTO } from '../tags/data-contracts';

export class EmailCreateDTOModel extends BaseModel implements EmailCreateDTO {
  /**
   * 验证码
   * @example "123456"
   */
  code?: string = '';
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  email?: string = '';
}
