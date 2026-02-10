import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultDictTypeResponseDTO } from '../tags/data-contracts';

import { DictTypeResponseDTOModel } from './DictTypeResponseDTOModel';

export class CommonResultDictTypeResponseDTOModel extends BaseModel implements CommonResultDictTypeResponseDTO {
  /** @format int32 */
  code?: number = 0;
  /** 管理后台 - 字典类型信息 Response DTO */
  data?: DictTypeResponseDTOModel = new DictTypeResponseDTOModel();
  msg?: string = '';
}
