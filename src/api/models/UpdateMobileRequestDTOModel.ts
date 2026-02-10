import { BaseModel } from '@/utils/BaseModel';
import type { UpdateMobileRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 换绑手机号 Request DTO */
export class UpdateMobileRequestDTOModel extends BaseModel implements UpdateMobileRequestDTO {
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
