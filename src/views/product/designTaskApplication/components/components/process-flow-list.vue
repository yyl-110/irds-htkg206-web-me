<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { ProcessFlowListPageRequestDTOModel } from '@/api/models/processTask/ProcessFlowListPageRequestDTOModel';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';

const emit = defineEmits<{
  (e: 'actionNode', item: any): void;
}>();

const props = defineProps<{
  menuId?: string | number;
  treeNodeKey?: string | number;
}>();

const loading = ref(false);
const keyword = ref('');
const listData = ref<any[]>([]);
const requestParams = reactive(new ProcessFlowListPageRequestDTOModel());
const bgImages = [
  new URL('@/assets/images/process-bg-1.png', import.meta.url).href,
  new URL('@/assets/images/process-bg-2.png', import.meta.url).href,
  new URL('@/assets/images/process-bg-3.png', import.meta.url).href,
  new URL('@/assets/images/process-bg-6.png', import.meta.url).href,
];

const filteredData = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return listData.value;
  return listData.value.filter(item => {
    const name = String(item?.processName ?? item?.categoryName ?? '').toLowerCase();
    return name.includes(q);
  });
});

function getItemTitle(item: any) {
  return String(item?.processName ?? item?.categoryName ?? '--');
}

function getCardBackground(index: number) {
  return bgImages[index % bgImages.length];
}

function actionNode(item: any) {
  emit('actionNode', item);
}

async function loadFlowListData() {
  loading.value = true;
  try {
    requestParams.menuId = props.menuId ?? '';
    requestParams.treeId = props.treeNodeKey ?? '';
    requestParams.pageNo = 1;
    requestParams.pageSize = 10000;
    const res = await AdminApiSystemProcessTask.taskBasicInfoPage(requestParams);
    const list = res?.data?.data?.list;
    listData.value = Array.isArray(list) ? list : [];
  } catch (e) {
    listData.value = [];
    message.error('流程列表加载失败');
  } finally {
    loading.value = false;
  }
}

function resetAndReload() {
  keyword.value = '';
  void loadFlowListData();
}

watch(
  () => [props.menuId, props.treeNodeKey],
  () => {
    resetAndReload();
  },
  { immediate: true },
);

defineExpose({
  reloadList(resetPage = false) {
    if (resetPage) {
      resetAndReload();
      return;
    }
    void loadFlowListData();
  },
});
</script>

<template>
  <div class="process-panel">
    <div class="process-panel__toolbar">
      <a-input v-model:value="keyword" placeholder="请输入查询条件" allow-clear class="process-panel__search-input">
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>

    <a-spin :spinning="loading" tip="加载中...">
      <div class="process-panel__cards">
        <div v-for="(item, idx) in filteredData" :key="item.id" class="calculateItem" @click="actionNode(item)">
          <div class="Img-box" :style="{ backgroundImage: `url('${getCardBackground(idx)}')` }">
            <div class="img-mask"></div>
            <div class="img-title">{{ getItemTitle(item) }}</div>
          </div>
        </div>
      </div>
      <a-empty v-if="!loading && filteredData.length === 0" description="暂无数据" />
    </a-spin>
  </div>
</template>

<style lang="less" scoped>
.process-panel {
  width: 100%;
  min-height: calc(100vh - 180px);
  padding: 12px 10px;
  box-sizing: border-box;
}

.process-panel__toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.process-panel__search-input {
  width: 260px;
}

.process-panel__count {
  color: #222;
  font-size: 16px;
}

.process-panel__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.calculateItem {
  position: relative;
  width: 256px;
  margin-right: 35px;
  margin-bottom: 25px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: block;
  background: #cbdcf5;
  box-shadow: 0 0 15px 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
}

.calculateItem:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(25, 113, 255, 0.25);

  .img-title {
    color: #124dd6;
    font-weight: 400;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  }
}

.Img-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 185px;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.img-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.22);
}

.img-title {
  position: relative;
  z-index: 1;
  max-width: calc(100% - 20px);
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
