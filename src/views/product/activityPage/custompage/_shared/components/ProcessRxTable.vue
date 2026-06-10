<template>
  <a-table
    :columns="antColumns"
    :data-source="tableRows"
    :pagination="pageFlag === false ? false : undefined"
    bordered
    size="small"
    :scroll="tableScroll"
    :row-key="rowKey"
    :row-selection="rowSelection"
    class="process-rx-table">
    <template #bodyCell="slotProps">
      <RenderCell v-if="slotProps.column.legacyRender" :render="slotProps.column.legacyRender" :slot-props="slotProps" />
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { computed, defineComponent, h as vueH, useAttrs, type PropType } from 'vue';
import { legacyH } from '../utils/legacyH';
import { applyLegacyMergeToColumns } from '../utils/tableMergeLegacy';
import type { LegacyColumn, LegacyRenderParams } from './ProcessRxTable.types';

const props = withDefaults(
  defineProps<{
    columns?: LegacyColumn[];
    data?: Array<Record<string, unknown>>;
    width?: string | number;
    height?: string | number;
    pageFlag?: boolean;
    merge?: string;
    marginTop?: string;
  }>(),
  {
    columns: () => [],
    data: () => [],
    pageFlag: false,
  },
);

const emit = defineEmits<{
  selectModelListCheck: [selection: Array<Record<string, unknown>>];
}>();

const RenderCell = defineComponent({
  name: 'ProcessRxTableRenderCell',
  props: {
    render: { type: Function as PropType<(h: typeof legacyH, params: LegacyRenderParams) => unknown>, required: true },
    slotProps: {
      type: Object as PropType<{ column: LegacyColumn; record: Record<string, unknown>; index: number }>,
      required: true,
    },
  },
  setup(cellProps) {
    return () => {
      const { column, record, index } = cellProps.slotProps;
      const vnode = cellProps.render(legacyH, { row: record, index, column });
      if (vnode == null) return null;
      if (typeof vnode === 'object' && 'type' in (vnode as object)) {
        return vnode as never;
      }
      return vueH('span', String(vnode));
    };
  },
});

function convertColumns(cols: LegacyColumn[]): Array<Record<string, unknown>> {
  return cols.map(col => {
    const dataIndex = String(col.key ?? '');
    const item: Record<string, unknown> = {
      title: col.title,
      dataIndex,
      key: dataIndex || col.title,
      align: col.align ?? 'center',
      width: col.width ?? col.minWidth,
      legacyRender: col.render,
      __legacyColumn: col,
    };
    if (col.children?.length) {
      item.children = convertColumns(col.children);
    }
    return item;
  });
}

const tableRows = computed(() => props.data ?? []);

const antColumns = computed(() => {
  const base = convertColumns(props.columns ?? []);
  if (!props.merge) return base;
  return applyLegacyMergeToColumns(
    base as Parameters<typeof applyLegacyMergeToColumns>[0],
    () => tableRows.value,
    props.merge,
  );
});

const tableScroll = computed(() => {
  const y = Number(props.height);
  const x = Number(props.width);
  return {
    ...(y ? { y } : {}),
    ...(x ? { x } : {}),
  };
});

function rowKey(record: Record<string, unknown>, index: number) {
  return String(record?.id ?? record?.p0 ?? index);
}

const attrs = useAttrs();

const rowSelection = computed(() => {
  if (!attrs.onSelectModelListCheck && !attrs.onSelectmodelListCheck) return undefined;
  return {
    onChange: (_keys: (string | number)[], rows: Array<Record<string, unknown>>) => {
      emit('selectModelListCheck', rows);
    },
  };
});
</script>

<style scoped>
.process-rx-table {
  width: 100%;
}

:deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

:deep(.ant-table-thead > tr > th),
:deep(.ant-table-thead .ant-table-column-title) {
  font-weight: normal !important;
}
</style>
