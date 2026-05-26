import httpRequest from '@/httpRequest'

// 获取流程定义列表
export function getBpmSimpleList(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-definition/simple-list`,
    params,
    method: 'GET',
  })
}

// 发起流程
export function instanceCreateProcess(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/createProcess`,
    data,
    method: 'POST',
  })
}
