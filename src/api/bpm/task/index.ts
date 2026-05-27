import httpRequest from '@/httpRequest'

/**
 * 任务状态枚举
 */
export enum TaskStatusEnum {
  /**
   * 未开始
   */
  NOT_START = -1,

  /**
   * 待审批
   */
  WAIT = 0,
  /**
   * 审批中
   */
  RUNNING = 1,
  /**
   * 审批通过
   */
  APPROVE = 2,

  /**
   * 审批不通过
   */
  REJECT = 3,

  /**
   * 已取消
   */
  CANCEL = 4,
  /**
   * 已退回
   */
  RETURN = 5,
  /**
   * 审批通过中
   */
  APPROVING = 7,
}

export function getTaskTodoPage(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/todo-page`,
    data,
    method: 'POST',
  })
}

export function getTaskDonePage(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/done-page`,
    data,
    method: 'POST',
  })
}

export function getTaskManagerPage(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/manager-page`,
    data,
    method: 'POST',
  })
}

export function approveTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/approve`,
    data,
    method: 'POST',
  })
}

export function rejectTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/reject`,
    data,
    method: 'POST',
  })
}

export function getTaskListByProcessInstanceId(processInstanceId: string) {
  return httpRequest({
    url: `bpm-service/bpm/task/list-by-process-instance-id?processInstanceId=` + processInstanceId,
    method: 'GET',
  })
}

// 获取所有可退回的节点
export function getTaskListByReturn(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/task/list-by-return`,
    params: { id },
    method: 'GET',
  })
}

// 退回
export function returnTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/return`,
    data,
    method: 'PUT',
  })
}

// 委派
export function delegateTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/delegate`,
    data,
    method: 'PUT',
  })
}

// 转派
export function transferTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/transfer`,
    data,
    method: 'POST',
  })
}

// 加签
export function signCreateTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/create-sign`,
    data,
    method: 'POST',
  })
}

// 减签
export function signDeleteTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/delete-sign`,
    data,
    method: 'DELETE',
  })
}

// 抄送
export function copyTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/copy`,
    data,
    method: 'PUT',
  })
}

// 获取我的待办任务
export function myTodoTask(processInstanceId: string) {
  return httpRequest({
    url: `bpm-service/bpm/task/my-todo?processInstanceId=` + processInstanceId,
    method: 'GET',
  })
}

// 获取减签任务列表
export function getChildrenTaskList(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/task/list-by-parent-task-id?parentTaskId=` + id,
    method: 'GET',
  })
}

// 获取减签任务列表
export function getTasksByProcessInstanceId(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/task/getTasksByProcessInstanceId?processInsId=` + id,
    method: 'GET',
  })
}

/**
 * 工作台——获取 待办/已办/我的流程 数量
 * @param userId
 */
export function getTaskCount(userId: string) {
  return httpRequest({
    url: `bpm-service/bpm/task/taskCount?userId=` + userId,
    method: 'GET',
  })
}

/**
 * 工作台——获取待办任务列表
 * @param data
 */
export function getMyTodoTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/todo-page`,
    data,
    method: 'POST',
  })
}

/**
 * 工作台——获取已办任务列表
 * @param data
 */
export function getMyDoneTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/done-page`,
    data,
    method: 'POST',
  })
}

export function getMyTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/task/manager-page`,
    data,
    method: 'POST',
  })
}
/**
 * 工作台——获取我的流程列表
 * @param data
 */
export function getMyProcessInstance(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/manager-page`,
    data,
    method: 'POST',
  })
}

/**
 * 获取流程定义
 */
export function getProcessDefinition(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-definition/get`,
    params,
    method: 'GET',
  })
}

/**
 * 创建一个流程任务
 */
export function createProcessTask(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/create`,
    data,
    method: 'POST',
  })
}

/**
 * 创建一个流程任务（与 createProcessTask 相同请求，保留独立导出以兼容原 post2 调用处）
 */
export function createProcessTaskWithReturn(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/create`,
    data,
    method: 'POST',
  })
}

export function createProcess(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/createProcess`,
    data,
    method: 'POST',
  })
}

/**
 * 获取发起人和管理员转办开关和角色列表的统一配置
 */
export function getSwitchAndRoles() {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get-transfer-switch-roles`,
    method: 'GET',
  })
}

/**
 * 获取流程定义转办开关
 */
export function getTransfer(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/task/getTransferEnabledByTaskId?taskId=${id}`,
    method: 'GET',
  })
}

/**
 * 获取任务变量
 * @param id 任务id
 */
export function getTaskVariables(id: string) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/get-task-variables?taskId=${id}`,
    method: 'GET',
  })
}
