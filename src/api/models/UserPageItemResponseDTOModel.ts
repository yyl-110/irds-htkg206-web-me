import { BaseModel } from '@/utils/BaseModel';
import type { UserPageItemResponseDTO } from '../tags/data-contracts';

import { DeptModel } from './DeptModel';
import { DeptResponseDTOModel } from './DeptResponseDTOModel';

/** 管理后台 - 用户分页时的信息 Response DTO，相比用户基本信息来说，会多部门信息 */
export class UserPageItemResponseDTOModel extends BaseModel implements UserPageItemResponseDTO {
  /**
   * 用户账号
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string = '';
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string = '';
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string = '';
  /**
   * 部门ID
   * @example "我是一个部门"
   */
  deptId: string = '';
  /**
   * 部门Code
   * @example "我是一个部门Code"
   */
  deptCode?: string = '';
  /**
   * 部门2Code
   * @example "我是一个部门Code"
   */
  dept2Code?: string = '';
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  email?: string = '';
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string = '';
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number = 0;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string = '';
  /**
   * 是否AD域验证
   * @example "0"
   */
  isAd?: string = '';
  /**
   * 工号
   * @example "1041245"
   */
  workCard?: string = '';
  /**
   * 租户ID
   * @format int64
   * @example 1
   */
  tenantId?: number = 0;
  /**
   * 用户编号
   * @format int64
   * @example 1
   */
  id: number = 0;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number = 0;
  /**
   * 停用状态
   * @format int32
   * @example 1
   */
  isDeactivate: boolean = false;
  /**
   * 最后登录 IP
   * @example "192.168.1.1"
   */
  loginIp: string = '';
  /**
   * 最后登录时间
   * @format date-time
   */
  loginDate: string = '';
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string = '';
  /** 部门 */
  get_deptCode?: DeptModel = new DeptModel();
  /** 部门 */
  get_deptCode2?: DeptModel = new DeptModel();
  /** 部门 */
  dept?: DeptModel = new DeptModel();
  /** 管理后台 - 部门信息 Response DTO */
  deptDetails?: DeptResponseDTOModel = new DeptResponseDTOModel();
  depts?: Array<DeptModel> = [];
}
