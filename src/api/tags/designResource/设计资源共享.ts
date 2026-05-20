import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';

/** 设计活动 / 设计任务资源共享 */
export class AdminApiDesignResourceShare {
  static getShareUsers = (
    body: { bizType: string; bizId: string | number },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/design-resource-share/get`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static saveShareUsers = (
    body: { bizType: string; bizId: string; sharedUserIds?: string[] },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/design-resource-share/save`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
