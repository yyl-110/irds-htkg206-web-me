// import { type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";

import { CommonResultBooleanModel } from "../models/CommonResultBooleanModel";
import { StatisticsLogDTOModel } from "../models/StatisticsLogDTOModel";

/**
 * statisticsLogController
 */
export class AdminApiSystemStatisticsLog {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `statisticsLogController`;

  /**
   * 添加统计日志
   *
   * @tags statistics-log-controller
   * @name StatisticsLogInsert
   * @summary 添加统计日志
   * @request POST:/admin-api/system/statistics-log/add
   * @secure
   */
  static statisticsLogInsert = <
    Req extends StatisticsLogDTOModel = StatisticsLogDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/statistics-log/add`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemStatisticsLog> = {
//   api: {
//     statisticsLogInsert: {
//       path: "/admin-api/system/statistics-log/add",
//       method: "POST",
//       type: undefined,
//       paramModel: StatisticsLogDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $StatisticsLogDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//   },
// };
