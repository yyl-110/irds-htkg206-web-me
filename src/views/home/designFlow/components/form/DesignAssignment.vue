<!-- 设计任务发放 -->
<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { downloadFileFromStream } from '@/utils/file';
import { Modal, Popconfirm, message } from 'ant-design-vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import dayjs from 'dayjs';
const userStore = useUserStore();
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  taskId: {
    require: false,
    type: Number,
    default: () => '',
  },
  code: {
    require: false,
    type: Number,
    default: () => 0,
  },
  isEdit: {
    require: false,
    type: Boolean,
    default: false,
  },
  selectedKeys: {
    require: false,
    type: String,
    default: false,
  },
  commitBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  saveBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  isShowBottomBtns: {
    require: false,
    type: Boolean,
    default: false,
  },
  editBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const emit = defineEmits(['toUpload', 'submitStatus']);
const loading = ref<boolean>(false);
const Timecooling = ref<boolean>(false);
const versioncolumns = ref<any>([
  {
    title: WeiI18n.t('版本号').value,
    dataIndex: 'versionNum',
    key: 'versionNum',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('描述').value,
    dataIndex: 'illustrate',
    key: 'illustrate',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('开始时间').value,
    dataIndex: 'startTime',
    key: 'startTime',
    width: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('结束时间').value,
    dataIndex: 'endTime',
    key: 'endTime',
    width: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('负责人').value,
    dataIndex: 'headName',
    key: 'headName',
    width: 100,
    align: 'center',
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('文件信息').value,
    dataIndex: 'Fileinformation',
    key: 'Fileinformation',
    minWidth: 200,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
const systemTableData = ref<any>([]);
const defaultExpandedKeys = ref<any>([]);
const getProjectBOM = (taskId: number, defaultExpandedKeys?: string[]) => {
  if (!defaultExpandedKeys) {
    loading.value = true;
  }
  if (Timecooling.value) {
    loading.value = false;
  }
  try {
    const obj: any = {
      taskId,
      defaultExpandedKeys,
      requestSource: '设计任务发放',
    };
    DesignApiInfo.getProjectBOMApi(obj).then(function (res) {
      if (res.data.code == 0) {
        systemTableData.value = res.data.data || [];
        loading.value = false;
        Timecooling.value = false;
      } else {
        message.error(res.data.msg);
      }
    });
  } catch (error) {
    loading.value = false;
    Timecooling.value = false;
    console.log(error);
  }
};
const selectedRowList = ref<any[]>([]);
const selectedRowkeys = ref<any[]>([]);
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRows: selectedRowList.value,
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
const expandChange = (expandedRows: any, expanded: any) => {
  getProjectBOM(props.taskId, updateDefaultExpandedKeys(expandedRows, expanded.id));
};
const updateDefaultExpandedKeys = (type: any, id: any) => {
  if (type) {
    defaultExpandedKeys.value.push(id);
    let uniqueValues = [...new Set(defaultExpandedKeys.value)];
    defaultExpandedKeys.value = uniqueValues;
  } else {
    defaultExpandedKeys.value = defaultExpandedKeys.value.filter(item => item != id);
  }
  return defaultExpandedKeys.value;
};
function exportAllTask() {
  const data: any = {};
  data.taskId = props.taskId;
  data.requestSource = '设计任务发放';
  DesignApiInfo.getExportAllTaskApi(data).then(function (res) {
    const fileName = props.taskInfoData.taskName + '-项目计划.xlsx';
    downloadFileFromStream(res, fileName);
  });
}
function toUpload(type: string) {
  if (props.isEdit) {
    return;
  }
  emit('toUpload', type);
}
const fosturn = ref<any>({}); // 需要操作的数据
const designString = ref(''); // 设计说明文件描述
const designUpload = ref<any>([]); // 设计说明文件上传
const designDialogDesign = ref(false); // 设计说明编辑弹窗
// 添加说明文件
const designDialogClick = (row: any) => {
  fosturn.value = row;
  designString.value = row.illustrate;
  designUpload.value = row.illustrateFile;
  designDialogDesign.value = true;
};
// 确认保存设计说明
const designOk = () => {
  let data: any = {};
  data.id = fosturn.value.id;
  data.illustrateFileNum = getIds(designUpload.value);
  data.illustrate = designString.value;
  DesignApiInfo.addDocumentApi(data).then(function (res) {
    if (res.data.code == 0) {
      designDialogDesign.value = false;
      getProjectBOM(props.taskId);
      message.success('保存设计说明文件成功');
    } else {
      message.error(res.data.msg);
    }
  });
};
function getIds(data: any) {
  let ids: any = [];
  data.forEach((item: any) => {
    ids.push(item.id);
  });
  return ids;
}
const jobNumber = ref('');
const memberPrimitiveData = ref<any>([]); // 角色列表
const memberDialogDesign = ref(false); // 选择角色弹窗
const userName = ref();
// 选负责人
const turnToTask = (row?: any) => {
  if (row) {
    fosturn.value = row;
    head.value = row.jobNumber;
  }
  if (jobNumber.value) {
    head.value = jobNumber.value;
  }
  const data: any = {
    project: props.code,
    userName: userName.value,
  };
  DesignApiInfo.sycnProjectUserApi(data).then(function (res) {
    if (res.data.code == 0) {
      memberPrimitiveData.value = res.data.data || [];
      // 如果已有 head 值（上次选择的负责人），尝试在新的列表中恢复选中状态
      // if (head.value) {
      //   const exists = (memberPrimitiveData.value || []).some((it: any) => String(it.userId) === String(head.value));
      //   if (exists) {
      //     roleselectedRowKeys.value = [String(head.value)];
      //     const matched = memberPrimitiveData.value.find((it: any) => String(it.userId) === String(head.value));
      //     headName.value = matched?.userName ?? headName.value;
      //     jobNumber.value = matched?.jobNumber ?? jobNumber.value;
      //   } else {
      //     // 若列表里不存在原先的负责人，清空选择
      //     roleselectedRowKeys.value = [];
      //   }
      // } else {
      //   roleselectedRowKeys.value = [];
      // }
      memberDialogDesign.value = true;
    } else {
      message.error(res.data.msg);
    }
  });
};

const rolecolumns = ref<any>([
  {
    title: WeiI18n.t('成员').value,
    dataIndex: 'userName',
    key: 'userName',
    minWidth: 80,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('工号').value,
    dataIndex: 'userId',
    key: 'userId',
    minWidth: 80,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('PDM职位').value,
    dataIndex: 'roleName',
    key: 'signStrroleNameing',
    minWidth: 80,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
const headName = ref('');
const head = ref('');
const roleselectedRowKeys = ref<any>([]);

const memberTableRef = ref<any>(null);

const rowSelection1 = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: 'radio',
    selectedRowKeys: roleselectedRowKeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      // 如果没有选中（可能是外部清空），清空相关字段
      if (!selectedRows || selectedRows.length === 0) {
        roleselectedRowKeys.value = [];
        headName.value = '';
        head.value = '';
        jobNumber.value = '';
        return;
      }
      headName.value = selectedRows[0].userName;
      head.value = selectedRows[0].userId;
      jobNumber.value = selectedRows[0].jobNumber;
      roleselectedRowKeys.value = selectedRowKeys;
    },
  };
});

// 允许点击行切换/取消选择（radio 点击已选项时可取消）
function memberCustomRow(record: any) {
  return {
    onClick: () => {
      const key = record.userId;
      if (roleselectedRowKeys.value && roleselectedRowKeys.value.length && roleselectedRowKeys.value[0] === key) {
        // 已选中，点击则取消选择
        roleselectedRowKeys.value = [];
        headName.value = '';
        head.value = '';
        jobNumber.value = '';
      } else {
        // 选择当前行
        roleselectedRowKeys.value = [key];
        headName.value = record.userName;
        head.value = record.userId;
        jobNumber.value = record.jobNumber;
      }
    },
  };
}

// 点击 radio 原生输入时也要支持取消选择 —— 通过监听 table DOM 中的 radio 点击
onMounted(() => {
  nextTick(() => {
    const el = memberTableRef.value?.$el || memberTableRef.value;
    if (!el) return;
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      // 匹配原生 radio input 或 antd radio wrapper
      if (!target) return;
      const radioEl = target.closest('input[type="radio"], .ant-radio') as HTMLElement | null;
      if (!radioEl) return;
      const tr = target.closest('tr');
      if (!tr) return;
      const rowKey = tr.getAttribute('data-row-key');
      if (!rowKey) return;
      // 如果点击的是已选项，则清空选择
      if (roleselectedRowKeys.value && roleselectedRowKeys.value.length && String(roleselectedRowKeys.value[0]) === String(rowKey)) {
        roleselectedRowKeys.value = [];
        headName.value = '';
        head.value = '';
        jobNumber.value = '';
        // 阻止默认行为，确保选中状态被清除
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // use capture to catch events before they stopPropagation internally
    el.addEventListener('click', handler, true);
    // 保存 handler 到 ref 以便移除
    (memberTableRef as any).__radioHandler = handler;
  });
});

onBeforeUnmount(() => {
  const el = memberTableRef.value?.$el || memberTableRef.value;
  const handler = (memberTableRef as any).__radioHandler;
  if (el && handler) {
    el.removeEventListener('click', handler, true);
  }
});

const isUpdate = ref(false);
const timeWin = ref(false);
const resetTurnToTask = () => {
  userName.value = '';
  turnToTask(fosturn.value);
};
//确定负责人
const memberOk = () => {
  if (isUpdate.value) {
    memberDialogDesign.value = false;
  } else {
    if (!head.value) {
      return message.error('请选择负责人');
    }
    let data: any = {};
    data.id = fosturn.value.id;
    data.head = head.value;
    DesignApiInfo.addHeadApi(data).then(function (res) {
      if (res.data.code == 0) {
        message.success(res.data.msg);
        getProjectBOM(props.taskId);
        memberDialogDesign.value = false;
      } else {
        message.error(res.data.msg);
      }
    });
  }
};
const rowStartTime = ref('');
const rowEndTime = ref('');
const startTime = ref('');
function datePickerFun(row: any, type: any) {
  if (type == 'begin') {
    rowStartTime.value = row.compareStartTime;
    taskPickerOptionsBegin(rowStartTime.value);
  } else {
    rowEndTime.value = row.compareStartTime;
    startTime.value = row.startTime;
    taskPickerOptionsEnd(rowEndTime.value);
  }
}
function taskPickerOptionsBegin(date: any) {
  // 仅允许选择今天及以后的日期，且同时保留原有基于 rowStartTime 的限制（必须 >= rowStartTime）
  const datas = date.$d ? date.$d : date;
  const dateTime = new Date(datas).setHours(0, 0, 0, 0);

  const today = new Date();
  const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  if (!rowStartTime.value) {
    // 没有 rowStartTime 时，只禁止今天之前的日期
    return dateTime < todayTime;
  }

  // 有 rowStartTime 时，必须同时满足 >= today 且 >= rowStartTime
  const rowTime = new Date(rowStartTime.value).setHours(0, 0, 0, 0);
  const threshold = Math.max(todayTime, rowTime);
  return dateTime < threshold;
}

function taskPickerOptionsEnd(date: any) {
  if (!rowEndTime.value) {
    return false;
  }
  let datas = date.$d ? date.$d : date;
  let beforeDays = new Date(datas).getTime() >= new Date(rowEndTime.value).getTime();
  let dateflag = new Date(startTime.value).getTime() > new Date(datas).getTime();
  return beforeDays && dateflag;
}
// 设计任务发放开始时间定义
const startPicker = (data: any, row: any) => {
  row.startTime = data;
  let obj: any = {};
  obj.id = row.id;
  obj.startTime = data;
  DesignApiInfo.addStartTimeApi(obj).then(function (res) {
    if (res.data.code == 0) {
      Timecooling.value = true;
      getProjectBOM(props.taskId);
      row.startTime = data;
    } else {
      message.error(res.data.msg);
      row.startTime = '';
    }
  });
  return row.startTime;
};

// 设计任务结束时间定义
const endPicker = (data: any, row: any) => {
  row.endTime = data;
  let obj: any = {};
  obj.id = row.id;
  obj.endTime = data;
  DesignApiInfo.addEndTimeApi(obj).then(function (res) {
    if (res.data.code == 0) {
      Timecooling.value = true;
      getProjectBOM(props.taskId);
      row.endTime = data;
    } else {
      message.error(res.data.msg);
      row.endTime = '';
    }
  });
  return row.endTime;
};
function submitStatus(num: any, operationType: any, nodeId?: any) {
  emit('submitStatus', num, operationType, nodeId);
}
const clearPor = () => {
  roleselectedRowKeys.value = [];
};
//click design task to determine whether there is a design description file
function startDes(row: any) {
  if (row.fileType === 1) {
    startDesApi(row);
  } else {
    Modal.confirm({
      title: '设计说明未添加确定要发放吗',
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      onOk: async () => {
        startDesApi(row);
      },
    });
  }
}
//start task interface
function startDesApi(row: any) {
  let obj: any = {};
  obj.id = row.id;
  obj.taskId = props.taskId;
  obj.userId = userStore.getUser.id;
  DesignApiInfo.sendTaskApi(obj).then(function (res) {
    if (res.data.code == 0) {
      message.success(res.data.msg);
      getProjectBOM(props.taskId);
    } else {
      message.error(res.data.msg);
    }
  });
}
const upStartTime = ref();
const upEndTime = ref();
const descriptionInfo = ref();
const updateFiles = ref<any>([]);
const upId = ref();
const versionInfo = ref<any>([]);
const isShowVersionDialog = ref(false);
const editSend = (row: any) => {
  upStartTime.value = row.startTime;
  upEndTime.value = row.endTime;
  headName.value = row.headName;
  head.value = row.jobNumber;
  jobNumber.value = row.jobNumber;
  descriptionInfo.value = row.illustrate;
  updateFiles.value = row.illustrateFile;
  timeWin.value = true;
  upId.value = row.id;
};
const getProjectVersionInfo = (id: any) => {
  versionInfo.value = [];
  let data = {
    taskId: props.taskId,
    id,
  };
  DesignApiInfo.getProjectVersionInfoApi(data).then(function (res) {
    if (res.data.code == 0) {
      isShowVersionDialog.value = true;
      versionInfo.value = res.data.data;
    }
  });
};
const pickerOptionsBegin = (date: any) => {
  if (upStartTime.value) return date.$d.getTime() < new Date(upStartTime.value).getTime();
  else return;
};

const startTimeVerdict = (val: any) => {
  if (upEndTime.value) {
    if (new Date(upEndTime.value).getTime() < new Date(upStartTime.value).getTime()) {
      upStartTime.value = '';
      return message.error('结束时间不能小于开始时间');
    }
  }
};
const endTimeVerdict = (val: any) => {
  if (!upStartTime.value) {
    return message.error('请先选择开始时间');
  }
  if (upStartTime.value) {
    if (new Date(upEndTime.value).getTime() < new Date(upStartTime.value).getTime()) {
      upEndTime.value = '';
      return message.error('结束时间不能小于开始时间');
    }
  }
};
const removeFile = (data: any) => {
  updateFiles.value = updateFiles.value.filter((item: any) => item.id !== data.id);
};
const pickerOptionsEnd = (date: any) => {
  if (upEndTime.value) return date.$d.getTime() > new Date(upEndTime.value).getTime();
  else return;
};

//update time
const getUpdateTime = () => {
  DesignApiInfo.updateTimeApi({
    id: upId.value,
    startTime: upStartTime.value,
    endTime: upEndTime.value,
    fileIds: getIds(updateFiles.value),
    descriptionInfo: descriptionInfo.value,
    head: head.value,
    userId: userStore.getUser.id,
    taskId: props.taskId,
  }).then(function (res) {
    if (res.data.code == 0) {
      timeWin.value = false;
      getProjectBOM(props.taskId);
    }
  });
};
const hideMemberDialogDesign = () => {
  timeWin.value = false;
  headName.value = '';
  head.value = '';
};
const versionTabShow = ref(false);
const versionTabData = ref([]);
const seeTable = (data: any) => {
  versionTabShow.value = true;
  versionTabData.value = [];
  versionTabData.value = data;
};
// 打开选择成员弹窗（保留 isUpdate 行为），不要强制清空 head，转为恢复选中
const showMemberDialogDesign = () => {
  isUpdate.value = true;
  // 保留现有 head/headName，如果需要浏览则直接加载列表并恢复选中
  turnToTask();
};
function Assignmentfilelist(uploadSuccesscData: any) {
  if (designUpload.value != null && designUpload.value.length > 0) {
    designUpload.value = designUpload.value.concat(uploadSuccesscData);
  } else {
    designUpload.value = uploadSuccesscData;
  }
}
function updateAssignmentfilelist(uploadSuccesscData: any) {
  if (updateFiles.value != null && updateFiles.value.length > 0) {
    updateFiles.value = updateFiles.value.concat(uploadSuccesscData);
  } else {
    updateFiles.value = uploadSuccesscData;
  }
}
const columns = ref<any>([
  {
    title: WeiI18n.t('超级GBOM').value,
    dataIndex: 'descript',
    key: 'descript',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('系统功能分类标识').value,
    dataIndex: 'techid',
    key: 'techid',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('设计说明').value,
    dataIndex: 'illus',
    key: 'illus',
    width: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('负责人').value,
    dataIndex: 'headName',
    key: 'headName',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('状态').value,
    dataIndex: 'sendStatus',
    key: 'sendStatus',
    width: 80,
    align: 'center',
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('开始时间').value,
    dataIndex: 'startTime',
    key: 'startTime',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('完成时间').value,
    dataIndex: 'endTime',
    key: 'endTime',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'action',
    key: 'action',
    width: 250,
    fixed: 'right',
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);

const versionTabcolumns = ref<any>([
  {
    title: WeiI18n.t('文件编号').value,
    dataIndex: 'docNumber',
    key: 'docNumber',
    width: 80,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('文件url').value,
    dataIndex: 'url',
    key: 'url',
    width: 80,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('文件名').value,
    dataIndex: 'originalFilename',
    key: 'originalFilename',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
function handleResizeColumn(w, col) {
  col.width = w;
}
watch(
  () => systemTableData.value,
  newVal => {
    if (newVal) {
      nextTick(() => {
        const numArray = newVal[0].defaultExpandedKeys.map(Number);
        defaultExpandedKeys.value = numArray;
      });
    }
  },
  {
    deep: true,
  },
);
defineExpose({ getProjectBOM, Assignmentfilelist, updateAssignmentfilelist });
</script>

<template>
  <div class="container">
    <div class="box">
      <a-row class="elrowheight">
        <div class="top-block">
          <div class="block-inner">
            <img class="pic" :src="taskInfoData.picUrl" />
            <div class="dec-wrap">
              <div class="t">{{ taskInfoData.taskName }}</div>
              <div class="tm">平台名称：{{ taskInfoData.platformName }}</div>
              <div class="tm">任务时间：{{ taskInfoData.startTime }} ~ {{ taskInfoData.endTime }}</div>
              <div class="pr">
                <span>当前进度：{{ taskInfoData.taskPercentage }}%</span><span>距截止还剩{{ taskInfoData.deadlineDays }}天</span>
              </div>
              <div class="user-wrap">
                <a-progress status="active" :percent="taskInfoData?.taskPercentage" class="elprogress" />
                <div class="create-pop">
                  创建人：<span class="user"><img src="../../../../../assets/workbench/avatar.jpg" alt="" />{{ taskInfoData.createUserName }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-title">
          <i></i>
          <span>设计任务发放</span>
        </div>
        <div style="width: 100%; margin-left: 16px; margin-bottom: 16px">
          <a-button type="primary" @click="exportAllTask"><EpcIcon type="icon-jihuadaochu" style="font-size: 16px" />计划导出</a-button>
        </div>
        <div style="margin: 0px 20px 28px 16px; width: 100%">
          <a-table
            style="margin-top: 5px; margin-right: 16px"
            :loading="loading"
            :scroll="{ y: 400 }"
            :locale="localeA"
            row-key="id"
            :pagination="false"
            :data-source="systemTableData"
            :columns="columns"
            @resizeColumn="handleResizeColumn"
            @expand="expandChange"
            v-model:expandedRowKeys="defaultExpandedKeys"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <!-- 设计说明列：当 pnum === "0" 显示 '/'，否则按原逻辑 -->
              <template v-if="column.dataIndex === 'illus'">
                <div v-if="record.pnum === '0'">/</div>
                <div v-else>
                  <div v-if="record.button == 1">
                    <span v-if="isEdit || record.sendStatus == 2 || record.sign == 1">{{ record.fileType == 1 ? '已添加' : '添加说明' }}</span>
                    <a color="blue" v-else style="cursor: pointer" @click="designDialogClick(record)" type="primary"> {{ record.fileType == 1 ? '已添加' : '添加说明' }}</a>
                  </div>
                </div>
              </template>

              <!-- 负责人列：当 pnum === "0" 显示当前登录人，否则按原逻辑 -->
              <template v-if="column.dataIndex === 'headName'">
                <div style="display: flex">
                  <div style="width: 100px">
                    {{ record.pnum === '0' ? userStore.getUser?.nickname || userStore.getUser?.nickname || '-' : record.headName }}
                  </div>
                  <div v-if="record.button == 1 && record.pnum !== '0'">
                    <span v-if="isEdit || record.sendStatus == 2 || record.sign == 1">{{ '浏览' }}</span>
                    <a color="blue" v-else style="cursor: pointer" @click="turnToTask(record)" type="primary"> {{ '浏览' }}</a>
                  </div>
                </div>
              </template>

              <!-- 状态列：当 pnum === "0" 显示 '/'，否则按原逻辑 -->
              <template v-if="column.dataIndex === 'sendStatus'">
                <div>
                  <span v-if="record.pnum === '0'">/</span>
                  <div v-else>
                    <!-- {{record.taskStatus}} -->
                    <span v-if="record.taskStatus == '正在工作'" style="color: #e6a23c">正在工作</span>
                    <span v-if="record.taskStatus == '已完成'" style="color: #67c23a">已完成</span>
                    <span v-if="record.taskStatus == '待启动'">待启动</span>
                    <span v-if="record.taskStatus == '/'">/</span>
                  </div>
                </div>
              </template>
              <!-- 系统功能分类列-->
              <template v-if="column.dataIndex === 'techid'">
                <div>
                  <span v-if="record.pnum === '0'">/</span>
                  <span v-else>{{ record.techid }}</span>
                </div>
              </template>

              <template v-if="column.dataIndex === 'startTime'">
                <a-date-picker
                  v-if="record.button == 1"
                  :disabled-date="taskPickerOptionsBegin"
                  :locale="locale"
                  @focus="datePickerFun(record, 'begin')"
                  @change="startPicker($event, record)"
                  v-model:value="record.startTime"
                  :disabled="isEdit || record.sendStatus == 2 || record.sign == 1"
                  format="YYYY-MM-DD "
                  value-format="YYYY-MM-DD"
                  style="text-align: left"
                  :placeholder="'开始时间'" />
              </template>
              <template v-if="column.dataIndex === 'endTime'">
                <a-date-picker
                  v-if="record.button == 1"
                  :disabled-date="taskPickerOptionsEnd"
                  :locale="locale"
                  @focus="datePickerFun(record, 'end')"
                  @change="endPicker($event, record)"
                  v-model:value="record.endTime"
                  :disabled="isEdit || record.sendStatus == 2 || record.sign == 1"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="text-align: left"
                  :placeholder="'完成时间'" />
              </template>
              <!-- 操作列：当 pnum === '0' 显示 '/'，否则按原逻辑渲染操作按钮 -->
              <template v-if="column.dataIndex === 'action'">
                <div v-if="record.pnum === '0'">/</div>
                <div v-else style="display: flex; justify-content: space-between">
                  <div v-if="record.sendStatus == 1">
                    <div v-if="isEdit || record.button == 0 || record.sign == 1"><EpcIcon type="icon-fafang" style="font-size: 15px" /> 发放</div>
                    <a v-else @click.stop="startDes(record)"><EpcIcon type="icon-fafang" style="font-size: 15px" /> 发放</a>
                  </div>
                  <div v-else size="small">
                    <span :style="{ color: '#52c41a', fontWeight: 600 }"> <EpcIcon type="icon-fafang" style="font-size: 15px" />已发放 </span>
                  </div>
                  <div v-if="record.sendStatus == 2">
                    <div v-if="isEdit || String(record.taskStatus) === '已完成'">编辑</div>
                    <a v-else @click.stop="editSend(record)"><EpcIcon type="icon-edit" style="font-size: 15px" />编辑</a>
                  </div>
                  <a v-if="record.hasVersion" @click.stop="getProjectVersionInfo(record.id)">
                    <EpcIcon type="icon-banbenlishi" style="font-size: 15px" />
                    查看版本
                  </a>
                </div>
              </template>
            </template>
          </a-table>
        </div>
        <div class="foot-btn">
          <div class="backBtn" v-if="isShowBottomBtns">
            <a-button type="primary" @click="submitStatus(6, 1, selectedKeys)" :disabled="commitBtnStatus">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button type="primary" class="btn_left" @click="submitStatus(6, 0)" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>
  <!-- 设计说明编辑 -->
  <a-modal v-model:visible="designDialogDesign" style="width: 50%" :confirm-loading="$isPending()" :mask-closable="false" :z-index="1000" title="设计说明编辑">
    <div style="width: 100%; background: #fff; margin-top: 4px">
      <section style="width: 100%; overflow: hidden; background-color: #ffffff">
        <a-row>
          <a-col :span="24">
            <div style="margin: 0px 0 10px 0">
              <div class="upload-layout" style="margin-left: 0px">
                <div style="line-height: 30px">设计说明文件：</div>
                <div class="upload-btn-wrap">
                  <div
                    class="upload-btn"
                    :disabled="isEdit"
                    @click="toUpload('设计说明')"
                    :style="{ cursor: isEdit ? 'not-allowed' : 'pointer', background: isEdit ? '#f5f5f5' : '' }">
                    <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 20px; position: absolute; left: 35px; top: 20px" />
                    <div v-if="!designUpload.length" @click="toUpload('设计说明')">上传文件</div>
                    <div v-if="designUpload.length" @click="toUpload('设计说明')">重新上传</div>
                  </div>
                  <div class="upload-dec">
                    <div>文件要求</div>
                    <p>格式：支持格式PDF、Word文档（DOCX）、CAD文件</p>
                    <p>文件大小限制：对单个文件大小有限制，每个文档不超过100M</p>
                  </div>
                </div>
              </div>
              <div v-for="(item, index) in designUpload" :key="index">
                <a v-if="item.originalFilename" type="primary" :href="item.url" target="_blank">{{ item.originalFilename }}</a>
              </div>
            </div>
          </a-col>
          <a-col :span="24">
            <a-textarea class="textarea" :disabled="isEdit" v-model:value="designString" :rows="4" placeholder="设计描述" />
          </a-col>
        </a-row>
      </section>
    </div>

    <template #footer>
      <a-button type="primary" @click="designOk()"> 确定 </a-button>
      <a-button @click="designDialogDesign = false">取消</a-button>
    </template>
  </a-modal>

  <!-- 选择成员弹窗 -->
  <a-modal v-model:visible="memberDialogDesign" style="width: 40%" title="选择角色" draggable :z-index="1200" :mask-closable="false">
    <div class="member-modal-body">
      <div class="member-search-row">
        <a-input v-model:value="userName" style="width: 240px" placeholder="请输入关键字" />
        <a-button type="primary" @click="turnToTask(fosturn)" style="margin-left: 10px"><EpcIcon type="icon-fangdajing" style="font-size: 12px" />查询</a-button>
        <a-button @click="resetTurnToTask" style="margin-left: 10px"><EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
      </div>

      <div class="member-table-wrap">
        <a-table
          :scroll="{ x: 400 }"
          row-key="userId"
          :locale="localeA"
          :loading="loading"
          :pagination="false"
          :data-source="memberPrimitiveData"
          :columns="rolecolumns"
          :row-selection="rowSelection1"
          :customRow="memberCustomRow"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        </a-table>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" @click="memberOk()"> 确定 </a-button>
      <a-button @click="memberDialogDesign = false">取消</a-button>
    </template>
  </a-modal>
  <!-- 更新时间 -->
  <a-modal style="width: 40%" v-model:visible="timeWin" title="编辑" draggable>
    <div>
      <a-date-picker
        :disabledDate="pickerOptionsBegin"
        :locale="locale"
        @change="startTimeVerdict($event)"
        v-model:value="upStartTime"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 160px; text-align: left"
        :placeholder="'开始时间'" />
      <a-date-picker
        :disabledDate="pickerOptionsEnd"
        :locale="locale"
        @change="endTimeVerdict($event)"
        v-model:value="upEndTime"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 160px; margin-left: 30px; text-align: left"
        :placeholder="'完成时间'" />
    </div>
    <section style="width: 100%; overflow: hidden; background-color: #ffffff">
      <a-row>
        <a-col :span="24">
          <div style="margin: 10px 0">
            <div class="upload-layout" style="margin-left: 0px">
              <div style="line-height: 30px">设计说明文件：</div>
              <div class="upload-btn-wrap">
                <div
                  class="upload-btn"
                  @click="toUpload('更新设计说明')"
                  :disabled="isEdit"
                  :style="{ cursor: isEdit ? 'not-allowed' : 'pointer', background: isEdit ? '#f5f5f5' : '' }">
                  <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 20px; position: absolute; left: 35px; top: 20px" />
                  <div v-if="!designUpload.length" @click="toUpload('更新设计说明')">上传文件</div>
                  <div v-if="designUpload.length" @click="toUpload('更新设计说明')">重新上传</div>
                </div>
                <div class="upload-dec">
                  <div>文件要求</div>
                  <p>格式：支持格式PDF、Word文档（DOCX）、CAD文件</p>
                  <p>文件大小限制：对单个文件大小有限制，每个文档不超过100M</p>
                </div>
              </div>
            </div>
            <div v-for="(item, index) in updateFiles" :key="index">
              <div>
                <a v-if="item.originalFilename" type="primary" :href="item.url" target="_blank">{{ item.originalFilename }} </a>
                <span style="margin-left: 10px; cursor: pointer" @click="removeFile(item)"> <EpcIcon type="icon-shanchu2" style="font-size: 15px" /></span>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="24">
          <a-textarea class="textarea" v-model:value="descriptionInfo" :rows="4" placeholder="设计描述" />
        </a-col>
      </a-row>
    </section>

    <a-row style="margin-top: 20px">
      <a-input v-model:value="headName" style="width: 240px" disabled placeholder="请选择负责人" />
      <a-button type="primary" style="margin-left: 10px" @click="showMemberDialogDesign">浏览</a-button>
    </a-row>

    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="getUpdateTime()"> 确定 </a-button>
        <a-button @click="hideMemberDialogDesign()">取消</a-button>
      </span>
    </template>
  </a-modal>

  <a-modal style="width: 60%" v-model:visible="isShowVersionDialog" title="版本信息">
    <a-table
      :scroll="{ x: 400, y: 400 }"
      row-key="userId"
      :locale="localeA"
      :loading="loading"
      :pagination="false"
      :data-source="versionInfo"
      :columns="versioncolumns"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'Fileinformation'">
          <div style="color: blue; cursor: pointer" v-if="record.ckPdmFileInfos && record.ckPdmFileInfos.length" @click="seeTable(record.ckPdmFileInfos)">查看</div>
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="isShowVersionDialog = false"> 确定 </a-button>
      <a-button @click="isShowVersionDialog = false">取消</a-button>
    </template>
  </a-modal>
  <a-modal style="width: 800px" v-model:visible="versionTabShow" title="文件信息">
    <a-table
      :scroll="{ x: 400, y: 400 }"
      row-key="userId"
      :locale="localeA"
      :pagination="false"
      :data-source="versionTabData"
      :columns="versionTabcolumns"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
    </a-table>
    <template #footer>
      <a-button type="primary" @click="versionTabShow = false"> 确定 </a-button>
      <a-button @click="versionTabShow = false">取消</a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
.box {
  width: 100%;
  height: calc(100vh - 80px);
  background: #fff;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
}

/* 选择成员弹窗：固定高度，头部/搜索/底部固定，中间表格滚动 */
.member-modal-body {
  width: 100%;
  background: #fff;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  height: 480px; /* 可按需调整高度 */
}
.member-search-row {
  padding: 12px 0;
  flex: 0 0 auto;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 3;
}
.member-table-wrap {
  flex: 1 1 auto;
  overflow-y: auto;
}
</style>
