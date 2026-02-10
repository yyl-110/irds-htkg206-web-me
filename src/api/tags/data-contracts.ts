import { number } from 'mathjs';
import { Expose } from 'class-transformer';
/** RPC 服务 - 操作日志创建 Request DTO */
export interface OperateLogCreateRequestDTO {
  /**
   * 链路追踪编号
   * @example "89aca178-a370-411c-ae02-3f0d672be4ab"
   */
  traceId?: string;
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  userId: number;
  /**
   * 操作模块
   * @example "订单"
   */
  module: string;
  /**
   * 操作名
   * @example "创建订单"
   */
  name: string;
  /**
   * 操作分类,参见 SysOperateLogTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: number;
  /**
   * 操作明细
   * @example "修改编号为 1 的用户信息，将性别从男改成女，将姓名从芋道改成源码。"
   */
  content?: string;
  /**
   * 拓展字段
   * @example "{'orderId': 1}"
   */
  exts?: Record<string, object>;
  /**
   * 请求方法名
   * @example "GET"
   */
  requestMethod: string;
  /**
   * 请求地址
   * @example "/xxx/yyy"
   */
  requestUrl: string;
  /**
   * 用户 IP
   * @example "127.0.0.1"
   */
  userIp: string;
  /**
   * 浏览器 UserAgent
   * @example "Mozilla/5.0"
   */
  userAgent: string;
  /**
   * Java 方法名
   * @example "com.UserController.save(...)"
   */
  javaMethod: string;
  /** Java 方法的参数 */
  javaMethodArgs?: string;
  /**
   * 开始时间
   * @format date-time
   */
  startTime: string;
  /**
   * 执行时长，单位：毫秒
   * @format int32
   */
  duration: number;
  /**
   * 结果码
   * @format int32
   */
  resultCode: number;
  /** 结果提示 */
  resultMsg?: string;
  /** 结果数据 */
  resultData?: string;
  /** 菜单名称 */
  menuName?: string;
}

export interface CommonResultBoolean {
  /** @format int32 */
  code?: number;
  data?: Array<string>;
  msg?: string;
}

/** RPC 服务 - OAuth2 访问令牌创建 Request DTO */
export interface OAuth2AccessTokenCreateReqDTO {
  /**
   * 用户编号
   * @format int64
   * @example 10
   */
  userId: number;
  /**
   * 客户端编号
   * @example ""
   */
  clientId: string;
  /**
   * 授权范围的数组
   * @example "user_info"
   */
  scopes?: Array<string>;
}

export interface CommonResultOAuth2AccessTokenRespDTO {
  /** @format int32 */
  code?: number;
  /** RPC 服务 - OAuth2 访问令牌的信息 Response DTO */
  data?: OAuth2AccessTokenRespDTO;
  msg?: string;
}

/** RPC 服务 - OAuth2 访问令牌的信息 Response DTO */
export interface OAuth2AccessTokenRespDTO {
  /**
   * 访问令牌
   * @example "tudou"
   */
  accessToken: string;
  /**
   * 刷新令牌
   * @example "haha"
   */
  refreshToken: string;
  /**
   * 用户编号
   * @format int64
   * @example 10
   */
  userId: number;
  /**
   * 过期时间
   * @format date-time
   */
  expiresTime: string;
}

export interface LoginLogCreateRequestDTO {
  /**
   * 日志类型,参见 LoginLogTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  logType: number;
  /**
   * 链路追踪编号
   * @example "89aca178-a370-411c-ae02-3f0d672be4ab"
   */
  traceId: string;
  /**
   * 用户编号
   * @format int64
   * @example 666
   */
  userId?: number;
  /**
   * 用户账号
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  username: string;
  /**
   * 登录结果,参见 LoginResultEnum 枚举类
   * @format int32
   * @example 1
   */
  result: number;
  /**
   * 用户 IP
   * @example "127.0.0.1"
   */
  userIp: string;
  /**
   * 浏览器 UserAgent
   * @example "Mozilla/5.0"
   */
  userAgent: string;
}

/** 管理后台 - 用户更新 Request DTO */
export interface UserUpdateRequestDTO {
  /**
   * 用户账号
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string;
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string;
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string;
  /**
   * 部门ID
   * @example "我是一个部门"
   */
  deptId: string;
  /**
   * 部门Code
   * @example "我是一个部门Code"
   */
  deptCode?: string;
  /**
   * 部门2Code
   * @example "我是一个部门Code"
   */
  dept2Code?: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string;
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string;
  /**
   * 是否AD域验证
   * @example "0"
   */
  isAd?: string;
  /**
   * 工号
   * @example "1041245"
   */
  workCard?: string;
  /**
   * 租户ID
   * @format int64
   * @example 1
   */
  tenantId?: number;
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number;
  /** 角色ID */
  roleId?: string;
  /**
   * 状态
   * @format int32
   */
  status?: number;
}

/** 管理后台 - 用户更新状态 Request DTO */
export interface UserUpdateStatusRequestDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 状态，见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
}
/** 管理后台 - 用户更新停用状态 Request DTO */
export interface UserUDeactivateRequestDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  userId: number;
  /**
   * 状态，
   * @format int32
   * @example 1
   */
  // isDeactivate: boolean;
}

/** 管理后台 - 用户更新密码 Request DTO */
export interface UserUpdatePasswordRequestDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 密码
   * @example "123456"
   */
  password: string;
}

/** 管理后台 - 用户个人信息更新 Request DTO */
export interface UserProfileUpdateRequestDTO {
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "wc@iocoder.cn"
   */
  email?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string;
  /**
   * 用户性别,参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number;
}

/** 管理后台 - 用户个人中心更新密码 Request DTO */
export interface UserProfileUpdatePasswordRequestDTO {
  /**
   * 旧密码
   * @example "123456"
   */
  oldPassword: string;
  /**
   * 新密码
   * @example "654321"
   */
  newPassword: string;
}

/** 管理后台 - 用户个人中心修改密码 Request DTO */
export interface UserUpdatePasswordRequestDTOModel {
  /**
   * 旧密码
   * @example "123456"
   */
  oldPassword: any;
  /**
   * 新密码
   * @example "654321"
   */
  newPassword: any;

  /**
   * 用户Id
   * @example "654321"
   */
  userId?: Number;
}

/** 管理后台 - 用户创建 Request DTO */
export interface UserCreateRequestDTO {
  /**
   * 用户账号
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string;
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string;
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string;
  /**
   * 部门ID
   * @example "我是一个部门"
   */
  deptId: Array<string>;
  /**
   * 部门Code
   * @example "我是一个部门Code"
   */
  deptCode?: string;
  /**
   * 部门2Code
   * @example "我是一个部门Code"
   */
  dept2Code?: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string;
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string;
  /** AD域 */
  isAd?: string;
  /**
   * 工号
   * @example "1041245"
   */
  workCard?: string;
  /**
   * 租户ID
   * @format int64
   * @example 1
   */
  tenantId?: number;
  /**
   * 密码
   * @example "123456"
   */
  password: string;
  /** 角色ID */
  roleId?: string;
  /**
   * 用户id
   * @example "15601691300"
   */
  userId?: string;
}
export interface SubaccountRequestDTO {
  /**
   * 用户名称
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string;
  mobile?: string;
  /**
   * 用户id
   * @example "15601691300"
   */
  userId?: string;
}

export interface CommonResultLong {
  /** @format int32 */
  code?: number;
  /** @format int64 */
  data?: number;
  msg?: string;
}

/** 管理后台 - 租户更新 Request DTO */
export interface TenantUpdateRequestDTO {
  /**
   * 租户名
   * @example ""
   */
  name: string;
  /**
   * 联系人
   * @example ""
   */
  contactName: string;
  /**
   * 联系手机
   * @example "15601691300"
   */
  contactMobile?: string;
  /**
   * 租户状态
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 绑定域名
   * @example "https://www.iocoder.cn"
   */
  domain?: string;
  /**
   * 租户套餐编号
   * @format int64
   * @example 1024
   */
  packageId: number;
  /**
   * 过期时间
   * @format date-time
   */
  expireTime: string;
  /**
   * 账号数量
   * @format int32
   * @example 1024
   */
  accountCount: number;
  /**
   * 租户编号
   * @format int64
   * @example 1024
   */
  id: number;
}

/** 管理后台 - 租户创建 Request DTO */
export interface TenantCreateRequestDTO {
  /**
   * 租户名
   * @example ""
   */
  name: string;
  /**
   * 联系人
   * @example ""
   */
  contactName: string;
  /**
   * 联系手机
   * @example "15601691300"
   */
  contactMobile?: string;
  /**
   * 租户状态
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 绑定域名
   * @example "https://www.iocoder.cn"
   */
  domain?: string;
  /**
   * 租户套餐编号
   * @format int64
   * @example 1024
   */
  packageId: number;
  /**
   * 过期时间
   * @format date-time
   */
  expireTime: string;
  /**
   * 账号数量
   * @format int32
   * @example 1024
   */
  accountCount: number;
  /**
   * 用户账号
   * @minLength 4
   * @maxLength 30
   * @pattern ^[a-zA-Z0-9]{4,30}$
   * @example ""
   */
  username: string;
  /**
   * 密码
   * @example "123456"
   */
  password: string;
}

/** 管理后台 - 租户套餐更新 Request DTO */
export interface TenantPackageUpdateRequestDTO {
  /**
   * 套餐名
   * @example "VIP"
   */
  name: string;
  /**
   * 状态，参见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 备注
   * @example "好"
   */
  remark?: string;
  /**
   * 关联的菜单编号
   * @uniqueItems true
   */
  menuIds: Array<number>;
  /**
   * 套餐编号
   * @format int64
   * @example 1024
   */
  id: number;
}

/** 管理后台 - 租户套餐创建 Request DTO */
export interface TenantPackageCreateRequestDTO {
  /**
   * 套餐名
   * @example "VIP"
   */
  name: string;
  /**
   * 状态，参见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 备注
   * @example "好"
   */
  remark?: string;
  /**
   * 关联的菜单编号
   * @uniqueItems true
   */
  menuIds: Array<number>;
}

export interface StatisticsLogDTO {
  moduleName?: string;
  logType?: string;
}

/** 管理后台 - 角色更新 Request DTO */
export interface RoleUpdateRequestDTO {
  /**
   * 角色名称
   * @minLength 0
   * @maxLength 30
   * @example "管理员"
   */
  name: string;
  /**
   * 角色编码
   * @minLength 0
   * @maxLength 100
   * @example "ADMIN"
   */
  code: string;
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort?: number;
  /**
   * 备注
   * @example "我是一个角色"
   */
  remark?: string;
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number;
  /**
   * 角色编号
   * @format int64
   * @example 1024
   */
  id: string;
}

/** 管理后台 - 角色更新状态 Request DTO */
export interface RoleUpdateStatusRequestDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 状态，见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
}

export interface RoleBaseDTO {
  /**
   * 角色名称
   * @minLength 0
   * @maxLength 30
   * @example "管理员"
   */
  name: string;
  /**
   * 角色编码
   * @minLength 0
   * @maxLength 100
   * @example "ADMIN"
   */
  code: string;
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort?: number;
  /**
   * 备注
   * @example "我是一个角色"
   */
  remark?: string;
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number;
}

/** 管理后台 - 赋予用户角色 Request DTO */
export interface PermissionAssignUsersRoleRequestDTO {
  /**
   * 角色编号
   * @uniqueItems true
   * @example "1,3,5"
   */
  userIds: Array<number>;
  /**
   * 角色编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  roleIds?: Array<number>;
  /**
   * 部门ID
   * @uniqueItems true
   * @example "1,3,5"
   */
  deptIds?: Array<number>;
  /**
   * ID
   * @uniqueItems true
   * @example "1,3,5"
   */
  regionId?: string;
  groupId?: string;
  type?: string;
}

