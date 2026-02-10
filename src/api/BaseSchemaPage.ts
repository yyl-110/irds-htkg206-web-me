import type { Ref } from 'vue'
import { createVNode, ref } from 'vue'
import type { BaseModel } from '@wei/openapi-codegen/es/src/BaseModel'
import type { BaseUISchema } from '@wei/openapi-codegen/es/src/BaseUISchema'
import type { BaseAPIResourcePageResponse, BaseAPIResourceResponse, BasePaginationParamsType } from '@wei/openapi-codegen/es/src/BaseUISchemaPagination'
import { BaseUISchemaPagination } from '@wei/openapi-codegen/es/src/BaseUISchemaPagination'
import type { AxiosResponse } from 'axios'
import type { ModalProps } from 'ant-design-vue'
import { Modal } from 'ant-design-vue'
import { assign, get } from 'lodash-es'
import type { FormInstance } from 'ant-design-vue/es/form'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { WeiMessage } from '@/utils/WeiMessage'

/**
 * 页面资源数据处理类
 * @description 封装 CRUD 场景下页面中的数据处理逻辑
 */
export class BaseSchemaPage<PM extends BasePaginationParamsType, RM extends BaseModel, CM extends BaseModel, UM extends BaseModel> {
  /**
   * BaseSchemaPage
   * @param name
   * @param paramsSchema
   * @param resourcesSchema
   * @param pageMethod
   * @param createSchema
   * @param createMethod
   * @param updateSchema
   * @param updateMethod
   * @param updateIdField
   * @param deleteMethod
   */
  constructor(
    /** 当前资源名称 */
    public name: string,
    /** 分页查询请求参数的 schema */
    public paramsSchema: Pick<BaseUISchema<PM>, 'model' | 'pagination'>,
    /** page 请求的 schema */
    public resourcesSchema: Pick<BaseUISchema<RM>, 'pagination' | 'dataSource'>,
    /** 当前页面 /page 请求方法 */
    public pageMethod: (req: PM) => Promise<AxiosResponse<BaseAPIResourcePageResponse<RM>>>,
    /** 创建资源的请求参数数据模型类 */
    public createSchema?: Pick<BaseUISchema<CM>, 'model' | 'columns'>,
    /** 当前页面创建资源方法 */
    public createMethod?: (req: CM) => Promise<AxiosResponse<BaseAPIResourceResponse<BaseModel>>>,
    /** 更新资源的请求参数数据模型类 */
    public updateSchema?: Pick<BaseUISchema<UM>, 'model' | 'columns'>,
    /** 当前页面创建资源方法 */
    public updateMethod?: (req: UM) => Promise<AxiosResponse<BaseAPIResourceResponse<BaseModel>>>,
    /** 当前资源的 ID 字段 */
    public updateIdField?: keyof Extract<RM, UM>,
    /** 当前页面删除资源方法 */
    public deleteMethod?: (req: any) => Promise<AxiosResponse<any>>,
  ) {
    this.init()
  }

  /** init */
  init() {
    // 1. 生成 `a-table` 所需的分页参数
    this.generatePagination()
    // 2. 生成新增 / 编辑弹窗绑定的数据
    this.generateCreateModalProps()
    this.generateUpdateModalProps()
  }

  /** 创建资源弹窗绑定的 props */
  createModalProps?: Ref<ModalProps>
  /**
   * 创建 create 请求的 modal props
   */
  generateCreateModalProps() {
    if (this.createModalProps)
      return this.createModalProps
    if (!this.createMethod || !this.createSchema)
      return
    this.createModalProps = ref<ModalProps>({
      title: `新增${this.name}`,
      visible: false,
      /** on ok */
      onOk: () => {
        console.log('create ok')
      },
      /** on cancel */
      onCancel: () => this.createModalProps && (this.createModalProps.value.visible = false),
    })
    return this.createModalProps
  }

  /**
   * 从 `wei-schema-form` 组件中获取 `a-form` 组件实例
   * @description 由于 `vue` 不支持泛型组件的 `ref<InstanceType<typeof component>>` 定义([#8373](https://github.com/vuejs/core/issues/8373)), 所以无法获取到类型, 可以通过此方法获取到 `component`
   * @param schemaFormRef `wei-schema-form` 组件 ref
   * @returns `a-form` 组件实例
   */
  getFormComponentBySchemaFormComponent(schemaFormRef?: Ref<any>): FormInstance | undefined {
    if (!schemaFormRef || !schemaFormRef.value)
      return
    return schemaFormRef.value.component as FormInstance
  }

  /**
   * 调用创建资源接口
   * @param record 资源
   */
  toCreate() {
    if (this.createModalProps)
      this.createModalProps.value.visible = true
  }

