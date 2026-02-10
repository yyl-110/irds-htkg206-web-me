import { BaseModel } from '@/utils/BaseModel';
import type { SystemSequenceUpdateRequestDTO } from '../tags/data-contracts';

export class SystemSequenceUpdateRequestDTOModel extends BaseModel implements SystemSequenceUpdateRequestDTO {
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
  /**
   * 最新编号
   * @format int64
   */
  seqId: number = 0;
  /** 序列名 */
  seqname: string = '';
}
