<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
const requestParams = reactive(new ModuleTypeRequestDTOModel());
import { useUserStore } from '@/store/modules/user';
import RxImageList from './imageList.vue';
const loading = ref<boolean>(false);
const userStore = useUserStore();
const nodeList = ref<any>([]);
const categoryid = ref('');
const menuId = ref<any>(null);
const emit = defineEmits(['actionNode']);

const globalQueryModalVisible = ref(false);
const globalQueryLoading = ref(false);
const globalQueryList = ref<any[]>([]);
const globalQueryTableScrollY = 420;
const globalQueryTablePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: false,
  showTotal: (total: number) => `共 ${total} 条`,
  locale: {
    items_per_page: '条/页',
    jump_to: '跳至',
    page: '页',
  },
});
const globalQueryColumns = ref<any[]>([
  { title: '模型件号', dataIndex: 'para1', key: 'para1', align: 'center', width: 120, resizable: true },
  { title: '模型编码', dataIndex: 'para2', key: 'para2', align: 'center', width: 120, resizable: true },
  { title: '模型名称', dataIndex: 'para3', key: 'para3', align: 'center', width: 120, resizable: true },
  { title: '模型类型', dataIndex: 'para4', key: 'para4', align: 'center', width: 120, resizable: true },
  { title: '节点名称', dataIndex: 'categoryName', key: 'categoryName', align: 'center', width: 120, resizable: true },
  { title: '模型坐标系', dataIndex: 'para5', key: 'para5', align: 'center', width: 120, resizable: true },
  { title: '英文名称', dataIndex: 'para6', key: 'para6', align: 'center', width: 120, resizable: true },
  { title: '所属分类', dataIndex: 'para8', key: 'para8', align: 'center', width: 120, resizable: true },
  { title: 'CAD计算重量', dataIndex: 'para9', key: 'para9', align: 'center', width: 120, resizable: true },
  {
    title: '状态',
    dataIndex: 'para10',
    key: 'para10',
    customRender: ({ text }: any) => {
      const v = Number(text);
      if (v === 0) return '已发布';
      if (v === 1) return '设计中';
      if (v === 2) return '已停用';
      if (v === 3) return '审核中';
      return text ?? '';
    },
    align: 'center',
    width: 120,
    resizable: true,
  },
  { title: '创建用户', dataIndex: 'creatorName', key: 'creatorName', align: 'center', width: 120, resizable: true },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', align: 'center', width: 120, resizable: true },
]);
const globalQueryTypeOptions = [
  { label: '模糊查询', value: 'fuzzy' },
  { label: '精确查询', value: 'exact' },
];
const globalQueryFieldOptions = ref<any[]>([
  { label: '全部字段', value: '' },
  ...globalQueryColumns.value.filter((c: any) => !['categoryName', 'creatorName'].includes(c.dataIndex)).map((c: any) => ({ label: c.title, value: c.dataIndex })),
]);
const maxGlobalQueryGroups = 3;
const createGlobalQueryGroup = (field = '', queryType = 'fuzzy', keyword = '') => ({
  field,
  queryType,
  keyword,
});
const globalQueryGroups = ref<any[]>([createGlobalQueryGroup('', 'fuzzy', '')]);

