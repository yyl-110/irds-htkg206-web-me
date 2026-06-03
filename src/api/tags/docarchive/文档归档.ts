import { ContentType, httpClient, type RequestParams } from '../http-client';

const PREFIX = '/business-service/business';

/** 文档手动上传归档 */
export class AdminApiDocumentArchive {
  static getCategoryTree = (params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive-category/tree-list`,
        method: 'POST',
        secure: true,
        ...params,
      },
      Object,
    );

  static createCategory = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive-category/create`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static updateCategory = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive-category/update`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static deleteCategory = (body: { id: string | number }, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive-category/delete`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static sortCategoryUp = (body: { id: string | number }, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive-category/sort/up`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static sortCategoryDown = (body: { id: string | number }, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive-category/sort/down`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static getArchivePage = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive/page`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static createArchive = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive/create`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static updateArchive = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive/update`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static upgradeArchive = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive/upgrade`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static deleteArchive = (body: { id: string | number }, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive/delete`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );

  static listHistory = (body: { id?: string | number; docGroupId?: string | number }, params: RequestParams = {}) =>
    httpClient.request<any, any>(
      {
        path: `${PREFIX}/document-archive/history/list`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      Object,
    );
}
