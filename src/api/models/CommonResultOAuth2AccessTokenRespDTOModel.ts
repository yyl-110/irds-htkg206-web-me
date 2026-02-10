import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultOAuth2AccessTokenRespDTO } from '../tags/data-contracts';

import { OAuth2AccessTokenRespDTOModel } from './OAuth2AccessTokenRespDTOModel';

export class CommonResultOAuth2AccessTokenRespDTOModel extends BaseModel implements CommonResultOAuth2AccessTokenRespDTO {
  /** @format int32 */
  code?: number = 0;
  data?: OAuth2AccessTokenRespDTOModel = new OAuth2AccessTokenRespDTOModel();
  msg?: string = '';
}
