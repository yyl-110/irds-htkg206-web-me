import { BaseModel } from '@/utils/BaseModel';
import type { PartsCatalogRequestDTO } from '../../tags/data-contracts';
/** 管理后台 -搜索条件  Request DTO */
export class PartsCatalogRequestDTOModel extends BaseModel implements PartsCatalogRequestDTO {
  /**
   * 零件ID
   * @format int32
   * @min 1
   * @example 1
   */
  dhhId?: string = '';
  /**
   * 零件编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  dhhNumber?: string = '';

  /**
   * 零件日期
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  dhhDate?: string = '';

  /**
   * 发动机号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  serialNumber?: string = '';

  /**
   * 语言
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  lang?: string = '';
  /**
   * 零件编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partNumber?: string = '';

  /**
   * 零件编号数组
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partNumbers?: Array<string> = [];

  /**
   * 系列
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  series?: string = '';

  /**
   *  是否首页  true 首页 ，false 非首页
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  homeFlag?: boolean = false;

  /**
   * treeid
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partId?: string = '';
  /**
   * y件标识
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  ypartFlag?: boolean;

  /**
   * 查询条件
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string = '';
}

/** 管理后台 -根据订货号查询  Request DTO */
export class PartsCatalogByNumberRequestDTOModel extends BaseModel implements PartsCatalogRequestDTO {
  /**
   * 零件编号
   * @format int32
   * @min 1
   * @example 1
   */
  dhhId?: string = '';

  /**
   * 零件日期
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  dhhDate?: string = '';
}

/** 管理后台 -根据订货号查询  Request DTO */
export class PartsCatalogByEngineNoRequestDTOModel extends BaseModel implements PartsCatalogRequestDTO {
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
   * 发动机号
   * @format int32
   * @min 1
   * @example 1
   */
  machineNumber?: string = '';

  /**
   * 搜索条件
   * @format int32
   * @min 1
   * @example 1
   */
  condition?: string = '';
}

/** 应用端  修理包  Request DTO */
export class RepairKitByNumberRequestDTOModel extends BaseModel implements PartsCatalogRequestDTO {
  /**
   * 订货号
   * @format int32
   * @min 1
   * @example 1
   */
  dhhNumber?: string = '';

  /**
   * 发动机计划完工日期
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  completionDate?: string = '';

  /**
   *  编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partNumber?: string = '';

  /**
   *  零件ID
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partId?: string = '';
}

/** 应用端  维修手册  Request DTO */
export class ManualRequestDTOModel extends BaseModel {
  /**
   * 行业,示例值(工程机械 | 农业装备)
   * @format int32
   * @min 1
   * @example 1
   */
  industry?: string = '';

  /**
   * 系列(发动机、新能源),示例值(WP13)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  series?: string = '';

  /**
   * 型号(发动机、液压传动)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  model?: string = '';

  /**
   * 功率,示例值(130KW)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  power?: string = '';

  /**
   * 排放,示例值(欧VI | 国V | 国VI)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  emission?: string = '';

  /**
   * 语言
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  lang?: string = '';

  /**
   * 数据id
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  id?: string = '';
  /**
   * 数据id
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  docOId?: string = '';

  /**
   * epcType
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  epcType?: string = '';
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number = 1;

  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 10;

  fuelType?: string = '';
  /**
   * 业务范围
   * @format int32
   * @example
   */
  bizRange?: string = '';
}
export class DhhVersionReqDTOModel extends BaseModel {
  partNumber: string = '';
}
/** 应用端-主页  维修手册  Request DTO */
export class ManualPageRequestDTOModel extends BaseModel {
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
   * 行业,示例值(工程机械 | 农业装备)
   * @format int32
   * @min 1
   * @example 1
   */
  industry?: string = '';

  /**
   * 系列(发动机、新能源),示例值(WP13)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  series?: string = '';
  /**
   * 名称(维修手册)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partName?: string = '';
  /**
   * 件号(1234668)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  partNumber?: string = '';

  /**
   * 功率,示例值(130KW)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  power?: string = '';

  /**
   * 排放,示例值(欧VI | 国V | 国VI)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  emission?: string = '';

  /**
   * 语言
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  fuelType?: string = '';

  /**
   * 查询条件
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  condition?: string = '';
}

/** 应用端  保养套餐  Request DTO */
export class UpkeepPackageRequestDTOModel extends BaseModel {
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
   * 系列(发动机、新能源),示例值(WP13)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  series?: string = '';
  /**
   * 排放,示例值(欧VI | 国V | 国VI)
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  emission?: string = '';

  /**
   * 机油等级
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  oilQualityGrade?: string = '';

  /**
   * 保养套餐
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  // bytcPartNumbers?: Array<string> = [];
  bytcPartNumbers?: string = '';

  partId?: string = '';

  dhhNumber?: string = '';
}

/** 应用端  保养说明书  Request DTO */
export class InstructionsRequestDTOModel extends BaseModel {
  /**
   * 保养说明书编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  maintenancePartNumbers?: Array<string> = [];

  /**
   * 保养卡编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  cardPartNumbers?: Array<string> = [];

  /**
   * 发动机-计划完工日期
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  completionDate?: string = '';
  partId?: string = '';
}
