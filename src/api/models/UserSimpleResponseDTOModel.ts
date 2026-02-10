import { BaseModel } from '@/utils/BaseModel';
import type { UserSimpleResponseDTO } from '../tags/data-contracts';

/** 用户精简信息 Response DTO */
export class UserSimpleResponseDTOModel extends BaseModel implements UserSimpleResponseDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 用户昵称
   * @example ""
   */
  nickname: string = '';
}
