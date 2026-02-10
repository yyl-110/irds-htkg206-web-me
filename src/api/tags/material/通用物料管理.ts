// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultListDeptResponseDTOModel } from "../../models/CommonResultListDeptResponseDTOModel";
import { MaterialPageRequestDTOModel } from "@/api/models/material/MaterialPageRequestDTOModel";
/**
 * 通用物料管理
 */
export class AdminApiMaterial {
  /**
   * 获得公告列表信息
   *
   * @tags 管理后台 - 公告
   * @name getDataInfo
   * @summary 获得公告信息
   * @request /cirpoint-module-api/folderPart/getDataInfo
   * @secure
   */
  static getDataInfo = <
    Req extends MaterialPageRequestDTOModel = MaterialPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/folderPart/getDataInfo`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 同步PDM中的结构数据
   *
   * @tags 同步PDM中的结构数据
   * @name syncCommonPartFolder
   * @summary 同步PDM中的结构数据
   * @request /cirpoint-module-api/pdmSystem/syncCommonPartFolder
   * @secure
   */
  static syncCommonPartFolder = <
    Req extends MaterialPageRequestDTOModel = MaterialPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/syncCommonPartFolder`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 同步PDM中的数据
   *
   * @tags 同步PDM中的数据
   * @name syncCommonPartFolderInfo
   * @summary 同步PDM中的数据
   * @request /cirpoint-module-api/pdmSystem/syncCommonPartFolderInfo
   * @secure
   */
  static syncCommonPartFolderInfo = <
    Req extends MaterialPageRequestDTOModel = MaterialPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/syncCommonPartFolderInfo`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
