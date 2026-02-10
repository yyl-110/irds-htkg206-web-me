// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultBooleanModulemanaGementModel } from '@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel';
import { ProdPositionInfoRequestDTOModel } from '@/api/models/position/ProdPositionInfoRequestDTOModel';

/**
 * 管理后台岗位
 */
export class AdminApiSystemPosition {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台岗位`;
  /**
   * @description 用于【岗位管理】界面
   *
   * @tags 管理后台 - 岗位
   * @name GetMenuList
   * @summary 获取岗位列表
   * @request GET:cirpoint-demand-api/position-role/page
   * @secure
   */
  static getpositionList = <Req extends ProdPositionInfoRequestDTOModel = ProdPositionInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/position-role/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );
  /**
   * 创建岗位
   *
   * @tags 管理后台 - 岗位
   * @name CreateMenu
   * @summary 创建岗位
   * @request POST:/cirpoint-demand-api/position-role/create
   * @secure
   */
  static createposition = <Req extends ProdPositionInfoRequestDTOModel = ProdPositionInfoRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/position-role/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 修改岗位
   *
   * @tags 管理后台 - 岗位
   * @name UpdateMenu
   * @summary 修改岗位
   * @request POST:/cirpoint-demand-api/position-role/update
   * @secure
   */
  static updateposition = <Req extends ProdPositionInfoRequestDTOModel = ProdPositionInfoRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/position-role/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  //----------
  /**
   * @description 获取岗位分配用户
   *
   * @tags 管理后台 - 获取岗位分配用户
   * @name getAssignUsers
   * @summary 获取岗位分配用户
   * @request GET:/cirpoint-demand-api/position-role/getAssignUsers
   * @secure
   */
  static getAssignUsers = <Req extends { id: string } = { id: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/position-role/getAssignUsers`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 岗位分配用户
   *
   * @tags 管理后台 - 岗位分配用户
   * @name GetMenu
   * @summary 岗位分配用户
   * @request GET:/cirpoint-demand-api/position-role/assignUsers
   * @secure
   */
  static getObtainpositionlusers = <
    Req extends {
      /** @format int64 */
      roleId: string | number;
    } = {
      /** @format int64 */
      roleId: string | number;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/position-role/assignUsers`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 删除岗位
   *
   * @tags 管理后台 - 岗位
   * @name DeleteMenu
   * @summary 删除岗位
   * @request GET:/region/delete
   * @secure
   */
  static deletePosition = <
    Req extends {
      /**
       * 角色编号
       * @format int64
       * @example 1024
       */
      id: number;
    } = {
      /**
       * 角色编号
       * @format int64
       * @example 1024
       */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/position-role/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  // ------------------------------------------------------
  /**
   * 岗位管理 导入
   *
   * @tags 管理后台 - 岗位管理
   * @name excelImport
   * @summary  岗位管理导入
   * @request GET:/region/import
   * @secure
   */
  static excelImport = <
    Req extends {
      /** @format binary */
      file?: File;
    } = {
      /** @format binary */
      file?: File;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/region/import`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );
  /**
   * 岗位管理 导出
   *
   * @tags 管理后台 - 岗位管理
   * @name excelExport
   * @summary  岗位管理导出
   * @request GET:/region/export
   * @secure
   */
  static excelExport = <Req extends ProdPositionInfoRequestDTOModel = ProdPositionInfoRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/region/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob', // 返回二进制流
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );
}
