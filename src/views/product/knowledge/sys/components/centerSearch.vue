<template>
  <div class="centerSearch" v-dragModal>
    <draggable-modal :getContainer="customGetContainer" :maskClosable="false" class="layout"
      :visible="addDataDialogVisible" title="添加数据" width="70%" @cancel="handleClose" height="90%" @ok="confirmDialog">
      <div class="knowledge-container flex flex-col h-full">
        <a-tabs v-model:active-key="activeKey" class="elTabs" @change="handleClick" size="small">
          <a-tab-pane tab="文档" :key="1" />
          <a-tab-pane tab="问答" :key="4" />
          <a-tab-pane tab="视频" :key="2" />
          <a-tab-pane tab="图片" :key="3" />
          <template #rightExtra>
            <div class="flex items-center">
              <a-input-search v-model:value="searchValue" placeholder="输入关键字进行搜索" @search="onSearch"
                class="max-w-[400px]">
                <template #enterButton>
                  <div class="flex items-center">
                    <SearchOutlined />
                    <span class="ml-[4px]">搜索</span>
                  </div>
                </template>
              </a-input-search>
            </div>
          </template>
        </a-tabs>
        <searchTag :elTagcheckedOneData="elTagcheckedOneData" :hiddenStatus="hiddenStatus"
          :elTagcheckedOneStatus="elTagcheckedOneStatus" :elTagcheckedTwoStatus="elTagcheckedTwoStatus"
          :elTagcheckedTwoData="elTagcheckedTwoData" @onChangeElCheckTagOne="onChangeElCheckTagOne"
          @onChangeElCheckTagTwo="onChangeElCheckTagTwo" class="mt-[16px]" />
        <main class="flex-1 h-0">
          <div class="list overflow-y-auto wei-scrollbar h-full pt-[16px]">
            <a-spin :spinning="loading" class="h-full w-full">
              <a-empty v-if="documentList.length === 0 && !loading" :image="simpleImage" class="mt-[100px]" />

              <a-row class="w-full items-start" v-if="activeKey === 1 && documentList.length > 0" :gutter="[16, 16]">
                <a-col :span="12" class="item min-w-[420px]" v-for="item in documentList" :key="item.id">
                  <div class="flex">
                    <a-checkbox :checked="item.content.isSelected" @change="val => getChangeBox(val, item.content)"
                      class="mr-[8px]" />
                    <text-card :text-data="item" @handleFetchList="searchData" />
                  </div>
                </a-col>
              </a-row>

              <div class="w-full h-full" v-if="activeKey === 4 && documentList.length > 0">
                <div class="item flex mb-[10px]" v-for="item in documentList" :key="item.id">
                  <a-checkbox :checked="item.content.isSelected" @change="val => getChangeBox(val, item.content)"
                    class="mr-[8px] mt-[16px]" />
                  <ask-card class="flex-1" :ask-data="item" @handleFetchList="getQuestList" />
                </div>
              </div>

              <div class="flex flex-wrap w-full gap-[10px]" v-if="activeKey === 2 && documentList.length > 0">
                <div class="item flex" v-for="item in documentList" :key="item.id">
                  <a-checkbox :checked="item.content.isSelected" @change="val => getChangeBox(val, item.content)"
                    class="mr-[8px]" />
                  <video-card :video-data="item" @handleFetchList="searchData" />
                </div>
              </div>

              <div class="flex flex-wrap w-full gap-[10px]" v-if="activeKey === 3 && documentList.length > 0">
                <div class="item flex" v-for="item in documentList" :key="item.id">
                  <a-checkbox :checked="item.content.isSelected" @change="val => getChangeBox(val, item.content)"
                    class="mr-[8px]" />
                  <img-card :img-data="item" @handleFetchList="searchData" />
                </div>
              </div>
            </a-spin>
          </div>
        </main>
        <footer class="flex justify-end pt-[16px]">
          <a-pagination v-model:current="page.currentPage" :total="page.pageCount" :default-page-size="page.pageSize"
            show-less-items show-size-changer :show-total="total => `共${total}条`" @change="handleCurrentChange"
            @showSizeChange="handleSizeChange" />
        </footer>
      </div>
    </draggable-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated, computed, watch } from 'vue';
