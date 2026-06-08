<template>
  <div>
    <div class="programme-title">{{ programmeTitle }}</div>
    <div class="programme-toolbar">
      <a-button type="primary" style="margin-top: 10px">计算</a-button>
    </div>
    <div class="selectBox2">
      <div style="width: 100%; height: 260px">
        <ProcessRxTable
          :columns="columns"
          :data="data"
          merge="30"
          width="1030"
          :height="tabHeight1"
          :page-flag="false"
          @select-model-list-check="selectModelListCheck" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProcessRxTable from './_shared/components/ProcessRxTable.vue';
import type { LegacyColumn } from './_shared/components/ProcessRxTable.types';

defineOptions({ name: 'customizedProcessProgramme' });

const props = withDefaults(
  defineProps<{
    data?: Array<Record<string, unknown>>;
    programmeTitle?: string;
    columns?: LegacyColumn[];
    index?: string;
  }>(),
  {
    data: () => [],
    programmeTitle: '',
    columns: () => [],
    index: '',
  },
);

const emit = defineEmits<{
  selectTableCheck: [selection: Array<Record<string, unknown>>, index: string];
}>();

const tabHeight1 = 250;

function selectModelListCheck(selection: Array<Record<string, unknown>>) {
  emit('selectTableCheck', selection, props.index);
}
</script>

<style scoped>
.programme-title {
  border-bottom: 1px silver solid;
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  padding-left: 10px;
}
.programme-toolbar {
  width: 100%;
  font-weight: 600;
  padding-left: 10px;
}
</style>
