// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from "../http-client";
import { DesignPageRequestDTOModel } from "@/api/models/designcheck/DesignPageRequestDTOModel";
import { CommonResultListDeptResponseDTOModel } from "../../models/CommonResultListDeptResponseDTOModel";
import { DesignInfoRequestDTOModel } from "@/api/models/designcheck/DesignInfoRequestDTOModel";

/**
 * 系统设计查核
 */
export class AdminApiSystemDesign {
  /**
   * 设计查核列表显示
   *
   * @tags 设计查核列表显示
   * @name getDesignPageList
   * @summary 设计查核列表显示
   * @request /cirpoint-module-api/auditLibrary/getDataList
   * @secure
   */
  static getDesignPageList = <
    Req extends DesignPageRequestDTOModel = DesignPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/getDataList`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 设计查核列表显示
   *
   * @tags 设计查核列表显示
   * @name designDelete
   * @summary 设计查核列表显示
   * @request /cirpoint-module-api/auditLibrary/delData
   * @secure
   */
  static designDelete = <
    Req extends DesignPageRequestDTOModel = DesignPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/delData`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 添加设计查核信息
   *
   * @tags 添加设计查核信息
   * @name designSave
   * @summary 添加设计查核信息
   * @request /cirpoint-module-api/auditLibrary/addData
   * @secure
   */
  static designSave = <
    Req extends DesignInfoRequestDTOModel = DesignInfoRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/addData`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 修改设计查核信息
   *
   * @tags 修改设计查核信息
   * @name designUpdate
   * @summary 修改设计查核信息
   * @request /cirpoint-module-api/auditLibrary/updateData
   * @secure
   */
  static designUpdate = <
    Req extends DesignInfoRequestDTOModel = DesignInfoRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/auditLibrary/updateData`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 系统参数管理右侧表格Excel导入功能
   *
   * @tags 管理后台 - 系统参数管理右侧表格Excel导入功能
   * @name exportDesignList
   * @summary 系统参数管理右侧表格Excel导出功能
   * @request POST:/cirpoint-base-api/tempalteinfo/importPropertyInformationNew.json
   * @secure
   */
  static exportDesignList = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/tempalteinfo/importPropertyInformationNew.json`,
        method: "POST",
        body: query,
        secure: true,
        format: "blob",
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
