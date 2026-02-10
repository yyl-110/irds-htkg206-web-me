# 规范

## 开发规范

### Vue 风格
必须使用 组合式 API

### IDE
推荐使用的 IDE 是 VSCode，配合 Vue 语言特性 (Volar) 插件。该插件提供了语法高亮、TypeScript 支持，以及模板内表达式与组件 props 的智能提示

### 代码规范(eslint)
> 代码规范基于 `eslint`, 开发时需要安装 `eslint` 的 `IDE` 插件, 在 `git commit` 时会检查语法, 检测到报错时会禁止提交

- `vue`: 使用 Vue 的代码规范使用官方维护的 [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) 规则
- `TypeScript`: 使用 typesript 官方提供的适合于 ts 代码检查的配置 [@typescript-eslint/recommended](https://www.npmjs.com/package/@eslint-recommended/eslint-config-typescript)

### git commit message
> 在每次 `commit` 时会对提交的信息进行格式检查, 可以使用 `git cz`(需要全局安装 `commitizen`) 或 `npm run commit` 替代 `git commit`; 参考自 [git commit 规范和工具类的使用](https://juejin.cn/post/6844903877196644365#heading-7)

相关配置:
- 格式检查配置文件 [.commitlintrc.cjs](./commitlintrc.cjs)
- cz-customizable 配置 [.cz-config.cjs](./cz-config.cjs)

```bash
# 全局安装 commitizen 以使用 git cz 命令
# npm i -g commitizen

git add -A
# 提交代码
git cz
```

使用交互式命令行提交 **符合 [Angular commit message 规范](https://www.cnblogs.com/ltaodream/p/16113677.html) 的 `git message`**

## 开发流程

1. 启动项目

```bash
npm run dev
```

2. 增加一个路由页面(示例)
在 **菜单管理** 中添加菜单:

- 路由地址: 对应路由的 `path`
- 组件地址: 对应路由文件的路径, *例如当前路由文件为 `src/views/test/Test.vue`, 组件地址可以填写为 `src/views/test/Test.vue`*
- 组件名称: 与芋道不同的是, 组件名称可重复, 无需在页面中单独声明 `name`

3. 配置权限
- `v-hasPermi` 指令, 基于权限字符, 进行权限的控制

```html
<!-- 单个 -->
<el-button v-hasPermi="['system:user:create']">存在权限字符串才能看到</el-button>

<!-- 多个，满足任一一个即可 -->
<el-button v-hasPermi="['system:user:create', 'system:user:update']">包含权限字符串才能看到</el-button>
```

- `v-hasRole` 指令, 基于角色标识, 机进行的控制

```html
<!-- 单个 -->
<el-button v-hasRole="['admin']">管理员才能看到</el-button>

<!-- 多个，满足任一一个即可 -->
<el-button v-hasRole="['role1', 'role2']">包含角色才能看到</el-button>
```

4. 测试(可选)
```bash
# 单元测试
npm run test

# e2e 测试(UI)
npm run test:e2e

# e2e 测试(head 模式)
npm run test:e2e:headed
```

5. 提交
```bash
# 全局安装 commitizen 以使用 git cz 命令
# npm i -g commitizen

git add -A
# 提交代码
git cz
```

6. 打包
```bash
npm run build
```

### 部署上线要求
线上使用的 `npm` 源是 `http://10.190.0.226:8081/artifactory/api/npm/npm/`
