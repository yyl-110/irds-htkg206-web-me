# 开始

## 开发

```bash
# 安装依赖
pnpm i

# 启动项目
pnpm run dev

# 文档(开发)
pnpm run docs:dev

# 文档(打包)
pnpm run docs:build

# 单元测试
pnpm run test

# e2e 测试(UI)
pnpm run test:e2e

# e2e 测试(head 模式)
pnpm run test:e2e:headed
```

### git commit message
> 在每次 `commit` 时会对提交的信息进行格式检查, 可以使用 `git cz`(需要全局安装 `commitizen`) 或 `pnpm run commit` 替代 `git commit`; 参考自 [git commit 规范和工具类的使用](https://juejin.cn/post/6844903877196644365#heading-7)

相关配置:
- 格式检查配置文件 [.commitlintrc.cjs](./commitlintrc.cjs)
- cz-customizable 配置 [.cz-config.cjs](./cz-config.cjs)

```bash
# 全局安装 commitizen 以使用 git cz 命令
pnpm i -g commitizen
```

```bash
git add -A
# 提交代码
git cz
```

使用交互式命令行提交 **符合 [Angular commit message 规范](https://www.cnblogs.com/ltaodream/p/16113677.html) 的 `git message`**

```bash
? 请选择提交类型 (必填):
  🚧 wip: 进行中的工作
❯ 🐛 fix: 修复一个 Bug
  📝 docs: 文档变更
  💄 style: 代码风格，格式修复
  ♻️  refactor: 代码重构, 注意和 feat / fix 区分开
  ⚡️ perf: 代码优化, 改善性能
  ✅ test: 测试
```

## 打包构建
```bash
pnpm run build
```

```bash
# 构建为框架的 Demo 站点
pnpm run build:demo
```

## 构建模式
参考 [vite mode](https://cn.vitejs.dev/guide/env-and-mode.html#modes)

- `development`: 开发环境
- `production`: 生产环境
- `demo`: 框架 `Demo` 站点
