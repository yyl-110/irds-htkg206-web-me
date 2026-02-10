<script lang="ts" setup>
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import { AdminApiSystemDemandanalyze } from '@/api/tags/demand/管理需求分析';
import type { UnwrapRef } from 'vue';
import { TableColumnType, TableProps, Modal, message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import AnalyzeProductPackage from '../form/demand-add-update.vue';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import Empty from '@/components/Empty/index.vue';
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
const ProductPackage = ref<boolean>(false);
const DecisionAnalysisRef = ref<any>();
const loading = ref<boolean>(false);
const filevisible = ref<boolean>(false);
const demandrow = ref<any>({});
const ipmtUpConclusionFileList = ref<any>([]);
const userStore = useUserStore();
const emit = defineEmits(['onClose', 'RefreshtableData']);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { marginTop: '10px' },
  }),
});
// 流程角色定义
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const Ratcolumns = [
  {
    title: '需求编号/排序维度',
    align: 'center',
    dataIndex: 'demandNum',
    key: 'demandNum',
    width: 160,
  },
  {
    title: '客户重要程度',
    dataIndex: 'importance',
    key: 'importance',
    align: 'center',
    width: 150,
  },
  {
    title: '销售项目规模',
    dataIndex: 'projectScale',
    key: 'projectScale',
    align: 'center',
    width: 150,
  },
  {
    title: '对市场格局与竞争的影响',
    dataIndex: 'marketImpact',
    key: 'marketImpact',
    align: 'center',
    width: 220,
  },
  {
    title: '需求的普遍适用性',
    dataIndex: 'universalApplicability',
    key: 'universalApplicability',
    align: 'center',
    width: 150,
  },
  {
    title: '开发工作量',
    dataIndex: 'workload',
    key: 'workload',
    align: 'center',
    width: 120,
  },
  {
    title: '实现难易程度',
    dataIndex: 'difficultyLevel',
    key: 'difficultyLevel',
    align: 'center',
    width: 120,
  },
  {
    title: '评分总和',
    dataIndex: 'sum',
    key: 'sum',
    align: 'center',
    width: 120,
  },
  {
    title: '分析结论',
    dataIndex: 'decisionConclusion',
    key: 'decisionConclusion',
    align: 'center',
    width: 150,
  },
  {
    title: '结论描述',
    dataIndex: 'decisionConclusionDescription',
    key: 'decisionConclusionDescription',
    align: 'center',
    width: 220,
  },
];
const dataSource = ref<any>([]);
const Ipmtcolumns = [
  {
    title: '需求编号',
    dataIndex: 'demandNum',
    key: 'demandNum',
    align: 'center',
    width: 150,
  },
  {
    title: '初始需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    align: 'center',
    width: 240,
  },
  {
    title: 'IPMT决策结论',
    dataIndex: 'ipmtUpConclusion',
    key: 'ipmtUpConclusion',
    align: 'center',
    width: 180,
  },
  {
    title: 'IPMT决策描述',
    dataIndex: 'ipmtUpRemarks',
    key: 'ipmtUpRemarks',
    align: 'center',
    width: 200,
  },
  {
    title: 'IPMT决策证明材料（如有）',
    dataIndex: 'ipmtUpConclusionFileList',
    key: 'ipmtUpConclusionFileList',
    align: 'center',
    width: 200,
  },
  {
    title: '分析结论',
    dataIndex: 'decisionConclusion',
    key: 'decisionConclusion',
    align: 'center',
    width: 180,
  },
  {
    title: '结论描述',
    dataIndex: 'decisionConclusionDescription',
    key: 'decisionConclusionDescription',
    align: 'center',
    width: 220,
  },
];
const IpmtdataSource = ref<any>([]);
const upgradeAnalysisConclusionList = [
  {
    label: '纳入技术规划',
    value: '纳入技术规划',
  },
  {
    label: '纳入产品规划',
    value: '纳入产品规划',
  },
  {
    label: '纳入Charter',
    value: '纳入Charter',
  },
  {
    label: '纳入现有产品开发',
    value: '纳入现有产品开发',
  },
  {
    label: '纳入DFX',
    value: '纳入DFX',
  },
];
function ConditionList(row: any) {
  let arr = [];
  if (row.periodicAttribute == '1') {
    arr = [
      {
        label: '纳入技术规划',
        value: '纳入技术规划',
      },
      {
        label: '纳入现有产品开发',
        value: '纳入现有产品开发',
      },
      {
        label: '纳入DFX',
        value: '纳入DFX',
      },
      {
        label: '拒绝',
        value: '拒绝',
      },
    ];
  } else if (row.periodicAttribute == '2') {
    arr = [
      {
        label: '纳入技术规划',
        value: '纳入技术规划',
      },
      {
        label: '纳入Charter',
        value: '纳入Charter',
      },
      {
        label: '纳入DFX',
        value: '纳入DFX',
      },
      {
        label: '拒绝',
        value: '拒绝',
      },
    ];
  } else {
    arr = [
      {
        label: '纳入技术规划',
        value: '纳入技术规划',
      },
      {
        label: '纳入产品规划',
        value: '纳入产品规划',
      },
      {
        label: '纳入DFX',
        value: '纳入DFX',
      },
      {
        label: '拒绝',
        value: '拒绝',
      },
    ];
  }
  return arr;
}
const handleModalAddOrUpdate = async (row: any, type: string) => {
  try {
    loading.value = true;
    demandrow.value = row;
    dataSource.value = [];
    IpmtdataSource.value = [];
    let basicIds = [];
    if (type == 'single') {
      basicIds.push(row.basicId);
    } else {
      row.forEach((item: any) => {
        basicIds.push(item);
      });
    }
    const res = await AdminApiSystemDemandanalyze.remDecisionList({ basicIds });
    if (res.data.code == 200) {
      let data: any = res.data.data;
      if (data.length > 0) {
        data.forEach((item: any) => {
          if (item.upFlag) {
            IpmtdataSource.value.push(item);
          } else {
            dataSource.value.push(item);
          }
        });
      }
    }
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
};
interface IpmtdataSource {
  basicId: string;
  decisionConclusion: string;
  decisionConclusionDescription: string;
}
// 提交数据方法
const onSubmitFormData = async (type: string) => {
  let merged = [...dataSource.value, ...IpmtdataSource.value];
  let flag = false;
  merged.forEach((item: any) => {
    if (item.decisionConclusion == '' || item.decisionConclusion == undefined || item.decisionConclusion == null) {
      message.error('请选择分析结论');
      flag = true;
    }
    // if (item.decisionConclusionDescription == '' || item.decisionConclusionDescription == undefined || item.decisionConclusionDescription == null) {
    //   message.error('请填写结论描述');
    //   flag = true;
    // }
  });
  if (flag) return;
  let conclusionList: IpmtdataSource[] = [];
  if (merged.length > 0) {
    merged.forEach((item: any) => {
      conclusionList.push({
        basicId: item.basicId,
        decisionConclusion: item.decisionConclusion,
        decisionConclusionDescription: item.decisionConclusionDescription,
      });
    });
  }
  let data = {
    saveStatus: 1,
    conclusionList,
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
  const res = await AdminApiSystemDemandanalyze.remDecisionConclusionSaveBach(data);
  if (res.data.code == 200) {
    emit('RefreshtableData');
    emit('onClose');
    message.success('操作成功');
  }
}

async function ViewinitialDetails() {
  ProductPackage.value = true;
  nextTick(() => {
    DecisionAnalysisRef.value.handleModalAddOrUpdate(demandrow.value, 'detail-IPMT');
  });
}

/** onClose */
const handleClose = () => {
  // 通过事件传过去
  emit('onClose');
};
function Morefiles(record: any) {
  filevisible.value = true;
  ipmtUpConclusionFileList.value = record.ipmtUpConclusionFileList;
}
function handlfileeClose() {
  filevisible.value = false;
}
function linkClick(url: string) {
  window.open(url);
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.DecisionConclusion');
}
const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
function handleClosePowModal() {
  powVisible.value = false;
}
async function priview(row: any) {
  console.log(row);
  const lastDotIndex = row.oldFileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.oldFileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf' || fileType.value == '.pptx') {
    filePath.value = row.pdfFileName || row.fileUr;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}
defineExpose({ handleModalAddOrUpdate });
</script>

<template>
  <div class="DecisionConclusion" v-dragModal>
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
            <span>RAT结论</span>
          </div>
          <a-table
            style="padding: 0 5px 0 5px"
            row-key="id"
            :locale="locale"
            :scroll="{ x: 1800 }"
            :pagination="false"
            :columns="Ratcolumns"
            :data-source="dataSource"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'demandNum'">
                <a @click.stop="ViewinitialDetails">{{ record.demandNum }}</a>
              </template>
              <template v-if="column.dataIndex === 'decisionConclusion'">
                <a-select allowClear style="width: 160px" v-model:value="record.decisionConclusion" placeholder="请选择分析结论">
                  <a-select-option v-for="item in ConditionList(record)" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template v-if="column.dataIndex === 'decisionConclusionDescription'">
                <a-textarea allowClear style="width: 200px" v-model:value="record.decisionConclusionDescription" :rows="1" placeholder="请输入结论描述" />
              </template>
            </template>
          </a-table>
          <div class="pagecontent-title">
            <i></i>
            <span>IPMT决策结论</span>
          </div>
          <a-table
            style="padding: 0 5px 0 5px"
            row-key="id"
            :locale="locale"
            :pagination="false"
            :columns="Ipmtcolumns"
            :data-source="IpmtdataSource"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'demandNum'">
                <a @click.stop="ViewinitialDetails">{{ record.demandNum }}</a>
              </template>
              <template v-if="column.dataIndex === 'ipmtUpConclusionFileList'">
                <a v-if="record.ipmtUpConclusionFileList.length > 0" @click.stop="Morefiles(record)">查看文件列表</a>
              </template>
              <template v-if="column.dataIndex === 'decisionConclusion'">
                <a-select allowClear style="width: 160px" v-model:value="record.decisionConclusion" placeholder="请选择分析结论">
                  <a-select-option v-for="item in upgradeAnalysisConclusionList" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template v-if="column.dataIndex === 'decisionConclusionDescription'">
                <a-textarea allowClear style="width: 200px" v-model:value="record.decisionConclusionDescription" :rows="1" placeholder="请输入结论描述" />
              </template>
            </template>
          </a-table>
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
  <a-modal v-model:visible="filevisible" style="width: 90%" title="文件列表" :ok-text="false" :confirm-loading="$isPending()" :mask-closable="false" @cancel="handlfileeClose">
    <div class="pagecontent-title">
      <i></i>
      <span>IPMT决策证明材料</span>
    </div>
    <div style="height: calc(100vh - 600px)">
      <div class="upload-file-wrap" style="margin-left: 0px">
        <div v-for="(item, index) in ipmtUpConclusionFileList" :key="index">
          <div class="file-list" v-if="item.filePath">
            <a-tooltip>
              <template #title>点击预览</template>
              <EpcIcon
                @click="priview(item)"
                type="icon-document-checked"
                style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
            </a-tooltip>
            <div class="file-dec">
              <div class="tit">{{ item.oldFileName }}</div>
              <div class="number">
                <span>文件类型：{{ item.oldFileName ? item.oldFileName.split('.').pop() : '' }}</span>
                <div class="hover-link" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
              </div>
              <a-button class="elbuttonAn" @click="priview(item)">
                <EpcIcon type="icon-liulan" style="font-size: 15px" />
              </a-button>
              <a-button class="elbutton" v-if="item.fileId" disabled>
                <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <a-button @click="filevisible = false" type="primary">
        <EpcIcon type="icon-quxiao" style="font-size: 15px" />
        取消</a-button
      >
    </template>
  </a-modal>
  <AnalyzeProductPackage ref="DecisionAnalysisRef" :modalVisible="ProductPackage" @onClose="ProductPackage = false"></AnalyzeProductPackage>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
@import '../../../../../../assets/css/designFlow/designFlow.less';
.ipmt-decision-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
</style>