/** 管理后台 - 赋予模块权限 Request DTO */
export interface PermissionAssignUsersRoleRequestDTOrole {
  /**
   * 角色编号
   * @uniqueItems true
   * @example "1,3,5"
   */
  funcIds?: Array<number>;
  /**
   * 角色编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  roleId?: string;
  /**
   * 部门ID
   * @uniqueItems true
   * @example "1,3,5"
   */
  type?: number;
}

/** 管理后台 - 赋予服务资料 Request DTO */
export interface PermissionAssignUsersRoleRequestDTOserviceData {
  /**
   * 功能模块
   * @uniqueItems true
   * @example "1,3,5"
   */
  dirIds?: Array<number>;
  /**
   * 角色编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  roleIds?: number;
  /**
   *类型
   * @uniqueItems true
   * @example "1,3,5"
   */
  type: string;
}

/** 管理后台 - 赋予用户角色 Request DTO */
export interface PermissionAssignUserRoleRequestDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  userId: number;
  /**
   * 角色编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  roleIds?: Array<number>;
}

/** 管理后台 - 赋予角色菜单 Request DTO */
export interface PermissionAssignRoleMenuRequestDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  roleId: number;
  /**
   * 菜单编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  menuIds?: Array<number>;
}

/** 管理后台 - 赋予角色数据权限 Request DTO */
export interface PermissionAssignRoleDataScopeRequestDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  roleId: number;
  /**
   * 数据范围，参见 DataScopeEnum 枚举类
   * @format int32
   * @example 1
   */
  dataScope: number;
  /**
   * 部门编号列表，只有范围类型为 DEPT_CUSTOM 时，该字段才需要
   * @uniqueItems true
   * @example "1,3,5"
   */
  dataScopeDeptIds?: Array<number>;
}

/** 管理后台 - 菜单更新 Request DTO */
export interface MenuUpdateRequestDTO {
  /**
   * 菜单名称
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  name: string;
  /**
   * 权限标识,仅菜单类型为按钮时，才需要传递
   * @minLength 0
   * @maxLength 100
   * @example "sys:menu:add"
   */
  permission?: string;
  /**
   * 类型,参见 MenuTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: string;
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort?: number;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId?: number;
  /**
   * 路由地址,仅菜单类型为菜单或者目录时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "post"
   */
  path?: string;
  /**
   * 菜单图标,仅菜单类型为菜单或者目录时，才需要传
   * @example "/menu/list"
   */
  icon?: string;
  /**
   * 组件路径,仅菜单类型为菜单时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "system/post/index"
   */
  component?: string;
  /**
   * 组件名
   * @example "SystemUser"
   */
  componentName?: string;
  /**
   * 状态,见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status?: number;
  /**
   * 是否可见
   * @example false
   */
  visible?: boolean;
  /**
   * 是否缓存
   * @example false
   */
  keepAlive?: boolean;
  /**
   * 是否总是显示
   * @example false
   */
  alwaysShow?: boolean;
  /**
   * 菜单编号
   * @format int64
   * @example 1024
   */
  id: number;
}

/** 管理后台 - 菜单更新 Request DTO */
export interface PriceUpdateRequestDTO {
  /**
   * 零件编号
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  partNumber: string;
  /**
   * 海外价格
   * @format int32
   * @example 1
   */
  overseaPrice: string;
  /**
   * 零售价格
   * @format int32
   * @example 1024
   */
  retailPrice?: string;
  /**
   * 三包回购价格
   * @format int64
   * @example 1024
   */
  threePacks?: string;
  /**
   * 通用价格
   * @minLength 0
   * @maxLength 200
   * @example "post"
   */
  universalPrice?: string;
  /**
   * 	ID;主键
   * @format int64
   * @example 1024
   */
  id: number;
}

/** 管理后台 - 菜单创建 Request DTO */
export interface MenuCreateRequestDTO {
  /**
   * 菜单名称
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  name: string;
  /**
   * 权限标识,仅菜单类型为按钮时，才需要传递
   * @minLength 0
   * @maxLength 100
   * @example "sys:menu:add"
   */
  permission?: string;
  /**
   * 类型,参见 MenuTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: string;
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort?: number;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId?: number;
  /**
   * 路由地址,仅菜单类型为菜单或者目录时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "post"
   */
  path?: string;
  /**
   * 菜单图标,仅菜单类型为菜单或者目录时，才需要传
   * @example "/menu/list"
   */
  icon?: string;
  /**
   * 组件路径,仅菜单类型为菜单时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "system/post/index"
   */
  component?: string;
  /**
   * 组件名
   * @example "SystemUser"
   */
  componentName?: string;
  /**
   * 状态,见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status?: number;
  /**
   * 是否可见
   * @example false
   */
  visible?: boolean;
  /**
   * 是否缓存
   * @example false
   */
  keepAlive?: boolean;
  /**
   * 是否总是显示
   * @example false
   */
  alwaysShow?: boolean;
}

/** 管理后台 - 字典类型更新 Request DTO */
export interface DictTypeUpdateRequestDTO {
  /**
   * 字典名称
   * @minLength 0
   * @maxLength 100
   * @example "性别"
   */
  name: string;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 备注
   * @example "快乐的备注"
   */
  remark?: string;
  /**
   * 字典类型编号
   * @format int64
   * @example 1024
   */
  id: number;
}

/** 管理后台 - 字典类型创建 Request DTO */
export interface DictTypeCreateRequestDTO {
  /**
   * 字典名称
   * @minLength 0
   * @maxLength 100
   * @example "性别"
   */
  name: string;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 备注
   * @example "快乐的备注"
   */
  remark?: string;
  /**
   * 字典类型
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  type: string;
}

/** 管理后台 - 字典数据更新 Request DTO */
export interface DictDataUpdateRequestDTO {
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort: number;
  /**
   * 字典标签
   * @minLength 0
   * @maxLength 100
   * @example ""
   */
  label: string;
  /**
   * 字典值
   * @minLength 0
   * @maxLength 100
   * @example "iocoder"
   */
  value: string;
  /**
   * 字典类型
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  dictType: string;
  /**
   * 状态,见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 颜色类型,default、primary、success、info、warning、danger
   * @example "default"
   */
  colorType?: string;
  /**
   * css 样式
   * @example "btn-visible"
   */
  cssClass?: string;
  /**
   * 备注
   * @example "我是一个角色"
   */
  remark?: string;
  /**
   * 字典数据编号
   * @format int64
   * @example 1024
   */
  id: number;
}

/** 管理后台 - 字典数据创建 Request DTO */
export interface DictDataCreateRequestDTO {
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort: number;
  /**
   * 字典标签
   * @minLength 0
   * @maxLength 100
   * @example ""
   */
  label: string;
  /**
   * 字典值
   * @minLength 0
   * @maxLength 100
   * @example "iocoder"
   */
  value: string;
  /**
   * 字典类型
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  dictType: string;
  /**
   * 状态,见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 颜色类型,default、primary、success、info、warning、danger
   * @example "default"
   */
  colorType?: string;
  /**
   * css 样式
   * @example "btn-visible"
   */
  cssClass?: string;
  /**
   * 备注
   * @example "我是一个角色"
   */
  remark?: string;
}

/** 管理后台 - 部门更新 Request DTO */
export interface DeptUpdateRequestDTO {
  /**
   * 部门编码
   * @example "10086"
   */
  code: string;
  /**
   * 父部门编码
   * @example "100"
   */
  parentCode: string;
  /**
   * 部门名称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  name: string;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId?: number;
  /**
   * 显示顺序
   * @format int32
   * @example 1024
   */
  sort: number;
  /**
   * 负责人的用户编号
   * @uniqueItems true
   * @example "1,2,3"
   */
  leaderUserId?: Array<number>;
  /**
   * 联系电话
   * @minLength 0
   * @maxLength 11
   * @example "15601691000"
   */
  phone?: string;
  /**
   * 邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 状态,见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 部门编号
   * @format int64
   * @example 1024
   */
  id: number;
}

/** 管理后台 - 部门创建 Request DTO */
export interface DeptCreateRequestDTO {
  /**
   * 部门编码
   * @example "10086"
   */
  code: string;
  /**
   * 父部门编码
   * @example "100"
   */
  parentCode: string;
  /**
   * 部门名称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  name: string;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId?: number;
  /**
   * 显示顺序
   * @format int32
   * @example 1024
   */
  sort: number;
  /**
   * 负责人的用户编号
   * @uniqueItems true
   * @example "1,2,3"
   */
  leaderUserId?: Array<number>;
  /**
   * 联系电话
   * @minLength 0
   * @maxLength 11
   * @example "15601691000"
   */
  phone?: string;
  /**
   * 邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 状态,见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
}

export interface CommonResultWPSResultDto {
  /** @format int32 */
  code?: number;
  data?: WPSResultDto;
  msg?: string;
}

export interface WPSResultDto {
  code?: string;
  msg?: string;
  servertime?: string;
  data?: object;
}

export interface CommonResultFileUploadResponseDTO {
  /** @format int32 */
  code?: number;
  data?: FileUploadResponseDTO;
  msg?: string;
}

export interface FileUploadResponseDTO {
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  queryId?: string;
}

/** 表格字段 */
export interface Param {
  /**
   * 显示顺序
   * @format int32
   * @example 1
   */
  sort: number;
  /**
   * 字段中文名称
   * @example "姓名"
   */
  name?: string;
  /**
   * 字段英文名称
   * @example "name"
   */
  key?: string;
  /**
   * 是否显示
   * @example true
   */
  isShow: boolean;
}

/** 管理后台 -表格组件 */
export interface TableDto {
  tableId?: string;
  paramsList?: Array<Param>;
}

/** 管理后台 - 换绑手机号 Request DTO */
export interface UpdateMobileRequestDTO {
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile: string;
  /**
   * 验证码
   * @example "123456"
   */
  code: string;
}

/** 管理后台 - 换绑邮箱 Request DTO */
export interface UpdateEmailRequestDTO {
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 验证码
   * @example "123456"
   */
  code: string;
}

/** 管理后台 - 用户自注册 Request DTO */
export interface UserRegisterRequestDTO {
  /**
   * 用户账号
   * @minLength 2
   * @maxLength 30
   * @example ""
   */
  username?: string;
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname?: string;
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string;
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string;
  /**
   * 是否AD域验证
   * @example "0"
   */
  isAd?: string;
  /**
   * 租户ID
   * @format int64
   * @example 2
   */
  tenantId?: number;
  /**
   * 密码
   * @example "123456"
   */
  password: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string;
  /**
   * 手机验证码
   * @example "123456"
   */
  code?: string;
}

export interface UserLoginDTO {
  /**
   * 密码
   * @example "123456"
   */
  password: string;
  /**
   * 用户名
   * @example ""
   */
  username: string;
  /**
   * 验证码,验证码开启时，需要传递
   * @example "PfcH6mgr8tpXuMWFjvW6YVaqrswIuwmWI5dsVZSg7sGpWtDCUbHuDEXl3cFB1+VvCC/rAkSwK8Fad52FSuncVg=="
   */
  captchaVerification: string;
}

/** 管理后台 - 登录 Response DTO */
export interface AuthLoginResponseDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  userId: number;
  /**
   * 访问令牌
   * @example "happy"
   */
  accessToken: string;
  /**
   * 刷新令牌
   * @example "nice"
   */
  refreshToken: string;
  /**
   * 过期时间
   * @format date-time
   */
  expiresTime: string;
  /** @format int64 */
  tenantId?: number;
}

export interface CommonResultAuthLoginResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 登录 Response DTO */
  data?: AuthLoginResponseDTO;
  msg?: string;
}

