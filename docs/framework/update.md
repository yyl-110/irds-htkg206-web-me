# 检查更新

## 功能
- 在每次打包时 **生成包含 [版本号](#版本号) 信息的 `update.json`(`dist/update.json`)**, 并将版本号写入 `index.html` 中
- 当用户处于 [活跃状态](#活跃状态) 时 [轮询请求](#检查更新请求) `update.json` 文件, 对比本地与 `update.json` 文件中的版本号, 若版本号不一致则 **显示更新提示弹窗**

## 版本号
版本号格式为: `$pkg_version.$timestamp`, 例如 `1.2.1.1694052833190`

- `$pkg_version` 为 `package.json` 中的 `version`
- `$timestamp` 为当前时间戳

## 活跃状态
使用 [useIdle() - VueUse](http://www.vueusejs.com/core/useIdle/#useidle) 判断当前用户是否空闲

- 当用户超过 `10s` 对此页面没有任何操作时为空闲状态, 空闲状态停止 [轮询检查更新请求](#检查更新请求)
- 当用户处于非空闲状态(活跃状态)时进行 [轮询检查更新请求](#检查更新请求)

## 检查更新请求
用户处于活跃状态时发起 `/update.json` 请求, 每隔 `7s` 请求一次

## 源码
- `src/plugins/checkUpdate/plugin.ts`: 生成版本信息的 `vite` 插件
- `src/hooks/useWeiUpdateChecker.ts`: 用于检查更新的 `hooks`
