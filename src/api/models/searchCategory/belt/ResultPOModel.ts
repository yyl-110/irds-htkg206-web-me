import { BaseModel } from '@/utils/BaseModel';
import { OrderNumberNodeChildrenPO, ResultBeltPO } from '@/api/tags/data-contracts';
import { Expose } from 'class-transformer';
import { BeltPOModel } from './BeltPOModel';
import { generateRandomNumberByTime } from '@/utils/tools';

/** 分页结果 */
export class RequestDTOModel extends BaseModel implements ResultBeltPO {
  forEach(arg0: (item: any) => void) {
    throw new Error('Method not implemented.');
  }

  /** 数据 */
  data: Array<BeltPOModel> = [];

  /** 数据 */
  list: Array<BeltPOModel> = [];

  /**
   * 总量
   * @format int64
   */
  total: number = 0;
}

/** 结果 */
export class RequestDTOModel2 extends BaseModel {
  /**
   * key
   * @format int64
   */
  /** 序列化别名  */
  @Expose({ name: 'key' })
  value: string = '';

  /**
   * 名称
   * @format int64
   */
  /** 序列化别名  */
  @Expose({ name: 'name' })
  label: string = '';
}

/** 结果 */
export class RequestAllDTOModel extends BaseModel {
  /**
   * 订货号
   * @format int64
   */
  orderNumberList: Array<any> = [];

  /**
   * 维修手册
   * @format int64
   */
  serviceManualList: Array<any> = [];

  /**
   * 使用保养说明书
   * @format int64
   */
  useMaintenanceManualList: Array<any> = [];

  /**
   * ECU 针脚图
   * @format int64
   */
  ecuPinDiagramList: Array<any> = [];

  /**
   * 专用工具
   * @format int64
   */
  specialToolsList: Array<any> = [];

  /**
   * 修理包
   * @format int64
   */
  repairKitList: Array<any> = [];

  /**
   * 新组建
   * @format int64
   */
  heartComponentList: Array<any> = [];

  /**
   * 保养套餐
   * @format int64
   */
  maintenancePackageList: Array<any> = [];
}

/** 适用情况列表 */
export class RequestApplyDTOModel extends BaseModel {
  /**
   * 子级列表
   * @format int64
   */
  childNodeList: Array<nodeList> = [];

  parentNodeList: Array<nodeList> = [];

  total: number = 0;
}

class nodeList {
  /**
   * 零ID
   * @example ""
   */
  key: string = generateRandomNumberByTime();

  /**
   * 零ID
   * @example ""
   */
  partId?: string;

  /**
   * 零件编号
   * @example ""
   */
  partNumber?: string;

  /**
   * 零件名称
   * @example ""
   */
  partName?: string;

  /**
   * 零件master的id
   * @example ""
   */
  partMasterId?: string;

  /**
   * 父项最新的part_id
   * @example ""
   */
  parentId?: string;

  /**
   * 根节点编号
   * @example ""
   */
  rootNumber?: string;

  /**
   * 根节点名称
   * @example ""
   */
  rootName?: string;

  /**
   * 根节点master_id
   * @example ""
   */
  rootMasterId?: string;

  /**
   * 订货号最新的part_id
   * @example ""
   */
  rootId?: string;

  /**
   * part全路径
   * @example ""
   */
  partPathAll?: string;

  /**
   * part全路径
   * @example ""
   */
  masterPathAll?: string;

  /**
   * epc类型
   * @example ""
   */
  epcType?: string;

  /**
   * 型号
   * @example ""
   */
  model?: string;

  /**
   * 系列
   * @example ""
   */
  series?: string;

  /**
   * 数量
   * @example ""
   */
  amount?: string;

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
}

/** 替换关系列表 */
export class RequestReplaceDTOModel extends BaseModel {
  /**
   * 子级列表
   * @format int64
   */
  oldNumberList: Array<any> = [];

  /**
   * 父级列表
   * @format int64
   */
  newNumberList: Array<any> = [];

  /**
   * 数据id
   * @format int64
   */
  id?: string = '';

  /**
   * 替换类型
   * @format int64
   */
  replaceType?: string = '';

  /**
   * 替换说明
   * @format int64
   */
  remark?: string = '';

  /**
   * 适用订货号
   * @format int64
   */
  applyitem?: string = '';

  /**
   * 替换时间
   * @format int64
   */
  replacementDate?: string = '';
}
