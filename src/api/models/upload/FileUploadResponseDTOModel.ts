import { BaseModel } from '@/utils/BaseModel';
import type { FileUploadResponseDTO } from '../../tags/data-contracts';

export class FileUploadResponseDTOModel extends BaseModel implements FileUploadResponseDTO {
  fileName?: string = '';
  fileType?: string = '';
  fileSize?: string = '';
  queryId?: string = '';
}

export class PreviewFileDTOModel extends BaseModel {
  code?: string = '';
  data?: string = '';
  msg?: string = '';
}

/** 按模型件号查询 PVZ 文件接口 data 结构 */
export class PvzFileByModuleNumDTOModel extends BaseModel {
  id?: string | number | null;
  newFileName?: string;
  oldFileName?: string;
  pdfFileName?: string;
  fileUrl?: string;
  confidentialLevel?: string;
  creator?: string;
  createName?: string;
  documentName?: string;
  fileType?: string;
  createData?: string;
}

export class CommonResultPvzFileByModuleNumDTOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: PvzFileByModuleNumDTOModel = new PvzFileByModuleNumDTOModel();
  msg?: string = '';
}
