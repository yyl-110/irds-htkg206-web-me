import { BaseModel } from '@/utils/BaseModel';
import type { FileUploadResponseDTO } from '../tags/data-contracts';

export class FileUploadResponseDTOModel extends BaseModel implements FileUploadResponseDTO {
  fileName?: string = '';
  fileType?: string = '';
  fileSize?: string = '';
  queryId?: string = '';
}
