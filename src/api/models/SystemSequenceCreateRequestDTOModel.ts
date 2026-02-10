import { BaseModel } from '@/utils/BaseModel';
import type { SystemSequenceCreateRequestDTO } from '../tags/data-contracts';

export class SystemSequenceCreateRequestDTOModel extends BaseModel implements SystemSequenceCreateRequestDTO {
  /**
   * 增量
   * @format int32
   */
  incrementer: number = 0;
  /**
   * 初始id
   * @format int32
   */
  initid: number = 0;
}
