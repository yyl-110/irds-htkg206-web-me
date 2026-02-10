// import {
//   OpenApiActions,
//   type OpenApiTag,
// } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import { CommonResultBooleanModel } from '../models/CommonResultBooleanModel';
import { CommonResultListUserListItemResponseDTOModel } from '../models/CommonResultListUserListItemResponseDTOModel';
import { CommonResultListUserSimpleResponseDTOModel } from '../models/CommonResultListUserSimpleResponseDTOModel';
import { CommonResultLongModel } from '../models/CommonResultLongModel';
import { CommonResultPageResultUserPageItemResponseDTOModel } from '../models/CommonResultPageResultUserPageItemResponseDTOModel';
import { CommonResultUserResponseDTOModel } from '../models/CommonResultUserResponseDTOModel';
import { UserCreateRequestDTOModel, SubaccountRequestDTOModel } from '../models/UserCreateRequestDTOModel';
import { UserListItemResponseDTOModel } from '../models/UserListItemResponseDTOModel';
import { UserPageItemResponseDTOModel } from '../models/UserPageItemResponseDTOModel';
import { UserPageRequestDTOModel } from '../models/UserPageRequestDTOModel';
import { UserResponseDTOModel } from '../models/UserResponseDTOModel';
import { UserSimpleResponseDTOModel } from '../models/UserSimpleResponseDTOModel';
import { UserUpdatePasswordRequestDTOModel } from '../models/UserUpdatePasswordRequestDTOModel';
import { UserUpdateRequestDTOModel } from '../models/UserUpdateRequestDTOModel';
import { UserUpdateStatusRequestDTOModel, UserUDeactivateRequestDTOModel } from '../models/UserUpdateStatusRequestDTOModel';
import { CommonResultFileUploadResponseDTOModel } from '../models/CommonResultFileUploadResponseDTOModel';

/**
 * 管理后台用户
 */
