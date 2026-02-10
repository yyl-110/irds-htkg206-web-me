import httpRequest from '../../../httpRequest/index'

export interface OAuth2ClientVO {
  id: number
  clientId: string
  secret: string
  name: string
  logo: string
  description: string
  status: number
  accessTokenValiditySeconds: number
  refreshTokenValiditySeconds: number
  redirectUris: string[]
  autoApprove: boolean
  authorizedGrantTypes: string[]
  scopes: string[]
  authorities: string[]
  resourceIds: string[]
  additionalInformation: string
  isAdditionalInformationJson: boolean
  createTime: Date
}
// 查询 OAuth2 客户端的列表
export function getOAuth2ClientPage(params: PageParam) {
  return httpRequest({ url: '/admin-api/system/oauth2-client/page', params, method: 'GET' })
}
// 查询 OAuth2 客户端的详情
export function getOAuth2Client(id: number) {
  return httpRequest({ url: `/admin-api/system/oauth2-client/get?id=${id}`, method: 'GET' })
}

// 新增 OAuth2 客户端
export function getAppAddSaveData(data: OAuth2ClientVO) {
  return httpRequest({ url: '/admin-api/system/oauth2-client/create', data, method: 'POST' })
}

// 修改 OAuth2 客户端
export function getAppUpdateSaveData(data: OAuth2ClientVO) {
  return httpRequest({ url: '/admin-api/system/oauth2-client/update', data, method: 'POST' })
}

// 删除 OAuth2
export function deleteOAuth2Client(id: number) {
  return httpRequest({ url: `/admin-api/system/oauth2-client/delete?id=${id}`, method: 'DELETE' })
}
// 获取应用管理表格数据
export function getAppTableData(params: any) {
  return httpRequest({
    url: '/admin-api/system/oauth2-client/page',
    method: 'GET',
    params,
  })
}
// 应用管理--删除
export function getDeleteTableData(params: any) {
  return httpRequest({
    url: '/admin-api/system/oauth2-client/delete',
    method: 'DELETE',
    params,
  })
}
// 应用管理--弹窗--修改
export function getUpdateAppData(params: any) {
  return httpRequest({
    url: '/admin-api/system/oauth2-client/get',
    method: 'GET',
    params,
  })
}
// 应用管理--保存--新增
// export const getAppAddSaveData = (data:any)=>{
//     return httpRequest({
//         url: '/admin-api/system/oauth2-client/create',
//         method: 'POST',
//         data
//     })
// }
// 应用管理--保存--修改
// export const getAppUpdateSaveData = (data:any)=>{
//     return httpRequest({
//         url: '/admin-api/system/oauth2-client/update',
//         method: 'POST',
//         data
//     })
// }
