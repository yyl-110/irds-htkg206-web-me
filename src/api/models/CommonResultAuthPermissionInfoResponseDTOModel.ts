import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultAuthPermissionInfoResponseDTO } from '../tags/data-contracts';

import { AuthPermissionInfoResponseDTOModel } from './AuthPermissionInfoResponseDTOModel';

export class CommonResultAuthPermissionInfoResponseDTOModel extends BaseModel implements CommonResultAuthPermissionInfoResponseDTO {
  /** @format int32 */
  code?: number = 0;
  /** 管理后台 - 登录用户的权限信息 Response DTO，额外包括用户信息和角色列表 */
  data?: AuthPermissionInfoResponseDTOModel = new AuthPermissionInfoResponseDTOModel();
  msg?: string = '';
}
