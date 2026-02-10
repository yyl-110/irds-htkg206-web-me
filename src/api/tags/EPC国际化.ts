// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from './http-client';
import { CommonResultListLanguageResponseDTOModel } from '../models/CommonResultListLanguageResponseDTOModel';
import { LanguageResponseDTOModel } from '../models/LanguageResponseDTOModel';

/**
 * 产品国际化管理
 */
export class EpcApiLanguage {
  /**
   * @description 只包含被开启的系统帮助，主要用于前端的下拉选项
   *
   * @tags 产品国际化 - 列表
   * @name getSimpleLanguage
   * @summary 获取系统国际化信息列表
   * @request GET:/business-api/business/language/list
   * @secure
   */
  static getSimpleLanguage = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListLanguageResponseDTOModel, any>(
      {
        path: `/business/language/list`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultListLanguageResponseDTOModel
    );
}
