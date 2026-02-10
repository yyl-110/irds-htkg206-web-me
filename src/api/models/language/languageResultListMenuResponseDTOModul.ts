import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListBasiclanguage } from '../../tags/data-contracts';
import { PageResultlanguageTPOModel } from './PageResultlanguageTPOModel';
export class languageResultListMenuResponseDTOModul extends BaseModel implements CommonResultListBasiclanguage {
  /** @format int32 */
  code?: number = 0;
  data?: Array<PageResultlanguageTPOModel> = [];
  msg?: string = '';
}
