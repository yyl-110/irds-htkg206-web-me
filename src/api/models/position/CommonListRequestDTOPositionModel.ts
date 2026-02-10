import { BaseModel } from '@/utils/BaseModel';
import type { MenuListRequestDTO, regionListRequestDTO, ordermanagementListRequestDTO } from '../../tags/data-contracts';

/** 管理后台 - 岗位列表 Request DTO */
export class CommonListRequestDTOPositionModel extends BaseModel implements MenuListRequestDTO {
  /**
   * 岗位名称，模糊匹配
   * @example ""
   */
  name?: string = '';
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number = 0;
  type?: string = '';
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number = 0;
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  page: number = 1;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 10;
  /**
   * 条件,示例值(订货号缺失)，模糊匹配
   * @example ""
   */
  condition?: string = '';
}
/** 管理后台 - 区域导出列表 Request DTO */
export class CommonListRequestDTOregionGementModel extends BaseModel implements regionListRequestDTO {
  type?: string = '';
}
/** 管理后台 - 订单列表 Request DTO */
export class CommonListRequestDTOModulordermanagementModel extends BaseModel implements ordermanagementListRequestDTO {
  /**
   * 岗位名称，模糊匹配
   * @example ""
   */
  orderContractNumber?: string = '';
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  startTime?: string = '';
  endTime?: string = '';
  id?: string = '';
  orderId?: string = '';
  createUserId?: string = '';
  orderType?: string = '';
  orderDate?: string = '';
  adminUserId?: string = '';
  adminDeptId?: string = '';
  orderStatus?: string = '';
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number = 0;
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  page: number = 1;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 10;
  /**
   * 条件,示例值(订货号缺失)，模糊匹配
   * @example ""
   */
  condition?: string = '';
}
/** 管理后台 - 列表 Request DTO */
export class CommonListRequestDTOModulpartmanagementModel extends BaseModel {
  partName?: string = '';
  partNumber?: string = '';
  partDrawing?: string = '';
  orderId?: string = '';
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
  pageSize: number = 10;
}
