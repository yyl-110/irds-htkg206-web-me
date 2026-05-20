/**
 * 项目 WBS API 树节点 → 前端 WbsTaskNode（与 ProjectTaskWbsPanel 映射一致，供多页复用）
 */
export type TaskWbsStatus = 'delayed' | 'completed' | 'in_progress' | 'pending'

export interface WbsTaskNode {
  id: string
  type?: number
  parentId?: string
  assigneeUserId?: string
  bindTaskId?: string
  publishStatus?: number
  assignStatus?: string
  taskStatusRaw?: string
  serialNo: number
  wbsCode: string
  taskName: string
  relatedTaskFlow?: string
  startDate: string
  endDate: string
  durationWorkdays: number
  progress: number
  predecessor: string
  status: TaskWbsStatus
  resource: string
  responsibleUserId?: string
  manager?: string
  managerUserId?: string
  children?: WbsTaskNode[]
  /** 映射树时写入的直接父节点，避免 Long id 精度导致仅用 parentId 链断裂 */
  __parent?: WbsTaskNode
}

export function mapTaskStatus(status?: string): TaskWbsStatus {
  if (status === 'COMPLETED')
    return 'completed'
  if (status === 'DESIGNING' || status === 'CHANGING')
    return 'in_progress'
  return 'pending'
}

function toDateOnly(v?: string): string {
  if (!v)
    return ''
  return String(v).slice(0, 10)
}

function apiRawIdToDisplayString(raw: unknown, serialFallback: number): string {
  if (raw === undefined || raw === null)
    return `${serialFallback}`
  if (typeof raw === 'string')
    return raw.trim()
  return String(raw)
}

export function mapApiNodeToWbs(
  node: any,
  serialSeed: { v: number },
  inferredParentId?: string,
  parentMapped: WbsTaskNode | null = null,
): WbsTaskNode {
  const serialNo = serialSeed.v++
  const progressNum = Number(node?.completionRate ?? 0)
  const parentRaw = node?.parentId
  let parentId
    = parentRaw === undefined || parentRaw === null ? undefined : String(parentRaw)
  if (
    (parentId === undefined || parentId === '')
    && inferredParentId !== undefined
    && inferredParentId !== ''
  ) {
    parentId = inferredParentId
  }
  const assigneeRaw = node?.assigneeUserId
  const assigneeUserId
    = assigneeRaw !== undefined && assigneeRaw !== null ? String(assigneeRaw) : undefined
  const bindRaw = node?.bindTaskId
  const bindTaskId = bindRaw !== undefined && bindRaw !== null ? String(bindRaw) : undefined
  const selfId = apiRawIdToDisplayString(node?.id, serialNo)

  const mapped: WbsTaskNode = {
    id: selfId,
    type: Number(node?.type ?? 2),
    parentId,
    assigneeUserId,
    bindTaskId,
    publishStatus: node?.publishStatus !== undefined ? Number(node.publishStatus) : undefined,
    assignStatus: node?.assignStatus ? String(node.assignStatus) : undefined,
    taskStatusRaw: node?.taskStatus != null ? String(node.taskStatus) : undefined,
    serialNo,
    wbsCode: String(node?.wbsCode ?? ''),
    taskName: String(node?.nodeName ?? ''),
    relatedTaskFlow: '',
    startDate: toDateOnly(node?.planStartTime),
    endDate: toDateOnly(node?.planEndTime),
    durationWorkdays: Number(node?.taskTime ?? 0),
    progress: Number.isFinite(progressNum) ? progressNum : 0,
    predecessor: '',
    status: mapTaskStatus(node?.taskStatus),
    resource: '',
    responsibleUserId: undefined,
    manager: node?.adminUserid ? String(node.adminUserid) : '',
    managerUserId: node?.adminUserid ? String(node.adminUserid) : undefined,
    children: undefined,
  }
  if (parentMapped)
    mapped.__parent = parentMapped

  const children = Array.isArray(node?.children)
    ? node.children.map((c: any) => mapApiNodeToWbs(c, serialSeed, selfId, mapped))
    : undefined
  if (children?.length)
    mapped.children = children
  return mapped
}

export function findWbsNodeById(nodes: WbsTaskNode[], id: string | number): WbsTaskNode | null {
  const sid = String(id)
  for (const n of nodes) {
    if (String(n.id) === sid)
      return n
    if (n.children?.length) {
      const inner = findWbsNodeById(n.children, id)
      if (inner)
        return inner
    }
  }
  return null
}

/**
 * 优先选中 bindTaskId 与当前设计任务一致的节点
 * @param nodes
 * @param bindTaskId
 */
export function findTaskNodeIdByBindTaskId(nodes: WbsTaskNode[], bindTaskId: string): string | null {
  const tid = String(bindTaskId ?? '').trim()
  if (!tid)
    return null
  const walk = (arr: WbsTaskNode[]): string | null => {
    for (const n of arr) {
      if (Number(n.type) === 2 && n.bindTaskId && String(n.bindTaskId) === tid)
        return n.id
      if (n.children?.length) {
        const hit = walk(n.children)
        if (hit)
          return hit
      }
    }
    return null
  }
  return walk(nodes)
}
