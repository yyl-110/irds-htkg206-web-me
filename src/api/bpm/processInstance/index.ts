import httpRequest from '@/httpRequest'
import type { ProcessDefinitionVO } from '@/api/bpm/model'
import type { CandidateStrategy, NodeType } from '@/components/SimpleProcessDesignerV2/src/consts'

export interface Task {
  id: string
  name: string
}

export interface ProcessInstanceVO {
  id: number
  name: string
  processDefinitionId: string
  category: string
  result: number
  tasks: Task[]
  fields: string[]
  status: number
  remark: string
  businessKey: string
  createTime: string
  endTime: string
  processDefinition?: ProcessDefinitionVO
}

// 用户信息
export interface User {
  id: number
  nickname: string
  avatar: string
}

// 审批任务信息
export interface ApprovalTaskInfo {
  id: number
  ownerUser: User
  assigneeUser: User
  status: number
  reason: string
  signPicUrl: string
}

// 审批节点信息
export interface ApprovalNodeInfo {
  id: number
  name: string
  nodeType: NodeType
  candidateStrategy?: CandidateStrategy
  status: number
  startTime?: Date
  endTime?: Date
  candidateUsers?: User[]
  tasks: ApprovalTaskInfo[]
}

export function getProcessInstanceMyPage(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/my-page`,
    data,
    method: 'POST',
  })
}

export function getProcessInstanceManagerPage(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/manager-page`,
    data,
    method: 'POST',
  })
}

export function createProcessInstance(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/create`,
    data,
    method: 'POST',
  })
}

export function cancelProcessInstanceByStartUser(id: string | number, reason: string) {
  const data = {
    id,
    reason,
  }
  return httpRequest({
    url: `bpm-service/bpm/process-instance/cancel-by-start-user`,
    data,
    method: 'DELETE',
  })
}

export function cancelProcessInstanceByAdmin(id: number, reason: string) {
  const data = {
    id,
    reason,
  }
  return httpRequest({
    url: `bpm-service/bpm/process-instance/cancel-by-admin`,
    data,
    method: 'DELETE',
  })
}

export function getProcessInstance(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get?id=${id}`,
    method: 'GET',
  })
}

export function getProcessInstanceCopyPage(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/copy/page`,
    data,
    method: 'POST',
  })
}

// 获取审批详情
export function getApprovalDetail(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get-approval-detail`,
    params,
    method: 'GET',
  })
}

// 获取下一个执行的流程节点
export function getNextApprovalNodes(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get-next-approval-nodes`,
    params,
    method: 'GET',
  })
}

// 获取表单字段权限
export function getFormFieldsPermission(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get-form-fields-permission`,
    params,
    method: 'GET',
  })
}

// 获取流程实例的 BPMN 模型视图
export function getProcessInstanceBpmnModelView(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get-bpmn-model-view?id=${id}`,
    method: 'GET',
  })
}

// 编制任务页面获取流程节点信息接口
export function getUserModel(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get-user-model`,
    params,
    method: 'GET',
  })
}

export function getProcessLinkedBusiness(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/getProcessLinkedBusiness`,
    data,
    method: 'POST',
  })
}

// 根据流程id获取流程实例
export function getProcessVariables(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get-proc-vars?id=${id}`,
    method: 'GET',
  })
}
