// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultListDeptResponseDTOModel } from "../../models/CommonResultListDeptResponseDTOModel";

/**
 * 系统参数管理
 */
export class AdminApiSystemDashboard {
  /**
   * 平台看板数据信息
   *
   * @tags 管理后台 - 平台看板数据信息
   * @name getParameterPageList
   * @summary 平台看板数据信息
   * @request /cirpoint-base-api/reportinfo/getReportInfoList.json
   * @secure
   */
  static reportinfoGetReportInfoList = <
    Req extends { reportIndex: string; reportName: string } = {
      reportIndex: string;
      reportName: string;
    },
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
   * 平台看板数据根据ID获取对象
   *
   * @tags 管理后台 - 平台看板数据根据ID获取对象
   * @name getUnitParentApi
   * @summary 平台看板数据根据ID获取对象
   * @request /cirpoint-base-api/reportinfo/getReportInfoById.json
   * @secure
   */
  static reportinfoGetReportInfoById = <
    Req extends { id: string } = { id: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/reportinfo/getReportInfoById.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
