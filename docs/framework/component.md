# 组件

## 公共组件 <Badge type="tip" text="1.1.0" />
> 从 `1.1.0` 起逐步将框架中的公共组件分离到组件库([wei-ui-vue](http://10.0.11.29:8144/wei-ui/langs/zh/components/UserTransferSelector.html))中

### 安装

```bash
pnpm i wei-ui-vue
```

### 引入

`src/main.ts`:
```typescript
// 1. 引入组件
import {
  WeiQueryForm,
  WeiQueryFormItem,
  WeiTableButton,
  WeiUserTransferSelector,
  // ...
} from 'wei-ui-vue'

const app = createApp(App)

// 2. 注册组件
app.use(WeiUserTransferSelector)
app.use(WeiQueryForm)
app.use(WeiQueryFormItem)
app.use(WeiTableButton)
```

引入组件库中的类型:

```typescript
import type { SelectionPropType } from 'wei-ui-vue/dist/types/components/UserTransferSelector'
```

## vxe-table
> 自 `3.0.6` 起, 引入了更加 **灵活强大可扩展** 的表格组件 [vxe-table](https://vxetable.cn/#/grid/api), 样式已修改为与 [a-table](https://3x.antdv.com/components/table-cn) 一致, 并且已适配框架的多语言和暗黑模式, 详见 [#6](http://10.190.0.43:8081/platform/new-framework-front/-/merge_requests/6)

::: warning 关于虚拟滚动
[a-table](https://3x.antdv.com/components/table-cn) 不支持虚拟滚动, 如果需要在表格中加载大量数据, 应该使用 [vxe-table](https://vxetable.cn/#/grid/api)(参考 **[🔗 虚拟滚动](https://vxetable.cn/#/component/table/scroll/vertical)**)
:::

### 对比 a-table
| 功能                 | vxe-table                               |  a-table              |
|----------------------|-----------------------------------------|---------------------------------------|
| 虚拟滚动             | 支持大数据量的虚拟滚动                  | 仅付费版支持                 |
| 数据编辑             | 内置支持单元格增删改查、单元格编辑(*依赖于 [vxe-pc-ui](https://vxeui.com/#/start/install)*)      | 需要自行实现，且功能较少             |
| 扩展性               | 支持插件扩展（筛选、导出、树形表格等）  | 不支持扩展   |
| 可配置性               | 支持全局配置 / formater / render / ... |  不支持全局配置  |
| 导入导出             | 支持 Excel、CSV 等文件导入导出          | 需要第三方库实现                     |
| 性能                 | 性能优化良好，适合处理大数据量表格      | 性能一般，适合小中型数据集           |
| API 复杂度           | 较复杂                    | 相对简单                   |

### 何时使用 vxe-table
- 目前对于需要使用虚拟滚动的场景, 只能使用 [vxe-table](https://vxetable.cn/#/grid/api)
- 如需对 props / 格式化 / 渲染器 / 校验 / 工具栏 / ... 进行全局配置, 可以使用 [vxe-table](https://vxetable.cn/#/grid/api)

::: warning 样式差异
**[vxe-table](https://vxetable.cn/#/grid/api) 及其基础组件库 [vxe-pc-ui](https://vxeui.com/#/start/install) 的样式与 `ant-design-vue` 存在细微差别**, 所以在使用 [vxe-table](https://vxetable.cn/#/grid/api) 时可能会存在视觉上的差异, **在需要严格统一 UI 风格的项目中请谨慎使用**

如需修改 [vxe-table](https://vxetable.cn/#/grid/api) 的样式, 可在 `src/sheets/vxe-table.less` 中进行修改
:::

### DEMO 参考

框架中已经在部分页面使用了 `vxe-table`:
- 部门管理(虚拟滚动): `src/views/system/dept/index.vue`
- 用户管理(分页): `src/views/system/user/index.vue`

### 按需引入
框架已经配置好了 [按需引入](https://vxetable.cn/#/start/useGlobal), 实际使用时可能需要手动引入, 参考 `src/plugins/vxe/index.ts` 文件

### 全局配置
可在 `src/plugins/vxe/index.ts` 中配置, 参考 [API 文档](https://vxetable.cn/#/grid/api?apiKey=grid)

### 全局格式化
可在 `src/plugins/vxe/formats.ts` 中配置, 参考 [格式化 (全局复用)](https://vxetable.cn/#/global/formats/table/base)

### 全局渲染器
可在 `src/plugins/vxe/renderer.ts` 中配置, 参考 [渲染器 (全局复用)](https://vxetable.cn/#/global/renderer/table/default/myCellLink)
