<script setup lang="ts">
import { ClockCircleOutlined } from '@ant-design/icons-vue';
import { onMounted, ref, watch } from 'vue';
import { resolveFormulaDefaultValue, shouldShowGlobalSyncIcon } from './checkFormula';

const props = defineProps<{
  item: {
    globalValue?: string;
    defaultValue?: string;
    pageFormula?: string;
    inputOrOutput?: string;
    parameterId?: string;
  };
}>();

const emit = defineEmits<{
  applyGlobal: [inputOrOutput?: string, parameterId?: string, parameterValue?: string];
  resolved: [];
}>();

const visible = ref(false);

function updateVisible() {
  resolveFormulaDefaultValue(props.item.pageFormula, props.item, () => emit('resolved'));
  visible.value = shouldShowGlobalSyncIcon(props.item);
}

function applyGlobal() {
  emit('applyGlobal', props.item.inputOrOutput, props.item.parameterId, props.item.globalValue);
}

onMounted(updateVisible);
watch(() => [props.item.globalValue, props.item.defaultValue, props.item.pageFormula], updateVisible);
</script>

<template>
  <ClockCircleOutlined
    v-if="visible"
    :title="String(item.globalValue ?? '')"
    style="cursor: pointer; margin-left: 5px; font-size: 14px"
    @click="applyGlobal" />
</template>
