import { BaseModel } from '@/utils/BaseModel';
import type { OAuth2AccessTokenCreateReqDTO } from '../tags/data-contracts';

/** RPC 服务 - OAuth2 访问令牌创建 Request DTO */
export class OAuth2AccessTokenCreateReqDTOModel extends BaseModel implements OAuth2AccessTokenCreateReqDTO {
  /**
   * 用户编号
   * @format int64
   * @example 10
   */
  userId: number = 0;
  /**
   * 客户端编号
   * @example ""
   */
  clientId: string = '';
  /**
   * 授权范围的数组
   * @example "user_info"
   */
  scopes?: Array<string> = [];
}
