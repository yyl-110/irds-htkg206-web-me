// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from '../http-client';
import { ProdDesignPageRequestDTOModel } from '@/api/models/design/ProdDesignPageRequestDTOModel';
import { ProdDesignInfoRequestDTOModel } from '@/api/models/design/ProdDesignInfoRequestDTOModel';
import { ProjectPageRequestDTOModel } from '@/api/models/design/ProjectPageRequestDTOModel';
import { ProjectUserRequestDTOModel } from '@/api/models/design/ProjectUserRequestDTOModel';
import { ProjectPropRequestDTOModel } from '@/api/models/design/ProjectPropRequestDTOModel';
import { ProjectInfoRequestDTOModel } from '@/api/models/design/ProjectInfoRequestDTOModel';
import { ProjectTaskRequestDTOModel } from '@/api/models/design/ProjectTaskRequestDTOModel';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';

/**
 * 产品设计
 */
export class DesignApiInfo {
  /**
   * 平台列表获取
   *
   * @tags 平台列表获取
   * @name getSeriesApi
   * @summary 平台列表获取
   * @request /cirpoint-module-api/productLibrary/getSeries
   * @secure
   */
  static getSeriesApi = <Req extends ProdDesignPageRequestDTOModel = ProdDesignPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/productLibrary/getSeries`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 根据产品系列获取产品列表
   *
   * @tags 根据产品系列获取产品列表
   * @name getInfoPageApi
   * @summary 根据产品系列获取产品列表
   * @request /cirpoint-module-api/productLibrary/getSeries
   * @secure
   */
  static getInfoPageApi = <Req extends ProdDesignInfoRequestDTOModel = ProdDesignInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getInfoPage`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取项目列表
   *
   * @tags 获取项目列表
   * @name syncProjectApi
   * @summary 获取项目列表
   * @request /cirpoint-module-api/pdmSystem/syncProject
   * @secure
   */
  static syncProjectApi = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/syncProject`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取团队成员
   *
   * @tags 获取团队成员
   * @name sycnProjectUserApi
   * @summary获取团队成员
   * @request /cirpoint-module-api/pdmSystem/sycnProjectUser
   * @secure
   */
  static sycnProjectUserApi = <Req extends ProjectUserRequestDTOModel = ProjectUserRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/sycnProjectUser`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取项目参数列表
   *
   * @tags 获取项目参数列表
   * @name getSeriesParameterListApi
   * @request /cirpoint-module-api/seriesParameter/getParameterList
   * @secure
   */
  static getSeriesParameterListApi = <Req extends ProjectPropRequestDTOModel = ProjectPropRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/getParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存项目信息
   *
   * @tags 保存项目信息
   * @name addProjectApi
   * @request /cirpoint-module-api/ckProjectInfo/addProject
   * @secure
   */
  static addProjectApi = <Req extends ProjectInfoRequestDTOModel = ProjectInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/addProject`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 修改项目信息
   *
   * @tags  修改项目信息
   * @name updateProjectApi
   * @request /cirpoint-module-api/ckProjectInfo/updateProject
   * @secure
   */
  static updateProjectApi = <Req extends ProjectInfoRequestDTOModel = ProjectInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/updateProject`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 启动项目
   *
   * @tags 启动项目
   * @name startProjectApi
   * @request /cirpoint-module-api/ckProjectInfo/startProject
   * @secure
   */
  static startProjectApi = <Req extends ProdDesignPageRequestDTOModel = ProdDesignPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/startProject`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除项目
   *
   * @tags 删除项目
   * @name delProjectApi
   * @request /cirpoint-module-api/ckProjectInfo/delProject
   * @secure
   */
  static delProjectApi = <Req extends ProdDesignPageRequestDTOModel = ProdDesignPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/delProject`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *查看流程是否提交
   *
   * @tags 查看流程是否提交
   * @name whetherToSubmitApi
   * @request /cirpoint-module-api/ckSystemDesign/whetherToSubmit
   * @secure
   */
  static whetherToSubmitApi = <Req extends ProjectInfoRequestDTOModel = ProjectInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/whetherToSubmit`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *流程通用功能--流程资料
   *
   * @tags 流程通用功能--流程资料
   * @name getTaskInfoApi
   * @request /cirpoint-module-api/ckProjectInfo/getTaskInfo
   * @secure
   */
  static getTaskInfoApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getTaskInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *流程通用功能--流程资料
   *
   * @tags 流程通用功能--流程资料
   * @name getDataDetailApi
   * @request /cirpoint-module-api/projectFile/getDataDetail
   * @secure
   */
  static getDataDetailApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getDataDetail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *流程通用功能--流程资料
   *
   * @tags 流程通用功能--流程资料
   * @name uploadPDMFileLogApi
   * @request /cirpoint-module-api/ckProjectInfo/uploadPDMFileLog
   * @secure
   */
  static uploadPDMFileLogApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/uploadPDMFileLog`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *获取任务流程数据
   *
   * @tags 获取任务流程数据
   * @name getFakeDataApi
   * @request /cirpoint-module-api/projectFile/getFakeData
   * @secure
   */
  static getFakeDataApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getFakeData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *项目资料定义
   *
   * @tags 项目资料定义
   * @name addDataProjectApi
   * @request /cirpoint-module-api/projectFile/addData
   * @secure
   */
  static addDataProjectApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *流程通用功能--标记保存
   *
   * @tags 流程通用功能--标记保存
   * @name taskPageSaveMarApi
   * @request /cirpoint-module-api/ckSystemDesign/taskPageSaveMark
   * @secure
   */
  static taskPageSaveMarApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/taskPageSaveMark`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *设计计划定义
   *
   * @tags 设计计划定义
   * @name addDesignPlanApi
   * @request /cirpoint-module-api/projectFile/addDesignPlan
   * @secure
   */
  static addDesignPlanApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addDesignPlan`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *设计计划详情
   *
   * @tags 设计计划详情
   * @name getDesignPlanDetailApi
   * @request /cirpoint-module-api/projectFile/getDesignPlanDetail
   * @secure
   */
  static getDesignPlanDetailApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getDesignPlanDetail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *定义项目参数值
   *
   * @tags 定义项目参数值
   * @name defineProjectParameterApi
   * @request /cirpoint-module-api/projectFile/getDesignPlanDetail
   * @secure
   */
  static defineProjectParameterApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/defineProjectParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *获取任务详情
   *
   * @tags 获取任务详情
   * @name getDetailProjectApi
   * @request /cirpoint-module-api/projectFile/getDetailProject
   * @secure
   */
  static getDetailProjectApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getDetailProject`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *页面未关联时调用接口地址
   *
   * @tags 页面未关联时调用接口地址
   * @name getComplianceApi
   * @request /cirpoint-module-api/ckProjectInfo/getCompliance
   * @secure
   */
  static getComplianceApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getCompliance`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *页面未关联时调用接口地址
   *
   * @tags 页面未关联时调用接口地址
   * @name addEquipmentApi
   * @request /cirpoint-module-api/projectFile/addEquipment
   * @secure
   */
  static addEquipmentApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addEquipment`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *流程通用功能--布置详情
   *
   * @tags 流程通用功能--布置详情
   * @name getFlatCutDetailApi
   * @request /cirpoint-module-api/projectFile/addEquipment
   * @secure
   */
  static getFlatCutDetailApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getFlatCutDetail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *流程通用功能--提交
   *
   * @tags 流程通用功能--提交
   * @name taskSubmitApi
   * @request /cirpoint-module-api/projectFile/addEquipment
   * @secure
   */
  static taskSubmitApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/taskSubmit`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *流程通用功能--提交
   *
   * @tags 流程通用功能--提交
   * @name taskSubmitApi
   * @request /cirpoint-module-api/pdmSystem/getURL
   * @secure
   */
  static getURLApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/getURL`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *顶层指标详情
   *
   * @tags 设计计划详情
   * @name seriesParameterGetParameterList
   * @request /cirpoint-module-api/seriesParameter/getParameterList
   * @secure
   */
  static seriesParameterGetParameterList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesParameter/getParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *顶层指标详情
   *
   * @tags 设计计划详情
   * @name seriesParameterGetParameterList
   * @request /cirpoint-module-api/seriesParameter/getParameterList
   * @secure
   */
  static ckSystemDesignGetTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/getTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static queryModuleList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/queryModuleList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  static setOperationalModel = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/setOperationalModel.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static findModuleInfoDetailedById = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/findModuleInfoDetailedById.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static pdmSystemSyncBOM = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/syncBOM`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static findAllModuleAttachment = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/findAllModuleAttachment.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static querySysConfigList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/querySysConfigList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *顶层指标详情
   *
   * @tags 设计计划详情
   * @name projectFileGetDetailProject
   * @request /cirpoint-module-api/seriesParameter/getParameterList
   * @secure
   */
  static projectFileGetDetailProject = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getDetailProject`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *流程通用功能--布置详情
   *
   * @tags 流程通用功能--布置详情
   * @name projectFileGetIllustrateDetail
   * @request /cirpoint-module-api/projectFile/getIllustrateDetail
   * @secure
   */
  static projectFileGetIllustrateDetail = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getIllustrateDetail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *流程通用功能--添加上传文件
   *
   * @tags 流程通用功能--添加上传文件
   * @name addFileListApi
   * @request /cirpoint-module-api/projectFile/addFileList
   * @secure
   */
  static addFileListApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addFileList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *顶层指标详情
   *
   * @tags 设计计划详情
   * @name ckSystemDesignGetDefSysParameterList
   * @request /cirpoint-module-api/seriesParameter/getParameterList
   * @secure
   */
  static ckSystemDesignGetDefSysParameterList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/getDefSysParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *顶层指标详情
   *
   * @tags 设计计划详情
   * @name seriesGBOMGetParameterList
   * @request /cirpoint-module-api/seriesParameter/getParameterList
   * @secure
   */
  static seriesGBOMGetParameterList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/getParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *删除pdf文件
   *
   * @tags 删除pdf文件
   * @name savePdmFileInfoApi
   * @request /cirpoint-module-api/pdmSystem/savePdmFileInfo
   * @secure
   */
  static savePdmFileInfoApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/savePdmFileInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *系统功能配置列表数据
   *
   * @tags 系统功能配置列表数据
   * @name getProjectBOMApi
   * @request /cirpoint-module-api/projectFile/getProjectBOM
   * @secure
   */
  static getProjectBOMApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getProjectBOM`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *系统功能配置列表数据
   *
   * @tags 系统功能配置列表数据
   * @name setVersionBeenReadApi
   * @request /cirpoint-module-api/ckSystemDesign/setVersionBeenRead
   * @secure
   */
  static setVersionBeenReadApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/setVersionBeenRead`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *input是否符合规则
   *
   * @tags input是否符合规则
   * @name checkProjectParameterApi
   * @request /cirpoint-module-api/ckProjectInfo/checkProjectParameter
   * @secure
   */
  static checkProjectParameterApi = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/checkProjectParameter`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 导出顶层规则
   *
   * @tags 管理后台 - 导出顶层规则
   * @name ckProjectexportDataApi
   * @summary 导出顶层规则
   * @request POST:/cirpoint-module-api/ckProjectInfo/export
   * @secure
   */
  static ckProjectexportDataApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取选择平断面库回显
   *
   * @tags 获取选择平断面库回显
   * @name callBackApi
   * @summary 获取选择平断面库回显
   * @request POST:/cirpoint-module-api/projectFile/callBack
   * @secure
   */
  static callBackApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/callBack`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取选择平断面库树
   *
   * @tags 获取选择平断面库树
   * @name getDelDataApi
   * @summary 获取选择平断面库树
   * @request POST:/cirpoint-module-api/projectFile/getDelData
   * @secure
   */
  static getDelDataApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/getDelData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 选择平断面库树
   *
   * @tags 选择平断面库树
   * @name addFlatCutApi
   * @summary 选择平断面库树
   * @request POST:/cirpoint-module-api/projectFile/addFlatCut
   * @secure
   */
  static addFlatCutApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addFlatCut`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 流程通用功能--删除pdf关联文件
   *
   * @tags 管理后台 - 流程通用功能--删除pdf关联文件
   * @name deleteImageCancelAssApi
   * @summary 流程通用功能--删除pdf关联文件
   * @request POST:/cirpoint-module-api/projectFile/deleteImageCancelAss
   * @secure
   */
  static deleteImageCancelAssApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/deleteImageCancelAss`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 确定系统功能配置列表数据
   *
   * @tags 确定系统功能配置列表数据
   * @name bomBackApi
   * @summary 确定系统功能配置列表数据
   * @request POST:/cirpoint-module-api/projectFile/bomBack
   * @secure
   */
  static bomBackApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/bomBack`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取系列gbom定义
   *
   * @tags 获取系列gbom定义
   * @name getSeriesGBOMApi
   * @summary 获取系列gbom定义
   * @request POST:/cirpoint-module-api/seriesGBOM/getSeriesGBOM
   * @secure
   */
  static getSeriesGBOMApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/getSeriesGBOM`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获取系列gbom定义
   *
   * @tags 获取系列gbom定义
   * @name addProjectBOMApi
   * @summary 获取系列gbom定义
   * @request POST:/cirpoint-module-api/projectFile/addProjectBOM
   * @secure
   */
  static addProjectBOMApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addProjectBOM`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 导出顶层规则
   *
   * @tags 管理后台 - 导出顶层规则
   * @name getExportAllTaskApi
   * @summary 导出顶层规则
   * @request POST:/cirpoint-module-api/projectFile/exportAllTask
   * @secure
   */
  static getExportAllTaskApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/exportAllTask`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static exportTaskInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/exportTaskInfo`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static getDefinition = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/getDefinition`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static backIds = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/backIds`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static auditLibraryGetTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/getTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static auditLibraryGetDataList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/getDataList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static ckSystemDesignDefinition = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/definition`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static ckSystemDesignUpdateTime = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/updateTime`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static getDefSysParameterList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/getDefSysParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 确定设计说明
   *
   * @tags 管理后台 - 确定设计说明
   * @name addDocumentApi
   * @summary 确定设计说明
   * @request POST:/cirpoint-module-api/projectFile/addDocument
   * @secure
   */
  static addDocumentApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addDocument`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 确定任务负责人
   *
   * @tags 管理后台 - 确定任务负责人
   * @name addHeadApi
   * @summary 确定任务负责人
   * @request POST:/cirpoint-module-api/projectFile/addHead
   * @secure
   */
  static addHeadApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addHead`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static ckSystemDesignAddHead = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/addHead`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计任务开始时间定义
   *
   * @tags 管理后台 - 设计任务开始时间定义
   * @name addStartTimeApi
   * @summary 设计任务开始时间定义
   * @request POST:/cirpoint-module-api/projectFile/addStartTime
   * @secure
   */
  static addStartTimeApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addStartTime`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计任务开始时间定义
   *
   * @tags 管理后台 - 设计任务开始时间定义
   * @name addStartTimeApi
   * @summary 设计任务开始时间定义
   * @request POST:/cirpoint-module-api/projectFile/addStartTime
   * @secure
   */
  static ckSystemDesignAddStartTimeApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/addStartTime`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计任务结束时间定义
   *
   * @tags 管理后台 - 设计任务结束时间定义
   * @name addEndTimeApi
   * @summary 设计任务结束时间定义
   * @request POST:/cirpoint-module-api/projectFile/addEndTime
   * @secure
   */
  static addEndTimeApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/addEndTime`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计任务结束时间定义
   *
   * @tags 管理后台 - 设计任务结束时间定义
   * @name addEndTimeApi
   * @summary 设计任务结束时间定义
   * @request POST:/cirpoint-module-api/projectFile/addEndTime
   * @secure
   */
  static ckSystemDesignAddEndTimeApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/addEndTime`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计任务开始
   *
   * @tags 管理后台 - 设计任务开始
   * @name sendTaskApi
   * @summary 设计任务开始
   * @request POST:/cirpoint-module-api/projectFile/sendTask
   * @secure
   */
  static sendTaskApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/sendTask`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计任务开始
   *
   * @tags 管理后台 - 设计任务开始
   * @name sendTaskApi
   * @summary 设计任务开始
   * @request POST:/cirpoint-module-api/projectFile/sendTask
   * @secure
   */
  static ckSystemDesignSendTaskApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/sendTask`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static defSysParameterSubmit = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/defSysParameterSubmit`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static ckSystemDesignSysConfigSubmit = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/sysConfigSubmit`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 页面未关联时调用接口地址
   *
   * @tags 管理后台 - 页面未关联时调用接口地址
   * @name getProjectVersionInfoApi
   * @summary 页面未关联时调用接口地址
   * @request POST:/cirpoint-module-api/ckProjectInfo/getProjectVersionInfo
   * @secure
   */
  static getProjectVersionInfoApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getProjectVersionInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 流程通用功能--更新时间
   *
   * @tags 管理后台 - 流程通用功能--更新时间
   * @name updateTimeApi
   * @summary 流程通用功能--更新时间
   * @request POST:/cirpoint-module-api/projectFile/updateTime
   * @secure
   */
  static updateTimeApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/updateTime`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 流程通用功能--第三轮设计详情
   *
   * @tags 管理后台 - 流程通用功能--第三轮设计详情
   * @name updateTimeApi
   * @summary 流程通用功能--第三轮设计详情
   * @request POST:/cirpoint-module-api/ckSystemDesign/getDesignInputDetail
   * @secure
   */
  static getEnDesignInputDetailApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/getDesignInputDetail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 流程通用功能--第三轮设计详情
   *
   * @tags 管理后台 - 流程通用功能--第三轮设计详情
   * @name getAuditDataApi
   * @summary 流程通用功能--第三轮设计详情
   * @request POST:/cirpoint-module-api/designer/getAuditData
   * @secure
   */
  static getAuditDataApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/designer/getAuditData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 流程通用功能--设计任务开始
   *
   * @tags 管理后台 - 流程通用功能--设计任务开始
   * @name getDefSysParameterListApi
   * @summary 流程通用功能--设计任务开始
   * @request POST:/cirpoint-module-api/ckSystemDesign/getDefSysParameterList
   * @secure
   */
  static getDefSysParameterListApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/getDefSysParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 流程通用功能--获取gbom参数定义
   *
   * @tags 管理后台 - 流程通用功能--获取gbom参数定义
   * @name getDefSysParameterListApi
   * @summary 流程通用功能--获取gbom参数定义
   * @request POST:/cirpoint-module-api/seriesGBOM/getParameterList
   * @secure
   */
  static getGbomParameterListApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/seriesGBOM/getParameterList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 系统设计--模块清单--查询列表
   *
   * @tags 管理后台 - 系统设计--模块清单--查询列表
   * @name enqueryModuleListApi
   * @summary 系统设计--模块清单--查询列表
   * @request POST:/cirpoint-module-api/ckSystemDesign/queryModuleList
   * @secure
   */
  static enqueryModuleListApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckSystemDesign/queryModuleList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 页面未关联时调用接口地址
   *
   * @tags 管理后台 - 页面未关联时调用接口地址
   * @name enqueryModuleListApi
   * @summary 页面未关联时调用接口地址
   * @request POST:/cirpoint-module-api/ckProjectInfo/awareOfIt
   * @secure
   */
  static awareOfItApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/awareOfIt`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 页prt 调用申请件号
   *
   * @tags 管理后台 - prt 调用申请件号
   * @name getBomNewNumberApi
   * @summary prt 调用申请件号
   * @request POST:/cirpoint-module-api/moduleinfos/getBomNewNumber
   * @secure
   */
  static getBomNewNumberApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getBomNewNumber`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获取模型结构树接口
   *
   * @tags 管理后台 - 获取模型结构树接口
   * @name getBomInfoTestApi
   * @summary 获取模型结构树接口
   * @request POST:/cirpoint-module-api/moduleinfos/getBomInfo
   * @secure
   */
  static getBomInfoTestApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getBomInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 管理后台 -
   * @name getBomInfoTestApi
   * @summary
   * @request POST:/cirpoint-base-api/fileManagerController/getPdfPreviewPath.json
   * @secure
   */
  static getPdfPreviewPath = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/fileManagerController/getPdfPreviewPath.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 管理后台 -
   * @name commitContentApi
   * @summary
   * @request POST:/cirpoint-module-api/designer/commitContent
   * @secure
   */
  static commitContentApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/designer/commitContent`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   *
   *
   * @tags 管理后台 -
   * @name updateAuditExplainApi
   * @summary
   * @request POST:/cirpoint-module-api/designer/updateAuditExplain
   * @secure
   */
  static updateAuditExplainApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/designer/updateAuditExplain`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 产品设计 - 交付清单
   * @name ckProjectDeliveryApi
   * @summary
   * @request POST:/cirpoint-module-api/ckProjectDelivery/getDeliveryTree
   * @secure
   */
  static ckProjectDeliveryApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectDelivery/getDeliveryTree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   *
   *
   * @tags 产品设计 交付清单附件查询
   * @name ckProjectDeliveryApi
   * @summary
   * @request POST:/cirpoint-module-api/ckProjectDelivery/getDeliveryTree
   * @secure
   */
  static getDeliveryFileApi = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectDelivery/getDeliveryFile`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 导出计划
   *
   * @tags 管理后台 - 导出计划
   * @name planTaskExcelExport
   * @summary 导出计划
   * @request POST:/cirpoint-demand-api/product-plan-task/export
   * @secure
   */
  static exportDeliveryApi = <
    Req extends { projectId: number; taskName: String } = {
      projectId: number;
      taskName: String;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectDelivery/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
