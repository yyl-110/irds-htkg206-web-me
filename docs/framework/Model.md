# Model Class
> `Model Class` 是在 [代码生成](./codegen.md) 时创建的数据模型类, [代码生成](./codegen.md) 为每个接口的请求参数和返回值都生成了一一对应的 `Class`, 对应后端的 `DTO`, 详见 [代码生成 - Model Class](./codegen.md#model-class)

## 示例
> `Model Class` 可以在一个典型的 `CRUD` 页面中使用

```typescript
/** 列表数据 */
const resources = ref<Array<DeptLazyData>>([])

/** getResources */
async function getResources() {
  const res = await AdminApiSystemDept.listDepts(requestParams)
  resources.value = res.data.data!.list
  pagination.total = res.data.data!.total
  // ...
}
```

例如在 *部门管理* 页面中, `AdminApiSystemDept.listDepts(requestParams)` 用于发起列表 [请求](./request.md), 在请求时需要传入一个 **请求参数**, 通过查看源码, 发现 `listDepts` 接收一个 `DeptListRequestDTOModel` 类型的请求参数, 我们可以直接使用 `new DeptListRequestDTOModel()` 来创建它:

```typescript
/** 列表请求参数 */
const requestParams = reactive(new DeptListRequestDTOModel())
requestParams.status = undefined // 将状态参数初始化为 undefined
/** 初始化绑定分页请求参数 */
// const { pagination } = usePagination(requestParams, getResources)
```

::: tip
`DeptListRequestDTOModel` 就是一个 `Model Class`, `requestParams` 就是一个 **包含空的字段值的请求参数对象**, 即所有字段值均为默认值, 例如:
- `string` 类型的字段值为 `''`
- `number` 类型的字段值为 `0`
- `boolean` 类型的字段值为 `false`
:::

可以在实例化之后 **根据需要初始化请求参数中的部分字段**, 如果请求的是分页接口, 还可以使用 [usePagination](#usepagination) `hook` **创建分页参数**

```typescript
const res = await AdminApiSystemDept.listDepts(requestParams)
```

再回到列表请求中, `res` 中包含的部门数据, 也 **是 `Model Class` `DeptResponseDTOModel` 的实例**

下面我们实现 **新增和编辑功能**:

```html
<DeptUpdateOrAdd
  v-model:visible="visibleModal"
  :resource="editableData"
  @success="onRefreshTableData"
/>
```

我们创建一个简单的可用于新增和编辑的组件, 它有以下参数和事件:

```typescript
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  /** 是否显示弹窗 */
  visible: boolean
  /** 当前编辑的数据 */
  resource?: DeptResponseDTO
}>()

const emit = defineEmits<{
  'success': [resource: DeptCreateRequestDTOFromModel]
  'update:visible': [visible: boolean]
}>()

/** 是否显示弹窗 */
const modalVisible = useVModel(props, 'visible', emit)
```

::: tip
这里使用了 [🔗 useVModel](https://vueuse.org/core/useVModel/#usevmodel) 简化了在组件中使用 `model` 值的操作
:::

当点击 *创建* / *编辑* 按钮时, 先更新 `resource`, 然后将 `visible` 更新为 `true`, **表单中实际使用的字段可能与请求参数中的字段不一致**, **新增和编辑接口的请求参数类型不一样**, 如何处理请求参数数据的类型呢?

```typescript
/** 当前表单使用的 data 类 */
class DeptCreateRequestDTOFromModel extends DeptCreateRequestDTOModel {
  /** 负责人 */
  $leaders: Array<User> = []
  /**
   * 转换为当前的 (新增 / 编辑)请求参数
   * @param resource resource prop data
   */
  getParams<R extends DeptResponseDTO | undefined>(resource: R): R extends DeptResponseDTO ? DeptUpdateRequestDTOModel : DeptCreateRequestDTOModel {
    this.leaderUserId = this.$leaders.map(d => d.id) // 同步更新 leaderUserId
    return { ...this, id: resource ? resource.id : undefined, $leaders: undefined }
  }
}
```

这里创建了一个新的类, 我们在此 `Model Class` 基础上进行扩展, **继承了创建接口的请求参数 `Model Class` `DeptCreateRequestDTOModel`**

首先创建了一个新的字段 `$leader`, 可以用于在表单中作为一个字段

然后创建了一个 `getParams(resource: R)` 方法, 其中的 `resource` 参数就是 `props.resource`, 即编辑时类型为 `DeptResponseDTO`, 新增时类型为 `undefined`, 这样返回值就可以根据 `resource: R` 进行判断了, **新增和编辑时分别返回对应的请求参数的类型**, 同时将自定义字段 `$leaders` 改为了 `undefined`

```typescript
const {
  modelData,
  operationType,
} = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(
  DeptCreateRequestDTOFromModel,
  {
    emptyAnyFields: ['sort', 'parentId', 'code'],
    syncResource: computed(() => props.resource),
    onAfterSync() {
      modelData.value.$leaders = modelData.value.leaderUserId!.map(id => ({ id, nickname: '' }))
    },
  },
)
```

然后我们使用了 [useModelData](#usemodeldata) 创建了 `modelData`, 此处的 `modelData` 是 `DeptCreateRequestDTOModel` 的实例了, 可以对其进行 **初始化**, 并且会 **根据 `props.resource` 同步更新字段值**, 即编辑时会将 `props.resource` 覆盖到 `modelData` 中, 新增时会重新初始化字段值

```typescript
/** 提交表单 */
async function onOk() {
  await formRef.value!.validate()
  props.resource
    ? await AdminApiSystemDept.updateDept(modelData.value.getParams(props.resource))
    : await AdminApiSystemDept.createDept(modelData.value.getParams(props.resource))
  message.success(`${operationType.value}成功`)
  modalVisible.value = false
  emit('success', modelData.value)
}
```

在请求时调用了 `getParams` 获取请求参数, 并且触发了 `success` 事件, 在列表页监听并调用 `getResource` 重新请求列表数据

## hooks
### usePagination
> <Badge type="tip" text="3.0.0" /> 初始化列表请求的分页参数

```typescript
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getResources)
```

```html
<a-table
  :columns="columns"
  :data-source="resources"
  :scroll="{ x: 1000 }"
  :loading="loading"
  :pagination="pagination">
  <!-- ... -->
</a-table>
```

参数 | 类型 | 默认值 | 说明
--- |--- |--- |---
`params` | `P extends BasePaginationParamsType` |  | 包含分页字段的请求参数
`onChange` | `Function` | | 翻页事件函数, 用户点击翻页时触发, 用于发起分页请求

附 `BasePaginationParamsType` 类型定义:

```typescript
/** 分页接口请求参数的类型 */
export interface BasePaginationParamsType {
  /** 页码 */
  pageNo: number
  /** 每页显示的数据条数 */
  pageSize: number
}
```

### useModelData
> <Badge type="tip" text="3.0.0" /> 用于初始化和处理 `model` 数据

```typescript
const {
  modelData,
  operationType,
} = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(
  DeptCreateRequestDTOFromModel,
  {
    emptyAnyFields: ['sort', 'parentId', 'code'],
    syncResource: computed(() => props.resource),
    onAfterSync() {
      modelData.value.$leaders = modelData.value.leaderUserId!.map(id => ({ id, nickname: '' }))
    },
  },
)
```

参数 | 类型 | 默认值 | 说明
--- |--- |--- |---
ModelClass | `M extends BaseModel` | | Model Class
optionsOrOnAfterInit | `UseModelDataOptions<M, R>` 或 `UseModelDataOptions<M, R>['onAfterInit']` | | 配置项, **具体 `API` 见下方 `useModelData.ts` 源码**

::: details useModelData.ts 源码
<<< @/../src/hooks/useModelData.ts
:::

以下是使用示例:

#### 置空可为空的部分字段
```typescript
const { modelData } = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(
  DeptCreateRequestDTOFromModel,
  { emptyFields: ['sort', 'parentId', 'code'] },
)
```

获取初始化的 `DeptCreateRequestDTOFromModel` 类实例 `modelData`, **并将可置空的字段 `sort` / `parentId` / `code` 改为 `undefined`**

#### 置空任何字段
```typescript
const { modelData } = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(
  DeptCreateRequestDTOFromModel,
  { emptyAnyFields: ['sort', 'parentId', 'code'] },
)
```

::: warning 提示
`emptyAnyFields` 可以将不能为空的字段置空, 除非表单元素需要这样做, 或者后端标注的字段类型错误, 否则应该优先使用 `emptyFields`
:::

#### 置空所有 number 类型字段
```typescript
const { modelData } = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(
  DeptCreateRequestDTOFromModel,
  { emptyNumberFields: true },
)
```

#### 置空所有字段
```typescript
const { modelData } = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(
  DeptCreateRequestDTOFromModel,
  { emptyAll: true },
)
```

#### 自定义初始化
```typescript
const { modelData } = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(
  DeptCreateRequestDTOFromModel,
  {
    /** 初始化完成后执行 */
    onAfterInit: () => { /* ... */ }
  },
)
```
`onAfterInit` 会在 `model` 数据初始化完成后执行

#### 同步指定资源数据
```typescript
const {
  modelData,
  operationType,
} = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(
  DeptCreateRequestDTOFromModel,
  {
    emptyAnyFields: ['sort', 'parentId', 'code'],
    syncResource: computed(() => props.resource),
    onAfterSync() {
      modelData.value.$leaders = modelData.value.leaderUserId!.map(id => ({ id, nickname: '' }))
    },
  },
)
```

在一个资源的 新增 / 编辑 组件中, **新增时初始化表单数据, 编辑时将表单数据改为传入的资源数据** 是一个很常见的场景, 为此提供了以下 `API`:

- `syncResource?: ComputedRef<R | undefined>`: (外部传入的需要同步更新的)当前资源数据, 可以传入组件接收的正在编辑的资源 `computed(() => props.resource)`
  - `props.resource` 更新为 `R` 时, 会同步更新 `modelData`
  - `props.resource` 更新为 `undefined` 时, 会同步重置 `modelData` 值
- `onAfterSync?: (resource: R) => void`: model 数据同步完成后执行, 可以在这里进一步根据 `syncResource` 修改 `model data`