export class AdminApiSystemUser {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台用户`;

  /**
   * 备品替换 导出
   *
   * @tags 管理后台 - 备品替换
   * @name excelExport
   * @summary 备品替换 导出
   * @request GET:/business-api/business/spare-replace-manual/export
   * @secure
   */
  static excelExport = (params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/export`,
        method: 'GET',
        secure: true,
        format: 'blob', // 返回二进制流
        ...params,
      },
      CommonResultLongModel
    );
  /**
   * 新增用户
   *
   * @tags 管理后台 - 用户
   * @name CreateUser
   * @summary 新增用户
   * @request POST:/system/epc-user/create
   * @secure
   */
  static updatepasswor = <Req extends any = any>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/update-password`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel
    );
  /**
   * 更新用户子账号
   *
   * @tags 更新用户子账号 - 用户
   * @name CreateUser
   * @summary 更新用户子账号
   * @request POST:/user-sub-account/update
   * @secure
   */
  static updateaccount = <Req extends any = any>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/user-sub-account/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel
    );
  /**
   * 获取用户子账号列表
   *
   * @tags 管理后台 - 用户
   * @name GetInfo
   * @summary 获取用户子账号列表
   * @request
   * @secure
   */
  static getListByUser = <
    Req extends {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      userId: string;
    } = {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      userId: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultUserResponseDTOModel, any>(
      {
        path: `/user-sub-account/getListByUser`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultUserResponseDTOModel
    );
  /**
   * 删除用户子账号
   *
   * @tags 管理后台 - 用户
   * @name GetInfo
   * @summary 删除用户子账号
   * @request
   * @secure
   */
  static deleteaccountUser = <
    Req extends {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: string;
    } = {
      /**
       * 编号
       * @format int64
       * @example 1024
       */
      id: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultUserResponseDTOModel, any>(
      {
        path: `/user-sub-account/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultUserResponseDTOModel
    );

  /**
   * 新增用户
   *
   * @tags 管理后台 - 用户
   * @name CreateUser
   * @summary 新增用户
   * @request POST:/system/epc-user/create
   * @secure
   */
  static createUserSubaccount = <Req extends SubaccountRequestDTOModel = SubaccountRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/user-sub-account/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel
    );
  /**
   * 修改用户
   *
   * @tags 管理后台 - 用户
   * @name UpdateUser
   * @summary 修改用户
   * @request POST:/system/user/update
   * @secure
   */
  static updateUser = <Req extends UserUpdateRequestDTOModel = UserUpdateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 修改用户停用状态
   *
   * @tags 管理后台 - 用户
   * @name UpdateUserStatus
   * @summary 修改用户停用状态
   * @request POST:/system/epc-user/update-status
   * @secure
   */
  static updateDeactivate = <Req extends UserUDeactivateRequestDTOModel = UserUDeactivateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/updateDeactivate`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 修改用户状态
   *
   * @tags 管理后台 - 用户
   * @name UpdateUserStatus
   * @summary 修改用户状态
   * @request POST:/system/epc-user/update-status
   * @secure
   */
  static updateUserStatus = <Req extends UserUpdateStatusRequestDTOModel = UserUpdateStatusRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/update-status`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 重置用户密码
   *
   * @tags 管理后台 - 用户
   * @name UpdateUserPassword
   * @summary 重置用户密码
   * @request POST:/admin-api/system/user/update-password
   * @secure
   */
  static updateUserPassword = <Req extends UserUpdatePasswordRequestDTOModel = UserUpdatePasswordRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/user/update-password`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 新增用户
   *
   * @tags 管理后台 - 用户
   * @name CreateUser
   * @summary 新增用户
   * @request POST:/system/epc-user/create
   * @secure
   */
  static createUser = <Req extends UserCreateRequestDTOModel = UserCreateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel
    );
  /**
   * 获得用户分页列表
   *
   * @tags 管理后台 - 用户
   * @name GetUserPage
   * @summary 获得用户分页列表
   * @request GET:/admin-api/system/epc-user/page
   * @secure
   */
  static getUserPage = <Req extends UserPageRequestDTOModel = UserPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultUserPageItemResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultUserPageItemResponseDTOModel
    );
  /**
   * 获得用户分页列表
   *
   * @tags 管理后台 - 用户
   * @name GetUserPageRigth
   * @summary 获得用户分页列表
   * @request GET:/admin-api/system/user/page-right
   * @secure
   */
  static getUserPageRigth = <Req extends UserPageRequestDTOModel = UserPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultUserPageItemResponseDTOModel, any>(
      {
        path: `/admin-api/system/user/page-right`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultUserPageItemResponseDTOModel
    );
  /**
   * 获取指定ids的所有用户及其部门详情
   *
   * @tags 管理后台 - 用户
   * @name GetUserList
   * @summary 获取指定ids的所有用户及其部门详情
   * @request GET:/admin-api/system/user/list
   * @secure
   */
  static getUserList = <
    Req extends {
      /**
       * 编号列表
       * @example "1,19"
       */
      ids: Array<number>;
    } = {
      /**
       * 编号列表
       * @example "1,19"
       */
      ids: Array<number>;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListUserListItemResponseDTOModel, any>(
      {
        path: `/admin-api/system/user/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListUserListItemResponseDTOModel
    );
  /**
   * @description 只包含被开启的用户，主要用于前端的下拉选项
   *
   * @tags 管理后台 - 用户
   * @name GetSimpleUsers
   * @summary 获取用户精简信息列表
   * @request GET:/system/user/list-all-simple
   * @secure
   */
  static getSimpleUsers = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListUserSimpleResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/list-all-simple`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultListUserSimpleResponseDTOModel
    );
  /**
   * @description 只包含被开启的用户，主要用于前端的下拉选项
   *
   * @tags 管理后台 - 用户
   * @name GetSimpleUsersRight
   * @summary 获取用户精简信息列表
   * @request GET:/system/user/list-all-simple-right
   * @secure
   */
  static getSimpleUsersRight = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListUserSimpleResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/user/list-all-simple-right`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultListUserSimpleResponseDTOModel
    );
  /**
   * 获得用户详情
   *
   * @tags 管理后台 - 用户
   * @name GetInfo
   * @summary 获得用户详情
   * @request GET:/system/epc-user/get
   * @secure
   */
  static getInfo = <
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
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultUserResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/get`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultUserResponseDTOModel
    );
  /**
   * 获得用户头像
   *
   * @tags 管理后台 - 用户
   * @name GetAvatar
   * @summary 获得用户头像
   * @request GET:/admin-api/system/user/getAvatar
   * @secure
   */
  static getAvatar = <
    Req extends {
      /**
       * 工号
       * @example 1024
       */
      workCard: string;
    } = {
      /**
       * 工号
       * @example 1024
       */
      workCard: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/user/getAvatar`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * 删除用户
   *
   * @tags 管理后台 - 用户
   * @name DeleteUser1
   * @summary 删除用户
   * @request GET:/system/epc-user/delete
   * @secure
   */
  static deleteUser1 = <
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
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/epc-user/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );

  /**
   * 文件上传 用户导入接口

   *
   * @tags 管理后台 - 上传
   * @name uploadFile
   * @summary  文件上传
   * @request POST:/systemmgr-api/systemmgr/qd-uniqueIdentifier/import
   * @secure
   */
  static uploadFile = <
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
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `/systemmgr-api/systemmgr/qd-uniqueIdentifier/import`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel
    );
  /**
   * 获得用户消息提示
   *
   * @tags 管理后台 - 用户
   * @name GetAvatar
   * @summary 获得用户消息提示
   * @request POST:/cirpoint-module-api/ckProjectInfo/getTaskMessage
   * @secure
   */
  static getTaskMessage = <
    Req extends {
      /**
       * 用户id
       * @example 1024
       */
      userId: string;
    } = {
      /**
       * 用户id
       * @example 1024
       */
      userId: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getTaskMessage`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel
    );

  /**
   * 同步pdm用户
   *
   * @tags 管理后台 - 同步pdm用户
   * @name syncWTUser
   * @summary 同步pdm用户
   * @request GET:/cirpoint-module-api/pdmSystem/syncWTUser
   * @secure
   */
  static syncWTUser = <Req extends {} = {}>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/syncWTUser`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultLongModel
    );
}
