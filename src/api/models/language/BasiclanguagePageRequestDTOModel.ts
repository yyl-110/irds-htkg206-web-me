import { BaseModel } from '@/utils/BaseModel';
import type { BasiclanguagePageRequestDTO } from '../../tags/data-contracts';

/** 管理后台 - 角色分页 Request DTO */
export class BasiclanguagePageRequestDTOModel extends BaseModel implements BasiclanguagePageRequestDTO {
  name?: string | undefined;
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  // page: number = 1;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 10;
  /**
   * 语言
   * @example "中文"
   */
  searchKey?: string = '';
  pageNo: number = 0;
}
