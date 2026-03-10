// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import { ProductPlatformParameterInfoUpdateDTOModel } from '@/api/models/product/ProductPlatformParameterInfoUpdateDTOModel';
import { ProductSeriesParameterInfoRequestDTOModel } from '@/api/models/product/ProductSeriesParameterInfoRequestDTOModel';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
import { ProductSeriesGBOMModuleInfoDTOModel } from '@/api/models/product/ProductSeriesGBOMModuleInfoDTOModel';
/**
 * 公告管理
 */
export class AdminApiSystemProduct {
  /**
   * 查询产品平台库树结构
   *
   * @tags 管理后台 - 查询产品平台库树结构
   * @name getProductTree
   * @summary 查询产品平台库树结构
   * @request POST:/cirpoint-base-api/productLibrary/getTree
   * @secure
   */
  static getProductTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/getTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 树结构添加节点功能
   *
   * @tags 管理后台 - 树结构添加节点功能
   * @name addProductTree
   * @summary 树结构添加节点功能
   * @request POST:/cirpoint-module-api/productLibrary/add
   * @secure
   */
  static addProductTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/add`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 树结构编辑节点功能
   *
   * @tags 管理后台 - 树结构编辑节点功能
   * @name addProductTree
   * @summary 树结构编辑节点功能
   * @request POST:/cirpoint-module-api/productLibrary/update
   * @secure
   */
  static updateProductTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 树结构上移功能
   *
   * @tags 管理后台 - 树结构上移功能
   * @name addProductTree
   * @summary 树结构上移功能
   * @request POST:/cirpoint-module-api/productLibrary/moveUp
   * @secure
   */
  static moveUpProductTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/moveUp`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 树结构下移功能
   *
   * @tags 管理后台 - 树结构下移功能
   * @name addProductTree
   * @summary 树结构下移功能
   * @request POST:/cirpoint-module-api/productLibrary/moveDown
   * @secure
   */
  static moveDownProductTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/moveDown`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 树结构删除功能
   *
   * @tags 管理后台 - 树结构删除功能
   * @name addProductTree
   * @summary 树结构删除功能
   * @request POST:/cirpoint-module-api/productLibrary/add
   * @secure
   */
  static delProductTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/del`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块库树结构查询功能
   *
   * @tags 管理后台 - 产品模块库树结构查询功能
   * @name getProductModuleTree
   * @summary 产品模块库树结构查询功能
   * @request POST:/cirpoint-base-api/syscate/getCategoryBomTree.json
   * @secure
   */
  static getProductModuleTree = <Req extends ProductModuleTreeInfoRequestDTOModel = ProductModuleTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/syscate/getCategoryBomTree.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 参数导入模板下载
   *
   * @tags 管理后台 - 参数导入模板下载
   * @name auditDownloadExcel
   * @summary 参数导入模板下载
   * @request POST:/cirpoint-module-api/seriesParameter/download
   * @secure
   */
  static downloadParamTemplate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/download`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 参数导入
   *
   * @tags 管理后台 - 参数导入
   * @name auditDownloadExcel
   * @summary 参数导入
   * @request POST:/cirpoint-module-api/seriesParameter/importSeriesParameter
   * @secure
   */
  static importParam = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/importSeriesParameter`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块库树结构添加节点功能
   *
   * @tags 管理后台 - 产品模块库树结构添加节点功能
   * @name getProductModuleTree
   * @summary 产品模块库树结构添加节点功能
   * @request POST:/cirpoint-base-api/syscate/getCategoryBomTree.json
   * @secure
   */
  static addProductModuleTree = <Req extends ProductModuleTreeInfoRequestDTOModel = ProductModuleTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/syscate/addEmptyNode.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块库树结构修改节点功能
   *
   * @tags 管理后台 - 产品模块库树结构修改节点功能
   * @name getProductModuleTree
   * @summary 产品模块库树结构修改节点功能
   * @request POST:/cirpoint-base-api/syscate/updateCategoryNode.json
   * @secure
   */
  static updateCategoryNode = <Req extends ProductModuleTreeInfoRequestDTOModel = ProductModuleTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/syscate/updateCategoryNode.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块库树结构获取节点详情功能
   *
   * @tags 管理后台 - 产品模块库树结构获取节点详情功能
   * @name getProductModuleTree
   * @summary 产品模块库树结构获取节点详情功能
   * @request POST:/cirpoint-base-api/syscate/getCategoryBomTree.json
   * @secure
   */
  static getCategpryInfoById = <Req extends ProductModuleTreeInfoRequestDTOModel = ProductModuleTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/syscate/getCategoryInfoById.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块库树结构排序功能
   *
   * @tags 管理后台 - 产品模块库树结构排序功能
   * @name getProductModuleTree
   * @summary 产品模块库树结构排序功能
   * @request POST:/cirpoint-base-api/syscate/updTreeKey.json
   * @secure
   */
  static updTreeKey = <Req extends ProductModuleTreeInfoRequestDTOModel = ProductModuleTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/syscate/updTreeKey.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块库树结构删除功能
   *
   * @tags 管理后台 - 产品模块库树结构删除功能
   * @name getProductModuleTree
   * @summary 产品模块库树结构删除功能
   * @request POST:/cirpoint-base-api/syscate/delTreeNode.json
   * @secure
   */
  static delTreeNode = <Req extends ProductModuleTreeInfoRequestDTOModel = ProductModuleTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/syscate/delTreeNode.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 查询产品设计查核树结构
   *
   * @tags 管理后台 - 查询产品设计查核树结构
   * @name getProductTree
   * @summary 查询产品设计查核树结构
   * @request POST:/cirpoint-base-api/productLibrary/getTree
   * @secure
   */
  static getDesignTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/getTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计查核树结构添加
   *
   * @tags 管理后台 - 设计查核树结构添加
   * @name getProductTree
   * @summary 设计查核树结构添加
   * @request POST:/cirpoint-base-api/productLibrary/getTree
   * @secure
   */
  static addDesignTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/add`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计查核树结构编辑
   *
   * @tags 管理后台 - 设计查核树结构编辑
   * @name getProductTree
   * @summary 设计查核树结构编辑
   * @request POST:/cirpoint-base-api/productLibrary/updateesignTree
   * @secure
   */
  static updateesignTree = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计查核树结构上移
   *
   * @tags 管理后台 - 设计查核树结构上移
   * @name designTreeMoveUp
   * @summary 设计查核树结构上移
   * @request POST:/cirpoint-base-api/productLibrary/moveUp
   * @secure
   */
  static designTreeMoveUp = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/moveUp`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计查核树结构下移
   *
   * @tags 管理后台 - 设计查核树结构下移
   * @name designTreeMoveDown
   * @summary 设计查核树结构下移
   * @request POST:/cirpoint-base-api/productLibrary/updateesignTree
   * @secure
   */
  static designTreeMoveDown = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/moveDown`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计查核树结构删除
   *
   * @tags 管理后台 - 设计查核树结构删除
   * @name designTreedel
   * @summary 设计查核树结构删除
   * @request POST:/cirpoint-base-api/productLibrary/updateesignTree
   * @secure
   */
  static designTreeDel = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/del`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 通用物料树结构查询
   *
   * @tags 管理后台 - 通用物料树结构查询
   * @name getPlatformTreeInfo
   * @summary 通用物料树结构查询
   * @request POST:/cirpoint-base-api/productLibrary/getPlatformTreeInfo
   * @secure
   */
  static getPlatformTreeInfo = <Req extends ProductTreeInfoRequestDTOModel = ProductTreeInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/folderPart/getTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 查询产品平台参数定义接口
   *
   * @tags 管理后台 - 查询产品平台参数定义接口
   * @name getProductParameterList
   * @summary 查询产品平台参数定义接口
   * @request POST:/cirpoint-base-api/productLibrary/getProductParameterList
   * @secure
   */
  static getPlatformParameterList = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformParameter/getParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * Excel导出功能
   *
   * @tags 管理后台 - Excel导出功能
   * @name exportDataPlatParameterList
   * @summary Excel导出功能
   * @request POST:/cirpoint-base-api/productLibrary/exportDataPlatParameterList
   * @secure
   */
  static exportDataPlatParameterList = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformParameter/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * Excel导出功能
   *
   * @tags 管理后台 - Excel导出功能
   * @name seriesGBOMExportData
   * @summary Excel导出功能
   * @request POST:/cirpoint-module-api/seriesGBOM/data/export
   * @secure
   */
  static seriesGBOMExportData = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/data/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * Excel导出功能
   *
   * @tags 管理后台 - Excel导出功能
   * @name exportSeriesParameterList
   * @summary Excel导出功能
   * @request POST:/cirpoint-base-api/seriesParameter/export
   * @secure
   */
  static exportSeriesParameterList = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 查询产品平台参数定义接口
   *
   * @tags 管理后台 - 查询产品平台参数定义接口
   * @name getProductParameterList
   * @summary 查询产品平台参数定义接口
   * @request POST:/cirpoint-base-api/productLibrary/getProductParameterList
   * @secure
   */
  static getSeriesParameterList = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/getParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 添加平台参数获取参数字典数据接口
   *
   * @tags 管理后台 - 添加平台参数获取参数字典数据接口
   * @name getProductParameterList
   * @summary 添加平台参数获取参数字典数据接口
   * @request POST:/cirpoint-base-api/tempalteinfo/getTempalteParaInfoList.json
   * @secure
   */
  static getTempalteParaInfoList = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/getTempalteParaInfoList.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 添加平台参数接口
   *
   * @tags 管理后台 - 添加平台参数接口
   * @name addParameterInfo
   * @summary 添加平台参数接口
   * @request POST:/cirpoint-base-api/platformParameter/addParameterInfo.json
   * @secure
   */
  static addParameterInfo = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformParameter/addParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 修改平台参数接口
   *
   * @tags 管理后台 - 修改平台参数接口
   * @name updateParameterInfo
   * @summary 修改平台参数接口
   * @request POST:/cirpoint-base-api/platformParameter/updateParameterInfo.json
   * @secure
   */
  static updateParameterInfo = <Req extends ProductPlatformParameterInfoUpdateDTOModel = ProductPlatformParameterInfoUpdateDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformParameter/updateParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 平台参数排序移动
   *
   * @tags 管理后台 - 平台参数排序移动
   * @name moveParameterInfo
   * @summary 平台参数排序移动
   * @request POST:/cirpoint-base-api/platformParameter/move
   * @secure
   */
  static moveParameterInfo = <Req extends ProductPlatformParameterInfoUpdateDTOModel = ProductPlatformParameterInfoUpdateDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformParameter/move`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 平台参数删除
   *
   * @tags 管理后台 - 平台参数删除
   * @name moveParameterInfo
   * @summary 平台参数删除
   * @request POST:/cirpoint-base-api/platformParameter/delParameter
   * @secure
   */
  static delParameterInfo = <Req extends ProductPlatformParameterInfoUpdateDTOModel = ProductPlatformParameterInfoUpdateDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformParameter/delParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 查询产品平台GBOM定义接口
   *
   * @tags 管理后台 - 查询产品平台GBOM定义接口
   * @name getPlatformbomGBOMTree
   * @summary 查询产品平台GBOM定义接口
   * @request POST:/cirpoint-base-api/platformbomGBOM/getPlatformbomGBOMTree
   * @secure
   */
  static getPlatformbomGBOMTree = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformbomGBOM/getPlatformbomGBOMTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 查询产品平台GBOM参数添加
   *
   * @tags 管理后台 - 查询产品平台GBOM参数添加
   * @name addPlatformbomGBOM
   * @summary 查询产品平台GBOM参数添加
   * @request POST:/cirpoint-base-api/platformbomGBOM/查询产品平台GBOM参数添加
   * @secure
   */
  static addPlatformbomGBOM = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformbomGBOM/addPlatformbomGBOM`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM参数添加关联构型树结构查询功能
   *
   * @tags 管理后台 - GBOM参数添加关联构型树结构查询功能
   * @name getGBOMTreeList
   * @summary GBOM参数添加关联构型树结构查询功能
   * @request POST:/cirpoint-base-api/platformbomGBOM/getGBOMTreeList
   * @secure
   */
  static getGBOMTreeList = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdm/getTreeList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM参数添加编辑功能
   *
   * @tags 管理后台 - GBOM参数添加编辑功能
   * @name updatePlatformbomGBOM
   * @summary GBOM参数添加编辑功能
   * @request POST:/cirpoint-base-api/platformbomGBOM/updatePlatformbomGBOM
   * @secure
   */
  static updatePlatformbomGBOM = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformbomGBOM/updatePlatformbomGBOM`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM参数删除功能
   *
   * @tags 管理后台 - GBOM参数删除功能
   * @name delPlatformbomGBOM
   * @summary GBOM参数删除功能
   * @request POST:/cirpoint-base-api/platformbomGBOM/delPlatformbomGBOM
   * @secure
   */
  static delPlatformbomGBOM = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformbomGBOM/delPlatformbomGBOM`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM参数下载模板
   *
   * @tags 管理后台 - GBOM参数下载模板
   * @name downloadExcel
   * @summary GBOM参数下载模板
   * @request POST:/cirpoint-base-api/platformbomGBOM/download
   * @secure
   */
  static downloadExcel = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformbomGBOM/download`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM参数下载模板
   *
   * @tags 管理后台 - GBOM参数下载模板
   * @name downloadExcel
   * @summary GBOM参数下载模板
   * @request POST:/cirpoint-base-api/platformbomGBOM/download
   * @secure
   */
  static gbomImportData = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformbomGBOM/import`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 参数定义下关键指标切换状态接口
   *
   * @tags 管理后台 - 参数定义下关键指标切换状态接口
   * @name updateKeyIndicators
   * @summary 参数定义下关键指标切换状态接口
   * @request POST:/cirpoint-base-api/platformbomGBOM/updateKeyIndicators
   * @secure
   */
  static updateKeyIndicators = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/updateKeyIndicators`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   * 参数定义三级节点添加初始化功能
   *
   * @tags 管理后台 - 参数定义三级节点添加初始化功能
   * @name getParameterData
   * @summary 参数定义三级节点添加初始化功能
   * @request POST:/cirpoint-base-api/platformbomGBOM/getParameterData
   * @secure
   */
  static getParameterData = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/platformParameter/getParameterData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   * 参数定义三级节点添加功能
   *
   * @tags 管理后台 - 参数定义三级节点添加功能
   * @name addSeriesParameter
   * @summary 参数定义三级节点添加功能
   * @request POST:/cirpoint-base-api/seriesParameter/addSeriesParameter
   * @secure
   */
  static addSeriesParameter = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/addSeriesParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 参数定义三级节点上移
   *
   * @tags 管理后台 - 参数定义三级节点上移
   * @name movePamareterChirdrenUp
   * @summary 参数定义三级节点上移
   * @request POST:/cirpoint-base-api/seriesParameter/movePamareterChirdrenUp
   * @secure
   */
  static movePamareterChirdrenUp = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/move`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   * 参数定义三级节点下移
   *
   * @tags 管理后台 - 参数定义三级节点下移
   * @name movePamareterChirdrenDown
   * @summary 参数定义三级节点下移
   * @request POST:/cirpoint-base-api/seriesParameter/movePamareterChirdrenDown
   * @secure
   */
  static movePamareterChirdrenDown = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/move`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 参数定义三级节点删除
   *
   * @tags 管理后台 - 参数定义三级节点删除
   * @name delSeriesParameter
   * @summary 参数定义三级节点删除
   * @request POST:/cirpoint-base-api/seriesParameter/delSeriesParameter
   * @secure
   */
  static delSeriesParameter = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/delSeriesParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 参数定义三级节点修改
   *
   * @tags 管理后台 - 参数定义三级节点修改
   * @name updateSeriesParameter
   * @summary 参数定义三级节点修改
   * @request POST:/cirpoint-base-api/seriesParameter/updateSeriesParameter
   * @secure
   */
  static updateSeriesParameter = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/updateSeriesParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 子节点GBOM定义列表查询功能
   *
   * @tags 管理后台 - 子节点GBOM定义列表查询功能
   * @name getSeriesGBOM
   * @summary 子节点GBOM定义列表查询功能
   * @request POST:/cirpoint-base-api/seriesParameter/getSeriesGBOM
   * @secure
   */
  static getSeriesGBOM = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/getSeriesGBOM`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义必选/可选状态修改
   *
   * @tags 管理后台 - GBOM定义必选/可选状态修改
   * @name updateSeriesGBOMStatus
   * @summary GBOM定义必选/可选状态修改
   * @request POST:/cirpoint-base-api/seriesParameter/update
   * @secure
   */
  static updateSeriesGBOMStatus = <Req extends ProductSeriesGBOMInfoRequestDTOModel = ProductSeriesGBOMInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义子节点添加功能
   *
   * @tags 管理后台 - GBOM定义子节点添加功能
   * @name customAddSeriesGBOM
   * @summary GBOM定义子节点添加功能
   * @request POST:/cirpoint-module-api/seriesGBOM/customAdd
   * @secure
   */
  static customAddSeriesGBOM = <Req extends ProductSeriesGBOMInfoRequestDTOModel = ProductSeriesGBOMInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/customAdd`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义子节点编辑功能
   *
   * @tags 管理后台 - GBOM定义子节点编辑功能
   * @name customUpdateSeriesGBOM
   * @summary GBOM定义子节点编辑功能
   * @request POST:/cirpoint-module-api/seriesGBOM/updateAll
   * @secure
   */
  static customUpdateSeriesGBOM = <Req extends ProductSeriesGBOMInfoRequestDTOModel = ProductSeriesGBOMInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/updateAll`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义子节点删除功能
   *
   * @tags 管理后台 - GBOM定义子节点删除功能
   * @name customDeleteSeriesGBOM
   * @summary GBOM定义子节点删除功能
   * @request POST:/cirpoint-module-api/seriesGBOM/delete
   * @secure
   */
  static customDeleteSeriesGBOM = <Req extends ProductSeriesGBOMInfoRequestDTOModel = ProductSeriesGBOMInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义子节点添加功能
   *
   * @tags 管理后台 - GBOM定义子节点添加功能
   * @name customSaveSeriesGBOM
   * @summary GBOM定义子节点删除功能
   * @request POST:/cirpoint-module-api/seriesGBOM/save
   * @secure
   */
  static customSaveSeriesGBOM = <Req extends ProductSeriesGBOMInfoRequestDTOModel = ProductSeriesGBOMInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/save`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义子节点添加功能
   *
   * @tags 管理后台 - GBOM定义子节点添加功能
   * @name getSeriesGBOMModules
   * @summary GBOM定义子节点删除功能
   * @request POST:/cirpoint-module-api/seriesGBOM/getModules
   * @secure
   */
  static getSeriesGBOMModules = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/getModules`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义关联模块数据初始化获取树节点功能
   *
   * @tags 管理后台 - GBOM定义关联模块数据初始化获取树节点功能
   * @name getSeriesGBOMModules
   * @summary GBOM定义关联模块数据初始化获取树节点功能
   * @request POST:/cirpoint-module-api/seriesGBOM/getModuleTree
   * @secure
   */
  static getSeriesGBOMModuleTree = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/getModuleTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义获取子BOM节点的子节点ID
   *
   * @tags 管理后台 - GBOM定义获取子BOM节点的子节点ID
   * @name getSeriesGBOMModules
   * @summary GBOM定义获取子BOM节点的子节点ID
   * @request POST:/cirpoint-module-api/seriesGBOM/getModuleTree
   * @secure
   */
  static getSericesId = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/getSericesId`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义关联模块数据初始化获取模块数据功能
   *
   * @tags 管理后台 - GBOM定义关联模块数据初始化获取模块数据功能
   * @name findModelByCategoryId
   * @summary GBOM定义关联模块数据初始化获取模块数据功能
   * @request POST:/cirpoint-module-api/moduleinfos/findModelByCategoryId
   * @secure
   */
  static findModelByCategoryId = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/findModelByCategoryId.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义关联模块数据功能
   *
   * @tags 管理后台 - GBOM定义关联模块数据功能
   * @name associatedModules
   * @summary GBOM定义关联模块数据功能
   * @request POST:/cirpoint-module-api/moduleinfos/associatedModules
   * @secure
   */
  static associatedModules = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/associatedModules`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义参数定义获取参数初始化功能
   *
   * @tags 管理后台 - GBOM定义参数定义获取参数初始化功能
   * @name getParameterList
   * @summary GBOM定义参数定义获取参数初始化功能
   * @request POST:/cirpoint-module-api/seriesGBOM/getParameterList
   * @secure
   */
  static seriesGBOMGetParameterList = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/getParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义参数定义修改关键指标字段
   *
   * @tags 管理后台 - GBOM定义参数定义修改关键指标字段
   * @name seriesGBOMupdateKeyIndicators
   * @summary GBOM定义参数定义修改关键指标字段
   * @request POST:/cirpoint-module-api/seriesGBOM/updateKeyIndicators
   * @secure
   */
  static seriesGBOMupdateKeyIndicators = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/updateKeyIndicators`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义参数定义页面参数上下移动接口
   *
   * @tags 管理后台 - GBOM定义参数定义页面参数上下移动接口
   * @name seriesGBOMMove
   * @summary GBOM定义参数定义页面参数上下移动接口
   * @request POST:/cirpoint-module-api/seriesGBOM/move
   * @secure
   */
  static seriesGBOMMove = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/move`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义参数定义页面参数删除接口
   *
   * @tags 管理后台 - GBOM定义参数定义页面参数删除接口
   * @name seriesGBOMDel
   * @summary GBOM定义参数定义页面参数删除接口
   * @request POST:/cirpoint-module-api/seriesGBOM/delParameter
   * @secure
   */
  static seriesGBOMDel = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/delParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 修改参数定义中的参数接口
   *
   * @tags 管理后台 - 修改参数定义中的参数接口
   * @name seriesGBOMUpdateParameterInfo
   * @summary 修改参数定义中的参数接口
   * @request POST:/cirpoint-base-api/seriesGBOM/updateParameter
   * @secure
   */
  static seriesGBOMUpdateParameterInfo = <Req extends ProductPlatformParameterInfoUpdateDTOModel = ProductPlatformParameterInfoUpdateDTOModel>(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/updateParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM获取参数定义分类节点相关参数信息
   *
   * @tags 管理后台 - GBOM获取参数定义分类节点相关参数信息
   * @name seriesParameterGetParameterData
   * @summary GBOM获取参数定义分类节点相关参数信息
   * @request POST:/cirpoint-module-api/seriesParameter/getParameterData
   * @secure
   */
  static seriesParameterGetParameterData = <Req extends ProductSeriesParameterInfoRequestDTOModel = ProductSeriesParameterInfoRequestDTOModel>(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/getParameterData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM参数定义添加参数
   *
   * @tags 管理后台 - GBOM参数定义添加参数
   * @name seriesGBOMAddParameter
   * @summary GBOM参数定义添加参数
   * @request POST:/cirpoint-module-api/seriesGBOM/addParameter
   * @secure
   */
  static seriesGBOMAddParameter = <Req extends ProductSeriesGBOMModuleInfoDTOModel = ProductSeriesGBOMModuleInfoDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/addParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 项目管理获取项目信息
   *
   * @tags 管理后台 - 项目管理获取项目信息
   * @name getProductListByProId
   * @summary 项目管理获取项目信息
   * @request POST:/cirpoint-module-api/ckProjectInfo/getProductListByProId
   * @secure
   */
  static getProductListByProId = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getProductListByProId`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 项目管理获取项目信息
   *
   * @tags 管理后台 - 项目管理获取项目信息
   * @name getProductListByParentProId
   * @summary 项目管理获取项目信息
   * @request POST:/cirpoint-module-api/ckProjectInfo/getProductListByParentProId
   * @secure
   */
  static getProductListByParentProId = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getProductListByParentProId`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * Excel导出功能
   *
   * @tags 管理后台 - Excel导出功能
   * @name exportSeriesParameterList
   * @summary Excel导出功能
   * @request POST:/cirpoint-base-api/seriesParameter/export
   * @secure
   */
  static exportProjectInfoByProId = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/project/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * Excel导出功能
   *
   * @tags 管理后台 - Excel导出功能
   * @name exportProjectInfoByProIdAll
   * @summary Excel导出功能
   * @request POST:/cirpoint-base-api/seriesParameter/export
   * @secure
   */
  static exportProjectInfoByProIdAll = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/projectAll/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 编辑项目管理信息
   *
   * @tags 管理后台 - 编辑项目管理信息
   * @name updateProduct
   * @summary 编辑项目管理信息
   * @request POST:/cirpoint-module-api/ckProjectInfo/updateProduct
   * @secure
   */
  static updateProduct = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/updateProduct`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获取根节点示意图
   *
   * @tags 管理后台 - 获取根节点示意图
   * @name getPic
   * @summary 获取根节点示意图
   * @request POST:/cirpoint-module-api/ckProjectInfo/getProductListByProId
   * @secure
   */
  static getPic = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/getPic`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * GBOM定义获取右侧平台信息
   *
   * @tags 管理后台 - GBOM定义获取右侧平台信息
   * @name getSeries
   * @summary GBOM定义获取右侧平台信息
   * @request POST:/cirpoint-module-api/productLibrary/getSeries
   * @secure
   */
  static getSeries = <Req extends ProductPlatformParameterInfoRequestDTOModel = ProductPlatformParameterInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/getSeries`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   *顶层指标详情
   *
   * @tags 设计计划详情
   * @name seriesParameterGetParameterList
   * @request /cirpoint-module-api/seriesParameter/getParameterList
   * @secure
   */
  static ckSystemDesignCheckModule = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/checkModule`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static getModuleBack = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/moduleBack`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static updateApplicationType = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/updateApplicationType`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块管理树结构添加编辑删除
   *
   * @tags 管理后台 - 产品模块管理树结构添加编辑删除
   * @name addEmptyNodetoManagement
   * @summary 产品模块管理树结构添加编辑删除
   * @request POST:/cirpoint-base-api/syscate/addEmptyNodetoManagement
   * @secure
   */
  static addEmptyNodetoManagement = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-category/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块管理树结构添加编辑删除
   *
   * @tags 管理后台 - 产品模块管理树结构添加编辑删除
   * @name updateTreeNodetoManagement
   * @summary 产品模块管理树结构添加编辑删除
   * @request POST:/cirpoint-base-api/syscate/updateTreeNodetoManagement
   * @secure
   */
  static updateTreeNodetoManagement = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-category/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   * 产品模块管理树结构删除
   *
   * @tags 管理后台 - 产品模块管理树结构删除
   * @name delete
   * @summary 产品模块管理树结构删除
   * @request POST:/cirpoint-base-api/syscate/delete
   * @secure
   */
  static delTreeNodetoManagement = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-category/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   * 产品模块管理树结构移动
   *
   * @tags 管理后台 - 产品模块管理树结构移动
   * @name sortUp
   * @summary 产品模块管理树结构移动
   * @request POST:/business-service/business/library-category/sort/up
   * @secure
   */
  static sortUp = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-category/sort/up`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模块管理树结构移动
   *
   * @tags 管理后台 - 产品模块管理树结构移动
   * @name sortUp
   * @summary 产品模块管理树结构移动
   * @request POST:/business-service/business/library-category/sort/down
   * @secure
   */
  static sortDown = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-category/sort/down`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
  /**
   * 产品模块管理树结构列表
   *
   * @tags 管理后台 - 产品模块管理树结构列表
   * @name upDownSaveTreeKey
   * @summary 产品模块管理树结构列表
   * @request POST:/business-service/business/library-category/browseProductModuleTree
   * @secure
   */
  static browseProductModuleTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-category/browseProductModuleTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
