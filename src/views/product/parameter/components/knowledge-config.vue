<script lang="ts" setup>
import draggableModal from '@/components/DraggableModal/index.vue'
import { Pane, Splitpanes } from "splitpanes";
import { LeftOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse'
import { useUserStore } from '@/store/modules/user';
import { knowledgeQueryPage } from '@/api/knowledge';
import textCard from './textCard.vue';
import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import VideoImg from '@/views/knowledge/components/videoImg.vue';
import { message } from 'ant-design-vue';


interface PageState {
  pageSize: number;
  pageCount: number;
  currentPage: number;
}
const props = defineProps({
  fileId: String
})

const emits = defineEmits(['closeKnowledgeModal'])
const page = ref<PageState>({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

const rowClassName = (_record: any, index: number) =>
  index % 2 === 1 ? "table-striped" : "";

const visible = ref(false)
const tableLoading = ref(false)
const searchValue = ref('')
const documentList = ref([])
const loading = ref(false)
const businessId = ref('')
const activeFileId = ref('')

const tableData = ref([])

// 预览
const imgHide = ref(false);
const fileUrlPlay = ref<string>();

const columns = ref([
  { title: '关联知识主题', dataIndex: 'content', key: 'content', ellipsis: true, align: 'center' },
  { title: '知识文档名称', dataIndex: 'title', key: 'title', ellipsis: true, align: 'center' },
  { title: '关联状态', dataIndex: 'status', key: 'status', align: 'center', width: 100 },
  { title: '操作', key: 'operation', align: 'center', width: 160 }
])

const fetchFileList = async () => {
  try {
    loading.value = true
    const params = {
      kldType: 1,
      keyWords: searchValue.value,
      userName: useUserStore().getUser.userName,
      allowDownload: '',
      all: searchValue.value,
      kldTagIds: '',
      currentPage: page.value.currentPage,
      pageSize: page.value.pageSize,
      userId: useUserStore().getUser.id,
    };
    const res = await knowledgeQueryPage(params);
    if (res?.data.code === '0') {
      documentList.value = res.data.data.data;
      activeFileId.value = documentList.value[0]?.content?.fileId
      fetchConfigData()
      page.value.pageCount = res.data.data.total;
    }
  } catch (error) {
    console.error('searchData error:', error);
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  fetchFileList()
}


const closeKnowledgeModal = () => {
  documentList.value = []
  tableData.value = []
  visible.value = false
}

const saveKnowledge = () => { }

const {
  leftTreeCollapsed,
  leftTreePaneSize,
  rightTreePaneSize,
  minExpanded,
  onSplitpanesResized,
  toggleLeftTreePanel,
  splitToggleStyle,
} = useSplitpanesTreeCollapse({ defaultSize: 30 });

const handleCurrentChange = (val: number, size: number) => {
  page.value.currentPage = val;
  page.value.pageSize = size;
  fetchFileList();
};

const fetchConfigData = async () => {
  try {
    tableLoading.value = true
    const res = await AdminApiSystemParameter.getParameterActList({ fileId: activeFileId.value, businessId: businessId.value, type: '1' })
    if (res?.data.code === 200) {
      tableData.value = res?.data.data
    }
  } catch (error) {
    console.error('fetchConfigData error:', error);
  } finally {
    tableLoading.value = false
  }
}

const handleClick = (item) => {
  activeFileId.value = item.fileId
  fetchConfigData()
}

// 预览
const preview = async (item) => {
  try {
    const res = await AdminApiSystemParameter.parameterFileDetail({ id: item.id || item.kldFileId })
    if (res.data.code === 200) {
      fileUrlPlay.value = res.data.data.picture
      imgHide.value = true
    }
  } catch (error) {
    console.error('preview error:', error);
  }
}

// 关联
const association = async (record: any) => {
  try {
    const params = {
      knowledgeParseId: record.id,
      businessId: businessId.value,
      type: '1',
    }

    let res;
    if (record.status === '未关联') {
      res = await AdminApiSystemParameter.parameterAssociation(params)
    } else if (record.status === '已关联') {
      res = await AdminApiSystemParameter.parameterCancelAssociation(params)
    }

    if (res?.data?.code === '0' || res?.data?.code === 200) {
      message.success(record.status === '未关联' ? '关联成功' : '取消关联成功')
      fetchConfigData()
    } else {
      message.error(res?.data?.msg || '操作失败')
    }
  } catch (error) {
    console.error('association error:', error);
  }
}


const show = (id: string) => {
  businessId.value = id
  visible.value = true
  fetchFileList()
}

defineExpose({
  show,
})


</script>
<template>
  <draggable-modal v-model:visible="visible" centered :title="$t('知识配置')" width="80%"
    :body-style="{ height: '80vh', padding: 0 }" @cancel="closeKnowledgeModal">
    <div style="min-height: 360px" class="w-full h-full">
      <div class="splitpanes-tree-collapse-wrap h-full">
        <Splitpanes class="default-theme sbom" @resized="onSplitpanesResized">
          <Pane :min-size="leftTreeCollapsed ? 0 : minExpanded" :size="leftTreePaneSize"
            class="splitpane-cls marginstyle">
            <div class="h-full flex flex-col">
              <a-input-search v-model:value="searchValue" placeholder="输入关键字进行搜索" @search="onSearch">
                <template #enterButton>
                  <div class="flex items-center">
                    <SearchOutlined />
                    <span class="ml-[4px]">搜索</span>
                  </div>
                </template>
              </a-input-search>
              <div class="list flex-1 overflow-y-auto overflow-x-hidden wei-scrollbar mt-[10px]">
                <a-spin :spinning="loading" class="h-full w-full">
                  <div class="item" v-for="item in documentList" :key="item.id" @click="handleClick(item?.content)">
                    <text-card :text-data="item?.content" @handleFetchList="fetchFileList" :activeId="activeFileId" />
                  </div>
                </a-spin>
              </div>
              <div class="py-[10px] flex justify-end">
                <a-pagination v-model:current="page.currentPage" :total="page.pageCount"
                  :default-page-size="page.pageSize" show-less-items show-size-changer
                  :show-total="total => `共${total}条`" @change="handleCurrentChange" size="small" />
              </div>
            </div>
          </Pane>
          <!-- 右侧内容区域 -->
          <Pane class="splitpane-cls" :size="rightTreePaneSize">
            <div class="p-[16px]">
              <a-table :columns="columns" :data-source="tableData" :scroll="{ x: 600, y: 600 }"
                :rowKey="(record) => record.id" :loading="tableLoading" bordered :row-class-name="rowClassName"
                :pagination="false">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'operation'">
                    <span class="text-primary cursor-pointer text-[12px]" @click="preview(record)">预览</span>
                    <template v-if="['未关联', '已关联'].includes(record.status)">
                      <a-divider type="vertical" />
                      <span :class="record.status === '未关联' ? 'text-primary' : 'text-red-500'"
                        class="cursor-pointer text-[12px]" @click="association(record)">
                        {{ record.status === '未关联' ? '关联' : '取消关联' }}
                      </span>
                    </template>
                  </template>
                </template>
              </a-table>
              <VideoImg :video-hide="imgHide" :file-url-play="fileUrlPlay" dialog-type="3" title-type="图片预览"
                @get-video-hide="(val) => imgHide = val" />
            </div>
          </Pane>
        </Splitpanes>
        <Tooltip :title="leftTreeCollapsed ? $t('展开分类') : $t('折叠分类')">
          <button type="button" class="splitpanes-tree-collapse-wrap__toggle" :style="splitToggleStyle"
            @click="toggleLeftTreePanel" @mousedown.stop>
            <LeftOutlined v-if="!leftTreeCollapsed" />
            <RightOutlined v-else />
          </button>
        </Tooltip>
      </div>
    </div>
    <template #footer>
      <a-space>
        <a-button type="primary" @click="closeKnowledgeModal">{{ $t('确定') }}</a-button>
        <a-button @click="closeKnowledgeModal">{{ $t('取消') }}</a-button>
      </a-space>
    </template>
  </draggable-modal>
</template>

<style lang="less" scoped>
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}

:deep(.marginstyle) {
  padding: 10px !important;
  padding-bottom: 5px !important;

}

:deep(.ant-select-selection-item) {
  display: flex;
  align-items: center;
}

:deep(.ant-spin-spinning) {
  display: flex;
  justify-content: center;
  align-items: center;

  .ant-spin-container {
    height: 100%;
  }
}
</style>