# 介绍

## 技术栈
- [vue@3.x](https://cn.vuejs.org/guide/introduction.html)
- [TypeScript@4.x](https://www.tslang.cn/docs/handbook/basic-types.html)
- [vite@4.x](https://cn.vitejs.dev/)
- [ant-design-vue@3.x](https://www.antdv.com/docs/vue/introduce-cn)
- [tailwindcss@3.x](https://www.tailwindcss.cn/docs/display)
- [less@4.x](https://github.com/less/less.js)
- [pinia@2.x](https://pinia.vuejs.org/zh/introduction.html)
- [vueuse@10.x](http://www.vueusejs.com/)
- [vitepress@1.0.0-beta.2](https://vitepress.dev/)

## 资源
- [UI 原型图](https://modao.cc/app/Xwfn35xbrs1zuvUaX9X8mi#screen=slfrv1pp2p6w1au)
- [芋道前端文档](https://doc.iocoder.cn/vue3/dev-spec/)
- [Swagger UI](http://10.190.113.233:31009/swagger-ui/index.html)

## 分支
::: tip
新项目应该基于 `dev-auth-v3` 创建
:::

分支 | 说明 | 更新策略 | 组件库 | 代码生成库 | `eslint` | [错误码处理](./request.md#错误处理)
--- |--- |--- |--- |--- |--- |---
`dev-auth` | 旧项目基于此分支创建 | 仅修复 `BUG` | `^1.x` | `^1.x` | 宽松 | 忽略
`dev-auth-v2` | 基于 `dev-auth` 创建 | 长期支持 | `^2.x` | `^2.x` | 宽松 | 忽略
`dev-auth-v3` | 基于 `dev-auth-v2` 创建 | 长期支持 | `^2.x` | `^2.x` | 严格(基于 [@antfu/eslint-config](https://www.npmjs.com/package/@antfu/eslint-config)), 详见 [文档](./comment.md) | 抛出异常

版本间差异见 [CHANGELOGS](./CHANGELOGS.md)

## 目录结构 <Badge type="info" text="待完善" />
```bash
lsd --tree --depth=3 --ignore-glob=node_modules ./

📂 ./
├──  components.d.ts
├── 📂 dist                                       # 构建输出目录
│  ├── 📂 assets
│  ├──  index.html
│  └── 📂 style
├── 📂 docs                                       # 文档目录
│  ├──  api-examples.md
│  ├── 📂 framework                               # 框架文档目录
│  ├──  index.md
│  ├──  markdown-examples.md
│  └── 📂 project                                 # 项目文档目录
├──  index.html
├──  package-lock.json
├──  package.json
├──  pnpm-lock.yaml
├──  postcss.config.cjs                          # postcss 配置文件
├── 📂 public                                     # vite 公共资源目录
│  └── 📂 style
├──  README.md
├── 📂 scripts                                    # 项目中使用的脚本
│  └──  generate-dark-theme-css.ts
├── 📂 src
│  ├── 📂 api                                     # 请求相关的文件
│  │  ├── 📂 models                               # 生成的 model 类(DTO)
│  │  ├── 📂 tags                                 # 生成的 tags 类
│  │  ├── 📂 templates                            # 代码生成使用的模板文件(默认不使用此目录下的文件, 需要显示配置)
│  │  ├── 📂 ui-schemas                           # 生成的 UI Schema, 仅用于生成的页面使用
│  │  ├── 📂 schemas                              # 已弃用, 解析 OpenAPI 生成的 JSON Schema
│  ├── ﵂ App.vue
│  ├── 📂 assets
│  ├── 📂 components                              # 项目中使用的组件目录
│  ├── 📂 hooks                                   # 项目中使用的 vue hooks 目录
│  ├── 📂 httpRequest                             # 封装 axios 相关配置
│  ├──  main.ts
│  ├── 📂 router                                  # 存放项目的路由文件
│  ├── 📂 sheets                                  # 全局的样式文件
│  ├── 📂 store                                   # pinia 配置
│  ├── 📂 typings                                 # 定义项目中使用的类型
│  ├── 📂 utils                                   # 工具类和函数
│  ├── 📂 views
│  ├──  vite-env.d.ts                            # vite 环境变量的类型描述文件
│  └── 📂 wei-components                          # 框架提供的组件
├──  tailwind.config.cjs                         # Tailwind CSS 的配置文件
├──  tsconfig.json
├──  tsconfig.node.json
├── 📂 types                                      # 定义全局的类型
│  ├──  components.d.ts
│  ├──  custom-types.d.ts
│  ├──  env.d.ts
│  ├──  global.d.ts
│  ├──  router.d.ts
│  └──  vue-router.d.ts
└──  vite.config.ts                              # vite 配置文件
└──  .ts                              # vite 配置文件
```
