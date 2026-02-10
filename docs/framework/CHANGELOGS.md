# CHANGELOGS
> 版本与分支的关系:
> - `1.x`: `dev-auth`
> - `2.x`: `dev-auth-v2`
> - `3.x`: `dev-auth-v3`

::: danger Tips
<span style="color: red">红色字体为 `Breaking Change`</span>
:::

## 3.x(stable)

::: details 3.2.0
### ~~3.2.0(⛳️ Not Started)~~
> 用于打包的微应用项目只能使用 `vite@2.x`, 项目中使用的是 `vite@4.x`, 为了不影响框架, 已在 *微应用项目* 中完成
- ~~微前端~~
  - ~~增加微前端的 `vite` 配置文件用于打包~~
  - ~~修改系统管理页面, 兼容只有系统管理页面的微前端项目~~
:::

### 3.1.0(🚧 In Progress)
::: details
- 🚧 TODO: 重写所有系统管理页面
  - 将 `options API` 改为 `composition API`
  - 将请求改为代码生成
  - 优化页面
- 请求
  - 🚧 TODO: <span style="color: red">移除 `src/api` 目录下所有的非代码生成请求(主要是 系统管理页面中所有的请求)</span>
- pinia
  - 🚧 TODO: 移除冗余代码, 简化现有 `store` 代码, <span style="color: red;">调整部分 `store API`</span>
  - 🚧 TODO: 增加本地存储文档
- `package.json`
  - 移除多余的 `script`
  - <span style="color: red;">将 `build` 命令的 `mode` 去掉, 默认为 `production`</span>
  - 增加 微前端打包命令 `build:micro`
- `.env.*`
  - 移除未使用的环境变量
  - 移除未使用 `.env` 文件
  - 补全环境变量注释
- 用户部门选择器:
  - 默认可以直接在 `select` 中搜索和选择用户或部门
- `types/*.d.ts`
  - <span style="color: red;">移除未使用或没有必要创建的类型</span>
:::

### 3.0.5
> 2024-08-07 08:41:10
- 在 `useWeiTab()` 中增加 `options.onTabsRemoved` 参数用于监听最近被移除的标签页, 详见 [路由 - tabs 标签页](./route.md#tab-标签页)

### 3.0.4
> 2024-08-01 15:44:32
- 增加全局方法 `$isPending` 用于判断接口请求状态, 详见 [请求 - 正在请求的接口](./request.md#正在请求的接口)

### 3.0.3
> 2024-08-01 09:42:30
- 重构 `UploadImg` 组件([#78a5c30d](http://10.190.0.43:8081/platform/new-framework-front/-/commit/78a5c30de259767c61e3d6e0f05f13f5d67d2cba#note_31246))
  - 通过 `customRequest` 实现调用封装的 axios 请求上传文件接口, 确保执行 access token 刷新逻辑
  - <span style="color: red">将 `modelValue` 参数改为非受控, 只在组件初始化时创建 `UploadFile` 数据</span>
  - <span style="color: red">删除 `update:customRequest` 事件, 增加 `change` 事件</span>
  - 在上传成功后和组件初始化时调用预览接口获取文件的 `url`
  - 不建议使用此组件, 应该根据项目中实际的上传和预览接口及上传文件的需求进行组件封装

### 3.0.2
> 2024-07-01 16:42:53
- 重写部门管理页面的 新增 / 编辑 组件
- 增加 `useModelData hooks`
- 增加 [Model Class](./Model.md) 文档
- 增加 [Model Class 相关的 hooks](./Model.md#hooks) 文档
- 🐛 用户管理: 修复创建时间筛选项绑定值错误的问题
- 🐛 修复 `commit` 时检测了所有文件的问题

### 3.0.1
> 2024-06-29 08:31:57
- 字典:
  - 增加 `useDict hook`, 用于获取和处理字典数据, 详见 [字典](./dict.md)

### 3.0.0
> 2024-04-20 10:19:23

- `eslint`
  - 将 `eslint.config.cjs` 改为 `eslint.config.ts`, 由 [eslint-ts-patch](https://www.npmjs.com/package/eslint-ts-patch) 支持
  - 引入 [`@antfu/eslint-config`](https://www.npmjs.com/package/@antfu/eslint-config) 作为 `eslint` 规则
  - 引入 [`eslint-plugin-jsdoc`](https://www.npmjs.com/package/eslint-plugin-jsdoc) 增强 `jsdoc` [注释](./comment.md) 规范
- 请求
  - <span style="color: red">请求拦截器中判断如果返回的 `code` 不是 `200`, 则会直接 [抛出异常](./request.md#错误处理)</span>(值为 `ResponseError`)
  - <span style="color: red">`headers.isToken` 语义错误且并未使用, 所以废弃此属性, 改为 `noToken`, `noToken` 表示不在请求头中增加 `Access Token`</span>
  - <span style="color: red">移除用于发起请求的 `get` / `post` 方法, 可以直接使用代码生成的请求方法, 或使用 `@/httpRequest`</span>
  - 增加用于处理分页参数的 `hook` `usePagination`, 详见 [分页请求](./request.md#分页)

## 2.x(stable)
### 2.11
> 2024-04-18 16:30:25

- 更新依赖, 参考自 [Vue 3.4 发布](https://juejin.cn/post/7317809451187208218):
  - `vue`: `3.2.45` 🔼 ~~`^3.4.23`~~ `3.3.13`
    - 🐛 `ant-design-vue` 中的 `Modal` 组件在 `vue@3.4.x` 下无法关闭, 需等待 `ant-design-vue@^3.x` 修复, 参考 [#7252](https://github.com/vueComponent/ant-design-vue/pull/7252)
  - `vue-tsc`: `1.0.24` 🔼 `^2.0.13`

### 2.0.0
> 2024-01-17 16:14:27

- 升级代码生成库(`@wei/openapi-codegen`), 详见 `scripts/openapi-codegen.ts` 及 `@wei/openapi-codegen` `README.md`
  - 支持多数据源
  - 增强接口返回值类型的兼容
  - <span style="color: red;">默认不生成 `schema` 和 `ui-schema`</span>
  - <span style="color: red;">**弃用 `scripts/openapi-codegen-config.ts`**, 将代码生成改为多数据源生成, 以支持项目使用多个 `swagger` 的场景</span>
- 升级组件库(`wei-ui-vue`) `1.x` => `2.x`, 包含不兼容的改动, 详见 [v1 到 v2](http://10.0.11.29:8144/wei-ui/langs/zh/components/UserTransferSelector.html#v1-%E5%88%B0-v2)
  - <span style="color: red;">如果之前传入了 `modalFooter slot`, 需要调用 `defineExpose` 的 `onClickOk` 来触发 `change` 事件, 则不会触发 `change` 事件</span>

## 1.x
### 1.1.0
> 2023-10-31 14:47:21

- 将代码生成功能分离到 `@wei/openapi-codegen` 包中, 详见 [代码生成](./codegen.md)
- 将部分组件(`src/wei-components/`)分离到组件库项目(`wei-ui-vue`)中, 详见 [组件](./component.md)
