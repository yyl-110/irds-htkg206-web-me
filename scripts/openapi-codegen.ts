import { join } from 'node:path'
import { CodegenHandler, type SwaggerOriginConfigMapOption } from '@wei/openapi-codegen/es/src/CodegenHandler'

/** 项目中使用的所有 Swagger config */
enum SwaggerConfig {
  /** 框架的 Swagger config */
  framework = 'framework',
  // /** 业务项目使用的 Swagger config */
  // project = 'project',
}

/** 数据源配置 */
const originConfigs: SwaggerOriginConfigMapOption<SwaggerConfig> = {
  framework: {
    includes: ['system服务'],
    url: 'http://10.190.113.233:31017/v3/api-docs/swagger-config',
  },
  // project: {
  //   url: 'http://10.190.113.233:31037/v3/api-docs/swagger-config',
  // },
}
/** 代码生成处理对象 */
const codegenHandler = new CodegenHandler<SwaggerConfig>(originConfigs)
/** 生成文件输出目录 */
const baseDir = 'src/origins'

async function main() {
  // 1. 解析 swagger-config 中的所有数据源
  await codegenHandler.fetch(baseDir)

  // 此时所有数据源已经解析完毕, 每个数据源都生成了对应的 config, 可以使用 `codegenHandler.originConfigMap` 修改数据源的 config
  // 可以使用 `codegenHandler.forEachOrigins()` 遍历所有数据源
  // codegenHandler.forEachOrigins(({ origin }) => console.log(origin))
  await codegenHandler.forEachOrigins(({ originKey, origin }) => {
    if (originKey === 'framework_system服务')
      origin.config.setBaseDir('src/api', join(baseDir, originKey))

    console.log(originKey, origin.config)
  })

  // 2. 下载 swagger.json
  await codegenHandler.downloadSwaggerJson()

  // // 3-1. 生成代码(单线程同步)
  // await codegenHandler.codegenSync()
  // 3-2. 生成代码(单线程异步)
  await codegenHandler.codegenAsync()

  console.log('>>>>>>>>>>>   done.   >>>>>>>>>>')
}

main()
