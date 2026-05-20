import httpRequest from '@/httpRequest'

export type ProcessDefinitionVO = {
  id: string
  version: number
  deploymentTIme: string
  suspensionState: number
  formType?: number
}

export type ModelVO = {
  id: number
  formName: string
  key: string
  name: string
  description: string
  category: string
  formType: number
  formId: number
  formCustomCreatePath: string
  formCustomViewPath: string
  processDefinition: ProcessDefinitionVO
  status: number
  remark: string
  createTime: string
  bpmnXml: string
}

export function getModelList(name: string | undefined) {
  return httpRequest({
    url: `bpm-service/bpm/model/list`,
    params: { name },
    method: 'GET',
  })
}

export function getModel(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/model/get?id=` + id,
    method: 'GET',
  })
}

export function updateModel(data: ModelVO) {
  return httpRequest({
    url: `bpm-service/bpm/model/update`,
    data,
    method: 'PUT',
  })
}

// 批量修改流程分类的排序
export function updateModelSortBatch(ids: number[]) {
  return httpRequest({
    url: `bpm-service/bpm/model/update-sort-batch`,
    params: {
      ids: ids.join(','),
    },
    method: 'PUT',
  })
}

export function updateModelBpmn(data: ModelVO) {
  return httpRequest({
    url: `bpm-service/bpm/model/update-bpmn`,
    data,
    method: 'PUT',
  })
}

// 任务状态修改
export function updateModelState(id: number, state: number) {
  const data = {
    id,
    state,
  }
  return httpRequest({
    url: `bpm-service/bpm/model/update-state`,
    data,
    method: 'PUT',
  })
}

export function createModel(data: ModelVO) {
  return httpRequest({
    url: `bpm-service/bpm/model/create`,
    data,
    method: 'POST',
  })
}

export function deleteModel(id: number) {
  return httpRequest({
    url: `bpm-service/bpm/model/delete?id=` + id,
    method: 'DELETE',
  })
}

export function deployModel(id: number) {
  return httpRequest({
    url: `bpm-service/bpm/model/deploy?id=` + id,
    method: 'POST',
  })
}

export function cleanModel(id: number) {
  return httpRequest({
    url: `bpm-service/bpm/model/clean?id=` + id,
    method: 'DELETE',
  })
}
