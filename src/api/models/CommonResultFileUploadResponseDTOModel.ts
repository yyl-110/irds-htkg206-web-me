import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultFileUploadResponseDTO } from '../tags/data-contracts';

import { FileUploadResponseDTOModel } from './FileUploadResponseDTOModel';

export class CommonResultFileUploadResponseDTOModel extends BaseModel implements CommonResultFileUploadResponseDTO {
  /** @format int32 */
  code?: number = 0;
  data?: FileUploadResponseDTOModel = new FileUploadResponseDTOModel();
  msg?: string = '';
}
