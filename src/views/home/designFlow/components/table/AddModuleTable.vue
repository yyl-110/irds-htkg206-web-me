<template>
  <a-table
    :scroll="{ x: 2500, y: 400 }"
    row-key="id"
    :loading="loading"
    :pagination="false"
    :locale="locale"
    :data-source="tableData"
    :columns="titleData"
    :row-selection="rowSelection"
    :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'propertyName'">
        <div>
          {{ record.modelInfoProp == 0 ? '已发布' : record.modelInfoProp == 1 ? '设计中' : record.modelInfoProp == 2 ? '停用' : '审核中' }}
        </div>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
const props = defineProps({
  tableData: Array,
  loading: Boolean,
  moduleParaListInfo: Array,
  modulesEcho: Object,
  selectedNodeId: String,
});
const titleData = ref<any[]>([]); //表单头
const selsctNum = reactive(props.modulesEcho || []); //模块已经选择的数据
const emit = defineEmits(['delSection', 'updateSection', 'handleModuleChange']);
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
      const arr = selectedRows.map(item => {
        return item.id;
      });
      selectedRowkeys.value = selectedRowKeys;
      selsctNum[props.selectedNodeId] = unique(arr);
      nextTick(() => {
        const result = Object.values(selsctNum).flatMap(arr => arr);
        emit('handleModuleChange', result);
      });
    },
  };
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
// 参数回显
const echo = (newVal: any) => {
  const result = Object.values(selsctNum).flatMap(arr => arr);
  let fosArr = result.map(item => {
    return newVal.filter((sitem: any) => +sitem.id === +item)[0];
  });
  const filteredArr = fosArr.filter(value => value !== undefined);
  nextTick(() => {
    toggleSelection(filteredArr);
  });
};

const toggleSelection = (rows: any) => {
  if (rows) {
    rows.forEach((row: any) => {
      selectedRowkeys.value.push(row.id);
    });
  } else {
    selectedRowkeys.value = [];
  }
};
// 数组去重
const unique = (arr: any) => {
  let newArr = [];
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    if (newArr.indexOf(arr[i]) == -1) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
};

watch(
  () => props.tableData,
  newVal => {
    if (newVal) {
      echo(newVal);
    }
  }
);

watch(
  () => props.moduleParaListInfo,
  (newVal: any) => {
    if (newVal.length > 0) {
      titleData.value = [];
      newVal.forEach((item: any) => {
        titleData.value.push({ ...item, title: item.propertyName, key: item.modelInfoProp, dataIndex: item.modelInfoProp });
      });
    }
  }
);
</script>

<style scoped lang="less">
:deep(.el-table__header-wrapper .el-table__cell, .el-table__header-wrapper .el-table-column--selection) {
  background: #f5f7fa;
}

:deep(.el-table__header-wrapper th.el-table-fixed-column--left) {
  background: #f5f7fa;
}

:deep(.el-table__header-wrapper th.el-table-fixed-column--right) {
  background: #f5f7fa;
}

.demo-tabs {
  :deep(.el-tabs__nav-scroll) {
    padding-left: 10px;
  }
}
</style>
