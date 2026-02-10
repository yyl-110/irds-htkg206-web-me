/** 数据模型类基类 */
export declare class BaseModel {
  /**
   * 从指定数据生成 model class 实例
   * @description 一般用于从模型类实例生成此数据的表单类实例
   * @param cls Model Class
   * @param data 源数据
   */
  static toModel<T, D = Partial<Omit<T, ''>>>(cls: ClassType<T>, data: D): T;
}
/** 获取 class 本身而非实例 */
export interface ClassType<T> {
  new (...args: any[]): T;
}
