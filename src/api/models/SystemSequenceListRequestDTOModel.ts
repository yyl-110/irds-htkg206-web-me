import { BaseModel } from '@/utils/BaseModel';
import type { SystemSequenceListRequestDTO } from '../tags/data-contracts';

export class SystemSequenceListRequestDTOModel extends BaseModel implements SystemSequenceListRequestDTO {
  /**
   * 最新编号
   * @format int64
   */
  seqId: number = 0;
  /** 序列名 */
  seqname: string = '';
}
