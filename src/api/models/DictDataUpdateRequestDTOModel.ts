import { BaseModel } from '@/utils/BaseModel';
import type { DictDataUpdateRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 字典数据更新 Request DTO */
export class DictDataUpdateRequestDTOModel extends BaseModel implements DictDataUpdateRequestDTO {
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort: number = 0;
  /**
   * 字典标签
   * @minLength 0
   * @maxLength 100
   * @example ""
   */
  label: string = '';
  /**
   * 字典值
   * @minLength 0
   * @maxLength 100
   * @example "iocoder"
   */
  value: string = '';
  /**
   * 字典类型
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  dictType: string = '';
  /**
   * 状态,见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number = 0;
  /**
   * 颜色类型,default、primary、success、info、warning、danger
   * @example "default"
   */
  colorType?: string = '';
  /**
   * css 样式
   * @example "btn-visible"
   */
  cssClass?: string = '';
  /**
   * 备注
   * @example "我是一个角色"
   */
  remark?: string = '';
  /**
   * 字典数据编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
}
