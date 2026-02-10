import { BaseModel } from '@/utils/BaseModel';
import type { LoginLogResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 登录日志 Response VO */
export class LoginLogResponseDTOModel extends BaseModel implements LoginLogResponseDTO {
  /**
   * 日志类型,参见 LoginLogTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  logType: number = 0;
  /**
   * 链路追踪编号
   * @example "89aca178-a370-411c-ae02-3f0d672be4ab"
   */
  traceId: string = '';
  /**
   * 用户账号
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  username: string = '';
  /**
   * 登录结果，参见 LoginLogTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  result: number = 0;
  /**
   * 用户 IP
   * @example "127.0.0.1"
   */
  userIp: string = '';
  /**
   * 浏览器 UserAgent
   * @example "Mozilla/5.0"
   */
  userAgent?: string = '';
  /**
   * 日志编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 用户编号
   * @format int64
   * @example 666
   */
  userId?: number = 0;
  /**
   * 登录时间
   * @format date-time
   */
  createTime: string = '';
}
