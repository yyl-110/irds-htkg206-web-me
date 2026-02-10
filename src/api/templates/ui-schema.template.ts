import type { BaseUISchema, BaseUISchemaGetter } from '../BaseUISchema'
import { UserCreateRequestDTOModel } from '../models/UserCreateRequestDTOModel'

export const uiSchema: BaseUISchemaGetter<UserCreateRequestDTOModel> = (model: UserCreateRequestDTOModel = new UserCreateRequestDTOModel()) => {
  const schema: BaseUISchema<UserCreateRequestDTOModel> = {
    dataSource: [],
    schemaName: '',
    model,
    columns: [],
    rules: {},
  }
  return schema
}

export default uiSchema
