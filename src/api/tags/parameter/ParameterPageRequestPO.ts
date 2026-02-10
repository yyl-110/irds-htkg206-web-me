export interface ParameterPageRequestPO {
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

  parameterName?: string;
  parameterNum?: string;
  categoryid?: string;
  userId?: number;
}

// ------------------end--------------订单号明细----------------------------------------------
