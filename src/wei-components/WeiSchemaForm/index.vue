<script lang="ts" generic="M extends BaseModel = BaseModel" setup>
import type { BaseModel } from '@wei/openapi-codegen/es/src/BaseModel';
import type { BaseUISchemaColumnGroupType, BaseUISchemaField } from '@wei/openapi-codegen/es/src/BaseUISchema';
import { computed, ref } from 'vue';
// import { BaseUISchemaComponentType } from '@wei/openapi-codegen/es/src/BaseUISchemaComponent'
// import type { OpenApiActionButton } from '@wei/openapi-codegen/es/src/OpenApiTags'
// import { OpenApiActionsConfig } from '@wei/openapi-codegen/es/src/OpenApiTags'
import type { FormInstance } from 'ant-design-vue/es/form/Form';
import { get } from 'lodash-es';
import type { WeiSchemaFormPropsType } from './types';

defineOptions({ name: 'WeiSchemaForm' });

const props = defineProps<WeiSchemaFormPropsType<M>>();
const emit = defineEmits<{
  /** 提交 */
  submit: [e: Event];
  /** 点击新增按钮 */
  create: [];
  /** 点击新增按钮 */
  cancel: any;
}>();
const slots = defineSlots<{
  /** 最底部的操作按钮部分 */
  schemaActions: (props: any) => void;
  [name: string]: (props: { item: BaseUISchemaColumnGroupType<M> | BaseUISchemaField<M>; dataIndex: keyof M }) => void;
}>();
/** a-form 的 slots */
const antFormSlots = ['extra', 'help', 'label'];
function getSlot(item: BaseUISchemaColumnGroupType<M> | BaseUISchemaField<M>) {
  return typeof item.dataIndex === 'string' ? get(slots, `$${item.dataIndex}`) : undefined;
}

// 定义 props
const component = ref<FormInstance>();
const action = computed(() => OpenApiActionsConfig[props.schemaActionType]);
function showActionButton(button: OpenApiActionButton) {
  if (props.schemaActionButtons) return props.schemaActionButtons.includes(button);
  else if (Array.isArray(action.value.actionButtons)) return action.value.actionButtons.includes(button);

  return true;
}
// const getFieldKey = (property: BaseUISchemaColumnGroupType<M> | BaseUISchemaField<M>) => get(property, 'dataIndex')
const getPlaceholder = (item: BaseUISchemaField<M>) => `请填写${item.schemaTitle || item.label}`;

function initColumnsComponent() {
  for (const col of props.columns) {
    if (col.schemaOption.schemaOnCreated) col.schemaOption.schemaOnCreated(col.schemaOption);
  }
}
initColumnsComponent();

async function onSubmit(event: Event) {
  if (!component.value) throw new Error('Internal Error: Missing form');
  await component.value.validate();
  emit('submit', event);
}
function onReset() {
  if (!component.value) throw new Error('Internal Error: Missing form');
  component.value.resetFields();
}
function onCreate() {
  emit('create');
}
function onCancel() {
  emit('cancel');
}

defineExpose({
  component,
});
</script>

<template>
  <component :is="action.formWrapper" class="component-card mb-4">
    <a-form
      ref="component"
      class="wei-schema-form"
      v-bind="props"
      :colon="true"
      :hide-required-mark="false"
      :required-mark="true"
      :layout="action.formLayout"
      :label-col="action.labelCol as any">
      <template v-for="(item, key) in columns" :key="key">
        <a-form-item
          v-if="!action.excludeFields.includes(item.dataIndex as string) && !item.schemaHidden"
          v-bind="item"
          :label="item.schemaTitle || item.label"
          :colon="true"
          :hide-required-mark="false">
          <!-- 自定义表单项, 在外部可以通过传入 `$` + dataIndex 的 slot 自定义表单项 -->
          <slot v-if="getSlot(item)" :name="`$${item.dataIndex?.toString()}`" :item="item" :data-index="item.dataIndex as keyof M" />
          <!-- 默认的表单项渲染规则 -->
          <template v-else>
            <!-- 输入框 -->
            <a-input
              v-if="item.schemaOption.schemaType === BaseUISchemaComponentType.Input"
              v-model:value="(model as any)[item.dataIndex as any]"
              :placeholder="getPlaceholder(item)"
              v-bind="item.schemaOption" />
            <!-- 选择器 -->
            <a-select
              v-else-if="item.schemaOption.schemaType === BaseUISchemaComponentType.Select"
              v-model:value="(model as any)[item.dataIndex as any]"
              :placeholder="getPlaceholder(item)"
              v-bind="item.schemaOption" />
            <!-- textarea 输入框 -->
            <a-textarea
              v-else-if="item.schemaOption.schemaType === BaseUISchemaComponentType.Textarea"
              v-model:value="(model as any)[item.dataIndex as any]"
              :placeholder="getPlaceholder(item)"
              v-bind="item.schemaOption" />
            <!-- 数值输入框 -->
            <a-input-number
              v-else-if="item.schemaOption.schemaType === BaseUISchemaComponentType.InputNumber"
              v-model:value="(model as any)[item.dataIndex as any]"
              :placeholder="getPlaceholder(item)"
              v-bind="item.schemaOption" />
            <!-- Boolean 值 -->
            <a-switch
              v-else-if="item.schemaOption.schemaType === BaseUISchemaComponentType.Switch"
              v-model:checked="(model as any)[item.dataIndex as any]"
              :placeholder="getPlaceholder(item)"
              v-bind="item.schemaOption" />
            <!-- DatePicker -->
            <a-date-picker
              v-else-if="item.schemaOption.schemaType === BaseUISchemaComponentType.DatePicker"
              v-model:value="(model as any)[item.dataIndex as any]"
              :placeholder="getPlaceholder(item)"
              v-bind="item.schemaOption" />
            <!-- Radio -->
            <a-radio-group
              v-else-if="item.schemaOption.schemaType === BaseUISchemaComponentType.Radio"
              v-model:value="(model as any)[item.dataIndex as any]"
              :placeholder="getPlaceholder(item)"
              v-bind="item.schemaOption" />
          </template>
        </a-form-item>
      </template>
      <!-- a-form 原始 slots -->
      <template v-for="(slot, k) in $slots" :key="k" #[k]="slotProps">
        <component :is="slot as any" v-if="antFormSlots.includes(k.toString())" v-bind="slotProps" />
      </template>
      <a-form-item v-if="!schemaHiddenActionFormItem" label="">
        <!-- 自定义 actions -->
        <slot v-if="$slots.schemaActions" name="schemaActions" />
        <div v-else class="space-x-2" :class="[...action.actionFormItemLayoutClass]">
          <a-button v-if="showActionButton('query')" data-test="query" @click="onSubmit"> 查询 </a-button>
          <a-button v-if="showActionButton('submit')" data-test="submit" type="primary" @click="onSubmit"> 提交 </a-button>
          <a-button v-if="showActionButton('reset')" data-test="reset" type="primary" @click="onReset"> 重置 </a-button>
          <a-button v-if="showActionButton('cancel')" data-test="cancel" type="" @click="onCancel"> 取消 </a-button>
          <a-button v-if="showActionButton('create')" data-test="create" type="primary" @click="onCreate"> 新增 </a-button>
        </div>
      </a-form-item>
    </a-form>
  </component>
</template>

<style scoped>
:deep(.ant-form-inline .ant-form-item) {
  margin-bottom: 24px;
}
.component-card :deep(.ant-card-body) {
  padding-bottom: 0;
}
</style>
