import { BaseModel } from '@/utils/BaseModel';
import type { UserVO } from '../tags/data-contracts';

/** 用户信息 DTO */
export class UserVOModel extends BaseModel implements UserVO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 用户昵称
   * @example ""
   */
  nickname: string = '';
  /**
   * 用户头像
   * @example "http://www.iocoder.cn/xx.jpg"
   */
  avatar: string = '';
}