export interface UserLoginMobileDTO {
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile: string;
  /**
   * 验证码
   * @example "123456"
   */
  code: string;
}

export interface SmsCreateDTO {
  /**
   * 验证码
   * @example "123456"
   */
  code?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile: string;
}

export interface EmailCreateDTO {
  /**
   * 验证码
   * @example "123456"
   */
  code?: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
}

/** 管理后台 - 手机号更新密码 Request DTO */
export interface UserForgetPasswordRequestDTO {
  /**
   * 用户ID
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 密码
   * @example "123456"
   */
  password: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile: string;
  /**
   * 手机验证码
   * @example "123456"
   */
  code: string;
}

export interface CaptchaVO {
  captchaId?: string;
  projectCode?: string;
  captchaType?: string;
  captchaOriginalPath?: string;
  captchaFontType?: string;
  /** @format int32 */
  captchaFontSize?: number;
  secretKey?: string;
  originalImageBase64?: string;
  point?: PointVO;
  jigsawImageBase64?: string;
  wordList?: Array<string>;
  pointList?: Array<{
    /** @format double */
    x?: number;
    /** @format double */
    y?: number;
  }>;
  pointJson?: string;
  token?: string;
  result?: boolean;
  captchaVerification?: string;
  clientUid?: string;
  /** @format int64 */
  ts?: number;
  browserInfo?: string;
}

export interface PointVO {
  secretKey?: string;
  /** @format int32 */
  x?: number;
  /** @format int32 */
  y?: number;
}

export interface ResponseModel {
  repCode?: string;
  repMsg?: string;
  repData?: object;
  success?: boolean;
  repCodeEnum?:
    | 'SUCCESS'
    | 'ERROR'
    | 'EXCEPTION'
    | 'BLANK_ERROR'
    | 'NULL_ERROR'
    | 'NOT_NULL_ERROR'
    | 'NOT_EXIST_ERROR'
    | 'EXIST_ERROR'
    | 'PARAM_TYPE_ERROR'
    | 'PARAM_FORMAT_ERROR'
    | 'API_CAPTCHA_INVALID'
    | 'API_CAPTCHA_COORDINATE_ERROR'
    | 'API_CAPTCHA_ERROR'
    | 'API_CAPTCHA_BASEMAP_NULL'
    | 'API_REQ_LIMIT_GET_ERROR'
    | 'API_REQ_INVALID'
    | 'API_REQ_LOCK_GET_ERROR'
    | 'API_REQ_LIMIT_CHECK_ERROR'
    | 'API_REQ_LIMIT_VERIFY_ERROR';
}

/** 管理后台 - 账号密码登录 Request DTO,如果登录并绑定社交用户，需要传递 social 开头的参数 */
export interface AuthLoginRequestDTO {
  /**
   * 账号
   * @example "admin"
   */
  username: string;
  /**
   * 密码
   * @example "admin123"
   */
  password: string;
  /**
   * 验证码,验证码开启时，需要传递
   * @example "PfcH6mgr8tpXuMWFjvW6YVaqrswIuwmWI5dsVZSg7sGpWtDCUbHuDEXl3cFB1+VvCC/rAkSwK8Fad52FSuncVg=="
   */
  captchaVerification: string;
  /**
   * AD域
   * @format int32
   * @example 0
   */
  isAd: number;

  isAppUser?: boolean;
}

export interface SsoResult {
  empty?: boolean;
  [key: string]: any;
}

/** 管理后台 - 用户删除 Request DTO */
export interface UserDeleteRequestDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number;
}

/** 管理后台 - 部门删除 Request DTO */
export interface DeptDeleteRequestDTO {
  /**
   * 部门编号
   * @format int64
   * @example 1024
   */
  id: number;
}

export interface AdminUserRespDTO {
  /** @format int64 */
  id?: number;
  username?: string;
  nickname?: string;
  /** @format int32 */
  status?: number;
  /** @format int64 */
  deptId?: number;
  mobile?: string;
  roleIds?: Array<number>;
}

export interface CommonResultListAdminUserRespDTO {
  /** @format int32 */
  code?: number;
  data?: Array<AdminUserRespDTO>;
  msg?: string;
}

export interface CommonResultAdminUserRespDTO {
  /** @format int32 */
  code?: number;
  data?: AdminUserRespDTO;
  msg?: string;
}

export interface CommonResultListLong {
  /** @format int32 */
  code?: number;
  data?: Array<number>;
  msg?: string;
}

export interface CommonResultSetLong {
  /** @format int32 */
  code?: number;
  /** @uniqueItems true */
  data?: Array<number>;
  msg?: string;
}

export interface CommonResultDeptDataPermissionRespDTO {
  /** @format int32 */
  code?: number;
  data?: DeptDataPermissionRespDTO;
  msg?: string;
}

export interface DeptDataPermissionRespDTO {
  all?: boolean;
  self?: boolean;
  /** @uniqueItems true */
  deptIds?: Array<number>;
}

export interface CommonResultOAuth2AccessTokenCheckRespDTO {
  /** @format int32 */
  code?: number;
  /** RPC 服务 - OAuth2 访问令牌的校验 Response DTO */
  data?: OAuth2AccessTokenCheckRespDTO;
  msg?: string;
}

/** RPC 服务 - OAuth2 访问令牌的校验 Response DTO */
export interface OAuth2AccessTokenCheckRespDTO {
  /**
   * 用户编号
   * @format int64
   * @example 10
   */
  userId: number;
  /**
   * 租户编号
   * @format int64
   * @example 1024
   */
  tenantId: number;
  /**
   * 授权范围的数组
   * @example "user_info"
   */
  scopes?: Array<string>;
  /** 用户信息 */
  user?: User;
}

/**
 * 用户信息
 * @example "user"
 */
export interface User {
  /** @format int64 */
  id?: number;
  username?: string;
  deptId?: string;
  deptCode?: string;
  dept2Code?: string;
  email?: string;
  mobile?: string;
  /** @format int32 */
  sex?: number;
  avatar?: string;
  /** @format int32 */
  status?: number;
  isAd?: string;
  workCard?: string;
  otherDetail?: object;
}

export interface CommonResultListDeptRespDTO {
  /** @format int32 */
  code?: number;
  data?: Array<DeptRespDTO>;
  msg?: string;
}

export interface DeptRespDTO {
  /** @format int64 */
  id?: number;
  code?: string;
  name?: string;
  /** @format int64 */
  parentId?: number;
  /** @uniqueItems true */
  leaderUserId?: Array<number>;
  /** @format int32 */
  status?: number;
}

export interface CommonResultDeptRespDTO {
  /** @format int32 */
  code?: number;
  data?: DeptRespDTO;
  msg?: string;
}

export interface CommonResultUserProfileResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 用户个人中心信息 Response DTO */
  data?: UserProfileResponseDTO;
  msg?: string;
}

/** 部门 */
export interface Dept {
  /**
   * 部门编号
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 部门名称
   * @example "研发部"
   */
  name: string;
}

/** 岗位 */
export interface Post {
  /**
   * 岗位编号
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 岗位名称
   * @example "开发"
   */
  name: string;
}

/** 角色 */
export interface Role {
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 角色名称
   * @example "普通角色"
   */
  name: string;
}

/** 社交用户 */
export interface SocialUser {
  /**
   * 社交平台的类型,参见 SocialTypeEnum 枚举类
   * @format int32
   * @example 10
   */
  type: number;
  /**
   * 社交用户的 openid
   * @example "IPRmJ0wvBptiPIlGEZiPewGwiEiE"
   */
  openid: string;
}

/** 管理后台 - 用户个人中心信息 Response DTO */
export interface UserProfileResponseDTO {
  /**
   * 用户账号
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string;
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string;
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string;
  /**
   * 部门ID
   * @example "我是一个部门"
   */
  deptId: string;
  /**
   * 部门Code
   * @example "我是一个部门Code"
   */
  deptCode?: string;
  /**
   * 部门2Code
   * @example "我是一个部门Code"
   */
  dept2Code?: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string;
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string;
  /**
   * 是否AD域验证
   * @example "0"
   */
  isAd?: string;
  /**
   * 工号
   * @example "1041245"
   */
  workCard?: string;
  /**
   * 租户ID
   * @format int64
   * @example 1
   */
  tenantId?: number;
  /**
   * 用户编号
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 状态,参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 最后登录 IP
   * @example "192.168.1.1"
   */
  loginIp: string;
  /**
   * 最后登录时间
   * @format date-time
   */
  loginDate: string;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
  roles?: Array<Role>;
  /** 部门 */
  dept?: Array<Dept>;
  posts?: Array<Post>;
  socialUsers?: Array<SocialUser>;

  /**
   * 子电话号码
   * @format
   */
  mobiles?: Array<Number>;
  /**
   * 发动机号
   * @format
   */
  bindVinSerial: string;

  /**
   * 所属角色
   * @format
   */
  userCategoryName: string;

  /**
   * 用户类型 0、3 不能修改任何信息
   * @format
   */
  userType: string;
}

/** 管理后台 - 用户分页 Request DTO */
export interface UserPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 用户账号，模糊匹配
   * @example ""
   */
  username?: string;
  /**
   * 用户昵称
   * @example ""
   */
  nickname: string;
  /**
   * 手机号码， 模糊匹配
   * @example ""
   */
  mobile?: string;
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number;
  /**
   * 创建时间
   * @example "[2022-07-01 00:00:00, 2022-07-01 23:59:59]"
   */
  createTime?: Array<string>;
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
  fullname?: string;
}

export interface CommonResultPageResultUserPageItemResponseDTO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultUserPageItemResponseDTO;
  msg?: string;
}

/**
 * 部门负责人
 * @example "部门负责人"
 */
export interface DeptLeader {
  /**
   * 负责人ID
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 负责人名称
   * @example "admin"
   */
  name: string;
  /**
   * 负责人nickname
   * @example "admin"
   */
  nickname: string;
}

/** 管理后台 - 部门信息 Response DTO */
export interface DeptResponseDTO {
  /**
   * 部门编码
   * @example "10086"
   */
  code: string;
  /**
   * 父部门编码
   * @example "100"
   */
  parentCode: string;
  /**
   * 部门名称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  name: string;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId?: number;
  /**
   * 显示顺序
   * @format int32
   * @example 1024
   */
  sort: number;
  /**
   * 负责人的用户编号
   * @uniqueItems true
   * @example "1,2,3"
   */
  leaderUserId?: Array<number>;
  /**
   * 联系电话
   * @minLength 0
   * @maxLength 11
   * @example "15601691000"
   */
  phone?: string;
  /**
   * 邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 状态,参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 部门编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
  /**
   * 部门负责人
   * @example "部门负责人"
   */
  leaders: Array<DeptLeader>;
}

/** 分页结果 */
export interface PageResultUserPageItemResponseDTO {
  /** 数据 */
  list: Array<UserPageItemResponseDTO>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 管理后台 - 用户分页时的信息 Response DTO，相比用户基本信息来说，会多部门信息 */
export interface UserPageItemResponseDTO {
  /**
   * 用户账号
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string;
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string;
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string;
  /**
   * 部门ID
   * @example "我是一个部门"
   */
  deptId: string;
  /**
   * 部门Code
   * @example "我是一个部门Code"
   */
  deptCode?: string;
  /**
   * 部门2Code
   * @example "我是一个部门Code"
   */
  dept2Code?: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string;
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string;
  /**
   * 是否AD域验证
   * @example "0"
   */
  isAd?: string;
  /**
   * 工号
   * @example "1041245"
   */
  workCard?: string;
  /**
   * 租户ID
   * @format int64
   * @example 1
   */
  tenantId?: number;
  /**
   * 用户编号
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 最后登录 IP
   * @example "192.168.1.1"
   */
  loginIp: string;
  /**
   * 最后登录时间
   * @format date-time
   */
  loginDate: string;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
  /** 部门 */
  get_deptCode?: Dept;
  /** 部门 */
  get_deptCode2?: Dept;
  /** 部门 */
  dept?: Dept;
  /** 管理后台 - 部门信息 Response DTO */
  deptDetails?: DeptResponseDTO;
  depts?: Array<Dept>;
}

export interface CommonResultListUserListItemResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<UserListItemResponseDTO>;
  msg?: string;
}

