import { BaseModel } from '@/utils/BaseModel';

export class synchronizationLogPOModel extends BaseModel {
  /**
   * 用户 IP，
   * @format int32
   * @example "127.0.0.1"
   */
  userIp: string = '';

  /**
   * 用名称
   * @format int32
   * @example "结构化手册数据同步"
   */
  name: string = '';

  /**
   * 同步状态
   * @format int32
   * @example "127.0.0.1"
   */
  resultCode: number | string = 200;

  /**
   * 失败说明
   * @format int32
   * @example "127.0.0.1"
   */
  resultMsg: string = '';
  /**
   * 是否重试
   * @format int32
   * @example "127.0.0.1"
   */
  retryFlag: string = '';

  /**
   * 同步时间
   * @format int32
   * @example "date-time"
   */
  startTime: string = '';

  /**
   * Java 方法名
   * @example ""
   */
  javaMethod: string = '';
  /**
  /**
   * Java 方法的参数
   * @format int32
   * @example "127.0.0.1"
   */
  javaMethodArgs: string = '';
}
