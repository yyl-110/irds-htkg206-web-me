<script lang="ts" setup>
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import { AdminApiSystemDemandanalyze } from '@/api/tags/demand/管理需求分析';
import type { UnwrapRef } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
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
  basicId: {
    require: true,
    type: String,
    default: () => '',
  },
});
const demandrow = ref<any>({});
const process = ref('1');
const loading = ref<boolean>(false);
const userStore = useUserStore();
const emit = defineEmits(['close', 'refreshTableData', 'SubmitFormData']);
// 流程角色定义
const roles = ref([
  { key: '1', label: '发起人', value: userStore.getUser.nickname, id: userStore.getUser.id },
  { key: '2', label: '市场代表', value: '', id: '', placeholder: '请选择市场代表' },
  { key: '3', label: '研发代表', value: '', id: '', placeholder: '请选择研发代表' },
]);
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
    roles.value = [
      { key: '1', label: '发起人', value: userStore.getUser.nickname, id: userStore.getUser.id },
      { key: '2', label: '市场代表', value: '', id: '', placeholder: '请选择市场代表' },
      { key: '3', label: '研发代表', value: '', id: '', placeholder: '请选择研发代表' },
    ];
  }
  return props.modalVisible;
});
// 需求信息表格列定义
const Decisioncolumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: flex-start;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: '需求编号',
    dataIndex: 'demandNum',
    key: 'demandNum',
    width: 130,
  },
  {
    title: '需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    width: 150,
  },
  {
    title: '需求来源',
    dataIndex: 'demandSource',
    key: 'demandSource',
    width: 130,
  },
  {
    title: '区域市场',
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
    width: 130,
  },
  {
    title: '区域市场',
    dataIndex: 'marketSegment',
    key: 'marketSegment',
    width: 130,
  },
  {
    title: '提出人',
    dataIndex: 'originaUserName',
    key: 'originaUserName',
    width: 130,
  },
  {
    title: '提出人',
    dataIndex: 'originaUserName',
    key: 'originaUserName',
    width: 130,
  },
  {
    title: 'RME提交时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
    width: 200,
  },
  {
    title: '期望反馈时间',
    dataIndex: 'feedbackTime',
    key: 'feedbackTime',
    width: 200,
  },
];
// 提交数据方法
const onSubmitFormData = async (type: string) => {
  if (!roles.value[1].id) {
    message.warn('请选择市场代表');
    return;
  }
  if (!roles.value[2].id) {
    message.warn('请选择研发代表');
    return;
  }
  if (roles.value[1].id == roles.value[2].id) {
    message.warn('市场代表和研发代表选择人不能相同');
    return;
  }
  let data = {
    basicId: props.basicId,
    marketLeaderId: roles.value[1].id,
    researchLeaderId: roles.value[2].id,
    saveStatus: 1,
  };
  if (type == 'save') {
    data.saveStatus = 1;
    if (demandrow.value.processStatus == '待办') {
      await ChangeTaskStatus(demandrow.value);
    }
    Saveandsubmitform(data);
  } else {
    data.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该流程吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        Saveandsubmitform(data);
      },
    });
  }
};
async function Saveandsubmitform(data: any) {
  const res = await AdminApiSystemDemandanalyze.chooseProcessUser(data);
  if (res.data.code == 200) {
    emit('refreshTableData');
    emit('close');
    message.success('操作成功');
  }
}
async function ChangeTaskStatus(record: any) {
  const res = await AdminApiSystemProcessTask.updateStatus({ id: record.id, processStatus: getTaskStatusLabel(TaskStatus.IN_PROGRESS) });
}
const Detailsflag = ref(false);
const marketData = ref<any>([]);
const developmentData = ref<any>([]);
async function getUserPersonnel(roleName: string, resB: any) {
  const res = await AdminApiSystemProductSpecification.getPositionUserList({ roleName });
  let roleData = res.data.data || [];
  let groupData = resB.data.data || [];
  const groupIds = new Set(groupData.map((item: any) => item.id));
  let userdata = roleData.filter((roleItem: any) => groupIds.has(roleItem.id));
  if (roleName == '市场代表') {
    marketData.value = userdata?.map((item: any) => ({ label: `${item.nickname}  （${item.username}）`, value: item.id })) || [];
  } else {
    developmentData.value = userdata?.map((item: any) => ({ label: `${item.nickname}  （${item.username}）`, value: item.id })) || [];
  }
}
const filterOption = (input: string, option: any) => {
  return option.key.indexOf(input) >= 0;
};
const ViewDetails = async (row: any, type: string) => {
  demandrow.value = row;
  loading.value = true;
  try {
    const res = await AdminApiSystemDemandanalyze.getChooseProcessUser({ basicId: row.basicId });
    if (res.data.code == 200) {
      let data: any = res.data.data;
      if (type == 'detail') {
        Detailsflag.value = true;
      } else {
        Detailsflag.value = false;
      }
      roles.value.forEach((item: any) => {
        if (item.label == '市场代表') {
          item.value = data.marketLeaderName;
          item.id = data.marketLeaderId;
        }
        if (item.label == '研发代表') {
          item.value = data.researchLeaderName;
          item.id = data.researchLeaderId;
        }
      });
      // 通过流程状态与接口返回的市场代表、研发代表是否提交判断当前流程状态
      if (row.processStatus == '待办') {
        process.value = '1';
      } else if (row.processStatus == '进行中') {
        process.value = '2';
      } else if (data.marketLeaderFlag && !data.researchLeaderFlag) {
        process.value = '3';
      } else if (data.researchLeaderFlag && !data.marketLeaderFlag) {
        process.value = '4';
      } else if (data.researchLeaderFlag && data.marketLeaderFlag) {
        process.value = '5';
      }
    }
    const resB = await AdminApiSystemUser.getSimpleUsers({});
    getUserPersonnel('市场代表', resB);
    getUserPersonnel('研发代表', resB);
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
};
function Photopath() {
  if (process.value == '1') {
    return new URL(`../../../../assets/images/process1.png`, import.meta.url).href;
  } else if (process.value == '2') {
    return new URL(`../../../../assets/images/process2.png`, import.meta.url).href;
  } else if (process.value == '3') {
    return new URL(`../../../../assets/images/process3.png`, import.meta.url).href;
  } else if (process.value == '4') {
    return new URL(`../../../../assets/images/process4.png`, import.meta.url).href;
  } else if (process.value == '5') {
    return new URL(`../../../../assets/images/process5.png`, import.meta.url).href;
  }
}
/** close */
const handleClose = () => {
  // 通过事件传过去
  emit('close');
};
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.DecisionAnalysis');
}
defineExpose({ ViewDetails });
</script>

