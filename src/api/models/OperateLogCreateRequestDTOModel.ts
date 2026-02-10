import { BaseModel } from '@/utils/BaseModel';
import type { OperateLogCreateRequestDTO } from '../tags/data-contracts';

/** RPC 服务 - 操作日志创建 Request DTO */
export class OperateLogCreateRequestDTOModel extends BaseModel implements OperateLogCreateRequestDTO {
  /**
   * 链路追踪编号
   * @example "89aca178-a370-411c-ae02-3f0d672be4ab"
   */
  traceId?: string = '';
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  userId: number = 0;
  /**
   * 操作模块
   * @example "订单"
   */
  module: string = '';
  /**
   * 操作名
   * @example "创建订单"
   */
  name: string = '';
  /**
   * 操作分类,参见 SysOperateLogTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: number = 0;
  /**
   * 操作明细
   * @example "修改编号为 1 的用户信息，将性别从男改成女，将姓名从芋道改成源码。"
   */
  content?: string = '';
  /**
   * 拓展字段
   * @example "{'orderId': 1}"
   */
  exts?: Record<string, object> = {};
  /**
   * 请求方法名
   * @example "GET"
   */
  requestMethod: string = '';
  /**
   * 请求地址
   * @example "/xxx/yyy"
   */
  requestUrl: string = '';
  /**
   * 用户 IP
   * @example "127.0.0.1"
   */
  userIp: string = '';
  /**
   * 浏览器 UserAgent
   * @example "Mozilla/5.0"
   */
  userAgent: string = '';
  /**
   * Java 方法名
   * @example "com.UserController.save(...)"
   */
  javaMethod: string = '';
  /** Java 方法的参数 */
  javaMethodArgs?: string = '';
  /**
   * 开始时间
   * @format date-time
   */
  startTime: string = '';
  /**
   * 执行时长，单位：毫秒
   * @format int32
   */
  duration: number = 0;
  /**
   * 结果码
   * @format int32
   */
  resultCode: number = 0;
  /** 结果提示 */
  resultMsg?: string = '';
  /** 结果数据 */
  resultData?: string = '';
  /** 菜单名称 */
  menuName?: string = '';
}
