<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { userList, knowledgeShare, saveQuestion, getTreeNodeByNodeLevel } from '@/api/knowledge';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';


const props = defineProps({
  poseDialogVisible: {
    type: Boolean,
    default: false,
  },
  editData: {
    type: Object,
    default: () => { },
  },
  expertData: {
    type: Object,
    default: () => { },
  },
  addFlag: String,
});

const emit = defineEmits(['closeDialog', 'closeDialogs']);

//
const hideBtn = ref(false);

const hidePerson = ref(true);

const questDesc = ref();
const knoeledgeLabel = ref();
const level = ref(null);

const appoint = ref('');

const radioVal = ref(1);

// 分类标签数据
const checkTabList = ref([]);

// 标签数据
const labelData = ref([]);
// 选定人员
const select = ref(1);

// 禁用
const redioFlag = ref(true);

// 穿梭框
const poseDialogVisible1 = ref(false);

// 穿梭框数据
const value = ref([]);

// 单选名称
const radioName = ref([]);

// 单选按钮选中的数据
const arrayData = ref([]);

// 单选对象
const radioObj = ref([]);

// 穿梭框数据
const data = ref([]);

// 编辑浏览
const tabStatsDialogVisible = ref(false);

// 分享用户查询
const userData = ref([]);

// 穿梭框分享人员id
const shareId = ref([]);

// 标签需要的id
const selectId = ref([]);

// 单选框名称标识
const radioFlag = ref('');

// 编辑时候的id
const editDataId = ref();

// 指定知识专家的数据
const experetData = ref({});

const selectedLabelName = ref([]);
const selectedLabel = ref([]);

//
const selectRadio = ref([]);

const copyData = ref([]);

const flagNum = ref('');

// menuid
// const itemObj = computed(() => {
//   return store.getters.itemObj;
// });

watch(
  () => props.addFlag,
  val => {
    console.log(val, '我走的是这儿吗');
    if (val && val === '1') {
      questDesc.value = '';
      level.value = '';
      checkTabList.value = [];
      copyData.value = [];
      appoint.value = '';
    } else {
    }
  }
);

watch(
  () => props.editData,
  val => {
    if (val.id) {
      editDataId.value = val.id;
      questDesc.value = val.description;
      checkTabList.value = val.kldTagName.split(',');
      copyData.value = checkTabList.value;
      console.log(checkTabList.value, 'checkTabList.value');
      level.value = val.urgency;
      radioVal.value = val.assignType;
    }
  }
);

watch(
  () => props.expertData,
  val => {
    if (val.id) {
      hidePerson.value = false;
      experetData.value = val;
    }
  }
);

