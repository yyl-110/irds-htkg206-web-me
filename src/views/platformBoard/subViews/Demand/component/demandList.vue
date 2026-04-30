<template>
  <a-modal
    v-model:visible="props.lookListVisible"
    title="需求管理数据清单"
    width="90%"
    :footer="null"
    @cancel="businessTemplateDialogCancel"
    destroyOnClose>
    <a-table
      :dataSource="tableData"
      :columns="columns"
      :pagination="false"
      bordered
      :scroll="{ y: 500 }"
      style="width: 100%">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'analyseFlag'">
          <img src="@/assets/data-screen/common/flat.png" style="width: 14px; height: 14px" v-if="record.analyseFlag" />
          <img src="@/assets/data-screen/common/down.png" style="width: 16px; height: 16px" v-else />
        </template>
        <template v-else-if="column.key === 'distributeFlag'">
          <img src="@/assets/data-screen/common/flat.png" style="width: 14px; height: 14px" v-if="record.distributeFlag" />
          <img src="@/assets/data-screen/common/down.png" style="width: 16px; height: 16px" v-else />
        </template>
        <template v-else-if="column.key === 'implementFlag'">
          <img src="@/assets/data-screen/common/flat.png" style="width: 14px; height: 14px" v-if="record.implementFlag" />
          <img src="@/assets/data-screen/common/down.png" style="width: 16px; height: 16px" v-else />
        </template>
        <template v-else-if="column.key === 'acceptFlag'">
          <img src="@/assets/data-screen/common/flat.png" style="width: 14px; height: 14px" v-if="record.acceptFlag" />
          <img src="@/assets/data-screen/common/down.png" style="width: 16px; height: 16px" v-else />
        </template>
        <template v-else-if="column.key === 'progress'">
          {{ (record.progress * 100).toFixed(0) }}%
        </template>
      </template>
    </a-table>
    <!--分页-->
    <div style="display: flex; justify-content: flex-end; padding-top: 16px;">
      <a-pagination
        v-model:current="page.currentPage"
        v-model:pageSize="page.pageSize"
        :total="page.pageCount"
        :show-total="total => `共 ${total} 条`"
        show-size-changer
        @change="onChange"
        @showSizeChange="pageChange"
      />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { demandReportPage } from '@/api/data-screen';

const props = defineProps({
  /** 弹窗状态 */
  lookListVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const tableData = ref([]);
const totalPage = ref(0);

const columns = [
  { title: '需求编号', dataIndex: 'demandNum', key: 'demandNum', width: 150 },
  { title: '需求标题', dataIndex: 'demandTitle', key: 'demandTitle', minWidth: 150 },
  { title: '提出人', dataIndex: 'originaUserName', key: 'originaUserName', width: 100 },
  { title: '提出日期', dataIndex: 'submitTime', key: 'submitTime', width: 120, align: 'center' },
  { title: '期望反馈日期', dataIndex: 'feedbackTime', key: 'feedbackTime', width: 120, align: 'center' },
  { title: '紧急程度', dataIndex: 'urgencyLevel', key: 'urgencyLevel', width: 90, align: 'center' },
  { title: '受理时间', dataIndex: 'decisionConclusionTime', key: 'decisionConclusionTime', width: 120, align: 'center' },
  { title: '受理人', dataIndex: 'rmeUserName', key: 'rmeUserName', width: 100 },
  { title: '状态-分析', key: 'analyseFlag', width: 90, align: 'center' },
  { title: '状态-分发', key: 'distributeFlag', width: 90, align: 'center' },
  { title: '状态-实现', key: 'implementFlag', width: 90, align: 'center' },
  { title: '状态-验收', key: 'acceptFlag', width: 90, align: 'center' },
  { title: '当前进度', key: 'progress', width: 90, align: 'center' },
];

//分页器参数定义
const page = ref({
  pageSize: 30,
  pageCount: 0,
  currentPage: 1,
});

async function fetchData() {
  try {
    let data = {};
    data.pageNo = page.value.currentPage;
    data.pageSize = page.value.pageSize;
    const res = await demandReportPage(data);
    if (res.code == '0' || res.code == 200) {
      tableData.value = res.data.list;
      page.value.pageCount = Number(res.data.total);
    }
  } catch (error) {
    console.log('error:', error);
  }
}

function onChange(current) {
  page.value.currentPage = current;
  fetchData();
}

function pageChange(current, size) {
  page.value.pageSize = size;
  fetchData();
}

function businessTemplateDialogCancel() {
  emit('close');
}

defineExpose({ fetchData });
</script>

<style scoped>
</style>
