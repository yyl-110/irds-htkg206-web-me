<template>
  <draggable-modal class="dialog" :visible="poseDialogVisible" title="我要提问" :width="800" @cancel="handleCloseDialog">
    <a-form class="dialog-form" :label-col="{ style: { width: '130px' } }">
      <a-form-item label="等级：">
        <a-select class="dialog-form-item-select" v-model:value="level" placeholder="请选择等级">
          <a-select-option value="一般">一般</a-select-option>
          <a-select-option value="严重">严重</a-select-option>
          <a-select-option value="紧急">紧急</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="知识中心标签：">
        <div class="dialog-form-item">
          <a-input v-model:value="checkTabListStr" placeholder="请选择或输入标签(以逗号分隔)"></a-input>
          <a-button class="dialog-form-item-btn" type="primary" @click="openTagDialog">编辑</a-button>
        </div>
      </a-form-item>
    </a-form>
    <div v-if="hidePerson" class="dialog-center">
      <a-form style="display: flex" :label-col="{ style: { width: '130px' } }">
        <a-form-item label="可回复人员：">
          <a-radio-group v-model:value="radioVal" @change="e => getRadio(e.target.value)">
            <a-radio :value="3">所有人</a-radio>
            <a-radio :value="2">指定人员</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </div>
    <div v-if="hidePerson" class="dialog-bottom">
      <a-form style="display: flex" :label-col="{ style: { width: '130px' } }">
        <a-form-item label="指定回复人员：">
          <a-input :disabled="redioFlag" class="dialog-bottom-input" v-model:value="appoint"></a-input>
        </a-form-item>
        <a-button v-if="hideBtn" style="margin-left: 5px" type="primary" @click="editFun">编辑</a-button>
      </a-form>
    </div>
    <div>
      <a-form class="dialog-form" :label-col="{ style: { width: '130px' } }">
        <a-form-item label="问题描述：">
          <a-textarea :auto-size="{ minRows: 4, maxRows: 4 }" v-model:value="questDesc" :maxlength="500" showCount
            style="width: 580px"></a-textarea>
        </a-form-item>
      </a-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="submitFun(1)">提交</a-button>
        <a-button @click="questCancel">取消</a-button>
      </span>
    </template>
  </draggable-modal>

  <draggable-modal :maskClosable="false" :visible="poseDialogVisible1" title="站内分享" :width="650"
    @cancel="handleCloseShare">
    <a-transfer :target-keys="shareId" :show-search="true" :filter-option="filterMethod" :data-source="transferData"
      :render="(item: any) => item.title" @change="handleTransferChange" />
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="shareConfirm">确定</a-button>
        <a-button @click="shareConcel">取消</a-button>
      </span>
    </template>
  </draggable-modal>

  <draggable-modal :maskClosable="false" class="labelModal" v-model:visible="tabStatsDialogVisible" :width="600"
    title="标签应用" @cancel="closeTabStatsDialogFun">
    <div class="group" v-for="item in labelData" :key="item.nodeName">
      <div class="titleStyle mb-[8px]">
        <div :class="{ fontStyle: item.nodeLevel === '2' }" v-if="item.nodeLevel === '2'">{{ item.nodeName }}</div>
      </div>
      <a-checkbox-group class="checkGroup"
        v-if="item.children && item.children.length > 0 && item.nodeLevel === '2' && item.selectType === '1'"
        v-model:value="item.checkedValues">
        <a-checkbox class="checkBox" v-for="val in item.children" :key="val.nodeName" :value="val.nodeName">
          {{ val.nodeName }}
        </a-checkbox>
      </a-checkbox-group>
      <a-radio-group class="checkGroup"
        v-if="item.children && item.children.length > 0 && item.nodeLevel === '2' && item.selectType === '0'"
        v-model:value="item.modelVal">
        <a-radio class="checkBox" v-for="val in item.children" :key="val.nodeName" :value="val.nodeName">
          {{ val.nodeName }}
        </a-radio>
      </a-radio-group>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="closeTabStatsDialogFun">确定</a-button>
        <a-button @click="closeTabStatsDialogFun">取消</a-button>
      </span>
    </template>
  </draggable-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { userList, saveQuestion, getTreeNodeByNodeLevel } from '@/api/knowledge';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import draggableModal from "@/components/DraggableModal/index.vue";

// --- Types (类型定义) ---
interface LabelNode {
  id: string;
  nodeName: string;
}