// 分享人选择事件
const getRadio = val => {
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

// 穿梭框右侧数据
const rightData = val => {
  console.log(val, '22222');
  shareId.value = [];
  shareId.value = val;
};

// a-transfer change handler
const handleTransferChange = (targetKeys) => {
  value.value = targetKeys;
  rightData(targetKeys);
};

// a-transfer filter
const filterMethod = (inputValue, item) => {
  return item.title.indexOf(inputValue) !== -1;
};

// 编辑弹窗
const editData = () => {
  const params = {
    menuId: '',
    menuParentId: '',
    nodeLevel: '2',
    tagType: '1',
  };
  getTreeNodeByNodeLevel(params).then(res => {
    if (res && res.data.code === '0') {
      labelData.value = res.data.data.result;
      // 为每个 checkbox 类别初始化独立的 checkedValues
      labelData.value.forEach(item => {
        if (item.selectType === '1') {
          item.checkedValues = [];
        }
      });
      if (radioName.value.length > 0) {
        labelData.value.map((v, i) => {
          if (labelData.value[i].selectType === '0') {
            console.log(radioName.value, 'adioName.value');
            if (props.addFlag === '1') {
              labelData.value[i].modelVal = '';
            } else {
              labelData.value[i].modelVal = radioName.value[i] || '';
            }
          }
        });
      } else {
        labelData.value[0].children.map((v, i) => {
          if (v.selectType === '0') {
            v.modelVal = '';
            v.radioMap = {};
          }
        });
      }
      tabStatsDialogVisible.value = true;

      copyData.value.map(l => {
        labelData.value.map(v => {
          if (v.selectType === '0') {
            if (v.children.length > 0) {
              v.children.map(k => {
                if (k.nodeName === l) {
                  v.modelVal = l;
                }
              });
            }
          } else {
            if (v.children.length > 0) {
              v.children.map(k => {
                if (k.nodeName === l) {
                  if (!v.checkedValues) v.checkedValues = [];
                  v.checkedValues.push(k.nodeName);
                }
              });
              v.checkedValues = [...new Set(v.checkedValues || [])];
            }
          }
        });
      });
      // 汇总所有类别的 checkedValues 到 checkTabList
      syncCheckTabList();
      console.log(checkTabList.value, '==============');
      console.log(labelData.value, 'labelData.value2222222');
    }
  });
};

// 编辑弹窗编辑
const closeTabStatsDialogFun = () => {
  // 汇总 radio 类别的选中值
  let radioValues = [];
  labelData.value.forEach(v => {
    if (v.modelVal && v.modelVal !== '') {
      radioValues.push(v.modelVal);
    }
  });

  // 汇总所有 checkbox 类别的选中值
  let checkboxValues = [];
  selectedLabel.value = [];
  labelData.value.forEach(m => {
    if (m.selectType === '1' && m.checkedValues) {
      m.checkedValues.forEach(name => {
        checkboxValues.push(name);
        if (m.children) {
          const found = m.children.find(p => p.nodeName === name);
          if (found) selectedLabel.value.push(found);
        }
      });
    }
  });

  checkTabList.value = [...new Set([...radioValues, ...checkboxValues])];

  selectId.value = [];
  if (selectedLabel.value.length > 0) {
    selectedLabel.value.forEach(v => {
      selectId.value.push(v.id);
    });
  }
  tabStatsDialogVisible.value = false;
};

// 汇总所有 checkbox 类别的选中值
const syncCheckTabList = () => {
  const allChecked = [];
  labelData.value.forEach(item => {
    if (item.selectType === '1' && item.checkedValues) {
      allChecked.push(...item.checkedValues);
    }
  });
  checkTabList.value = [...new Set(allChecked)];
};

// 知识中心标签分类属性
const handleCheckedKnowledgeAttributes = (val, item) => {
  item.checkedValues = val;
  syncCheckTabList();
  selectedLabel.value = [];
  selectedLabel.value = val;
};

// 标签属性选中事件
const getCheckBox = val => {
  let arr = [];
  selectedLabelName.value.push(val);
  selectedLabelName.value = Array.from(new Set(selectedLabelName.value.map(JSON.stringify)), JSON.parse);
  selectedLabel.value.map(v => {
    selectedLabelName.value.map(l => {
      if (v === l.nodeName) {
        arr.push(l);
      }
    });
  });
  selectedLabel.value = arr;
  console.log(selectedLabel.value, 'selectedLabel.valueselectedLabel.valueselectedLabel.value');
};

// 单选知识中心标签分类属性
const getRadioClick = val => {
  radioFlag.value = val;
};

// 单选标签属性选中事件
const getRadioData = (v, item, val) => {
  console.log(item, 'item');
  console.log(val, 'val');
  item.modelVal = v;
  arrayData.value = [];
  let nodeNameId = 'nodeNameId';
  const map = new Map();
  map[radioFlag.value] = v;
  map[nodeNameId] = val.id;
  item.radioMap = map;
  labelData.value.map(k => {
    for (let data in k.radioMap) {
      arrayData.value.push(k.radioMap[data]);
    }
  });
  radioName.value = [];
  radioObj.value = [];
  selectRadio.value = [];
  arrayData.value.map(v => {
    if (typeof v === 'string') {
      radioName.value.push(v);
    } else {
      radioObj.value.push(v);
    }
  });
  selectRadio.value = radioObj.value;
};

// 获取用户列表
const getUserList = () => {
  const params = {
    type: 2,
    kldFileId: '',
    kldType: '2',
    userId: useUserStore().getUser.id,
  };
  userList(params).then(res => {
    if (res && res.data.code === '0') {
      userData.value = res.data.data;
      poseDialogVisible1.value = true;
      generateData();
    }
  });
};

// 人员用户列表
const generateData = () => {
  data.value = [];
  userData.value.forEach((item, index) => {
    data.value.push({
      title: item.name,
      key: item.id,
    });
  });
};

// 保存提交接口
const submitFun = status => {
  if (!questDesc.value || checkTabList.value.length < 1 || !level.value) {
    message.warning('请输入完整！');
    return;
  }
  selectId.value = [];
  checkTabList.value.map(v => {
    labelData.value.map(k => {
      if (k.selectType === '0') {
        if (k.children.length > 0) {
          k.children.map(l => {
            if (l.nodeName === v) {
              selectId.value.push(l.id);
            }
          });
        }
      }
      if (k.selectType === '1') {
        if (k.children.length > 0) {
          k.children.map(l => {
            if (l.nodeName === v) {
              selectId.value.push(l.id);
            }
          });
        }
      }
    });
  });
  const length = checkTabList.value.length;
  selectId.value = [...new Set(selectId.value)];
  const array = selectId.value.slice(-length);
  let params;
  if (hidePerson.value) {
    params = {
      id: editDataId.value || '',
      userId: useUserStore().getUser.id,
      description: questDesc.value,
      urgency: level.value,
      kldTagId: array.toString(),
      kldTagName: checkTabList.value.toString(),
      assignType: select.value,
      assignUserId: select.value === 2 ? shareId.value.toString() : '',
      assignUserName: '',
      tagJson: JSON.stringify(selectedLabel.value),
      status: status,
      kldType: 2,
    };
  } else {
    params = {
      id: '',
      userId: useUserStore().getUser.id,
      description: questDesc.value,
      urgency: level.value,
      kldTagId: selectId.value.toString(),
      kldTagName: checkTabList.value.toString(),
      assignType: 1,
      assignUserId: experetData.value.id,
      assignUserName: experetData.value.userName,
      tagJson: JSON.stringify(selectedLabel.value),
      status: status,
      kldType: 2,
    };
  }
  saveQuestion(params).then(res => {
    if (res && res.data.code === '0') {
      questDesc.value = '';
      level.value = '';
      checkTabList.value = [];
      radioVal.value = 1;
      appoint.value = '';
      flagNum.value = '0';
      radioName.value = [];
      editDataId.value = '';
      message.success(res.data.msg);
      emit('closeDialog', false, flagNum.value);
      emit('closeDialogs', false);
    }
  });
};

//取消
const questCancel = () => {
  questDesc.value = '';
  level.value = '';
  checkTabList.value = [];
  radioVal.value = 1;
  appoint.value = '';
  flagNum.value = '0';
  radioName.value = [];
  editDataId.value = '';
  emit('closeDialogs', false);
  emit('closeDialog', false, flagNum.value);
};

const handleCloseDialog = () => {
  emit('closeDialog', false);
  emit('closeDialogs', false);
  questDesc.value = '';
  level.value = '';
  checkTabList.value = [];
  radioVal.value = 1;
  appoint.value = '';
};

// 穿梭框确认
const shareConfirm = () => {
  let arr = [];
  shareId.value.map(v => {
    userData.value.map(k => {
      if (v === k.id) {
        arr.push(k.name);
      }
    });
  });
  appoint.value = arr.toString();
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

<template>
  <a-modal class="dialog" :visible="poseDialogVisible" title="我要提问" :width="800" @cancel="handleCloseDialog">
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
          <a-input v-model:value="checkTabList"></a-input>
          <a-button class="dialog-form-item-btn" type="primary" @click="editData">编辑</a-button>
        </div>
      </a-form-item>
    </a-form>
    <div v-if="hidePerson" class="dialog-center">
      <a-form style="display: flex" :label-col="{ style: { width: '130px' } }">
        <a-form-item label="可回复人员：">
          <a-radio-group v-model:value="radioVal" @change="e => getRadio(e.target.value)">
            <a-radio :value="1">知识专家</a-radio>
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
  </a-modal>
  <a-modal :maskClosable="false" :visible="poseDialogVisible1" title="站内分享" :width="650" @cancel="handleCloseShare">
    <a-transfer :target-keys="value" :show-search="true" :filter-option="filterMethod" :data-source="data"
      :render="item => item.title" @change="handleTransferChange" />
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="shareConfirm">确定</a-button>
        <a-button @click="shareConcel">取消</a-button>
      </span>
    </template>
  </a-modal>
  <a-modal :maskClosable="false" class="labelModal" v-model:visible="tabStatsDialogVisible" :width="600" title="标签应用"
    @cancel="closeTabStatsDialogFun">
    <div class="group" v-for="item in labelData" :key="item.nodeName">
      <div class="titleStyle mb-[8px]">
        <div :class="{ fontStyle: item.nodeLevel === '2' }" v-if="item.nodeLevel === '2'">{{ item.nodeName }}</div>
        <div :class="{ line: item.nodeLevel === '2' }"></div>
      </div>
      <a-checkbox-group class="checkGroup"
        v-if="item.children && item.children.length > 0 && item.nodeLevel === '2' && item.selectType === '1'"
        v-model:value="item.checkedValues" @change="(val) => handleCheckedKnowledgeAttributes(val, item)">
        <a-checkbox class="checkBox" v-for="val in item.children" :key="val.nodeName" :value="val.nodeName"
          @change="e => getCheckBox(val)">{{ val.nodeName }}</a-checkbox>
      </a-checkbox-group>
      <a-radio-group class="checkGroup"
        v-if="item.children && item.children.length > 0 && item.nodeLevel === '2' && item.selectType === '0'"
        v-model:value="item.modelVal" @change="getRadioClick(item.nodeName)">
        <a-radio class="checkBox" v-for="val in item.children" :key="val.nodeName" :value="val.nodeName"
          @change="() => getRadioData(val.nodeName, item, val)">{{ val.nodeName }}</a-radio>
      </a-radio-group>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="closeTabStatsDialogFun">确定</a-button>
        <a-button @click="closeTabStatsDialogFun">取消</a-button>
      </span>
    </template>
  </a-modal>
</template>

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
    font-size: 18px;
    color: #01aaed;
  }

  .line {
    height: 1px;
    width: 400px;
    background-color: #e4e4e4;
    line-height: 27px;
    margin-left: 20px;
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
