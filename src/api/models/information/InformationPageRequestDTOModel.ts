import { BaseModel } from '@/utils/BaseModel';
import type { InformationPageRequestDTO } from '../../tags/data-contracts';

/** 管理后台 -分页搜索条件  Request DTO */
export class InformationPageRequestDTOModel extends BaseModel implements InformationPageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number = 0;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 0;

  /**
   * 名称
   * @example '11111'
   */
  name: string = '';
  /**
   * 件号
   * @example '22222'
   */
  number: string = '';
  /**
   * 型号
   * @example '22222'
   */
  model: string = '';

  /**
   * 行业
   * @example '22222'
   */
  industry: string = '';

  /**
   * 系列
   * @example '22222'
   */
  series?: string;

  /**
   * 燃料类型
   * @example '22222'
   */
  fuelType: string = '';

  /**
   * 排放
   * @example '22222'
   */
  emission: string = '';

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

  /**
   * 语音
   * @example '22222'
   */
  lang?: string;

  /**
   *epc类型
   * @example '22222'
   */
  epcType?: string;
  /**
   *ECU硬件件号
   * @example '22222'
   */
  ecuPartNumber?: string;
  /**
   *ECU硬件型号
   * @example '22222'
   */
  ecuPartModel?: string;
  productCategories?: string;
}