interface LabelGroup {
  nodeName: string;
  nodeLevel: string;
  selectType: '0' | '1';
  children?: LabelNode[];
  modelVal?: string;
  checkedValues?: string[];
}

interface UserItem {
  id: string;
  name: string;
}

interface TransferItem {
  key: string;
  title: string;
}

const props = defineProps<{
  poseDialogVisible: boolean;
  editData?: any;
  expertData?: any;
  addFlag?: string;
}>();

const emit = defineEmits<{
  (e: 'closeDialog', visible: boolean, flag?: string): void;
  (e: 'closeDialogs', visible: boolean): void;
}>();

const userStore = useUserStore();

// --- State (状态) ---
const hideBtn = ref(false);
const hidePerson = ref(true);
const questDesc = ref('');
const level = ref<string | undefined>(undefined);
const appoint = ref('');
const radioVal = ref(3);
const redioFlag = ref(true);

const checkTabList = ref<string[]>([]);
const copyData = ref<string[]>([]);
const selectId = ref<string[]>([]); // 保存标签的ID集
const labelData = ref<LabelGroup[]>([]);

const select = ref(1);
const poseDialogVisible1 = ref(false);
const tabStatsDialogVisible = ref(false);

const shareId = ref<string[]>([]);
const userData = ref<UserItem[]>([]);
const transferData = ref<TransferItem[]>([]);

const editDataId = ref<string>('');
const experetData = ref<any>({});
const flagNum = ref('0');

// 代理 input 框的展示和修改
const checkTabListStr = computed({
  get: () => checkTabList.value.join(','),
  set: (val: string) => {
    checkTabList.value = val.split(',').filter(Boolean);
  }
});

// --- Watchers ---
watch(
  () => props.addFlag,
  val => {
    if (val === '1') {
      questDesc.value = '';
      level.value = undefined;
      checkTabList.value = [];
      copyData.value = [];
      appoint.value = '';
      selectId.value = [];
      radioVal.value = 3;
      hideBtn.value = false;
    }
  }
);

watch(
  () => props.editData,
  val => {
    if (val && val.id) {
      editDataId.value = val.id;
      questDesc.value = val.description;
      checkTabList.value = val.kldTagName ? val.kldTagName.split(',') : [];
      copyData.value = [...checkTabList.value];
      selectId.value = val.kldTagId ? val.kldTagId.split(',') : []; // 防止未开弹窗直接保存时丢失ID
      level.value = val.urgency;
      radioVal.value = val.assignType;
    }
  }
);

watch(
  () => props.expertData,
  val => {
    if (val && val.id) {
      hidePerson.value = false;
      experetData.value = val;
    }
  }
);

// --- Methods (逻辑处理) ---

// 穿梭框选项控制
const getRadio = (val: number) => {
  select.value = val;
  if (val === 2) {
    getUserList();
    hideBtn.value = true;
  } else {
    appoint.value = '';
    hideBtn.value = false;
  }
};

const editFun = () => {
  getUserList();
};

const handleTransferChange = (targetKeys: string[]) => {
  shareId.value = targetKeys;
};

const filterMethod = (inputValue: string, item: TransferItem) => {
  return item.title.indexOf(inputValue) !== -1;
};

