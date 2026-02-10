import { BaseModel } from '@/utils/BaseModel';
import type { DeptResponseDTO } from '../tags/data-contracts';

import { DeptLeaderModel } from './DeptLeaderModel';

/** 管理后台 - 部门信息 Response DTO */
export class DeptResponseDTOModel extends BaseModel implements DeptResponseDTO {
  /**
   * 部门编码
   * @example "10086"
   */
  code: string = '';
  /**
   * 父部门编码
   * @example "100"
   */
  parentCode: string = '';
  /**
   * 部门名称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  name: string = '';
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId?: number = 0;
  /**
   * 显示顺序
   * @format int32
   * @example 1024
   */
  sort: number = 0;
  /**
   * 负责人的用户编号
   * @uniqueItems true
   * @example "1,2,3"
   */
  leaderUserId?: Array<number> = [];
  /**
   * 联系电话
   * @minLength 0
   * @maxLength 11
   * @example "15601691000"
   */
  phone?: string = '';
  /**
   * 邮箱
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  email?: string = '';
  /**
   * 状态,参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number = 0;
  /**
   * 部门编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string = '';
  /**
   * 部门负责人
   * @example "部门负责人"
   */
  leaders: Array<DeptLeaderModel> = [];
}
