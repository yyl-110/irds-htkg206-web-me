// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { ParameterPageRequestDTOModel } from '@/api/models/parameter/ParameterPageRequestDTOModel';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { ParameterInfoRequestDTOModel } from '@/api/models/parameter/ParameterInfoRequestDTOModel';
import { ParameterUnitRequestDTOModel } from '@/api/models/parameter/ParameterUnitRequestDTOModel';
import { ParameterCheckRequestDTOModel } from '@/api/models/parameter/ParameterCheckRequestDTOModel';

/**
 * 系统参数管理
 */
export class AdminApiSystemParameter {
  /**
   * 获得参数列表信息
   *
   * @tags 管理后台 - 参数
   * @name getParameterPageList
   * @summary 获得参数信息
   * @request /cirpoint-base-api/tempalteinfo/getTempalteParaInfoList.json
   * @secure
   */
  static getParameterPageList = <Req extends ParameterPageRequestDTOModel = ParameterPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/getTempalteParaInfoList.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获得参数单位根节点
   *
   * @tags 管理后台 - 参数单位
   * @name getUnitParentApi
   * @summary 获得参数单位信息
   * @request /cirpoint-base-api/tempalteinfo/getUnitParent
   * @secure
   */
  static getUnitParentApi = <Req extends ParameterUnitRequestDTOModel = ParameterUnitRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/getUnitParent`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获得参数大小量纲信息
   *
   * @tags 管理后台 - 大小量纲
   * @name getUnitChildrenApi
   * @summary 获得大小量纲信息
   * @request /cirpoint-base-api/tempalteinfo/getUnitChildren
   * @secure
   */
  static getUnitChildrenApi = <Req extends ParameterUnitRequestDTOModel = ParameterUnitRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/getUnitChildren`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获得参数列表信息
   *
   * @tags 管理后台 - 参数
   * @name parameterInfoSaveOrUpdate
   * @summary 获得参数信息
   * @request /cirpoint-base-api/tempalteinfo/getTempalteSaveOrUpdate.json
   * @secure
   */
  static parameterInfoSaveOrUpdate = <Req extends ParameterInfoRequestDTOModel = ParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/getTempalteSaveOrUpdate.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除参数信息
   *
   * @tags 删除参数信息
   * @name deleteParameterInfo
   * @summary 删除参数信息
   * @request POST:/cirpoint-base-api/reportinfo/deleteReportInfo.json
   * @secure
   */
  static deleteParameterInfo = <Req extends ParameterCheckRequestDTOModel = ParameterCheckRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/deleteTempalteInfoById.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取历史版本参数信息
   *
   * @tags 获取历史版本参数信息
   * @name deleteParameterInfo
   * @summary 获取历史版本参数信息
   * @request POST:/cirpoint-base-api/tempalteinfo/getTempalteParaInfoHisList.json
   * @secure
   */
  static getHisParameterInfo = <Req extends ParameterCheckRequestDTOModel = ParameterCheckRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api//tempalteinfo/getTempalteParaInfoHisList.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存参数知识
   *
   * @tags 保存参数知识
   * @name deleteParameterInfo
   * @summary 保存参数知识
   * @request POST:/cirpoint-base-api/tempalteinfo/propKnowledgeUpdate.json
   * @secure
   */
  static saveKnowledgeUpdagte = <Req extends ParameterCheckRequestDTOModel = ParameterCheckRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api//tempalteinfo/propKnowledgeUpdate.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 系统参数管理右侧表格Excel导出功能
   *
   * @tags 管理后台 - 系统参数管理右侧表格Excel导出功能
   * @name exportDataPlatParameterList
   * @summary 系统参数管理右侧表格Excel导出功能
   * @request POST:/cirpoint-base-api/tempalteinfo/export
   * @secure
   */
  static exportDatatempalteinfo = <Req extends { categoryid: string } = { categoryid: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 系统参数管理右侧表格Excel下载功能
   *
   * @tags 管理后台 - 系统参数管理右侧表格Excel导出功能
   * @name exportDataPlatParameterList
   * @summary 系统参数管理右侧表格Excel下载功能
   * @request POST:/cirpoint-base-api/tempalteinfo/download
   * @secure
   */
  static downloadExcel = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/download`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计查核导出功能
   *
   * @tags 管理后台 - 设计查核导出功能
   * @name auditExportData
   * @summary 设计查核导出功能
   * @request POST:/cirpoint-module-api/auditLibrary/export
   * @secure
   */
  static auditExportData = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计查核下载模板
   *
   * @tags 管理后台 - 设计查核下载模板
   * @name auditDownloadExcel
   * @summary 设计查核下载模板
   * @request POST:/cirpoint-module-api/auditLibrary/download
   * @secure
   */
  static auditDownloadExcel = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/download`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 系统参数管理右侧表格Excel导入功能
   *
   * @tags 管理后台 - 系统参数管理右侧表格Excel导入功能
   * @name exportDataPlatParameterList
   * @summary 系统参数管理右侧表格Excel导出功能
   * @request POST:/cirpoint-base-api/tempalteinfo/importPropertyInformationNew.json
   * @secure
   */
  static importPropertyInformationNew = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/importPropertyInformationNew.json`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
