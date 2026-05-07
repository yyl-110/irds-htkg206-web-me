import httpRequest from '@/httpRequest'

export function updateBpmSimpleModel(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/model/simple/update`,
    data,
    method: 'POST',
  })
}

export function getBpmSimpleModel(id: any) {
  return httpRequest({
    url: `bpm-service/bpm/model/simple/get?id=` + id,
    method: 'GET',
  })
}
