<script lang="ts" setup>
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import { AdminApiSystemDemandanalyze } from '@/api/tags/demand/管理需求分析';
import type { UnwrapRef } from 'vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { TableColumnType, TableProps, Modal, message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import AnalyzeProductPackage from '@/views/Integdevelopment/demand-management/requirementsanalysis/components/form/demand-add-update.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
const props = defineProps({
  modalVisible: {
    require: false,
    type: Boolean,
  },
  basicId: {
    require: true,
    type: String,
    default: () => '',
  },
});
const Upgradeform = reactive({
  reason: '',
  dataUpload: [],
});
// 市场代表
const marketLeaderflag = ref<boolean>(false);
// 研发代表
const researchLeaderflag = ref<boolean>(false);
const DecisionAnalysisRef = ref<any>();
const ProductPackage = ref<boolean>(false);
const Detailsflag = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const dataUpload = ref<any>([]); //项目资料上传文件
const Upgradeflag = ref<boolean>(false);
const loading = ref<boolean>(false);
const userStore = useUserStore();
const demandrow = ref<any>({});
const formRef = ref<any>();
const emit = defineEmits(['close', 'refreshTableData']);
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
// 市场代表可操作列
const marketLeaderList = ref(['importance', 'projectScale', 'marketImpact', 'universalApplicability']);
const columns = [
  {
    title: '需求编号/排序维度',
    dataIndex: 'demandNum',
    width: 160,
  },
  {
    title: '客户重要程度',
    dataIndex: 'importance',
    width: 180,
  },
  {
    title: '销售项目规模',
    dataIndex: 'projectScale',
    width: 180,
  },
  {
    title: '对市场格局与竞争的影响',
    dataIndex: 'marketImpact',
    width: 200,
  },
  {
    title: '需求的普遍适用性',
    dataIndex: 'universalApplicability',
    width: 280,
  },
  {
    title: '开发工作量',
    dataIndex: 'workload',
    width: 180,
  },
  {
    title: '实现难易程度',
    dataIndex: 'difficultyLevel',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 250,
    scopedSlots: { customRender: 'operation' },
  },
];
const ConclusioneData = ref<any>([
  {
    demandNum: '',
    importance: '',
    projectScale: '',
    marketImpact: '',
    universalApplicability: '0',
    workload: '',
    difficultyLevel: '',
  },
]);
const scoreColumns = ref([
  {
    title: '排序维度',
    dataIndex: 'Sortingdimension',
    width: 120,
  },
  {
    title: '客户重要程度',
    dataIndex: 'importance',
    width: 180,
    customRender: ({ text }) => {
      return LineWrappingMethod(text);
    },
  },
  {
    title: '销售项目规模',
    dataIndex: 'projectScale',
    width: 180,
    customRender: ({ text }) => {
      return LineWrappingMethod(text);
    },
  },
  {
    title: '对市场格局与竞争的影响',
    dataIndex: 'marketImpact',
    width: 230,
    customRender: ({ text }) => {
      return LineWrappingMethod(text);
    },
  },
  {
    title: '需求的普遍适用性',
    dataIndex: 'universalApplicability',
    width: 250,
    customRender: ({ text }) => {
      return LineWrappingMethod(text);
    },
  },
  {
    title: '开发工作量',
    dataIndex: 'workload',
    width: 180,
    customRender: ({ text }) => {
      return LineWrappingMethod(text);
    },
  },
  {
    title: '实现难易程度',
    dataIndex: 'difficultyLevel',
    width: 180,
    customRender: ({ text }) => {
      return LineWrappingMethod(text);
    },
  },
]);
function LineWrappingMethod(text: string) {
  // 将文本按 ; 拆分后用 <br> 拼接
  return text ? text.replace(/；/g, '；\n') : '';
}

const scoreData = [
  {
    Sortingdimension: '评分细则',
    importance: '核心战略客户评分为5分；战略客户评分为4分；重要客户评分为3分；普通客户评分为2分；其他客户为1分',
    projectScale: '大于5亿元项目为5分；小于1亿元项目为1分；介于二者之间按线性打分。',
    marketImpact: '对于市场突破类为5分；能够长期改进竞争格局的为3分；对格局无明显影响的为1分。',
    universalApplicability: '全球客户普遍适用为5分；对同一地区或部分客户有价值为3分；无推广价值为0分。',
    workload: '研发团队大于60人为1分；研发团队小于5人为5分；介于二者之间按线性打分。',
    difficultyLevel: '研发周期超过3年为1分；研发周期小于半年为5分；介于二者之间按线性打分。',
  },
];

