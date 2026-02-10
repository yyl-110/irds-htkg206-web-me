import { BaseModel } from '@/utils/BaseModel';
import type { AuthPermissionInfoResponseDTO } from '../tags/data-contracts';

// ;
import { UserVOModel } from './UserVOModel';

/** 管理后台 - 登录用户的权限信息 Response DTO，额外包括用户信息和角色列表 */
export class AuthPermissionInfoResponseDTOModel extends BaseModel implements AuthPermissionInfoResponseDTO {
  /** 用户信息 DTO */
  user: UserVOModel = new UserVOModel();
  /**
   * 角色标识数组
   * @uniqueItems true
   */
  roles: Array<string> = [];
  /**
   * 操作权限数组
   * @uniqueItems true
   */
  permissions: Array<string> = [];
}
