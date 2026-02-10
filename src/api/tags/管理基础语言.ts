// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';
import { BasiclanguageResultLongModuleResultBooleanModule } from '../models/language/BasiclanguageResultLongModuleResultBooleanModule';
import { languageResultListMenuResponseDTOModul } from '../models/language/languageResultListMenuResponseDTOModul';
import { BasiclanguageResultLongModule } from '../models/language/BasiclanguageResultLongModule';
import { CommonRequestDTOBasiclanguageModel } from '../models/language/CommonRequestDTOBasiclanguageModel';
import { BasiclanguagePageRequestDTOModel } from '@/api/models/language/BasiclanguagePageRequestDTOModel';
/**
 * 管理后台模块
 */
export class AdminApiSystemBasiclanguage {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理基础语言`;

  /**
   * @description 用于【模块管理】界面
   *
   * @tags 管理后台 - 模块
   * @name GetMenuList
   * @summary 获取模块列表
   * @request GET:/business/multiLang-data/init-language-redis-data
   * @secure
   */
  static Sincronizarredis = <Req extends BasiclanguagePageRequestDTOModel = BasiclanguagePageRequestDTOModel>() =>
    // query: Req,
    // params: RequestParams = {},
    httpClient.request<languageResultListMenuResponseDTOModul, any>(
      {
        path: `/business/multiLang-data/init-language-redis-data`,
        method: 'GET',
        // query: query,
        secure: true,
        // ...params,
      },
      languageResultListMenuResponseDTOModul
    );
  /**
   * @description 用于【模块管理】界面
   *
   * @tags 管理后台 - 模块
   * @name GetMenuList
   * @summary 获取模块列表
   * @request GET:/business/multiLang-front/initLanguageData
   * @secure
   */
  static Sincronizar = <Req extends BasiclanguagePageRequestDTOModel = BasiclanguagePageRequestDTOModel>() =>
    // query: Req,
    // params: RequestParams = {},
    httpClient.request<languageResultListMenuResponseDTOModul, any>(
      {
        path: `/business/multiLang-front/initLanguageData`,
        method: 'GET',
        // query: query,
        secure: true,
        // ...params,
      },
      languageResultListMenuResponseDTOModul
    );
  /**
   * 修改模块
   *
   * @tags 管理后台 - 模块
   * @name UpdateMenu
   * @summary 修改模块
   * @request POST:/business/language/update
   * @secure
   */
  static updateBasiclanguage = <Req extends CommonRequestDTOBasiclanguageModel = CommonRequestDTOBasiclanguageModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<BasiclanguageResultLongModuleResultBooleanModule, any>(
      {
        path: `/business/language/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      BasiclanguageResultLongModuleResultBooleanModule
    );
  /**
   * 创建模块
   *
   * @tags 管理后台 - 模块
   * @name CreateMenu
   * @summary 创建模块
   * @request POST:/business/language/create
   * @secure
   */
  static createBasiclanguage = <Req extends CommonRequestDTOBasiclanguageModel = CommonRequestDTOBasiclanguageModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<BasiclanguageResultLongModule, any>(
      {
        path: `/business/language/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      BasiclanguageResultLongModule
    );
  /**
   * @description 用于【模块管理】界面
   *
   * @tags 管理后台 - 模块
   * @name GetMenuList
   * @summary 获取模块列表
   * @request GET:/business/language/page
   * @secure
   */
  static getBasiclanguageList = <Req extends BasiclanguagePageRequestDTOModel = BasiclanguagePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<languageResultListMenuResponseDTOModul, any>(
      {
        path: `/business/language/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      languageResultListMenuResponseDTOModul
    );
  /**
   * 获取模块信息
   *
   * @tags 管理后台 - 模块
   * @name GetMenu
   * @summary 获取模块信息
   * @request GET:/business/language/get
   * @secure
   */
  static getBasiclanguage = <
    Req extends {
      /** @format int64 */
      id: number;
    } = {
      /** @format int64 */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonRequestDTOBasiclanguageModel, any>(
      {
        path: `/business/language/get`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonRequestDTOBasiclanguageModel
    );

  /**
   * 删除模块
   *
   * @tags 管理后台 - 模块
   * @name DeleteMenu
   * @summary 删除模块
   * @request GET:/business/language/delete
   * @secure
   */
  static deleteBasiclanguage = <
    Req extends {
      /**
       * 角色编号
       * @format int64
       * @example 1024
       */
      id: number;
    } = {
      /**
       * 角色编号
       * @format int64
       * @example 1024
       */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<BasiclanguageResultLongModuleResultBooleanModule, any>(
      {
        path: `/business/language/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      BasiclanguageResultLongModuleResultBooleanModule
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemBasiclanguage> = {
//   api: {
//     Sincronizar: {
//       path: "/business/multiLang-front/initLanguageData",
//       method: "POST",
//       type: OpenApiActions.update,
//       paramModel: CommonRequestDTOBasiclanguageModel,
//       responseModel: BasiclanguageResultLongModuleResultBooleanModule,
//       responseDataModel: undefined,
//       // paramSchema: $MenuUpdateRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     getMinBasiclanguage: {
//       path: "/business-api/business/language/list",
//       method: "POST",
//       type: OpenApiActions.update,
//       paramModel: CommonRequestDTOBasiclanguageModel,
//       responseModel: BasiclanguageResultLongModuleResultBooleanModule,
//       responseDataModel: undefined,
//       // paramSchema: $MenuUpdateRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     updateBasiclanguage: {
//       path: "/business/language/update",
//       method: "POST",
//       type: OpenApiActions.update,
//       paramModel: CommonRequestDTOBasiclanguageModel,
//       responseModel: BasiclanguageResultLongModuleResultBooleanModule,
//       responseDataModel: undefined,
//       // paramSchema: $MenuUpdateRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     createBasiclanguage: {
//       path: "/business/language/create",
//       method: "POST",
//       type: OpenApiActions.create,
//       paramModel: CommonRequestDTOBasiclanguageModel,
//       responseModel: BasiclanguageResultLongModule,
//       responseDataModel: undefined,
//       // paramSchema: $MenuCreateRequestDTO,
//       // responseSchema: $CommonResultLong,
//       // responseDataSchema: undefined,
//     },
//     getBasiclanguageList: {
//       path: "/business/language/page",
//       method: "GET",
//       type: OpenApiActions.list,
//       paramModel: CommonRequestDTOBasiclanguageModel,
//       responseModel: languageResultListMenuResponseDTOModul,
//       // paramSchema: $MenuListRequestDTO,
//       // responseSchema: $CommonResultListMenuResponseDTO,
//       // responseDataSchema: $MenuResponseDTO,
//     },
//     getBasiclanguage: {
//       path: "/business/language/get",
//       method: "GET",
//       type: OpenApiActions.get,
//       paramModel: undefined,
//       responseModel: CommonRequestDTOBasiclanguageModel,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultMenuResponseDTO,
//       // responseDataSchema: $MenuResponseDTO,
//     },
//     deleteBasiclanguage: {
//       path: "/business/language/delete",
//       method: "GET",
//       type: OpenApiActions.delete,
//       paramModel: undefined,
//       responseModel: BasiclanguageResultLongModuleResultBooleanModule,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//   },
// };
