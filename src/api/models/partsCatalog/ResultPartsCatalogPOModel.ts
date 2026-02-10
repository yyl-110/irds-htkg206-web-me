import { BaseModel } from '@/utils/BaseModel';
import { ManualDocDetailPO, OrderNumberNodeChildrenPO, OrderNumberNodePO, ResultPartsCatalogPO, FileInfoPO } from '../../tags/data-contracts';
import { Expose, Type } from 'class-transformer';
import { PartsCatalogPOModel, PartsCatalogTreePOModel } from './PartsCatalogPOModel';

/** 查询结果 */
export class ResultPartsCatalogPOModel extends BaseModel {
  /**
   * 唯一ID:与SIS中的零部件ID相同
   * @example ""
   */
  id?: string;

  /**
   * key
   * @format int64
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
  partName?: string = '';

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

/** 查询结果 */
export class ResultPartsCatalogPOModel2 extends BaseModel {
  /**
   * 唯一ID:与SIS中的零部件ID相同
   * @example ""
   */
  id?: string;

  /**
   * key
   * @format int64
   */
  /** 序列化别名  */
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
  partName?: string = '';

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

  /** 数据 */
  children?: Array<any>;
}

/** 分页结果 */
export class PageResultPartsReplacePOModel extends BaseModel {
  forEach(arg0: (item: any) => void) {
    throw new Error('Method not implemented.');
  }
  list: Array<PartsCatalogPOModel> = [];

  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}

/** 分页结果 */
export class PageResultManualPOModel extends BaseModel {
  forEach(arg0: (item: any) => void) {
    throw new Error('Method not implemented.');
  }

  manualBomList?: Array<PartsCatalogTreePOModel> = [];

  docDetail?: ManualDocDetailPO = new ManualDocDetailPO();
}

/** 分页结果 */
export class PageResultEcuPOModel extends BaseModel implements ManualDocDetailPO {
  fileInfo?: FileInfoPO;
}
