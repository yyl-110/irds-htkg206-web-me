// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from './http-client';
import { CommonResultListHelpSimpleResponseDTOModel } from '../models/help/CommonResultListHelpSimpleResponseDTOModel';
import { HelpSimpleResponseDTOModel } from '../models/help/HelpSimpleResponseDTOModel';
import { CommonResultListTenantResponseDTOModel } from '../models/CommonResultListTenantResponseDTOModel';
/**
 * 管理后台帮助
 */
export class AdminApiHelp {
  /**
   *
   * @tags 管理后台 - 智能问答
   * @name getSimpleHelps
   * @summary 获取智能问答url
   * @request GET:/business-api/business/question-answer/getIndexUrl
   * @secure
   */
  static getIndexUrl = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListTenantResponseDTOModel, any>(
      {
        path: `/business-api/business/question-answer/getIndexUrl`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultListTenantResponseDTOModel
    );

  /**
   * @description 只包含被开启的系统帮助，主要用于前端的下拉选项
   *
   * @tags 管理帮助 - 系统帮助
   * @name getSimpleHelps
   * @summary 获取系统帮助精简信息列表
   * @request GET:/business/help-content/tree
   * @secure
   */
  static getSimpleHelps = <Req extends HelpSimpleResponseDTOModel = HelpSimpleResponseDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListHelpSimpleResponseDTOModel, any>(
      {
        path: `/business/help-content/tree`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListHelpSimpleResponseDTOModel
    );

  /**
   *
   * @tags 管理帮助 - 获取节点信息
   * @name getDetailData
   * @summary 获取节点信息
   * @request GET:/business/help-content/tree
   * @secure
   */
  static getDetailData = <
    Req extends {
      /** @format int64 */
      id: string;
    } = {
      /** @format int64 */
      id: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListHelpSimpleResponseDTOModel, any>(
      {
        path: `/business/help-content/get`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListHelpSimpleResponseDTOModel
    );

  /**
   *
   * @tags 管理帮助 - 保存节点信息
   * @name helpSave
   * @summary 保存节点信息
   * @request GET:/business/help-content/tree
   * @secure
   */
  static helpSave = <
    Req extends {
      /** @format int64 */
      id: string;
    } = {
      /** @format int64 */
      id: string;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListHelpSimpleResponseDTOModel, any>(
      {
        path: `/business/help-content/create`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultListHelpSimpleResponseDTOModel
    );

  /**
   *
   * @tags 管理帮助 - 修改节点信息
   * @name helpUpdate
   * @summary 保存节点信息
   * @request GET:/business/help-content/tree
   * @secure
   */
  static helpUpdate = <
    Req extends {
      /** @format int64 */
      id: string;
    } = {
      /** @format int64 */
      id: string;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListHelpSimpleResponseDTOModel, any>(
      {
        path: `/business/help-content/update`,
        method: 'POST',
        headers: { 'x-XSs': 1 }, //富文本保存
        body: data,
        secure: true,
        ...params,
      },
      CommonResultListHelpSimpleResponseDTOModel
    );

  /**
   *
   * @tags 管理帮助 - 删除节点信息
   * @name helpDelete
   * @summary 删除节点信息
   * @request GET:/business/help-content/delete
   * @secure
   */
  static helpDelete = <
    Req extends {
      /** @format int64 */
      id: string;
    } = {
      /** @format int64 */
      id: string;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListHelpSimpleResponseDTOModel, any>(
      {
        path: `/business/help-content/delete`,
        method: 'DELETE',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultListHelpSimpleResponseDTOModel
    );

  /**
   *
   * @tags 管理帮助 - 节点排序上移下移
   * @name helpSort
   * @summary 节点排序上移下移
   * @request GET:/business/help-content/sort
   * @secure
   */
  static helpSort = <
    Req extends {
      /** @format int64 */
      id: string;
    } = {
      /** @format int64 */
      id: string;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListHelpSimpleResponseDTOModel, any>(
      {
        path: `/business/help-content/sort`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultListHelpSimpleResponseDTOModel
    );

  /**
   *
   * @tags 管理帮助 - 获取兄弟节点列表
   * @name currentNodeList
   * @summary 获取兄弟节点列表
   * @request GET:/business/help-content/currentNodeList
   * @secure
   */
  static currentNodeList = <
    Req extends {
      /** @format int64 */
      id: string;
    } = {
      /** @format int64 */
      id: string;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListHelpSimpleResponseDTOModel, any>(
      {
        path: `/business/help-content/currentNodeList`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultListHelpSimpleResponseDTOModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiHelp> = {
//   api: {
//     getSimpleHelps: {
//       path: '/business/help-content/tree',
//       method: 'GET',
//       // type: OpenApiActions['list-all-simple'],
//       paramModel: undefined,
//       responseModel: HelpSimpleResponseDTOModel,
//       responseDataModel: undefined,
//     },

//     getDetailData: {
//       path: '/business/help-content/get',
//       method: 'GET',
//       // type: OpenApiActions['list-all-simple'],
//       paramModel: HelpSimpleResponseDTOModel,
//       responseModel: HelpSimpleResponseDTOModel,
//       responseDataModel: HelpSimpleResponseDTOModel,
//     },

//     helpSave: {
//       path: '/business/help-content/create',
//       method: 'POST',
//       // type: OpenApiActions['list-all-simple'],
//       paramModel: HelpSimpleResponseDTOModel,
//       responseModel: CommonResultListHelpSimpleResponseDTOModel,
//       responseDataModel: HelpSimpleResponseDTOModel,
//     },

//     helpUpdate: {
//       path: '/business/help-content/update',
//       method: 'POST',
//       // type: OpenApiActions['list-all-simple'],
//       paramModel: HelpSimpleResponseDTOModel,
//       responseModel: CommonResultListHelpSimpleResponseDTOModel,
//       responseDataModel: HelpSimpleResponseDTOModel,
//     },

//     helpDelete: {
//       path: '/business/help-content/delete',
//       method: 'DELETE',
//       // type: OpenApiActions.delete,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//     },

//     helpSort: {
//       path: '/business/help-content/sort',
//       method: 'POST',
//       // type: OpenApiActions['list-all-simple'],
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//     },

//     currentNodeList: {
//       path: '/business/help-content/currentNodeList',
//       method: 'GET',
//       // type: OpenApiActions['list-all-simple'],
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//     },
//   },
// };
