import httpRequest from '@/httpRequest'

export type FormVO = {
  id: number
  name: string
  conf: string
  fields: string[]
  status: number
  remark: string
  createTime: string
}

// 创建工作流的表单定义
export function createForm(data: FormVO) {
  return httpRequest({
    url: `bpm-service/bpm/form/create`,
    data,
    method: 'POST',
  })
}

// 更新工作流的表单定义
export function updateForm(data: FormVO) {
  return httpRequest({
    url: `bpm-service/bpm/form/update`,
    data,
    method: 'PUT',
  })
}

// 删除工作流的表单定义
export function deleteForm(id: number) {
  return httpRequest({
    url: `bpm-service/bpm/form/delete?id=` + id,
    method: 'DELETE',
  })
}

// 获得工作流的表单定义
export function getForm(id: number) {
  return httpRequest({
    url: `bpm-service/bpm/form/get?id=` + id,
    method: 'GET',
  })
}

// 获得工作流的表单定义分页
export function getFormPage(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/form/page`,
    data,
    method: 'POST',
  })
}

// 获得动态表单的精简列表
export function getFormSimpleList() {
  return httpRequest({
    url: `bpm-service/bpm/form/simple-list`,
    method: 'GET',
  })
}
