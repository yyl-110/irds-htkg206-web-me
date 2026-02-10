import { BaseModel } from '@/utils/BaseModel';

export class PageResultLoginLogPOModel extends BaseModel {
  /**
   * 用户 IP，模拟匹配
   * @format int32
   * @example "127.0.0.1"
   */
  userIp: String = '';

  /**
   * 用户账号，模拟匹配
   * @format int32
   * @example "127.0.0.1"
   */
  username: String = '';

  /**
   * 操作状态
   * @format int32
   * @example "127.0.0.1"
   */
  status: Boolean = true;

  /**
   * 操作状态
   * @format int32
   * @example "127.0.0.1"
   */
  createTime: String = '';
}
