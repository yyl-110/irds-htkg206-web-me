<script lang="ts" setup>
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import { AdminApiSystemDemandanalyze } from '@/api/tags/demand/管理需求分析';
import type { UnwrapRef } from 'vue';
import { TableColumnType, TableProps, Modal, message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { Uploado_draggerMoreFile } from '@/components/UploadFile';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
const props = defineProps({
  modalVisible: {
    require: false,
    type: Boolean,
  },
  tableData: {
    require: false,
    type: Array,
    default: () => [],
  },
});
const textContent = ref<string>('');
const taskIndex = ref<string>('1');
const loading = ref<boolean>(false);
const demandrow = ref<any>({});
const tabLabelList = reactive([
  {
    label: '市场代表',
    id: '1',
  },
  {
    label: '研发代表',
    id: '2',
  },
]);
const Upgradeform = reactive<any>({
  reason: '',
  ipmtUpConclusion: '',
  ipmtUpRemarks: '',
  reportFileList: [],
  proveFileList: [],
});
const Upgradedetils = reactive<any>({
  reason: '',
  marketLeaderReason: '',
  researchLeaderReason: '',
  marketFileList: [],
  researchFileList: [],
});
const formRef = ref<any>();
const UpgradeDetailsModel = ref<boolean>(false);
const userStore = useUserStore();
const emit = defineEmits(['onClose', 'RefreshtableData']);
// 流程角色定义
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const columns = [
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'index',
    key: 'index',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: center;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: '需求编号',
    align: 'center',
    dataIndex: 'demandNum',
    key: 'demandNum',
  },
  {
    title: '需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
  },
  {
    title: '需求来源',
    align: 'center',
    dataIndex: 'demandSource',
    key: 'demandSource',
  },
  {
    title: '区域市场',
    align: 'center',
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
  },
  {
    title: '细分市场',
    align: 'center',
    dataIndex: 'marketSegment',
    key: 'marketSegment',
  },
  {
    title: '提出人',
    align: 'center',
    dataIndex: 'originaUserName',
    key: 'originaUserName',
  },
  {
    title: '预处理人',
    align: 'center',
    dataIndex: 'originaUserName',
    key: 'originaUserName',
  },
  {
    title: 'RME提交时间',
    align: 'center',
    dataIndex: 'submitTime',
    key: 'submitTime',
  },
  {
    title: '期望反馈时间',
    align: 'center',
    dataIndex: 'feedbackTime',
    key: 'feedbackTime',
  },
  {
    title: '升级详情',
    align: 'center',
    dataIndex: 'UpgradeDetails',
    key: 'UpgradeDetails',
  },
];

const dataSource = ref<any>([]);

function filechange(file: any, type: string) {
  if (type == 'reportFileList') {
    Upgradeform.reportFileList = Upgradeform.reportFileList.filter((item: any) => item.id !== file.id);
  } else {
    Upgradeform.proveFileList = Upgradeform.proveFileList.filter((item: any) => item.id !== file.id);
  }
}

