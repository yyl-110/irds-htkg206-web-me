import { BaseModel } from '@/utils/BaseModel';
import type { DeptDataPermissionRespDTO } from '../tags/data-contracts';

export class DeptDataPermissionRespDTOModel extends BaseModel implements DeptDataPermissionRespDTO {
  all?: boolean = false;
  self?: boolean = false;
  /** @uniqueItems true */
  deptIds?: Array<number> = [];
}
