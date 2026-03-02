// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import { CommonResultBooleanModel } from '../models/CommonResultBooleanModel';
import { CommonResultDictDataResponseDTOModel } from '../models/CommonResultDictDataResponseDTOModel';
import { CommonResultListDictDataSimpleResponseDTOModel } from '../models/CommonResultListDictDataSimpleResponseDTOModel';
import { CommonResultLongModel } from '../models/CommonResultLongModel';
import { CommonResultPageResultDictDataResponseDTOModel } from '../models/CommonResultPageResultDictDataResponseDTOModel';
import { DictDataCreateRequestDTOModel } from '../models/DictDataCreateRequestDTOModel';
import { DictDataPageRequestDTOModel } from '../models/DictDataPageRequestDTOModel';
import { DictDataResponseDTOModel } from '../models/DictDataResponseDTOModel';
import { DictDataSimpleResponseDTOModel } from '../models/DictDataSimpleResponseDTOModel';
import { DictDataUpdateRequestDTOModel } from '../models/DictDataUpdateRequestDTOModel';

/**
 * 管理后台字典数据
 */
export class AdminApiSystemDictData {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台字典数据`;

  /**
   * 修改字典数据
   *
   * @tags 管理后台 - 字典数据
   * @name UpdateDictData
   * @summary 修改字典数据
   * @request POST:/admin-api/system/dict-data/update
   * @secure
   */
  static updateDictData = <Req extends DictDataUpdateRequestDTOModel = DictDataUpdateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/dict-data/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel,
    );
  /**
   * 新增字典数据
   *
   * @tags 管理后台 - 字典数据
   * @name CreateDictData
   * @summary 新增字典数据
   * @request POST:/admin-api/system/dict-data/create
   * @secure
   */
  static createDictData = <Req extends DictDataCreateRequestDTOModel = DictDataCreateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/admin-api/system/dict-data/create`,
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
   * @tags 管理后台 - 字典数据
   * @name GetDictTypePage
   * @summary 获得字典类型的分页列表
   * @request GET:/system/dict-data/page
   * @secure
   */
  static getDictTypePage = <Req extends DictDataPageRequestDTOModel = DictDataPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultDictDataResponseDTOModel, any>(
      {
        path: `/system-service/system/dict-data/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultDictDataResponseDTOModel,
    );
  /**
   * @description 一般用于管理后台缓存字典数据在本地
   *
   * @tags 管理后台 - 字典数据
   * @name GetSimpleDictDataList
   * @summary 获得全部字典数据列表
   * @request GET:/system-service/system/dict-data/list-all-simple
   * @secure
   */
  static getSimpleDictDataList = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListDictDataSimpleResponseDTOModel, any>(
      {
        path: `/system-service/system/dict-data/list-all-simple`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultListDictDataSimpleResponseDTOModel,
    );
  /**
   * 查询字典数据详细
   *
   * @tags 管理后台 - 字典数据
   * @name GetDictData
   * @summary 查询字典数据详细
   * @request GET:/admin-api/system/dict-data/get
   * @secure
   */
  static getDictData = <
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
    httpClient.request<CommonResultDictDataResponseDTOModel, any>(
      {
        path: `/admin-api/system/dict-data/get`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultDictDataResponseDTOModel,
    );
  /**
   * 删除字典数据
   *
   * @tags 管理后台 - 字典数据
   * @name DeleteDictData
   * @summary 删除字典数据
   * @request GET:/system/dict-data/delete
   * @secure
   */
  static deleteDictData = <
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
        path: `/system-service/system/dict-data/delete`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel,
    );
}
