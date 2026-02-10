// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
/**
 * 计算流程后台
 */
export class AdminApiSystemCheckFlowInfoApi {
  /**
   * 获取计算流程列表数据
   *
   * @tags 获取计算流程列表数据
   * @name actDesignList
   * @request /cirpoint-flowable-work-api/flowable/definition/ActDesign/list
   * @secure
   */
  static actDesignList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/definition/ActDesign/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取计算流程列表数据
   *
   * @tags 获取计算流程列表数据
   * @name actDesignList
   * @request /cirpoint-flowable-work-api/flowable/task/ActDesign/update
   * @secure
   */
  static ActDesignUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/task/ActDesign/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 上传封面图
   *
   * @tags 上传封面图
   * @name ActDesignSetCoverImage
   * @request /cirpoint-flowable-work-api/flowable/task/ActDesign/setCoverImage
   * @secure
   */
  static ActDesignSetCoverImage = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/task/ActDesign/setCoverImage`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static deleteActDesign = <
    Req extends {
      id: string;
    } = {
      id: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/definition/ActDesign/` + query.id,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取流程树节点
   *
   * @tags 获取流程树节点
   * @name checkGetAllCheckTreeData
   * @request /cirpoint-flowable-work-api/flowable/check/getAllCheckTreeData
   * @secure
   */
  static checkGetAllCheckTreeData = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/check/getAllCheckTreeData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取计算任务列表功能
   *
   * @tags 获取计算任务列表功能
   * @name checkGetAllActDesignData
   * @request /cirpoint-flowable-work-api/flowable/check/getAllActDesignData
   * @secure
   */
  static checkGetAllActDesignData = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/check/getAllActDesignData`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取历史计算任务列表功能
   *
   * @tags 获取历史计算任务列表功能
   * @name allTasksForDefinitionProcess
   * @request /cirpoint-flowable-work-api/flowable/task/allTasksForDefinitionProcess
   * @secure
   */
  static allTasksForDefinitionProcess = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/task/allTasksForDefinitionProcess`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取历史计算任务列表功能
   *
   * @tags 获取历史计算任务列表功能
   * @name getCalculateList
   * @request /cirpoint-base-api/checkPageCalculate/getCalculateList
   * @secure
   */
  static getCalculateList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/getCalculateList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 查看编号是否重复
   *
   * @tags 查看编号是否重复
   * @name checkIdentificationUnique
   * @request /cirpoint-base-api/checkPageCalculate/checkIdentificationUnique
   * @secure
   */
  static checkIdentificationUnique = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/checkIdentificationUnique`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除历史流程
   *
   * @tags 删除历史流程
   * @name deleteCheckPageCalculates
   * @request /cirpoint-base-api/checkPageCalculate/deleteCheckPageCalculates
   * @secure
   */
  static deleteCheckPageCalculates = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/deleteCheckPageCalculates`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 实例化新流程信息
   *
   * @tags 实例化新流程信息
   * @name saveOrUpdateCalculate
   * @request /cirpoint-base-api/checkPageCalculate/saveOrUpdateCalculate
   * @secure
   */
  static saveOrUpdateCalculate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/saveOrUpdateCalculate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 数据更新
   *
   * @tags 数据更新
   * @name updateCalculateProjectState
   * @request /cirpoint-base-api/checkPageCalculate/updateCalculateProjectState
   * @secure
   */
  static updateCalculateProjectState = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/updateCalculateProjectState`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 查看编号是否重复
   *
   * @tags 查看编号是否重复
   * @name getCalculateResultStatus
   * @request /cirpoint-base-api/checkPageCalculate/getCalculateResultStatus
   * @secure
   */
  static getCalculateResultStatus = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/getCalculateResultStatus`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取参数信息
   *
   * @tags 获取参数信息
   * @name getCalculateParamList
   * @request /cirpoint-base-api/checkPageCalculate/getCalculateParamList
   * @secure
   */
  static getCalculateParamList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/getCalculateParamList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取参数信息
   *
   * @tags 获取参数信息
   * @name getAssociationParameters
   * @request /cirpoint-base-api/checkPageCalculate/getAssociationParameters
   * @secure
   */
  static getAssociationParameters = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/getAssociationParameters`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取参数信息
   *
   * @tags 获取参数信息
   * @name updateCheckCalculateResultStatus
   * @request /cirpoint-base-api/checkPageCalculate/updateCheckCalculateResultStatus
   * @secure
   */
  static updateCheckCalculateResultStatus = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/updateCheckCalculateResultStatus`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获取参数信息
   *
   * @tags 获取参数信息
   * @name saveOrUpdateCalculateParamList
   * @request /cirpoint-base-api/checkPageCalculate/saveOrUpdateCalculateParamList
   * @secure
   */
  static saveOrUpdateCalculateParamList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/saveOrUpdateCalculateParamList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取参数信息
   *
   * @tags 获取参数信息
   * @name updateAllPageCalculateParamList
   * @request /cirpoint-base-api/checkPageCalculate/updateAllPageCalculateParamList
   * @secure
   */
  static updateAllPageCalculateParamList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/updateAllPageCalculateParamList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 计算功能
   *
   * @tags 计算功能
   * @name calculate
   * @request /cirpoint-base-api/checkPageCalculate/calculate
   * @secure
   */
  static calculate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/calculate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 导出报告
   *
   * @tags 导出报告
   * @name expTemplateReports
   * @request /cirpoint-base-api/iosa/export
   * @secure
   */
  static expTemplateReports = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/checkPageCalculate/export`,
        method: 'POST',
        body: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 保存计算表单
   *
   * @tags 保存计算表单
   * @name saveflowable
   * @request /cirpoint-flowable-work-api/flowable/definition/save
   * @secure
   */
  static saveflowable = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/definition/save`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 查看流程图
   *
   * @tags 查看流程图
   * @name flowXmlAndNode
   * @request /cirpoint-flowable-work-api/flowable/task/flowXmlAndNode
   * @secure
   */
  static flowXmlAndNode = <Req extends any = any>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/task/flowXmlAndNode`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 编辑流程图
   *
   * @tags 编辑流程图
   * @name readXml
   * @request /cirpoint-flowable-work-api/flowable/definition/readXml
   * @secure
   */
  static readXml = <Req extends any = any>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-flowable-work-api/flowable/definition/readXml/${data.deployId}`,
        method: 'GET',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
