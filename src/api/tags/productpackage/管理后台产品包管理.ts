import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { ProdProductpackageRequestDTOModel } from "@/api/models/productpackage/ProdProductpackageRequestDTOModel";

/**
 * 管理后台产品包
 */
export class AdminApiSystemProductpackage {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台产品包`;
  /**
   * @description 用于【产品包管理】界面
   *
   * @tags 管理后台 - 产品包
   * @name getpackageList
   * @summary 获取产品包列表
   * @request GET:/cirpoint-demand-api/demand-package-type/page
   * @secure
   */
  static getpackageList = <
    Req extends
      ProdProductpackageRequestDTOModel = ProdProductpackageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<ProdProductpackageRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/demand-package-type/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      ProdProductpackageRequestDTOModel
    );
  /**
   * 创建产品包
   *
   * @tags 管理后台 - 产品包
   * @name createpackage
   * @summary 创建产品包
   * @request POST:/cirpoint-demand-api/demand-package-type/create
   * @secure
   */
  static createpackage = <
    Req extends
      ProdProductpackageRequestDTOModel = ProdProductpackageRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<ProdProductpackageRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/demand-package-type/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      ProdProductpackageRequestDTOModel
    );

  /**
   * 修改产品包
   *
   * @tags 管理后台 - 产品包
   * @name updatepackage
   * @summary 修改产品包
   * @request POST:/cirpoint-demand-api/demand-package-type/update
   * @secure
   */
  static updatepackage = <
    Req extends
      ProdProductpackageRequestDTOModel = ProdProductpackageRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-package-type/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 产品包详情
   *
   * @tags 管理后台 - 产品包详情
   * @name getpackagedetail
   * @summary 产品包详情
   * @request POST:/cirpoint-demand-api/demand-package-type/detail
   * @secure
   */
  static getpackagedetail = <Req extends { id: string } = { id: string }>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-package-type/detail`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 更新-添加项点
   *
   * @tags 管理后台 - 更新-添加项点
   * @name updatePackageItem
   * @summary 更新-添加项点
   * @request POST:/cirpoint-demand-api/demand-package-type/updatePackageItem
   * @secure
   */
  static updatePackageItem = <
    Req extends
      ProdProductpackageRequestDTOModel = ProdProductpackageRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-package-type/updatePackageItem`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 删除产品包
   *
   * @tags 管理后台 - 产品包
   * @name deletepackage
   * @summary 删除产品包
   * @request GET:/cirpoint-demand-api/demand-package-type/delete
   * @secure
   */
  static deletepackage = <
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
        path: `/cirpoint-demand-api/demand-package-type/delete`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