const upgrade = async (record: any) => {
  Upgradeflag.value = true;
  Upgradeform.dataUpload = [];
  nextTick(() => {
    formRef.value.resetFields();
  });
  const res = await AdminApiSystemDemandanalyze.getRatGradeUpDetail({ basicId: props.basicId });
  if (res.data.code == 200) {
    let data: any = res.data.data;
    Upgradeform.reason = marketLeaderflag.value ? data.marketLeaderReason : data.researchLeaderReason;
    Upgradeform.dataUpload = marketLeaderflag.value ? data.marketFileList : data.researchFileList;
    if (Upgradeform.dataUpload.length > 0) {
      Upgradeform.dataUpload.forEach((item: any) => {
        item.id = item.fileId;
        item.fileUrl = item.filePath;
      });
    }
  }
};
async function onSubmitIPMTFormData(type: string) {
  await formRef.value?.validate();
  let fileIds: any = [];
  if (Upgradeform.dataUpload.length > 0) {
    Upgradeform.dataUpload.forEach((item: any) => {
      fileIds.push(item.id);
    });
  }
  let data = {
    basicId: props.basicId,
    reason: Upgradeform.reason,
    fileIds,
    saveStatus: 1,
  };
  if (type == 'save') {
    data.saveStatus = 1;
    ratGradeUp(data);
  } else {
    data.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该条数据吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        ratGradeUp(data);
        Detailsflag.value = true;
        emit('refreshTableData');
      },
    });
  }
}
async function ratGradeUp(data: any) {
  const res = await AdminApiSystemDemandanalyze.ratGradeUp(data);
  if (res.data.code == 200) {
    message.success('操作成功');
    Upgradeflag.value = false;
  }
}

function ViewinitialDetails(record: any) {
  ProductPackage.value = true;
  nextTick(() => {
    DecisionAnalysisRef.value.handleModalAddOrUpdate(demandrow.value, 'detail');
  });
}

const ViewDetails = async (row: any, type: string) => {
  demandrow.value = row;
  ConclusioneData.value = [
    {
      demandNum: row.demandNum,
      importance: '',
      projectScale: '',
      marketImpact: '',
      universalApplicability: '0',
      workload: '',
      difficultyLevel: '',
    },
  ];
  const res = await AdminApiSystemDemandanalyze.getRatGradeInfo({ basicId: row.basicId });
  if (res.data.code == 200) {
    let data: any = res.data.data;
    if (data.marketLeaderId == userStore.getUser.id) {
      marketLeaderflag.value = true;
    } else {
      marketLeaderflag.value = false;
    }
    if (data.researchLeaderId == userStore.getUser.id) {
      researchLeaderflag.value = true;
    } else {
      researchLeaderflag.value = false;
    }
    ConclusioneData.value[0] = { ...data };
    // 需求的普遍适用性列默认是0分
    if (
      ConclusioneData.value[0].universalApplicability == '' ||
      ConclusioneData.value[0].universalApplicability == null ||
      ConclusioneData.value[0].universalApplicability == undefined
    ) {
      ConclusioneData.value[0].universalApplicability = '0';
    }
    if (type == 'detail') {
      Detailsflag.value = true;
    } else {
      Detailsflag.value = false;
    }
  }
};
// 提交数据方法
const onSubmitFormData = async (type: string) => {
  let data = {
    basicId: props.basicId,
    importance: ConclusioneData.value[0].importance,
    projectScale: ConclusioneData.value[0].projectScale,
    marketImpact: ConclusioneData.value[0].marketImpact,
    universalApplicability: ConclusioneData.value[0].universalApplicability,
    workload: ConclusioneData.value[0].workload,
    difficultyLevel: ConclusioneData.value[0].difficultyLevel,
    saveStatus: 1,
  };
  if (type == 'save') {
    data.saveStatus = 1;
    if (demandrow.value.processStatus == '待办') {
      await ChangeTaskStatus(demandrow.value);
    }
    saveRatGradeInfo(data);
  } else {
    data.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该条数据吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        saveRatGradeInfo(data);
      },
    });
  }
};
async function saveRatGradeInfo(data: any) {
  const res = await AdminApiSystemDemandanalyze.saveRatGradeInfo(data);
  if (res.data.code == 200) {
    message.success('操作成功');
    emit('refreshTableData');
    if (data.saveStatus == 2) {
      emit('close');
    }
  }
}
async function ChangeTaskStatus(record: any) {
  const res = await AdminApiSystemProcessTask.updateStatus({ id: record.id, processStatus: getTaskStatusLabel(TaskStatus.IN_PROGRESS) });
}
/** close */
const handleClose = () => {
  // 通过事件传过去
  emit('close');
};
function UpgradehandleClose() {
  Upgradeflag.value = false;
}
function toUpload() {
  nextTick(() => {
    let targetBtn: any = document.getElementById('targetBtn');
    targetBtn.click();
  });
}
function linkClick(url: string) {
  window.open(url);
}
function detaDataUpload(row: any) {
  Upgradeform.dataUpload = Upgradeform.dataUpload.filter((item: any) => item.id !== row.id);
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  console.log(row);
  const lastDotIndex = row.oldFileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.oldFileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName || row.fileUrl;
  } else {
    filePath.value = row.fileUrl;
  }
  powVisible.value = true;
}
function handleClosePowModal() {
  powVisible.value = false;
}
/**
 * before upload file
 * @param file file
 */
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 300;
  if (!imgSize) message.warn(`上传文件大小不能超过 300M！`);
  return imgSize;
};
/**
 * custom request
 * @param options options
 */