export interface DeptPO {
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
  creator?: string;
  updater?: string;
  deleted?: boolean;
  /** @format int64 */
  tenantId?: number;
  /** @format int64 */
  id?: number;
  code?: string;
  parentCode?: string;
  name?: string;
  /** @format int64 */
  parentId?: number;
  /** @format int32 */
  sort?: number;
  /** @uniqueItems true */
  leaderUserId?: Array<number>;
  /** @uniqueItems true */
  managerLeader?: Array<number>;
  /** @uniqueItems true */
  chargeLeader?: Array<number>;
  phone?: string;
  email?: string;
  /** @format int32 */
  status?: number;
  /** @format int32 */
  deptTypeCode?: number;
}

/** 管理后台 - 用户分页时的信息 Response DTO，相比用户基本信息来说，会多部门信息 */
export interface UserListItemResponseDTO {
  /**
   * 用户账号
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string;
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string;
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string;
  /**
   * 部门ID
   * @example "我是一个部门"
   */
  deptId: string;
  /**
   * 部门Code
   * @example "我是一个部门Code"
   */
  deptCode?: string;
  /**
   * 部门2Code
   * @example "我是一个部门Code"
   */
  dept2Code?: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string;
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string;
  /**
   * 是否AD域验证
   * @example "0"
   */
  isAd?: string;
  /**
   * 工号
   * @example "1041245"
   */
  workCard?: string;
  /**
   * 租户ID
   * @format int64
   * @example 1
   */
  tenantId?: number;
  /**
   * 用户编号
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 最后登录 IP
   * @example "192.168.1.1"
   */
  loginIp: string;
  /**
   * 最后登录时间
   * @format date-time
   */
  loginDate: string;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
  /** 部门 */
  dept?: Dept;
  depts?: Array<DeptPO>;
}

export interface CommonResultListUserSimpleResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<UserSimpleResponseDTO>;
  msg?: string;
}

/** 用户精简信息 Response DTO */
export interface UserSimpleResponseDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 用户昵称
   * @example ""
   */
  nickname: string;
}

export interface CommonResultUserResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 用户信息 Response DTO */
  data?: UserResponseDTO;
  msg?: string;
}

/** 管理后台 - 用户信息 Response DTO */
export interface UserResponseDTO {
  /**
   * 用户账号
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string;
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string;
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string;
  /**
   * 部门ID
   * @example "我是一个部门"
   */
  deptId: string;
  /**
   * 部门Code
   * @example "我是一个部门Code"
   */
  deptCode?: string;
  /**
   * 部门2Code
   * @example "我是一个部门Code"
   */
  dept2Code?: string;
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "@.com"
   */
  email?: string;
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string;
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string;
  /**
   * 是否AD域验证
   * @example "0"
   */
  isAd?: string;
  /**
   * 工号
   * @example "1041245"
   */
  workCard?: string;
  /**
   * 租户ID
   * @format int64
   * @example 1
   */
  tenantId?: number;
  /**
   * 用户编号
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 最后登录 IP
   * @example "192.168.1.1"
   */
  loginIp: string;
  /**
   * 最后登录时间
   * @format date-time
   */
  loginDate: string;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
  province: string;
  serviceStationName: string;
  productLine: string;
}

/** 管理后台 - 租户分页 Request DTO */
export interface TenantPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 租户名
   * @example ""
   */
  name?: string;
  /**
   * 联系人
   * @example ""
   */
  contactName?: string;
  /**
   * 联系手机
   * @example "15601691300"
   */
  contactMobile?: string;
  /**
   * 租户状态（0正常 1停用）
   * @format int32
   * @example 1
   */
  status?: number;
  /** 创建时间 */
  createTime?: Array<string>;
}

export interface CommonResultPageResultTenantResponseDTO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultTenantResponseDTO;
  msg?: string;
}

/** 分页结果 */
export interface PageResultTenantResponseDTO {
  /** 数据 */
  list: Array<TenantResponseDTO>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 管理后台 - 租户 Response DTO */
export interface TenantResponseDTO {
  /**
   * 租户名
   * @example ""
   */
  name: string;
  /**
   * 联系人
   * @example ""
   */
  contactName: string;
  /**
   * 联系手机
   * @example "15601691300"
   */
  contactMobile?: string;
  /**
   * 租户状态
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 绑定域名
   * @example "https://www.iocoder.cn"
   */
  domain?: string;
  /**
   * 租户套餐编号
   * @format int64
   * @example 1024
   */
  packageId: number;
  /**
   * 过期时间
   * @format date-time
   */
  expireTime: string;
  /**
   * 账号数量
   * @format int32
   * @example 1024
   */
  accountCount: number;
  /**
   * 租户编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
}

export interface CommonResultListTenantResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<TenantResponseDTO>;
  msg?: string;
}

export interface CommonResultTenantResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 租户 Response DTO */
  data?: TenantResponseDTO;
  msg?: string;
}

/** 管理后台 - 租户套餐分页 Request DTO */
export interface TenantPackagePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 套餐名
   * @example "VIP"
   */
  name?: string;
  /**
   * 状态
   * @format int32
   * @example 1
   */
  status?: number;
  /**
   * 备注
   * @example "好"
   */
  remark?: string;
  /** 创建时间 */
  createTime?: Array<string>;
}

export interface CommonResultPageResultTenantPackageResponseDTO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultTenantPackageResponseDTO;
  msg?: string;
}

/** 分页结果 */
export interface PageResultTenantPackageResponseDTO {
  /** 数据 */
  list: Array<TenantPackageResponseDTO>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 管理后台 - 租户套餐 Response DTO */
export interface TenantPackageResponseDTO {
  /**
   * 套餐名
   * @example "VIP"
   */
  name: string;
  /**
   * 状态，参见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 备注
   * @example "好"
   */
  remark?: string;
  /**
   * 关联的菜单编号
   * @uniqueItems true
   */
  menuIds: Array<number>;
  /**
   * 套餐编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
}

export interface CommonResultTenantPackageResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 租户套餐 Response DTO */
  data?: TenantPackageResponseDTO;
  msg?: string;
}

export interface CommonResultListTenantPackageSimpleResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<TenantPackageSimpleResponseDTO>;
  msg?: string;
}

/** 管理后台 - 租户套餐精简 Response DTO */
export interface TenantPackageSimpleResponseDTO {
  /**
   * 套餐编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 套餐名
   * @example "VIP"
   */
  name: string;
}

/** 管理后台 - 角色分页 Request DTO */
export interface RolePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 角色名称，模糊匹配
   * @example ""
   */
  name?: string;
  /**
   * 角色标识，模糊匹配
   * @example ""
   */
  code?: string;
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number;
  /**
   * 开始时间
   * @example "[2022-07-01 00:00:00,2022-07-01 23:59:59]"
   */
  createTime?: Array<string>;
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number;
}

export interface CommonResultPageResultRolePO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultRolePO;
  msg?: string;
}

/** 分页结果 */
export interface PageResultRolePO {
  /** 数据 */
  list: Array<RolePO>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 数据 */
export interface RolePO {
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
  creator?: string;
  updater?: string;
  deleted?: boolean;
  /** @format int64 */
  tenantId?: number;
  /** @format int64 */
  id?: string;
  name?: string;
  code?: string;
  /** @format int32 */
  sort?: number;
  /** @format int32 */
  status?: number;
  /** @format int32 */
  type?: number;
  remark?: string;
  /** @format int32 */
  dataScope?: number;
  /** @uniqueItems true */
  dataScopeDeptIds?: Array<number>;
  /** @format int32 */
  roleClass?: number;
}

export interface CommonResultListRoleSimpleResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<RoleSimpleResponseDTO>;
  msg?: string;
}

/** 管理后台 - 角色精简信息 Response DTO */
export interface RoleSimpleResponseDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 角色名称
   * @example ""
   */
  name: string;
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number;
}

export interface CommonResultRoleResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 角色信息 Response DTO */
  data?: RoleResponseDTO;
  msg?: string;
}

/** 管理后台 - 角色信息 Response DTO */
export interface RoleResponseDTO {
  /**
   * 角色名称
   * @minLength 0
   * @maxLength 30
   * @example "管理员"
   */
  name: string;
  /**
   * 角色编码
   * @minLength 0
   * @maxLength 100
   * @example "ADMIN"
   */
  code: string;
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort?: number;
  /**
   * 备注
   * @example "我是一个角色"
   */
  remark?: string;
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number;
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * 数据范围，参见 DataScopeEnum 枚举类
   * @format int32
   * @example 1
   */
  dataScope: number;
  /**
   * 数据范围(指定部门数组)
   * @uniqueItems true
   * @example 1
   */
  dataScopeDeptIds?: Array<number>;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 角色类型，参见 RoleTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: number;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
}

/** 管理后台 - 角色用户DTO */
export interface RoleUserRequestDTO {
  /**
   * 角色id
   * @format int64
   */
  id?: number;
  /**
   * 角色名称，模糊匹配
   * @example ""
   */
  name?: string;
  /**
   * 用户ID
   * @format int64
   * @example 1
   */
  userId?: number;
  /**
   * 用户名称，模糊匹配
   * @example ""
   */
  userName?: string;
  /**
   * 角色标识，模糊匹配
   * @example ""
   */
  code?: string;
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number;
}

export interface CommonResultListRoleUserPo {
  /** @format int32 */
  code?: number;
  data?: Array<RoleUserPo>;
  msg?: string;
}

export interface RoleUserPo {
  /** @format int64 */
  id?: number;
  name?: string;
  code?: string;
  /** @format int32 */
  roleClass?: number;
  /** @format int64 */
  userId?: number;
  userName?: string;
}

/** 管理后台 - 用户分页时的信息 Response DTO，相比用户基本信息来说，会多部门信息 */
export interface AdminListItemResponseDTO {
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
  creator?: string;
  updater?: string;
  deleted?: boolean;
  /** @format int64 */
  tenantId?: number;
  /** @format int64 */
  id?: number;
  username?: string;
  password?: string;
  nickname?: string;
  nicknamePinyin?: string;
  remark?: string;
  deptId?: string;
  deptCode?: string;
  dept2Code?: string;
  email?: string;
  mobile?: string;
  /** @format int32 */
  sex?: number;
  avatar?: string;
  /** @format int32 */
  status?: number;
  loginIp?: string;
  /** @format date-time */
  loginDate?: string;
  isAd?: string;
  workCard?: string;
  roleIds?: Array<string>;
  /** 部门 */
  dept?: Dept;
  depts?: Array<Dept>;
  /** @format int64 */
  roleId?: number;
  py?: string;
}

export interface CommonResultListAdminListItemResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<AdminListItemResponseDTO>;
  msg?: string;
}

/** 管理后台 - 菜单列表 Request DTO */
export interface MenuListRequestDTO {
  /**
   * 菜单名称，模糊匹配
   * @example ""
   */
  name?: string;
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number;
}

/** 管理后台 - 菜单列表 Request DTO */
export interface ordermanagementListRequestDTO {
  /**
   * 菜单名称，模糊匹配
   * @example ""
   */
  orderContractNumber?: string;
  id?: string;
  orderId?: string;
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  customerName?: string;
  orderType?: string;
  orderDate?: string;
  adminName?: string;
  adminDeptName?: string;
  orderStatus?: string;
  amount?: string;
  userNickname?: string;
  remark?: string;
}
/** 管理后台 - 区域列表 Request DTO */
export interface regionListRequestDTO {
  /**
   * 区域名称
   * @example ""
   */
  type?: string;
}

