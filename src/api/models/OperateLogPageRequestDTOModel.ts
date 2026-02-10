import { BaseModel } from '@/utils/BaseModel';
import type { OperateLogPageRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 操作日志分页列表 Request VO */
export class OperateLogPageRequestDTOModel extends BaseModel implements OperateLogPageRequestDTO {
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
   * 操作模块，模拟匹配
   * @example "订单"
   */
  module?: string = '';
  /**
   * 用户昵称，模拟匹配
   * @example "芋道"
   */
  userNickname?: string = '';
  /**
   * 操作分类，参见 OperateLogTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type?: number = 0;
  /**
   * 操作状态
   * @example true
   */
  success?: boolean = false;
  /**
   * 开始时间
   * @example "[2022-07-01 00:00:00,2022-07-01 23:59:59]"
   */
  startTime?: Array<string> = [];
}