async function customRequest(options: any, type: string) {
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      if (type == 'reportFileList') {
        Upgradeform.reportFileList.push(file);
      } else {
        Upgradeform.proveFileList.push(file);
      }
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

// 提交数据方法
const onSubmitFormData = async (type: string) => {
  await formRef.value?.validate();
  let reportFileIds: any = [];
  let proveFileIds: any = [];
  if (Upgradeform.reportFileList.length > 0) {
    Upgradeform.reportFileList.forEach((item: any) => {
      reportFileIds.push(item.id);
    });
  }
  if (Upgradeform.proveFileList.length > 0) {
    Upgradeform.proveFileList.forEach((item: any) => {
      proveFileIds.push(item.id);
    });
  }
  let data = {
    basicId: demandrow.value.basicId,
    reportFileIds,
    proveFileIds,
    ipmtUpConclusion: Upgradeform.ipmtUpConclusion,
    ipmtUpRemarks: Upgradeform.ipmtUpRemarks,
    saveStatus: 1,
  };
  if (type == 'save') {
    data.saveStatus = 1;
    ipmtDecisionSave(data);
  } else {
    data.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该条数据吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        ipmtDecisionSave(data);
      },
    });
  }
};
async function ipmtDecisionSave(data: any) {
  const res = await AdminApiSystemDemandanalyze.ipmtDecisionSave(data);
  if (res.data.code == 200) {
    emit('RefreshtableData');
    emit('onClose');
    message.success('操作成功');
  }
}
const handleModalAddOrUpdate = async (row: any) => {
  try {
    loading.value = true;
    demandrow.value = row;
    Upgradeform.reportFileList = [];
    Upgradeform.proveFileList = [];
    nextTick(() => {
      formRef.value.resetFields();
    });
    const resDetail = await AdminApiSystemDemandcollect.getInitDemandDetail({ basicId: row.basicId });
    let data: any = resDetail.data;
    if (data.code == 200) {
      dataSource.value[0] = data.data;
    }
    const res = await AdminApiSystemDemandanalyze.ipmtDecisionDetail({ basicId: row.basicId });
    if (res.data.code == 200) {
      let data: any = res.data.data;
      Upgradeform.reportFileList = data.reportFileList || [];
      Upgradeform.proveFileList = data.proveFileList || [];
      Upgradeform.ipmtUpRemarks = data.ipmtUpRemarks || '';
      Upgradeform.ipmtUpConclusion = data.ipmtUpConclusion || '';
      if (Upgradeform.reportFileList.length > 0) {
        Upgradeform.reportFileList.forEach((item: any) => {
          item.id = item.fileId;
          item.name = item.oldFileName;
        });
      }
      if (Upgradeform.proveFileList.length > 0) {
        Upgradeform.proveFileList.forEach((item: any) => {
          item.id = item.fileId;
          item.name = item.oldFileName;
        });
      }
    }
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
};

async function UpgradeDetails() {
  UpgradeDetailsModel.value = true;
  taskIndex.value = '1';
  const res = await AdminApiSystemDemandanalyze.getRatGradeUpDetail({ basicId: demandrow.value.basicId });
  if (res.data.code == 200) {
    let data: any = res.data.data;
    Upgradedetils.marketFileList = data.marketFileList || [];
    Upgradedetils.researchFileList = data.researchFileList || [];
    Upgradedetils.marketLeaderReason = data.marketLeaderReason || '';
    Upgradedetils.researchLeaderReason = data.researchLeaderReason || '';
    // 默认显示第一个市场负责人的原因
    textContent.value = data.marketLeaderReason || '';
    if (Upgradedetils.marketFileList.length > 0) {
      Upgradedetils.marketFileList.forEach((item: any) => {
        item.id = item.fileId;
        item.fileUrl = item.filePath;
      });
    }
    if (Upgradedetils.researchFileList.length > 0) {
      Upgradedetils.researchFileList.forEach((item: any) => {
        item.id = item.fileId;
        item.fileUrl = item.filePath;
      });
    }
  }
}
// tab切换
function getTasks(task: any) {
  taskIndex.value = task;
  textContent.value = task == '1' ? Upgradedetils.marketLeaderReason : Upgradedetils.researchLeaderReason;
}
function FileListMethod() {
  return taskIndex.value == '1' ? Upgradedetils.marketFileList : Upgradedetils.researchFileList;
}

/** onClose */
const handleClose = () => {
  // 通过事件传过去
  emit('onClose');
};
function UpgradeDetailClose() {
  UpgradeDetailsModel.value = false;
}
function linkClick(url: string) {
  window.open(url);
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  const lastDotIndex = row.oldFileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.oldFileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName || row.fileUr;
  } else {
    filePath.value = row.fileUrl;
  }
  powVisible.value = true;
}
function handleClosePowModal() {
  powVisible.value = false;
}

const tabBarStyle = {
  position: 'sticky', // 关键属性：粘滞定位
  top: 0, // 粘住容器顶部
  zIndex: 10, // 避免被内容遮挡
  background: '#fff', // 背景色覆盖下方内容
  width: '100%',
};

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.IPMTDecisionHandling');
}
defineExpose({ handleModalAddOrUpdate });
</script>