export interface CommonResultListMenuResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<MenuResponseDTO>;
  msg?: string;
}

/** 管理后台 - 菜单信息 Response DTO */
export interface MenuResponseDTO {
  /**
   * 菜单名称
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  name: string;
  /**
   * 权限标识,仅菜单类型为按钮时，才需要传递
   * @minLength 0
   * @maxLength 100
   * @example "sys:menu:add"
   */
  permission?: string;
  /**
   * 类型,参见 MenuTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: number;
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort: number;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId: number;
  /**
   * 路由地址,仅菜单类型为菜单或者目录时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "post"
   */
  path?: string;
  /**
   * 菜单图标,仅菜单类型为菜单或者目录时，才需要传
   * @example "/menu/list"
   */
  icon?: string;
  /**
   * 组件路径,仅菜单类型为菜单时，才需要传
   * @minLength 0
   * @maxLength 200
   * @example "system/post/index"
   */
  component?: string;
  /**
   * 组件名
   * @example "SystemUser"
   */
  componentName?: string;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 是否可见
   * @example false
   */
  visible?: boolean;
  /**
   * 是否缓存
   * @example false
   */
  keepAlive?: boolean;
  /**
   * 是否总是显示
   * @example false
   */
  alwaysShow?: boolean;
  /**
   * 菜单编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
}

export interface CommonResultListMenuSimpleResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<MenuSimpleResponseDTO>;
  msg?: string;
}

/** 管理后台 - 菜单精简信息 Response DTO */
export interface MenuSimpleResponseDTO {
  /**
   * 菜单编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 菜单名称
   * @example ""
   */
  name: string;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId: number;
  /**
   * 类型，参见 MenuTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: number;
}

export interface CommonResultMenuResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 菜单信息 Response DTO */
  data?: MenuResponseDTO;
  msg?: string;
}

/** 管理后台 - 登录日志分页列表 Request VO */
export interface LoginLogPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 用户 IP，模拟匹配
   * @example "127.0.0.1"
   */
  userIp?: string;
  /**
   * 用户账号，模拟匹配
   * @example "芋道"
   */
  username?: string;
  /**
   * 操作状态
   * @example true
   */
  status?: boolean;
  /**
   * 登录时间
   * @example "[2022-07-01 00:00:00,2022-07-01 23:59:59]"
   */
  createTime?: Array<string>;
}

export interface CommonResultPageResultLoginLogResponseDTO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultLoginLogResponseDTO;
  msg?: string;
}

/** 管理后台 - 登录日志 Response VO */
export interface LoginLogResponseDTO {
  /**
   * 日志类型,参见 LoginLogTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  logType: number;
  /**
   * 链路追踪编号
   * @example "89aca178-a370-411c-ae02-3f0d672be4ab"
   */
  traceId: string;
  /**
   * 用户账号
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  username: string;
  /**
   * 登录结果，参见 LoginLogTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  result: number;
  /**
   * 用户 IP
   * @example "127.0.0.1"
   */
  userIp: string;
  /**
   * 浏览器 UserAgent
   * @example "Mozilla/5.0"
   */
  userAgent?: string;
  /**
   * 日志编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 用户编号
   * @format int64
   * @example 666
   */
  userId?: number;
  /**
   * 登录时间
   * @format date-time
   */
  createTime: string;
}

/** 分页结果 */
export interface PageResultLoginLogResponseDTO {
  /** 数据 */
  list: Array<LoginLogResponseDTO>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 管理后台 - 字典类型分页列表 Request DTO */
export interface DictTypePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 字典类型名称，模糊匹配
   * @example ""
   */
  name?: string;
  /**
   * 字典类型，模糊匹配
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  type?: string;
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number;
  /** 创建时间 */
  createTime?: Array<string>;
}

export interface CommonResultPageResultDictTypeResponseDTO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultDictTypeResponseDTO;
  msg?: string;
}

/** 管理后台 - 字典类型信息 Response DTO */
export interface DictTypeResponseDTO {
  /**
   * 字典名称
   * @minLength 0
   * @maxLength 100
   * @example "性别"
   */
  name: string;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 备注
   * @example "快乐的备注"
   */
  remark?: string;
  /**
   * 字典类型编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 字典类型
   * @example "sys_common_sex"
   */
  type: string;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
}

/** 分页结果 */
export interface PageResultDictTypeResponseDTO {
  /** 数据 */
  list: Array<DictTypeResponseDTO>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}

export interface CommonResultListDictTypeSimpleResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<DictTypeSimpleResponseDTO>;
  msg?: string;
}

/** 管理后台 - 字典类型精简信息 Response DTO */
export interface DictTypeSimpleResponseDTO {
  /**
   * 字典类型编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 字典类型名称
   * @example ""
   */
  name: string;
  /**
   * 字典类型
   * @example "sys_common_sex"
   */
  type: string;
}

export interface CommonResultDictTypeResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 字典类型信息 Response DTO */
  data?: DictTypeResponseDTO;
  msg?: string;
}

/** 管理后台 - 字典类型分页列表 Request DTO */
export interface DictDataPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 字典标签
   * @minLength 0
   * @maxLength 100
   * @example ""
   */
  label?: string;
  /**
   * 字典类型，模糊匹配
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  dictType?: string;
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number;
}

export interface CommonResultPageResultDictDataResponseDTO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultDictDataResponseDTO;
  msg?: string;
}

/** 管理后台 - 字典数据信息 Response DTO */
export interface DictDataResponseDTO {
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort: number;
  /**
   * 字典标签
   * @minLength 0
   * @maxLength 100
   * @example ""
   */
  label: string;
  /**
   * 字典值
   * @minLength 0
   * @maxLength 100
   * @example "iocoder"
   */
  value: string;
  /**
   * 字典类型
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  dictType: string;
  /**
   * 状态,见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 颜色类型,default、primary、success、info、warning、danger
   * @example "default"
   */
  colorType?: string;
  /**
   * css 样式
   * @example "btn-visible"
   */
  cssClass?: string;
  /**
   * 备注
   * @example "我是一个角色"
   */
  remark?: string;
  /**
   * 字典数据编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string;
}

/** 分页结果 */
export interface PageResultDictDataResponseDTO {
  /** 数据 */
  list: Array<DictDataResponseDTO>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}

export interface CommonResultListDictDataSimpleResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<DictDataSimpleResponseDTO>;
  msg?: string;
}

/** 管理后台 - 数据字典精简 Response DTO */
export interface DictDataSimpleResponseDTO {
  /**
   * 字典类型
   * @example "gender"
   */
  dictType: string;
  /**
   * 字典键值
   * @example "1"
   */
  value: string;
  /**
   * 字典标签
   * @example "男"
   */
  label: string;
  /**
   * 颜色类型，default、primary、success、info、warning、danger
   * @example "default"
   */
  colorType?: string;
  /**
   * css 样式
   * @example "btn-visible"
   */
  cssClass?: string;
}

export interface CommonResultDictDataResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 字典数据信息 Response DTO */
  data?: DictDataResponseDTO;
  msg?: string;
}

/** 管理后台 - 部门列表 Request DTO */
export interface DeptListRequestDTO {
  /**
   * 部门名称,模糊匹配
   * @example ""
   */
  name?: string;
  /**
   * 展示状态,参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number;
  /**
   * 父部门ID
   * @format int32
   * @example 0
   */
  parentId?: number;
}

export interface CommonResultListDeptResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<DeptResponseDTO>;
  msg?: string;
}

/** 管理后台 - 组织架构 Request DTO */
export interface DeptUserRequestDTO {
  /** @format int64 */
  parentId?: number;
}

export interface CommonResultJSONArray {
  /** @format int32 */
  code?: number;
  data?: {
    relatedArray?: object;
    componentType?: {
      typeName?: string;
    };
    empty?: boolean;
  };
  msg?: string;
}

export interface CommonResultListDeptSimpleResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<DeptSimpleResponseDTO>;
  msg?: string;
}

/** 管理后台 - 部门精简信息 Response DTO */
export interface DeptSimpleResponseDTO {
  /**
   * 部门编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 部门代码
   * @example "10086"
   */
  code: string;
  /**
   * 部门名称
   * @example ""
   */
  name: string;
  /**
   * 父部门 ID
   * @format int64
   * @example 1024
   */
  parentId: number;
}

export interface CommonResultDeptResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 部门信息 Response DTO */
  data?: DeptResponseDTO;
  msg?: string;
}

export interface CommonResultListDeptPO {
  /** @format int32 */
  code?: number;
  data?: Array<DeptPO>;
  msg?: string;
}

export interface CommonResultString {
  /** @format int32 */
  code?: number;
  data?: string;
  msg?: string;
}

export interface CommonResultMapObjectObject {
  /** @format int32 */
  code?: number;
  data?: Record<string, object>;
  msg?: string;
}

export interface CommonResultTableDto {
  /** @format int32 */
  code?: number;
  /** 管理后台 -表格组件 */
  data?: TableDto;
  msg?: string;
}

export interface CommonResultListTableDto {
  /** @format int32 */
  code?: number;
  data?: Array<TableDto>;
  msg?: string;
}

/** 管理后台 - 登录用户的菜单信息 Response DTO */
export interface AuthMenuResponseDTO {
  /**
   * 菜单名称
   * @format int64
   */
  id: number;
  /**
   * 父菜单 ID
   * @format int64
   * @example 1024
   */
  parentId: number;
  /**
   * 菜单名称
   * @example ""
   */
  name: string;
  /**
   * 路由地址,仅菜单类型为菜单或者目录时，才需要传
   * @example "post"
   */
  path?: string;
  /**
   * 组件路径,仅菜单类型为菜单时，才需要传
   * @example "system/post/index"
   */
  component?: string;
  /**
   * 组件名
   * @example "SystemUser"
   */
  componentName?: string;
  /**
   * 菜单图标,仅菜单类型为菜单或者目录时，才需要传
   * @example "/menu/list"
   */
  icon?: string;
  /**
   * 是否可见
   * @example false
   */
  visible: boolean;
  /**
   * 是否缓存
   * @example false
   */
  keepAlive: boolean;
  /**
   * 是否总是显示
   * @example false
   */
  alwaysShow?: boolean;
}

export interface CommonResultListAuthMenuResponseDTO {
  /** @format int32 */
  code?: number;
  data?: Array<AuthMenuResponseDTO>;
  msg?: string;
}

/** 管理后台 - 登录用户的权限信息 Response DTO，额外包括用户信息和角色列表 */
export interface AuthPermissionInfoResponseDTO {
  /** 用户信息 DTO */
  user: UserVO;
  /**
   * 角色标识数组
   * @uniqueItems true
   */
  roles: Array<string>;
  /**
   * 操作权限数组
   * @uniqueItems true
   */
  permissions: Array<string>;
}

export interface CommonResultAuthPermissionInfoResponseDTO {
  /** @format int32 */
  code?: number;
  /** 管理后台 - 登录用户的权限信息 Response DTO，额外包括用户信息和角色列表 */
  data?: AuthPermissionInfoResponseDTO;
  msg?: string;
}

/** 用户信息 DTO */
export interface UserVO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number;
  /**
   * 用户昵称
   * @example ""
   */
  nickname: string;
  /**
   * 用户头像
   * @example "http://www.iocoder.cn/xx.jpg"
   */
  avatar: string;
}

