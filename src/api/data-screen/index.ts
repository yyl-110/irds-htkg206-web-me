import request from './request';

/**
 * 报表--基础资源看板
 * @return {*}
 */
export function getReportKnowledgeList() {
  return request({
    url: '/cirpoint-base-api/reportinfo/getReportKnowledgeList',
    method: 'post',
  });
}
/**
 * 模块化看板
 * @return {*}
 */
export function getReportModuleList() {
  return request({
    url: '/cirpoint-base-api/reportinfo/getReportModuleList',
    method: 'post',
  });
}
/**
 * 报表--产品设计看板
 * @return {*}
 */
export function getReportProjectList(data: { projectId: string | number; phaseId: string | number }) {
  return request({
    url: '/cirpoint-base-api/reportinfo/getReportProjectList',
    method: 'post',
    data,
  });
}
/**
 * 报表--项目列表和阶段信息
 * @return {*}
 */
export function getReportProjectPhaseList() {
  return request({
    url: '/cirpoint-base-api/reportinfo/getReportProjectPhaseList',
    method: 'post',
  });
}
/**
 * 报表--系统运行看板
 * @return {*}
 */
export function getReportSystemList() {
  return request({
    url: '/cirpoint-base-api/reportinfo/getReportSystemList',
    method: 'post',
  });
}
/**
 * 报表--产品设计看板(new)-二维图纸进展
 * @return {*}
 */
export function pdmPicReport(data: any) {
  return request({
    url: '/cirpoint-base-api/reportinfo/pdmPicReport',
    method: 'post',
    data,
  });
}
/**
 * 系统用户统计
 * @return {*}
 */
export function getReportSystemLoginUser(data: any) {
  return request({
    url: '/cirpoint-base-api/reportinfo/getReportSystemLoginUser',
    method: 'post',
    data,
  });
}
/**
 * 产品设计看板(new)-交付物统计
 * @return {*}
 */
export function deliveryReport(data: any) {
  return request({
    url: '/cirpoint-base-api/reportinfo/deliveryReport',
    method: 'post',
    data,
  });
}
/**
 * 知识看板
 * @return {*}
 */
export function getModelVisitReport(data: any) {
  return request({
    url: '/cirpoint-base-api/reportinfo/getModelVisitReport',
    method: 'post',
    data,
  });
}

/**
 * 需求管理
 * @return {*}
 */
export function compareReportInfo(data: any) {
  return request({
    url: '/cirpoint-demand-api/demand-report/compareReportInfo',
    method: 'get',
    data,
  });
}

/**
 * 需求管理看板数据
 * @return {*}
 */
export function chartReportInfo(data: any) {
  return request({
    url: '/cirpoint-demand-api/demand-report/chartReportInfo',
    method: 'get',
    params: data,
  });
}

/**
 * 根据时间和分页进行列表数据查询
 * @return {*}
 */
export function demandReportPage(params: any) {
  return request({
    url: '/cirpoint-demand-api/demand-report/demandReportPage',
    method: 'get',
    params,
  });
}

/**
 * 获取所有的产品规划
 * @return {*}
 */
export function getProductPlanList(data: any) {
  return request({
    url: '/cirpoint-demand-api/demand-report/getAllProductPlanList',
    method: 'post',
    data,
  });
}
