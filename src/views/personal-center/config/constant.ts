/** 状态常量  */
export enum State {
  未开始 = '未开始',
  正在处理 = '正在处理',
  已完成 = '已完成',
}

/** 反馈类型 */
export enum FeedbackType {
  配件缺失 = '配件缺失',
  业务错误 = '业务错误',
  数据错误 = '数据错误',
}

// 声明表格类型
export interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
}

/** 购物车 */
export interface CatDataType {
  // id: Key
  objType: string;
  objId: string;
  objNumber: string;
  amount: number;
  buyFlag?: boolean;
}
