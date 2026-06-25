import httpRequest from "@/httpRequest";

/**
 * 报表--知识中心看板
 * @return {*}
 */
export function getReportKnowledgeList(data: { timeType?: string; startTime?: string; endTime?: string }) {
  return httpRequest({
    url: "/knowledge-service/knowledgeReport/knowledgeList",
    method: "POST",
    data,
  });
}
/**
 * 模块化看板
 * @return {*}
 */
export function getReportModuleList(data: { year: string | number }) {
  return httpRequest({
    url: "/system-service/reportinfo/getReportModuleList",
    method: "POST",
    data,
  });
}
/**
 * 报表--产品设计看板
 * @return {*}
 */
export function getReportProjectList(data: {
  projectId: string | number;
  phaseId: string | number;
}) {
  return httpRequest({
    url: "/cirpoint-base-api/reportinfo/getReportProjectList",
    method: "POST",
    data,
  });
}
/**
 * 报表--项目列表和阶段信息
 * @return {*}
 */
export function getReportProjectPhaseList() {
  return httpRequest({
    url: "/cirpoint-base-api/reportinfo/getReportProjectPhaseList",
    method: "POST",
  });
}
/**
 * 报表--系统运行看板
 * @return {*}
 */
export function getReportSystemList(data?: { timeType?: string }) {
  return httpRequest({
    url: "/system-service/reportinfo/getReportSystemList",
    method: "POST",
    data,
  });
}
/**
 * 报表--产品设计看板(new)-二维图纸进展
 * @return {*}
 */
export function pdmPicReport(data: any) {
  return httpRequest({
    url: "/cirpoint-base-api/reportinfo/pdmPicReport",
    method: "POST",
    data,
  });
}
/**
 * 系统用户统计
 * @return {*}
 */
export function getReportSystemLoginUser(data: any) {
  return httpRequest({
    url: "/cirpoint-base-api/reportinfo/getReportSystemLoginUser",
    method: "POST",
    data,
  });
}
/**
 * 产品设计看板(new)-交付物统计
 * @return {*}
 */
export function deliveryReport(data: any) {
  return httpRequest({
    url: "/cirpoint-base-api/reportinfo/deliveryReport",
    method: "POST",
    data,
  });
}
/**
 * 产品设计看板-项目概览（按年度，business-service）
 */
export function productBoardProjectOverview(data: { year: number }) {
  return httpRequest({
    url: "/business-service/business/project-info/product-board-project-overview",
    method: "POST",
    data,
  });
}
/**
 * 产品设计看板：WBS 一级分类下协同发布任务、协同已完成、独立应用数（business-service）
 */
export function collabStandaloneBoard(data: {
  projectId: string | number;
  phaseId?: string | number;
}) {
  return httpRequest({
    url: "/business-service/business/project-wbs/product-board-collab-standalone",
    method: "POST",
    data,
  });
}
/** 产品设计看板-项目交付：按任务创建人部门汇总 */
export function deliveryByDeptBoard(data: {
  projectId: string | number;
  phaseId?: string | number;
}) {
  return httpRequest({
    url: "/business-service/business/project-wbs/product-board-delivery-by-dept",
    method: "POST",
    data,
  });
}
/**
 * 产品设计看板-项目任务：按 menuId 汇总全项目 WBS 协同任务（分类树节点 + 状态分布）
 */
export function productBoardTaskByMenu(data: { menuId: string | number }) {
  return httpRequest({
    url: "/business-service/business/task-category-tree/product-board-task-by-menu",
    method: "POST",
    data,
  });
}
/** 产品设计看板-活动页面被引用次数排行 */
export function productBoardActivityPageRefRank(data: {
  menuId: string | number;
  limit?: number;
}) {
  return httpRequest({
    url: "/business-service/business/activity-basic-info/product-board-activity-page-ref-rank",
    method: "POST",
    data,
  });
}
/** 产品设计看板-项目交付：按 menuId 汇总协同任务与独立应用 */
export function productBoardDeliveryByMenu(data: { menuId: string | number }) {
  return httpRequest({
    url: "/business-service/business/project-wbs/product-board-delivery-by-menu",
    method: "POST",
    data,
  });
}
/**
 * 知识看板
 * @return {*}
 */
export function getModelVisitReport(data: any) {
  return httpRequest({
    url: "/cirpoint-base-api/reportinfo/getModelVisitReport",
    method: "POST",
    data,
  });
}