import { Empty, message } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import searchTag from './search-tag.vue';
import { knowledgeQueryPage, queryPageQuestion, querySecondTagNode, queryThreeTagNode, saveFieMap } from '@/api/knowledge/index';
import TextCard from '@/views/knowledge/components/textCard.vue';
import AskCard from '@/views/knowledge/components/askCard.vue';
import VideoCard from '@/views/knowledge/components/videoCard.vue';
import ImgCard from '@/views/knowledge/components/imgCard.vue';
import { useUserStore } from '@/store/modules/user';
import draggableModal from '@/components/DraggableModal/index.vue'

// 类型定义
interface DocumentItem {
  id: string;
  content: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileId: string;
    attachmentType?: string;
    kldTageNames?: string;
    kldTagName?: string;
    isSelected?: boolean;
  };
  highlightFields?: {
    id: string;
    content?: {
      isSelected?: boolean;
    };
  };
}

interface TagNode {
  id: string;
  check?: boolean;
}

interface PageInfo {
  pageSize: number;
  pageCount: number;
  currentPage: number;
}

const simpleImage = computed(() => Empty.PRESENTED_IMAGE_SIMPLE);

const props = defineProps({
  addDataDialogVisible: Boolean,
  numberFlag: Number,
  nodeId: String,
});

const customGetContainer = () => document.querySelector('.centerSearch');

const emit = defineEmits(['closeCenterDia', 'handleSuccess']);

// 状态管理
const documentList = ref<DocumentItem[]>([]);
const loading = ref(false);
const searchValue = ref('');
const selectedCheckArr = ref<DocumentItem['content'][]>([]);
const activeKey = ref<1 | 2 | 3 | 4>(1);

