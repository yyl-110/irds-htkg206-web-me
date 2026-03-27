export interface ProductTempRequestPO {
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
   * 名称，模板编号
   * @example ""
   */
  tempNum?: string;
  /**
   * 角色标识，模板名称
   * @example ""
   */
  tempName?: string;
}

// ------------------end--------------订单号明细----------------------------------------------
