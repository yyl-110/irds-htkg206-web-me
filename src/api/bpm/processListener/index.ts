import httpRequest from '@/httpRequest'

// BPM 流程监听器 VO
export interface ProcessListenerVO {
  id: number // 编号
  name: string // 监听器名字
  type: string // 监听器类型
  status: number // 监听器状态
  event: string // 监听事件
  valueType: string // 监听器值类型
  value: string // 监听器值
}

// BPM 流程监听器 API
export const ProcessListenerApi = {
  // 查询流程监听器分页
  getProcessListenerPage(data: any) {
    return httpRequest({
      url: `bpm-service/bpm/process-listener/page`,
      data,
      method: 'POST',
    })
  },

  // 查询流程监听器详情
  getProcessListener(id: number) {
    return httpRequest({
      url: `bpm-service/bpm/process-listener/get?id=` + id,
      method: 'GET',
    })
  },

  // 新增流程监听器
  createProcessListener(data: ProcessListenerVO) {
    return httpRequest({
      url: `bpm-service/bpm/process-listener/create`,
      data,
      method: 'POST',
    })
  },

  // 修改流程监听器
  updateProcessListener(data: ProcessListenerVO) {
    return httpRequest({
      url: `bpm-service/bpm/process-listener/update`,
      data,
      method: 'PUT',
    })
  },

  // 删除流程监听器
  deleteProcessListener(id: number) {
    return httpRequest({
      url: `bpm-service/bpm/process-listener/delete?id=` + id,
      method: 'DELETE',
    })
  },
}
