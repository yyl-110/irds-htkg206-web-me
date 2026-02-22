// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";

import { CommonResultBooleanModel } from "../models/CommonResultBooleanModel";
import { UserUpdatePasswordEpcRequestDTOModel } from "../models/UserUpdatePasswordEpcRequestDTOModel";

/**
 * 管理后台用户EPC
 */
export class AdminApiSystemEpcUser {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台用户EPC`;
  /**
   * 用户修改密码
   *
   * @tags 管理后台 - 用户修改密码
   * @name UpdateUserPassword
   * @summary 修改用户密码
   * @request POST:/system/epc-user/profile/update-password
   * @secure
   */
  static updateUserPassword = <
    Req extends
      UserUpdatePasswordEpcRequestDTOModel = UserUpdatePasswordEpcRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/epc-user/profile/update-password`,
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
// export const $tag: OpenApiTag<typeof AdminApiSystemEpcUser> = {
//   api: {
//     updateUserPassword: {
//       path: "/system/epc-user/profile/update-password",
//       method: "POST",
//       type: undefined,
//       paramModel: UserUpdatePasswordEpcRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//     },

//   },
// };
