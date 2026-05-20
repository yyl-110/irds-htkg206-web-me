import httpRequest from '@/httpRequest'

export type UserGroupVO = {
  id: number
  name: string
  description: string
  userIds: number[]
  status: number
  remark: string
  createTime: string
}

// 创建用户组
export function createUserGroup(data: UserGroupVO) {
  return httpRequest({
    url: `bpm-service/bpm/user-group/create`,
    data,
    method: 'POST',
  })
}

// 更新用户组
export function updateUserGroup(data: UserGroupVO) {
  return httpRequest({
    url: `bpm-service/bpm/user-group/update`,
    data,
    method: 'PUT',
  })
}

// 删除用户组
export function deleteUserGroup(id: number) {
  return httpRequest({
    url: `bpm-service/bpm/user-group/delete?id=` + id,
    method: 'DELETE',
  })
}

// 获得用户组
export function getUserGroup(id: number) {
  return httpRequest({
    url: `bpm-service/bpm/user-group/get?id=` + id,
    method: 'GET',
  })
}

// 获得用户组分页
export function getUserGroupPage(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/user-group/page`,
    params,
    method: 'GET',
  })
}

// 获取用户组精简信息列表
export function getUserGroupSimpleList(): Promise<UserGroupVO[]> {
  return httpRequest({
    url: `bpm-service/bpm/user-group/simple-list`,
    method: 'GET',
  })
}
