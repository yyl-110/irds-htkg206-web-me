import { BaseModel } from '@/utils/BaseModel';
import type { NoticInfoRequestPO } from '../../tags/notice/NoticInfoRequestPO';

/** 数据 */
export class NoticeInfoRequestDTOModel extends BaseModel implements NoticInfoRequestPO {
  id?: number = 0;
  fileId?: string = '';
  userId?: string = '';
  title?: string = '';
  type?: string = '';
  content?: string = '';
  status?: string = '';
  pdfFileName?: string = '';
}
