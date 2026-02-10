import { BaseModel } from '@/utils/BaseModel';
import type { Param } from '../tags/data-contracts';

/** 表格字段 */
export class ParamModel extends BaseModel implements Param {
  /**
   * 显示顺序
   * @format int32
   * @example 1
   */
  sort: number = 0;
  /**
   * 字段中文名称
   * @example "姓名"
   */
  name?: string = '';
  /**
   * 字段英文名称
   * @example "name"
   */
  key?: string = '';
  /**
   * 是否显示
   * @example true
   */
  isShow: boolean = false;
}
