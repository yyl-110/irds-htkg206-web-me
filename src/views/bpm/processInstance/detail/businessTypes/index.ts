import { BpmBusinessProcessTypeEnum } from '@/components/config/consts'
import { Component } from 'vue'

// 业务类型组件映射 - 使用完整版组件（包含审签信息）
export const BUSINESS_TYPE_COMPONENT_MAP: Record<string, () => Promise<Component>> = {
  // 模块库一级审批
  [BpmBusinessProcessTypeEnum.MODEL_SINGLE_APPROVAL]: () => import('./ModulelibraryApproval.vue'),
  // 模块库二级审批
  [BpmBusinessProcessTypeEnum.MODEL_DUAL_APPROVAL]: () => import('./ModulelibraryApproval.vue'),
  // 通用兜底的界面
  [BpmBusinessProcessTypeEnum.DEFAULT]: () => import('./CommonBusiness.vue'),
}

// 不需要显示审批内容的业务类型
export const NO_APPROVAL_CONTENT_TYPES = [
  BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS,
  BpmBusinessProcessTypeEnum.FORWARD_DATA_FAIL,
  BpmBusinessProcessTypeEnum.TASK_OWNER_NOTICE,
  BpmBusinessProcessTypeEnum.STANDARD_BOM_RE,
]

/**
 * 根据业务类型判断是否需要显示审批内容
 */
export function shouldShowApprovalContent(businessType: string): boolean {
  return !NO_APPROVAL_CONTENT_TYPES.includes(businessType)
}

/**
 * 获取业务类型对应的组件
 */
export function getBusinessTypeComponent(businessType: string) {
  return BUSINESS_TYPE_COMPONENT_MAP[businessType]
}
