<template>
  <div class="gbom-definition">
    <div class="params-toolbar">
      <a-button type="primary" class="ml-2" @click="addGBOMInfo">
        <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
        {{ $t('添加') }}
      </a-button>
      <a-button type="primary" @click="handleUploadFile()" style="margin-left: 12px">
        <EpcIcon type="icon-daoru1" style="font-size: 12px" />
        {{ $t('导入') }}
      </a-button>
    </div>
    <div class="main-content">
      <!-- 左侧内容区域 -->
      <div class="left-content">
        <div class="b-body2">
          <a-table
            :columns="columns"
            row-key="id"
            :locale="locale"
            :data-source="resources"
            @resizeColumn="handleResizeColumn"
            :pagination="false"
            :defaultExpandedRowKeys="defaultExpandedRowKeys"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
            :row-selection="rowSelection"
            :customRow="customRow">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'operation'">
                <a @click="editGBOMParameterInfo(record)">{{ $t('编辑') }}</a>
                <a-divider type="vertical" />
                <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
                  <a-button type="link" danger class="p-0">
                    {{ $t('删除') }}
                  </a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-content">
        <div class="pattern">
          <!-- 市场用户 -->
          <div class="pattern-flow">
            <div class="pattern-flow-title">市场用户</div>
            <div class="pattern-flow-arrow">
              <img style="width: 100%" src="/src/assets/images/arrow.png" alt="箭头" />
            </div>
          </div>

          <!-- 检修运维 -->
          <div class="pattern-flow">
            <div class="pattern-flow-title">检修运维</div>
            <div class="pattern-flow-arrow">
              <img style="width: 100%" src="/src/assets/images/arrow.png" alt="箭头" />
            </div>
          </div>

          <!-- 产线工位 -->
          <div class="pattern-flow">
            <div class="pattern-flow-title">产线工位</div>
            <div class="pattern-flow-arrow">
              <img style="width: 100%" src="/src/assets/images/arrow.png" alt="箭头" />
            </div>
          </div>

          <!-- 车型容器 -->
          <div class="pattern-row">
            <div v-for="(item, index) in seriesData" :key="item.id" class="pattern-col">
              {{ item.name }}
            </div>
          </div>

          <!-- 动车组产品平台 -->
          <div class="pattern-food">{{ partName }}</div>
        </div>
      </div>
    </div>
  </div>

  <addGBOMParameterInfoModule
    ref="updateParameterInfoModuleRef"
    :modal-visible="updateParameterVisible"
    @close="updateParameterVisibleCanel"
    @updateParaneterInfo="updateParaneterInfo" />

  <ImportFile
    :modalVisible="batchflag"
    :fileList="fileList"
    @change="filechange"
    @customRequest="customRequest"
    @templateDownload="templateDownload"
    @importSuccessfulFun="importSuccessfulFun"
    @close="batchflag = false"></ImportFile>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { downloadFileFromStream } from '@/utils/file.ts';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import { ProductPlatformParameterInfoUpdateDTOModel } from '@/api/models/product/ProductPlatformParameterInfoUpdateDTOModel';
import { ProductSeriesParameterInfoRequestDTOModel } from '@/api/models/product/ProductSeriesParameterInfoRequestDTOModel';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import addGBOMParameterInfoModule from './modalComponent/addGBOMParameterInfoModule.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { message } from 'ant-design-vue';
import ImportFile from '@/components/ImportFile/index.vue';
// 组件接收的属性
interface Props {
  currentNodeData?: any;
}
const updateParameterInfoModuleRef = ref<any>(null);