async function customRequest(options: any) {
  // 调用上传接口
  try {
    loading.value = true;
    const res = await AdminApiSystemUploadFile.uploadFile({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data };
      Upgradeform.dataUpload.push(file);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

// ---------------------对市场格局与竞争的影响---------------------
// 允许的评分值（固定为 0/3/5）
const ALLOWED_RATES = [1, 3, 5] as const;
/**
 * 处理评分确认事件：将用户选择修正为允许值
 * @param value 用户点击的原始分数（1-5）
 */
const handleRateChange = (value: number, row: any) => {
  // 找到与用户选择最接近的允许值（0/3/5）
  const closestRate = findClosestAllowedRate(value);
  row.marketImpact = closestRate;
  // 非允许值时提示用户（可选）
  if (!ALLOWED_RATES.includes(value as any)) {
    message.warning(`当前单元格只能打1-3-5分,已自动修正为最近的允许评分：${closestRate}星`);
  }
};

/**
 * 辅助函数：找到与目标值最接近的允许评分（0/3/5）
 * @param target 目标分数（用户选择或预览的值）
 */
const findClosestAllowedRate = (target: number): (typeof ALLOWED_RATES)[number] => {
  return ALLOWED_RATES.reduce((prev, curr) => {
    return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
  });
};
// ---------------------需求的普遍适用性---------------------
// 允许的评分值（固定为 0/3/5）
const ALLOWED_RATES1 = [0, 3, 5] as const;
/**
 * 处理评分确认事件：将用户选择修正为允许值
 * @param value 用户点击的原始分数（1-5）
 */
const handleRateChange1 = (value: number, row: any) => {
  // 找到与用户选择最接近的允许值（0/3/5）
  const closestRate = findClosestAllowedRate1(value);
  row.universalApplicability = closestRate;
  // 非允许值时提示用户（可选）
  if (!ALLOWED_RATES1.includes(value as any)) {
    message.warning(`当前单元格只能打0-3-5分,已自动修正为最近的允许评分：${closestRate}星`);
  }
};

/**
 * 辅助函数：找到与目标值最接近的允许评分（0/3/5）
 * @param target 目标分数（用户选择或预览的值）
 */
const findClosestAllowedRate1 = (target: number): (typeof ALLOWED_RATES1)[number] => {
  return ALLOWED_RATES1.reduce((prev, curr) => {
    return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
  });
};
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Scoringpop-up');
}
defineExpose({
  ViewDetails,
});
</script>

<template>
  <div class="Scoringpop-up" v-dragModal>
    <a-modal
      v-model:visible="visible"
      style="width: 95%"
      :title="Detailsflag ? $t('决策分析详情') : '决策分析'"
      :ok-text="false"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :getContainer="customGetContainer"
      @cancel="handleClose">
      <div class="decision-analysis-container">
        <!-- 需求信息部分 -->
        <a-card class="requirement-card">
          <div class="pagecontent-title">
            <i></i>
            <span>RAT结论</span>
          </div>
          <a-table
            row-key="id"
            :scroll="{ x: 1350 }"
            :pagination="false"
            :columns="columns"
            :data-source="ConclusioneData"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'demandNum'">
                <a @click.stop="ViewinitialDetails(record)">{{ record.demandNum }}</a>
              </template>
              <template v-else-if="column.dataIndex === 'operation'">
                <a-button shape="circle" type="link" :disabled="Detailsflag" @click="onSubmitFormData('save')">保存</a-button>
                <a-divider type="vertical" />
                <a-button shape="circle" type="link" :disabled="Detailsflag" @click="onSubmitFormData('submit')">提交</a-button>
                <a-divider type="vertical" />
                <a-button shape="circle" type="link" :disabled="Detailsflag" @click="upgrade(record)">升级</a-button>
                <a-divider type="vertical" />
                <a-button shape="circle" type="link" @click="ViewinitialDetails(record)">详情</a-button>
              </template>
              <template v-else>
                <div v-if="marketLeaderList.includes(column.dataIndex)">
                  <div v-if="marketLeaderflag">
                    {{ record[column.dataIndex] }}
                    <!-- 对市场格局与竞争的影响 -->
                    <a-rate
                      v-if="column.dataIndex === 'marketImpact'"
                      :allow-half="false"
                      :count="5"
                      :disabled="Detailsflag"
                      @change="handleRateChange($event, record)"
                      v-model:value="record[column.dataIndex]" />
                    <!-- /需求的普遍适用性的打分 -->
                    <a-rate
                      v-else-if="column.dataIndex === 'universalApplicability'"
                      :allow-half="false"
                      :count="5"
                      :disabled="Detailsflag"
                      @change="handleRateChange1($event, record)"
                      v-model:value="record[column.dataIndex]" />
                    <a-rate v-else :disabled="Detailsflag" :allow-half="false" :count="5" v-model:value="record[column.dataIndex]" />
                  </div>
                  <div v-else>
                    {{ '暂无权限查看' }}
                  </div>
                </div>
                <div v-else>
                  <div v-if="researchLeaderflag">
                    {{ record[column.dataIndex] }}
                    <a-rate :disabled="Detailsflag" v-model:value="record[column.dataIndex]" />
                  </div>

                  <div v-else>
                    {{ '暂无权限查看' }}
                  </div>
                </div>
              </template>
            </template>
          </a-table>
        </a-card>
        <!-- 流程人员选取部分 -->
        <a-card class="personnel-selection-card">
          <div class="pagecontent-title">
            <i></i>
            <span>打分量纲及建议打分原则（参考）</span>
          </div>
          <a-table
            row-key="id"
            :scroll="{ x: 1200 }"
            :pagination="false"
            :columns="scoreColumns"
            :data-source="scoreData"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }"> </template>
          </a-table>
        </a-card>
      </div>
      <template #footer>
        <a-button @click="handleClose" type="primary"> <EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
      </template>
    </a-modal>
    <a-modal
      v-model:visible="Upgradeflag"
      style="width: 80%"
      :title="'上报至IPMT决策'"
      :ok-text="false"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :getContainer="customGetContainer"
      @cancel="UpgradehandleClose">
      <a-spin :spinning="loading" tip="加载中...">
        <a-form ref="formRef" :model="Upgradeform" class="form-container">
          <a-form-item label="上报原因" name="reason" :rules="{ required: true, message: '请填写上报IPMT决策原因' }">
            <a-textarea style="width: 80%; margin-left: 15px" v-model:value="Upgradeform.reason" placeholder="请填写上报IPMT决策原因" />
          </a-form-item>
          <a-form-item label="上传附件" name="dataUpload" style="margin-left: 10px">
            <div class="upload-layout">
              <div class="upload-btn-wrap">
                <div class="upload-btn" :disabled="isEdit" @click="toUpload()" :style="{ cursor: isEdit ? 'not-allowed' : 'pointer', background: isEdit ? '#f5f5f5' : '' }">
                  <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 20px; position: absolute; left: 35px; top: 20px" />
                  <div>上传文件</div>
                </div>
                <div class="upload-dec">
                  <div>文件要求</div>
                  <p>格式：支持格式为PDF、Word、Excel...文档</p>
                  <p>文件大小限制：对单个文件大小有限制，每个文档不超过100M</p>
                </div>
              </div>
            </div>
            <div class="upload-file-wrap">
              <div v-for="(item, index) in Upgradeform.dataUpload" :key="index">
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
                    <a-button class="elbutton" v-if="item.id" :disabled="isEdit" @click="detaDataUpload(item)">
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
      </a-spin>
      <template #footer>
        <a-button @click="onSubmitIPMTFormData('save')" type="primary">
          <EpcIcon type="icon-baocun" style="font-size: 15px" />
          保存</a-button
        >
        <a-button @click="onSubmitIPMTFormData('submit')" type="primary">
          <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
          提交</a-button
        >
      </template>
    </a-modal>
    <a-upload v-model:file-list="dataUpload" class="avatar-uploader" :with-credentials="true" :before-upload="beforeUpload" :custom-request="customRequest">
      <a-button type="primary" id="targetBtn" style="display: none">选择文件</a-button>
    </a-upload>
  </div>
  <AnalyzeProductPackage ref="DecisionAnalysisRef" :modalVisible="ProductPackage" @onClose="ProductPackage = false"></AnalyzeProductPackage>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
@import '../../../../assets/css/designFlow/designFlow.less';
.form-container {
  height: calc(100vh - 300px);
  overflow-y: auto;
  overflow-x: hidden;
}
.decision-analysis-container {
  padding: 20px;
}
.requirement-card {
  margin-bottom: 20px;
}
.personnel-selection-card {
  margin-bottom: 20px;
}
/* 针对表格单元格生效 */
:deep(.ant-table .ant-table-cell) {
  white-space: pre-line !important; /* 保留换行符并自动换行 */
}
:deep(.hover-link) {
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出容器部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>
