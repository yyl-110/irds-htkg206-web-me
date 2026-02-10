import { plainToClass } from 'class-transformer'

/** 数据模型类基类 */
class BaseModel {
  /**
   * 从指定数据生成 model class 实例
   * @description 一般用于从模型类实例生成此数据的表单类实例
   * @param cls Model Class
   * @param data 源数据
   */
  static toModel(cls, data) {
    const modelData = plainToClass(cls, data)
    return modelData
  }
}

export { BaseModel }
