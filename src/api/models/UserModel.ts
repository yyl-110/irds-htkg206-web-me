import { BaseModel } from '@/utils/BaseModel';
import type { User } from '../tags/data-contracts';

/**
 * 用户信息
 * @example "user"
 */
export class UserModel extends BaseModel implements User {
  /** @format int64 */
  id?: number = 0;
  username?: string = '';
  deptId?: string = '';
  deptCode?: string = '';
  dept2Code?: string = '';
  email?: string = '';
  mobile?: string = '';
  /** @format int32 */
  sex?: number = 0;
  avatar?: string = '';
  /** @format int32 */
  status?: number = 0;
  isAd?: string = '';
  workCard?: string = '';
  otherDetail?: object;
}
