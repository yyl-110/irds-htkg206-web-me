import { BaseModel } from '@/utils/BaseModel';
import type { PageResultTenantPackageResponseDTO } from '../tags/data-contracts';

import { TenantPackageResponseDTOModel } from './TenantPackageResponseDTOModel';

/** 分页结果 */
export class PageResultTenantPackageResponseDTOModel extends BaseModel implements PageResultTenantPackageResponseDTO {
  list: Array<TenantPackageResponseDTOModel> = [];
  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}
