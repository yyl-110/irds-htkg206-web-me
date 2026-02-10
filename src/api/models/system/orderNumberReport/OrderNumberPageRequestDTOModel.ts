import { BaseModel } from '@/utils/BaseModel';
import type { OrderNumberReportRequestDTO } from '../../../tags/data-contracts';
/** 管理后台 -分页搜索条件  Request DTO */
export class OrderNumberPageRequestDTOModel extends BaseModel implements OrderNumberReportRequestDTO {
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
   * 开始时间
   * @format int32
   * @min 1
   * @example 1
   */
  startDate?: string;
  /**
   * 结束时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  endDate?: string;

  userType?: string;
}

/** 管理后台 -分页搜索条件  Request DTO */
export class userPageRequestDTOModel extends BaseModel {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo?: number = 0;

  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize?: number = 0;

  /**
   * 开始时间
   * @format int32
   * @min 1
   * @example 1
   */
  startDate?: string;

  /**
   * 结束时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  endDate?: string;

  userType?: string;

  /**
   * 件号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  fittingCode?: string;

  /**
   * 城市名称
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  cityName?: string;

  /**
   * 数据id
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  id?: string;
}

/** 创建查询结果  Request DTO */
export class asyncReportRequestDTOModel extends BaseModel {
  /**
   * 订货号
   * @format int32
   * @min 1
   * @example 1
   */
  orderNum?: string;

  /**
   * 订货号开始时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  orderNumberStartData?: string;

  /**
   * 订货号结束时间
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  orderNumberEndData?: string;

  /**
   * 出厂编号
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  serialNumber?: string;

  // 查询参数
  queryParam?: string;

  // 查询类型
  queryType?: string;
}