const defaultExpandedRowKeys = ref<any>([]);
const updateParameterVisible = ref<boolean>(false);
const resources = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
const platformParameter = reactive(new ProductPlatformParameterInfoRequestDTOModel());
const seriesParameter = reactive(new ProductSeriesParameterInfoRequestDTOModel());
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
const userStore = useUserStore();
treeRequestParams.userid = userStore.getUser.id;
platformParameter.userid = userStore.getUser.id;
seriesParameter.userid = userStore.getUser.id;
/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const selectedRowkeys = ref<any>([]); // 存储选中行的key
const selectedRowList = ref<ProductPlatformParameterInfoRequestDTOModel[]>([]); // 存储选中行的完整数据
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: 'radio',
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      if (record.id == selectedRowkeys.value[0]) {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
      } else {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
        selectedRowkeys.value.push(record.id);
        selectedRowList.value.push(record);
      }
    },
  };
}
function updateParameterVisibleCanel(record: any) {
  updateParameterVisible.value = false;
}

async function updateParaneterInfo(updatePlatformParameter: any, titleInfo: string) {
  if (titleInfo == '编辑GBOM节点') {
    console.log(updatePlatformParameter);
    const res = await AdminApiSystemProduct.updatePlatformbomGBOM(updatePlatformParameter);
    console.log(res);
    if (res.status == 200) {
      message.success(WeiI18n.t('修改成功').value);
      updateParameterVisible.value = false;
      queryParameterInfoS();
    } else {
      message.error(WeiI18n.t('修改失败').value);
    }
  } else {
    updatePlatformParameter.proId = categoryInfo.value.key;
    updatePlatformParameter.id = selectedRowkeys.value[0];
    updatePlatformParameter.userId = userStore.getUser.id;
    console.log(updatePlatformParameter);
    const res = await AdminApiSystemProduct.addPlatformbomGBOM(updatePlatformParameter);
    console.log(res);
    if (res.status == 200) {
      message.success(WeiI18n.t('添加成功').value);
      updateParameterVisible.value = false;
      queryParameterInfoS();
    } else {
      message.error(WeiI18n.t('添加失败').value);
    }
  }
}

// GBOM定义表格列配置
const columns = ref<TableColumnType<ProductPlatformParameterInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('超级GBOM'),
    dataIndex: 'descript',
    key: 'descript',
    align: 'left',
    resizable: true,
    width: 300,
  },
  {
    title: WeiI18n.$t('构型项名称'),
    dataIndex: 'pdmName',
    key: 'pdmName',
    align: 'left',
    resizable: true,
    width: 180,
  },
  {
    title: WeiI18n.$t('系统分类标识'),
    dataIndex: 'techid',
    key: 'techid',
    align: 'left',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('标记'),
    dataIndex: 'signString',
    key: 'signString',
    align: 'left',
    resizable: true,
    width: 120,
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    width: 160,
  },
  {},
]);
const categoryInfo = ref<any>(null);
const partName = ref<String>('');
const seriesData = ref<any[]>([]); // 存储series数据
async function reloadTableParameter(selectedKeys: any) {
  categoryInfo.value = selectedKeys;
  queryParameterInfoS();
}

async function queryParameterInfoS() {
  if (categoryInfo.value.level == 2) {
    partName.value = categoryInfo.value.partName;
    platformParameter.proId = categoryInfo.value.key;
    const res = await AdminApiSystemProduct.getPlatformbomGBOMTree(platformParameter);
    resources.value = res.data.data || [];
    // defaultExpandedRowKeys.value.push(res.data.data[0].id);
    platformParameter.id = categoryInfo.value.key;
    const resA = await AdminApiSystemProduct.getSeries(platformParameter);
    // 存储series数据
    if (resA.data && resA.data.data) {
      seriesData.value = resA.data.data;
    }
  }
}

function handleResizeColumn(w, col) {
  col.width = w;
}

function addGBOMInfo() {
  updateParameterVisible.value = true;
  updateParameterInfoModuleRef.value?.addParameterInfoData(selectedRowList.value[0]);
}

const batchflag = ref<boolean>(false);
async function handleUploadFile() {
  fileList.value = [];
  batchflag.value = true;
}
/** 文件列表 */
const fileList = ref<any>([]);
async function customRequest(options: any) {
  fileList.value[0] = options.file;
}
function filechange(file: any) {
  console.log('file=', file);
  fileList.value[0] = file;
}

