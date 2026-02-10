import { BaseModel } from '@/utils/BaseModel';
import type { StatisticsLogDTO } from '../tags/data-contracts';

export class StatisticsLogDTOModel extends BaseModel implements StatisticsLogDTO {
  moduleName?: string = '';
  logType?: string = '';
}
