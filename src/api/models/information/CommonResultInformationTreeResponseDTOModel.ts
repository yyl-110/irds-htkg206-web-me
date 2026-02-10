import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultInformationTreeResponseDTO } from '../../tags/data-contracts';

import { InformationTreeResponseDTOModel } from './InformationTreeResponseDTOModel';

export class CommonResultInformationTreeResponseDTOModel extends BaseModel implements CommonResultInformationTreeResponseDTO {
  data?: Array<InformationTreeResponseDTOModel> = [];
  msg?: string = '';
  code?: number = 0;
}
