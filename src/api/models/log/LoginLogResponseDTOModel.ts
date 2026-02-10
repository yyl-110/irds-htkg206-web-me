import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class LoginLogResponseDTOModel extends BaseModel {
  /**
   * 用户名称，模拟匹配
   * @format int32
   * @example "127.0.0.1"
   */
  username: String = '';
  /**
   * 表格 分页
   * @format int32
   * @example "127.0.0.1"
   */
  pageNo: number = 1;
  /**
   * 操作状态
   * @format int32
   * @example "127.0.0.1"
   */
  status: Boolean = true;

  /** 创建时间 */
  createTime?: Array<string> = [];
  /**
   * 同步状态 标识
   * @format int32
   * @example "127.0.0.1"
   */
  resultCode: String = '';
  province: String = '';
  serviceStationName: String = '';
  productLine: String = '';
}
