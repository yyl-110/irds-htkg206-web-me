import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class OperateLogResponseDTOModel extends BaseModel {
  /**
   * ID
   * @example "112222"
   */
  id: String = '';

  /**
   * 用户昵称
   * @example "芋艿"
   */
  username: String = '';

  /**
   * 类型
   * @example "1024"
   */
  moduleName: String = '';
  /**
   * 操作名
   * @example "创建订单"
   */
  logType: String = '';

  /**
   * 操作分类
   * @example "1"
   */
  deptName: String = '';

  /**
   * 用户ID
   * @example "1"
   */
  userId: String = '';
}
