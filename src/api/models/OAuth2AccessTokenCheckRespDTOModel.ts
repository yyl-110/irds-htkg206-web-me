import { BaseModel } from '@/utils/BaseModel';
import type { OAuth2AccessTokenCheckRespDTO } from '../tags/data-contracts';

import { UserModel } from './UserModel';

/** RPC 服务 - OAuth2 访问令牌的校验 Response DTO */
export class OAuth2AccessTokenCheckRespDTOModel extends BaseModel implements OAuth2AccessTokenCheckRespDTO {
  /**
   * 用户编号
   * @format int64
   * @example 10
   */
  userId: number = 0;
  /**
   * 租户编号
   * @format int64
   * @example 1024
   */
  tenantId: number = 0;
  /**
   * 授权范围的数组
   * @example "user_info"
   */
  scopes?: Array<string> = [];
  user?: UserModel = new UserModel();
}
