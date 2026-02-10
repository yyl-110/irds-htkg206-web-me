import { join } from 'node:path';
import process from 'node:process';
import { BaseModel } from '@wei/openapi-codegen';
import type { UserResponseDTO } from '@/api/tags/data-contracts';

/** 测试相关配置 */
export class TestConfig {
  /** 测试 URL 的地址 */
  static readonly URL: string = 'http://localhost:58585';
  /** 登录页地址 */
  static readonly LOGIN_URL: string = `${TestConfig.URL}/#/login`;
  /** 主页(个人中心)地址 */
  static readonly HOME_PAGE_URL: string = `${TestConfig.URL}/#/wei-demo/user/profile`;
  /** 系统管理 - 用户管理地址 */
  static readonly SYSTEM_USER_PAGE_URL: string = `${TestConfig.URL}/#/system/user`;
  /** 系统管理 - 角色管理地址 */
  static readonly SYSTEM_ROLE_PAGE_URL: string = `${TestConfig.URL}/#/system/role`;
  /** 系统管理 - 部门管理地址 */
  static readonly SYSTEM_DEPT_PAGE_URL: string = `${TestConfig.URL}/#/system/dept`;
  /** 系统管理 - 字典管理 */
  static readonly SYSTEM_DICT_URL: string = `${TestConfig.URL}/#/system/dict`;
  /** 系统管理 - 字典数据页面 */
  static readonly SYSTEM_DICT_TYPE_DATA_URL: string = `${TestConfig.URL}/#/dict/type/data`;
  /** 保存已登录用户信息的文件 */
  static readonly STORAGE_STATE_FILE_PATH: string = join(process.cwd(), 'tests/e2e/.auth/user.json');
  /** 等待 ant-table 渲染完数据需要等待的时间 */
  static readonly WAIT_TABLE_LOAD_TIME: number = 1000;
  /** 创建测试数据的名称前缀 */
  static readonly DATA_PREFIX: string = 'E2E_';
  /** 修改测试数据的名称前缀 */
  static readonly MODIFY_DATA_SUFFIX: string = 'M_';
  // 定义允许的字符集
  static readonly RANDOM_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!@#$%^&*()';
  /**
   * 生成指定长度并包含指定内容的唯一值
   * @param key 包含的内容
   * @param length 长度
   * @returns 唯一 ID
   */
  static generateUniqueId(key?: string, length: number = 10): string {
    // 生成随机字符串部分
    let randomStr = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * TestConfig.RANDOM_CHARSET.length);
      randomStr += TestConfig.RANDOM_CHARSET[randomIndex];
    }
    // 组合前缀和随机部分生成唯一 ID
    return `${TestConfig.DATA_PREFIX}${key ? key + '_' : ''}${randomStr}`;
  }
}

/** 管理后台 - 用户信息 Response DTO */
export class UserResponseDTOModel extends BaseModel implements UserResponseDTO {
  /**
   * 用户账号
   * @minLength 3
   * @maxLength 30
   * @example ""
   */
  username: string = '';
  /**
   * 用户姓名
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
   * @example "@.com"
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
}

/** 用于测试的账号 */
export class TestConfigAccount extends UserResponseDTOModel {
  /** 密码 */
  public password: string = '';

  /** 用于测试登录的账号 */
  static Tester = BaseModel.toModel<TestConfigAccount>(TestConfigAccount, { username: 'codegen6', password: 'codegen6' });

  /** 用于测试登录的账号 */
  static Tester4 = BaseModel.toModel<TestConfigAccount>(TestConfigAccount, { username: 'codegen4', password: 'codegen4' });

  /** 用于测试个人中心中的账号 */
  static ProfilePageUser = BaseModel.toModel<TestConfigAccount>(TestConfigAccount, { username: 'codegen5', password: 'codegen5' });

  /** 用于测试个人中心中修改账号密码的的账号 */
  static ProfilePageTestUser = BaseModel.toModel<TestConfigAccount>(TestConfigAccount, { username: 'codegen5', password: 'codegen567' });

  /** 用于在用户管理页面测试 新增 / 修改 / 删除 用户的账号 */
  static SystemUser = BaseModel.toModel<TestConfigAccount>(TestConfigAccount, {
    username: 'playwrightSystemUser',
    nickname: 'SystemUser_test',
    password: 'playwrightSystemUser1?',
    mobile: '17800000000',
    email: 'test@test.com',
    remark: '[自动化测试专用账号] 用于在用户管理页面测试 新增 / 修改 / 删除 用户的账号',
  });
}