/** 管理后台 -用户管理- 用户 */
export interface UserFormDTO {
  /**
   * 数据id
   ** @format int64
   ** @example 1024
   */
  id: number;
  /**
   * 角色标识数组
   * @uniqueItems true
   */
  roleid: Array<string>;
  /**
   * 用户昵称
   * @example ""
   */
  nickname: string;
  /**
   * 用户账号area
   * @example ""
   */
  username: string;
  /**
   * 联系人
   * @example ""
   */
  contract: string;
  /**
   * 部门ID
   * @example ""
   */
  deptId: number | string;

  /**
   * 用户昵称
   * @example ""
   */
  region: string;

  /**
   * 用户昵称
   * @example ""
   */
  mobile: string;

  /**
   * 用户昵称
   * @example ""
   */
  address: string;

  /**
   * 用户昵称
   * @example ""
   */
  email: string;

  /**
   * 业务范围数组
   * @uniqueItems true
   */
  bizRange: Array<string>;
  /**
   * 工作证号
   * @example ""
   */
  workCard?: string;

  /**
   * 主机厂名
   * @example ""
   */
  mainMachineFactory: string;

  /**
   * 业务公司
   * @example ""
   */
  company: string;

  /**
   * 用户组
   * @example ""
   */
  userCategory: string;
  /**
   * 用户类别
   * @example ""
   */
  type: string;

  /**
   * 备注
   * @example ""
   */
  remark: string;
  /**
   * 行业数组
   * @uniqueItems true
   */
  industry: Array<string>;
  province: string;
  serviceStationName: string;
  productLine: string;
}
/** 数据同步异常管理 */
export interface AbnormalFormDTO {
  /**
   * 数据id
   ** @format int64
   ** @example 1024
   */
  userIp: string;
  /**
   * 名称
   * @uniqueItems true
   */
  name: string;
  /**
   * 同步状态
   * @example ""
   */
  resultCode: number | string;
  /**
   * 失败说明
   * @example ""
   */
  resultMsg: string;
  /**
   * 是否重试
   * @example ""
   */
  retryFlag: string;
  /**
   * 同步时间
   * @example ""
   */
  startTime: string;

  /**
   * Java 方法名
   * @example ""
   */
  javaMethod: string;
  /**
   * Java 方法的参数
   * @example ""
   */
  javaMethodArgs: string;
}
/** 装机bom比对 */
export interface InstallationBOMcomparison {
  /**
   * 数据id
   ** @format int64
   ** @example 1024
   */
  id: string;
  /**
   * 类别
   * @uniqueItems true
   */
  type: string;
  /**
   * 同步状态
   * @example ""
   */
  queryType: number | string;
  /**
   * 查询时间
   * @example ""
   */
  queryParam: string;
  /**
   * 任务状态
   * @example ""
   */
  status: string;
  /**
   * 创建时间
   * @example ""
   */
  createTime: string;

  /**
   * Java 执行结果
   * @example ""
   */
  result: string;
  /**
   * 文件信息
   * @example ""
   */
  fileInfo: any;
}

// ------------------start------------语言管理---------------------------------------------

/** 管理后台 - 语言分页 Request DTO */
export interface LanguagePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 语言名称，模糊匹配
   * @example ""
   */
  searchKey?: string;
}

export interface CommonResultPageResultLanguagePO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultLanguagePO;
  msg?: string;
}

/** 分页结果 */
export interface PageResultLanguagePO {
  /** 数据 */
  list: Array<LanguagePO>;

  /**
   * columns 数据
   *
   */
  language: Array<LanguagePO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 数据 */
export interface LanguagePO {
  /** @format date-time */
  createTime?: string;
}

/** columns 数据 */
export interface ColumnsLanguagePO {
  /** @format date-time */
  createTime?: string;

  /** @format updateTime */
  updateTime?: string;
  creator?: string;
  updater?: string;
  deleted: boolean;
  tenantId: number;
  id: number;
  lang: string;
  langDesc: string;
  langDirection: string;
  enabled: number;
  fileId: number;
}
// ------------------end------------语言管理---------------------------------------------
// ------------------start------------基础语言列表---------------------------------------------
/** 管理后台 - 基础语言分页 Request DTO */
export interface BasiclanguagePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 语言
   * @example "中文"
   */
  name?: string;
}
/** columns 数据 */
export interface ColumnsBasiclanguage {
  lang: string;
  langDesc: string;
  langDirection: string;
  fileId?: number;
  leaderUserId?: Array<number>;
}

/** 分页结果 */
export interface PageResultlanguagePO {
  /** 数据 */
  list: Array<ColumnsBasiclanguage>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}
export interface CommonResultListBasiclanguage {
  /** @format int32 */
  code?: number;
  data?: Array<PageResultlanguagePO>;
  msg?: string;
}
// ------------------end------------基础语言列表---------------------------------------------

// ------------------start-----------个人中心-我的收藏---------------------------------------------

/** 管理后台 -收藏分页 Request DTO */
export interface CollectPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 条件,示例值(订货号缺失)，模糊匹配
   * @example ""
   */
  condition?: string;
}

/** 返回结果 */
export interface CommonResultPageResultCollectPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultCollectPO;
  msg?: string;
}

/** 分页结果 */
export interface PageResultCollectPO {
  /** 数据 */
  list: Array<CollectPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 数据 */
export interface CollectPO {
  /** @format date-time */
  createTime?: string;

  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 对象编号
   * @example ""
   */
  objNumber?: string;

  /**
   * 对象类型
   * @example ""
   */
  objTyp?: string;

  /**
   * 对象名称
   * @example ""
   */
  objName?: string;

  /**
   * 对象id
   * @example ""
   */
  objId?: string;

  /**
   * 收藏来源
   * @example ""
   */
  favoriteFrom?: string;

  /**
   * 收藏路径
   * @example ""
   */
  url?: string;

  /**
   * 页面参数
   * @example ""
   */
  params?: string;
}

// ------------------end------------个人中心-我的收藏---------------------------------------------

// ------------------start-----------购物车---------------------------------------------

/** 购物车  Request DTO */
export interface ShoppingCartPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;
  /**
   * 用户名称
   * @format int32
   * @min 1
   * @example 1
   */
  customName?: string;
  /**
   * 零件编号
   * @format int32
   * @min 1
   * @example 1
   */
  materialCode?: string;
  /**
   * 订货号
   * @format int32
   * @min 1
   * @example 1
   */
  dhhName?: string;
}
/** 购物车  Request DTO */
export interface ShopDataRequestDTO {
  /**
   * 用户名称
   * @format int32
   * @min 1
   * @example 1
   */
  customName?: string;
  /**
   * 零件编号
   * @format int32
   * @min 1
   * @example 1
   */
  materialCode?: string;
  /**
   * 订货号
   * @format int32
   * @min 1
   * @example 1
   */
  dhhName?: string;
}

/** 数据 */
export interface ShoppingCartPO {
  /** @format date-time */
  addDate?: string;

  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 对象编号
   * @example ""
   */
  objNumber?: string;

  /**
   * 对象类型
   * @example ""
   */
  objType?: string;

  /**
   * 对象名称
   * @example ""
   */
  objName?: string;

  /**
   * 对象id
   * @example ""
   */
  objId?: string;

  /**
   * 数量
   * @example ""
   */
  amount?: number;

  /**
   * 状态
   * @example ""
   */
  status?: string;
}

/** 分页结果 */
export interface PageResultShoppingCartPO {
  /** 数据 */
  data: Array<ShoppingCartPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultShoppingCartPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultShoppingCartPO;
  msg?: string;
}

// ------------------end------------购物车---------------------------------------------

// ------------------start-----------我的反馈---------------------------------------------

/** 数据 */
export interface FeedbackPO {
  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 类型
   * @example ""
   */
  category?: string;

  /**
   * 问题描述
   * @example ""
   */
  content?: string;

  /**
   * 状态（未开始，正在处理，已完成）
   * @example ""
   */
  status?: string;

  /**
   * 提交人
   *  @format date-time
   * @example ""
   */
  creatorName?: string;

  /**
   * 日期
   * @example ""
   */
  createTime?: string;
}

/** 我的反馈  Request DTO */
export interface FeedbackPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 条件,示例值(订货号缺失)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string;

  /**
   * 状态
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  status?: string;

  /**
   * 发放开始时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  startCreateTime?: string;

  /**
   * 发放结束时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  endCreateTime?: string;
}

/** 分页结果 */
export interface PageResultFeedbackPO {
  /** 数据 */
  list: Array<FeedbackPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultFeedbackPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultFeedbackPO;
  msg?: string;
}

// ------------------end--------------我的反馈----------------------------------------------

// ------------------start------------帮助---------------------------------------------
/** 管理后台 - 帮助文档精简信息 Response DTO */
export interface HelpSimpleResponseDTO {
  /**
   * 帮助树ID
   * @format uuid
   * @example 123
   */
  id: string;
  /**
   * 父节点 ID
   * @format uuid
   * @example 12345
   */
  parentId: string;

  /**
   * 父节点名称
   * @example "根目录"
   */
  parentName: string;

  /**
   * 国际化语音
   * @example "zh_CN"
   */
  lang: string;

  /**
   * 节点名称
   * @example "33"
   */
  articleName: string;

  /**
   * 备注信息
   * @example "33"
   */
  articleContent: string;
}
export interface CommonResultListHelpSimpleResponseDTO {
  /** @format int32 */
  data?: HelpSimpleResponseDTO;
  msg?: string;
}

/** 帮助文档排序 Response DTO */
export interface HelpSortResponseDTO {
  /**
   * 帮助树ID
   * @example 123
   */
  id: string;
  /**
   * 备注信息
   * @example "33"
   */
  exchangeId: string;
}

// ------------------end------------帮助---------------------------------------------

// ------------------start-----------我的任务---------------------------------------------

/** 数据 */
export interface TaskPO {
  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 类型
   * @example ""
   */
  category?: string;

  /**
   * 标题
   * @example ""
   */
  title?: string;

  /**
   * 状态（未开始，正在处理，已完成）
   * @example ""
   */
  status?: string;

  /**
   * 提交人
   *  @format date-time
   * @example ""
   */
  creatorName?: string;

  /**
   * 日期
   * @example ""
   */
  createTime?: string;

  /**
   * 未读条数
   * @example ""
   */
  unReadCount?: number;
}

/** 我的反馈  Request DTO */
export interface TaskPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 条件,示例值(订货号缺失)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string;

  /**
   * 状态
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  status?: string;

  /**
   * 发放开始时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  startCreateTime?: string;

  /**
   * 发放结束时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  endCreateTime?: string;
}

/** 分页结果 */
export interface PageResultTaskPO {
  /** 数据 */
  list: Array<TaskPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultTaskPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultTaskPO;
  msg?: string;
}

// ------------------end--------------我的反馈----------------------------------------------

// ------------------start-----------我的公告---------------------------------------------

/** 数据 */
export interface NoticePO {
  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 通知公告标题
   * @example ""
   */
  noticeTitle?: string;

  /**
   * 业务范围
   * @example ""
   */
  noticeType?: string;

  /**
   * 状态（未开始，正在处理，已完成）
   * @example ""
   */
  bizRange?: string;

  /**
   * 发放范围
   *  @format date-time
   * @example ""
   */
  distributeRange?: string;

  /**
   * 公告生效开始时间
   * @example ""
   */
  noticeEffStart?: string;

  /**
   * 公告生效结束时间
   * @example ""
   */
  noticeEffEnd?: string;

  /**
   * 公告所属语言;语言表
   * @example ""
   */
  lang?: string;

  /**
   * 公告内容
   * @example ""
   */
  noticeContent?: string;

  /**
   * 公告状态
   * @example ""
   */
  status?: number;

  /**
   * 公告附件
   * @example ""
   */
  fileId?: number;

  /**
   * 只读状态
   * @example ""
   */
  isReadFlag?: boolean;
}

