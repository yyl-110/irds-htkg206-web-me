import { BaseModel } from '@/utils/BaseModel';
import type { DictionaryPO } from '../../tags/data-contracts';
import { Expose } from 'class-transformer';

/** 数据 */
export class DictionaryPOModel extends BaseModel implements DictionaryPO {}