//初始化数据
async function infoReload(categoryidStr: string, menuid?: any) {
  try {
    loading.value = true;
    categoryid.value = categoryidStr;
    menuId.value = menuid ?? menuId.value;
    const data: any = {};
    data.id = categoryidStr;
    const res = await AdminApiSystemModule.getCategpryImgListById(data);
    nodeList.value = res.data.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
}

function actionNode(item: any) {
  emit('actionNode', item);
}

async function selectAllModuleInfo() {
  if (!menuId.value) {
    message.warning('当前节点缺少菜单信息，无法全局查询');
    return;
  }
  globalQueryGroups.value = [createGlobalQueryGroup('', 'fuzzy', '')];
  globalQueryModalVisible.value = true;
  await fetchGlobalQueryData(1, globalQueryTablePagination.pageSize);
}

async function fetchGlobalQueryData(pageNo: number, pageSize: number) {
  globalQueryLoading.value = true;
  try {
    const data: any = {};
    data.menuId = menuId.value;
    data.pageNo = pageNo;
    data.pageSize = pageSize;
    const activeConditions = globalQueryGroups.value
      .map((g: any) => ({
        field: g.field ?? '',
        queryType: g.queryType ?? 'fuzzy',
        keyword: String(g.keyword ?? '').trim(),
      }))
      .filter((g: any) => g.keyword);
    data.keyword = activeConditions[0]?.keyword || '';
    data.queryConditionList = activeConditions;

    const res = await AdminApiSystemModule.getLibraryDataFixedColumnsPage(data);
    const resData: any = res?.data?.data ?? {};
    const list: any[] = resData.list || resData.moduleList || resData.records || [];
    globalQueryList.value = list.map((item: any, idx: number) => ({
      ...item,
      _rowKey: String(item?.id ?? item?.ROW_ID ?? item?.para2 ?? item?.para1 ?? `global_${idx}`),
    }));
    globalQueryTablePagination.current = resData.currentPage ?? pageNo;
    globalQueryTablePagination.pageSize = resData.pageSize ?? pageSize;
    globalQueryTablePagination.total = resData.total ?? resData.totalCount ?? resData.totalPage ?? list.length ?? 0;
  } catch (error) {
    console.log(error);
    message.error('全局查询失败');
  } finally {
    globalQueryLoading.value = false;
  }
}

function handleGlobalTableChange(pagination: any) {
  const current = pagination?.current ?? globalQueryTablePagination.current;
  const pageSize = pagination?.pageSize ?? globalQueryTablePagination.pageSize;
  fetchGlobalQueryData(current, pageSize);
}

function addGlobalQueryGroup() {
  if (globalQueryGroups.value.length >= maxGlobalQueryGroups) return;
  globalQueryGroups.value.push(createGlobalQueryGroup('', 'fuzzy', ''));
}

function removeGlobalQueryGroup(index: number) {
  if (globalQueryGroups.value.length <= 1) return;
  globalQueryGroups.value.splice(index, 1);
}

function resetGlobalQueryGroups() {
  globalQueryGroups.value = [createGlobalQueryGroup('', 'fuzzy', '')];
  fetchGlobalQueryData(1, globalQueryTablePagination.pageSize);
}

defineExpose({ infoReload });
</script>

<template>
  <div class="imgList">
    <div class="top-right-actions">
      <a-button type="link" @click="selectAllModuleInfo">全局查询</a-button>
    </div>
    <div v-if="!loading">
      <RxImageList :nodeData="nodeList" @actionNode="actionNode" :countFlag="true" />
    </div>
    <div v-else class="example">
      <a-spin tip="加载中..." />
    </div>
  </div>
  <a-modal
    v-model:visible="globalQueryModalVisible"
    style="width: 80%"
    :title="$t('全局查询')"
    :confirm-loading="globalQueryLoading"
    :mask-closable="false"
    @on-cancel="globalQueryModalVisible = false">
    <div style="margin-bottom: 12px">
      <div v-for="(group, idx) in globalQueryGroups" :key="idx" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 8px">
        <a-select v-model:value="group.field" style="width: 180px" :options="globalQueryFieldOptions" />
        <a-select v-model:value="group.queryType" style="width: 140px" :options="globalQueryTypeOptions" />
        <a-input v-model:value="group.keyword" allowClear placeholder="请输入内容" style="width: 260px" />
        <EpcIcon type="icon-md-add" style="color: #1a71ff; font-size: 18px; cursor: pointer" @click="addGlobalQueryGroup" />
        <EpcIcon v-if="globalQueryGroups.length > 1" type="icon-shanchu2" style="color: #ff4d4f; font-size: 16px; cursor: pointer" @click="removeGlobalQueryGroup(idx)" />
        <span v-if="idx === 0" style="color: #999; font-size: 12px">最多3组条件</span>
      </div>
      <div style="display: flex; gap: 8px; align-items: center">
        <a-button type="primary" :loading="globalQueryLoading" @click="fetchGlobalQueryData(1, globalQueryTablePagination.pageSize)">查询</a-button>
        <a-button @click="resetGlobalQueryGroups">重置</a-button>
      </div>
    </div>

    <a-table
      row-key="_rowKey"
      :columns="globalQueryColumns"
      :data-source="globalQueryList"
      :scroll="{ y: globalQueryTableScrollY }"
      :pagination="globalQueryTablePagination"
      :loading="globalQueryLoading"
      @change="handleGlobalTableChange" />
    <template #footer>
      <a-button type="primary" @click="globalQueryModalVisible = false"> 关闭 </a-button>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
.imgList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 20px;
  background-color: #ffffff;
  width: auto;
  height: calc(100vh - 122px);
  overflow-y: auto;
  position: relative;
}

.top-right-actions {
  position: absolute;
  right: 12px;
  top: 6px;
  z-index: 10;
}

.imgBox {
  width: 231px;
  height: 210px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #eaeaf1;
  margin-left: 16px;
  cursor: pointer;
  margin-bottom: 16px;
}
.imgBox:hover {
  border-color: rgb(13, 83, 226);
  box-shadow: 0 0 5px 2px rgba(13, 83, 226, 0.2);
}
.imgBox:hover .itemBoxTitle {
  color: #0d53e2;
}

.itemBox1 {
  width: 199px;
  height: 142px;
  border-radius: 4px 4px 4px 4px;
  margin: 16px 16px 10px 16px;
}
.itemBox1 img {
  border-radius: 4px 4px 4px 4px;
}

.itemBoxTitle {
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-left: 16px;
}

.itemInfo {
  word-wrap: break-word;
  word-break: break-all;
}
</style>
