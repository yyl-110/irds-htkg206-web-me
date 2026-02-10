import type { BaseModel, ClassType } from '@wei/openapi-codegen/es/src/BaseModel'
import { cloneDeep, set } from 'lodash-es'

/** 获取类型 T 中所有的可选属性 */
type OptionalKeys<T extends object> = { [P in keyof T]-?: object extends Pick<T, P> ? P : never }[keyof T]

/** useModelData options */
export interface UseModelDataOptions<M extends BaseModel, R extends BaseModel = any> {
  /**
   * 需要置空的字段(可为空字段)
   * @description 值为 `model class` 中所有可为 `undefined` 的值, **这可以保证更新后的数据类型是正确的**
   */
  emptyFields?: Array<OptionalKeys<M>>
  /**
   * 需要置空的字段(所有字段)
   * @description  ⚠️ 可能置空类型不为空的字段, 应该优先使用 {@link emptyFields}; 值为 `model class` 中所有的字段名
   */
  emptyAnyFields?: Array<keyof M>
  /** 默认是否将所有类型为 number 的字段置空 */
  emptyNumberFields?: boolean
  /**
   * 是否将所有字段置空
   * @description ⚠️ 可能置空类型不为空的字段, 不建议使用
   */
  emptyAll?: boolean
  /**
   * model 数据初始化完成后执行
   * @description 可以在这里进一步初始化 model class, 或执行自定义的 model data 处理逻辑
   * @param modelData model data
   */
  onAfterInit?: (modelData: Ref<M>) => void
  /**
   * (外部传入的需要同步更新的)当前资源数据
   * @description 用于在 新增 / 编辑 组件中同步 `props` 中传入的资源数据
   *
   * ## 数据同步策略
   * - `props.resource` 更新为 `R` 时, 会同步更新 `modelData`
   * - `props.resource` 更新为 `undefined` 时, 会同步重置 `modelData` 值
   */
  syncResource?: ComputedRef<R | undefined>
  /**
   * model 数据同步完成后执行, 需传入 {@link syncResource}
   * @description 可以在这里进一步根据 syncResource 修改 model data
   */
  onAfterSync?: (resource: R) => void
}

/** useModelData hooks 返回值 */
export interface UseModelDataReturnData<M> {
  /** Model 类实例 */
  modelData: Ref<M>
  /** 初始化 modelData */
  init: () => Ref<M>
  /** 重置 modelData 数据 */
  resetModelData: () => void
  /**
   * 将指定数据与 modelData 合并(只覆盖 modelData 中已存在的字段)
   * @param externalData 外部加载的数据
   */
  mergeModelData: (externalData: object | undefined) => void
  /**
   * 当前操作类型
   * @description 需传入 {@link syncResource} 才会响应式更新
   */
  operationType: ComputedRef<string>
}

/**
 * {@link mergeModelData} 时使用的数据合并配置
 */
export class MergeModelDataOptions {
  /** 在合并时是否使用 cloneDeep */
  cloneDeep: boolean = true
  /** 默认配置 */
  static defaultOption = new MergeModelDataOptions()
}

/**
 * 初始化 model 类实例
 * @param data Model class instance
 * @param options options
 */
function initModelData<M extends BaseModel>(data: Ref<M>, options: UseModelDataOptions<M>) {
  if (options.emptyAll === true) {
    for (const k in data.value)
      set(data.value, k, undefined)
  }
  else {
    const emptyFields = [...(options.emptyFields || []), ...(options.emptyAnyFields || [])]
    for (const k in data.value) {
      const value = data.value[k]
      if (emptyFields.includes(k as any)) { // 将指定字段置空
        set(data.value, k, undefined)
      }
      else {
        if (options.emptyNumberFields && value === 0) { // 将数值类型的字段置空
          set(data.value, k, undefined)
        }
      }
    }
  }
  if (options.onAfterInit)
    options.onAfterInit(data)
}

/**
 * 初始化和处理 model 数据
 * @param ModelClass model class
 * @param options 配置项
 */
export function useModelData<M extends BaseModel, R extends BaseModel = any>(ModelClass: ClassType<M>, options: UseModelDataOptions<M, R>): UseModelDataReturnData<M>
/**
 * 初始化和处理 model 数据
 * @param ModelClass model class
 * @param onAfterInit model 数据初始化完成后执行的 callback function
 */
export function useModelData<M extends BaseModel, R extends BaseModel = any>(ModelClass: ClassType<M>, onAfterInit?: UseModelDataOptions<M, R>['onAfterInit']): UseModelDataReturnData<M>
/**
 * 初始化和处理 model 数据
 * @param ModelClass model class
 * @param optionsOrOnAfterInit 配置项
 */
export function useModelData<M extends BaseModel, R extends BaseModel = any>(
  ModelClass: ClassType<M>,
  optionsOrOnAfterInit: UseModelDataOptions<M, R> | UseModelDataOptions<M, R>['onAfterInit'],
): UseModelDataReturnData<M> {
  /** options 配置项 */
  const options: UseModelDataOptions<M, R> = typeof optionsOrOnAfterInit === 'function'
    ? { onAfterInit: optionsOrOnAfterInit }
    : (optionsOrOnAfterInit || {})

  /** 初始化 modelData */
  function init() {
    /** model 类实例 */
    const data = ref(new ModelClass()) as Ref<M>
    initModelData(data as Ref<M>, options)
    return data
  }

  const modelData = init()

  /** 根据 options 配置重置 model 数据 */
  function resetModelData() {
    const data = init()
    modelData.value = data.value
  }

  /**
   * 将指定数据与 modelData 合并(只覆盖 modelData 中已存在的字段)
   * @param externalData 外部加载的数据
   * @param options 数据合并配置
   */
  function mergeModelData(externalData: object | undefined, options: MergeModelDataOptions = MergeModelDataOptions.defaultOption) {
    if (externalData === undefined)
      throw new Error('externalData is empty')
    for (const key in modelData.value) {
      if (modelData.value[key] !== undefined && Reflect.has(externalData, key))
        modelData.value[key] = options.cloneDeep ? cloneDeep((externalData as any)[key]) : (externalData as any)[key]
    }
  }
  /** 是否是首次执行同步 {@link syncResource} */
  let _isFirstSyncResource = true
  // 监听 syncResource 变化并同步更新至 modelData
  if (options.syncResource) {
    watch(() => options.syncResource?.value, () => {
      if (!_isFirstSyncResource)
        resetModelData()
      if (options.syncResource?.value) {
        mergeModelData(options.syncResource.value)
        options.onAfterSync && options.onAfterSync(options.syncResource.value)
      }
      _isFirstSyncResource = false
    }, { immediate: true })
  }

  /** 当前操作类型 */
  const operationType = computed(() => options.syncResource?.value ? '编辑' : '新增')

  return {
    /** model 类实例 */
    modelData,
    init,
    resetModelData,
    /**
     * 将指定数据与 modelData 合并(只覆盖 modelData 中已存在的字段)
     * @param externalData 外部加载的数据
     */
    mergeModelData,
    /** 当前操作类型 */
    operationType,
  }
}
