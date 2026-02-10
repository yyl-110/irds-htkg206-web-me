import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultPageResultLanguagePO } from '../../tags/data-contracts';

import { PageResultLanguagePOModel } from './PageResultLanguagePOModel';

export class CommonResultPageResultLanguagePOModel extends BaseModel implements CommonResultPageResultLanguagePO {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultLanguagePOModel = new PageResultLanguagePOModel();
  msg?: string = '';
}
