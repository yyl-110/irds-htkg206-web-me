import { BaseModel } from '@/utils/BaseModel';
import type { Post } from '../tags/data-contracts';

/** 岗位 */
export class PostModel extends BaseModel implements Post {
  /**
   * 岗位编号
   * @format int64
   * @example 1
   */
  id: number = 0;
  /**
   * 岗位名称
   * @example "开发"
   */
  name: string = '';
}
