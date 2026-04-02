import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { ActivityPageRequestDTOModel } from '@/api/models/activityPage/ActivityPageRequestDTOModel';

/**
 * 公告管理
 */
export class AdminApiActivityPage {
  /**
   * 获得活动页面树结构
   *
   * @tags 管理后台 - 获得活动页面树结构
   * @name getActivityTree
   * @summary 获得活动页面树结构
   * @request /business-service/business/system-activity-design-tree/query-activity-tree
   * @secure
   */
  static getActivityTree = <Req extends ActivityPageRequestDTOModel = ActivityPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/system-activity-design-tree/query-activity-tree`,
        method: 'GET',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 添加活动类型树节点
   *
   * @tags 管理后台 - 添加活动类型树节点
   * @name saveActivityTree
   * @summary 添加活动类型树节点
   * @request /business-service/business/system-activity-design-tree/create
   * @secure
   */
  static saveActivityTree = <Req extends ActivityPageRequestDTOModel = ActivityPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/system-activity-design-tree/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 编辑活动类型树节点
   *
   * @tags 管理后台 - 编辑活动类型树节点
   * @name editActivityTree
   * @summary 编辑活动类型树节点
   * @request /business-service/business/system-activity-design-tree/update
   * @secure
   */
  static editActivityTree = <Req extends ActivityPageRequestDTOModel = ActivityPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/system-activity-design-tree/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 删除活动类型树节点
   *
   * @tags 管理后台 - 删除活动类型树节点
   * @name delTreeNode
   * @summary 删除活动类型树节点
   * @request /business-service/business/system-activity-design-tree/delete
   * @secure
   */
  static delTreeNode = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/system-activity-design-tree/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 向上排序活动类型树节点
   *
   * @tags 管理后台 - 向上排序活动类型树节点
   * @name sortUpTreeNode
   * @summary 向上排序活动类型树节点
   * @request /business-service/business/system-activity-design-tree/sort/up
   * @secure
   */
  static sortUpTreeNode = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/system-activity-design-tree/sort/up`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 向下排序活动类型树节点
   *
   * @tags 管理后台 - 向下排序活动类型树节点
   * @name sortDownTreeNode
   * @summary 向下排序活动类型树节点
   * @request /business-service/business/system-activity-design-tree/sort/down
   * @secure
   */
  static sortDownTreeNode = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/system-activity-design-tree/sort/down`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 根据树节点获取活动信息
   *
   * @tags 管理后台 - 根据树节点获取活动信息
   * @name getActivityPage
   * @summary 根据树节点获取活动信息
   * @request /business-service/business/activity-basic-info/page
   * @secure
   */
  static getActivityPage = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/activity-basic-info/page`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 创建活动页面信息
   *
   * @tags 管理后台 - 创建活动页面信息
   * @name createActivityInfo
   * @summary 创建活动页面信息
   * @request /business-service/business/activity-basic-info/create
   * @secure
   */
  static createActivityInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/activity-basic-info/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 编辑活动页面信息
   *
   * @tags 管理后台 - 编辑活动页面信息
   * @name updateActivityInfo
   * @summary 编辑活动页面信息
   * @request /business-service/business/activity-basic-info/update
   * @secure
   */
  static updateActivityInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/activity-basic-info/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 批量删除活动页面信息
   *
   * @tags 管理后台 - 批量删除活动页面信息
   * @name deleteActivityInfo
   * @summary 批量删除活动页面信息
   * @request /business-service/business/activity-basic-info/delete
   * @secure
   */
  static deleteActivityInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/activity-basic-info/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计活动页面组件（整页保存/更新）
   *
   * @tags 管理后台 - 设计活动页面组件
   * @name saveActivityPageFormComponent
   * @summary 设计活动页面组件
   * @request /business-service/business/page-form-component/page-save
   * @secure
   */
  static saveActivityPageFormComponent = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/page-form-component/page-save`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
