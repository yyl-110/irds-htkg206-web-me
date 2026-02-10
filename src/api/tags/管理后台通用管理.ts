// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';
import { CommonResultPOModel } from '../models/common/CommonResultPOModel';
import { DictionaryRequestDTOModel } from '../models/common/DictionaryRequestDTOModel';
import qs from 'qs';
/**
 * 后端 通用管理
 */
export class AdminApiSystemCommon {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后通用管理`;

  /**
   * 获得字典数据
   *
   * @tags 管理端 - 字典数据管理
   * @name getTaskPage
   * @summary 获得字典数据
   * @request GET:/business-api/business/dict/listByCategory
   * @secure
   */
  static getDictionary = <Req extends DictionaryRequestDTOModel = DictionaryRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/dict/listByCategory`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 获得字典数据list
   *
   * @tags 管理端 - 字典数据管理list
   * @name getTaskPage
   * @summary 获得字典数据
   * @request GET:/business-api/business/dict/listByCategoryList
   * @secure
   */
  static getDictionaryList = <Req extends DictionaryRequestDTOModel = DictionaryRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/dict/listByCategoryList`,
        method: 'POST',
        body: query,
        secure: true,
        type: ContentType.Json,
        ...params,
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      },
      CommonResultPOModel
    );

  /**
   * 获得字典数据list
   *
   * @tags 管理端 - 字典数据管理list
   * @name getTaskPage
   * @summary 获得字典数据
   * @request GET:/iba/list
   * @secure
   */
  static getibaList = <Req extends DictionaryRequestDTOModel = DictionaryRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/iba/list`,
        method: 'POST',
        body: query,
        secure: true,
        type: ContentType.Json,
        ...params,
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      },
      CommonResultPOModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemCommon> = {
//   api: {

//     getDictionary: {
//       path: "/business-api/business/dict/listByCategory",
//       method: "GET",
//       type: OpenApiActions.page,
//       paramModel: DictionaryRequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: CommonResultPOModel,
//     },

//     getDictionaryList: {
//       path: "/business-api/business/dict/listByCategoryList",
//       method: "GET",
//       type: OpenApiActions.page,
//       paramModel: DictionaryRequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: CommonResultPOModel,
//     },

//   },
// };
