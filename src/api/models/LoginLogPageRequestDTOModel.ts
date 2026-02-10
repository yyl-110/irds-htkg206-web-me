import { BaseModel } from '@/utils/BaseModel';
import type { LoginLogPageRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 登录日志分页列表 Request VO */
export class LoginLogPageRequestDTOModel extends BaseModel implements LoginLogPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number = 0;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 0;
  /**
   * 用户 IP，模拟匹配
   * @example "127.0.0.1"
   */
  userIp?: string = '';
  /**
   * 用户账号，模拟匹配
   * @example "芋道"
   */
  username?: string = '';
  /**
   * 操作状态
   * @example true
   */
  status?: boolean = false;
  /**
   * 登录时间
   * @example "[2022-07-01 00:00:00,2022-07-01 23:59:59]"
   */
  createTime?: Array<string> = [];
}
