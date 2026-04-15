<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { Tooltip } from 'ant-design-vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse';
import { useRoute } from 'vue-router';
import { decryptValue } from '@/utils';
import { AdminApiSystemCheckFlowInfoApi } from '@/api/tags/check/计算流程后台';
import PageTemplateInfo from './pageTemplateInfo.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useRouter } from 'vue-router';
const route = useRoute();
const pageHeight = ref('');
const getImgObj = ref<any>({});
const hideNext = ref(true);
const setpArr = ref([]);
const treeData = ref<any>([]);
const currentNodeKey = ref<any>('');
const newExpandedKeys = ref<any>([]);
const treeObj = ref<any>({});
const selectPageData = ref<any>({});
const formKeyArr = ref<any>([]);
const proId = ref<any>('');
const calcId = ref<any>('');
const statusArr = ref<any>([]);
const statusZero = ref<any>([]);
// 当前条数据
const objdata = ref<any>({});
// 保存数据给子组件的标识
const flagSon = ref<any>(false);
//  步骤条
const active = ref<any>(0);
const saveBtnStyle = ref<any>(false);
const saveBtn = ref<any>(false);
const previous = ref<any>(false);
const complate = ref<any>(false);
const goBackBtn = ref<any>(false);
const router = useRouter();
// 获取选中的formKey
const selectFormKey = ref<any>([]);

const paramsArr = ref<any>([]);
// 反显后的数据
const showBackArr = ref<any>([]);
// 流程关联的树节点
const treeId = ref<any>('');
// 流程分类编号
const parentId = ref<any>('');
// js文件路径
const jsfilePath = ref<any>('');
// 页面初始化方法
const initCallMethod = ref<any>('');
// 反显的图片
const showBackImg = ref<any>([]);
// 保存当前页面的formKey
const curFormKey = ref<any>('');
// 当前页面formKey
const pageFormKey = ref<any>('');
// 保存当前高亮显示id
const heightLight = ref<any>('');
const pageImgStr = ref<any>('');
const paramData = ref<any>({});
// 点击树节点获得formKey
const clickFormKey = ref<any>({});
const getWindowHeight = () => {
  pageHeight.value = 'calc(' + 100 + 'vh - 203px)';
};

watch(
  () => route.query,
  newQuery => {
    let parm = decryptValue(newQuery.parms);
    let paramStr = JSON.parse(parm);
    getImgObj.value = paramStr;

    let selectPageDataa = decryptValue(newQuery.selectPageData);
    let selectPageDataStr = JSON.parse(selectPageDataa);
    selectPageData.value = selectPageDataStr;

    let formKeyDataA = decryptValue(newQuery.formKeyData);
    let formKeyDataStr = JSON.parse(formKeyDataA);
    formKeyArr.value = formKeyDataStr;

    calcId.value = decryptValue(newQuery.calcId);
    proId.value = decryptValue(newQuery.proId);
  },
  { immediate: true, deep: true } // 立即执行一次，并监听变化
);

onMounted(() => {
  getWindowHeight();
  getStepArr();
});

// 获取新的步骤记录
const getStepArr = async () => {
  const params = {
    processDefinitionId: getImgObj.value.proId,
  };
  const res = await AdminApiSystemCheckFlowInfoApi.allTasksForDefinitionProcess(params);
  setpArr.value = res.data.data;
  if (setpArr.value.length === 1 || setpArr.value.length === 0) {
    hideNext.value = false;
  } else {
    hideNext.value = true;
  }
  // 拼凑树数据
  treeObj.value = {
    name: getImgObj.value.proname,
    parentId: 0,
    childrenList: [],
    id: '000',
  };
  newExpandedKeys.value = [];
  newExpandedKeys.value.push(treeObj.value.id);
  treeData.value = [];
  treeObj.value.childrenList.push(...res.data.data);
  currentNodeKey.value = res.data.data[0].id;
  treeData.value.push(treeObj.value);
  getStatusInter();
};

