import { join } from 'node:path';
import process from 'node:process';
// import { CodegenViews } from '@wei/openapi-codegen/es/src/CodegenViews';
// import { codegenConfig } from './openapi-codegen-config';
// import { AdminApiSystemTenant, $tag as AdminApiSystemTenantTag } from '@/api/tags/管理后台租户';

async function main() {
  // 1. 声明所有 views 的生成配置
  const views = [
    // 租户
    new <AdminApiSystemTenant, typeof AdminApiSystemTenant>(AdminApiSystemTenant, AdminApiSystemTenantTag, {
      name: '租户',
      outputDir: join(process.cwd(), './src/views/system/tenant'),
    }),
  ];
  // 2. 调用 generate() 方法生成文件
  await Promise.all(views.map(v => v.generate()));
}

main();
