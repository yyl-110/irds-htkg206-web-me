import { BaseModel } from '@/utils/BaseModel';
import type { HelpSimpleResponseDTO } from '../../tags/data-contracts';

/** 管理后台 - 部门精简信息 Response DTO */
export class HelpSimpleResponseDTOModel extends BaseModel implements HelpSimpleResponseDTO {
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
   * 国际化语音
   * @example "zh_CN"
   */
  lang: string = '';

  /**
   * 节点名称
   * @example "33"
   */
  articleName: string = '';

  /**
   * 备注信息
   * @example "33"
   */
  articleContent: string = '';

  /**
   * 树key
   * @example "33"
   */
  key: string = '';
  forEach(arg0: (item: any, indexs: any) => void) {
    throw new Error('Method not implemented.');
  }

  /**
   * 查询条件名称
   * @example "33"
   */
  nodeName: string = '';
}
