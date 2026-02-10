// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { productSpecificationAdd } from '@/api/models/productSpecification/productSpecificationAdd';
import { productSpecificationPage } from '@/api/models/productSpecification/productSpecificationPage';
/**
 * 产品规划
 */
export class AdminApiSystemProductSpecification {
  /**
   * 产品规划
   *
   * @tags 管理后台 - 产品规划信息添加功能
   * @name productSpecificationInfoAdd
   * @summary 产品规划信息添加功能
   * @request POST:/cirpoint-demand-api/product-plan/create
   * @secure
   */
  static productSpecificationInfoAdd = <Req extends productSpecificationAdd = productSpecificationAdd>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 产品规划信息编辑功能
   * @name productSpecificationInfoUpdate
   * @summary 产品规划信息编辑功能
   * @request POST:/cirpoint-demand-api/product-plan/update
   * @secure
   */
  static productSpecificationInfoUpdate = <Req extends productSpecificationAdd = productSpecificationAdd>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 产品规划列表分页查询功能
   * @name productSpecificationInfoAdd
   * @summary 产品规划列表分页查询功能
   * @request POST:/cirpoint-demand-api/product-plan/create
   * @secure
   */
  static productPlanPage = <Req extends productSpecificationPage = productSpecificationPage>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan/page`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 产品规划批量删除
   * @name batchDelete
   * @summary 产品规划批量删除
   * @request POST:/cirpoint-demand-api/product-plan/batchDelete
   * @secure
   */
  static batchDelete = <Req extends productSpecificationAdd = productSpecificationAdd>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan/batchDelete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 产品规划保存后实例化相应任务
   * @name createTask
   * @summary 产品规划保存后实例化相应任务
   * @request POST:/cirpoint-demand-api/product-plan/createTask
   * @secure
   */
  static createTask = <Req extends productSpecificationAdd = productSpecificationAdd>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/createTask`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 查询任务管理接口信息
   * @name getTaskInfo
   * @summary 查询任务管理接口信息
   * @request POST:/cirpoint-demand-api/product-plan/getTaskInfo
   * @secure
   */
  static getTaskInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/getTaskInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 更改任务计划时间
   * @name updatePlanDate
   * @summary 更改任务计划时间
   * @request POST:/cirpoint-demand-api/product-plan/updatePlanDate
   * @secure
   */
  static updatePlanDate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/updatePlanDate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 编辑单条任务信息
   * @name updatePlanTaskInfo
   * @summary 编辑单条任务信息
   * @request POST:/cirpoint-demand-api/product-plan/updatePlanTaskInfo
   * @secure
   */
  static updatePlanTaskInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/updatePlanTaskInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 浏览选取负责人信息
   * @name updateHeaderUserId
   * @summary 浏览选取负责人信息
   * @request POST:/cirpoint-demand-api/product-plan/updateHeaderUserId
   * @secure
   */
  static updateHeaderUserId = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/updateHeaderUserId`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 启动阶段
   * @name updateWorkStatus
   * @summary 启动阶段
   * @request POST:/cirpoint-demand-api/product-plan/updateWorkStatus
   * @secure
   */
  static updateWorkStatus = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/updateWorkStatus`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 工作台查询任务信息
   * @name getTaskWorkByPlanId
   * @summary 工作台查询任务信息
   * @request POST:/cirpoint-demand-api/product-plan/getTaskWorkByPlanId
   * @secure
   */
  static getTaskWorkByPlanId = <Req extends productSpecificationPage = productSpecificationPage>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/getTaskWorkByPlanId`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 查询任务树节点功能，组件以产品规划名称为根节点树结构
   * @name getProductTaskTreeInfo
   * @summary 查询任务树节点功能，组件以产品规划名称为根节点树结构
   * @request POST:/cirpoint-demand-api/product-plan/getProductTaskTreeInfo
   * @secure
   */
  static getProductTaskTreeInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/getProductTaskTreeInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划
   *
   * @tags 管理后台 - 根据岗位获取用户信息
   * @name 根据岗位获取用户信息
   * @summary 根据岗位获取用户信息
   * @request POST:/cirpoint-demand-api/position-role/getPositionUserList
   * @secure
   */
  static getPositionUserList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/position-role/getPositionUserList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除任务
   *
   * @tags 产品规划-删除任务信息
   * @name deletePlanTask
   * @request /cirpoint-demand-api/product-plan-task/delete
   * @secure
   */
  static deletePlanTask = <Req extends { id: number } = { id: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 修改任务状态
   *
   * @tags 修改任务状态
   * @name updateTaskStatus
   * @request /cirpoint-demand-api/product-plan-task/updateTaskStatus
   * @secure
   */
  static updateTaskStatus = <Req extends { id: number; status: string } = { id: number; status: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/updateTaskStatus`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 任务转办
   *
   * @tags 任务转办
   * @name transferTaskInfo
   * @request /cirpoint-demand-api/product-plan-task/transferTaskInfo
   * @secure
   */
  static transferTaskInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/transferTaskInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 更改任务状态通用方法
   *
   * @tags 更改任务状态通用方法
   * @name updateTaskWorkStatus
   * @request /cirpoint-demand-api/product-plan-task/updateTaskWorkStatus
   * @secure
   */
  static updateTaskWorkStatus = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/updateTaskWorkStatus`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 初始化获取任务进度以及页面参数是否可编辑参数
   *
   * @tags 初始化获取任务进度以及页面参数是否可编辑参数
   * @name getProductTaskWorkStatus
   * @request /cirpoint-demand-api/product-plan-task/getProductTaskWorkStatus
   * @secure
   */
  static getProductTaskWorkStatus = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/getProductTaskWorkStatus`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 技术趋势分析初始化列表
   *
   * @tags 技术趋势分析初始化列表
   * @name getDynamicList
   * @request /cirpoint-demand-api/product-plan-task/list
   * @secure
   */
  static getDynamicList = <
    Req extends { taskId: number; type: string } = {
      taskId: number;
      type: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-dynamic-table/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 技术趋势分析添加保存表
   *
   * @tags 技术趋势分析添加保存表
   * @name saveDynamicList
   * @request /cirpoint-demand-api/product-plan-task/save
   * @secure
   */
  static saveDynamicList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-dynamic-table/save`,
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
  static planTaskExcelExport = <
    Req extends {
      planId: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { planId: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 导出交付物
   *
   * @tags 导出交付物
   * @name deliveryFileExport
   * @summary 导出计划导出交付物
   * @request POST:/cirpoint-demand-api/product-plan-task/deliveryFileExport/export
   * @secure
   */
  static deliveryFileExport = <
    Req extends {
      planId: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { planId: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/deliveryFileExport/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取模板文件列表
   *
   * @tags 获取模板文件列表
   * @name fileTemplateFileList
   * @summary 获取模板文件列表
   * @request POST:/cirpoint-demand-api/product-plan-file/templateFileList
   * @secure
   */
  static fileTemplateFileList = <Req extends {} = {}>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-file/templateFileList`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取模板文件
   *
   * @tags 获取模板文件
   * @name fileGetTemplateFile
   * @summary 获取模板文件
   * @request POST:/cirpoint-demand-api/product-plan-file/getTemplateFile
   * @secure
   */
  static fileGetTemplateFile = <Req extends { fileType: number } = { fileType: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-file/getTemplateFile`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 更新模板文件
   *
   * @tags 更新模板文件
   * @name fileUpdateTemplateFile
   * @request /cirpoint-demand-api/product-plan-file/updateTemplateFile
   * @secure
   */
  static fileUpdateTemplateFile = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-file/updateTemplateFile`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品规划主页
   *
   * @tags 获取产品规划主页
   * @name getproducthomeList
   * @summary 获取产品规划主页
   * @request POST:/cirpoint-demand-api/product-plan/homeList
   * @secure
   */
  static getproducthomeList = <Req extends { addYear: string } = { addYear: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan/homeList`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
