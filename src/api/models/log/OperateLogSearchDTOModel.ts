import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class OperateLogSearchDTOModel extends BaseModel {
  /**
   * ID
   * @example "112222"
   */
  id: String = '';

  /**
   * 用户昵称
   * @example "芋艿"
   */
  userName: String = '';
  /**
   * 表格 分页
   * @format int32
   * @example "127.0.0.1"
   */
  pageNo: number = 1;
  /**
   * 类型
   * @example "1024"
   */
  moduleName: String = '';

  /** 创建时间 */
  createTime?: Array<string> = [];
}
