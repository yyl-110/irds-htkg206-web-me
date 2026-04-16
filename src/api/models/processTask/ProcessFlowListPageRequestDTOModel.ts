import { BaseModel } from '@/utils/BaseModel';

/** 设计流程列表分页入参 DTO */
export class ProcessFlowListPageRequestDTOModel extends BaseModel {
  pageNo: number = 0;
  pageSize: number = 0;

  /** 产品平台 ID（从 designTask/index 传入） */
  menuId?: string | number = '';
  /** 左侧分类树节点 ID */
  treeId?: string | number = '';

  /** 流程标识（可选筛选） */
  processCode?: string = '';
  /** 流程名称（可选筛选） */
  processName?: string = '';
}

