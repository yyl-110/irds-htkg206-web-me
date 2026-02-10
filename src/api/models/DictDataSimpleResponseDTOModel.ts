import { BaseModel } from '@/utils/BaseModel';
import type { DictDataSimpleResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 数据字典精简 Response DTO */
export class DictDataSimpleResponseDTOModel extends BaseModel implements DictDataSimpleResponseDTO {
  /**
   * 字典类型
   * @example "gender"
   */
  dictType: string = '';
  /**
   * 字典键值
   * @example "1"
   */
  value: string = '';
  /**
   * 字典标签
   * @example "男"
   */
  label: string = '';
  /**
   * 颜色类型，default、primary、success、info、warning、danger
   * @example "default"
   */
  colorType?: string = '';
  /**
   * css 样式
   * @example "btn-visible"
   */
  cssClass?: string = '';
}
