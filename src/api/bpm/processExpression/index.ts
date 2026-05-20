import httpRequest from '@/httpRequest'

// BPM 流程表达式 VO
export interface ProcessExpressionVO {
  id: number // 编号
  name: string // 表达式名字
  status: number // 表达式状态
  expression: string // 表达式
}

// BPM 流程表达式 API
export const ProcessExpressionApi = {
  // 查询BPM 流程表达式分页
  getProcessExpressionPage(data: any) {
    return httpRequest({
      url: `bpm-service/bpm/process-expression/page`,
      data,
      method: 'POST',
    })
  },

  // 查询BPM 流程表达式详情
  getProcessExpression(id: number) {
    return httpRequest({
      url: `bpm-service/bpm/process-expression/get?id=` + id,
      method: 'GET',
    })
  },

  // 新增BPM 流程表达式
  createProcessExpression(data: ProcessExpressionVO) {
    return httpRequest({
      url: `bpm-service/bpm/process-expression/create`,
      data,
      method: 'POST',
    })
  },

  // 修改BPM 流程表达式
  updateProcessExpression(data: ProcessExpressionVO) {
    return httpRequest({
      url: `bpm-service/bpm/process-expression/update`,
      data,
      method: 'PUT',
    })
  },

  // 删除BPM 流程表达式
  deleteProcessExpression(id: number) {
    return httpRequest({
      url: `bpm-service/bpm/process-expression/delete?id=` + id,
      method: 'DELETE',
    })
  },

  // 导出BPM 流程表达式 Excel
  exportProcessExpression(params: any) {
    return httpRequest({
      url: `bpm-service/bpm/process-expression/export-excel`,
      params,
      method: 'GET',
      responseType: 'blob',
    })
  },
}
