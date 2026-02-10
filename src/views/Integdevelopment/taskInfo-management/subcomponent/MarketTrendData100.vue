<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { useUserStore } from '@/store/modules/user';
import { generateRandomNumberByTime } from '@/utils/tools';
const { TabPane: ATabPane } = ATabs;
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { downloadFileFromStream } from '@/utils/file.ts';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { UploadFile } from '@/components/UploadFile';
const props = defineProps({
  paramDisabled: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const productInfo = ref<any>({});
const userStore = useUserStore();
const taskId = ref<any>(0);
const planId = ref<any>(0);
const operateFlag = ref<any>('calc(100vh - 380px)');
const tableData = ref<any>([]);
const tableJzData = ref<any>([]);
const columns = ref<any>([
  {
    title: '年份',
    dataIndex: 'years',
    key: 'years',
    width: 100,
    align: 'center',
  },
  {
    title: '市场规模(亿元)',
    dataIndex: 'marketSize',
    key: 'marketSize',
    width: 130,
    align: 'center',
  },
  {
    title: '增长率(%)',
    dataIndex: 'growthRate',
    key: 'growthRate',
    width: 100,
    align: 'center',
  },
  {
    title: '动车组产品占比(%)',
    dataIndex: 'emuScore',
    key: 'emuScore',
    width: 130,
    align: 'center',
  },
  {
    title: '铁路客车产品占比(%)',
    dataIndex: 'busScore',
    key: 'busScore',
    width: 130,
    align: 'center',
  },
  {
    title: '城际列车产品占比(%)',
    dataIndex: 'intercityScore',
    key: 'intercityScore',
    width: 130,
    align: 'center',
  },
  {
    title: '市域列车产品占比(%)',
    dataIndex: 'metropolitanAreaScore',
    key: 'metropolitanAreaScore',
    width: 130,
    align: 'center',
  },
  {
    title: '地铁列车产品占比(%)',
    dataIndex: 'subwayScore',
    key: 'subwayScore',
    width: 130,
    align: 'center',
  },
  {
    title: '有轨电车产品占比(%)',
    dataIndex: 'tramScore',
    key: 'tramScore',
    width: 130,
    align: 'center',
  },
  {
    title: '磁浮列车产品占比(%)',
    dataIndex: 'maglevTrainScore',
    key: 'maglevTrainScore',
    width: 130,
    align: 'center',
  },
  {
    title: '单轨列车产品占比(%)',
    dataIndex: 'monorailTrainScore',
    key: 'monorailTrainScore',
    width: 130,
    align: 'center',
  },
  {
    title: '特种制式列车产品占比(%)',
    dataIndex: 'specialTrainScore',
    key: 'specialTrainScore',
    width: 130,
    align: 'center',
  },
]);

const columnsJz = ref<any>([
  {
    title: '企业名称',
    dataIndex: 'companyName',
    key: 'companyName',
    width: 250,
    align: 'center',
  },
  {
    title: '市场份额(%)',
    dataIndex: 'marketShare',
    key: 'marketShare',
    width: 150,
    align: 'center',
  },
  {
    title: '技术实力(1—10)',
    dataIndex: 'technicalStrength',
    key: 'technicalStrength',
    width: 150,
    align: 'center',
  },
  {
    title: '产品创新(1—10)',
    dataIndex: 'productInnovation',
    key: 'productInnovation',
    width: 150,
    align: 'center',
  },
  {
    title: '成本优势(1—10)',
    dataIndex: 'costAdvantage',
    key: 'costAdvantage',
    width: 150,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 150,
    align: 'center',
    fixed: 'right',
  },
]);

async function initInfo(planTaskInfodata: any) {
  productInfo.value = planTaskInfodata;
  taskId.value = planTaskInfodata.id;
  planId.value = planTaskInfodata.planId;
  tableData.value = [];
  tableJzData.value = [];
  nextTick(() => {
    //查询数据列表
    AdminApiProductPlanTaskDesign.productTaskMarketTrendList({
      taskId: taskId.value,
      planId: planId.value,
    }).then(res => {
      tableData.value = res.data.data;
    });
  });
  nextTick(() => {
    //查询竞争格局数据
    AdminApiProductPlanTaskDesign.productTaskMarketPatternList({
      taskId: taskId.value,
      planId: planId.value,
    }).then(res => {
      tableJzData.value = res.data.data;
    });
  });
}

function addTableRow() {
  tableData.value.push({
    id: generateRandomNumberByTime(),
    years: '',
    marketSize: '',
    growthRate: '',
    emuScore: '',
    busScore: '',
    intercityScore: '',
    metropolitanAreaScore: '',
    subwayScore: '',
    tramScore: '',
    maglevTrainScore: '',
    monorailTrainScore: '',
    specialTrainScore: '',
  });
}

function addJzTableRow() {
  tableJzData.value.push({
    id: generateRandomNumberByTime(),
    companyName: '',
    marketShare: '',
    technicalStrength: '',
    productInnovation: '',
    costAdvantage: '',
  });
}

function tableRowDelete(id: any) {
  //根据ID删除表格中数据
  tableData.value = tableData.value.filter(item => item.id !== id);
}

function tableRowJzDelete(id: any) {
  //根据ID删除表格中数据
  tableJzData.value = tableJzData.value.filter(item => item.id !== id);
}

async function saveTableData() {
  const params = {
    taskId: taskId.value,
    planId: planId.value,
    trendData: tableData.value,
    patternData: tableJzData.value,
  };
  //保存表格数据
  await AdminApiProductPlanTaskDesign.productTaskMarketTrendAndPatternAddOrUpdate(params).then(res => {});
  nextTick(() => {
    initInfo(productInfo.value);
    return true;
  });
}

async function downLoadTemplate(type: any) {
  if (type == 1) {
    let data: any = {};
    data.taskId = taskId.value;
    data.planId = planId.value;
    const res = await AdminApiProductPlanTaskDesign.trendExcelTemplate(data);
    const fileName = '市场趋势模板.xlsx';
    downloadFileFromStream(res, fileName);
  } else {
    let data: any = {};
    data.taskId = taskId.value;
    const res = await AdminApiProductPlanTaskDesign.patternExcelTemplate(data);
    const fileName = '竞争格局模板.xlsx';
    downloadFileFromStream(res, fileName);
  }
}

const openfileUploadModal = ref<boolean>(false);
const uploadFileList = ref<any>([]);
const fileList = ref<any>([]);
const importType = ref<any>('');
async function importExcelModal(type: any) {
  importType.value = type;
  uploadFileList.value = [];
  fileList.value = [];
  openfileUploadModal.value = true;
}

async function handlefileSave() {
  if (uploadFileList.value[0] && uploadFileList.value[0].id) {
    if (importType.value == '1') {
      let data: any = {};
      data.taskId = taskId.value;
      data.planId = planId.value;
      const file = fileList.value[0];
      const res = await AdminApiProductPlanTaskDesign.trendExcelImport({
        file,
        data,
      });
      if (res.data.code == 200) {
        openfileUploadModal.value = false;
        message.success(WeiI18n.t('导入成功').value);
        initInfo(productInfo.value);
      }
    } else {
      let data: any = {};
      data.taskId = taskId.value;
      const file = fileList.value[0];
      const res = await AdminApiProductPlanTaskDesign.patternExcelImport({
        file,
        data,
      });
      if (res.data.code == 200) {
        openfileUploadModal.value = false;
        message.success(WeiI18n.t('导入成功').value);
        initInfo(productInfo.value);
      }
    }
  } else {
    message.info(WeiI18n.t('请上传文件').value);
  }
}

function datafilechange(file: any) {
  uploadFileList.value[0] = file;
}

async function datacustomRequest(options: any) {
  fileList.value[0] = options.file;
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
    });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      uploadFileList.value[0] = file;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

async function exportExcel(type: any) {
  if (type == 1) {
    let data: any = {};
    data.taskId = taskId.value;
    data.planId = planId.value;
    const res = await AdminApiProductPlanTaskDesign.trendExcelExport(data);
    const fileName = '市场趋势数据.xlsx';
    downloadFileFromStream(res, fileName);
  } else {
    let data: any = {};
    data.taskId = taskId.value;
    const res = await AdminApiProductPlanTaskDesign.patternExcelExport(data);
    const fileName = '竞争格局数据.xlsx';
    downloadFileFromStream(res, fileName);
  }
}
// 同步数据
async function synchronizeData() {
  let data = {
    taskId: taskId.value,
    planId: planId.value,
    planName: productInfo.value.nodeName,
  };
  //保存表格数据
  const res = await AdminApiProductPlanTaskDesign.syncList(data);
  if (res.data.code == 200) {
    initInfo(productInfo.value);
    message.success('同步成功');
  }
}

//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 400px)';
  }
);

