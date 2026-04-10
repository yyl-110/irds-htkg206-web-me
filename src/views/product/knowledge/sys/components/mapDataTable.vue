<template>
  <div class="tableWrap p-[16px] h-full flex flex-col pb-0">
    <div class="header">
      <div class="flex items-center gap-[8px]">
        <a-input placeholder="请输入标签名称" class="max-w-[200px]" v-model:value="searchData.tagName"
          @keydown.enter="fetchProductList" />
        <a-select v-model:value="searchData.type" class="min-w-[200px] max-w-[200px]" placeholder="请选择知识类型">
          <a-select-option :value="item.value" v-for="item in tagList" :key="item.id">{{ item.name }}</a-select-option>
        </a-select>
        <a-input placeholder="请输入标题" class="max-w-[200px]" v-model:value="searchData.title"
          @keydown.enter="fetchProductList" />
        <a-input placeholder="请输入创建人" class="max-w-[200px]" v-model:value="searchData.userName"
          @keydown.enter="fetchProductList" />

        <a-button type="primary" @click="fetchProductList" class="ml-auto"> 查询 </a-button>
        <a-button type="primary" @click="reset"> 重置 </a-button>
      </div>

      <div class="flex items-center gap-[8px] mt-[16px]">
        <a-button type="primary" @click="addDataDialogVisible = true">
          <template #icon>
            <PlusOutlined />
          </template>
          创建项目
        </a-button>
        <a-button>
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
      </div>
    </div>
    <main class="mt-[16px] flex-1">
      <a-table :columns="columns" :data-source="tableData" :scroll="{ x: 1200, y: 'calc(100vh - 400px)' }"
        :rowKey="(record) => record.id" :loading="loading"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }" bordered :row-class-name="rowClassName"
        :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <span>{{ getTagName(record?.type) }}</span>
          </template>
          <template v-if="column.key === 'fileName'">
            <a-tooltip :title="record?.fileName">
              <div class="text-primary cursor-pointer text-ellipsis w-full overflow-hidden" @click="viewPdfFun(record)">
                {{ record?.fileName }}</div>
            </a-tooltip>
          </template>
          <template v-if="column.key === 'addTime'">
            <span>{{ getTimes(Date.parse(record?.addTime)) }}</span>
          </template>
          <template v-if="column.key === 'operation'">
            <span class="handle_btn text-primary cursor-pointer" @click="deleteProject(record)">删除</span>
          </template>
        </template>
      </a-table>
    </main>

    <center-search :addDataDialogVisible="addDataDialogVisible" @closeCenterDia="addDataDialogVisible = false"
      @handleSuccess="handleSuccess" :nodeId="nodeId" />
    <Video :videoHide="videoHide" :fileUrlPlay="fileUrlPlay" :dialogType="dialogType" :titleType="titleType"
      @getVideoHide="getVideoHide"></Video>
  </div>
</template>

<script setup lang="ts">
import { getPdfPreviewPath, knowledgeFileMapData, queryByKey, removeMapData } from '@/api/knowledge'
import { useTableFilter } from '@/hooks/useTableFilter';
import { message, Modal, TableColumnsType } from 'ant-design-vue';
import { usePagination } from "@/hooks/usePagination";
import { getTimes } from '@/utils/dateUtils';
import { PaginationConfig } from 'ant-design-vue/es/pagination';
import Video from '@/views/knowledge/components/videoImg.vue';
import centerSearch from './centerSearch.vue'


const props = defineProps({
  kldTreeId: {
    type: String,
    default: ''
  },
  tagList: {
    type: Array,
    default: () => []
  },
  nodeId: {
    type: String,
    default: ''
  }
})

const searchData = ref({
  tagName: '',
  type: null,
  title: '',
  userName: ''
})

// const tagList = ref<{ name: string; id: number; value: string; }[]>([])
const loading = ref(false)
const selectedRowKeys = ref<string[]>([]);
const router = useRouter()
const addDataDialogVisible = ref(false)

const videoHide = ref(false)
const fileUrlPlay = ref('')
const dialogType = ref('')
// 弹窗title类型
const titleType = ref('');

const pagination = reactive<PaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 10,
  showLessItems: true,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (pageNum, pageSize) => {
    pagination.current = pageNum;
    pagination.pageSize = pageSize;
    fetchProductList();
  },
})

// 添加数据弹框保存成功回调
const handleSuccess = () => {
  fetchProductList()
  addDataDialogVisible.value = false
}

async function fetchProductList() {
  try {
    loading.value = true;
    const params = { ...searchData.value, kldTreeId: props.kldTreeId, currentPage: pagination.current, pageSize: pagination.pageSize }
    const res = await knowledgeFileMapData(params);
    if (res && res.data.code === "0") {
      tableData.value = res.data.data?.result || [];
      pagination.total = res.data.data?.total || 0;
    }
  } catch (error) {
    console.log("error:", error);
  } finally {
    loading.value = false;
  }
}

// 查看pdf
const viewPdf = (id) => {
  getPdfPreviewPath({ id }).then((res) => {
    if (res && res.data.code === 200) {
      router.push({
        path: "/knowledge/pdfView",
        query: { docId: res.data.data.fileUrl },
      });
    }
  });
};

const viewPdfFun = (item) => {
  dialogType.value = item.type;
  if (item.type === '1') {
    viewPdf(item.id);
  } else if (item.type === '2') {
    fileUrlPlay.value = item?.fileUrl;
    videoHide.value = true;
    titleType.value = '视频播放';
  } else if (item.type === '3') {
    fileUrlPlay.value = item?.fileUrl;
    videoHide.value = true;
    titleType.value = '图片查看';
  }
};

const rowClassName = (_record: any, index: number) =>
  index % 2 === 1 ? "table-striped" : "";

const { getColumnSearchProps, getColumnSelectProps } = useTableFilter();

const tableData = ref<any[]>([]);

const getTagName = (type: string) => props.tagList.find(item => item.value === type)?.name

const columns = computed<TableColumnsType>(() => [
  {
    title: "标题",
    dataIndex: "fileName",
    key: "fileName",
    width: 200,
    ellipsis: true,
    ...getColumnSearchProps("fileName"),
  },
  {
    title: "知识类型",
    dataIndex: "type",
    key: "type",
    width: 120,
  },
  {
    title: "知识来源",
    dataIndex: "source",
    key: "source",
    width: 120,
    ...getColumnSelectProps("source", tableData),
  },
  {
    title: "创建时间",
    dataIndex: "addTime",
    key: "addTime",
    width: 120,
    align: "center",
  },
  {
    title: "创建人",
    dataIndex: "userName",
    key: "userName",
    width: 120,
    align: "center",
    ...getColumnSelectProps("userName", tableData),
  },
  {
    title: "操作",
    key: "operation",
    width: 80,
    align: "center",
    fixed: "right",
  },
]);


const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys;
};


const reset = () => {
  searchData.value = {
    tagName: '',
    type: null,
    title: '',
    userName: ''
  }
  fetchProductList()
}

const getVideoHide = val => {
  videoHide.value = val;
};

const deleteProject = (row) => {
  try {
    Modal.confirm({
      title: '',
      content: '是否确认删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await removeMapData({ id: row.id })
        if (res.data.code === '0') {
          message.success('删除成功')
          fetchProductList()
        }
      },
    });

  } catch (error) {
  console.log('error:', error)
  }
}

watch(() => props.kldTreeId, () => {
  if (props.kldTreeId) {
    pagination.current = 1;
    pagination.pageSize = 10;
    fetchProductList()
  }
})


</script>

<style scoped lang="less">
.table-striped {
  background-color: #f7f8fb;
}
</style>