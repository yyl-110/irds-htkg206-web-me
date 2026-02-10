import { BaseModel } from '@/utils/BaseModel';
import type { OAuth2AccessTokenRespDTO } from '../tags/data-contracts';

/** RPC 服务 - OAuth2 访问令牌的信息 Response DTO */
export class OAuth2AccessTokenRespDTOModel extends BaseModel implements OAuth2AccessTokenRespDTO {
  /**
   * 访问令牌
   * @example "tudou"
   */
  accessToken: string = '';
  /**
   * 刷新令牌
   * @example "haha"
   */
  refreshToken: string = '';
  /**
   * 用户编号
   * @format int64
   * @example 10
   */
  userId: number = 0;
  /**
   * 过期时间
   * @format date-time
   */
  expiresTime: string = '';
}
