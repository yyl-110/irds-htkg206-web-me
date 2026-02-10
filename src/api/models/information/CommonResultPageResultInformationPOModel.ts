import { BaseModel } from '@/utils/BaseModel';

import { PageResultInformationPOModel } from './PageResultInformationPOModel';
import type { CommonResultPageResultInformationDTO } from '../../tags/data-contracts';

export class CommonResultPageResultInformationPOModel extends BaseModel implements CommonResultPageResultInformationDTO {
  data?: PageResultInformationPOModel = new PageResultInformationPOModel();
  msg?: string = '';
  code?: number = 0;
}