// 获取用户列表 (穿梭框数据)
const getUserList = async () => {
  try {
    const params = {
      type: 2,
      kldFileId: '',
      kldType: '2',
      userId: userStore.getUser.id,
    };
    const res = await userList(params);
    if (res?.data?.code === '0') {
      userData.value = res.data.data || [];
      transferData.value = userData.value.map(item => ({
        title: item.name,
        key: item.id,
      }));
      poseDialogVisible1.value = true;
    }
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};

// 打开标签应用弹窗并回显数据
const openTagDialog = async () => {
  try {
    const params = { nodeLevel: '2', tagType: '1' };
    const res = await getTreeNodeByNodeLevel(params);

    if (res?.data?.code === '0') {
      const result: LabelGroup[] = res.data.data.result || [];

      labelData.value = result.map(group => {
        let modelVal = '';
        let checkedValues: string[] = [];

        if (group.children && group.children.length > 0) {
          group.children.forEach(child => {
            if (copyData.value.includes(child.nodeName)) {
              if (group.selectType === '0') {
                modelVal = child.nodeName;
              } else if (group.selectType === '1') {
                checkedValues.push(child.nodeName);
              }
            }
          });
        }
        return {
          ...group,
          modelVal,
          checkedValues: [...new Set(checkedValues)]
        };
      });

      tabStatsDialogVisible.value = true;
    }
  } catch (error) {
    console.error('获取标签分类失败', error);
  }
};

// 确认选择标签应用
const closeTabStatsDialogFun = () => {
  const names: string[] = [];
  const ids: string[] = [];

  labelData.value.forEach(group => {
    if (!group.children || group.children.length === 0) return;

    if (group.selectType === '0' && group.modelVal) {
      names.push(group.modelVal);
      const matched = group.children.find(c => c.nodeName === group.modelVal);
      if (matched) ids.push(matched.id);
    }

    if (group.selectType === '1' && group.checkedValues && group.checkedValues.length > 0) {
      names.push(...group.checkedValues);
      group.checkedValues.forEach(name => {
        const matched = group.children!.find(c => c.nodeName === name);
        if (matched) ids.push(matched.id);
      });
    }
  });

  checkTabList.value = [...new Set(names)];
  selectId.value = [...new Set(ids)];
  copyData.value = [...checkTabList.value]; // 同步 copyData 下次编辑回显
  tabStatsDialogVisible.value = false;
};

// 提交表单
const submitFun = async (status: number) => {
  if (!questDesc.value || checkTabList.value.length < 1 || !level.value) {
    message.warning('请输入完整！');
    return;
  }

  // 构建标签 json (兼容原有逻辑)
  const tagJsonArr = labelData.value.flatMap(group => {
    if (!group.children) return [];
    return group.children.filter(child => checkTabList.value.includes(child.nodeName));
  });

  const baseParams = {
    userId: userStore.getUser.id,
    description: questDesc.value,
    urgency: level.value,
    kldTagId: selectId.value.join(','),
    kldTagName: checkTabList.value.join(','),
    tagJson: JSON.stringify(tagJsonArr),
    status: status,
    kldType: 2,
  };

  let params: any;
  if (hidePerson.value) {
    params = {
      ...baseParams,
      id: editDataId.value || '',
      assignType: select.value,
      assignUserId: select.value === 2 ? shareId.value.join(',') : '',
      assignUserName: '',
    };
  } else {
    params = {
      ...baseParams,
      id: '',
      assignType: 1,
      assignUserId: experetData.value.id,
      assignUserName: experetData.value.userName,
    };
  }

  try {
    const res = await saveQuestion(params);
    if (res?.data?.code === '0') {
      resetForm();
      message.success(res.data.msg);
      emit('closeDialog', false, flagNum.value);
      emit('closeDialogs', false);
    }
  } catch (error) {
    console.error('提交失败', error);
  }
};

// 取消及弹窗关闭事件
const resetForm = () => {
  questDesc.value = '';
  level.value = undefined;
  checkTabList.value = [];
  copyData.value = [];
  radioVal.value = 3;
  appoint.value = '';
  flagNum.value = '0';
  editDataId.value = '';
};

const questCancel = () => {
  resetForm();
  emit('closeDialogs', false);
  emit('closeDialog', false, flagNum.value);
};

const handleCloseDialog = () => {
  resetForm();
  emit('closeDialog', false);
  emit('closeDialogs', false);
};

// 穿梭框确认
const shareConfirm = () => {
  const arr = shareId.value
    .map(id => userData.value.find(u => u.id === id)?.name)
    .filter(Boolean);

  appoint.value = arr.join(',');
  poseDialogVisible1.value = false;
};

// 穿梭框取消
const shareConcel = () => {
  poseDialogVisible1.value = false;
};

const handleCloseShare = () => {
  poseDialogVisible1.value = false;
};
</script>

<style lang="less">
.labelModal {
  .ant-modal-body {
    padding: 16px !important;

    .group {
      &:not(:first-child) {
        margin-top: 16px;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.dialog {
  &-form {
    display: flex;
    flex-wrap: wrap;

    &-item {
      display: flex;

      &-btn {
        margin-left: 5px;
      }

      &-select {
        width: 192px;
      }
    }
  }

  &-center {
    display: flex;

    &-label {
      width: 130px;
      text-align: right;
      margin-right: 15px;
    }
  }

  &-bottom {
    display: flex;

    &-input {
      display: flex;
    }
  }
}

.titleStyle {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .fontStyle {
    font-size: 16px;
    font-weight: bold;
    color: #313133;
  }
}

.checkGroup {
  display: flex;
  flex-wrap: wrap;
}

.checkBox {
  margin-left: 20px;
  width: 120px;
}
</style>