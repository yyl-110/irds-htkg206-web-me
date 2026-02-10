// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";

import { CommonResultBooleanModel } from "../models/CommonResultBooleanModel";
import { CommonResultDeptResponseDTOModel } from "../models/CommonResultDeptResponseDTOModel";
import { CommonResultJSONArrayModel } from "../models/CommonResultJSONArrayModel";
import { CommonResultListDeptPOModel } from "../models/CommonResultListDeptPOModel";
import { CommonResultListDeptResponseDTOModel } from "../models/CommonResultListDeptResponseDTOModel";
import { CommonResultListDeptSimpleResponseDTOModel } from "../models/CommonResultListDeptSimpleResponseDTOModel";
import { CommonResultLongModel } from "../models/CommonResultLongModel";
import { DeptCreateRequestDTOModel } from "../models/DeptCreateRequestDTOModel";
import { DeptListRequestDTOModel } from "../models/DeptListRequestDTOModel";
import { DeptPOModel } from "../models/DeptPOModel";
import { DeptResponseDTOModel } from "../models/DeptResponseDTOModel";
import { DeptSimpleResponseDTOModel } from "../models/DeptSimpleResponseDTOModel";
import { DeptUpdateRequestDTOModel } from "../models/DeptUpdateRequestDTOModel";
import { DeptUserRequestDTOModel } from "../models/DeptUserRequestDTOModel";

/**
 * 管理后台部门
 */
export class AdminApiSystemDept {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台部门`;

  /**
   * 更新部门
   *
   * @tags 管理后台 - 部门
   * @name UpdateDept
   * @summary 更新部门
   * @request POST:/system/dept/update
   * @secure
   */
  static updateDept = <
    Req extends DeptUpdateRequestDTOModel = DeptUpdateRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/dept/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 创建部门
   *
   * @tags 管理后台 - 部门
   * @name CreateDept
   * @summary 创建部门
   * @request POST:/system/dept/create
   * @secure
   */
  static createDept = <
    Req extends DeptCreateRequestDTOModel = DeptCreateRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/cirpoint-auth-api/system/dept/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel
    );
  /**
   * 刷新部门数据
   *
   * @tags 管理后台 - 部门
   * @name Refresh
   * @summary 刷新部门数据
   * @request GET:/admin-api/system/dept/refresh
   * @secure
   */
  static refresh = (params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/dept/refresh`,
        method: "GET",
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * 获取部门列表
   *
   * @tags 管理后台 - 部门
   * @name ListDepts
   * @summary 获取部门列表
   * @request GET:/admin-api/system/dept/list
   * @secure
   */
  static listDepts = <
    Req extends DeptListRequestDTOModel = DeptListRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/dept/list`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获取部门列表懒加载
   *
   * @tags 管理后台 - 部门
   * @name ListDeptsLazy
   * @summary 获取部门列表懒加载
   * @request GET:/system/dept/listLazy
   * @secure
   */
  static listDeptsLazy = <
    Req extends DeptListRequestDTOModel = DeptListRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/dept/listLazy`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获得组织架构信息
   *
   * @tags 管理后台 - 部门
   * @name GetDeptUser
   * @summary 获得组织架构信息
   * @request GET:/admin-api/system/dept/listDeptUser
   * @secure
   */
  static getDeptUser = <
    Req extends DeptUserRequestDTOModel = DeptUserRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultJSONArrayModel, any>(
      {
        path: `/admin-api/system/dept/listDeptUser`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultJSONArrayModel
    );
  /**
   * 获取部门列表--组织及其子组织
   *
   * @tags 管理后台 - 部门
   * @name ListChildDepts
   * @summary 获取部门列表--组织及其子组织
   * @request GET:/admin-api/system/dept/list-child
   * @secure
   */
  static listChildDepts = <
    Req extends DeptListRequestDTOModel = DeptListRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/admin-api/system/dept/list-child`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * @description 只包含被开启的部门，主要用于前端的下拉选项
   *
   * @tags 管理后台 - 部门
   * @name GetSimpleDepts
   * @summary 获取部门精简信息列表
   * @request GET:/system/dept/list-all-simple
   * @secure
   */
  static getSimpleDepts = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptSimpleResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/dept/list-all-simple`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultListDeptSimpleResponseDTOModel
    );
  /**
   * @description 只包含被开启的部门，主要用于前端的下拉选项
   *
   * @tags 管理后台 - 部门
   * @name GetSimpleDeptsRight
   * @summary 获取部门精简信息列表
   * @request GET:/system/dept/list-all-simple-right
   * @secure
   */
  static getSimpleDeptsRight = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptSimpleResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/dept/list-all-simple-right`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultListDeptSimpleResponseDTOModel
    );
  /**
   * 获得部门信息
   *
   * @tags 管理后台 - 部门
   * @name GetDept1
   * @summary 获得部门信息
   * @request GET:/admin-api/system/dept/get
   * @secure
   */
  static getDept1 = <
    Req extends {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    } = {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/dept/get`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultDeptResponseDTOModel
    );
  /**
   * 获得部门子部门
   *
   * @tags 管理后台 - 部门
   * @name GetDeptChildren1
   * @summary 获得部门子部门
   * @request GET:/admin-api/system/dept/getDeptChildren
   * @secure
   */
  static getDeptChildren1 = <
    Req extends {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    } = {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptPOModel, any>(
      {
        path: `/admin-api/system/dept/getDeptChildren`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptPOModel
    );
  /**
   * 获得部门信息通过编号
   *
   * @tags 管理后台 - 部门
   * @name GetDept2
   * @summary 获得部门信息通过编号
   * @request GET:/admin-api/system/dept/getByCode
   * @secure
   */
  static getDept2 = <
    Req extends {
      code: string;
      /**
       * 编号
       * @example 1024
       */
      id: any;
    } = {
      code: string;
      /**
       * 编号
       * @example 1024
       */
      id: any;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultDeptResponseDTOModel, any>(
      {
        path: `/admin-api/system/dept/getByCode`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultDeptResponseDTOModel
    );
  /**
   * 删除部门
   *
   * @tags 管理后台 - 部门
   * @name DeleteDept1
   * @summary 删除部门
   * @request GET:/system/dept/delete
   * @secure
   */
  static deleteDept1 = <
    Req extends {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    } = {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/dept/delete`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );
}
