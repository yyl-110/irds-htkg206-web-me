import { ContentType, httpClient, type RequestParams } from '../http-client';
import { InformationTreeResponseDTOModel } from '../../models/information/InformationTreeResponseDTOModel';
import { InformationTreeResponsePOModel } from '../../models/information/InformationTreeResponsePOModel';
import { CommonResultInformationTreeResponseDTOModel } from '../../models/information/CommonResultInformationTreeResponseDTOModel';
import { InformationPageRequestDTOModel } from '../../models/information/InformationPageRequestDTOModel';
import { CommonResultPageResultInformationPOModel } from '../../models/information/CommonResultPageResultInformationPOModel';
import { InformationPOModel } from '../../models/information/InformationPOModel';
import { PageResultInformationPOModel } from '../../models/information/PageResultInformationPOModel';
import qs from 'qs';
/**
 * 管理后台资料管理
 */
export class AdminApiInformation {
  /**
   * @description 只包含被开启的服务资料管理
   *
   * @tags 资料管理 - 服务资料管理
   * @name getInformationTree
   * @summary 获取服务资料分类结构树列表
   * @request GET:/business-api/business/info-doc-dir/tree-list
   * @secure
   */
  static getInformationTree = <Req extends InformationTreeResponseDTOModel = InformationTreeResponseDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultInformationTreeResponseDTOModel, any>(
      {
        path: `/business-api/business/info-doc-dir/tree-list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultInformationTreeResponseDTOModel
    );

  /**
   * @description 根据ID获取树节点子节点
   *
   * @tags 资料管理 - 服务资料管理
   * @name getInformationTreeByPid
   * @summary 根据ID获取树节点子节点
   * @request GET:/business-api/business/info-doc-dir/tree-list
   * @secure
   */
  static getInformationTreeByPid = <Req extends InformationTreeResponseDTOModel = InformationTreeResponseDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultInformationTreeResponseDTOModel, any>(
      {
        path: `/business-api/business/info-doc-dir/child-list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultInformationTreeResponseDTOModel
    );

  /**
   *
   * @tags 资料管理 - 保存节点信息
   * @name informationTreeSave
   * @summary 保存节点信息
   * @request GET:/business-api/business/info-doc-dir/create
   * @secure
   */
  static informationTreeSave = <
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
    httpClient.request<CommonResultInformationTreeResponseDTOModel, any>(
      {
        path: `/business-api/business/info-doc-dir/create`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultInformationTreeResponseDTOModel
    );

  /**
   *
   * @tags 资料管理 - 修改节点信息
   * @name helpUpdate
   * @summary informationTreeUpdate
   * @request GET:/business-api/business/info-doc-dir/update
   * @secure
   */
  static informationTreeUpdate = <
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
    httpClient.request<CommonResultInformationTreeResponseDTOModel, any>(
      {
        path: `/business-api/business/info-doc-dir/update`,
        method: 'POST',
        headers: { 'x-XSs': 1 }, //富文本保存
        body: data,
        secure: true,
        ...params,
      },
      CommonResultInformationTreeResponseDTOModel
    );
  /**
   *
   * @tags 资料管理 - 获取节点信息
   * @name getDetailData
   * @summary 获取节点信息
   * @request GET:/business-api/business/info-doc-dir/get
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
    httpClient.request<InformationTreeResponsePOModel, any>(
      {
        path: `/business-api/business/info-doc-dir/get`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      InformationTreeResponsePOModel
    );

  /**
   *
   * @tags 资料管理 - 删除节点信息
   * @name informationTreeDelete
   * @summary 删除节点信息
   * @request GET:/business-api/business/info-doc-dir/delete
   * @secure
   */
  static informationTreeDelete = <
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
    httpClient.request<CommonResultInformationTreeResponseDTOModel, any>(
      {
        path: `/business-api/business/info-doc-dir/delete`,
        method: 'DELETE',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultInformationTreeResponseDTOModel
    );

  /**
   *
   * @tags 资料管理 - 节点排序上移下移
   * @name informationTreeSort
   * @summary 节点排序上移下移
   * @request GET:/business-api/business/info-doc-dir/sort
   * @secure
   */
  static informationTreeSort = <
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
    httpClient.request<CommonResultInformationTreeResponseDTOModel, any>(
      {
        path: `/business-api/business/info-doc-dir/sort`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultInformationTreeResponseDTOModel
    );

  /**
   *
   * @tags 资料管理 - 获取兄弟节点列表
   * @name currentNodeList
   * @summary 获取兄弟节点列表
   * @request GET:/admin-api/business/info-doc-dir/currentNodeList
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
    httpClient.request<CommonResultInformationTreeResponseDTOModel, any>(
      {
        path: `/business-api/business/info-doc-dir/currentNodeList`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultInformationTreeResponseDTOModel
    );

  /**
   * 服务资料查看 分页
   *
   * @tags 前端 - 服务资料查看
   * @name getInformationPage
   * @summary 获得服务资料查看 分页
   * @request GET:/business-api/business/doc/page
   * @secure
   */
  static getInformationPage = <Req extends InformationPageRequestDTOModel = InformationPageRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultInformationPOModel, any>(
      {
        path: `/business-api/business/doc/page`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultPageResultInformationPOModel
    );

  /**
   *
   * @tags 资料管理 - 保存数据
   * @name saveInformation
   * @summary 保存数据
   * @request GET:/business-api/business/doc/create
   * @secure
   */
  static saveInformation = <Req extends InformationPOModel = InformationPOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultInformationPOModel, any>(
      {
        path: `/business-api/business/doc/create`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPageResultInformationPOModel
    );

  /**
   *
   * @tags 资料管理 - 根据ID查询详情
   * @name getInformationDetail
   * @summary 根据ID查询详情
   * @request GET:/business-api/business/doc/detail
   * @secure
   */
  static getInformationDetail = <
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
    httpClient.request<CommonResultPageResultInformationPOModel, any>(
      {
        path: `/business-api/business/doc/detail`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultPageResultInformationPOModel
    );

  /**
   *
   * @tags 资料管理 - 根据ID删除数据
   * @name deleteInformation
   * @summary 根据ID删除数据
   * @request GET:/business-api/business/doc/delete
   * @secure
   */
  static deleteInformation = <
    Req extends {
      /** @format int64 */
      ids: Array<String>;
    } = {
      /** @format int64 */
      ids: Array<String>;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultInformationPOModel, any>(
      {
        path: `/business-api/business/doc/delete`,
        method: 'DELETE',
        query: data,
        secure: true,
        type: ContentType.Json,
        ...params,
        // 对象序列化
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      },
      CommonResultPageResultInformationPOModel
    );

  /**
   *
   * @tags 资料管理 - 修改数据
   * @name updateInformation
   * @summary 修改数据
   * @request GET:/business-api/business/doc/update
   * @secure
   */
  static updateInformation = <Req extends InformationPOModel = InformationPOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultInformationPOModel, any>(
      {
        path: `/business-api/business/doc/update`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPageResultInformationPOModel
    );

  /**
   *
   * @tags 资料管理 - 修改发布状态
   * @name updateInformationType
   * @summary 修改发布状态
   * @request GET:/business-api/business/doc/stop
   * @secure
   */
  static updateInformationType = <
    Req extends {
      /** @format int64 */
      id: string;
      type: number;
    } = {
      /** @format int64 */
      id: string;
      type: number;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultInformationPOModel, any>(
      {
        path: `/business-api/business/doc/stop`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPageResultInformationPOModel
    );

  /**
   *
   * @tags 保养说明书 - 保养说明书列表
   * @name updateInformationType
   * @summary 保养说明书列表
   * @request GET:/document/page
   * @secure
   */
  static getManualPage = <Req extends InformationPageRequestDTOModel = InformationPageRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultInformationPOModel, any>(
      {
        path: `/document/page`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultPageResultInformationPOModel
    );

  /**
   *
   * @tags 根据编号查询文件详情
   * @name updateInformationType
   * @summary 根据编号查询文件详情
   * @request GET:/business-api/business/doc/findByDocNumber
   * @secure
   */
  static getFindByDocNumber = <Req extends { partNumber: string } = { partNumber: string }>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultInformationPOModel, any>(
      {
        path: `/business-api/business/doc/findByDocNumber`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultPageResultInformationPOModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiInformation> = {
//   api: {
//     getInformationTree: {
//       path: '/business-api/business/info-doc-dir/tree-list',
//       method: 'GET',
//       type: OpenApiActions['list-all-simple'],
//       paramModel: undefined,
//       responseModel: InformationTreeResponseDTOModel,
//       responseDataModel: undefined,
//     },

//     getDetailData: {
//       path: '/business-api/business/info-doc-dir/get',
//       method: 'GET',
//       type: OpenApiActions['list-all-simple'],
//       paramModel: undefined,
//       responseModel: InformationTreeResponsePOModel,
//       responseDataModel: InformationTreeResponsePOModel,
//     },

//     informationTreeSave: {
//       path: '/business-api/business/info-doc-dir/create',
//       method: 'POST',
//       type: OpenApiActions['list-all-simple'],
//       paramModel: InformationTreeResponseDTOModel,
//       responseModel: InformationTreeResponseDTOModel,
//       responseDataModel: InformationTreeResponseDTOModel,
//     },

//     informationTreeUpdate: {
//       path: '/business-api/business/info-doc-dir/update',
//       method: 'POST',
//       type: OpenApiActions['list-all-simple'],
//       paramModel: InformationTreeResponseDTOModel,
//       responseModel: InformationTreeResponseDTOModel,
//       responseDataModel: InformationTreeResponseDTOModel,
//     },

//     informationTreeDelete: {
//       path: '/business-api/business/info-doc-dir/delete',
//       method: 'DELETE',
//       type: OpenApiActions.delete,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//     },

//     informationTreeSort: {
//       path: '/business-api/business/info-doc-dir/sort',
//       method: 'POST',
//       type: OpenApiActions['list-all-simple'],
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//     },

//     currentNodeList: {
//       path: '/business-api/business/info-doc-dir/currentNodeList',
//       method: 'GET',
//       type: OpenApiActions['list-all-simple'],
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//     },

//     getInformationPage: {
//       path: '/business-api/business/doc/page',
//       method: 'GET',
//       type: OpenApiActions.page,
//       paramModel: PageResultInformationPOModel,
//       responseModel: CommonResultPageResultInformationPOModel,
//       responseDataModel: InformationPOModel,
//     },

//     updateInformationType: {
//       path: '/business-api/business/doc/stop',
//       method: 'GET',
//       type: OpenApiActions.page,
//       paramModel: PageResultInformationPOModel,
//       responseModel: CommonResultPageResultInformationPOModel,
//       responseDataModel: InformationPOModel,
//     },

//     getManualPage: {
//       path: '/document/page',
//       method: 'GET',
//       type: OpenApiActions.page,
//       paramModel: PageResultInformationPOModel,
//       responseModel: CommonResultPageResultInformationPOModel,
//       responseDataModel: InformationPOModel,
//     },
//   },
// };
