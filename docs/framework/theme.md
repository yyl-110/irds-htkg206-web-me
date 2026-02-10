# 主题
> **使用方式直接参考 `src/utils/WeiTheme.ts` 的 `WeiTheme`**

一些主题样式文件:

- [src/sheets/theme.css](./src/sheets/theme.css)
- [WeiTheme.ts](./src/utils/WeiTheme.ts)
- [antd.dark.min.css](./public/style/antd.dark.min.css)

## 夜间模式实现
> 通过在 `head` 中动态注入[夜间模式的 css 文件](https://www.antdv.com/docs/vue/customize-theme-cn#%E4%BD%BF%E7%94%A8%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98)(在此项目中作为静态资源文件 ~~[public/style/antd.dark.min.css](./public/style/antd.dark.min.css)~~)

```typescript
import { useDarkTheme } from '@/hooks/useDarkTheme'

const {
  themeValue, // 'light' | 'dark'
  toggleDark, // 切换夜间模式
} = useDarkTheme()
```

```bash
# 生成所有主题色对应的夜间模式 css 文件(通过编译 `./node_modules/ant-design-vue/dist/antd.dark.less` 实现)
pnpm run generate-dark-theme-css
```
