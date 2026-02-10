import { BaseModel } from '@/utils/BaseModel';
import type { BeltOrThermostatOrfilterPageRequestDTO } from '../../../tags/data-contracts';

/** 管理后台 - 首页搜索 Request DTO */
export class RequestDTOModel extends BaseModel implements BeltOrThermostatOrfilterPageRequestDTO {
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
   * 搜索关键字
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  keyword?: string = '';

  /**
   * 零件编号
   * @format int32
   * @min 1
   * @example 1
   */
  partNumber?: string;
  /**
   * 零件编号
   * @format int32
   * @min 1
   * @example 1
   */
  // oldPartNumber?: string;
  /**
   * 零件名称
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partName?: string;
  /**
   * 订货号
   * @format int32
   * @min 1
   * @example 1
   */
  dhhNumber?: string;
  /**
   * 皮带类型
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  beltType?: string;
  /**
   * 皮带类型/楔数
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  beltModelAndWedgeNumber?: string;

  /**
   * 皮带型号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  beltModel?: string;

  /**
   * 有效长度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  effectiveLength?: string;

  /**
   * 楔数
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  wedgeNumber?: string;

  /**
   * 初开温度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  initTemp?: string;

  /**
   * 全开温度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  fullTemp?: string;

  /**
   * 滤芯长度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  filterLen?: string;

  /**
   * 滤芯直径
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  filterDiameter?: string;

  /**
   * 用户id
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  userId?: string;

  /**
   * 搜索json
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  conditions?: object;

  /**
   * 搜索json
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string;

  /**
   * 搜索提示
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  text?: string;
  /**
   * 	y件号标识
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  ypartFlag?: boolean;
}

/** 管理后台 - 首页高级搜索 Request DTO */
export class SeniorRequestDTOModel extends BaseModel {
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
   * 零件编号
   * @format int32
   * @min 1
   * @example 1
   */
  series?: string = '';
  model?: string = '';
  /**
   * 产品型号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  productCategories?: string = '';

  /**
   * 搜索参数
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string;
  /**
   * 柴油机号/车桥号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  engineCondition?: string;
  /**
   * 	车号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  vehicleNumber?: string;
  /**
   * 	零件名称
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partName?: string;
  /**
   * 	零件编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partNumber?: string;
  /**
   * 	零件图号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partDrawing?: string;
  startProductionDate?: string;
  endProductionDate?: string;
  vim?: string;
  terminalCode?: string;
}
/** 管理后台 - 首页高级搜索 Request DTO */
export class searchPartRequestDTOModel extends BaseModel {
  /**
   * 	零件名称
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partName?: string = '';

  /**
   * 零件编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partNumber?: string;
  /**
   * 搜索图号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partDrawing?: string = '';
}

/** 管理后台 - 首页高级搜索 Request DTO */
export class HotSearchTermRequestDTOModel extends BaseModel {
  /**
   * 搜索关键字
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  keyWord?: string = '';

  /**
   * 类型
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  type: string = '';
}

/** 管理后台 - 首页高级搜索 Request DTO */
export class RequestSearchDTOModel extends BaseModel implements BeltOrThermostatOrfilterPageRequestDTO {
  /**
   * 搜索关键字
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  keyword?: string = '';

  /**
   * 零件编号
   * @format int32
   * @min 1
   * @example 1
   */
  partNumber?: string;
  /**
   * 零件名称
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partName?: string;

  /**
   * 皮带类型
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  beltType?: string;
  /**
   * 有效长度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  effectiveLength?: string;

  /**
   * 楔数
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  wedgeNumber?: string;

  /**
   * 初开温度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  initTemp?: string;

  /**
   * 全开温度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  fullTemp?: string;

  /**
   * 滤芯长度
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  filterLen?: string;

  /**
   * 滤芯直径
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  filterDiameter?: string;

  /**
   * 用户id
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  userId?: string;

  /**
   * 搜索json
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  conditions?: object;

  /**
   * 搜索提示
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  text?: string;
}

/** 管理后台 - 首页高级搜索 Request DTO */
export class AllRequestDTOModel extends BaseModel {
  /**
   * 搜索关键字
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  keyWord?: string = '';

  /**
   * 业务范围
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  bizRange?: Array<string> = [];

  /**
   * 业务范围
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  searchRange?: Array<string> = [];
}

/** 应用端 - 首页适用情况 Request DTO */
export class ApplyRequestDTOModel extends BaseModel {
  /**
   * 零件id
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partId?: string = '';

  /**
   * 零件号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partNumber?: string = '';

  /**
   * 零件masterId
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  masterId?: string = '';

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
}

/** 应用端 - 首页替换关系 Request DTO */
export class ReplaceRequestDTOModel extends BaseModel {
  /**
   * 分组号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  groupId?: string = '';

  /**
   * 数据类型
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  dataType?: string = '';
  /**
   * 	y件号标识
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  ypartFlag?: boolean;
  /**
   * 零件标识
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  oldPartNumber?: boolean;
}

/** 应用端 - 主页热搜词添加 Request DTO */
export class tipsRequestDTOModel extends BaseModel {
  /**
   * 分组号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  id?: string = '';

  /**
   * 数据类型
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  uniqueKey?: string = '';
  /**
   * 	y件号标识
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  text?: boolean;
  /**
   * 零件标识
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  type?: boolean;
}
