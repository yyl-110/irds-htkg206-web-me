import { BaseModel } from '@/utils/BaseModel';
import type { PageResultUserPageItemResponseDTO } from '../tags/data-contracts';

import { UserPageItemResponseDTOModel } from './UserPageItemResponseDTOModel';

/** 分页结果 */
export class PageResultUserPageItemResponseDTOModel extends BaseModel implements PageResultUserPageItemResponseDTO {
  list: Array<UserPageItemResponseDTOModel> = [];
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
