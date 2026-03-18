// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from '../http-client';
import { ModuleMenuPageRequestDTOModel } from '@/api/models/module/ModuleMenuPageRequestDTOModel';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { DesignInfoRequestDTOModel } from '@/api/models/designcheck/DesignInfoRequestDTOModel';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { ModuleMenuAddRequestDTOModel, ModuleimgdeleteRequestDTOModel } from '@/api/models/module/ModuleMenuAddRequestDTOModel';
import { parameterDictionaryRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
/**
 * 系统模块库
 */
export class AdminApiSystemModule {
  /**
   * 模块库分类查询
   *
   * @tags 模块库分类查询
   * @name getModuleMenuList
   * @summary 模块库分类查询
   * @request /business-service/business/library-category/browseTopModuleTree
   * @secure
   */
  static getModuleMenuList = <Req extends ModuleMenuPageRequestDTOModel = ModuleMenuPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-category/browseTopModuleTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 参数字典查询
   *
   * @tags 参数字典查询
   * @name getTempalteParaInfoList
   * @summary 参数字典查询
   * @request business-service/business/library-property/getParameterInfoPage
   * @secure
   */
  static getParameterInfoPage = <Req extends parameterDictionaryRequestDTOModel = parameterDictionaryRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `business-service/business/library-property/getParameterInfoPage`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 选取树节点列表
   *
   * @tags 选取树节点列表
   * @name parameterTreeList
   * @summary 选取树节点列表
   * @request system-service/system/parameter-category-tree/parameter-tree-list
   * @secure
   */
  static parameterTreeList = <Req extends parameterDictionaryRequestDTOModel = parameterDictionaryRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `system-service/system/parameter-category-tree/parameter-tree-list`,
        method: 'GET',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 模块库分类图片列表查询
   *
   * @tags 模块库分类图片列表查询
   * @name getCategpryImgListById
   * @summary 模块库分类图片列表查询
   * @request /business-service/business/library-category/getCategoryImgListById
   * @secure
   */
  static getCategpryImgListById = <Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-category/getCategoryImgListById`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   * 模块库表头列表查询
   *
   * @tags 模块库表头列表查询
   * @name preciseQueryModuleLibrary
   * @summary 模块库表头列表查询
   * @request /business-service/business/library-property/getLibraryDataPageByMenuAndCategory
   * @secure
   */
  static preciseQueryModuleLibrary = <Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/getLibraryDataPageByMenuAndCategory`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 模块库列表查询
   *
   * @tags 模块库列表查询
   * @name findCurrentModuleInfoByCategoryId
   * @summary 模块库列表查询
   * @request /business-service/business/library-property/getLibraryPropertyByIds
   * @secure
   */
  static findCurrentModuleInfoByCategoryId = <Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-property/getLibraryPropertyByIds`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获取模型库文档信息
   *
   * @tags 获取模型库文档信息
   * @name getLibraryFileInfoList
   * @summary 获取模型库文档信息
   * @request /business-service/business/library-file/getLibraryFileInfoList
   * @secure
   */
  static getLibraryFileInfoList = <Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-file/getLibraryFileInfoList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags 模块库添加数据
   * @name moduleInfoSave
   * @summary 模块库添加数据
   * @request /business-service/business/library-data/keepLibraryData
   * @secure
   */
  static moduleInfoKeep = <Req extends ModuleMenuAddRequestDTOModel = ModuleMenuAddRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/keepLibraryData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   *
   *
   * @tags 模块库删除数据
   * @name moduleInfoSave
   * @summary 模块库删除数据
   * @request /business-service/business/library-data/batchDeleteModuleInfo
   * @secure
   */
  static batchDeleteModuleInfo = <Req extends ModuleimgdeleteRequestDTOModel = ModuleimgdeleteRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/batchDeleteModuleInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  // ----------------------属性管理--------------------------

  /**
   *
   *
   * @tags 属性管理保存列
   * @name moduleInfoSave
   * @summary 属性管理保存列
   * @request /business-service/business/library-property/keepModuleProperty
   * @secure
   */
  static updateModuleProperty = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-property/keepModuleProperty`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags 属性管理删除列
   * @name moduleInfoSave
   * @summary 属性管理删除列
   * @request /business-service/business/library-property/batchDeleteModuleProperty
   * @secure
   */
  static batchDeleteModuleProperty = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-property/batchDeleteModuleProperty`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags 数据管理导出
   * @name exportModuleLibraryApi
   * @summary 数据管理导出
   * @request /business-service/business/library-data/moduleLibraryExportData
   * @secure
   */
  static exportModuleLibraryApi = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/moduleLibraryExportData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags 列宽保存
   * @name columnWidthSave
   * @summary 列宽保存
   * @request /business-service/business/library-property/columnWidthSave
   * @secure
   */
  static columnWidthSave = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-property/columnWidthSave`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags 比较数据
   * @name moduleDataComparison
   * @summary 比较数据
   * @request /business-service/business/library-data/moduleDataComparison
   * @secure
   */
  static moduleDataComparison = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/moduleDataComparison`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags 导出模块库数据管理模版
   * @name createModuleLibraryTemplateApi
   * @summary 导出模块库数据管理模版
   * @request /business-service/business/library-data/getFileManageInfoParamDTO
   * @secure
   */
  static createModuleLibraryTemplateApi = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/getFileManageInfoParamDTO`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   *
   *
   * @tags 导入模块库数据
   * @name importingModelInformationNew
   * @summary 导入模块库数据
   * @request /business-service/business/library-data/importingModelInformationNew
   * @secure
   */
  static importingModelInformationNew = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/importingModelInformationNew`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags 模块库抽屉详情
   * @name getModuleUserUploadDocument
   * @summary 模块库抽屉详情
   * @request /business-service/business/library-pdm-attribute/findAllModuleAttachment
   * @secure
   */
  static findAllModuleAttachment = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-pdm-attribute/findAllModuleAttachment`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags
   * @name krAttribute
   * @summary
   * @request /business-service/business/library-pdm-attribute/krAttribute
   * @secure
   */
  static krAttribute = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-pdm-attribute/krAttribute`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   *
   *
   * @tags
   * @name findParametricDesign
   * @summary
   * @request /business-service/business/library-data/findParametricDesign
   * @secure
   */
  static findParametricDesign = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/findParametricDesign`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *
   *
   * @tags
   * @name findUserInfo
   * @summary
   * @request /business-service/business/library-data/findParametricDesign
   * @secure
   */
  static findUserInfo = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-data/findUserInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
