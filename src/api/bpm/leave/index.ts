import httpRequest from '@/httpRequest'

export type LeaveVO = {
  id: number
  status: number
  type: number
  reason: string
  processInstanceId: string
  startTime: string
  endTime: string
  createTime: string
}

// 创建请假申请
export function createLeave(data: LeaveVO) {
  return httpRequest({
    url: `bpm-service/bpm/oa/leave/create`,
    data,
    method: 'POST',
  })
}

// 获得请假申请
export function getLeave(id: number) {
  return httpRequest({
    url: `bpm-service/bpm/oa/leave/get?id=` + id,
    method: 'GET',
  })
}

// 获得请假申请分页
export function getLeavePage(params: PageParam) {
  return httpRequest({
    url: `bpm-service/bpm/oa/leave/page`,
    params,
    method: 'GET',
  })
}
