import { BaseModel } from '@/utils/BaseModel';
import type { AuthLoginResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 登录 Response DTO */
export class AuthLoginResponseDTOModel extends BaseModel implements AuthLoginResponseDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  userId: number = 0;
  /**
   * 访问令牌
   * @example "happy"
   */
  accessToken: string = '';
  /**
   * 刷新令牌
   * @example "nice"
   */
  refreshToken: string = '';
  /**
   * 过期时间
   * @format date-time
   */
  expiresTime: string = '';
  /** @format int64 */
  tenantId?: number = 0;

  /**
   * 手机号码校验
   * @format date-time
   */
  isMobileCheck?: boolean = false;

  /**
   * 强制校验
   * @format date-time
   */
  isUpdatePassCheck?: boolean = false;

  /**
   * epc类型
   * @example "nice"
   */
  sysType?: string = '';

  /**
   * vin信息
   */
  vin?: string = '';

  /**
   * vin信息
   */
  serialCode?: string = '';

  isAllowLogin?: boolean = true;

  lang?: string = '';
  /**
   * 订货号
   */
  dhh?: string = '';
}
