<template>
  <div>
    <a-form-item
      v-for="field in fields"
      :key="field.propKey"
      :name="prop"
      :label="label + field.suffix"
      :label-col="{ style: { width: `${labelWidth}px` } }">
      <a-input
        :value="modeTypeValues[field.propKey]"
        placeholder=""
        :style="{ width: `${inputWidth}px` }"
        allow-clear
        :disabled="redFlag" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getLabel6Fields, type Label6FieldConfig } from './label6Config';

defineOptions({ name: 'rx-label6' });

const props = withDefaults(
  defineProps<{
    componentType?: string;
    modeTypeList?: unknown[];
    modeTypeVal0?: string;
    modeTypeVal1?: string;
    modeTypeVal2?: string;
    modeTypeVal3?: string;
    modeTypeVal4?: string;
    modeTypeVal5?: string;
    modeTypeVal6?: string;
    modeTypeVal7?: string;
    modeTypeVal8?: string;
    modeTypeVal9?: string;
    redFlag?: boolean;
    labelWidth?: number;
    prop?: string;
    label?: string;
    type?: string;
    typeKey?: string;
    inputWidth?: number;
  }>(),
  {
    componentType: '',
    modeTypeList: () => [],
    modeTypeVal0: '',
    modeTypeVal1: '',
    modeTypeVal2: '',
    modeTypeVal3: '',
    modeTypeVal4: '',
    modeTypeVal5: '',
    modeTypeVal6: '',
    modeTypeVal7: '',
    modeTypeVal8: '',
    modeTypeVal9: '',
    redFlag: false,
    labelWidth: 50,
    prop: '',
    label: '',
    type: '',
    typeKey: '',
    inputWidth: 192,
  },
);

const fields = computed<Label6FieldConfig[]>(() => getLabel6Fields(props.componentType));

const modeTypeValues = computed(() => ({
  modeTypeVal0: props.modeTypeVal0 ?? '',
  modeTypeVal1: props.modeTypeVal1 ?? '',
  modeTypeVal2: props.modeTypeVal2 ?? '',
  modeTypeVal3: props.modeTypeVal3 ?? '',
  modeTypeVal4: props.modeTypeVal4 ?? '',
  modeTypeVal5: props.modeTypeVal5 ?? '',
  modeTypeVal6: props.modeTypeVal6 ?? '',
  modeTypeVal7: props.modeTypeVal7 ?? '',
  modeTypeVal8: props.modeTypeVal8 ?? '',
  modeTypeVal9: props.modeTypeVal9 ?? '',
}));
</script>

<style scoped>
:deep(.ant-form-item-label) {
  padding: 10px 0 !important;
  min-width: 84px !important;
}
:deep(.ant-form-item-control) {
  margin-left: 0;
}
</style>
