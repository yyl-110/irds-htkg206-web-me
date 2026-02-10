// import type { OpenApiTag } from '@wei/openapi-codegen/es/src/OpenApiTags'
// import { OpenApiActions } from '@wei/openapi-codegen/es/src/OpenApiTags'

import { CommonResultPageResultOperateLogResponseDTOModel } from '../models/CommonResultPageResultOperateLogResponseDTOModel';
import { OperateLogPageRequestDTOModel } from '../models/OperateLogPageRequestDTOModel';
import { OperateLogResponseDTOModel } from '../models/OperateLogResponseDTOModel';
import type { RequestParams } from './http-client';
import { httpClient } from './http-client';

/**
 * 管理后台操作日志
 */
export class AdminApiSystemOperateLog {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台操作日志`;

  /**
   * 查看操作日志分页列表
   *
   * @param query
   * @param params
   * @tags 管理后台 - 操作日志
   * @name PageOperateLog
   * @summary 查看操作日志分页列表
   * @request GET:/admin-api/system/operate-log/page
   * @secure
   */
  static pageOperateLog = <Req extends OperateLogPageRequestDTOModel = OperateLogPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultOperateLogResponseDTOModel, any>(
      {
        path: `/admin-api/system/operate-log/page`,
        method: 'GET',
        query,
        secure: true,
        ...params,
      },
      CommonResultPageResultOperateLogResponseDTOModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemOperateLog> = {
//   api: {
//     pageOperateLog: {
//       path: '/admin-api/system/operate-log/page',
//       method: 'GET',
//       type: OpenApiActions.page,
//       paramModel: OperateLogPageRequestDTOModel,
//       responseModel: CommonResultPageResultOperateLogResponseDTOModel,
//       responseDataModel: OperateLogResponseDTOModel,
//       // paramSchema: $OperateLogPageRequestDTO,
//       // responseSchema: $CommonResultPageResultOperateLogResponseDTO,
//       // responseDataSchema: $OperateLogResponseDTO,
//     },
//   },
// };
