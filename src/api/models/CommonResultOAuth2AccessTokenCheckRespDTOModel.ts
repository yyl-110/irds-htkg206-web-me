import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultOAuth2AccessTokenCheckRespDTO } from '../tags/data-contracts';

import { OAuth2AccessTokenCheckRespDTOModel } from './OAuth2AccessTokenCheckRespDTOModel';

export class CommonResultOAuth2AccessTokenCheckRespDTOModel extends BaseModel implements CommonResultOAuth2AccessTokenCheckRespDTO {
  /** @format int32 */
  code?: number = 0;
  data?: OAuth2AccessTokenCheckRespDTOModel = new OAuth2AccessTokenCheckRespDTOModel();
  msg?: string = '';
}
