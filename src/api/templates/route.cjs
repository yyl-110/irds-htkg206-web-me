// const util = require('node:util')

/**
 * 代码生成时用于处理每个接口的信息
 * @description 用于封装每个 `route` 的数据处理逻辑
 */
class RouteHandler {
  /**
   * 指定生成配置并创建 RouteHandler
   * @param {import("swagger-typescript-api").GenerateApiConfiguration['config'] | undefined} config 配置信息
   * @param {import("swagger-typescript-api").ParsedRoute} route 路由信息
   */
  constructor(config, route) {
    /** @type {import("swagger-typescript-api").ParsedRoute | undefined} */
    this.route = route
    /** @type {import("swagger-typescript-api").GenerateApiConfiguration['config']} */
    this.config = config
  }

  /** 当前类型是否是 schema */
  static isSchemaType(type) {
    return !type.includes('Array<') && type[0] !== '{'
  }

  /**
   * response schema name 对应的 data schema name
   * @type {{[schemaName: string]: string | undefined}}
   */
  static schemaDataNameMap = {}
  /** 获取 schema 对应的模型类的名称 */
  static getModelNameBySchemaName(schemaName) {
    return `${schemaName}Model`
  }

  /** 获取 schema 对应的 JSON Schema 的名称 */
  static getJSONSchemaNameBySchemaName(schemaName) {
    return RouteHandler.isSchemaType(schemaName) ? (`$${schemaName}`) : undefined
  }

  /** @type {import("openapi-types").OpenAPIV3.Document} */
  get swaggerSchema() { return this.config.swaggerSchema }
  /**
   * 获取当前接口返回值中可能包含的 data 属性的 schema
   * @param {string} route 路由
   * @returns 返回值中可能包含的 data 的 schema
   */
  getResponseDataSchemaName(route = this.route) {
    if (!route)
      return
    /** 接口返回值 schema 类型 */
    const responseSchemaName = route.response.type
    if (Reflect.has(RouteHandler.schemaDataNameMap, responseSchemaName))
      return RouteHandler.schemaDataNameMap[responseSchemaName]
    const dataSchemaName = this.findResponseDataSchemaName(responseSchemaName)
    RouteHandler.schemaDataNameMap[responseSchemaName] = dataSchemaName
    return dataSchemaName
  }

  findResponseDataSchemaName(responseSchemaName) {
    const schema = this.swaggerSchema.components.schemas[responseSchemaName]
    const invalidSchemaLog = console.error(`Invalid response schema name: ${responseSchemaName}`)
    if (!schema)
      return invalidSchemaLog()
    if (schema.properties && schema.properties.code && schema.properties.data && schema.properties.msg) {
      if (schema.properties.data.type === 'array' && schema.properties.data.items.$ref) {
        return this.getSchemaNameByRef(schema.properties.data.items.$ref)
      }
      else if (schema.properties.data.$ref) {
        const dataSchemaName = this.getSchemaNameByRef(schema.properties.data.$ref)
        const dataSchema = this.swaggerSchema.components.schemas[dataSchemaName]
        if (dataSchema.type === 'object'
          && (dataSchema.properties.list && dataSchema.properties.list.type === 'array' && dataSchema.properties.list.items && dataSchema.properties.list.items.$ref)
          && (dataSchema.properties.total && dataSchema.properties.total.type === 'integer')
        ) {
          // /page 请求的 data
          return this.getSchemaNameByRef(dataSchema.properties.list.items.$ref)
        }
        else {
          // /list | /get 请求的 data
          return this.getSchemaNameByRef(schema.properties.data.$ref)
        }
      }
    }
  }

  getSchemaNameByRef(ref) {
    const refParts = ref.split('/')
    if (refParts)
      return refParts[refParts.length - 1]
  }

  /**
   * 获取当前接口的返回值 `model class name`
   * @returns 接口返回值 model class
   */
  getResponseModel() {
    if (RouteHandler.isSchemaType(this.route.response.type))
      return RouteHandler.getModelNameBySchemaName(this.route.response.type)
    else
      return this.route.response.type
  }

  getResponseModelClass() {
    if (RouteHandler.isSchemaType(this.route.response.type))
      return RouteHandler.getModelNameBySchemaName(this.route.response.type)
    else
      return undefined
  }

  // getResponseJSONSchemaName() {
  //   `$${this.getResponseModel()}`
  // }
}

module.exports = RouteHandler