/** 我的反馈  Request DTO */
export interface NoticePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 数据类型,示例值(1:管理端 2:个人中心)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  type?: string;

  /**
   * 通知公告标题
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  noticeTitle?: string;

  /**
   * 通知公告类型
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  noticeType?: string;

  /**
   * 业务范围
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  bizRange?: string;

  /**
   * 发放范围
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  distributeRange?: string;
}

/** 分页结果 */
export interface PageResultNoticePO {
  /** 数据 */
  list: Array<NoticePO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultNoticePO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultNoticePO;
  msg?: string;
}

// ------------------end--------------我的公告----------------------------------------------

// ------------------start-------------同义词管理---------------------------------------------

/** 数据 */
export interface TranslatedWordsPO {
  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 标准名称
   * @example ""
   */
  stdTerm?: string;

  /**
   * 用户用语
   * @example ""
   */
  userTerm?: string;

  /**
   * 编辑人员
   * @example ""
   */
  updaterName?: string;

  /**
   * 更新时间
   *  @format date-time
   * @example ""
   */
  updateTime?: string;
}

/**   Request DTO */
export interface TranslatedWordsPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 搜索条件
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string;
}

/** 分页结果 */
export interface PageResultTranslatedWordsPO {
  /** 数据 */
  list: Array<TranslatedWordsPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultTranslatedWordsPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultTranslatedWordsPO;
  msg?: string;
}

// ------------------end--------------同义词管理----------------------------------------------

// ------------------start-------------备品替换管理---------------------------------------------

/** 数据 */
export interface PartsReplacePO {
  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 旧件号
   * @example ""
   */
  oldNumber?: string;

  /**
   * 新件号，留空，无需在前端界面展示
   * @example ""
   */
  newNumber?: string;

  /**
   * 替换说明
   * @example ""
   */
  desc?: string;

  /**
   * 修改人
   *  @format date-time
   * @example ""
   */
  updaterName?: string;

  /**
   * 更新时间
   *  @format date-time
   * @example ""
   */
  updateTime?: string;
}

/**   Request DTO */
export interface PartsReplacePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 搜索条件
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string;

  /**
   * 零件号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partNumber?: string;
}

/** 分页结果 */
export interface PageResultPartsReplacePO {
  /** 数据 */
  list: Array<PartsReplacePO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultPartsReplacePO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultPartsReplacePO;
  msg?: string;
}

// ------------------end--------------备品替换管理----------------------------------------------

// ------------------start-------------上传配件图片---------------------------------------------

/** 图片数据 */
export interface imagesPO {
  /**
   * 唯一ID
   * @example ""
   */
  id: string;

  /**
   * 文件名称
   * @example ""
   */
  fileName: string;

  /**
   * 路径
   * @example ""
   */
  filePath: string;
}

/** 数据 */
export interface AccessoryPicturesPO {
  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 配件号
   * @example ""
   */
  partNumber?: string;

  /**
   * 新件号，留空，无需在前端界面展示
   * @example ""
   */
  images?: Array<imagesPO>;

  /**
   * 修改人
   *  @format date-time
   * @example ""
   */
  updaterName?: string;

  /**
   * 更新时间
   *  @format date-time
   * @example ""
   */
  createTime?: string;
}

/**  Request DTO */
export interface AccessoryPicturesPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 搜索条件
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string;
}

/** 分页结果 */
export interface PageResultAccessoryPicturesPO {
  /** 数据 */
  list: Array<AccessoryPicturesPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultAccessoryPicturesPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultAccessoryPicturesPO;
  msg?: string;
}

// ------------------end--------------上传配件图片----------------------------------------------

// ------------------start-------------上传整机图片---------------------------------------------

/** 图片数据 */
export interface imagesPO {
  /**
   * 唯一ID
   * @example ""
   */
  id: string;

  /**
   * 文件名称
   * @example ""
   */
  fileName: string;

  /**
   * 路径
   * @example ""
   */
  filePath: string;
}

/** 数据 */
export interface MachinePicturesPO {
  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 行业（字典：INDUSTRY）
   * @example ""
   */
  industry?: string;

  /**
   * 系列（字典：SERIES）
   * @example ""
   */
  series?: string;

  /**
   * 燃料类型（字典：FUEL_TYPE）
   * @example ""
   */
  fuelType?: string;

  /**
   * 排放（字典：EMISSION）
   * @example ""
   */
  emission?: string;

  /**
   * series
   * @example ""
   */
  images?: Array<any>;
}

/**  Request DTO */
export interface MachinePicturesPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 搜索条件
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string;
}

/** 分页结果 */
export interface PageResultMachinePicturesPO {
  /** 数据 */
  list: Array<MachinePicturesPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultMachinePicturesPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultMachinePicturesPO;
  msg?: string;
}

/** 返回结果 */
export interface CommonResultResultMachinePicturesPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: MachinePicturesPO;
  msg?: string;
}

// ------------------end--------------上传整机图片----------------------------------------------

// ------------------start-------------获取字典---------------------------------------------

/** 数据 */
export interface DictionaryPO {
  /**
   * 行业（字典：INDUSTRY）
   * @example ""
   */
  category?: string;

  /**
   * 编码
   * @example ""
   */
  dicKey?: string;

  /**
   * 燃料类型（字典：FUEL_TYPE）
   * @example ""
   */
  dicValue?: string;
}

/** 分页结果 */
export interface ResultDictionaryPO {
  /** 数据 */
  list: Array<DictionaryPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: ResultDictionaryPO;
  msg?: string;
}

// ------------------end--------------获取字典----------------------------------------------

// ------------------start------------首页搜索---------------------------------------------

/**  数据 */
export interface BeltOrThermostatPO {
  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  /**
   * 零件编号
   * @example ""
   */
  partNumber?: string;

  /**
   * 零件名称
   * @example ""
   */
  partName?: string;

  /**
   * 皮带类型
   * @example ""
   */
  beltType?: string;

  /**
   * 单位
   * @example ""
   */
  unit?: string;

  /**
   * 有效长度
   * @example ""
   */
  effectiveLength?: string;

  /**
   * 有效长度
   * @example ""
   */
  specs?: string;

  /**
   * 楔数
   * @example ""
   */
  wedgeNumber?: string;

  /**
   * 楔数
   * @example ""
   */
  remark?: string;

  /**
   * 初开温度
   * @example ""
   */
  initTemp?: string;

  /**
   * 全开温度
   * @example ""
   */
  fullTemp?: string;
}

/**  Request DTO */
export interface BeltOrThermostatOrfilterPageRequestDTO {
  /**
   * 零件编号
   * @format int32
   * @min 1
   * @example 1
   */
  partNumber?: string;
  /**
   * 零件名称
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partName?: string;

  /**
   * 皮带类型
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  beltType?: string;

  /**
   * 有效长度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  effectiveLength?: string;

  /**
   * 楔数
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  wedgeNumber?: string;

  /**
   * 初开温度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  initTemp?: string;

  /**
   * 全开温度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  fullTemp?: string;

  /**
   * 滤芯长度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  filterLen?: string;

  /**
   * 滤芯直径
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  filterDiameter?: string;
}

/** 分页结果 */
export interface ResultBeltPO {
  /** 数据 */
  list: Array<BeltOrThermostatPO>;
}

/** 返回结果 */
export interface CommonResultResultBeltPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: ResultBeltPO;
  msg?: string;
}

// ------------------end--------------首页搜索----------------------------------------------

// ------------------start--------------服务资料管理----------------------------------------------
/** 服务资料分类表 Response DTO */
export interface InformationTreeResponseDTO {
  /**
   * 帮助树ID
   * @format uuid
   * @example 123
   */
  id: string;
  /**
   * 父节点 ID
   * @format uuid
   * @example 12345
   */
  parentId: string;

  /**
   * 父节点名称
   * @example "根目录"
   */
  parentName: string;

  /**
   * 节点名称
   * @example "33"
   */
  nodeName: string;

  /**
   * 内置标识
   * @example true
   */
  innerFlag: Boolean;

  /**
   * 排序
   * @example "1"
   */
  sort: Number;
}

export interface CommonResultInformationTreeResponseDTO {
  /** @format int32 */
  data?: Array<InformationTreeResponseDTO>;
  msg?: string;
}

/** 数据 */
export interface InformationPO {
  /**
   * 唯一ID
   * @example "1123333333"
   */
  id?: string;

  /**
   * 件号
   * @example "WP1301"
   */
  docNum?: string;

  /**
   * 型号
   * @example "WP1301"
   */
  model?: string;

  /**
   * 用途
   * @example "卡车"
   */
  usage?: string;

  /**
   * 燃料类型
   * @example ""
   */
  fuelType?: string;

  /**
   * 功率
   *  @format date-time
   * @example ""
   */
  power?: string;

  /**
   * 排放
   * @example ""
   */
  emission?: string;

  /**
   * 语言
   * @example ""
   */
  lang?: string;

  /**
   * pdm手动上传
   * @example ""
   */
  docFrom?: string;

  /**
   * PDM中文档ID
   * @example ""
   */
  docOid?: string;

  /**
   * 文档编号
   * @example ""
   */
  docNumber?: string;
  /**
   * 文档名称
   * @example ""
   */
  docName?: string;
  /**
   * 文档类型：维修手册、保养说明书、培训材料、船机、发电专业保养卡、针脚图
   * @example ""
   */
  docType?: string;

  /**
   * 文档名称
   * @example ""
   */
  docVersion?: string;
  /**
   * 文档ID
   * @example ""
   */
  fileId?: string;

  /**
   * 文件状态：有效、无效
   * @example ""
   */
  fileStatus?: string;
}

/** 服务资料管理 Request DTO */
export interface InformationPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo?: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize?: number;

  /**
   * 名称
   * @example '11111'
   */
  name?: string;

  /**
   * 件号
   * @example '22222'
   */
  partNum?: string;

  /**
   * 行业
   * @example '22222'
   */
  industry?: string;

  /**
   * 系列
   * @example '22222'
   */
  series?: string;

  /**
   * 燃料类型
   * @example '22222'
   */
  fuelType?: string;

  /**
   * 排放
   * @example '22222'
   */
  power?: string;

  /**
   * 语音
   * @example '22222'
   */
  lang?: string;
}

export interface CommonResultPageResultInformationDTO {
  /** @format int32 */
  data?: PageResultInformationPO;
  msg?: string;
}

/** 分页结果 */
export interface PageResultInformationPO {
  /** 数据 */
  list: Array<InformationPO>;
  /**
   * 总量
   * @format int64
   */
  total: number;
}

// ------------------end--------------服务资料管理----------------------------------------------

// ------------------start------------商品---------------------------------------------

/**  数据 */
export interface GoodsPO {
  /**
   * 零部件编号-下单使用
   * @example ""
   */
  number?: string;

  /**
   * 零部件名称
   * @example ""
   */
  name?: string;

  /**
   * 商品名称
   * @example ""
   */
  goodsName?: string;

  /**
   * 备注
   * @example ""
   */
  remark?: string;

  /**
   * 规格
   * @example ""
   */
  spec?: string;

  /**
   * 成熟度
   * @example ""
   */
  maturity?: string;

  /**
   * 销售状态
   * @example ""
   */
  salesStatus?: string;

  /**
   * 所属大类
   * @example ""
   */
  category1?: string;

  /**
   * 所属子类
   * @example ""
   */
  category2?: string;

  /**
   * 是否可加购
   * @example ""
   */
  buyFlag?: string;

  /**
   * 文件id
   * @example ""
   */
  fileId?: string;

  image?: imgPo;
}

interface imgPo {
  /**
   * 文件ID
   * @example ""
   */
  id?: string;

  /**
   * 文件名称
   * @example ""
   */
  fileName?: string;

  /**
   * 路径
   * @example ""
   */
  filePath?: string;
}

