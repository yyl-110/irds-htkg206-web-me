import { BaseModel } from '@/utils/BaseModel';
import type { PageResultLoginLogResponseDTO } from '../tags/data-contracts';

import { LoginLogResponseDTOModel } from './LoginLogResponseDTOModel';

/** 分页结果 */
export class PageResultLoginLogResponseDTOModel extends BaseModel implements PageResultLoginLogResponseDTO {
  list: Array<LoginLogResponseDTOModel> = [];
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