// 下载附件
async function templateDownload() {
  const res = await AdminApiSystemProduct.downloadExcel(platformParameter);
  const fileName = '模块结构树.xlsx';
  downloadFileFromStream(res, fileName);
}

// 导入附件
async function importSuccessfulFun() {
  const res = await AdminApiSystemUploadFile.gBomImportData({
    file: fileList.value[0] as File,
    userId: userStore.getUser.id,
    proId: categoryInfo.value.key,
    id: '',
  });
  batchflag.value = false;
  message.success(WeiI18n.t('导入成功').value);
  queryParameterInfoS();
}

function editGBOMParameterInfo(record) {
  updateParameterVisible.value = true;
  updateParameterInfoModuleRef.value?.editParameterInfoData(record);
}

async function handleDelete(record) {
  platformParameter.ids = [];
  platformParameter.ids.push(record.id);
  const res = await AdminApiSystemProduct.delPlatformbomGBOM(platformParameter);
  if (res.status == 200) {
    message.success(WeiI18n.t('删除成功').value);
    queryParameterInfoS();
  } else {
    message.error(WeiI18n.t('删除失败').value);
  }
}

defineExpose({ reloadTableParameter });
</script>

<style lang="less" scoped>
.gbom-definition {
  height: 100%;
}

.main-content {
  display: flex;
  height: 100%;
}

.left-content {
  flex: 1;
  overflow: auto;
}

.right-content {
  width: 30%;
  padding: 16px;
  height: calc(100vh - 230px);
}

.pattern {
  width: 100%;
  height: 100%;
  background-color: lawngreen;
  margin-left: 50%;
  transform: translateX(-50%);
  overflow: auto;
  overflow-x: hidden;
}

.pattern-flow {
  width: 260px;
  height: 100px;
  margin-top: 10px;
  margin-left: 50%;
  transform: translateX(-50%);
}

.pattern-flow-title {
  width: 100%;
  height: 60px;
  font-size: 30px;
  text-align: center;
  font-weight: 600;
  line-height: 60px;
  background-color: #f5f7fa;
  color: black;
}

.pattern-flow-arrow {
  width: 100px;
  margin-left: 50%;
  transform: translateX(-50%);
}

.pattern-row {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.pattern-col {
  padding: 5px;
  width: 32px;
  height: auto;
  background-color: #1971ff;
  color: #fff;
  font-size: 16px;
  text-align: left;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 4px;
}

.pattern-col::-webkit-scrollbar {
  width: 0;
  background-color: transparent;
}

.pattern-food {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  text-align: center;
  background: burlywood;
  margin-top: 10px;
  color: white;
}

.params-toolbar {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

/* 确保表格区域有足够高度 */
.ant-table-wrapper {
  min-height: 400px;
}
.b-body2 {
  height: calc(100vh - 320px);
  overflow: auto;
  margin-top: 20px;
}

/* 调整排序按钮位置，使其紧挨着列头文本 */
.ant-table-thead > tr > th .ant-table-column-title {
  display: inline-block;
  margin-right: -2px !important; /* 使用负边距确保完全紧贴 */
  padding-right: 0 !important;
}

.ant-table-thead > tr > th .ant-table-column-sorter {
  display: inline-block;
  margin-left: -2px !important; /* 使用负边距确保完全紧贴 */
  padding-left: 0 !important;
  vertical-align: middle !important;
}

/* 确保表头整体元素紧凑排列 */
.ant-table-thead > tr > th .ant-table-cell-inner {
  display: flex !important;
  align-items: center !important;
  gap: 0 !important;
  justify-content: flex-start !important;
}

/* 覆盖可能存在的默认样式 */
.ant-table-thead > tr > th {
  white-space: nowrap;
}

/* 针对特定列的样式，确保排序按钮紧贴 */
.ant-table-thead > tr > th .ant-table-cell {
  padding: 16px 8px !important;
}
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}
:deep(.ant-table-column-title) {
  flex: none;
}
</style>
