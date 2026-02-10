import { BaseModel } from '@/utils/BaseModel';
import type { OrderNumberReportPO } from '../../../tags/data-contracts';
import { Expose } from 'class-transformer';

/** 数据 */
export class OrderNumberPOModel extends BaseModel implements OrderNumberReportPO {}
