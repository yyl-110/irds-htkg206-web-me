import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { ProjectPageRequestDTOModel } from '@/api/models/project/ProjectPageRequestDTOModel';

/**
 * 公告管理
 */
export class AdminApiProjectTemp {
  /**
   * 获得项目信息列表信息
   *
   * @tags 管理后台 - 获得项目信息列表信息
   * @name getProjectPageList
   * @summary 获得项目信息列表信息
   * @request /business-service/business/product-info/page
   * @secure
   */
  static getProjectPageList = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/page`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 创建项目信息
   *
   * @tags 管理后台 - 创建项目信息
   * @name createProject
   * @summary 创建项目信息
   * @request /business-service/business/product-temp/create
   * @secure
   */
  static createProject = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 编辑项目信息
   *
   * @tags 管理后台 - 编辑项目信息
   * @name updateProject
   * @summary 编辑项目信息
   * @request /business-service/business/product-temp/update
   * @secure
   */
  static updateProject = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 删除项目信息
   *
   * @tags 管理后台 - 删除项目信息
   * @name deleteProject
   * @summary 删除项目信息
   * @request /business-service/business/product-temp/delete
   * @secure
   */
  static deleteProject = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获取项目信息编辑文件
   *
   * @tags 管理后台 - 获取项目信息编辑文件
   * @name getProjectInfoEditFile
   * @summary 获取项目信息编辑文件
   * @request /business-service/business/product-temp/getProjectInfoEditFile
   * @secure
   */
  static getProjectInfoEditFile = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/getProjectInfoEditFile`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 项目团队列表
   *
   * @tags 管理后台 - 项目团队列表
   * @name projectTeamList
   * @summary 项目团队列表
   * @request /business-service/business/project-team/list
   * @secure
   */
  static projectTeamList = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-team/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 项目团队授权用户
   *
   * @tags 管理后台 - 项目团队授权用户
   * @name createProjectTeamUserAuth
   * @summary 项目团队授权用户
   * @request /business-service/business/project-team-user/createProjectTeamUserAuth
   * @secure
   */
  static createProjectTeamUserAuth = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-team-user/createProjectTeamUserAuth`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
