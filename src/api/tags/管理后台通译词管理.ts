// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import { CommonResultPageResultTranslatedWordsPOModel } from '../models/backendData/translatedWords/CommonResultPageResultTranslatedWordsPOModel';
import { TranslatedWordsPOModel } from '../models/backendData/translatedWords/TranslatedWordsPOModel';
import {
  TranslatedWordsPageRequestDTOModel,
  TranslatedWordsRequestDTOModel,
  TranslatedWordsRequestByIDDTOModel,
} from '../models//backendData/translatedWords/TranslatedWordsPageRequestDTOModel';
import qs from 'qs';
/**
 * 后端 通译词管理
 */
export class AdminApiSystemTranslatedWords {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台我的公告`;

  /**
   * 获得通译词管理 分页
   *
   * @tags 管理端 - 通译词管理
   * @name getTaskPage
   * @summary 获得通译词管理 分页
   * @request GET:/business-api/business/common-word/page
   * @secure
   */
  static getTranslatedWordsPage = <Req extends TranslatedWordsPageRequestDTOModel = TranslatedWordsPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultTranslatedWordsPOModel, any>(
      {
        path: `/business-api/business/common-word/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultTranslatedWordsPOModel
    );

  /**
   *  创建通译词
   *
   * @tags 管理端 - 创建通译词
   * @name getFeedbackDetail
   * @summary 创建通译词
   * @request POST:/business-api/business/TranslatedWords/create
   * @secure
   */
  static createtTranslatedWords = <Req extends TranslatedWordsRequestDTOModel = TranslatedWordsRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultTranslatedWordsPOModel, any>(
      {
        path: `/business-api/business/common-word/create`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPageResultTranslatedWordsPOModel
    );

  /**
   *  删除通译词
   *
   * @tags 管理端 -删除通译词
   * @name getFeedbackDetail
   * @summary 删除通译词
   * @request DELETE:/business-api/business/TranslatedWords/delete
   * @secure
   */
  static deleteTranslatedWords = <Req extends TranslatedWordsRequestByIDDTOModel = TranslatedWordsRequestByIDDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultTranslatedWordsPOModel, any>(
      {
        path: `/business-api/business/common-word/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultTranslatedWordsPOModel
    );

  /**
   * 通译词 导出
   *
   * @tags 管理后台 - 通译词
   * @name excelExport
   * @summary 通译词 导出
   * @request GET:/business-api/business/usr-favorite/export
   * @secure
   */
  static excelExport = (params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultTranslatedWordsPOModel, any>(
      {
        path: `/business-api/business/common-word/export`,
        method: 'GET',
        secure: true,
        format: 'blob', // 返回二进制流
        ...params,
      },
      CommonResultPageResultTranslatedWordsPOModel
    );

  /**
   * 通译词 导入
   *
   * @tags 管理后台 - 通译词
   * @name excelImport
   * @summary  通译词导入
   * @request GET:/business/common-word/import
   * @secure
   */
  static excelImport = <
    Req extends {
      /** @format binary */
      file?: File;
    } = {
      /** @format binary */
      file?: File;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultTranslatedWordsPOModel, any>(
      {
        path: `/business-api/business/common-word/import`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultPageResultTranslatedWordsPOModel
    );

  /**
   * 通译词
   *
   * @tags 通译词管理 - 通译词
   * @name updateLanguage
   * @summary 修改通译词信息
   * @request POST:/business-api/business/multiLang-front/update
   * @secure
   */
  static updateTranslatedWords = <Req extends TranslatedWordsRequestDTOModel = TranslatedWordsRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultTranslatedWordsPOModel, any>(
      {
        path: `/business-api/business/common-word/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultTranslatedWordsPOModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemTranslatedWords> = {
//   api: {
//     getTranslatedWordsPage: {
//       path: '/business-api/business/common-word/page',
//       method: 'GET',
//       type: OpenApiActions.page,
//       paramModel: TranslatedWordsPageRequestDTOModel,
//       responseModel: CommonResultPageResultTranslatedWordsPOModel,
//       responseDataModel: TranslatedWordsPOModel,
//     },

//     createtTranslatedWords: {
//       path: '/business-api/business/common-word/create',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: TranslatedWordsRequestDTOModel,
//       responseModel: CommonResultPageResultTranslatedWordsPOModel,
//       responseDataModel: TranslatedWordsPOModel,
//     },

//     deleteTranslatedWords: {
//       path: '/business-api/business/common-word/delete',
//       method: 'DELETE',
//       type: OpenApiActions.delete,
//       paramModel: TranslatedWordsRequestDTOModel,
//       responseModel: CommonResultPageResultTranslatedWordsPOModel,
//       responseDataModel: TranslatedWordsPOModel,
//     },

//     excelExport: {
//       path: '/business-api/business/common-word/export',
//       method: 'GET',
//       type: OpenApiActions['export-excel'],
//       paramModel: TranslatedWordsRequestDTOModel,
//       responseModel: CommonResultPageResultTranslatedWordsPOModel,
//       responseDataModel: undefined,
//     },

//     excelImport: {
//       path: '/business-api/business/common-word/import',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: CommonResultPageResultTranslatedWordsPOModel,
//       responseDataModel: TranslatedWordsPOModel,
//     },

//     updateTranslatedWords: {
//       path: '/business-api/business/common-word/update',
//       method: 'POST',
//       type: OpenApiActions.update,
//       paramModel: TranslatedWordsRequestDTOModel,
//       responseModel: CommonResultPageResultTranslatedWordsPOModel,
//       responseDataModel: TranslatedWordsPOModel,
//     },
//   },
// };
