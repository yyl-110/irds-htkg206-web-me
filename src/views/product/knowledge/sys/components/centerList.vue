<template>
  <div class="p-[16px] h-full flex flex-col pb-0">
    <div class="header flex-shrink-0">
      <div class="flex items-center gap-[8px]">
        <a-input placeholder="请输入文件名称" class="max-w-[200px]" v-model:value="searchData.dataFileName"
          @keydown.enter="fetchList" />
        <a-input placeholder="请输入创建人" class="max-w-[200px]" v-model:value="searchData.dataCreate"
          @keydown.enter="fetchList" />

        <a-button type="primary" @click="fetchList" class="ml-auto"> 查询 </a-button>
        <a-button type="primary" @click="reset"> 重置 </a-button>
      </div>

      <div class="flex items-center gap-[8px] mt-[16px]">
        <a-button type="primary" @click="add">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
        <a-button>
          <template #icon>
            <CloudUploadOutlined />
          </template>
          批量操作
        </a-button>
      </div>

      <a-tabs v-model:active-key="tabValue" class="elTabs" @change="changeType" size="small">
        <a-tab-pane tab="文档" :key="1" />
        <a-tab-pane tab="视频" :key="2" />
        <a-tab-pane tab="图片" :key="3" />
      </a-tabs>
    </div>

    <main class="flex-1 h-0">
      <a-spin :spinning="loading">
        <div class="list wei-scrollbar h-full overflow-y-auto pt-[16px]">
          <div v-if="tabValue === 1">
            <div class="item" v-for="item in documentList" :key="item.id">
              <text-card :text-data="item" @handleFetchList="fetchList"
                @handleEdit="() => { handleEditCard(item.id) }" />
            </div>
          </div>
          <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="tabValue === 2">
            <div class="item" v-for="item in documentList" :key="item.id">
              <video-card :video-data="item" @handleFetchList="fetchList"
                @handleEdit="() => { handleEditCard(item.id) }" />
            </div>
          </div>
          <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="tabValue === 3">
            <div class="item" v-for="item in documentList" :key="item.id">
              <img-card :img-data="item" @handleFetchList="fetchList" @handleEdit="() => { handleEditCard(item.id) }" />
            </div>
          </div>
          <a-empty v-if="documentList.length === 0 && !loading" :image="simpleImage" />
        </div>
      </a-spin>
    </main>
    <footer class="flex justify-end pt-[16px]">
      <a-pagination v-model:current="pagination.current" :total="pagination.total"
        :default-page-size="pagination.pageSize" show-less-items show-size-changer show-quick-jumper
        :show-total="pagination.showTotal" @change="pagination.onChange" />
    </footer>
    <!-- 新建编辑弹框 -->
    <knowledge-modal ref="knowledgeModalRef" :nodeData="nodeData" :parentNode="parentNode" @saveSuccess="fetchList" />
  </div>
</template>

<script setup lang="ts">
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons-vue'
import textCard from './textCard.vue';
import videoCard from './videoCard.vue';
import imgCard from './imgCard.vue';
import { knowledgeFileList } from '@/api/knowledge';
import { PaginationConfig } from 'ant-design-vue/es/pagination';
import { useUserStore } from '@/store/modules/user';
import { Empty } from 'ant-design-vue';
import knowledgeModal from './knowledgeModal.vue'

const props = defineProps({
  kldTreeId: {
    type: String,
    default: ''
  },
  nodeData: {
    type: Object,
    default: () => { },
  },
  parentNode: {
    type: Object,
    default: () => { },
  }
})

const simpleImage = computed(() => Empty.PRESENTED_IMAGE_SIMPLE);

const addDataDialogVisible = ref(false)
const searchData = ref({
  dataFileName: '',
  dataCreate: ''
})
const tabValue = ref(1)
const documentList = ref([])
const loading = ref(false)
const knowledgeModalRef = ref(null)

const pagination = reactive<PaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 10,
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (pageNum, pageSize) => {
    pagination.current = pageNum;
    pagination.pageSize = pageSize;
    fetchList();
  },
})


const fetchList = async () => {
  try {
    loading.value = true
    const params = {
      fileName: searchData.value.dataFileName,
      userName: searchData.value.dataCreate,
      kldTreeId: props.kldTreeId,
      attachmentType: tabValue.value,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      userId: useUserStore().getUser.id
    }
    const res = await knowledgeFileList(params)
    if (res.data.code === '0') {
      documentList.value = res.data.data?.result || []
      pagination.total = res.data.data?.rowCount
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
const changeType = () => {
  pagination.current = 1
  pagination.pageSize = 10
  fetchList()
}
const reset = () => {
  searchData.value = {
    dataFileName: '',
    dataCreate: ''
  }
  fetchList()
}

const add = () => {
  knowledgeModalRef.value && knowledgeModalRef.value.show(1)
}

const handleEditCard = (id) => {
  knowledgeModalRef.value && knowledgeModalRef.value.show(2, id)
}

watch(() => props.kldTreeId, () => {
  if (props.kldTreeId) {
    pagination.current = 1;
    pagination.pageSize = 10;
    fetchList()
  }
})

</script>

<style scoped lang="less">
:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin-left: 0px;
}

.elTabs {
  border-radius: 4px;
  width: 100%;
  margin-top: 16px;

  :deep(.ant-tabs-nav) {
    // height: 48px;
    margin-bottom: 0;
    background-color: #ffffff;
    padding: 0 0 0 0;

    &::before {
      display: none;
    }
  }

  :deep(.ant-tabs-tab) {
    width: 72px;
    // height: 32px;
    font-size: 14px;
    background: #f2f5f7;
    border-radius: 2px 0 0 2px;
    border: 1px solid #ffffff;
    margin-right: 2px;
    justify-content: center;
    padding: 4px 0 !important;
  }

  :deep(.ant-tabs-tab-active) {
    background: #e6effb;

    .ant-tabs-tab-btn {
      font-weight: 600;
      font-size: 14px;
      color: var(--ant-primary-color);
    }
  }

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }

  :deep(.ant-tabs-content-holder) {
    display: none;
  }
}

:deep(.ant-spin-nested-loading) {
  height: 100%;

  .ant-spin-container {
    height: 100%;
  }
}
</style>