  /** 编辑资源弹窗绑定的 props */
  updateModalProps?: Ref<ModalProps>
  /**
   * 创建 update 请求的 Modal props
   */
  generateUpdateModalProps() {
    if (this.updateModalProps)
      return this.updateModalProps
    if (!this.updateMethod || !this.updateSchema)
      return
    this.updateModalProps = ref<ModalProps>({
      title: `编辑${this.name}`,
      visible: false,
      /** on ok */
      onOk: () => {
        console.log('update ok')
      },
      /** on cancel */
      onCancel: () => this.updateModalProps && (this.updateModalProps.value.visible = false),
    })
    return this.updateModalProps
  }

  /**
   * 显示更新弹窗时调用, 可用于初始化更新资源表单绑定的数据
   * @description 默认直接 `merge`
   */
  onUpdateResource?: (record: RM) => void
  /**
   * 调用更新资源接口
   * @param record 资源
   */
  toUpdate(record: RM) {
    // const idField = this.updateIdField || 'id'
    if (this.updateModalProps && this.updateSchema) {
      // set(this.updateSchema.model, idField, get(record, idField))
      if (this.onUpdateResource)
        this.onUpdateResource(record)
      else
        assign(this.updateSchema.model, record)

      this.updateModalProps.value.visible = true
    }
  }

  /**
   * 创建分页 Prop
   */
  generatePagination() {
    this.resourcesSchema.pagination = BaseUISchemaPagination.getPagination(
      this.paramsSchema.model,
      () => this.getResources(),
    )
  }

  /**
   * 发起 page 请求
   * @param resetPage
   */
  async getResources(resetPage?: boolean) {
    if (resetPage === true)
      BaseUISchemaPagination.resetPagination(this.paramsSchema.model)
    const res = await this.pageMethod(this.paramsSchema.model)
    if (res.data.data) {
      this.resourcesSchema.dataSource = res.data.data.list
      if (this.resourcesSchema.pagination)
        this.resourcesSchema.pagination.total = res.data.data.total
    }
  }

  /** [Hook function]在发起 create 请求之前调用, 可用于修改请求参数 */
  onBeforeCreate?: (record: CM) => CM
  /** [Hook function]在发起 create 请求之后调用 */
  onAfterCreate?: () => boolean
  /** 创建资源表单 Ref */
  createFormRef?: Ref<any>
  /**
   * 重置创建表单数据
   */
  resetCreateData() {
    const form = this.getFormComponentBySchemaFormComponent(this.createFormRef)
    form?.resetFields()
  }

  /** 发起 create 请求 */
  async createResource() {
    if (!this.createSchema || !this.createMethod || !this.createModalProps)
      return
    const params = typeof this.onBeforeCreate === 'function'
      ? this.onBeforeCreate(this.createSchema.model)
      : this.createSchema.model
    await this.createMethod(params)
    WeiMessage.success(`${this.createModalProps.value.title}成功`)
    this.resetCreateData()
    this.createModalProps.value.visible = false
    if (this.onAfterCreate)
      this.onAfterCreate()
    this.getResources(true)
  }

  /** [Hook function]在发起 update 请求之前调用, 可用于修改请求参数 */
  onBeforeUpdate?: (record: UM) => UM
  /** [Hook function]在发起 update 请求之后调用 */
  onAfterUpdate?: () => boolean
  /** 发起 update 请求 */
  async updateResource() {
    if (!this.updateSchema || !this.updateMethod || !this.updateModalProps)
      return
    const params = typeof this.onBeforeUpdate === 'function'
      ? this.onBeforeUpdate(this.updateSchema.model)
      : this.updateSchema.model
    await this.updateMethod(params)
    WeiMessage.success(`${this.updateModalProps?.value.title}成功`)
    this.resetUpdateData()
    this.updateModalProps.value.visible = false
    if (this.onAfterUpdate)
      this.onAfterUpdate()
    this.getResources(true)
  }

  /** [Hook function]在发起 delete 请求之前调用, 可用于修改请求参数 */
  onBeforeDelete?: (record: RM) => any
  /** [Hook function]在发起 delete 请求之后调用 */
  onAfterDelete?: () => void
  /** 更新资源表单 Ref */
  updateFormRef?: Ref<any>
  /**
   * 重置更新表单数据
   */
  resetUpdateData() {
    const form = this.getFormComponentBySchemaFormComponent(this.updateFormRef)
    form?.resetFields()
  }

  /**
   * 调用删除资源接口
   * @param record 资源
   */
  async toDelete(record: RM) {
    if (!this.deleteMethod)
      return
    await new Promise((resolve, reject) => {
      Modal.confirm({
        title: `确定要删除此 ${this.name} 吗?`,
        icon: createVNode(ExclamationCircleOutlined),
        /** on ok */
        onOk: () => resolve(true),
        /** on cancel */
        onCancel: () => reject(new Error('Modal Cancel')),
      })
    })
    const idField = this.updateIdField || 'id'
    const params = this.onBeforeDelete ? this.onBeforeDelete(record) : { [idField]: get(record, idField) }
    await this.deleteMethod(params)
    WeiMessage.success(`删除 ${this.name} 成功`)
    if (this.onAfterDelete)
      this.onAfterDelete()
    this.getResources(true)
  }
}
