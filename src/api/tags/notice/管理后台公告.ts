// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { NoticePageRequestDTOModel } from '@/api/models/notice/NoticePageRequestDTOModel';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
/**
 * 公告管理
 */
export class AdminApiSystemNotice {
  /**
   * 获得公告列表信息
   *
   * @tags 管理后台 - 公告
   * @name GetNoticeList
   * @summary 获得公告信息
   * @request /system-service/notice/getNoticePageList.json
   * @secure
   */
  static getNoticePageList = <Req extends NoticePageRequestDTOModel = NoticePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/system-service/notice/page`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获得公告列表信息
   *
   * @tags 管理后台 - 公告
   * @name GetNoticeList
   * @summary 获得公告信息
   * @request /system-service/notice/getNoticePageList.json
   * @secure
   */
  static getNoticePageListToWork = <Req extends NoticePageRequestDTOModel = NoticePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/system-service/notice/pageWork`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获得公告信息
   *
   * @tags 管理后台 - 公告
   * @name getNoticeInfoById
   * @summary 获得公告信息
   * @request POST:/system-service/notice/getNoticeDetail
   * @secure
   */
  static getNoticeInfoById = <Req extends NoticePageRequestDTOModel = NoticePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<NoticeInfoRequestDTOModel, any>(
      {
        path: `/system-service/notice/getNoticeDetail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      NoticeInfoRequestDTOModel,
    );

  /**
   * 发布公告
   *
   * @tags 管理后台 - 发布公告
   * @name noticeRelease
   * @summary 发布公告
   * @request POST:/system-service/notice/noticeRelease.json
   * @secure
   */
  static noticeRelease = <Req extends NoticePageRequestDTOModel = NoticePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<NoticeInfoRequestDTOModel, any>(
      {
        path: `/system-service/notice/noticeRelease`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      NoticeInfoRequestDTOModel,
    );

  /**
   * 撤销发布
   *
   * @tags 管理后台 - 撤销发布
   * @name goBackNotice
   * @summary 撤销发布
   * @request POST:/system-service/notice/goBackNotice
   * @secure
   */
  static goBackNotice = <Req extends NoticePageRequestDTOModel = NoticePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<NoticeInfoRequestDTOModel, any>(
      {
        path: `/system-service/notice/goBackNotice`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      NoticeInfoRequestDTOModel,
    );

  /**
   * 删除公告
   *
   * @tags 管理后台 - 公告
   * @name deleteNotice
   * @summary 删除公告
   * @request GET:/system/role/delete
   * @secure
   */
  static deleteNotice = <
    Req extends {
      id: number;
    } = {
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<NoticeInfoRequestDTOModel, any>(
      {
        path: `/system-service/notice/noticeDelete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      NoticeInfoRequestDTOModel,
    );

  /**
   * 保存数据
   *
   * @tags 保存数据
   * @name noticeSave
   * @summary 保存数据
   * @request POST:/system-service/notice/noticeSave.json;
   * @secure
   */
  static noticeSave = <Req extends NoticePageRequestDTOModel = NoticePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<NoticeInfoRequestDTOModel, any>(
      {
        path: `/system-service/notice/noticeSave`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      NoticeInfoRequestDTOModel,
    );

  /**
   * 修改数据
   *
   * @tags 修改数据
   * @name noticeUpdate
   * @summary 修改数据
   * @request POST:/system-service/notice/noticeUpdate;
   * @secure
   */
  static noticeUpdate = <Req extends NoticePageRequestDTOModel = NoticePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<NoticeInfoRequestDTOModel, any>(
      {
        path: `/system-service/notice/noticeUpdate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      NoticeInfoRequestDTOModel,
    );

  /**
   * 获得公告详情
   *
   * @tags 获得公告详情
   * @name getNoticeDetail
   * @summary 获得公告详情
   * @request /system-service/notice/getNoticeDetail
   * @secure
   */
  static getNoticeDetail = <Req extends NoticePageRequestDTOModel = NoticePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/system-service/notice/getNoticeDetail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
