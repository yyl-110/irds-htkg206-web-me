import { BaseModel } from '@/utils/BaseModel';
import type { UserProfileResponseDTO } from '../tags/data-contracts';

import { RoleModel } from './RoleModel';
import { DeptModel } from './DeptModel';
import { PostModel } from './PostModel';
import { SocialUserModel } from './SocialUserModel';

/** 管理后台 - 用户个人中心信息 Response DTO */
export class UserProfileResponseDTOModel extends BaseModel implements UserProfileResponseDTO {
  userCategoryName: string;
  userType: string;
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
   * 状态,参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number = 0;
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
  roles?: Array<RoleModel> = [];
  /** 部门 */
  dept?: Array<DeptModel> = [];
  posts?: Array<PostModel> = [];
  socialUsers?: Array<SocialUserModel> = [];

  /**
   * 子电话号码
   * @format
   */
  mobiles?: Array<Number> = [];
  /**
   * 发动机号
   * @format
   */
  bindVinSerial: string = '';

  /**
   * 子电话号码
   * @format
   */
  bindVinSerials?: Array<String> = [];
}
