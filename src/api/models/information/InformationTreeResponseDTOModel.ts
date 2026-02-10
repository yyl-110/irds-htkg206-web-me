import { BaseModel } from '@/utils/BaseModel';
import type { InformationTreeResponseDTO } from '../../tags/data-contracts';

/** 管理后台 - 服务资料结构树 Response DTO */
export class InformationTreeResponseDTOModel extends BaseModel implements InformationTreeResponseDTO {
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

  /**
   * 国际化
   * @example "1"
   */
  lang: string = '';

  /**
   * 排序
   * @example "1"
   */
  sort: Number = 0;

  key: Number = 0;

  /**
   * 排序兄弟节点ID
   * @format id
   * @example '123'
   */
  exchangeId: string = '';
}
