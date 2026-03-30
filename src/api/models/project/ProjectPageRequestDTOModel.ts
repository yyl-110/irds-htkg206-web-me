import { BaseModel } from '@/utils/BaseModel';
import type { ProjectInfoRequestPO } from '../../tags/project/projectInfo';

/** 数据 */
export class ProjectPageRequestDTOModel extends BaseModel implements ProjectInfoRequestPO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  currentPage: number = 0;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  numberPage: number = 0;

  pageNo: number = 0;
  pageSize: number = 0;

  /**
   *  项目名称
   * @example ""
   */
  projectName?: string = '';
  /**
   * 项目编号
   * @example ""
   */
  projectNum?: string = '';

  /**
   * 产品平台ID
   * @example ""
   */
  productPlatformId?: string = '';

  /**
   * 项目状态
   * @example ""
   */
  projectstatus?: string = '';

  id?: string = '';

  userid?: number = 0;
}
