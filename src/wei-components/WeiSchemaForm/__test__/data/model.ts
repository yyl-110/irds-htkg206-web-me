import { BaseModel } from '@/utils/BaseModel';

/** Test Request DTO */
export class WeiSchemaFormTestModel extends BaseModel {
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
   * 用户账号，模糊匹配
   * @example ""
   */
  username?: string = '';
  /**
   * 手机号码， 模糊匹配
   * @example ""
   */
  mobile?: string = '';
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number = 0;
  /**
   * 创建时间
   * @example "[2022-07-01 00:00:00, 2022-07-01 23:59:59]"
   */
  createTime?: Array<string> = [];
  /**
   * 部门编号，同时筛选子部门
   * @format int64
   * @example 1024
   */
  deptId?: number = 0;
}