<template>
  <div class="DecisionAnalysis" v-dragModal>
    <a-modal
      v-model:visible="visible"
      style="width: 90%"
      :title="Detailsflag ? $t('决策分析流程详情') : '发起决策分析流程'"
      :ok-text="false"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :getContainer="customGetContainer"
      @cancel="handleClose">
      <a-spin :spinning="loading" tip="加载中...">
        <div class="decision-analysis-container">
          <!-- 需求信息部分 -->
          <a-card class="requirement-card">
            <div class="pagecontent-title">
              <i></i>
              <span>需求信息</span>
            </div>
            <a-table
              row-key="id"
              :scroll="{ x: 1200 }"
              :pagination="false"
              :columns="Decisioncolumns"
              :data-source="tableData"
              :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
              <template #bodyCell="{ column, record }"> </template>
            </a-table>
          </a-card>
          <!-- 流程人员选取部分 -->
          <a-card class="personnel-selection-card">
            <div class="pagecontent-title">
              <i></i>
              <span>流程人员选取</span>
            </div>
            <a-row>
              <a-col :span="12">
                <div>
                  <span class="role-label">{{ roles[0].label }}：</span>
                  <a-input disabled style="width: 220px" v-model:value="roles[0].value" :placeholder="roles[0].placeholder" />
                </div>
                <div class="role-user-container">
                  <span class="role-label">{{ roles[1].label }}：</span>
                  <a-select
                    :disabled="Detailsflag"
                    v-model:value="roles[1].id"
                    allow-clear
                    :placeholder="roles[1].placeholder"
                    style="width: 220px; text-align: left"
                    show-search
                    :filter-option="filterOption">
                    <a-select-option v-for="item in marketData" :key="item.label" :value="item.value">
                      <a-tooltip>
                        <template #title>
                          {{ item.label }}
                        </template>
                        {{ item.label }}
                      </a-tooltip>
                    </a-select-option>
                  </a-select>
                </div>
                <div class="role-user-container">
                  <span class="role-label">{{ roles[2].label }}：</span>
                  <a-select
                    :disabled="Detailsflag"
                    v-model:value="roles[2].id"
                    allow-clear
                    :placeholder="roles[2].placeholder"
                    style="width: 220px; text-align: left"
                    show-search
                    :filter-option="filterOption">
                    <a-select-option v-for="item in developmentData" :key="item.label" :value="item.value">
                      <a-tooltip>
                        <template #title>
                          {{ item.label }}
                        </template>
                        {{ item.label }}
                      </a-tooltip>
                    </a-select-option>
                  </a-select>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="process-diagram">
                  <div style="width: 600px; height: 250px">
                    <img style="width: 100%; height: 100%" :src="Photopath()" />
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-card>
        </div>
      </a-spin>
      <template #footer>
        <a-button v-if="!Detailsflag" @click="onSubmitFormData('save')" type="primary">
          <EpcIcon type="icon-baocun" style="font-size: 15px" />
          保存</a-button
        >
        <a-button v-if="!Detailsflag" @click="onSubmitFormData('submit')" type="primary">
          <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
          提交</a-button
        >
        <a-button v-if="Detailsflag" @click="handleClose" type="primary"> 取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.decision-analysis-container {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.requirement-card {
  margin-bottom: 20px;
}

.personnel-selection-card {
  margin-bottom: 20px;
  .role-user-container {
    margin-top: 20px;
  }
}

.role-item {
  margin-top: 20px;
  margin-right: 20px;
}

.role-label {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
  text-align: right;
}

.process-diagram {
  width: 90%;
  height: auto;
}

.action-buttons {
  text-align: right;
}
</style>
