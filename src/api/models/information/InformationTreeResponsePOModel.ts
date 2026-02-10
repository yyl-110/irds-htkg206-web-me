import { BaseModel } from '@/utils/BaseModel';
import type { InformationTreeResponseDTOModel } from './InformationTreeResponseDTOModel';

/** 管理后台 - 服务资料PO结构树 Response DTO */
export class InformationTreeResponsePOModel extends BaseModel {
  /**
   * 帮助树ID
   * @format uuid
   * @example 123
   */
  id: string = '';
  /**
   * 父节点 ID
   * @format uuid
   * @example 12345
   */
  parentId: string = '';

  /**
   * 父节点名称
   * @example "根目录"
   */
  parentName: string = '';

  /**
   * 节点名称
   * @example "33"
   */
  nodeName: string = '';

  /**
   * 内置标识
   * @example "1"
   */
  innerFlag: Boolean = false;

  data!: InformationTreeResponseDTOModel;
  msg: string = '';

  key: Number = 0;
}
