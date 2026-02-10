// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { BoardPageRequestDTOModel } from "@/api/models/board/BoardPageRequestDTOModel";
import { CommonResultListDeptResponseDTOModel } from "../../models/CommonResultListDeptResponseDTOModel";
import { BoardInfoRequestDTOModel } from "@/api/models/board/BoardInfoRequestDTOModel";
/**
 * 系统看板
 */
export class AdminApiSystemBoard {
  /**
   * 获得系统看板管理数据
   *
   * @tags 管理后台 -看板
   * @name getReportInfoList
   * @summary 获得看板列表信息
   * @request /cirpoint-base-api/reportinfo/getReportInfoList.json
   * @secure
   */
  static getReportInfoList = <
    Req extends BoardPageRequestDTOModel = BoardPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/reportinfo/getReportInfoList.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除看板信息
   *
   * @tags 管理看板
   * @name reportinfoDeleteReportInfo
   * @summary 删除看板
   * @request POST:/cirpoint-base-api/reportinfo/deleteReportInfo.json
   * @secure
   */
  static reportinfoDeleteReportInfo = <
    Req extends {
      id: number;
    } = {
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/reportinfo/deleteReportInfo.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获得系统看板管理数据
   *
   * @tags 管理后台 -看板
   * @name reportinfoGetReportInfoSaveOrUpdate
   * @summary 获得看板列表信息
   * @request /cirpoint-base-api/reportinfo/getReportInfoSaveOrUpdate.json
   * @secure
   */
  static reportinfoGetReportInfoSaveOrUpdate = <
    Req extends BoardPageRequestDTOModel = BoardPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/reportinfo/getReportInfoSaveOrUpdate.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
