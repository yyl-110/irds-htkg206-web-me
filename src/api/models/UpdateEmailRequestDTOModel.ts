import { BaseModel } from '@/utils/BaseModel';
import type { UpdateEmailRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 换绑邮箱 Request DTO */
export class UpdateEmailRequestDTOModel extends BaseModel implements UpdateEmailRequestDTO {
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  email?: string = '';
  /**
   * 验证码
   * @example "123456"
   */
  code: string = '';
}
