import { BaseModel } from '@/utils/BaseModel';
import type { LanguagePageRequestDTO } from '../../tags/data-contracts';

/** 管理后台 - 角色分页 Request DTO */
export class LanguagePageRequestDTOModel extends BaseModel implements LanguagePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number = 0;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 0;
  /**
   * 语言，模糊匹配
   * @example ""
   */
  searchKey?: string = '';
}

/** 管理后台 - 角色分页 Request DTO */
export class LanguageRequestDTOModel extends BaseModel {
  /**
   * 用户id
   * @format int32
   * @min 1
   * @example 1
   */
  userId: string = '';
  /**
   * 语言
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  language: string = '';
}
