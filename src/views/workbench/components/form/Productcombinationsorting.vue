<script setup lang="ts">
// 产品组合排序
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const userStore = useUserStore();
const emit = defineEmits(['close', 'refreshTableData', 'SubmitFormData']);
// 流程角色定义
const roles = ref([
  { key: '1', label: '编制人', value: userStore.getUser.nickname, id: userStore.getUser.id },
  { key: '2', label: '研发代表', value: '', id: '', placeholder: '请选择研发代表' },
  { key: '3', label: '市场代表', value: '', id: '', placeholder: '请选择市场代表' },
  { key: '4', label: '财务代表', value: '', id: '', placeholder: '请选择财务代表' },
]);
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
    roles.value = [
      { key: '1', label: '编制人', value: userStore.getUser.nickname, id: userStore.getUser.id },
      { key: '2', label: '研发代表', value: '', id: '', placeholder: '请选择研发代表' },
      { key: '3', label: '市场代表', value: '', id: '', placeholder: '请选择市场代表' },
      { key: '4', label: '财务代表', value: '', id: '', placeholder: '请选择财务代表' },
    ];
  }
  return props.modalVisible;
});
const loading = ref<boolean>(false);
const demandrow = ref<any>({});
const process = ref('1');
const Detailsflag = ref(false);
// 判断最后三个对象id是否一致的函数
const checkLastThreeIds = () => {
  // 获取数组最后三个元素（不足三个则取全部）
  const lastThree = roles.value.slice(-3);
  // 提取id值并过滤空字符串
  const ids = lastThree.map(item => item.id).filter(id => id !== '');
  // 情况1：存在非空id且全部相同
  if (ids.length > 0 && new Set(ids).size === 1) {
    return true; // 最后三个id一致（排除空值后）
  }
  // 情况2：全为空或存在不同id
  return false;
};
const onSubmitFormData = async (type: string) => {
  if (!roles.value[1].id) {
    message.warn('请选择研发代表');
    return;
  }
  if (!roles.value[2].id) {
    message.warn('请选择市场代表');
    return;
  }
  if (!roles.value[3].id) {
    message.warn('请选择财务代表');
    return;
  }
  if (checkLastThreeIds()) {
    message.warn('研发代表、市场代表、财务代表选择人不能相同');
    return;
  }
  let data = {
    planId: demandrow.value.planId,
    devUserId: roles.value[1].id,
    marketUserId: roles.value[2].id,
    financeUserId: roles.value[3].id,
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
  const res = await AdminApiSystemProductPlanningscoring.setScoreProcessUser(data);
  if (res.data.code == 200) {
    message.success('操作成功');
    emit('refreshTableData');
    emit('close', false);
  }
}
async function ChangeTaskStatus(record: any) {
  const res = await AdminApiSystemProcessTask.updateStatus({ id: record.id, processStatus: getTaskStatusLabel(TaskStatus.IN_PROGRESS) });
}
const marketData = ref<any>([]);
const developmentData = ref<any>([]);
const financeData = ref<any>([]);
async function getUserPersonnel(roleName: string, resB: any) {
  const res = await AdminApiSystemProductSpecification.getPositionUserList({ roleName });
  let roleData = res.data.data || [];
  let groupData = resB.data.data || [];
  const groupIds = new Set(groupData.map((item: any) => item.id));
  let userdata = roleData.filter((roleItem: any) => groupIds.has(roleItem.id));
  if (roleName == '市场代表') {
    marketData.value = userdata?.map((item: any) => ({ label: `${item.nickname}  （${item.username}）`, value: item.id })) || [];
  } else if (roleName == '研发代表') {
    developmentData.value = userdata?.map((item: any) => ({ label: `${item.nickname}  （${item.username}）`, value: item.id })) || [];
  } else if (roleName == '财务代表') {
    financeData.value = userdata?.map((item: any) => ({ label: `${item.nickname}  （${item.username}）`, value: item.id })) || [];
  }
}
const filterOption = (input: string, option: any) => {
  return option.key.indexOf(input) >= 0;
};
const ViewDetails = async (row: any, type: string) => {
  demandrow.value = row;
  loading.value = true;
  try {
    const res = await AdminApiSystemProductPlanningscoring.getScoreProcessUser({ planId: row.planId });
    if (res.data.code == 200) {
      let data: any = res.data.data;
      if (type == 'detail') {
        Detailsflag.value = true;
      } else {
        Detailsflag.value = false;
      }
      roles.value.forEach((item: any) => {
        if (item.label == '研发代表') {
          item.value = data.devNickname;
          item.id = data.devUserId;
        }
        if (item.label == '市场代表') {
          item.value = data.marketNickname;
          item.id = data.marketUserId;
        }
        if (item.label == '财务代表') {
          item.value = data.financeNickname;
          item.id = data.financeUserId;
        }
      });
      // 通过流程状态与接口返回的市场代表、研发代表是否提交判断当前流程状态
      if (row.processStatus == '待办') {
        process.value = '1';
      } else if (row.processStatus == '进行中') {
        process.value = '2';
      } else if (data.devFlag && !data.marketFlag && !data.financeFlag) {
        process.value = '3';
      } else if (data.marketFlag && !data.devFlag && !data.financeFlag) {
        process.value = '4';
      } else if (data.financeFlag && !data.devFlag && !data.marketFlag) {
        process.value = '5';
      } else if (data.devFlag && data.marketFlag && !data.financeFlag) {
        process.value = '6';
      } else if (data.devFlag && data.financeFlag && !data.marketFlag) {
        process.value = '7';
      } else if (data.marketFlag && data.financeFlag && !data.devFlag) {
        process.value = '8';
      } else if (data.devFlag && data.marketFlag && data.financeFlag) {
        process.value = '9';
      }
    }
    const resB = await AdminApiSystemUser.getSimpleUsers({});
    getUserPersonnel('市场代表', resB);
    getUserPersonnel('研发代表', resB);
    getUserPersonnel('财务代表', resB);
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
};
function Photopath() {
  if (process.value == '1') {
    return new URL(`../../../../assets/images/productPlanning1.png`, import.meta.url).href;
  } else if (process.value == '2') {
    return new URL(`../../../../assets/images/productPlanning2.png`, import.meta.url).href;
  } else if (process.value == '3') {
    return new URL(`../../../../assets/images/productPlanning3.png`, import.meta.url).href;
  } else if (process.value == '4') {
    return new URL(`../../../../assets/images/productPlanning4.png`, import.meta.url).href;
  } else if (process.value == '5') {
    return new URL(`../../../../assets/images/productPlanning5.png`, import.meta.url).href;
  } else if (process.value == '6') {
    return new URL(`../../../../assets/images/productPlanning6.png`, import.meta.url).href;
  } else if (process.value == '7') {
    return new URL(`../../../../assets/images/productPlanning7.png`, import.meta.url).href;
  } else if (process.value == '7') {
    return new URL(`../../../../assets/images/productPlanning7.png`, import.meta.url).href;
  } else if (process.value == '8') {
    return new URL(`../../../../assets/images/productPlanning8.png`, import.meta.url).href;
  } else if (process.value == '9') {
    return new URL(`../../../../assets/images/productPlanning9.png`, import.meta.url).href;
  }
}
/** close */
const handleClose = () => {
  // 通过事件传过去
  emit('close');
};

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.setScoringList');
}
defineExpose({ ViewDetails });
</script>
<template>
  <div class="setScoringList" v-dragModal>
    <a-modal
      style="width: 90%"
      v-model:visible="visible"
      :getContainer="customGetContainer"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'产品组合排序'"
      @cancel="handleClose">
      <a-spin :spinning="loading" tip="加载中...">
        <div class="decision-analysis-container">
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
                  <span class="role-label">{{ roles[3].label }}：</span>
                  <a-select
                    :disabled="Detailsflag"
                    v-model:value="roles[3].id"
                    allow-clear
                    :placeholder="roles[3].placeholder"
                    style="width: 220px; text-align: left"
                    show-search
                    :filter-option="filterOption">
                    <a-select-option v-for="item in financeData" :key="item.label" :value="item.value">
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
                  <div style="width: 600px; height: 300px">
                    <img style="width: 100%; height: 100%" :src="Photopath()" />
                  </div></div
              ></a-col>
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

<style scoped lang="less">
.decision-analysis-container {
  padding: 20px;
}

.header-card {
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
