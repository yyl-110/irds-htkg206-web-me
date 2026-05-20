import { BpmBusinessProcessTypeEnum } from '@/components/config/consts'
import { Component } from 'vue'

// 业务类型组件映射 - 使用完整版组件（包含审签信息）
export const BUSINESS_TYPE_COMPONENT_MAP: Record<string, () => Promise<Component>> = {
  // 订单配置流程
  [BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS]: () => import('./OrderConfigProcess.vue'),

  // 区域销售相关
  [BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE]: () => import('./RegionalSalesConfig.vue'),
  [BpmBusinessProcessTypeEnum.REGIONAL_SALES_CHANGE]: () => import('./RegionalSalesConfig.vue'),
  [BpmBusinessProcessTypeEnum.REGIONAL_SALES_DISCONTINUED]: () => import('./RegionalSalesConfig.vue'),
  [BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE_TEM]: () => import('./RegionalSalesConfig.vue'),
  [BpmBusinessProcessTypeEnum.STANDARD_PROCESSROUTE_RE]: () => import('./RegionalSalesConfig.vue'),

  // 产品型号定型
  [BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_RELEASE]: () => import('./ProductModelFinalization.vue'),
  [BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE]: () => import('./ProductModelFinalization.vue'),

  // 销售特征
  [BpmBusinessProcessTypeEnum.SALE_OPS]: () => import('./SalesFeature.vue'),

  // 技术特征
  [BpmBusinessProcessTypeEnum.TEC_OPS]: () => import('./TechnicalFeature.vue'),

  // 订单MBOM
  [BpmBusinessProcessTypeEnum.ORDER_MBOM]: () => import('./OrderMbom.vue'),

  // 标配BOM重发
  [BpmBusinessProcessTypeEnum.STANDARD_BOM_RE]: () => import('./StandardBomRe.vue'),

  // 任务通知流程  -- 2025年10月21日添加
  [BpmBusinessProcessTypeEnum.TASK_OWNER_NOTICE]: () => import('./TaskOwnerNotice.vue'),

  // 通用兜底的界面
  [BpmBusinessProcessTypeEnum.DEFAULT]: () => import('./CommonBusiness.vue')
}

// 不需要显示审批内容的业务类型
export const NO_APPROVAL_CONTENT_TYPES = [
  BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS,
  BpmBusinessProcessTypeEnum.FORWARD_DATA_FAIL,
  BpmBusinessProcessTypeEnum.TASK_OWNER_NOTICE,
  BpmBusinessProcessTypeEnum.STANDARD_BOM_RE
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

