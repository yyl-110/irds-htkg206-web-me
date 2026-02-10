import { BaseModel } from '@/utils/BaseModel';
import type { HelpSortResponseDTO } from '../../tags/data-contracts';

/** 管理后台 - 部门精简信息 Response DTO */
export class HelpSortResponseDTOModel extends BaseModel implements HelpSortResponseDTO {
  /**
   * 帮助树ID
   * @example 123
   */
  id: string = '';

  /**
   * 更换节点ID
   * @example "33"
   */
  exchangeId: string = '';
}