const page = ref<PageInfo>({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

// 标签相关
const elTagcheckedOneData = ref<TagNode[]>([]);
const elTagcheckedTwoData = ref<TagNode[]>([]);
const arrayData = ref<string[]>([]);
const firstId = ref<string>();
const flagSecondData = ref<TagNode[]>([]);

// 展开收藏的控制
const elTagcheckedOneStatus = ref(false);
const elTagcheckedTwoStatus = ref(false);
const hiddenStatus = ref(false);

// 统一的数据加载函数，避免重复的三元表达式
const fetchDataByActiveKey = () => {
  activeKey.value === 4 ? getQuestList() : searchData();
};

onActivated(() => {
  fetchDataByActiveKey();
  getTaglist();
});

watch(
  () => props.addDataDialogVisible,
  (val) => {
    if (val) {
      fetchDataByActiveKey();
      getTaglist();
    }
  },
);

const getChangeBox = (val: any, data: DocumentItem['content']) => {
  const isChecked = val.target?.checked;

  if (isChecked) {
    selectedCheckArr.value.push(data);
  } else {
    const idx = selectedCheckArr.value.findIndex(v => v.id === data.id);
    if (idx !== -1) {
      selectedCheckArr.value.splice(idx, 1);
    }
  }

  // 更新列表中的选中状态
  documentList.value.forEach(v => {
    if (v.highlightFields?.id === data.id && v.highlightFields?.content) {
      v.highlightFields.content.isSelected = isChecked;
    }
    if (v.content.id === data.id) {
      v.content.isSelected = isChecked;
    }
  });
};
const confirmDialog = () => {
  const filterData = selectedCheckArr.value.map(v => ({
    title: v.fileName,
    kldTreeId: props.nodeId,
    type: v.attachmentType || '4',
    source: v.attachmentType ? '知识中心' : '知识问答',
    url: v.fileUrl,
    kldFileId: v.id,
    fileId: v.fileId,
    kldTagName: v?.kldTageNames || v.kldTagName,
  }));

  saveFieMap({ data: filterData }).then(res => {
    if (res?.data.code === '0') {
      emit('handleSuccess');
      selectedCheckArr.value = [];
      message.success(res.data.msg);
    } else {
      message.warning(res.data.msg);
    }
  });
};

const initPage = () => {
  page.value.pageSize = 10;
  page.value.currentPage = 1;
};

const onSearch = () => {
  initPage();
  fetchDataByActiveKey();
};

// 获取二级节点数据
const getTaglist = () => {
  const params = {
    tagType: 1,
    nodeLevel: '2',
    fileType: activeKey.value,
  };

  querySecondTagNode(params).then(res => {
    if (res?.data.code === '0') {
      const result = res.data.data.result;
      const shouldSlice = result.length > 12 && !elTagcheckedOneStatus.value;
      elTagcheckedOneData.value = shouldSlice ? result.slice(0, 13) : result;
    }
  });
};

// 获取三级节点数据
const getThirdData = (id: string) => {
  const params = {
    tagType: 1,
    id,
    fileType: activeKey.value,
  };

  queryThreeTagNode(params).then(res => {
    if (res?.data.code === '0') {
      const result = res.data.data.result;

      arrayData.value = result.map(v => v.id);
      flagSecondData.value = JSON.parse(JSON.stringify(result));

      const shouldSlice = result.length > 12 && !elTagcheckedTwoStatus.value;
      elTagcheckedTwoData.value = shouldSlice ? result.slice(0, 13) : result;

      fetchDataByActiveKey();
    }
  });
};

// 所属类目1切换
const onChangeElCheckTagOne = (val: boolean, item: TagNode, index: number) => {
  elTagcheckedTwoData.value = [];

  if (item.id && val) {
    hiddenStatus.value = true;
    getThirdData(item.id);
  }

  firstId.value = item.id;

  elTagcheckedOneData.value.forEach((item) => {
    item.check = false;
  });
  elTagcheckedOneData.value[index].check = val;

  if (!val) {
    arrayData.value = [];
    fetchDataByActiveKey();
    hiddenStatus.value = false;
  }
};

// 所属类目2切换
const onChangeElCheckTagTwo = (val: string[]) => {
  arrayData.value = val;
  fetchDataByActiveKey();
};

// 统一的数据加载逻辑，合并searchData和getQuestList
const loadDocumentList = async (isQuestion: boolean) => {
  try {
    loading.value = true;
    documentList.value = [];

    const userStore = useUserStore();
    const baseParams = {
      all: searchValue.value || '',
      kldTagIds: arrayData.value.toString() || '',
      userId: userStore.getUser.id,
      currentPage: page.value.currentPage,
      pageSize: page.value.pageSize,
    };

    const params = isQuestion
      ? baseParams
      : {
          ...baseParams,
          kldType: activeKey.value,
          keyWords: searchValue.value || '',
          userName: userStore.getUser.userName,
          allowDownload: '',
        };

    const apiCall = isQuestion ? queryPageQuestion : knowledgeQueryPage;
    const res = await apiCall(params);

    if (res?.data.code === '0') {
      const respData = res.data.data.data || [];
      respData.forEach((item: DocumentItem) => {
        if (item.content?.id && selectedCheckArr.value.some(v => v.id === item.content.id)) {
          item.content.isSelected = true;
        }
      });
      documentList.value = respData;
      page.value.pageCount = res.data.data.total;
    }
  } catch (error) {
    console.log('error:', error);
  } finally {
    loading.value = false;
  }
};

const searchData = () => loadDocumentList(false);
const getQuestList = () => loadDocumentList(true);

// 切换文件类型
const handleClick = (val: number) => {
  initPage();
  fetchDataByActiveKey();
  getTaglist();
  hiddenStatus.value = false;
};

// 分页
const handleSizeChange = (val: number) => {
  page.value.pageSize = val;
  fetchDataByActiveKey();
};

const handleCurrentChange = (val: number) => {
  page.value.currentPage = val;
  fetchDataByActiveKey();
};

const handleClose = () => {
  initPage();
  activeKey.value = 1;
  searchValue.value = '';
  elTagcheckedOneData.value = [];
  elTagcheckedTwoData.value = [];
  emit('closeCenterDia');
};
</script>

<style lang="less" scoped>
:deep(.ant-spin-nested-loading) {
  height: 100%;

  .ant-spin-container {
    height: 100%;
  }
}

:deep(.ant-modal-content) {
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-modal-body {
    padding: 16px;
    flex: 1;
    height: 0;
  }
}

.knowledge-tab {
  :deep(.ant-radio-group) {
    display: inline-flex;
    gap: 6px;

    .ant-radio-button-wrapper {
      border-radius: 0 !important;
    }
  }

  .header {
    border-bottom: 1px solid #eaeaf1;
  }
}

:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin-left: 0px;
}

.elTabs {
  border-radius: 4px;
  width: 100%;

  :deep(.ant-tabs-nav) {
    // height: 48px;
    margin-bottom: 0;
    background-color: #ffffff;
    padding: 0 0 16px 0;
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
    padding: 0 !important;
  }

  :deep(.ant-tabs-tab-active) {
    background: #e6effb;

    .ant-tabs-tab-btn {
      font-weight: 600;
      font-size: 14px;
      color: var(--ant-primary-color);
      text-shadow: none !important;
    }
  }

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }

  :deep(.ant-tabs-content-holder) {
    display: none;
  }
}
</style>