// 更新状态
const updateStatus = (val: any) => {
  flagSon.value = val;
};

// 获取保存按钮的状态
const getFlag = (val: any) => {
  saveBtn.value = val;
  flagSon.value = val;
  getParams();
  if (val) {
    // showBack("");
  }
};

//获取参数知识
const getTempalteInfoSuccess = (data: any) => {};

//添加行成功
const afterCreateRowSuccess = () => {};

// 新保存数据
const saveData = () => {
  flagSon.value = true;
  statusArr.value.forEach((v: any, index: any) => {
    if (active.value === index) {
      objdata.value = v;
    }
  });
  updateStatusInter(objdata.value.id, '2', 'save');
  changeBtnStyle();
};

// 下一步
const nextStep = () => {
  debugger;
  flagSon.value = true;
  if (setpArr.value.length > 0 && active.value < setpArr.value.length) {
    statusArr.value.forEach((v: any, index: any) => {
      debugger;
      if (active.value === index) {
        objdata.value = v;
        if (index < statusArr.value.length - 1) {
          showBack(statusArr.value[index + 1].formKey);
        }
      }
    });
    setpArr.value.forEach((v, index) => {
      debugger;
      if (active.value === index) {
        if (index < setpArr.value.length - 1) {
        }
      }
    });
    active.value++;
  }
  updateStatusInter(objdata.value.id, '1', 'saveOrSub');
  // 需要给后端选中当前条以上的formKey,不包括当前条
  selectFormKey.value = [];
  selectFormKey.value.push(...formKeyArr.value.slice(0, active.value));
};

// 点击完成的操作
const complateInfo = () => {
  flagSon.value = true;
  updateStatusInter(objdata.value.id, '2', 'complate');
  // store.dispatch('dict/setFormKey', statusArr.value[statusArr.value.length - 1].formKey);
  // 需要判断n个页面的状态，都为2的话就传2，只要有一个不为2就传1，主列表更新状态需要
  // 等所有的状态都更新完成再更新主表数据
  setTimeout(() => {
    updateData();
  }, 1000);
};

const goBack = () => {
  router.go(-1);
  return;
};

const updateData = async () => {
  let status;
  debugger;
  if (treeData.value && treeData.value.length > 0) {
    debugger;
    treeData.value[0].childrenList.forEach((v: any) => {
      debugger;
      if (v.pageStatus === '2') {
        status = '2';
      } else {
        status = '1';
      }
    });
  }
  const params = {
    id: selectPageData.value.id,
    projectState: status,
  };
  const res = await AdminApiSystemCheckFlowInfoApi.updateCalculateProjectState(params);
};

// 更新状态的接口
const updateStatusInter = async (id: any, num: any, type: any) => {
  debugger;
  const params = {
    id: String(id),
    pageStatus: num ? num : String(1),
    type: type,
  };
  const res = await AdminApiSystemCheckFlowInfoApi.updateCheckCalculateResultStatus(params);
  let data = JSON.parse(JSON.stringify(treeData.value));
  nextTick(() => {
    data[0].childrenList.map((v: any) => {
      res.data.data.result.map((k: any) => {
        if (v.formKey === k.formKey) {
          v.pageStatus = k.pageStatus;
        }
      });
    });
    treeData.value = data;
  });
  getStatusInter();
};

// 获取关联参数
const getParams = async () => {
  const params = {
    pageList: selectFormKey.value,
    checkPageCalculateId: selectPageData.value.id ? String(selectPageData.value.id) : String(selectPageData.value.id), // 主页面id
  };
  const res = await AdminApiSystemCheckFlowInfoApi.getAssociationParameters(params);
  paramsArr.value = res.data.data.result;
};

