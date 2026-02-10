// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
/**
 * 产品规划
 */
export class AdminApiSystemCheckInfoApi {
  /**
   * 获取计算结构树数据
   *
   * @tags 获取计算结构树数据
   * @name getAllCheckTreeData
   * @request /cirpoint-base-api/checkTree/getAllCheckTreeData
   * @secure
   */
  static getAllCheckTreeData = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkTree/getAllCheckTreeData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 添加或修改结构树
   *
   * @tags 添加或修改结构树
   * @name checkSaveOrUpdate
   * @request /cirpoint-base-api/checkTree/saveOrUpdate
   * @secure
   */
  static checkSaveOrUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkTree/saveOrUpdate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取树节点详情
   *
   * @tags 获取树节点详情
   * @name checkTreeDetail
   * @request /cirpoint-base-api/checkTree/detail
   * @secure
   */
  static checkTreeDetail = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkTree/detail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 计算树排序
   *
   * @tags 计算树排序
   * @name checkTreeUpOrDownMove
   * @request /cirpoint-base-api/checkTree/upOrDownMove
   * @secure
   */
  static checkTreeUpOrDownMove = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkTree/upOrDownMove`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除计算树
   *
   * @tags 删除计算树
   * @name checkTreeDelete
   * @request /cirpoint-base-api/checkTree/delete
   * @secure
   */
  static checkTreeDelete = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkTree/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取计算图片列表
   *
   * @tags 获取计算图片列表
   * @name checkInfoCategoryList
   * @request /cirpoint-base-api/checkPageInfoNew/checkInfoCategoryList.json
   * @secure
   */
  static checkInfoCategoryList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageInfoNew/checkInfoCategoryList.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取计算页面
   *
   * @tags 获取计算页面
   * @name checkPageInfoNewPageList
   * @request /cirpoint-base-api/checkPageInfoNew/pageList
   * @secure
   */
  static checkPageInfoNewPageList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageInfoNew/pageList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 添加计算
   *
   * @tags 添加计算
   * @name checkPageInfoNewSaveOrUpdate
   * @request /cirpoint-base-api/checkPageInfoNew/saveOrUpdate
   * @secure
   */
  static checkPageInfoNewSaveOrUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageInfoNew/saveOrUpdate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除计算信息
   *
   * @tags 删除计算信息
   * @name checkPageInfoNewDeleteBatch
   * @request /cirpoint-base-api/checkPageInfoNew/deleteBatch
   * @secure
   */
  static checkPageInfoNewDeleteBatch = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageInfoNew/deleteBatch`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 添加计算参数
   *
   * @tags 添加计算参数
   * @name checkPageParamSavePageParam
   * @request /cirpoint-base-api/checkPageParam/checkPageParamSavePageParam
   * @secure
   */
  static checkPageParamSavePageParam = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageParam/savePageParam`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 查询参数
   *
   * @tags 查询参数
   * @name checkPageParamFindCheckPageParamList
   * @request /cirpoint-base-api/checkPageParam/checkPageParam/findCheckPageParamList
   * @secure
   */
  static checkPageParamFindCheckPageParamList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageParam/findCheckPageParamList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 添加表格
   *
   * @tags 添加表格
   * @name checkPageTableInfoNewSaveTable
   * @request /cirpoint-base-api/checkPageParam/checkPageTableInfoNew/saveTable
   * @secure
   */
  static checkPageTableInfoNewSaveTable = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageTableInfoNew/saveTable`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取关联参数详情
   *
   * @tags 获取关联参数详情
   * @name checkPageParamAssociationParamDetail
   * @request /cirpoint-base-api/checkPageParam/associationParamDetail
   * @secure
   */
  static checkPageParamAssociationParamDetail = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageParam/associationParamDetail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 查询表格基本信息
   *
   * @tags 查询表格基本信息
   * @name checkPageTableInfoNewFindTableInfo
   * @request /cirpoint-base-api/checkPageTableInfoNew/findTableInfo
   * @secure
   */
  static checkPageTableInfoNewFindTableInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageTableInfoNew/findTableInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 查询单元格信息
   *
   * @tags 查询单元格信息
   * @name checkPageTableInfoNewFindCellsInfo
   * @request /cirpoint-base-api/checkPageTableInfoNew/findCellsInfo
   * @secure
   */
  static checkPageTableInfoNewFindCellsInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageTableInfoNew/findCellsInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存列信息
   *
   * @tags 保存列信息
   * @name checkPageTableInfoNewUpdateTableCol
   * @request /cirpoint-base-api/checkPageTableInfoNew/updateTableCol
   * @secure
   */
  static checkPageTableInfoNewUpdateTableCol = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageTableInfoNew/updateTableCol`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除列信息
   *
   * @tags 删除列信息
   * @name checkPageTableInfoNewDeleteTableCol
   * @request /cirpoint-base-api/checkPageTableInfoNew/deleteTableCol
   * @secure
   */
  static checkPageTableInfoNewDeleteTableCol = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageTableInfoNew/deleteTableCol`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存单元格信息
   *
   * @tags 保存单元格信息
   * @name checkPageTableInfoNewUpdateCellInfo
   * @request /cirpoint-base-api/checkPageTableInfoNew/updateCellInfo
   * @secure
   */
  static checkPageTableInfoNewUpdateCellInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageTableInfoNew/updateCellInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 表格基本信息修改
   *
   * @tags 表格基本信息修改
   * @name checkPageTableInfoNewUpdateTable
   * @request /cirpoint-base-api/checkPageTableInfoNew/updateTable
   * @secure
   */
  static checkPageTableInfoNewUpdateTable = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageTableInfoNew/updateTable`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 参数排序功能
   *
   * @tags 参数排序功能
   * @name checkPageParamMoveSort
   * @request /cirpoint-base-api/checkPageParam/moveSort
   * @secure
   */
  static checkPageParamMoveSort = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageParam/moveSort`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 参数删除功能
   *
   * @tags 参数删除功能
   * @name checkPageParamdeletePageParam
   * @request /cirpoint-base-api/checkPageParam/deletePageParam
   * @secure
   */
  static checkPageParamdeletePageParam = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageParam/deletePageParam`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获取图片信息
   *
   * @tags 获取图片信息
   * @name checkPageImageGetlist
   * @request /cirpoint-base-api/checkPageImage/getlist
   * @secure
   */
  static checkPageImageGetlist = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageImage/getlist`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存图片信息
   *
   * @tags 保存图片信息
   * @name checkPageImageSaveOrUpdate
   * @request /cirpoint-base-api/checkPageImage/saveOrUpdate
   * @secure
   */
  static checkPageImageSaveOrUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageImage/saveOrUpdate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除图片信息
   *
   * @tags 删除图片信息
   * @name checkPageImageDeleteBatch
   * @request /cirpoint-base-api/checkPageImage/deleteBatch
   * @secure
   */
  static checkPageImageDeleteBatch = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageImage/deleteBatch`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取基本信息
   *
   * @tags 获取基本信息
   * @name checkPageInfoNewDetail
   * @request /cirpoint-base-api/checkPageInfoNew/detail
   * @secure
   */
  static checkPageInfoNewDetail = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageInfoNew/detail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存自定义页面路径功能
   *
   * @tags 保存自定义页面路径功能
   * @name checkPageInfoNewSaveCustomPageURL
   * @request /cirpoint-base-api/checkPageInfoNew/saveCustomPageURL
   * @secure
   */
  static checkPageInfoNewSaveCustomPageURL = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageInfoNew/saveCustomPageURL`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 复制页面保存功能
   *
   * @tags 复制页面保存功能
   * @name checkPageInfoNewCopyCheckPage
   * @request /cirpoint-base-api/checkPageInfoNew/copyCheckPage
   * @secure
   */
  static checkPageInfoNewCopyCheckPage = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageInfoNew/copyCheckPage`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 预览页面初始化功能
   *
   * @tags 预览页面初始化功能
   * @name checkPageParamPreviewCheckPageParamList
   * @request /cirpoint-base-api/checkPageParam/previewCheckPageParamList
   * @secure
   */
  static checkPageParamPreviewCheckPageParamList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageParam/previewCheckPageParamList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
