import { BaseModel, ClassType } from '@/utils/BaseModel';
import type { LanguagePO } from '../../tags/data-contracts';
import type { ColumnsLanguagePO } from '../../tags/data-contracts';
import { Expose } from 'class-transformer';
import { generateRandomNumberByTime } from '@/utils/tools';
/** 数据 */
export class LanguagePOModel extends BaseModel implements LanguagePO {
  /** @format date-time */
  createTime?: string = '';

  key: string = generateRandomNumberByTime();
}

/** 数据 */
export class ColumnsLanguagePOModel {
  /** @format date-time */
  createTime?: string = '';
  /** @format updateTime */
  updateTime?: string = '';
  creator?: string;
  updater?: string;

  /** 序列化别名  */
  @Expose({ name: 'lang' })
  dataIndex: string = '';

  /** 序列化别名  */
  @Expose({ name: 'langDesc' })
  title: string = '';
  langDirection?: string = '';
  enabled?: number = 0;
  fileId?: number = 0;
  width?: number;
  fixed?: string = '';
  align?: string = 'left';
}