/**  Request DTO */
export interface GoodsPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number;

  /**
   * 所属大类
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  category1?: string;

  /**
   * 所属子类
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  category2?: string;
}

/** 分页结果 */
export interface PageResultGoodsPO {
  /** 数据 */
  list: Array<GoodsPO>;

  /**
   * 总量
   * @format int64
   */
  total: number;
}

/** 返回结果 */
export interface CommonResultPageResultGoodsPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultGoodsPO;
  msg?: string;
}

// ------------------end--------------商品----------------------------------------------

// ------------------start------------零件图册---------------------------------------------

/** 零件图册 bom树 数据 */
export interface PartsCatalogPO {
  /**
   * ECU零件编号
   * @example ""
   */
  ecuPartNumber?: string;

  /**
   * 心组件编号
   * @example ""
   */
  heartPartNumbers?: Array<string>;

  /**
    * 零件bom树节

    * @example ""
    */
  orderNumberNode?: OrderNumberNodePO;
}

export class OrderNumberNodePO {
  /**
   * 唯一ID:
   * @example ""
   */
  // key?: string;

  /**
   * 唯一ID:与SIS中的零部件ID相同
   * @example ""
   */
  id?: string;

  /**
   * MasterId
   * @example ""
   */
  masterId?: string;

  /**
   * 零件名称
   * @example ""
   */
  partNumber?: string;

  /**
   * 零件编号
   * @example ""
   */
  partName?: string;

  /**
   * SIS中的类型，只需要最后的内码
   * @example ""
   */
  softtype?: string;

  /**
   * 订货版本号
   * @example ""
   */
  dhhType?: string;

  /**
   * 版本
   * @example ""
   */
  version?: string;

  /**
   * 生效日期
   * @example ""
   */
  effDate?: string;

  /**
   * 失效日期
   * @example ""
   */
  invalidDate?: string;

  /**
   * 变更单号
   * @example ""
   */
  ecnNumber?: string;

  /**
   * 业务范围
   * @example ""
   */
  bizRange?: string;

  /**
   * pvz文件id
   * @example ""
   */
  pvzFileId?: number;

  /**
   * svg文件id
   * @example ""
   */
  svgFileId?: number;

  /**
   * 图序号
   * @example ""
   */
  orderNo?: number;

  /**
   * 收藏标识
   * @example ""
   */
  favoriteFlag?: boolean;

  /**
   * 是否可购买
   * @example ""
   */
  buyFlag?: boolean;

  /**
   * 软属性
   * @example ""
   */
  iba?: object;

  /**
   * 行号
   * @example ""
   */
  lineNumber?: number;

  /**
   * epc类型
   * @example ""
   */
  epcType?: string;

  link?: PartObjectLinkPO;

  children?: Array<OrderNumberNodeChildrenPO>;
}

export class OrderNumberNodeChildrenPO {
  /**
   * 唯一ID:
   * @example ""
   */
  // key?: string;
  id?: string;
  /**
   * 唯一ID:与SIS中的零部件ID相同
   * @example ""
   */
  /** 序列化别名  */
  @Expose({ name: 'id' })
  key?: string;

  /**
   * MasterId
   * @example ""
   */
  masterId?: string;

  /**
   * 零件名称
   * @example ""
   */
  partNumber?: string;

  /**
   * 零件编号
   * @example ""
   */
  partName?: string;

  /**
   * SIS中的类型，只需要最后的内码
   * @example ""
   */
  softtype?: string;

  /**
   * 订货版本号
   * @example ""
   */
  dhhType?: string;

  /**
   * 版本
   * @example ""
   */
  version?: string;

  /**
   * 生效日期
   * @example ""
   */
  effDate?: string;

  /**
   * 失效日期
   * @example ""
   */
  invalidDate?: string;

  /**
   * 变更单号
   * @example ""
   */
  ecnNumber?: string;

  /**
   * 业务范围
   * @example ""
   */
  bizRange?: string;

  /**
   * pvz文件id
   * @example ""
   */
  pvzFileId?: number;

  /**
   * svg文件id
   * @example ""
   */
  svgFileId?: number;

  /**
   * 图序号
   * @example ""
   */
  orderNo?: number;

  /**
   * 收藏标识
   * @example ""
   */
  favoriteFlag?: boolean;

  /**
   * 是否可购买
   * @example ""
   */
  buyFlag?: boolean;

  /**
   * 软属性
   * @example ""
   */
  iba?: object;

  /**
   * 行号
   * @example ""
   */
  lineNumber?: number;

  /**
   * epc类型
   * @example ""
   */
  epcType?: string;

  link?: PartObjectLinkPO;

  children?: Array<OrderNumberNodeChildrenPO>;
}

interface PartObjectLinkPO {
  /**
   *
   * @example ""
   */
  partId?: string;

  /**
   *
   * @example ""
   */
  masterId?: string;

  /**
   *
   * @example ""
   */
  childrenPartId?: string;

  /**
   *
   * @example ""
   */
  orderNo?: number;

  /**
   *
   * @example ""
   */
  lineNumber?: number;

  /**
   *
   * @example ""
   */
  showRule?: string;

  /**
   *
   * @example ""
   */
  amount?: string;

  /**
   *
   * @example ""
   */
  unit?: string;

  /**
   *
   * @example ""
   */
  unitDisplay?: string;
}

/**  Request DTO */
export interface PartsCatalogRequestDTO {
  /**
   * 零件ID
   * @format int32
   * @min 1
   * @example 1
   */
  dhhId?: string;
  /**
   * 零件编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  dhhNumber?: string;

  /**
   * 零件日期
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  dhhDate?: string;

  /**
   * 发动机号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  serialNumber?: string;

  /**
   * 语言
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  lang?: string;
}

/** 分页结果 */
export interface ResultPartsCatalogPO {
  /**
   *  bom tree 数据
   * @format int64
   */
  orderNumberNode: object;
}

/** 返回结果 */
export interface CommonResultResultPartsCatalogPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: ResultPartsCatalogPO;
  msg?: string;
}

/** 非结构化文档 */
export class ManualDocDetailPO {
  /**
   * 行号
   * @example ""
   */
  name?: string;

  /**
   * 语言code
   * @example ""
   */
  lang?: string;

  /**
   * 业务范围
   * @example ""
   */
  bizRange?: string;

  /**
   * 型号
   * @example ""
   */
  model?: string;

  /**
   * 行业
   * @example ""
   */
  industry?: string;

  /**
   * 系列
   * @example ""
   */
  series?: string;

  /**
   * 功率
   * @example ""
   */
  power?: string;

  /**
   * 排放
   * @example ""
   */
  emission?: string;

  /**
   * 燃料类型（EPC字典）
   * @example ""
   */
  fuelType?: string;

  /**
   * 文档类型
   * @example ""
   */
  docType?: string;

  /**
   * 版本
   * @example ""
   */
  docVersion?: string;

  /**
   * 文件id
   * @example ""
   */
  fileId?: number;

  /**
   * 文件状态：1有效 0无效
   * @example ""
   */
  fileStatus?: string;

  /**
   * 件号
   * @example ""
   */
  docNumber?: string;

  /**
   * 唯一ID
   * @example ""
   */
  id?: string;

  fileInfo?: FileInfoPO;
}

/** 文件信息 */
export interface FileInfoPO {
  /**
   * 数据id
   * @example ""
   */
  id?: string;

  /**
   * 文件名称
   * @example ""
   */
  fileName?: string;

  /**
   * 文件格式
   * @example ""
   */
  fileExt?: string;

  /**
   * 文件大小:MB
   * @example ""
   */
  fileLength?: string;

  /**
   * 电子仓库id
   * @example ""
   */
  vaultId?: string;

  /**
   * 	文件路径: 相对于电子仓库文件夹的相对路径
   * @example ""
   */
  filePath?: string;

  /**
   * 	是否加密
   * @example ""
   */
  encrypt?: string;

  /**
   * 	预览相对路径
   * @example ""
   */
  previewUrl?: string;
}

// ------------------end--------------零件图册----------------------------------------------

// ------------------start--------------系统日志----------------------------------------------

/** 分页结果 */
export interface PageResultLoginLogPOModel {
  /**
   * 用户 IP，模拟匹配
   * @format int32
   * @example "127.0.0.1"
   */
  userIp: String;

  /**
   * 用户账号，模拟匹配
   * @format int32
   * @example "127.0.0.1"
   */
  username: String;

  /**
   * 操作状态
   * @format int32
   * @example "127.0.0.1"
   */
  status: Boolean;

  /**
   * 操作状态
   * @format int32
   * @example "127.0.0.1"
   */
  createTime: String;
}

export interface CommonResultPageResultLoginLogDTO {
  /** @format int32 */
  data?: Array<PageResultLoginLogPOModel>;
  msg?: string;
}

/** 分页结果 */
export interface OperateLogResponseDTOModel {
  /**
   * ID
   * @example "112222"
   */
  id: String;

  /**
   * 用户昵称
   * @example "芋艿"
   */
  userNickname: String;

  /**
   * 链路追踪编号
   * @example "89aca178-a370-411c-ae02-3f0d672be4ab"
   */
  traceId: String;

  /**
   * 用户编号
   * @example "1024"
   */
  userId: String;
  /**
   * 操作模块
   * @example "订单"
   */
  module: String;
  /**
   * 操作名
   * @example "创建订单"
   */
  name: String;

  /**
   * 操作分类
   * @example "1"
   */
  type: Number;

  /**
   * 操作明细
   * @example "修改编号为 1 的用户信息，将性别从男改成女，将姓名从芋道改成源码。"
   */
  content: Number;

  /**
   * 请求方法名
   * @example "GET"
   */
  requestMethod: String;

  /**
   * 请求地址
   * @example "/xxx/yyy"
   */
  requestUrl: String;

  /**
   * 用户 IP
   * @example "127.0.0.1"
   */
  userIp: String;

  /**
   * 浏览器 UserAgent
   * @example "Mozilla/5.0"
   */
  userAgent: String;

  /**
   * Java 方法名
   * @example "com..adminserver.UserController.save(...)"
   */
  javaMethod: String;

  /**
   * Java 方法的参数
   * @example "com..adminserver.UserController.save(...)"
   */
  javaMethodArgs: String;

  /**
   * 开始时间
   */
  startTime: String;

  /**
   * 执行时长，单位：毫秒
   */
  duration: Number;

  /**
   * 结果码
   */
  resultCode: Number;

  /**
   * 结果提示
   */
  resultMsg: String;

  /**
   * 结果数据
   */
  resultData: String;
}

export interface CommonResultPageResultOperateLogDTO {
  /** @format int32 */
  data?: Array<OperateLogResponseDTOModel>;
  msg?: string;
}

// ------------------end--------------系统日志----------------------------------------------

// ------------------start--------------订单号明细----------------------------------------------

export class OrderNumberReportPO {
  /**
   * 订货号
   * 唯一ID:与SIS中的零部件ID相同
   * @example ""
   */
  partNumber?: string;

  /**
   * 产品用途
   * @example ""
   */
  industry?: string;

  /**
   * 系列
   * @example ""
   */
  series?: string;

  /**
   * 型号
   * @example ""
   */
  model?: string;

  /**
   * 生效日期
   * @example ""
   */
  effDate?: string;

  /**
   * 对应发动机编号数
   * @example ""
   */
  enginesCount?: string;
}

/**  Request DTO */
export interface OrderNumberReportRequestDTO {
  /**
   * 开始时间
   * @format int32
   * @min 1
   * @example 1
   */
  startDate?: string;
  /**
   * 结束时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  endDate?: string;
}

/** 返回结果 */
export interface CommonResultResultOrderNumberReportPO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: OrderNumberReportPO;
  msg?: string;
}

// ------------------end--------------订单号明细----------------------------------------------
