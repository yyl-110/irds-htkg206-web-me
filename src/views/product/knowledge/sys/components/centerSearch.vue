<template>
  <div class="centerSearch" v-dragModal>
    <draggable-modal :getContainer="customGetContainer" :maskClosable="false" class="layout"
      :visible="addDataDialogVisible" title="添加数据" width="70%" @cancel="handleClose" height="80%" @ok="confirmDialog">
      <div class="knowledge-container flex flex-col h-full">
        <div class="flex items-center justify-end">
          <a-input-search v-model:value="searchValue" placeholder="输入关键字进行搜索" @search="onSearch" class="max-w-[300px]">
            <template #enterButton>
              <div class="flex items-center">
                <SearchOutlined />
                <span class="ml-[4px]">搜索</span>
              </div>
            </template>
          </a-input-search>
        </div>
        <searchTag :elTagcheckedOneData="elTagcheckedOneData" :hiddenStatus="hiddenStatus"
          :elTagcheckedOneStatus="elTagcheckedOneStatus" :elTagcheckedTwoStatus="elTagcheckedTwoStatus"
          :elTagcheckedTwoData="elTagcheckedTwoData" @onChangeElCheckTagOne="onChangeElCheckTagOne"
          @onChangeElCheckTagTwo="onChangeElCheckTagTwo" class="mt-[16px]" />
        <main class="flex-1 h-0">
          <div class="list overflow-y-auto wei-scrollbar h-full pt-[16px]">
            <a-spin :spinning="loading" class="h-full">
              <a-row class="w-full items-start h-full" :gutter="[16, 16]">
                <a-col :span="12" class="item" v-for="item in documentList" :key="item.id">
                  <div class="flex">
                    <a-checkbox :checked="item.content.isSelected" @change="val => getChangeBox(val, item.content)"
                      class="mr-[8px]" />
                    <text-card :text-data="item" @handleFetchList="searchData" />
                  </div>
                </a-col>
              </a-row>
              <a-empty v-if="documentList.length === 0 && !loading" :image="simpleImage" />
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
import { ref, onActivated, computed } from 'vue';
import { Empty, message } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import searchTag from './search-tag.vue';
import { useRoute } from 'vue-router';
import { knowledgeQueryPage, getNodeByLevel, querySecondTagNode, queryThreeTagNode, saveFieMap, saveTreeData } from '@/api/knowledge/index';
import TextCard from '@/views/knowledge/components/textCard.vue';
import { useUserStore } from '@/store/modules/user';
import draggableModal from '@/components/DraggableModal/index.vue'

const simpleImage = computed(() => Empty.PRESENTED_IMAGE_SIMPLE);

const props = defineProps({
  addDataDialogVisible: Boolean,
  numberFlag: Number,
  nodeId: String,
});

const customGetContainer = () => document.querySelector('.centerSearch');

const emit = defineEmits(['closeCenterDia', 'handleSuccess']);
const route = useRoute();

// 文档列表页数据
const documentList = ref([]);

const loading = ref(false);
const searchValue = ref('');
const selectedCheckArr = ref([]);

const visible = ref(false);

