<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { useUserStore } from '@/store/modules/user';

const emit = defineEmits(['getCategory']);
const userStore = useUserStore();

const categoryid = ref<string>('');
const menuId = ref<any>('');
const loading = ref(false);
const tableData = ref<any[]>([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});

const columns = [
  { title: '模型件号', dataIndex: 'para1', key: 'para1' },
  { title: '模型编码', dataIndex: 'para2', key: 'para2' },
  { title: '模型名称', dataIndex: 'para3', key: 'para3' },
  { title: '节点名称', dataIndex: 'categoryName', key: 'categoryName' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
];

async function modalInit(pageNo = pagination.value.pageNo, pageSize = pagination.value.pageSize) {
  if (!menuId.value) return;
  loading.value = true;
  try {
    const res = await AdminApiSystemModule.preciseQueryModuleLibrary({
      userId: userStore.getUser.id,
      moduleParaList: [],
      menuId: menuId.value,
      categoryId: categoryid.value,
      currentPage: pageNo,
      numberPage: pageSize,
    });
    const pageData = res?.data?.data || {};
    tableData.value = pageData.list || pageData.records || pageData.moduleList || [];
    pagination.value.pageNo = pageData.currentPage || pageNo;
    pagination.value.pageSize = pageData.pageSize || pageSize;
    pagination.value.total = pageData.total || pageData.totalCount || tableData.value.length || 0;
  } catch (error) {
    message.error('加载模块数据失败');
  } finally {
    loading.value = false;
  }
}

async function initData(categoryIdStr: string, menuid: any) {
  categoryid.value = categoryIdStr;
  menuId.value = menuid;
  await modalInit(1, pagination.value.pageSize);
}

function handlePageChange(page: number, pageSize: number) {
  modalInit(page, pageSize);
}

function handleModelClick(record: any) {
  emit('getCategory', record?.categoryId || record?.id || '');
}

defineExpose({ initData });
</script>

<template>
  <a-table
    size="small"
    :columns="columns"
    :data-source="tableData"
    :loading="loading"
    :pagination="{
      current: pagination.pageNo,
      pageSize: pagination.pageSize,
      total: pagination.total,
      showSizeChanger: true,
      showTotal: (total:number) => `共 ${total} 条`,
      onChange: handlePageChange,
      onShowSizeChange: handlePageChange
    }"
    row-key="id">
    <template #bodyCell="{ column, record, text }">
      <a v-if="column.dataIndex === 'para1'" @click="handleModelClick(record)">{{ text || '--' }}</a>
      <span v-else>{{ text || '--' }}</span>
    </template>
  </a-table>
</template>
