import { BaseModel } from '@/utils/BaseModel';

/** Test Request DTO */
export class WeiSchemaFormSimpleTestModel extends BaseModel {
  /**
   * 用户账号，模糊匹配
   * @example ""
   */
  username: string = '';
  /**
   * 备注
   * @example "..."
   */
  remark?: string = '';
  /**
   * 排序
   * @format int32
   * @example 1
   */
  sort?: number = 0;
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number = 0;
  /**
   * 创建时间
   * @example "2022-07-01 00:00:00]"
   */
  createTime?: string = '';
  /**
   * 时间范围
   * @example "[2022-07-01 00:00:00, 2022-07-01 23:59:59]"
   */
  time?: Array<string> = [];
  /**
   * 部门编号，同时筛选子部门
   * @format int64
   * @example 1024
   */
  deptId?: number = 0;
}
