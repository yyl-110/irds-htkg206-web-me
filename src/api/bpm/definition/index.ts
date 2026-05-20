import httpRequest from '@/httpRequest'

export function getProcessDefinition(id?: string, key?: string) {
  return httpRequest({
    url: `bpm-service/bpm/process-definition/get`,
    params: { id, key },
    method: 'GET',
  })
}

export function getProcessDefinitionPage(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-definition/page`,
    data,
    method: 'POST',
  })
}

export function getProcessDefinitionList(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-definition/list`,
    params,
    method: 'GET',
  })
}

export function getSimpleProcessDefinitionList() {
  return httpRequest({
    url: `bpm-service/bpm/process-definition/simple-list`,
    method: 'GET',
  })
}
