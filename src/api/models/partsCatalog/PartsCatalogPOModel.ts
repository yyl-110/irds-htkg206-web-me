import { BaseModel } from '@/utils/BaseModel';
import { OrderNumberNodeChildrenPO, OrderNumberNodePO } from '../../tags/data-contracts';
import { Expose, Type } from 'class-transformer';
import { generateRandomNumberByTime } from '@/utils/tools';

/** 数据 */
export class PartsCatalogPOModel extends BaseModel implements OrderNumberNodePO {
  /**
   * 唯一ID:
   * @example ""
   */
  uniqueKey?: string;

  /**
   * 唯一ID:与SIS中的零部件ID相同
   * @example ""
   */
  id?: string;

  /**
   * MasterId
   * @example ""
   */
  masterId?: string;

  /**
   * 零件名称
   * @example ""
   */
  partNumber?: string;

  /**
   * 零件编号
   * @example ""
   */
  // partName?: string;

  partName?: string;

  /**
   * SIS中的类型，只需要最后的内码
   * @example ""
   */
  softtype?: string;

  /**
   * 订货版本号
   * @example ""
   */
  dhhType?: string;

  /**
   * 版本
   * @example ""
   */
  version?: string;

  /**
   * 生效日期
   * @example ""
   */
  effDate?: string;

  /**
   * 失效日期
   * @example ""
   */
  invalidDate?: string;

  /**
   * 变更单号
   * @example ""
   */
  ecnNumber?: string;

  /**
   * 业务范围
   * @example ""
   */
  bizRange?: string;

  /**
   * pvz文件id
   * @example ""
   */
  pvzFileId?: number;

  /**
   * svg文件id
   * @example ""
   */
  svgFileId?: number;

  /**
   * 图序号
   * @example ""
   */
  orderNo?: number;

  /**
   * 收藏标识
   * @example ""
   */
  favoriteFlag?: boolean;

  /**
   * 是否可购买
   * @example ""
   */
  buyFlag?: boolean;

  /**
   * 软属性
   * @example ""
   */
  iba?: object;

  /**
   * 行号
   * @example ""
   */
  lineNumber?: number;

  /**
   * epc类型
   * @example ""
   */
  epcType?: string;

  link?: object;

  children?: Array<OrderNumberNodePO>;
}

/** 数据 */
export class PartsCatalogTreePOModel extends BaseModel {
  /**
   * 唯一ID:与SIS中的零部件ID相同
   * @example ""
   */
  /** 序列化别名  */
  @Expose({ name: 'id' })
  key?: string;

  /**
   * MasterId
   * @example ""
   */
  masterId?: string;

  /**
   * 零件名称
   * @example ""
   */
  partNumber?: string;

  /**
   * 零件编号
   * @example ""
   */
  partName?: string;

  /**
   * SIS中的类型，只需要最后的内码
   * @example ""
   */
  softtype?: string;

  /**
   * 订货版本号
   * @example ""
   */
  dhhType?: string;

  /**
   * 版本
   * @example ""
   */
  version?: string;

  /**
   * 生效日期
   * @example ""
   */
  effDate?: string;

  /**
   * 失效日期
   * @example ""
   */
  invalidDate?: string;

  /**
   * 变更单号
   * @example ""
   */
  ecnNumber?: string;

  /**
   * 业务范围
   * @example ""
   */
  bizRange?: string;

  /**
   * pvz文件id
   * @example ""
   */
  pvzFileId?: number;

  /**
   * svg文件id
   * @example ""
   */
  svgFileId?: number;

  /**
   * 图序号
   * @example ""
   */
  orderNo?: number;

  /**
   * 收藏标识
   * @example ""
   */
  favoriteFlag?: boolean;

  /**
   * 是否可购买
   * @example ""
   */
  buyFlag?: boolean;

  /**
   * 软属性
   * @example ""
   */
  iba?: object;

  /**
   * 行号
   * @example ""
   */
  lineNumber?: number;

  /**
   * epc类型
   * @example ""
   */
  epcType?: string;

  children?: Array<OrderNumberNodeChildrenPO>;
}
