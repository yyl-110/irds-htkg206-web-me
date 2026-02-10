import { BaseModel } from '@/utils/BaseModel';
import type { InformationPO } from '../../tags/data-contracts';

/** 数据 */
export class InformationPOModel extends BaseModel {
  /**
   * 唯一ID
   * @example "1123333333"
   */
  id?: string = '';
  /**
   * 名称
   * @example "WP1301"
   */
  name?: string = '';

  /**
   * 语言code
   * @example "WP1301"
   */
  lang?: string = '';

  /**
   * 型号
   * @example "WP1301"
   */
  model?: string = '';

  /**
   * 件号
   * @example "WP1301"
   */
  docNumber?: string = '';

  /**
   * 业务范围
   * @example "WP1301"
   */
  bizRange?: string = '';

  /**
   * 行业
   * @example "WP1301"
   */
  industry?: string = '';

  /**
   * 系列
   * @example "WP1301"
   */
  series?: string = '';

  /**
   * 功率
   * @example "WP1301"
   */
  power?: string = '';

  /**
   * 排放
   * @example "WP1301"
   */
  emission?: string = '';
  /**
   * 燃料类型
   * @example "WP1301"
   */
  fuelType?: string = '';
  /**
   * 文档类型
   * @example "WP1301"
   */
  docType?: string = '';
  /**
   * 版本
   * @example "WP1301"
   */
  docVersion?: string = '';
  /**
   * 文件id
   * @example "WP1301"
   */
  fileId?: string = '';
  /**
   * 文件id
   * @example "WP1301"
   */
  fileStatus?: string = '';
  /**
   * 文档名称
   * @example "WP1301"
   */
  docName?: string = '';

  /**
   * 分类节点ID
   * @example "WP1301"
   */
  dirId?: string = '';
  /**
   * ECU硬件件号
   * @example "WP1301"
   */
  ecuPartNumber?: string = '';
  /**
   * ECU硬件型号
   * @example "WP1301"
   */
  ecuPartModel?: string = '';
}
