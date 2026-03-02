// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import { CommonResultBooleanModel } from '../models/CommonResultBooleanModel';
import { CommonResultDictTypeResponseDTOModel } from '../models/CommonResultDictTypeResponseDTOModel';
import { CommonResultListDictTypeSimpleResponseDTOModel } from '../models/CommonResultListDictTypeSimpleResponseDTOModel';
import { CommonResultLongModel } from '../models/CommonResultLongModel';
import { CommonResultPageResultDictTypeResponseDTOModel } from '../models/CommonResultPageResultDictTypeResponseDTOModel';
import { DictTypeCreateRequestDTOModel } from '../models/DictTypeCreateRequestDTOModel';
import { DictTypePageRequestDTOModel } from '../models/DictTypePageRequestDTOModel';
import { DictTypeResponseDTOModel } from '../models/DictTypeResponseDTOModel';
import { DictTypeSimpleResponseDTOModel } from '../models/DictTypeSimpleResponseDTOModel';
import { DictTypeUpdateRequestDTOModel } from '../models/DictTypeUpdateRequestDTOModel';

/**
 * 管理后台字典类型
 */
export class AdminApiSystemDictType {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台字典类型`;

  /**
   * 修改字典类型
   *
   * @tags 管理后台 - 字典类型
   * @name UpdateDictType
   * @summary 修改字典类型
   * @request POST:/system/dict-type/update
   * @secure
   */
  static updateDictType = <Req extends DictTypeUpdateRequestDTOModel = DictTypeUpdateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/dict-type/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel,
    );
  /**
   * @description 根据ID获取下拉值信息
   *
   * @tags 管理后台 - 获取参数字典
   * @name getSelValListById
   * @summary 根据ID获取下拉值信息
   * @request GET:/admin-api/system/dict-data/list-dict-data
   * @secure
   */
  static getSelValListById = <
    Req extends {
      dictType: string;
    } = {
      dictType: string;
    },
  >(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/system-service/system/dict-data/list-dict-data`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultLongModel,
    );
  /**
   * 创建字典类型
   *
   * @tags 管理后台 - 字典类型
   * @name CreateDictType
   * @summary 创建字典类型
   * @request POST:/system/dict-type/create
   * @secure
   */
  static createDictType = <Req extends DictTypeCreateRequestDTOModel = DictTypeCreateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/system-service/system/dict-type/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel,
    );
  /**
   * 获得字典类型的分页列表
   *
   * @tags 管理后台 - 字典类型
   * @name PageDictTypes
   * @summary 获得字典类型的分页列表
   * @request GET:/system/dict-type/page
   * @secure
   */
  static pageDictTypes = <Req extends DictTypePageRequestDTOModel = DictTypePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultDictTypeResponseDTOModel, any>(
      {
        path: `/system-service/system/dict-type/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultDictTypeResponseDTOModel,
    );
  /**
   * @description 包括开启 + 禁用的字典类型，主要用于前端的下拉选项
   *
   * @tags 管理后台 - 字典类型
   * @name GetSimpleDictTypeList
   * @summary 获得全部字典类型列表
   * @request GET:/admin-api/system/dict-type/list-all-simple
   * @secure
   */
  static getSimpleDictTypeList = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListDictTypeSimpleResponseDTOModel, any>(
      {
        path: `/admin-api/system/dict-type/list-all-simple`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultListDictTypeSimpleResponseDTOModel,
    );
  /**
   * 查询字典类型详细
   *
   * @tags 管理后台 - 字典类型
   * @name GetDictType
   * @summary 查询字典类型详细
   * @request GET:/system/dict-type/get
   * @secure
   */
  static getDictType = <
    Req extends {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    } = {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultDictTypeResponseDTOModel, any>(
      {
        path: `/system-service/system/dict-type/get`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultDictTypeResponseDTOModel,
    );
  /**
   * 删除字典类型
   *
   * @tags 管理后台 - 字典类型
   * @name DeleteDictType
   * @summary 删除字典类型
   * @request GET:/system/dict-type/delete
   * @secure
   */
  static deleteDictType = <
    Req extends {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    } = {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/dict-type/delete`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel,
    );
}
