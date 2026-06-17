<script setup lang="ts">
import { knowledgeQueryPage, queryPageQuestion, querySecondTagNode, queryThreeTagNode, knowledgeTree } from '@/api/knowledge';
import textCard from '../components/textCard.vue';
import askCard from '../components/askCard.vue';
import videoCard from '../components/videoCard.vue';
import imgCard from '../components/imgCard.vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/modules/user';
import searchTag from '../components/search-tag.vue';
import { Empty } from 'ant-design-vue';

interface TreeNode {
  id: string | number;
  nodeName: string;
  children?: TreeNode[];
}

interface TagNode {
  id: string;
  nodeName?: string;
  check?: boolean;
  [key: string]: any;
}

interface PageState {
  pageSize: number;
  pageCount: number;
  currentPage: number;
}

const userStore = useUserStore();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

// Tab：1=文档 2=视频 3=图片 4=问答
const tabValue = ref<number>(1);
const searchType = ref<string[]>([]);
const searchValue = ref('');
const loading = ref(false);

// 竞态防护
let abortController: AbortController | null = null;
let currentRequestId = 0;

// 标签数据
const rawTreeData = ref<TreeNode[]>([]);
const elTagcheckedDeptData = ref<TagNode[]>([]);
const elTagcheckedOneData = ref<TagNode[]>([]);
const elTagcheckedTwoData = ref<TagNode[]>([]);
const hiddenStatus = ref(false);
const elTagcheckedDeptStatus = ref(false);
const elTagcheckedOneStatus = ref(false);
const elTagcheckedTwoStatus = ref(false);
const kldTreeId = ref('');

// 当前选中的三级节点 id 列表
const arrayData = ref<string[]>([]);
// 三级节点完整数据（用于展开/收起）
const flagSecondData = ref<TagNode[]>([]);

const documentList = ref<any[]>([]);