const page = ref({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

// 所属类目1
const elTagcheckedOneData = ref([]);
// 所属类目2
const elTagcheckedTwoData = ref([]);

// 三级节点选中的数据
const thirdData = ref([]);

// 所有三级节点的id
const arrayData = ref([]);

// 所属类目1的id
const firstId = ref();

// 操作所属类目2数据
const flagSecondData = ref([]);

// 展开收藏的控制
const elTagcheckedOneStatus = ref(false);
const elTagcheckedTwoStatus = ref(false);

const hiddenStatus = ref(false);

onActivated(() => {
  searchData();
  getTaglist();
});

watch(
  () => props.addDataDialogVisible,
  val => {
    visible.value = val;
    if (val) {
      searchData();
      getTaglist();
    }
  },
);

const getChangeBox = (val, data) => {
  if (val.target?.checked) {
    selectedCheckArr.value.push(data);
  } else {
    selectedCheckArr.value.filter((v, index) => {
      if (v.id === data.id) {
        selectedCheckArr.value.splice(index, 1);
      }
    });
  }
  if (documentList.value && documentList.value.length > 0) {
    documentList.value.map(v => {
      if (v.highlightFields?.id === data.id && v.highlightFields?.content) {
        v.highlightFields.content.isSelected = val.target?.checked;
      }
      if (v.content.id === data.id) {
        v.content.isSelected = val.target?.checked;
      }
    });
  }
};
const confirmDialog = () => {
  const filterData = selectedCheckArr.value.map(v => ({
    fileName: v.fileName,
    kldFileId: v.id.toString(), //要存储的文件Id
    fileId: v.fileId.toString(), // 文件位置id,
  }));

  const params = {
    id: props.nodeId,
    taskMapId: route.query.id ? Number(route.query.id) : null,
    userId: useUserStore().getUser.id,
    batch: filterData,
  };

  saveTreeData(params).then(res => {
    if (res && res.data.code === '0') {
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
  searchData();
};

// 获取二级节点数据
const getTaglist = () => {
  const params = {
    // menuId: itemObj.value.id,
    // menuParentId: itemObj.value.categoryID,
    tagType: 1,
    nodeLevel: '2',
    fileType: 1,
  };
  querySecondTagNode(params).then(res => {
    if (res && res.data.code === '0') {
      // 二级节点
      elTagcheckedOneData.value = [];
      elTagcheckedOneData.value = res.data.data.result;
      if (res.data.data.result.length > 12 && elTagcheckedOneStatus.value === false) {
        elTagcheckedOneData.value = [];
        elTagcheckedOneData.value = res.data.data.result.splice(0, 13);
      } else if (res.data.data.result.length > 12 && elTagcheckedOneStatus.value === true) {
        elTagcheckedOneData.value = [];
        elTagcheckedOneData.value = res.data.data.result;
      }
    }
  });
};

// 获取三级节点数据
const getThirdData = id => {
  const params = {
    tagType: 1,
    id,
    fileType: 1,
  };
  queryThreeTagNode(params).then(res => {
    if (res && res.data.code === '0') {
      arrayData.value = [];
      elTagcheckedTwoData.value = [];
      flagSecondData.value = [];
      // 三级节点
      flagSecondData.value = JSON.parse(JSON.stringify(res.data.data.result));
      elTagcheckedTwoData.value = res.data.data.result;

      res.data.data.result.map(v => {
        arrayData.value.push(v.id);
      });

      if (elTagcheckedTwoData.value.length > 12 && elTagcheckedTwoStatus.value === false) {
        elTagcheckedTwoData.value = elTagcheckedTwoData.value.splice(0, 13);
      } else if (elTagcheckedTwoData.value.length > 12 && elTagcheckedTwoStatus.value === true) {
        elTagcheckedTwoData.value = [];
        elTagcheckedTwoData.value = flagSecondData.value;
      }
      searchData();
    }
  });
};
// 所属类目1切换
const onChangeElCheckTagOne = (val, item, index) => {
  elTagcheckedTwoData.value = [];
  if (item.id && val) {
    hiddenStatus.value = true;
    getThirdData(item.id);
  }
  // 保存类目1的id
  firstId.value = item.id;
  elTagcheckedOneData.value.forEach((item: any) => {
    item.check = false;
  });
  elTagcheckedOneData.value[index].check = val;

  if (val === false) {
    arrayData.value = [];
    searchData();
    hiddenStatus.value = false;
  }
  thirdData.value = [];
};

//所属类目2切换
const onChangeElCheckTagTwo = val => {
  arrayData.value = val;
  searchData();
};

// 搜索数据按钮接口
const searchData = async () => {
  try {
    loading.value = true;
    const params = {
      kldType: 1,
      keyWords: searchValue.value || '', // 判断点没点关键字
      userName: useUserStore().getUser.userName,
      allowDownload: '',
      all: searchValue.value || '',
      kldTagIds: arrayData.value.toString() || '',
      currentPage: page.value.currentPage,
      pageSize: page.value.pageSize,
      userId: useUserStore().getUser.id,
    };
    const res = await knowledgeQueryPage(params);
    if (res && res.data.code === '0') {
      documentList.value = [];
      documentList.value = res.data.data.data;
      page.value.pageCount = res.data.data.total;
    }
  } catch (error) {
    console.log('error:', error);
  } finally {
    loading.value = false;
  }
};

//分页
const handleSizeChange = val => {
  page.value.pageSize = val;
  searchData();
};
//分页
const handleCurrentChange = val => {
  page.value.currentPage = val;
  searchData();
};
const handleClose = () => {
  initPage();
  searchValue.value = '';
  emit('closeCenterDia');
};
</script>

<style lang="less" scoped>
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
      color: #1366d1;
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
