import { BaseModel } from '@/utils/BaseModel';
import type { UserResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 用户信息 Response DTO */
export class UserResponseDTOModel extends BaseModel implements UserResponseDTO {
  /**
   * 角色标识数组
   * @uniqueItems true
   */
  roleid: Array<string> = [];
  /**
   * 行业数组
   * @uniqueItems true
   */
  industry: Array<string> = [];
  /**
   * 联系人
   * @example ""
   */
  contract: string = '';
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
   * 备注
   * @example "我是一个用户"
   */
  type?: string = '';
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
   * 绑定手机号码
   * @example "15601691300"
   */
  mobiles?: any;
  /**
   * 绑定发动机号
   * @example "15601691300"
   */
  bindVinSerials?: any;

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
   * 数据id
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
  /**
   * 业务范围数组
   * @example
   */
  bizRange: Array<string> = [];
  /**
   * 地址
   * @example "我是一个部门"
   */
  address: string = '';
  /**
   * 区域
   * @example "我是一个部门"
   */
  region: string = '';
  /**
   * 工作证号
   * @example "工作证号"
   */
  workCardId: string = '';
  /**
   * 主机厂用户
   * @example "主机厂用户"
   */
  mainMachineFactory: string = '';
  /**
   * 业务公司
   * @example "业务公司"
   */
  company: string = '';
  /**
   * 用户组
   * @example "用户组"
   */
  roles: Array<string> = [];
  /**
   * 用户角色
   * @example "用户角色"
   */
  userCategory: string = '';
  province: string = '';
  serviceStationName: string = '';
  productLine: string = '';
  confidentialLevel: number = 0;
  idNumber: string = '';}
