import { BaseModel } from '@/utils/BaseModel';
import type { ColumnsBasiclanguage } from '../../tags/data-contracts';
import { Expose } from 'class-transformer';

/** 数据 */
export class languagelistPOMtype extends BaseModel implements ColumnsBasiclanguage {
  name?: string | undefined;
  lang = '';
  langDesc = '';
  langDirection = '';
  fileId?: number | undefined;
  leaderUserId?: number[] | undefined;
}