defineExpose({ initInfo, saveTableData });
</script>

<template>
  <div :style="{ height: operateFlag, overflowY: 'auto' }">
    <div class="content-title">
      <div style="text-align: left">市场数据</div>
      <!--添加按钮-->
      <!-- <a-button @click="addTableRow" type="primary" style="margin-left: 40px" :disabled="paramDisabled">
        <EpcIcon type="icon-tianjia1" style="font-size: 15px" />
        添加</a-button
      > -->
      <a-button type="primary" style="margin-left: 20px" @click="synchronizeData">
        <EpcIcon type="icon-tongbu2" style="font-size: 16px" />
        同步列表数据</a-button
      >
      <a-button @click="downLoadTemplate('1')" type="primary" style="margin-left: 15px">
        <EpcIcon type="icon-xiazaimoban" style="font-size: 15px" />
        下载模板</a-button
      >
      <a-button type="primary" @click="importExcelModal('1')" style="margin-left: 15px" :disabled="paramDisabled">
        <EpcIcon type="icon-mobanxiazai" style="font-size: 15px" />导入</a-button
      >
      <a-button type="primary" @click="exportExcel('1')" style="margin-left: 15px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
    </div>
    <div style="margin-left: 15px; margin-top: -15px">
      <a-table :columns="columns" :data-source="tableData" row-key="id" :pagination="false" :scroll="{ x: 1200 }" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" :disabled="record.type === 1">
              <a-button type="link" danger class="p-0" :disabled="paramDisabled" @click="tableRowDelete(record.id)">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
          </template>
          <template v-else-if="column.dataIndex === 'years' || column.dataIndex === 'marketSize'">
            <!--只能输入数字-->
            <a-input-number v-model:value="record[column.dataIndex]" style="width: 100%" :disabled="paramDisabled" />
          </template>
          <template v-else>
            <a-input-number v-model:value="record[column.dataIndex]" min="0" max="100" style="width: 100%" :disabled="paramDisabled" />
          </template>
        </template>
      </a-table>
    </div>
    <div class="content-title" style="margin-top: 30px">
      <div style="text-align: left">竞争格局数据</div>
      <a-button @click="downLoadTemplate('2')" type="primary" style="margin-left: 20px">
        <EpcIcon type="icon-xiazaimoban" style="font-size: 15px" />
        下载模板</a-button
      >
      <a-button type="primary" @click="importExcelModal('2')" style="margin-left: 15px" :disabled="paramDisabled">
        <EpcIcon type="icon-mobanxiazai" style="font-size: 15px" />导入</a-button
      >
      <a-button type="primary" @click="exportExcel('2')" style="margin-left: 15px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
      <!--添加按钮-->
      <a-button @click="addJzTableRow" type="primary" style="margin-left: 15px" :disabled="paramDisabled">
        <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
        添加</a-button
      >
    </div>
    <div style="margin-left: 15px; margin-top: -15px">
      <a-table :columns="columnsJz" :loading="loading" :data-source="tableJzData" row-key="id" :pagination="false" :scroll="{ x: 1200 }" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" :disabled="paramDisabled">
              <a-button type="link" danger class="p-0" :disabled="paramDisabled" @click="tableRowJzDelete(record.id)">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
          </template>
          <template v-else-if="column.dataIndex === 'companyName'">
            <a-input v-model:value="record[column.dataIndex]" style="width: 100%" :disabled="paramDisabled" />
          </template>
          <template v-else-if="column.dataIndex === 'marketShare'">
            <!--只能输入数字-->
            <a-input-number v-model:value="record[column.dataIndex]" style="width: 100%" min="0" max="100" :disabled="paramDisabled" />
          </template>
          <template v-else>
            <a-input-number v-model:value="record[column.dataIndex]" min="0" max="10" style="width: 100%" :disabled="paramDisabled" />
          </template>
        </template>
      </a-table>
    </div>
    <div style="margin-top: 30px; height: 100px"></div>
  </div>
  <a-modal
    v-model:visible="openfileUploadModal"
    style="width: 40%"
    :title="$t('技术文档与资料上传')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handlefileSave"
    @cancel="openfileUploadModal = false">
    <div style="color: red">温馨提示： 只允许上传xls、xlsx格式文件</div>
    <UploadFile style="margin-top: 10px; color: red" :fileList="uploadFileList" @change="datafilechange" @customRequest="datacustomRequest" />
    <template #footer>
      <a-button type="primary" @click="handlefileSave">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="openfileUploadModal = false">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
//内容标题
.content-title {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  margin-left: 16px;
  i {
    width: 6px;
    height: 20px;
    background: #0d53e2;
    border-radius: 0px 0px 0px 0px;
    margin-right: 8px;
  }
  div {
    height: 20px;
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 16px;
    // color: rgba(0, 0, 0, 0.8);
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input {
  text-align: left;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

:deep(.ant-picker) {
  width: 100%;
  border-radius: 2px;
}

:deep(.ant-table-thead > tr > th) {
  font-weight: 500;
  text-align: center;
  height: 36px;
  padding: 8px;
}

:deep(.ant-table-tbody > tr > td) {
  text-align: center;
  height: 40px;
}

:deep(.ant-table-tbody > tr > td:first-child) {
  font-weight: 500;
}

:deep(.ant-table) {
  margin-bottom: 0;
}
</style>
