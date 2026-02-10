import { BaseModel } from '@/utils/BaseModel';
import type { ColumnsBasiclanguage } from '../../tags/data-contracts';

/** 管理后台 - 菜单更新 Request DTO */
export class CommonRequestDTOBasiclanguageModel extends BaseModel implements ColumnsBasiclanguage {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  page: number = 1;
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
  /**
   * 语言
   * @format int32
   * @min 1
   * @example 1
   */
  lang: string = '';
  /**
   * 语言说明
   * @format int32
   * @min 1
   * @example 1
   */
  langDesc: string = '';
  /**
   * 排版
   * @format int32
   * @min 1
   * @example 1
   */
  langDirection: string = '';
  /**
   * 文件id
   * @format int32
   * @min 1
   * @example 1
   */
  fileId?: number = 0;
}