<template>
  <div class="IPMTDecisionHandling" v-dragModal>
    <a-modal
      v-model:visible="visible"
      style="width: 90%"
      title="DIPMT决策处理"
      :ok-text="false"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :getContainer="customGetContainer"
      @cancel="handleClose">
      <a-spin :spinning="loading" tip="加载中...">
        <div class="ipmt-decision-container">
          <div class="pagecontent-title">
            <i></i>
            <span>需求信息</span>
          </div>
          <a-table
            style="padding: 0 5px 0 5px"
            row-key="id"
            :pagination="false"
            :columns="columns"
            :data-source="dataSource"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'demandNum'">
                <a @click.stop="UpgradeDetails">{{ record.demandNum }}</a>
              </template>
              <template v-if="column.dataIndex === 'UpgradeDetails'">
                <EpcIcon @click="UpgradeDetails" type="icon-xiangqing" style="font-size: 18px; color: #165dff; cursor: pointer" />
              </template>
            </template>
          </a-table>
          <a-form ref="formRef" :label-col="{ style: { width: '120px' } }" :model="Upgradeform" class="form-container">
            <div class="pagecontent-title">
              <i></i>
              <span>待决策需求汇报材料</span>
            </div>
            <a-form-item label="待决策需求汇报 " name="reportFileList" :rules="{ required: true, trigger: 'blur', message: '请上传待决策需求汇报文件' }">
              <Uploado_draggerMoreFile
                width="50%"
                ref="reportFileList"
                :file-list="Upgradeform.reportFileList"
                @change="filechange($event, 'reportFileList')"
                @custom-request="customRequest($event, 'reportFileList')" />
            </a-form-item>
            <div class="pagecontent-title">
              <i></i>
              <span>IPMT决策结果</span>
            </div>
            <a-form-item label="IPMT决策结论 " name="ipmtUpConclusion" :rules="{ required: true, message: '请填写决策结论' }">
              <a-select allowClear style="width: 50%" v-model:value="Upgradeform.ipmtUpConclusion">
                <a-select-option value="同意发布分析结论">同意发布分析结论</a-select-option>
                <a-select-option value="其他结论">不同意分析结论</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="决策描述 " name="ipmtUpRemarks">
              <a-textarea allowClear style="width: 50%" v-model:value="Upgradeform.ipmtUpRemarks" placeholder="请输入IPMT决策结论详细描述" />
            </a-form-item>
            <a-form-item label="决策证明材料 " name="proveFileList" :rules="{ required: true, trigger: 'blur', message: '请上传决策证明材料文件' }">
              <Uploado_draggerMoreFile
                width="50%"
                ref="proveFileList"
                :file-list="Upgradeform.proveFileList"
                @change="filechange($event, 'proveFileList')"
                @custom-request="customRequest($event, 'proveFileList')" />
            </a-form-item>
          </a-form>
        </div>
      </a-spin>
      <template #footer>
        <a-button @click="onSubmitFormData('save')" type="primary">
          <EpcIcon type="icon-baocun" style="font-size: 15px" />
          保存</a-button
        >
        <a-button @click="onSubmitFormData('submit')" type="primary">
          <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
          提交</a-button
        >
      </template>
    </a-modal>
  </div>
  <a-modal
    v-model:visible="UpgradeDetailsModel"
    style="width: 70%"
    title="升级详情"
    :ok-text="false"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @cancel="UpgradeDetailClose">
    <a-tabs :tabBarStyle="tabBarStyle" v-model:activeKey="taskIndex" @tab-click="getTasks" class="body_box">
      <a-tab-pane v-for="item in tabLabelList" :key="item.id" :tab="item.label" style="border: 0px">
        <a-form ref="formRef1" :model="Upgradeform" class="form-container">
          <a-form-item label="上报原因" name="reason">
            <a-textarea style="width: 80%; margin-left: 15px" disabled v-model:value="textContent" />
          </a-form-item>
          <a-form-item label="附件列表" name="dataUpload">
            <div class="upload-file-wrap">
              <div v-for="(item, index) in FileListMethod()" :key="index">
                <div class="file-list" v-if="item.fileUrl">
                  <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                  <div class="file-dec">
                    <div class="tit">{{ item.oldFileName }}</div>
                    <div class="number">
                      <span>文件类型：{{ item.fileType }}</span>
                      <div class="hover-link" @click="linkClick(item.fileUrl)">链接：{{ item.fileUrl }}</div>
                    </div>
                    <a-button class="elbuttonAn" @click="priview(item)">
                      <EpcIcon type="icon-liulan" style="font-size: 15px" />
                    </a-button>
                    <a-button class="elbutton" v-if="item.id" disabled>
                      <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-form-item>
          <div>
            <p>上报IPMT决策参考：</p>
            <ul>
              <li>(1) 涉及重新产品、关键系统研发、涉及重大变更的需求。</li>
              <li>(2) 涉及三重一大管理范围的需求。</li>
              <li>(3) 按照需求分析打分办法，该需求对应的开发工作量分值<=3分或实现难易程度<=3分的。</li>
              <li>(4) 其他需要上报的需求。</li>
            </ul>
          </div>
        </a-form>
      </a-tab-pane>
    </a-tabs>
    <template #footer>
      <a-button @click="UpgradeDetailClose" type="primary">
        <EpcIcon type="icon-quxiao" style="font-size: 15px" />
        取消</a-button
      >
    </template>
  </a-modal>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
@import '../../../../../../assets/css/designFlow/designFlow.less';
.ipmt-decision-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
.form-container {
  margin-top: 20px;
}
.body_box {
  height: calc(100vh - 350px);
  overflow-y: auto;
  overflow-x: hidden;
}
:deep(.hover-link) {
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出容器部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>
