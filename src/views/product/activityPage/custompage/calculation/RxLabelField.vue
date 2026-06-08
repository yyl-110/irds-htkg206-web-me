<template>
  <a-form-item :label="displayLabel" :label-col="{ style: { width: `${labelWidth}px` } }" :colon="false">
    <a-input-number
      v-model:value="newModeTypeVal"
      :style="{ width: `${width}px` }"
      :min="1"
      placeholder="" />
  </a-form-item>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineOptions({ name: 'RxLabelField' });

const props = withDefaults(
  defineProps<{
    label?: string;
    labelName?: string;
    type?: string;
    typeKey?: string;
    modeTypeList?: unknown;
    width?: number;
    labelWidth?: number;
  }>(),
  {
    label: '',
    labelName: '',
    type: '0',
    typeKey: '',
    modeTypeList: null,
    width: 252,
    labelWidth: 110,
  },
);

const displayLabel = computed(() => props.labelName || props.label);
const newModeTypeVal = ref<number | string>('');

defineExpose({
  newModeTypeVal,
  get typeKey() {
    return props.typeKey;
  },
});
</script>
