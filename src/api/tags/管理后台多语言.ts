// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import { CommonResultListRoleUserPoModel } from '../models/CommonResultListRoleUserPoModel';
import { CommonResultPageResultLanguagePOModel } from '../models/language/CommonResultPageResultLanguagePOModel';
import { LanguagePOModel } from '../models/language/LanguagePOModel';
import { LanguagePageRequestDTOModel, LanguageRequestDTOModel } from '../models/language/LanguagePageRequestDTOModel';
import { FileUploadResponseDTOModel } from '../models/FileUploadResponseDTOModel';

/**
 * 管理后台多语言
 */
export class AdminApiSystemLanguage {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台多语言`;

  /**
   * 获得语言分页
   *
   * @tags 管理后台 - 语言
   * @name getLanguagePage
   * @summary 获得语言分页
   * @request GET:/business/multiLang-front/page
   * @secure
   */
  static getLanguagePage = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-front/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 界面元素语言 导出
   *
   * @tags 管理后台 - 语言
   * @name excelExport
   * @summary  界面元素语言导出
   * @request GET:/business/multiLang-front/export
   * @secure
   */
  static excelExport = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-front/export`,
        method: 'GET',
        secure: true,
        format: 'blob', // 返回二进制流
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 标准名称语言 导出
   *
   * @tags 管理后台 - 语言
   * @name excelExport
   * @summary  标准名称语言导出
   * @request GET:/business/multiLang-front/export
   * @secure
   */
  static excelstandardExport = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-data/export`,
        method: 'GET',
        secure: true,
        format: 'blob', // 返回二进制流
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 界面元素语言 导入
   *
   * @tags 管理后台 - 语言
   * @name excelImport
   * @summary  界面元素语言导入
   * @request GET:/business/multiLang-front/import
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
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-front/import`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 标准名称语言 导入
   *
   * @tags 管理后台 - 语言
   * @name excelImport
   * @summary  标准名称语言导入
   * @request GET:/business/multiLang-front/import
   * @secure
   */
  static excelstandardImport = <
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
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-data/import`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 获得语言分页
   *
   * @tags 管理后台 - 语言
   * @name getLanguageBackendPage
   * @summary 获得语言分页
   * @request GET:/business/multiLang-data/page
   * @secure
   */
  static getLanguageBackendPage = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-data/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 前台修改语言
   *
   * @tags 管理前台 - 语言
   * @name updateLanguage
   * @summary 修改语言信息
   * @request POST:/business/multiLang-front/update
   * @secure
   */
  static updateLanguage = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-front/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 前台删除语言
   *
   * @tags 管理前台 - 语言
   * @name deleteLanguage
   * @summary 删除语言信息
   * @request POST:/business/multiLang-front/delete`
   * @secure
   */
  static deleteLanguage = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-front/delete`,
        method: 'DELETE',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 前台修改语言
   *
   * @tags 管理前台 - 语言
   * @name updateBackendLanguage
   * @summary 修改语言信息
   * @request POST:/business/multiLang-data/update
   * @secure
   */
  static updateBackendLanguage = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-data/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 前台删除语言
   *
   * @tags 管理前台 - 语言
   * @name deleteBackendLanguage
   * @summary 删除语言信息
   * @request DELETE:/business/multiLang-data/delete
   * @secure
   */
  static deleteBackendLanguage = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-data/delete`,
        method: 'DELETE',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 后台添加语言
   *
   * @tags 管理添加后台 - 语言
   * @name createBackendLanguage
   * @summary 后台添加语言
   * @request POST:/business/multiLang-data/create
   * @secure
   */
  static createBackendLanguage = <Req extends LanguagePageRequestDTOModel = LanguagePageRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-data/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 应用端获取语言列表
   *
   * @tags 应用端获取语言列表 - 语言
   * @name languageList
   * @summary 应用端获取语言列表
   * @request POST:/business-api/business/language/list
   * @secure
   */
  static languageList = (params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/language/list`,
        method: 'GET',
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 应用端获取语言列表
   *
   * @tags 应用端获取语言列表 - 语言
   * @name gerLanguageJsonFile
   * @summary 应用端获取语言列表
   * @request POST:/business-api/business/language/list
   * @secure
   */
  static gerLanguageJsonFile = (params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/business/multiLang-front/initLanguageData`,
        method: 'GET',
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );

  /**
   * 应用端获语言设置
   *
   * @tags应用端获语言设置
   * @name gerLanguageJsonFile
   * @summary 应用端获语言设置
   * @request POST:/system/epc-user/update-user-language
   * @secure
   */
  static updateUserLanguage = <Req extends LanguageRequestDTOModel = LanguageRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultLanguagePOModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/update-user-language`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLanguagePOModel
    );
}
