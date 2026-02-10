// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from "../http-client";
import { ModuleMenuPageRequestDTOModel } from "@/api/models/module/ModuleMenuPageRequestDTOModel";
import { CommonResultListDeptResponseDTOModel } from "../../models/CommonResultListDeptResponseDTOModel";
import { DesignInfoRequestDTOModel } from "@/api/models/designcheck/DesignInfoRequestDTOModel";
import { ModuleTypeRequestDTOModel } from "@/api/models/module/ModuleTypeRequestDTOModel";
import {
  ModuleMenuAddRequestDTOModel,
  ModuleimgdeleteRequestDTOModel,
} from "@/api/models/module/ModuleMenuAddRequestDTOModel";
import { parameterDictionaryRequestDTOModel } from "@/api/models/module/ModuleTypeRequestDTOModel";
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
   * @request cirpoint-base-api/powerAuth/browseTopModuleTree
   * @secure
   */
  static getModuleMenuList = <
    Req extends ModuleMenuPageRequestDTOModel = ModuleMenuPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `cirpoint-base-api/powerAuth/browseTopModuleTree`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 参数字典查询
   *
   * @tags 参数字典查询
   * @name getTempalteParaInfoList
   * @summary 参数字典查询
   * @request cirpoint-base-api/powerAuth/browseTopModuleTree
   * @secure
   */
  static getTempalteParaInfoList = <
    Req extends
      parameterDictionaryRequestDTOModel = parameterDictionaryRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `cirpoint-base-api/tempalteinfo/getTempalteParaInfoList.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 模块库分类图片列表查询
   *
   * @tags 模块库分类图片列表查询
   * @name getCategpryImgListById
   * @summary 模块库分类图片列表查询
   * @request /cirpoint-base-api/syscate/queryClassificationNode.json
   * @secure
   */
  static getCategpryImgListById = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/syscate/queryClassificationNode.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 模块库表头列表查询
   *
   * @tags 模块库表头列表查询
   * @name preciseQueryModuleLibrary
   * @summary 模块库表头列表查询
   * @request /cirpoint-module-api/moduleinfos/preciseQueryModuleLibrary.json
   * @secure
   */
  static preciseQueryModuleLibrary = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/preciseQueryModuleLibrary.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 模块库模糊查询
   *
   * @tags 模块库模糊查询
   * @name moduleDataScreening
   * @summary 模块库模糊查询
   * @request /cirpoint-module-api/moduleinfos/moduleDataScreening
   * @secure
   */
  static moduleDataScreening = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/moduleDataScreening`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 模块库列表查询
   *
   * @tags 模块库列表查询
   * @name findCurrentModuleInfoByCategoryId
   * @summary 模块库列表查询
   * @request /cirpoint-module-api/moduleinfos/findCurrentModuleInfoByCategoryId.json
   * @secure
   */
  static findCurrentModuleInfoByCategoryId = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/findCurrentModuleInfoByCategoryId.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags
   * @name queryClassificationNode
   * @summary
   * @request /cirpoint-base-api/syscate/queryClassificationNode.json
   * @secure
   */
  static queryClassificationNode = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/syscate/queryClassificationNode.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *获取对应的列数据
   *
   * @tags 获取对应的列数据
   * @name getModuleColumnData
   * @summary 获取对应的列数据
   * @request /cirpoint-module-api/moduleinfos/getModuleColumnData
   * @secure
   */
  static getModuleColumnData = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getModuleColumnData`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 获取详情数据
   * @name findModuleInfoDetailedById
   * @summary 获取详情数据
   * @request /cirpoint-module-api/moduleinfos/findModuleInfoDetailedById.json
   * @secure
   */
  static findModuleInfoDetailedById = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/findModuleInfoDetailedById.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 通过平台集合获取系列数据
   * @name getChildrenLists
   * @summary 通过平台集合获取系列数据
   * @request /cirpoint-module-api/productLibrary/getChildrenLists
   * @secure
   */
  static getChildrenLists = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/getChildrenLists`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 获取项目编号
   * @name syncProject
   * @summary 获取项目编号
   * @request /cirpoint-module-api/productLibrary/getChildrenLists
   * @secure
   */
  static syncProject = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/syncProject`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 获取系列
   * @name getPlatform
   * @summary 获取系列
   * @request /cirpoint-module-api/productLibrary/getPlatform
   * @secure
   */
  static getPlatform = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/getPlatform`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 编辑产品平台库树
   * @name getTreeList
   * @summary 编辑产品平台库树
   * @request /cirpoint-module-api/pdm/getTreeList
   * @secure
   */
  static getTreeList = <
    Req extends ModuleTypeRequestDTOModel = ModuleTypeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdm/getTreeList`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 图片上传
   * @name saveSinglePicture
   * @summary 图片上传
   * @request /cirpoint-module-api/moduleinfos/saveSinglePicture.json
   * @secure
   */
  static saveSinglePicture = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/saveSinglePicture.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 图片删除
   * @name deleteSinglePicture
   * @summary 图片删除
   * @request /cirpoint-module-api/moduleinfos/deleteSinglePicture.json
   * @secure
   */
  static deleteSinglePicture = <
    Req extends { pictureIdList: any } = { pictureIdList: any },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/deleteSinglePicture.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 文件删除
   * @name deleteModuleAttachmentByModuleId
   * @summary 文件删除
   * @request /cirpoint-module-api/moduleinfos/deleteModuleAttachmentByModuleId.json
   * @secure
   */
  static deleteModuleAttachmentByModuleId = <
    Req extends ModuleimgdeleteRequestDTOModel = ModuleimgdeleteRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/deleteModuleAttachmentByModuleId.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 模块库添加数据
   * @name moduleInfoSave
   * @summary 模块库添加数据
   * @request /cirpoint-module-api/moduleinfos/moduleInfoSave.json
   * @secure
   */
  static moduleInfoSave = <
    Req extends ModuleMenuAddRequestDTOModel = ModuleMenuAddRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/moduleInfoSave.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 模块库编辑数据
   * @name moduleInfoSave
   * @summary 模块库编辑数据
   * @request /cirpoint-module-api/moduleinfos/moduleInfoUpdate.json
   * @secure
   */
  static moduleInfoUpdate = <
    Req extends ModuleMenuAddRequestDTOModel = ModuleMenuAddRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/moduleInfoUpdate.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 模块库删除数据
   * @name moduleInfoSave
   * @summary 模块库删除数据
   * @request /cirpoint-module-api/moduleinfos/moduleInfoUpdate.json
   * @secure
   */
  static batchDeleteModuleInfo = <
    Req extends ModuleimgdeleteRequestDTOModel = ModuleimgdeleteRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/batchDeleteModuleInfo.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 关联PDM文件
   * @name moduleInfoSave
   * @summary 关联PDM文件
   * @request /cirpoint-module-api/moduleinfos/pdmAssociatedDoc
   * @secure
   */
  static pdmAssociatedDoc = <
    Req extends { docNum: string; moduleNum: string } = {
      docNum: string;
      moduleNum: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/pdmAssociatedDoc`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 添加数据时pdm构型码调用接口获取
   * @name moduleInfoSave
   * @summary 添加数据时pdm构型码调用接口获取
   * @request /cirpoint-module-api/moduleinfos/getCategoryPdmType
   * @secure
   */
  static getCategoryPdmType = <
    Req extends { docNum: string; moduleNum: string } = {
      docNum: string;
      moduleNum: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getCategoryPdmType`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  // ----------------------属性管理--------------------------

  /**
   *
   *
   * @tags 查询属性管理列
   * @name moduleInfoSave
   * @summary 查询属性管理列
   * @request /cirpoint-module-api/moduleinfos/findModuleProperty.json
   * @secure
   */
  static findModuleProperty = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/findModuleProperty.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 属性管理保存列
   * @name moduleInfoSave
   * @summary 属性管理保存列
   * @request /cirpoint-module-api/moduleinfos/updateModuleProperty.json
   * @secure
   */
  static updateModuleProperty = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/updateModuleProperty.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 属性管理删除列
   * @name moduleInfoSave
   * @summary 属性管理删除列
   * @request /cirpoint-module-api/moduleinfos/batchDeleteModuleProperty.json
   * @secure
   */
  static batchDeleteModuleProperty = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/batchDeleteModuleProperty.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 属性管理导入
   * @name moduleInfoSave
   * @summary 属性管理导入
   * @request /cirpoint-module-api/moduleinfos/ImportingConfigurationColumnsNew.json
   * @secure
   */
  static ImportingConfigurationColumnsNew = (
    query: any,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/ImportingConfigurationColumnsNew.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 数据管理导出
   * @name moduleInfoSave
   * @summary 数据管理导出
   * @request /cirpoint-module-api/moduleinfos/moduleLibraryExportData
   * @secure
   */
  static exportModuleLibraryApi = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/moduleLibraryExportData`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 列宽保存
   * @name columnWidthSave
   * @summary 列宽保存
   * @request /cirpoint-module-api/moduleinfos/columnWidthSave.json
   * @secure
   */
  static columnWidthSave = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/columnWidthSave.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 比较数据
   * @name moduleDataComparison
   * @summary 比较数据
   * @request /cirpoint-module-api/moduleinfos/moduleDataComparison.json
   * @secure
   */
  static moduleDataComparison = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/moduleDataComparison.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 获取雷达图数据
   * @name moduleRadarDataMapApi
   * @summary 获取雷达图数据
   * @request /cirpoint-module-api/moduleinfos/moduleRadarDataMap
   * @secure
   */
  static moduleRadarDataMapApi = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/moduleRadarDataMap`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 导出模块库数据管理模版
   * @name createModuleLibraryTemplateApi
   * @summary 导出模块库数据管理模版
   * @request /cirpoint-module-api/moduleinfos/createModuleLibraryTemplate
   * @secure
   */
  static createModuleLibraryTemplateApi = (
    query: any,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/createModuleLibraryTemplate`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 导出模块库模版
   * @name importingModelInformationNew
   * @summary 导出模块库模版
   * @request /cirpoint-module-api/moduleinfos/importingModelInformationNew.json
   * @secure
   */
  static importingModelInformationNew = (
    query: any,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/importingModelInformationNew.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 模块库抽屉详情
   * @name getPdmModuleNumDetailed
   * @summary 模块库抽屉详情
   * @request /cirpoint-module-api/moduleinfos/getPdmModuleNumDetailed.json
   * @secure
   */
  static getPdmModuleNumDetailed = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getPdmModuleNumDetailed.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 模块库抽屉详情
   * @name getModuleUserUploadDocument
   * @summary 模块库抽屉详情
   * @request /cirpoint-module-api/moduleinfos/getModuleUserUploadDocument
   * @secure
   */
  static getModuleUserUploadDocument = (
    query: any,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getModuleUserUploadDocument`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 获取PDM上传
   * @name getPdmDocument
   * @summary 获取PDM上传
   * @request /cirpoint-module-api/moduleinfos/getPdmDocument
   * @secure
   */
  static getPdmDocument = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getPdmDocument`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags
   * @name krAttribute
   * @summary
   * @request /cirpoint-module-api/moduleinfos/krAttribute.json
   * @secure
   */
  static krAttribute = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/krAttribute.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags
   * @name findParametricDesign
   * @summary
   * @request /cirpoint-module-api/moduleinfos/findParametricDesign.json
   * @secure
   */
  static findParametricDesign = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/findParametricDesign.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 模块库物料码gbom
   * @name findParametricDesign
   * @summary 模块库物料码gbom
   * @request /cirpoint-module-api/pdmSystem/syncBOM
   * @secure
   */
  static syncBOMApi = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/syncBOM`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 跳转链接
   * @name getURLApi
   * @summary 跳转链接
   * @request /cirpoint-module-api/pdmSystem/getURL
   * @secure
   */
  static getURLApi = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/getURL`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
