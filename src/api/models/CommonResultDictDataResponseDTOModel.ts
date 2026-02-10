import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultDictDataResponseDTO } from '../tags/data-contracts';

import { DictDataResponseDTOModel } from './DictDataResponseDTOModel';

export class CommonResultDictDataResponseDTOModel extends BaseModel implements CommonResultDictDataResponseDTO {
  /** @format int32 */
  code?: number = 0;
  /** 管理后台 - 字典数据信息 Response DTO */
  data?: DictDataResponseDTOModel = new DictDataResponseDTOModel();
  msg?: string = '';
}
