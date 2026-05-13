import httpRequest from "@/httpRequest";

/**
 * 报表--知识中心看板
 * @return {*}
 */
export function getReportKnowledgeList(data: { type: string | number }) {
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
export function getReportModuleList(data: { projectId: string | number }) {
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
export function getReportSystemList() {
  return httpRequest({
    url: "/system-service/reportinfo/getReportSystemList",
    method: "POST",
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
