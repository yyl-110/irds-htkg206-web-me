export interface ProjectInfoRequestPO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  currentPage: number;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  numberPage: number;

  /**
   * 产品平台ID
   * @example ""
   */
  productPlatformId?: string;

  /**
   * 项目状态
   * @example ""
   */
  projectstatus?: string;

  /**
   * 项目名称
   * @example ""
   */
  projectName?: string;

  /**
   * 项目编号
   * @example ""
   */
  projectNum?: string;
}

// ------------------end--------------订单号明细----------------------------------------------
