import { BaseModel } from '@/utils/BaseModel';
import type { SystemSequenceResponseDTO } from '../tags/data-contracts';

/** SystemSequence Response DTO */
export class SystemSequenceResponseDTOModel extends BaseModel implements SystemSequenceResponseDTO {
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
