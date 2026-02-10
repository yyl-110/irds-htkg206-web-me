import { BaseModel } from '@/utils/BaseModel';
import type { SystemSequencePageRequestDTO } from '../tags/data-contracts';

/** SystemSequencePageRequest DTO */
export class SystemSequencePageRequestDTOModel extends BaseModel implements SystemSequencePageRequestDTO {
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
}