// 获取状态的接口
const getStatusInter = async () => {
  const params = {
    calculateId: selectPageData.value.id,
    proId: getImgObj.value.proId,
  };
  const res = await AdminApiSystemCheckFlowInfoApi.getCalculateResultStatus(params);
  statusArr.value = res.data.data.result;
  statusZero.value = [];
  statusArr.value.map((v: any, index: any) => {
    if (v.pageStatus === '1') {
      objdata.value = v;
      active.value = index;
      if (treeObj.value.childrenList && treeObj.value.childrenList.length > 0) {
        treeObj.value.childrenList.map((k: any) => {
          if (v.formKey === k.formKey) {
            currentNodeKey.value = k.id;
            if (!flagSon.value) {
              showBack(v.formKey);
            } else {
              return;
            }
          }
        });
      }
    }
    if (treeObj.value.childrenList && treeObj.value.childrenList.length > 0) {
      treeObj.value.childrenList.map((k: any) => {
        if (v.formKey === k.formKey) {
          k.pageStatus = v.pageStatus;
        }
      });
    }
  });
  if (Object.keys(objdata.value).length === 0) {
    objdata.value = statusArr.value[0];
    active.value = 0;
  }
  changeBtnStyle();
};

const changeBtnStyle = () => {
  debugger;
  //获取当前选中节点ID
  statusArr.value.forEach((v: any, index: any) => {
    if (active.value === index) {
      objdata.value = v; //选中节点序号
    }
  });

  if (active.value == 0) {
    if (active.value == setpArr.value.length - 1) {
      //如果第一个节点也是最后一个节点
      saveBtnStyle.value = true;
      saveBtn.value = true;
      previous.value = true;
      hideNext.value = false;
      complate.value = false;
      goBackBtn.value = true;
    } else {
      //如果是第一个节点
      if (objdata.value.pageStatus == 0) {
        // 0：未设计、1：设计中、2：设计完成，3：已保存数据但需要重新设计
        saveBtnStyle.value = false;
        previous.value = true;
        saveBtn.value = true;
        hideNext.value = false;
        complate.value = false;
        goBackBtn.value = true;
      } else if (objdata.value.pageStatus == 1) {
        saveBtnStyle.value = true;
        saveBtn.value = true;
        previous.value = true;
        hideNext.value = true;
        complate.value = false;
        goBackBtn.value = true;
      } else if (objdata.value.pageStatus == 2) {
        saveBtnStyle.value = true;
        saveBtn.value = true;
        previous.value = true;
        hideNext.value = true;
        complate.value = false;
        goBackBtn.value = true;
      } else if (objdata.value.pageStatus == 3) {
        saveBtnStyle.value = false;
        saveBtn.value = true;
        previous.value = true;
        hideNext.value = false;
        complate.value = false;
        goBackBtn.value = true;
      }
    }
  } else {
    if (active.value == setpArr.value.length - 1) {
      if (objdata.value.pageStatus == 0) {
        // 0：未设计、1：设计中、2：设计完成，3：已保存数据但需要重新设计
        saveBtnStyle.value = false;
        saveBtn.value = true;
        previous.value = false;
        hideNext.value = false;
        complate.value = false;
        goBackBtn.value = false;
      } else if (objdata.value.pageStatus == 1) {
        saveBtnStyle.value = true;
        saveBtn.value = true;
        previous.value = false;
        hideNext.value = false;
        complate.value = true;
        goBackBtn.value = false;
      } else if (objdata.value.pageStatus == 2) {
        saveBtnStyle.value = true;
        saveBtn.value = true;
        previous.value = false;
        hideNext.value = false;
        complate.value = false;
        goBackBtn.value = false;
      } else if (objdata.value.pageStatus == 3) {
        saveBtnStyle.value = false;
        saveBtn.value = true;
        previous.value = false;
        hideNext.value = false;
        complate.value = false;
        goBackBtn.value = false;
      }
    } else {
      if (objdata.value.pageStatus == 0) {
        // 0：未设计、1：设计中、2：设计完成，3：已保存数据但需要重新设计
        saveBtnStyle.value = false;
        saveBtn.value = true;
        previous.value = false;
        hideNext.value = false;
        complate.value = false;
        goBackBtn.value = false;
      } else if (objdata.value.pageStatus == 1) {
        saveBtnStyle.value = true;
        saveBtn.value = true;
        previous.value = false;
        hideNext.value = true;
        complate.value = false;
        goBackBtn.value = false;
      } else if (objdata.value.pageStatus == 2) {
        saveBtnStyle.value = true;
        saveBtn.value = true;
        previous.value = false;
        hideNext.value = true;
        complate.value = false;
        goBackBtn.value = false;
      } else if (objdata.value.pageStatus == 3) {
        saveBtnStyle.value = false;
        saveBtn.value = true;
        previous.value = false;
        hideNext.value = false;
        complate.value = false;
        goBackBtn.value = false;
      }
    }
  }
};

