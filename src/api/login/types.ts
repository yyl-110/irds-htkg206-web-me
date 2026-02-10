export interface UserLoginVO {
  username: string
  password: string
  captchaVerification: string
}

export interface TokenType {
  /** 编号 */
  id: number
  /** 访问 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken: string
  /** 用户编号 */
  userId: number
  /** 用户类型 */
  userType: number
  /** 客户端编号 */
  clientId: string
  /** 过期时间 */
  expiresTime: number
}

export interface UserVO {
  id: number
  username: string
  nickname: string
  deptId: number
  email: string
  mobile: string
  sex: number
  avatar: string
  loginIp: string
  loginDate: string
}
