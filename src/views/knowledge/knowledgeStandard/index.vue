<template>
  <div class="layout h-full w-full">
    <div class="elMain h-full w-full">
      <div class="top-header">
        <div class="second">
          <div class="standard_classification">
            <span class="secondSpan">标准分类：</span>
            <a-select v-model:value="bzfldh" class="el-check-tag-wrap" placeholder="请选择标准分类" style="width: 240px"
              allow-clear @change="tagChangeOne">
              <a-select-option v-for="item in standardClassificaData" :key="item.bz_fl" :value="item.bz_fl">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-select v-model:value="bzzt" class="el-check-tag-wrap" placeholder="请选择标准状态" style="width: 240px"
              allow-clear @change="tagChangeOne">
              <a-select-option v-for="item in standardStatusOpt" :key="item.bz_fl" :value="item.bz_fl">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="search-wrap">
          <a-input-search v-model:value="keyWord" placeholder="输入关键字进行搜索" @search="getListData" class="max-w-[400px]">
            <template #enterButton>
              <div class="flex items-center">
                <SearchOutlined />
                <span class="ml-[4px]">搜索</span>
              </div>
            </template>
          </a-input-search>
        </div>
      </div>
      <div class="content">
        <a-table :columns="columns" :data-source="standardData" :scroll="{ x: 1200, y: 'calc(100vh - 296px)' }"
          :pagination="pagination" bordered
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" @change="handleTableChange">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'action'">
              <a-button type="link" size="small" @click="handlePreview(index, record)">预览</a-button>
              <a-button type="link" size="small" @click="handleDownFile(index, record)">下载</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { TableColumnsType, TableProps } from 'ant-design-vue';
import { findAllBzfl, findBzwj, getFileInfo } from '@/api/knowledge/index';
import { useRouter } from 'vue-router';
import { useTableFilter } from '@/hooks/useTableFilter';
const { getColumnSearchProps, getColumnSelectProps } = useTableFilter();

const baseUrl = import.meta.env.VITE_BASE_URL as string;

const router = useRouter();

// 标准分类
const standardClassificaData = ref<any[]>([]);
// 搜索内容
const keyWord = ref('');
// 标准分类代号
const bzfldh = ref(null);
// 标准状态值
const bzzt = ref('');
// 标准状态选项
const standardStatusOpt = ref([
  { bz_fl: '', name: '全部' },
  { bz_fl: 'Y', name: '现行' },
  { bz_fl: 'N', name: '作废' },
  { bz_fl: 'B', name: '未维护' },
]);

const page = ref({
  pageSize: 20,
  pageCount: 0,
  currentPage: 1,
});

// 表格数据
const standardData = ref<any[]>([]);

// 表头
const columns: TableColumnsType = [
  { title: '标准文件', dataIndex: 'bzwj', key: 'bzwj', width: 260, ...getColumnSearchProps("bzwj") },
  { title: '标准分类', dataIndex: 'flName', key: 'flName', width: 120 },
  { title: '标准号', dataIndex: 'bzdh', key: 'bzdh', width: 160 },
  { title: '实施日期', dataIndex: 'ssrq', key: 'ssrq' },
  { title: '标准状态', dataIndex: 'bzzt', key: 'bzzt', width: 90 },
  { title: '新增人', dataIndex: 'userName', key: 'userName', width: 120, ...getColumnSelectProps('userName', standardData)  },
  { title: '新增时间', dataIndex: 'isrt_dt', key: 'isrt_dt' },
  { title: '操作', key: 'action', fixed: 'right', width: 120 },
];

const pagination = computed(() => ({
  current: page.value.currentPage,
  pageSize: page.value.pageSize,
  total: page.value.pageCount,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
}));

// 获取文件信息
const fileList = ref<any>({});
const filePath = ref('');

// 搜索接口
const getListData = async () => {
  const data = {
    bz_fl: bzfldh.value || '',
    bzzt: bzzt.value || '',
    keyWord: keyWord.value || '',
    pageNum: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  standardData.value = [];
  const res = await findBzwj(data);
  if (res && res.data.code === '0') {
    standardData.value = res.data.data.bzwjList;
    page.value.currentPage = res.data.data.currentPage;
    page.value.pageCount = res.data.data.pageCount;
  }
};

// 获取标准分类数据
const getTaglist = async () => {
  const res = await findAllBzfl({});
  if (res && res.data.code === '0') {
    standardClassificaData.value = res.data.data;
  }
};

// 标准分类/状态选中后搜索
const tagChangeOne = () => {
  getListData();
};

// 预览文件
const handlePreview = async (_index: number, row: any) => {
  const res = await getFileInfo({ id: row.id });
  fileList.value = {};
  if (res && res.data.code === '0') {
    if (res.data.data.previewFile === true) {
      fileList.value.fileName = res.data.data.bzwj;
      filePath.value = res.data.data.previewFilePath;
      router.push({ path: '/knowledge/pdfView', query: { docId: filePath.value } });
    } else {
      message.error('该文件不支持预览！');
    }
  }
};

// 下载文件
const handleDownFile = async (_index: number, row: any) => {
  const res = await getFileInfo({ id: row.id });
  const name = res.data.data.realFileName;
  window.location.href = baseUrl + '/knowledge-service/tbea/bzw/downloadFile?realFileName=' + name;
};

// 分页/排序变更
const handleTableChange: TableProps['onChange'] = (pag) => {
  page.value.currentPage = pag.current || 1;
  page.value.pageSize = pag.pageSize || 20;
  queryProjectInfoList(page.value.currentPage, page.value.pageSize);
};

// 分页查询
const queryProjectInfoList = async (currentPage: number, pageSize: number) => {
  const data = {
    bz_fl: bzfldh.value || '',
    bzzt: bzzt.value || '',
    keyWord: keyWord.value || '',
    pageNum: currentPage,
    pageSize,
  };
  const res = await findBzwj(data);
  if (res && res.data.code === '0') {
    standardData.value = res.data.data.bzwjList;
    page.value.currentPage = res.data.data.currentPage;
    page.value.pageCount = res.data.data.pageCount;
  }
};

onMounted(() => {
  getTaglist();
  getListData();
});

</script>

<style lang="less" scoped>
.layout {
  display: flex;
}

.elMain {
  padding: 0;
  display: flex;
  flex-direction: column;

  .top-header {
    position: relative;
    background: #ffffff;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-shrink: 0;

    .second {
      position: relative;
    }

    .search-wrap {
      display: inline-block;
      width: 340px;
      height: 28px;
      position: absolute;
      margin-top: 0;
      text-align: center;
      right: 20px;

    }

    .standard_classification {
      min-height: 28px;
      max-height: 68px;
      overflow-y: auto;
      margin: 0 20px 0 20px;
      display: flex;
      align-items: flex-start;

      .secondSpan {
        display: inline-block;
        line-height: 28px;
        width: 96px;
        margin-top: 5px;
        color: #333;
        font-weight: 400;
        white-space: nowrap;
      }

      .el-check-tag-wrap {
        margin-right: 20px;
        margin-top: 5px;
      }
    }
  }

  .content {
    flex: 1;
    margin-top: 16px;
    background: #fff;
    padding-bottom: 20px;
  }
}

:deep(.ant-table) {
  font-size: 12px;
  color: #313133;

  .table-striped td {
    background-color: #f7f8fb;
  }
}
</style>
