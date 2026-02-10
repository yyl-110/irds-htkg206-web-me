import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultAuthLoginResponseDTO } from '../tags/data-contracts';

import { AuthLoginResponseDTOModel } from './AuthLoginResponseDTOModel';

export class CommonResultAuthLoginResponseDTOModel extends BaseModel implements CommonResultAuthLoginResponseDTO {
  /** @format int32 */
  code?: number = 0;
  /** 管理后台 - 登录 Response DTO */
  data?: AuthLoginResponseDTOModel = new AuthLoginResponseDTOModel();
  msg?: string = '';
}
