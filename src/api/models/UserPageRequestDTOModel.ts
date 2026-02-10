import { BaseModel } from '@/utils/BaseModel';
import type { UserPageRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 用户分页 Request DTO */
export class UserPageRequestDTOModel extends BaseModel implements UserPageRequestDTO {
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
   * 用户昵称
   * @example ""
   */
  nickname: string = '';
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
  deptId?: string;
  /**
   * 用户账号或用户昵称模糊匹配
   * @example ""
   */
  fullname?: string = '';
  /**
   * 搜索条件
   * @example ""
   */
  condition: string = '';
  roleName?: string = '';
  userType?: string = '';
  type?: string = '';
}
