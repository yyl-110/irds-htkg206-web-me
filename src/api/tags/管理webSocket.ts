// import { type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import { AuthLoginRequestDTOModel, AuthLoginSMSRequestDTOModel } from '../models/AuthLoginRequestDTOModel';
import { AuthLoginResponseDTOModel } from '../models/AuthLoginResponseDTOModel';
import { AuthMenuResponseDTOModel } from '../models/AuthMenuResponseDTOModel';
import { AuthPermissionInfoResponseDTOModel } from '../models/AuthPermissionInfoResponseDTOModel';
import { CommonResultAuthLoginResponseDTOModel } from '../models/CommonResultAuthLoginResponseDTOModel';
import { CommonResultAuthPermissionInfoResponseDTOModel } from '../models/CommonResultAuthPermissionInfoResponseDTOModel';
import { CommonResultBooleanModel } from '../models/CommonResultBooleanModel';
import { CommonResultListAuthMenuResponseDTOModel } from '../models/CommonResultListAuthMenuResponseDTOModel';
import { CommonResultStringModel } from '../models/CommonResultStringModel';

/**
 * 管理后台认证
 */
export class AdminApiwebSocketAuth {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台认证`; /**
   *
   *
   * @tags 管理后台 webSocket - 认证
   * @name checkJumpParams
   * @summary
   * @request GET:/cirpoint-base-api/folderManagerController/compressedFile
   * @secure
   */
  static compressedFile = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/folderManagerController/compressedFile`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel,
    );

  /**
   *
   *
   * @tags 管理后台 webSocket - 添加日志
   * @name checkJumpParams
   * @summary
   * @request GET:/cirpoint-module-api/moduleinfos/setOperationalModel.json
   * @secure
   */
  static setOperationalModel = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/setOperationalModel.json`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel,
    );

  /**
   *
   *
   * @tags 管理后台 webSocket - prt 调用申请件号
   * @name checkJumpParams
   * @summary
   * @request GET:/cirpoint-module-api/moduleinfos/getBomNewNumber
   * @secure
   */
  static getBomNewNumberApi = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getBomNewNumber`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel,
    );
  /**
   *
   *
   * @tags 管理后台 webSocket - 获取模型结构树接口
   * @name checkJumpParams
   * @summary
   * @request GET:/cirpoint-module-api/moduleinfos/getBomInfo
   * @secure
   */
  static getBomInfoTestApi = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/moduleinfos/getBomInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel,
    );

  /**
   *
   *
   * @tags 管理后台 webSocket - 参数化设计
   * @name checkJumpParams
   * @summary
   * @request GET:/business-service/business/library-module-number/getLibraryModuleNumberInfo
   * @secure
   */
  static modelDesignParametric = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/business-service/business/library-module-number/getLibraryModuleNumberInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel,
    );

  /**
   *
   *
   * @tags 管理后台 webSocket - 申请件号
   * @name checkJumpParams
   * @summary
   * @request /business-service/business/library-module-number/getModuleNumber
   * @secure
   */
  static getModuleNumber = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/business-service/business/library-module-number/getModuleNumber`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel,
    );
  /**
   *
   *
   * @tags 管理后台 webSocket - 参数化设计保存
   * @name checkJumpParams
   * @summary
   * @request /business-service/business/library-module-histroy/parametricDesignSave
   * @secure
   */
  static parametricDesignSave = (query: any, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/business-service/business/library-module-histroy/parametricDesignSave`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel,
    );
}
