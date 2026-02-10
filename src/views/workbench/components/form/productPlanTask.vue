<script lang="ts" setup>
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import { AdminApiSystemDemandanalyze } from '@/api/tags/demand/管理需求分析';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
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
const loading = ref<boolean>(false);
const userStore = useUserStore();
const emit = defineEmits(['close', 'refreshTableData', 'SubmitFormData']);
// 流程角色定义
const roles = ref([
  { key: '1', label: '发起人', value: userStore.getUser.nickname, id: userStore.getUser.id },
  { key: '2', label: '产品规划组长', value: '', id: '', placeholder: '请选择产品规划组长' },
]);
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
    roles.value = [
      { key: '1', label: '发起人', value: userStore.getUser.nickname, id: userStore.getUser.id },
      { key: '2', label: '产品规划组长', value: '', id: '', placeholder: '请选择产品规划组长' },
    ];
  }
  return props.modalVisible;
});
// 提交数据方法
const onSubmitFormData = async (type: string) => {
  if (roles.value[1].id == 'null' || roles.value[1].id == undefined || roles.value[1].id == '') {
    message.warn('请选择产品规划组长');
    return;
  }
  let data = {
    teamLeaderUserId: roles.value[1].id,
    saveStatus: 1,
    planId: planTask.value.planId,
    id: planTask.value.id,
  };
  if (type == 'save') {
    data.saveStatus = 1;
  } else {
    data.saveStatus = 2;
  }
  const res = await AdminApiProductPlanTaskDesign.updatePlanTeamUserId(data);
  if (res.data.code == 200) {
    emit('refreshTableData');
    emit('close');
    message.success('操作成功');
  }
};
const Detailsflag = ref(false);
const fileListDataEnds = ref<any>([]);
function linkClick(url: string) {
  window.open(url);
}
const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  const lastDotIndex = row.fileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.fileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}
function handleClosePowModal() {
  powVisible.value = false;
}
const Planningteamleader = ref<any>([]);
const planTask = ref<any>({});
async function getUserPersonnel(roleName: string, resB: any) {
  const res = await AdminApiSystemProductSpecification.getPositionUserList({ roleName });
  let roleData = res.data.data || [];
  let groupData = resB.data.data || [];
  const groupIds = new Set(groupData.map((item: any) => item.id));
  let userdata = roleData.filter((roleItem: any) => groupIds.has(roleItem.id));
  Planningteamleader.value = userdata?.map((item: any) => ({ label: `${item.nickname}  （${item.username}）`, value: item.id })) || [];
}
const filterOption = (input: string, option: any) => {
  return option.key.indexOf(input) >= 0;
};
const ViewDetails = async (row: any, type: string) => {
  loading.value = true;
  try {
    planTask.value = row;
    let data = {
      planId: row.planId,
      id: row.id,
      type: type,
    };
    if (type == 'detail') {
      Detailsflag.value = true;
    } else {
      Detailsflag.value = false;
    }
    const res = await AdminApiProductPlanTaskDesign.getproductPlanCombinationRequestDTO(data);
    if (res.data.code == 200) {
      fileListDataEnds.value = res.data.data.fileListDataEnds;
      if (res.data.data.teamLeaderUserId != 'null') {
        roles.value.forEach((item: any) => {
          if (item.label == '产品规划组长') {
            item.value = res.data.data.teamLeaderUserName;
            item.id = res.data.data.teamLeaderUserId;
          }
        });
      }
    }
    const resB = await AdminApiSystemUser.getSimpleUsers({});
    getUserPersonnel('产品规划组长', resB);
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
};
const ViewDetailsTask = async (row: any, type: string) => {
  loading.value = true;
  try {
    planTask.value = row;
    let data = {
      planId: row.planId,
      id: row.id,
      type: type,
    };
    const res = await AdminApiProductPlanTaskDesign.getproductPlanCombinationRequestDTO(data);
    if (res.data.code == 200) {
      fileListDataEnds.value = res.data.data.fileListDataEnds;
      if (res.data.data.teamLeaderUserId != 'null') {
        roles.value.forEach((item: any) => {
          if (item.label == '产品规划组长') {
            item.value = res.data.data.teamLeaderUserName;
            item.id = res.data.data.teamLeaderUserId;
          }
        });
      }
      onSubmitFormData('submit');
    }
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
};
function Photopath() {
  if (planTask.value.processStatus == '进行中' && (!planTask.value.approvalStatus || planTask.value.approvalStatus == '待办')) {
    return new URL(`../../../../assets/images/productTask1.png`, import.meta.url).href;
  }
  if (planTask.value.processStatus == '待办' && (!planTask.value.approvalStatus || planTask.value.approvalStatus == '待办')) {
    return new URL(`../../../../assets/images/productTask1.png`, import.meta.url).href;
  } else if (planTask.value.processStatus == '已办' && (!planTask.value.approvalStatus || planTask.value.approvalStatus == '待办')) {
    return new URL(`../../../../assets/images/productTask2.png`, import.meta.url).href;
  } else if (planTask.value.processStatus == '已办' && planTask.value.approvalStatus == '已驳回') {
    return new URL(`../../../../assets/images/productTask2.png`, import.meta.url).href;
  } else if (planTask.value.approvalStatus == '已驳回') {
    return new URL(`../../../../assets/images/productTask3.png`, import.meta.url).href;
  } else if (planTask.value.approvalStatus == '已通过') {
    return new URL(`../../../../assets/images/productTask4.png`, import.meta.url).href;
  }
}
/** close */
const handleClose = () => {
  // 通过事件传过去
  emit('close');
};
defineExpose({
  ViewDetails,
  ViewDetailsTask,
});
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.productPlanTask');
}
</script>

<template>
  <div class="productPlanTask" v-dragModal>
    <a-modal
      v-model:visible="visible"
      style="width: 90%"
      :title="'发起产品组合清单评审'"
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
              <span>产品组合对象清单</span>
            </div>
            <div class="upload-file-wrap">
              <div v-for="(item, index) in fileListDataEnds" :key="index">
                <div class="file-list">
                  <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                  <div class="file-dec">
                    <div class="tit">{{ item.oldFileName }}</div>
                    <div class="number">
                      <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                    </div>
                    <a-button class="elbutton" @click="priview(item)">
                      <EpcIcon type="icon-liulan" style="font-size: 15px" />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
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
                    <a-select-option v-for="item in Planningteamleader" :key="item.label" :value="item.value">
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
                  <img style="width: 90%; height: 100%" :src="Photopath()" />
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
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
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
  width: 100px;
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

//文件列表
.upload-file-wrap {
  margin: 0 20px 28px 40px;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 50px);
  .file-list {
    min-width: 493px;
    max-width: 493px;
    height: 72px;
    background: #f3f2f7;
    border-radius: 4px 4px 4px 4px;
    display: flex;
    margin-right: 12px;
    margin-bottom: 12px;
    .icon {
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      color: #0d53e2;
      margin: 15px 13px 20px 15px;
    }
    .file-dec {
      position: relative;
      width: 100%;
      .tit {
        margin: 16px 0 4px 0;
        height: 22px;
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
      }
      .number {
        display: flex;
        align-items: center;
        height: 12px;
        font-family:
          Source Sans 3,
          Source Sans 3;
        font-weight: 400;
        font-size: 12px;
        color: #6a696e;
        line-height: 12px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        .hover-link {
          font-size: 12px !important;
          height: 14px;
          width: 280px;
          overflow: hidden;
          color: #0d53e2;
          cursor: pointer;
        }
      }
      .elbutton {
        position: absolute;
        right: 0px;
        top: 20px;
        background: none !important;
        border: none !important;
      }
    }
  }
}
</style>
