import { BaseModel } from '@wei/openapi-codegen/es/src/BaseModel'
import { CodegenConfig } from '@wei/openapi-codegen/es/src/config'

/** 代码生成配置 */
export const codegenConfig = BaseModel.toModel<CodegenConfig>(CodegenConfig, {})

/** openapi json 文件地址 */
export const OPENAPI_JSON_URL = 'http://10.190.113.233:31017/admin-api/system/v3/api-docs'
