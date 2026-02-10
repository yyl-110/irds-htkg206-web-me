// import type { BaseModel, ClassType } from '@wei/openapi-codegen/es/src/BaseModel';
// import type { BaseUISchema } from '@wei/openapi-codegen/es/src/BaseUISchema';
// import type { OpenApiActionButton, OpenApiActions } from '@wei/openapi-codegen/es/src/OpenApiTags'
import type { BaseModel } from '@/utils/BaseModel';

export interface WeiSchemaFormPropsType<M extends BaseModel> {
  /** 同 a-form 的 labelCol */
  labelCol?: object;
  /** 同 a-form 的 wrapperCol */
  wrapperCol?: object;
  /** 数据模型类 */
  schemaModelClass?: ClassType<M>;
  /** 当前表单的操作类型 */
  schemaActionType: '';
  /** 显示的操作按钮 */
  schemaActionButtons?: Array<''>;
  /** 是否隐藏底部操作按钮行 */
  schemaHiddenActionFormItem?: boolean;
}