// 初始化新的反显接口总数据
const showBack = async (data: any) => {
  debugger;
  showBackArr.value = [];
  let params = {
    parentId: '',
    formKey: '',
  };
  if (data) {
    params.parentId = selectPageData.value.id;
    params.formKey = data;
  } else {
    params.parentId = selectPageData.value.id ? String(selectPageData.value.id) : '';
    params.formKey = clickFormKey.value.formKey ? String(clickFormKey.value.formKey) : String(formKeyArr.value[0]);
  }
  const res = await AdminApiSystemCheckFlowInfoApi.getCalculateParamList(params);
  showBackArr.value = res.data.data.paramVOList;
  treeId.value = res.data.data.treeId;
  parentId.value = params.parentId;
  jsfilePath.value = res.data.data.jsfilePath;
  initCallMethod.value = res.data.data.initCallMethod;
  showBackImg.value = res.data.data.imageDataVOList;
  curFormKey.value = params.formKey;
  pageFormKey.value = res.data.data.pageFormKey;
  pageImgStr.value = res.data.data.pageImgStr;
  paramData.value = res.data.data;
};

const handleNodeClick = (selectedKeys, eventInfo) => {
  const node = eventInfo.selectedNodes[0];
  currentNodeKey.value = node.id;
  flagSon.value = true;
  clickFormKey.value = node;
  selectFormKey.value = [];
  if (setpArr.value.length > 1) {
    formKeyArr.value.map((item: any, index: any) => {
      if (item === node.formKey) {
        // 把选中当前条之前的formKey保存一下
        selectFormKey.value.push(...formKeyArr.value.slice(0, index));
      }
    });
    statusArr.value.map((v: any, index: any) => {
      if (v.formKey === node.formKey) {
        objdata.value = v;
        active.value = index;
      }
    });
  }
  showBack(node.formKey);
  judgeStep();
  getParams();
  changeBtnStyle();
};

// 判断点击侧边栏上下一步的按钮
const judgeStep = () => {
  if (formKeyArr.value.length > 1) {
    formKeyArr.value.map((v: any, index: any) => {
      if (v === clickFormKey.value.formKey) {
        active.value = index;
        if (index !== 0 && index !== setpArr.value.length - 1) {
          previous.value = false;
        }
        if (index === setpArr.value.length - 1) {
          previous.value = false;
        }
        if (index === 0) {
          previous.value = true;
        }
      }
    });
  }
};
// 获取状态颜色
const getStatusColor = (pageStatus: any) => {
  switch (pageStatus) {
    case '0':
      return '#666';
    case '1':
      return '#E6A23C';
    case '2':
      return '#67C23A';
    case '3':
      return '#1971ff';
    default:
      return 'inherit';
  }
};

const getStatusClass = (pageStatus: any) => {
  // alert(pageStatus);
  return `status-${pageStatus}`;
};

