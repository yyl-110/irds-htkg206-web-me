export interface NoticeRequestPO {
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
   * 名称，模糊匹配
   * @example ""
   */
  title?: string;
  /**
   * 角色标识，模糊匹配
   * @example ""
   */
  type?: string;
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  releaseFlag?: number;

  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  userid?: number;
}

// ------------------end--------------订单号明细----------------------------------------------
