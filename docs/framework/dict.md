# 字典
- 字典类型: 字典本身的信息
- 字典数据: 此字典中包含的所有字典项数据

## useDict
> 从 [3.0.1](./CHANGELOGS.md#_3-0-1) 开始, 增加 `useDict hooks` **封装了字典数据的获取和处理逻辑**, 调用时会请求指定的字典类型及其数据并缓存, 并提供了数据的渲染方法

### 获取一个字典及其数据
```typescript
import { useDict } from '@/hooks/useDict'
import { DICT_TYPE } from '@/utils/dict'

// 获取字典 `DICT_TYPE.BPM_MODEL_CATEGORY` 的数据
const { dict } = useDict({ dictType: DICT_TYPE.BPM_MODEL_CATEGORY })
```

其中 `DICT_TYPE.BPM_MODEL_CATEGORY` 是一个定义在 `src/utils/dict.ts` 中的枚举类型值, 值类型为 `string`, **推荐将字典名称写到 `DICT_TYPE` 中并为其增加 [注释](./comment.md)**

```html
<a-select
  v-model:value="dictValue"
  style="width: 150px"
  allow-clear
  :options="dict.dataOptions"
/>
```
可以直接使用 `dict.dataOptions` 作为 `a-select` 的 `options props`
> `dict.dataOptions` 中的字典数据的 `value` 为 `string` 类型, 如需获取 `number` 类型的值, 可以使用 `dict.numberDataList`

```html
<div>{{ dict.getLabel(dictValue) }}</div>
```

可以通过 `dict.getLabel` 获取字典数据对应的 `label` 用于显示, **当值为 `undefined | null` 时, 会返回空字符串**

### 获取多个字典及其数据

::: details 展开查看
```typescript
import { useDict } from '@/hooks/useDict'
import { DICT_TYPE } from '@/utils/dict'

// 获取字典 `BPM_MODEL_CATEGORY` 和 `COMMON_STATUS` 的数据
const { dictDataMapCache } = useDict({
  dictTypes: [
    DICT_TYPE.BPM_MODEL_CATEGORY,
    DICT_TYPE.COMMON_STATUS,
    // ...
  ]
})
```
支持获取多个字典类型及其数据, `dictDataMapCache` 是 `hooks` 内部缓存的字典数据 `Map`, 包含了所有已请求的字典数据

```html
<a-select
  v-model:value="dictValue"
  style="width: 150px"
  allow-clear
  :options="dictDataMapCache[DICT_TYPE.BPM_MODEL_CATEGORY].dataOptions"
/>
```

在 `a-select` 中可以直接使用 `dictDataMapCache[DICT_TYPE.BPM_MODEL_CATEGORY].dataOptions` 作为 `a-select options prop`

```html
<div>{{ dictDataMapCache[DICT_TYPE.BPM_MODEL_CATEGORY].getLabel(dictValue) }}</div>
```

渲染时可使用 `dictDataMapCache[DICT_TYPE.BPM_MODEL_CATEGORY].getLabel`

:::

### 获取所有字典数据

```typescript
const { dictDataMapCache } = useDict({ updateAll: true })
```

可传入 `updateAll: true` 直接获取所有字典数据

## BaseDictionary <Badge type="info" text="待完善" />
> 用于定义可复用可扩展的静态的枚举数据, 参考 `src/dict/BaseDict.ts` `BaseDictionary`

### 定义简单的枚举数据
```typescript
import { BaseDictionary, BaseDictionaryItem } from './BaseDict'

export const SystemUserSexDict = BaseDictionary.from({
  name: '用户性别',
  type: 'system_user_sex',
  items: BaseDictionaryItem.fromItems(BaseDictionaryItem, [
    { label: '男', value: '1' },
    { label: '女', value: '2' },
  ])
})
```

简单的枚举数据一般用于下拉列表的 `options`

### 可扩展的字典
```typescript
import { BaseDictionary, BaseDictionaryItem } from './BaseDict'

/** 登录结果, 扩展默认的字典项类型 */
export class SystemLoginResultItem extends BaseDictionaryItem<number> {
  /** 对应的错误码, 仅在当前字典中使用 */
  errorCode: string = ''
}

export const SystemLoginResultDict = BaseDictionary.from<number, SystemLoginResultItem>({
  name: '登录结果',
  type: 'system_login_result',
  items: BaseDictionaryItem.fromItems<number, SystemLoginResultItem>(SystemLoginResultItem, [
    { label: '测试', value: 0, errorCode: '0' },
    { label: '未知异常', value: 100, errorCode: '100' },
    { label: '验证码不正确', value: 31, errorCode: '31' },
    { label: '验证码不存在', value: 30, errorCode: '30' },
    { label: '用户被禁用', value: 20, errorCode: '20' },
  ])
})
```

`BaseDictionary` 提供了泛型参数以扩展字典项类型:

- 可以通过传入泛型 `SystemLoginResultItem` 定义字典项的数据类型
- 传入 `number` 自定义 `value` 字段的类型

#### 用途
TODO

### API
`src/dictionaries/BaseDict.ts`:

<<< @/../src/dictionaries/BaseDict.ts

- `BaseDictionary`: 字典, 继承了原字典的数据类型(`DictTypeResponseDTOModel`)
  - `items`: 当前字典中包含的所有字典项
  - `getItem(value)`: 按指定的 `value` 获取某个字典项
- `BaseDictionaryItem`: 字典项的类型, 实现了原字典数据的数据类型(`DictDataResponseDTOModel`), **在此基础上将 `value` 改为泛型类型**
