<template>
  <div>
    <a-table
      :loading="loading"
      style="margin-top: 5px; margin-right: 16px"
      :pagination="false"
      row-key="id"
      :columns="columns"
      :locale="locale"
      :data-source="tableData"
      :row-selection="rowSelection"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'required'">
          <div>
            {{ record.required == true ? '必选' : '可选' }}
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, nextTick } from 'vue';
import Empty from '@/components/Empty/index.vue';
import { TableProps } from 'ant-design-vue';
import _ from 'lodash';
const props = defineProps({
  tableData: Array,
  gbomSeriesBomBack: Array,
  loading: Boolean,
  dialogSystemConfig: Boolean,
});
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const emit = defineEmits(['multipleSelection', 'editGbomClick']);
const columns = ref<any>([
  {
    title: WeiI18n.t('超级GBOM').value,
    dataIndex: 'descript',
    key: 'descript',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('系统功能分类标识').value,
    dataIndex: 'techid',
    key: 'techid',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('标记').value,
    dataIndex: 'signString',
    key: 'signString',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('必选/可选').value,
    dataIndex: 'required',
    key: 'required',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);

/** 勾选表格数据源  */
const selectedRowList = ref<any[]>([]);
const selectedRowkeys = ref<any[]>([]);
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRows: selectedRowList.value,
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      emit('multipleSelection', selectedRows);
    },
    onSelect: (record: any, selected: any) => {
      if (selected) {
        selectedRowkeys.value.push(record.id);
        const newSelectedKeys = [...new Set([...selectedRowkeys.value])];
        selectedRowkeys.value = newSelectedKeys;
      } else {
        const newSelectedRows = selectedRowkeys.value.filter(item => item != record.id);
        selectedRowkeys.value = newSelectedRows;
      }
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.required !== false, // 条件禁用
    }),
  };
});

watch(
  () => props.tableData,
  (newVal: any) => {
    if (newVal.length > 0) {
      const recursive = (id: any) => {
        let data: any = newVal;
        data.forEach((item: any) => {
          nextTick(() => {
            if (item.required ? item.required : item.isBack) {
              selectedRowkeys.value.push(item.id);
            }
          });
          function mapChilren(child: any) {
            child.forEach((itm: any) => {
              nextTick(() => {
                if (itm.required ? itm.required : itm.isBack) {
                  selectedRowkeys.value.push(itm.id);
                }
              });
              if (itm.children) {
                return mapChilren(itm.children);
              } else {
                return;
              }
            });
          }
          if (item.children) {
            mapChilren(item.children);
          }
        });
      };
      recursive();
    }
  },
  {
    deep: true,
  }
);
watch(
  () => props.dialogSystemConfig,
  (newVal: any) => {
    selectedRowkeys.value = [];
  },
  {
    deep: true,
  }
);
</script>

<style scoped lang="less">
.selected + .sibling .action-btn {
  font-size: 12px;
  color: #1971ff;
  margin-right: 10px;
}

.action-btn {
  font-size: 12px;
  color: #1971ff;
  margin-right: 10px;
}
</style>
