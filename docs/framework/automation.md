# 自动化

## scripts
> `package.json` 中的一些脚本

- `generate-dark-theme-css`: 根据项目中定义的主题(颜色), 调用 `lessc` 将 `ant-design-vue` 的样式文件编译为不同的主题样式文件
- `download-openapi`: 下载 `Swagger UI` 站点中的 `json` 文件

## 自动化测试
> 用于支撑自动化测试的功能

### 自动拖动登录验证码
> 在执行 [`e2e` 测试](./test.md#e2e-测试-端到端测试) 时, **需要将登录过程自动化**, 就需要实现自动拖动登录时的验证码的算法,
> 还需要 *兼容 `playwright headless` 模式和前端环境(**开发环境下登录时可以自动拖动验证码**)*, 参考 `tests/utils/CaptchaImage.ts`

`CaptchaImage` 读取了验证码图片中的像素信息并进行对比, 确定拼图的位置以计算拖动距离;

- 在测试环境下, 使用 `get-pixels` 获取像素信息
- 前端环境下使用 `canvas API` 获取像素信息

执行单元测试:

```bash
npx vitest run tests/utils/CaptchaImage.test.ts
```
