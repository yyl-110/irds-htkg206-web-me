import { ContentType, httpClient, type RequestParams } from '../http-client';

/** 报告模板占位符 */
export interface ReportPreparationPlaceholderDTO {
  para1?: string;
  para2?: string;
  para3?: string;
  para4?: string;
}

/** 报告模板列表项 */
export interface ReportPreparationTemplateDTO {
  id?: number | string;
  /** 雪花 ID，前端请用 string 传递避免精度丢失 */
  fileId?: number | string;
  para1?: string;
  para2?: string;
  versionNum?: number;
  confidentialLevel?: number;
  oldFileName?: string;
  fileName?: string;
  fileUrl?: string;
  pdfUrl?: string;
}

/** 分页结果 */
export interface ReportPreparationPageResult {
  list?: ReportPreparationTemplateDTO[];
  total?: number;
}

/** 生成报告返回 */
export interface ReportPreparationExportResultDTO {
  fileId?: number;
  fileName?: string;
  oldFileName?: string;
  fileUrl?: string;
}

/**
 * 报告编制 / 模板文件库
 */
export class AdminApiReportPreparation {
  static $tagName = '报告编制';

  /** 分页列表 */
  static getPage = (
    query: { pageNo?: number; pageSize?: number; keyword?: string },
    params: RequestParams = {},
  ) =>
    httpClient.request<{ data?: ReportPreparationPageResult }, any>(
      {
        path: '/business-service/business/report-preparation/page',
        method: 'GET',
        query,
        secure: true,
        ...params,
      },
      Object,
    );

  /** 模板列表（t_report_preparation） */
  static getTemplateList = (query?: { keyword?: string }, params: RequestParams = {}) =>
    httpClient.request<{ data?: ReportPreparationTemplateDTO[] }, any>(
      {
        path: '/business-service/business/report-preparation/list',
        method: 'GET',
        query,
        secure: true,
        ...params,
      },
      Object,
    );

  /** 详情 */
  static get = (id: number | string, params: RequestParams = {}) =>
    httpClient.request<{ data?: ReportPreparationTemplateDTO }, any>(
      {
        path: '/business-service/business/report-preparation/get',
        method: 'GET',
        query: { id },
        secure: true,
        ...params,
      },
      Object,
    );

  /** 新增 */
  static create = (body: ReportPreparationTemplateDTO, params: RequestParams = {}) =>
    httpClient.request<{ data?: number }, any>(
      {
        path: '/business-service/business/report-preparation/create',
        method: 'POST',
        body,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      Object,
    );

  /** 更新 */
  static update = (body: ReportPreparationTemplateDTO, params: RequestParams = {}) =>
    httpClient.request<{ data?: boolean }, any>(
      {
        path: '/business-service/business/report-preparation/update',
        method: 'POST',
        body,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      Object,
    );

  /** 删除 */
  static delete = (id: number | string, params: RequestParams = {}) =>
    httpClient.request<{ data?: boolean }, any>(
      {
        path: '/business-service/business/report-preparation/delete',
        method: 'DELETE',
        query: { id },
        secure: true,
        ...params,
      },
      Object,
    );

  /** 解析 Word 模板占位符 */
  static parseTemplateHtml = (fileId: number | string, params: RequestParams = {}) =>
    httpClient.request<{ data?: ReportPreparationPlaceholderDTO[] }, any>(
      {
        path: '/business-service/business/report-preparation/parse-html',
        method: 'GET',
        query: { fileId },
        secure: true,
        ...params,
      },
      Object,
    );

  /** 生成报告 */
  static exportReport = (
    body: { fileId: number | string; params: string; userId?: string | number },
    params: RequestParams = {},
  ) =>
    httpClient.request<{ data?: ReportPreparationExportResultDTO }, any>(
      {
        path: '/business-service/business/report-preparation/export',
        method: 'POST',
        body,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      Object,
    );
}
