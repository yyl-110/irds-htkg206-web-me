# 单点登录
> 可以通过 `/sso-login` 路由进行单点登录

## 路由参数

参数 | 说明 | 示例
--- |--- |---
`accessToken` | `access token` | `xxx`
`refreshToken` | `refresh token` | `xxx`
`tenantId` | 租户 `ID` | `1`
`userId` | 用户 `ID` | `252`
`state` | 需要进入的页面 | `/wei-demo/user/profile`

> 示例: `http://localhost:5173/#/sso-login?accessToken=281345d8eb0a4ed5b5364ac467b5c3b8&refreshToken=974cc279b8144f9e8b39bd4807138725&tenantId=1&userId=252&state=/wei-demo/user/profile`

在 `/sso-login` 页面中会对 `GET` 参数进行解析, 并请求接口获取用户 / 路由等基本信息, 然后 **跳转到 `state` 参数的地址**