const {
  leftTreeCollapsed,
  leftTreePaneSize,
  rightTreePaneSize,
  minExpanded,
  onSplitpanesResized,
  toggleLeftTreePanel,
  splitToggleStyle,
} = useSplitpanesTreeCollapse();
</script>
<template>
  <div class="drawerContent">
    <div class="splitpanes-tree-collapse-wrap">
    <Splitpanes class="default-theme sbom" @resized="onSplitpanesResized">
      <Pane :min-size="leftTreeCollapsed ? 0 : minExpanded" :size="leftTreePaneSize" class="splitpane-cls marginstyle">
        <a-tree
          ref="treeRef"
          :highlight-current="true"
          :selected-keys="[currentNodeKey]"
          v-model:expanded-keys="newExpandedKeys"
          :tree-data="treeData"
          :field-names="{ children: 'childrenList', title: 'name', key: 'id' }"
          :draggable="true"
          :style="{
            width: '100%',
            overflowY: 'auto',
            height: 'calc(100vh - 150px)',
          }"
          @select="handleNodeClick"
          :expand-on-click-node="false">
          <template #title="{ name, pageStatus }">
            <span :class="getStatusClass(pageStatus)">
              {{ name }}
            </span>
          </template>
        </a-tree>
      </Pane>
      <Pane class="splitpane-cls" :size="rightTreePaneSize">
        <div class="splitCenter">
          <PageTemplateInfo
            :objdata="objdata"
            :flagSon="flagSon"
            :showBackArr="showBackArr"
            :treeId="treeId"
            :parentId="parentId"
            :pageFormKey="pageFormKey"
            :pageHeight="pageHeight"
            :showBackImg="showBackImg"
            :jsfilePath="jsfilePath"
            :initCallMethod="initCallMethod"
            :pageImgStr="pageImgStr"
            :formKeyArr="formKeyArr"
            :proId="proId"
            :calcId="calcId"
            :selectPageData="selectPageData"
            :paramData="paramData"
            @on-click="updateStatus"
            @changeData="getFlag"
            @getTempalteInfoSuccess="getTempalteInfoSuccess"
            @afterCreateRowSuccess="afterCreateRowSuccess"
            @changData="getFlag"></PageTemplateInfo>
          <div class="botBtn">
            <a-button v-if="saveBtnStyle" :disabled="saveBtn" type="primary" @click="saveData">
              <EpcIcon type="icon-baocun" style="font-size: 15px" />
              保存</a-button
            >
            <!-- <a-button :icon="Top" :disabled="previous" :class="previous === true ? 'disBgc' : 'bgc'" @click="backStep">上一步</a-button> -->
            <a-button v-if="hideNext" type="primary" style="margin-left: 10px" @click="nextStep"> <EpcIcon type="icon-paixujiantou" style="font-size: 12px" />提交</a-button>
            <a-button v-if="complate" type="primary" style="margin-left: 10px" @click="complateInfo"> <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />完成</a-button>
            <a-button v-if="goBackBtn" type="primary" style="margin-left: 10px" @click="goBack"> <EpcIcon type="icon-fanhui" style="font-size: 12px" />返回</a-button>
          </div>
        </div>
      </Pane>
    </Splitpanes>
    <Tooltip :title="leftTreeCollapsed ? $t('展开分类') : $t('折叠分类')">
      <button
        type="button"
        class="splitpanes-tree-collapse-wrap__toggle"
        :style="splitToggleStyle"
        @click="toggleLeftTreePanel"
        @mousedown.stop>
        <LeftOutlined v-if="!leftTreeCollapsed" />
        <RightOutlined v-else />
      </button>
    </Tooltip>
    </div>
  </div>
</template>
<style lang="less" scoped>
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  display: flex;
  background-color: #ffffff !important;
}
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}
.status-0 {
  color: #666;
}
.status-1 {
  color: #e6a23c;
}
.status-2 {
  color: #67c23a;
}
.status-3 {
  color: #1971ff;
}
</style>
