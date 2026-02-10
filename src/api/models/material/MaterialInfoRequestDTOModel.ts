import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class MaterialInfoRequestDTOModel extends BaseModel {
  id?: number = 0;
  folderPartFolderId?: string = '';
  partNumber?: string = '';
  partName?: string = '';
  partVersion?: string = '';
  partSize?: string = '';
  status?: number = 0;
  seq?: number = 0;
  useQuqntity?: string = '';
  recentQuqntity?: string = '';
}
