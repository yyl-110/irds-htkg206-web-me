import { BaseModel } from '@/utils/BaseModel';
import type { PageResultTenantResponseDTO } from '../tags/data-contracts';

import { TenantResponseDTOModel } from './TenantResponseDTOModel';

/** 分页结果 */
export class PageResultTenantResponseDTOModel extends BaseModel implements PageResultTenantResponseDTO {
  list: Array<TenantResponseDTOModel> = [];
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