const page = ref<PageState>({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

const searchOptions = [
  { label: '关键字', value: '1' },
];

// ── 统一调度：根据当前 tab 发起对应请求 ──────────────────
const fetchList = () => {
  if (tabValue.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
};

// ── 搜索（文档 / 视频 / 图片）────────────────────────────
const searchData = async () => {
  abortController?.abort();
  abortController = new AbortController();
  const requestId = ++currentRequestId;

  loading.value = true;
  arrayData.value = [...new Set(arrayData.value)];

  try {
    const params = {
      kldType: tabValue.value,
      keyWords: searchType.value[0] === '1' ? searchValue.value : '',
      userName: userStore.getUser.userName,
      allowDownload: searchType.value[0] === '2' ? '0' : '',
      all: searchValue.value || '',
      kldTagIds: arrayData.value.toString(),
      kldTreeId: kldTreeId.value,
      currentPage: page.value.currentPage,
      pageSize: page.value.pageSize,
      userId: userStore.getUser.id,
    };
    const res = await knowledgeQueryPage(params);
    if (requestId !== currentRequestId) return;
    if (res?.data.code === '0') {
      documentList.value = res.data.data.data;
      page.value.pageCount = res.data.data.total;
    }
  } catch (error) {
    if (requestId !== currentRequestId) return;
    console.error('searchData error:', error);
  } finally {
    if (requestId === currentRequestId) {
      loading.value = false;
    }
  }
};

// ── 问答列表 ──────────────────────────────────────────────
const getQuestList = () => {
  abortController?.abort();
  abortController = new AbortController();
  const requestId = ++currentRequestId;

  documentList.value = [];
  loading.value = true;
  arrayData.value = [...new Set(arrayData.value)];

  const params = {
    all: searchValue.value || '',
    kldTagIds: arrayData.value.toString(),
    kldTreeId: kldTreeId.value,
    userId: userStore.getUser.id,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  queryPageQuestion(params)
    .then(res => {
      if (requestId !== currentRequestId) return;
      if (res?.data.code === '0') {
        documentList.value = res.data.data.data;
        page.value.pageCount = res.data.data.total;
      }
    })
    .finally(() => {
      if (requestId === currentRequestId) {
        loading.value = false;
      }
    });
};

// ── Tab 切换 ──────────────────────────────────────────────
const changeType = () => {
  abortController?.abort();
  abortController = null;
  documentList.value = [];
  loading.value = false;

  page.value.currentPage = 1;
  page.value.pageSize = 10;
  arrayData.value = [];
  kldTreeId.value = '';
  elTagcheckedDeptData.value.forEach(i => { i.check = false; });

  fetchList();
  getTaglist();
  hiddenStatus.value = false;
};

const getAllChildrenIds = (node: TreeNode): string[] => {
  if (!node?.children?.length) return [];
  let ids: string[] = [];
  for (const child of node.children) {
    ids.push(String(child.id));
    ids = ids.concat(getAllChildrenIds(child));
  }
  return ids;
};

const findTreeNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
  for (const node of nodes) {
    if (String(node.id) === id) return node;
    if (node.children?.length) {
      const found = findTreeNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const getDeptList = () => {
  knowledgeTree({ menuId: 1, treeType: '1', parentId: '0', menuParentId: '' }).then(res => {
    if (res?.data.code === '0' && res.data.data) {
      const rawData: TreeNode[] = Array.isArray(res.data.data?.result)
        ? res.data.data.result
        : [res.data.data.result];
      rawTreeData.value = rawData;

      const secondLevelNodes: TagNode[] = [];
      rawData.forEach(root => {
        root.children?.forEach(child => {
          secondLevelNodes.push({
            id: String(child.id),
            nodeName: child.nodeName,
            check: false,
          });
        });
      });

      elTagcheckedDeptData.value =
        secondLevelNodes.length > 12 && !elTagcheckedDeptStatus.value
          ? secondLevelNodes.slice(0, 13)
          : secondLevelNodes;
    }
  });
};

// ── 搜索框回车 / 点击 ────────────────────────────────────
const onSearch = () => {
  page.value.currentPage = 1;
  fetchList();
};

// ── 获取二级节点 ──────────────────────────────────────────
const getTaglist = () => {
  const params = { tagType: 1, nodeLevel: '2', fileType: tabValue.value };
  querySecondTagNode(params).then(res => {
    if (res?.data.code === '0') {
      const result: TagNode[] = res.data.data.result;
      elTagcheckedOneData.value =
        result.length > 12 && !elTagcheckedOneStatus.value
          ? result.slice(0, 13)
          : result;
    }
  });
};

// ── 获取三级节点 ──────────────────────────────────────────
const getThirdData = (id: string) => {
  const params = { tagType: 1, id, fileType: tabValue.value };
  queryThreeTagNode(params).then(res => {
    if (res?.data.code === '0') {
      const result: TagNode[] = res.data.data.result;
      flagSecondData.value = JSON.parse(JSON.stringify(result));
      arrayData.value = result.map(v => v.id);
      elTagcheckedTwoData.value =
        result.length > 12 && !elTagcheckedTwoStatus.value
          ? result.slice(0, 13)
          : result.length > 12 && elTagcheckedTwoStatus.value
            ? flagSecondData.value
            : result;
      fetchList();
    }
  });
};

// ── 科室切换 ────────────────────────────────────────────
const onChangeElCheckTagDept = (val: boolean, item: TagNode, index: number) => {
  elTagcheckedDeptData.value.forEach(i => { i.check = false; });
  elTagcheckedDeptData.value[index].check = val;

  if (val && item.id) {
    const node = findTreeNodeById(rawTreeData.value, item.id);
    const allIds = node ? [item.id, ...getAllChildrenIds(node)] : [item.id];
    kldTreeId.value = allIds.join(',');
  } else {
    kldTreeId.value = '';
  }

  page.value.currentPage = 1;
  fetchList();
};

// ── 类目一切换 ────────────────────────────────────────────
const onChangeElCheckTagOne = (val: boolean, item: TagNode, index: number) => {
  elTagcheckedTwoData.value = [];
  elTagcheckedOneData.value.forEach(i => { i.check = false; });
  elTagcheckedOneData.value[index].check = val;

  if (val && item.id) {
    hiddenStatus.value = true;
    getThirdData(item.id);
  } else {
    arrayData.value = [];
    hiddenStatus.value = false;
    fetchList();
  }
};

// ── 类目二切换 ────────────────────────────────────────────
const onChangeElCheckTagTwo = (val: string[]) => {
  page.value.currentPage = 1;
  arrayData.value = val;
  fetchList();
};

// ── 分页 ──────────────────────────────────────────────────
const handleCurrentChange = (val: number, size: number) => {
  page.value.currentPage = val;
  page.value.pageSize = size;
  fetchList();
};

onMounted(() => {
  searchData();
  getTaglist();
  getDeptList();
});
</script>

<template>
  <div class="knowledge-container flex flex-col h-full">
    <div class="w-full flex items-center justify-between header">
      <a-tabs v-model:active-key="tabValue" class="elTabs" @change="changeType" size="small">
        <a-tab-pane tab="文档" :key="1" />
        <a-tab-pane tab="问答" :key="4" />
        <a-tab-pane tab="视频" :key="2" />
        <a-tab-pane tab="图片" :key="3" />
        <template #rightExtra>
          <div class="flex items-center">
            <a-input-search v-model:value="searchValue" placeholder="输入关键字进行搜索" @search="onSearch"
              class="max-w-[300px]">
              <template #enterButton>
                <div class="flex items-center">
                  <SearchOutlined />
                  <span class="ml-[4px]">搜索</span>
                </div>
              </template>
            </a-input-search>
            <a-checkbox-group v-model:value="searchType" :options="searchOptions" class="ml-[8px] flex-shrink-0" />
          </div>
        </template>
      </a-tabs>
    </div>
    <searchTag :elTagcheckedDeptData="elTagcheckedDeptData" :elTagcheckedOneData="elTagcheckedOneData"
      :hiddenStatus="hiddenStatus" :elTagcheckedDeptStatus="elTagcheckedDeptStatus"
      :elTagcheckedOneStatus="elTagcheckedOneStatus" :elTagcheckedTwoStatus="elTagcheckedTwoStatus"
      :elTagcheckedTwoData="elTagcheckedTwoData" @onChangeElCheckTagDept="onChangeElCheckTagDept"
      @onChangeElCheckTagOne="onChangeElCheckTagOne" @onChangeElCheckTagTwo="onChangeElCheckTagTwo"
      class="mt-[16px]" />
    <main class="flex-1 h-0">
      <a-spin :spinning="loading">
        <div class="list wei-scrollbar h-full overflow-y-auto pt-[16px]">
          <a-empty v-if="!loading && !documentList.length" :image="simpleImage" />
          <a-row class="w-full items-start" v-if="tabValue === 1" :gutter="[16, 16]">
            <a-col :span="12" class="item" v-for="item in documentList" :key="item.id">
              <text-card :text-data="item" @handleFetchList="searchData" />
            </a-col>
          </a-row>

          <div class="w-full h-full" v-if="tabValue === 4">
            <div class="item" v-for="item in documentList" :key="item.id">
              <ask-card :ask-data="item" @handleFetchList="getQuestList" />
            </div>
          </div>
          <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="tabValue === 2">
            <div class="item" v-for="item in documentList" :key="item.id">
              <video-card :video-data="item" @handleFetchList="searchData" />
            </div>
          </div>
          <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="tabValue === 3">
            <div class="item" v-for="item in documentList" :key="item.id">
              <img-card :img-data="item" @handleFetchList="searchData" />
            </div>
          </div>
        </div>
      </a-spin>
    </main>
    <footer class="flex justify-end pt-[16px]">
      <a-pagination v-model:current="page.currentPage" :total="page.pageCount" :default-page-size="page.pageSize"
        show-less-items show-size-changer :show-total="total => `共${total}条`" @change="handleCurrentChange" />
    </footer>
  </div>
</template>

<style lang="less" scoped>
:deep(.ant-spin-nested-loading) {
  height: 100%;

  .ant-spin-container {
    height: 100%;
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
