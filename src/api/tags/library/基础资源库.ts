// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { LibraryPageRequestDTOModel } from '@/api/models/library/LibraryPageRequestDTOModel';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
/**
 * 公告管理
 */
export class businessApiLibrary {
  /**
   * 获得公告列表信息
   *
   * @tags 管理后台 - 公告
   * @name getLibraryPageList
   * @summary 获得公告信息
   * @request /business-service/business/library-menu/page
   * @secure
   */
  static getLibraryPageList = <Req extends LibraryPageRequestDTOModel = LibraryPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-menu/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 保存数据
   *
   * @tags 保存数据
   * @name libraryAdd
   * @summary 保存数据
   * @request POST:/business-service/business/library-menu/create;
   * @secure
   */
  static libraryAdd = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-menu/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 更新数据
   *
   * @tags 更新数据
   * @name libraryUpdate
   * @summary 更新数据
   * @request POST:/business-service/business/library-menu/update;
   * @secure
   */
  static libraryUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-menu/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 更改菜单发布状态
   *
   * @tags 更改菜单发布状态
   * @name libraryUpdate
   * @summary 更改菜单发布状态
   * @request POST:/business-service/business/library-menu/updateLibraryMenuStatus;
   * @secure
   */
  static updateLibraryMenuStatus = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-menu/updateLibraryMenuStatus`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 删除公告
   *
   * @tags 管理后台 - 公告
   * @name deleteLibrary
   * @summary 删除公告
   * @request GET:/system/role/delete
   * @secure
   */
  static deleteLibrary = <
    Req extends {
      id: number;
    } = {
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<any, any>(
      {
        path: `/business-service/business/library-menu/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 保存属性配置
   *
   * @tags 保存属性配置
   * @name keepLibraryProperty
   * @summary 保存属性配置
   * @request POST:/business-service/business/library-property/keepLibraryProperty;
   * @secure
   */
  static keepLibraryProperty = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-property/keepLibraryProperty`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 删除属性配置
   *
   * @tags 删除属性配置
   * @name deleteLibraryProperty
   * @summary 删除属性配置
   * @request POST:/business-service/business/library-property/delete
   * @secure
   */
  static deleteLibraryProperty = <Req extends { id: string | number } = { id: string | number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-property/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获得属性配置
   *
   * @tags 获得属性配置
   * @name getPropertyList
   * @summary 获得属性配置
   * @request /business-service/business/library-property/list
   * @secure
   */
  static getPropertyList = <Req extends LibraryPageRequestDTOModel = LibraryPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/library-property/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
