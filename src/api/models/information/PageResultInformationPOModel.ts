import { BaseModel } from '@/utils/BaseModel';
import type { PageResultInformationPO } from '../../tags/data-contracts';
import { InformationPOModel } from './InformationPOModel';

/** 分页结果 */
export class PageResultInformationPOModel extends BaseModel implements PageResultInformationPO {
  list: Array<InformationPOModel> = [];

  /**
   * 总量
   * @format int64
   */
  total: number = 0;

  /**
   * 名称
   * @example '11111'
   */
  name?: string;

  /**
   * 件号
   * @example '22222'
   */
  docNum?: string;

  /**
   * 型号
   * @example '22222'
   */
  model?: string;

  /**
   * 行业
   * @example '22222'
   */
  industry?: string;

  /**
   * 系列
   * @example '22222'
   */
  series?: string;

  /**
   * 燃料类型
   * @example '22222'
   */
  fuelType?: string;

  /**
   * 排放
   * @example '22222'
   */
  emission?: string;

  /**
   * 分类ID
   * @example '22222'
   */
  dirId?: string;

  /**
   * 发布状态
   * @example '22222'
   */
  type?: number;
}
