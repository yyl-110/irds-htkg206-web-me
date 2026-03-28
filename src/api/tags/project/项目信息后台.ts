import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { ProjectPageRequestDTOModel } from '@/api/models/project/ProjectPageRequestDTOModel';

/**
 * 公告管理
 */
export class AdminApiProductTemp {
  /**
   * 获得项目信息列表信息
   *
   * @tags 管理后台 - 获得项目信息列表信息
   * @name getProjectPageList
   * @summary 获得项目信息列表信息
   * @request /business-service/business/product-temp/page
   * @secure
   */
  static getProjectPageList = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/page`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
