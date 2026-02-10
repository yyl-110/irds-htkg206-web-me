<!-- 设计任务发放 -->
<script lang="ts" setup>
import { ref, watch, nextTick, computed } from 'vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { downloadFileFromStream } from '@/utils/file';
import { Modal, Popconfirm, message } from 'ant-design-vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { handleEpcDownload } from '@/utils/file';
import Empty from '@/components/Empty/index.vue';
import dayjs from 'dayjs';
import { sortermethod, findNodeByIdFromKey } from '@/utils/tools';
import { openModule, assembleModule, openTopAsmTemplateInterfaceModel, apiRenameModel } from '@/utils/webSocket';
const userStore = useUserStore();
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  projectId: {
    require: false,
    type: Number,
    default: () => '',
  },
  seriesGbomId: {
    require: false,
    type: Number,
    default: () => '',
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
const emit = defineEmits(['toUpload', 'submitStatus']);
const loading = ref<boolean>(false);
const Timecooling = ref<boolean>(false);
const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
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
      userId: userStore.getUser.id,
      userName: userStore.getUser.nickname,
    };
    DesignApiInfo.ckSystemDesignGetTree(obj).then(function (res) {
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
  DesignApiInfo.exportTaskInfo(data).then(function (res) {
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
const designUpload = ref<any>([]); // 设计说明文件上传

// 定义查核项配置表格的columns数组
const auditColumns = ref([
  {
    fixed: 'left',
    type: 'index',
    width: 60, // 减小序号列宽度
    align: 'center',
    title: '序号',
    customRender: ({ index }) => {
      return index + 1;
    },
  },
  {
    title: WeiI18n.$t('需求级别'),
    dataIndex: 'requirementLevel',
    key: 'requirementLevel',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.requirementLevel, b.requirementLevel),
    width: 120,
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('名称'),
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.name, b.name),
    width: 120,
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('描述'),
    dataIndex: 'standard',
    key: 'standard',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.standard, b.standard),
    width: 200, // 增加宽度
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('需求分类'),
    dataIndex: 'requirementsClassification',
    key: 'requirementsClassification',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.requirementsClassification, b.requirementsClassification),
    width: 120,
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'text',
    key: 'text',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.text, b.text),
    width: 120,
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('适用阶段'),
    dataIndex: 'term',
    key: 'term',
    align: 'center',
    resizable: true,
    width: 120,
    ellipsis: true,
    customRender: ({ record }) => {
      const term = +record.term;
      if (term === 1) return '方案设计';
      else if (term === 2) return '系统设计';
      else if (term === 3) return '详细设计';
      else if (term === 4) return '方案设计,系统设计';
      else if (term === 5) return '方案设计,详细设计';
      else if (term === 6) return '系统设计,详细设计';
      else if (term === 7) return '方案设计,系统设计,详细设计';
      else return '未知';
    },
  },
]);
const definitionDialog = ref(false); // 工程师设计任务任务定义弹窗
// 只读标志：已定义时为 true
const definitionReadOnly = ref(false);
const moduleColumns = ref<any[]>([]);
const moduleList = ref<any>([]);
const definitionTaName = ref('输入配置'); // 工程师任务定义配置tap
const definitionCollapseNames = ref(['系统参数', '相关文件', '模块清单', '工作说明描述', '查核项配置']); // 工程师任务定义配置Collapse
const gbomPlatformTableData = ref<any>([]); //获取bom参数定义
const relevantString = ref(''); // 相关文件解释
const relevantData = ref({}); // 相关文件
const getDefinitionData = ref<any>({}); //获取任务定义详情
const enInventoryData = ref<any>([]); //模块清单表头
const enInventoryColumnList = ref<any>([]); //模块清单数据
const workExplainString = ref<any>(''); // 工作说明
const auditDataListData = ref<any>([]); //获取任务定义关联的查核数据
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
      roleselectedRowKeys.value = [];
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

const rowSelection1 = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: 'radio',
    selectedRowKeys: roleselectedRowKeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      console.log(selectedRows, 'selectedRows');
      headName.value = selectedRows[0].userName;
      head.value = selectedRows[0].userId;
      jobNumber.value = selectedRows[0].jobNumber;
      roleselectedRowKeys.value = selectedRowKeys;
    },
  };
});
const UploadfileList = ref<Array<UploadFile>>([]);
const isUpdate = ref(false);
const timeWin = ref(false);
const resetTurnToTask = () => {
  memberPrimitiveData.value = [];
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
    DesignApiInfo.ckSystemDesignAddHead(data).then(function (res) {
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
  if (!rowStartTime.value) {
    return false;
  }
  let datas = date.$d ? date.$d : date;
  let beforeDays = new Date(datas).getTime() <= new Date(rowStartTime.value).getTime() - 86400 * 1000;
  return beforeDays;
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
  DesignApiInfo.ckSystemDesignAddStartTimeApi(obj).then(function (res) {
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
  DesignApiInfo.ckSystemDesignAddEndTimeApi(obj).then(function (res) {
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
//click design task release to determine whether there is a design specification file
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
  DesignApiInfo.ckSystemDesignSendTaskApi(obj).then(function (res) {
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
const rowInfo = ref<any>({});
async function editSend(row: any) {
  //放开只读状态
  // definitionReadOnly.value = false;
  const res2 = await DesignApiInfo.getDefinition({ id: row.id });
  if (res2.data.data) {
    let condata = res2.data.data;
    getDefinitionData.value = condata;
    relevantData.value.id = condata.relatedFileId;
    relevantString.value = condata.relatedFileString;
    workExplainString.value = condata.jobDescription;
    ids.value = condata.auditDataIds;
  }

  rowInfo.value = row;
  upStartTime.value = row.startTime;
  upEndTime.value = row.endTime;
  headName.value = row.headName;
  head.value = row.jobNumber;
  jobNumber.value = row.jobNumber;
  descriptionInfo.value = row.illustrate;
  updateFiles.value = row.illustrateFile;
  timeWin.value = true;
  upId.value = row.id;
}
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

const gbomId = ref('');
async function definitionTo(row: any, type: any) {
  debugger;
  gbomId.value = row.id;
  // 如果已定义，标记为只读
  if (type == 1) {
    definitionReadOnly.value = !!row.whether;
  } else {
    definitionReadOnly.value = false;
  }
  definitionDialog.value = true;
  const res = await DesignApiInfo.getDefinition({ id: row.id });
  console.log(res);
  UploadfileList.value = [];
  if (res.data.data) {
    let condata = res.data.data;
    getDefinitionData.value = condata;
    relevantData.value.oldFileName = condata.relatedFileName;
    relevantData.value.fileUrl = condata.relatedFileUrl;
    relevantData.value.id = condata.relatedFileId;
    relevantString.value = condata.relatedFileString;
    workExplainString.value = condata.jobDescription;
    ids.value = condata.auditDataIds;
    auditDataListData.value = condata.auditDataList || [];
    const file: any = { ...res.data.data, name: res.data.data?.relatedFileName, id: res.data.data.relatedFileId };
    UploadfileList.value.push(file);
  }
  let data = {
    projectId: props.projectId,
    taskId: props.taskId,
    seriesgbomId: props.seriesGbomId,
  };
  const res2 = await DesignApiInfo.getDefSysParameterList(data);
  console.log(res2);

  let data2 = {
    taskId: props.taskId,
    seriesGBOMId: props.seriesGbomId,
  };
  const res3 = await DesignApiInfo.seriesGBOMGetParameterList(data2);
  console.log(res3);
  gbomPlatformTableData.value = res3.data.data;

  let data3 = {
    taskId: props.taskId,
    projectId: props.projectId,
  };
  const res4 = await DesignApiInfo.queryModuleList(data3);
  console.log(res4);
  moduleColumns.value = [];
  moduleList.value = res4.data.data.tableData || [];
  var columns = res4.data.data.columnList || [];
  for (let i = 0; i < columns.length; i++) {
    moduleColumns.value.push({
      title: columns[i].propertyName,
      dataIndex: columns[i].modelInfoProp,
      key: columns[i].modelInfoProp,
      minWidth: 300,
      resizable: true,
      sortDirections: ['descend', 'ascend'],
    });
  }
}
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

// 查核项配置相关变量
const auditDialogVisible = ref(false); // 查核项配置弹窗可见性
const selectedAuditTreeKeys = ref<string[]>([]); // 当前选中的树节点键
const auditTreeData = ref<any[]>([]); // 查核项分类树数据
const auditListData = ref<any[]>([]); // 查核项列表数据
const searchKeyword = ref(''); // 搜索关键词
const selectedAuditIds = ref<Record<string, any>>({}); // 已关联查核节点，格式：{auditId: [listIds]}
const currentAuditId = ref(''); // 当前选中的分类节点ID
const selectedListIds = ref<string[]>([]); // 当前选中的列表项ID
const relatedAuditNames = ref<string[]>([]); // 已关联查核节点的名称列表

// 根据ID在树形数据中查找节点名称
function findNodeNameById(treeData: any[], id: string): string {
  debugger;
  for (const node of treeData) {
    if (node.id + '' === id) {
      return node.title;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeNameById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return '';
}

// 获取已关联的查核节点
async function getRelatedAuditNodes() {
  try {
    const res = await DesignApiInfo.backIds({ id: gbomId.value });
    console.log(res);
    if (res.data.code === '0' && res.data.data) {
      const relatedData = res.data.data;
      // 重置已关联节点ID和名称
      selectedAuditIds.value = {};
      relatedAuditNames.value = [];
      relatedAuditItemsMap.value = {};
      debugger;
      // 处理返回的数据结构
      for (const parentId in relatedData) {
        debugger;
        if (relatedData.hasOwnProperty(parentId)) {
          // 标记父节点为已关联
          selectedAuditIds.value[parentId] = true;

          // 保存父节点对应的子项ID列表
          relatedAuditItemsMap.value[parentId] = relatedData[parentId];
        }
      }
    }
  } catch (error) {
    console.error('获取已关联查核节点失败:', error);
    // 出错时重置数据
    selectedAuditIds.value = {};
    relatedAuditNames.value = [];
    relatedAuditItemsMap.value = {};
  }
}

function transformTreeNode(node: any): any {
  // 转换当前节点
  const transformedNode = {
    id: node.id || node.key,
    title: node.title || node.name || node.label || '未命名',
    children: [],
  };

  // 递归转换所有子节点
  if (node.children && Array.isArray(node.children) && node.children.length > 0) {
    transformedNode.children = node.children.map((childNode: any) => transformTreeNode(childNode));
  }

  return transformedNode;
}

async function getAuditTree() {
  try {
    const res = await DesignApiInfo.auditLibraryGetTree({});
    if (res.data.code === '0' && res.data.data) {
      // 打印原始数据结构以便调试
      console.log('原始树数据:', res.data.data);

      // 检查数据结构并进行适当转换
      if (Array.isArray(res.data.data)) {
        // 递归转换所有节点，确保所有层级的节点都有正确的字段名称
        const transformedData = res.data.data.map((node: any) => transformTreeNode(node));

        auditTreeData.value = transformedData;
        console.log('转换后的树数据:', transformedData);
      } else {
        // 如果不是数组，尝试直接使用
        auditTreeData.value = [transformTreeNode(res.data.data)];
      }
    }
  } catch (error) {
    console.error('获取查核项分类树失败:', error);
  }
}

async function getAuditList(auditId: string) {
  try {
    currentAuditId.value = auditId;
    const data = {
      auditId: auditId,
      userId: userStore.getUser.id,
    };
    const res = await DesignApiInfo.auditLibraryGetDataList(data);
    if (res.data.code === '0' && res.data.data && Array.isArray(res.data.data)) {
      auditListData.value = res.data.data;

      // 重置当前列表的选中状态
      selectedListIds.value = [];

      // 如果当前分类已关联，自动勾选对应的列表项
      if (relatedAuditItemsMap.value[auditId]) {
        // 使用预定义的子项ID列表来勾选对应的项
        selectedListIds.value = relatedAuditItemsMap.value[auditId];
      } else if (selectedAuditIds.value[auditId]) {
        // 兼容旧的逻辑
        auditListData.value.forEach(item => {
          selectedListIds.value.push(item.id);
        });
      }
    }
  } catch (error) {
    console.error('获取查核项列表失败:', error);
  }
}

const relatedAuditItemsMap = ref<Record<string, string[]>>({});

async function relevanceCheck() {
  // 重置相关变量
  selectedAuditIds.value = {};
  currentAuditId.value = '';
  selectedListIds.value = [];
  relatedAuditNames.value = [];
  relatedAuditItemsMap.value = {};

  // 获取已关联的查核节点
  await getRelatedAuditNodes();

  // 获取查核项分类树
  await getAuditTree();

  // 根据已关联的节点ID查找对应的节点名称
  debugger;
  for (const id in selectedAuditIds.value) {
    if (selectedAuditIds.value[id]) {
      const nodeName = findNodeNameById(auditTreeData.value, id);
      if (nodeName) {
        relatedAuditNames.value.push(nodeName);
      }
    }
  }

  // 如果有分类数据，默认加载第一个分类的列表
  if (auditTreeData.value && auditTreeData.value.length > 0) {
    const firstAuditId = auditTreeData.value[0].id;
    selectedAuditTreeKeys.value = [firstAuditId];
    await getAuditList(firstAuditId);
  }

  // 显示查核项配置弹窗
  auditDialogVisible.value = true;
}

// 处理分类节点点击事件
function handleAuditTreeSelect(selectedKeys: string[], info: any) {
  if (selectedKeys && selectedKeys.length > 0) {
    const auditId = selectedKeys[0];
    currentAuditId.value = auditId;
    getAuditList(auditId);
  }
}

// 处理列表项选择变化
function handleListSelectChange(selectedRowKeys: string[]) {
  selectedListIds.value = selectedRowKeys;

  // 保存当前分类的选择结果到relatedAuditItemsMap
  if (currentAuditId.value) {
    relatedAuditItemsMap.value[currentAuditId.value] = selectedRowKeys;
  }
}

const ids = ref<any>([]);
// 保存查核项配置
async function saveAuditConfig() {
  // 关闭弹窗
  auditDialogVisible.value = false;
  let data = {};
  data.id = gbomId.value;
  data.userId = userStore.getUser.id;

  // 从relatedAuditItemsMap中提取所有选择项ID到ids数组
  ids.value = [];
  Object.values(relatedAuditItemsMap.value).forEach(idArray => {
    if (Array.isArray(idArray)) {
      ids.value.push(...idArray);
    }
  });
  data.ids = ids.value;
  const res = await DesignApiInfo.ckSystemDesignDefinition(data);
  // 刷新当前页面的查核项列表
  const res2 = await DesignApiInfo.getDefinition({ id: gbomId.value });
  if (res2.data.data) {
    let condata = res2.data.data;
    auditDataListData.value = condata.auditDataList || [];
  }
}

async function definitionOk() {
  // saveAuditConfig();
  // 关闭弹窗
  definitionDialog.value = false;
  let data = {};
  data.id = gbomId.value;
  data.userId = userStore.getUser.id;
  data.jobDescription = workExplainString.value;
  data.relatedFileId = relevantData.value.id;
  data.relatedFileString = relevantString.value;
  data.ids = ids.value;
  const res = await DesignApiInfo.ckSystemDesignDefinition(data);
  getProjectBOM(props.taskId);
}

// 取消查核项配置
function cancelAuditConfig() {
  auditDialogVisible.value = false;
}

//更新时间
async function getUpdateTime() {
  let data = {};
  console.log(rowInfo);
  data.endTime = upEndTime.value;
  data.head = head.value;
  data.id = rowInfo.value.id;
  data.ids = ids.value;
  data.jobDescription = workExplainString.value;
  data.relatedFileId = relevantData.value.id;
  data.relatedFileString = relevantString.value;
  data.startTime = upStartTime.value;
  data.taskId = props.taskId;
  data.userId = userStore.getUser.id;
  const res = await DesignApiInfo.ckSystemDesignUpdateTime(data);
  if (res.code != '-1') {
    timeWin.value = false;
    getProjectBOM(props.taskId);
  }
}

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
const showMemberDialogDesign = () => {
  isUpdate.value = true;
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
    title: WeiI18n.t('负责人').value,
    dataIndex: 'headName',
    key: 'headName',
    width: 150,
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
    title: WeiI18n.t('任务定义').value,
    dataIndex: 'definition',
    key: 'definition',
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
    title: WeiI18n.t('模块编码').value,
    dataIndex: 'moduleNumber',
    key: 'moduleNumber',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('模块名称').value,
    dataIndex: 'moduleName',
    key: 'moduleName',
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
    title: WeiI18n.t('操作').value,
    dataIndex: 'action',
    key: 'action',
    width: 250,
    resizable: true,
    fixed: 'right',
    sortDirections: ['descend', 'ascend'],
  },
]);

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};

const onFileChange: UploadProps['onChange'] = async evt => {};

const handlePreview: UploadProps['onChange'] = async (file: any) => {
  const downLoadItem = {
    fileId: file.response ? file.response.id : file.id,
  };
  handleEpcDownload(downLoadItem, file.response ? file.response.fileName : `${file.name}`);
};

async function customRequest(options: any) {
  // 调用上传接口
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadFile(data);
    console.log(res);
    if (res.data.code == 200) {
      UploadfileList.value = [];
      console.log(res.data.data, 'res.data.data');
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      UploadfileList.value.push(file);
      relevantData.value = res.data.data || {};
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

const versionTabcolumns = ref<any>([
  {
    title: WeiI18n.t('文件编号').value,
    dataIndex: 'docNumber',
    key: 'docNumber',
    minWidth: 70,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('文件url').value,
    dataIndex: 'url',
    key: 'url',
    minWidth: 80,
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
// 递归判断所有非顶级节点是否已处于“发放”状态（sendStatus === 1）
const isAllReleased = computed(() => {
  const nodes = systemTableData.value || [];

  function everyReleased(list: any[]): boolean {
    if (!Array.isArray(list) || list.length === 0) return true;
    for (const n of list) {
      // 跳过顶级节点本身，但检查其子节点
      if (Number(n.level) === 1) {
        if (n.children && n.children.length) {
          if (!everyReleased(n.children)) return false;
        }
        continue;
      }
      // 只有当 sendStatus 严格等于 1 时视为已发放，其他视为未发放
      if (String(n.sendStatus) !== '2' && n.sendStatus !== 2) {
        return false;
      }
      if (n.children && n.children.length) {
        if (!everyReleased(n.children)) return false;
      }
    }
    return true;
  }

  return everyReleased(nodes);
});
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
            row-key="id"
            :locale="localeA"
            :pagination="false"
            :data-source="systemTableData"
            :columns="columns"
            @expand="expandChange"
            v-model:expandedRowKeys="defaultExpandedKeys"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'headName'">
                <div style="display: flex">
                  <div style="width: 100px">{{ record.pnum === '0' ? userStore.getUser?.userDescription || userStore.getUser?.userDescription || '-' : record.headName }}</div>
                  <div v-if="record.button == 1">
                    <span v-if="isEdit || record.sendStatus == 2 || record.sign == 1">{{ '浏览' }}</span>
                    <a color="blue" v-else style="cursor: pointer" @click="turnToTask(record)" type="primary"> {{ '浏览' }}</a>
                  </div>
                </div>
              </template>

              <!-- 状态列：leve === 1 时显示 '/' -->
              <template v-if="column.dataIndex === 'sendStatus'">
                <div v-if="Number(record.level) === 1">/</div>
                <div v-else>
                  <!-- {{record.taskStatus}} -->
                  <span v-if="record.taskStatus == '正在工作'" style="color: #e6a23c">正在工作</span>
                  <span v-if="record.taskStatus == '已完成'" style="color: #67c23a">已完成</span>
                  <span v-if="record.taskStatus == '待启动'">待启动</span>
                  <span v-if="record.taskStatus == '/'">/</span>
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

              <!-- 任务定义列：leve === 1 时显示 '/' -->
              <template v-if="column.dataIndex === 'definition'">
                <div v-if="Number(record.level) === 1">/</div>
                <a v-else @click="definitionTo(record, 1)" type="primary" style="cursor: pointer">
                  <span
                    :style="{
                      color: Number(record.whether) === 1 || record.whether === true ? '#52c41a' : 'inherit',
                      fontWeight: record.whether ? 600 : 'normal',
                    }">
                    {{ record.whether ? '已定义' : '定义任务' }}
                  </span>
                </a>
              </template>

              <!-- 操作列：leve === 1 时显示 '/' -->
              <template v-if="column.dataIndex === 'action'">
                <div v-if="Number(record.level) === 1">/</div>
                <div v-else class="action-buttons">
                  <div class="button-group">
                    <!-- 发放按钮 -->
                    <div v-if="record.sendStatus == 1" class="button-item">
                      <div v-if="isEdit || record.button == 0 || record.sign == 1" class="disabled-button"><EpcIcon type="icon-fafang" style="font-size: 15px" /> 发放</div>
                      <a v-else @click.stop="startDes(record)" class="action-link"> <EpcIcon type="icon-fafang" style="font-size: 15px" /> 发放 </a>
                    </div>
                    <div v-else class="button-item">
                      <span class="sent-status">
                        <EpcIcon type="icon-fafang" style="font-size: 15px" />
                        已发放
                      </span>
                    </div>

                    <!-- 编辑按钮 -->
                    <div v-if="record.sendStatus == 2" class="button-item">
                      <a-button type="link" :disabled="isEdit || String(record.taskStatus) === '已完成'" @click.stop="editSend(record)" class="action-link">
                        <EpcIcon type="icon-edit" style="font-size: 15px" />
                        编辑
                      </a-button>
                    </div>

                    <!-- 查看版本按钮 -->
                    <div v-if="record.hasVersion" class="button-item">
                      <a @click.stop="getProjectVersionInfo(record.id)" class="action-link">
                        <EpcIcon type="icon-banbenlishi" style="font-size: 15px" />
                        查看版本
                      </a>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </a-table>
        </div>
        <div class="foot-btn">
          <div class="backBtn" v-if="isShowBottomBtns">
            <a-button type="primary" @click="submitStatus(5, 1, selectedKeys)" :disabled="commitBtnStatus || !isAllReleased">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button type="primary" class="btn_left" @click="submitStatus(5, 0)" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>

  <!-- 任务定义 -->
  <a-modal v-model:visible="definitionDialog" title="任务定义" draggable width="1200px" class="custom-modal">
    <div style="width: 100%; background: #fff; margin-top: 4px">
      <section style="width: 100%; max-height: 600px; overflow-x: hidden; overflow-y: auto; background-color: #ffffff">
        <a-tabs v-if="definitionDialog" v-model:value="definitionTaName" type="card" class="design-tabs">
          <a-tab-pane key="first" tab="输入配置" name="输入配置">
            <a-collapse class="custom-collapse" v-model:value="definitionCollapseNames">
              <a-collapse-panel header="系统参数" name="系统参数">
                <a-row gutter="8" style="margin-top: 16px">
                  <a-col :span="12" v-for="item in gbomPlatformTableData" :key="item.id" style="margin-top: 16px">
                    <a-row gutter="8">
                      <a-col :span="8" style="text-align: right; padding-right: 16px">
                        <div class="top-title">{{ item.parameterName }}：</div>
                      </a-col>
                      <a-col :span="16">
                        <a-input v-model:value="item.value" placeholder="暂无参数值..." style="max-width: 320px" disabled />
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel header="相关文件" name="相关文件">
                <a-row>
                  <a-col :span="24">
                    <div style="margin: 10px 0; display: flex">
                      <a-upload
                        v-if="!relevantData.oldFileName"
                        v-model:file-list="UploadfileList"
                        class="avatar-uploader"
                        :with-credentials="true"
                        :before-upload="beforeUpload"
                        :custom-request="customRequest"
                        @preview="handlePreview"
                        @change="onFileChange">
                        <div>
                          <LoadingOutlined />
                          <a-button>
                            <upload-outlined></upload-outlined>
                            {{ $t('上传文件') }}
                          </a-button>
                        </div>
                      </a-upload>
                      <a-upload
                        v-if="relevantData.oldFileName"
                        v-model:file-list="UploadfileList"
                        class="avatar-uploader"
                        :with-credentials="true"
                        :before-upload="beforeUpload"
                        :custom-request="customRequest"
                        @preview="handlePreview"
                        @change="onFileChange">
                        <div>
                          <LoadingOutlined />
                          <a-button>
                            <upload-outlined></upload-outlined>
                            {{ $t('重新上传') }}
                          </a-button>
                        </div>
                      </a-upload>
                    </div>
                  </a-col>

                  <a-col :span="24">
                    <a-textarea v-model:value="relevantString" style="margin-left: 50%; transform: translateX(-50%)" :rows="4" type="textarea" placeholder="文件描述" />
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel header="模块清单" name="模块清单">
                <a-row style="margin-top: 2px">
                  <a-col :span="24">
                    <div style="margin-top: 2px">
                      <a-table
                        :scroll="{ y: 400 }"
                        style="margin-top: 2px; margin-right: 16px"
                        :pagination="false"
                        row-key="id"
                        :columns="moduleColumns"
                        :locale="localeA"
                        :data-source="moduleList"
                        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                        <template #bodyCell="{ column, record }">
                          <template v-if="column.dataIndex === 'applicationType'">
                            <span v-if="record.applicationType == 0">直接应用</span>
                            <span v-else-if="record.applicationType == 1">变形设计</span>
                          </template>
                        </template>
                      </a-table>
                    </div>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
          <a-tab-pane key="second" tab="工作说明" name="工作说明">
            <a-collapse class="custom-collapse" v-model:value="definitionCollapseNames">
              <a-collapse-panel header="工作说明描述" name="工作说明描述">
                <a-textarea v-model:value="workExplainString" style="margin-left: 50%; transform: translateX(-50%)" :rows="5" type="textarea" placeholder="工作说明描述" />
              </a-collapse-panel>
              <a-collapse-panel header="查核项配置" name="查核项配置">
                <a-row style="margin-top: 10px">
                  <a-col :span="24">
                    <a-button @click="relevanceCheck">配置项点</a-button>

                    <!-- 查核项配置弹窗 -->
                    <a-modal v-model:visible="auditDialogVisible" title="查核项配置" width="1200px" :footer="null">
                      <a-form layout="vertical">
                        <!-- 已关联查核节点显示 -->
                        <div v-if="relatedAuditNames.length > 0" style="margin-bottom: 10px; padding: 5px 10px; background-color: #e6f7ff; border-radius: 4px">
                          <span style="font-weight: bold; color: #1890ff">已关联查核节点：</span>
                          <span>{{ relatedAuditNames.join('、') }}</span>
                        </div>

                        <a-row gutter="16">
                          <!-- 左侧分类结构树 -->
                          <a-col :span="6">
                            <div style="border: 1px solid #d9d9d9; border-radius: 4px; height: 500px; overflow-y: auto; padding: 10px">
                              <a-tree
                                :tree-data="auditTreeData"
                                v-model:selectedKeys="selectedAuditTreeKeys"
                                @select="handleAuditTreeSelect"
                                blockNode
                                :default-expand-all="true"
                                :field-names="{ title: 'title', key: 'id', children: 'children' }" />
                            </div>
                          </a-col>

                          <!-- 右侧列表内容 -->
                          <a-col :span="18">
                            <div style="border: 1px solid #d9d9d9; border-radius: 4px; height: 500px; overflow: hidden; display: flex; flex-direction: column">
                              <!-- 查核项列表 -->
                              <div style="flex: 1; overflow-y: auto">
                                <a-table
                                  :columns="auditColumns"
                                  :data-source="auditListData"
                                  :locale="localeA"
                                  :pagination="false"
                                  row-key="id"
                                  :row-selection="{
                                    type: 'checkbox',
                                    selectedRowKeys: selectedListIds,
                                    onChange: handleListSelectChange,
                                  }" />
                              </div>
                            </div>
                          </a-col>
                        </a-row>

                        <!-- 弹窗底部按钮 -->
                        <div style="text-align: right; margin-top: 16px">
                          <a-space>
                            <a-button type="primary" @click="saveAuditConfig()"> 确定 </a-button>
                            <a-button @click="cancelAuditConfig">取消</a-button>
                          </a-space>
                        </div>
                      </a-form>
                    </a-modal>
                  </a-col>
                  <a-col :span="24">
                    <div style="margin: 10px 0">
                      <a-table :locale="localeA" scrollbar-always-on ref="mulRef" :data-source="auditDataListData" :max-height="600" :columns="auditColumns"> </a-table>
                    </div>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
        </a-tabs>
      </section>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <a-button v-if="!definitionReadOnly" type="primary" @click="definitionOk()"> 确定 </a-button>
        <a-button @click="definitionDialog = false">取消</a-button>
      </span>
    </template>
  </a-modal>

  <!-- 选择成员弹窗 -->
  <a-modal v-model:visible="memberDialogDesign" style="width: 40%" title="选择角色" draggable>
    <div style="width: 100%; background: #fff; margin-top: 4px">
      <div style="margin-bottom: 15px">
        <a-input v-model:value="userName" style="width: 240px" placeholder="请输入关键字" />
        <a-button type="primary" @click="turnToTask(fosturn)" style="margin-left: 10px"><EpcIcon type="icon-fangdajing" style="font-size: 12px" />查询</a-button>
        <a-button @click="resetTurnToTask" style="margin-left: 10px"><EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
        <a-button type="primary" @click="clearPor" style="margin-left: 10px"><EpcIcon type="icon-tongbu2" style="font-size: 12px" />清空选择成员</a-button>
      </div>
      <a-table
        :scroll="{ x: 400, y: 400 }"
        row-key="userId"
        :loading="loading"
        :locale="localeA"
        :pagination="false"
        :data-source="memberPrimitiveData"
        :columns="rolecolumns"
        :row-selection="rowSelection1"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      </a-table>
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
    <a-row style="margin-top: 20px">
      <a-input v-model:value="headName" style="width: 240px" disabled placeholder="请选择负责人" />
      <a-button type="primary" style="margin-left: 10px" @click="showMemberDialogDesign"><EpcIcon type="icon-liulan" style="font-size: 15px" />浏览</a-button>
    </a-row>
    <a-row style="margin-top: 20px">
      <a-button type="primary" @click="definitionTo(rowInfo, 2)"><EpcIcon type="icon-jielun-copy" style="font-size: 15px" />定义任务</a-button>
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
      :loading="loading"
      :locale="localeA"
      :pagination="false"
      :data-source="versionInfo"
      :columns="versioncolumns"
      :row-selection="rowSelection1"
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
@import '../../../../../sheets/collapse.less';
.box {
  width: 100%;
  height: calc(100vh - 80px);
  background: #fff;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
}

.custom-modal {
  :deep(.ant-modal-content) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :deep(.ant-modal-header) {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }

  :deep(.ant-modal-title) {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }

  :deep(.ant-modal-body) {
    padding: 24px;
  }

  :deep(.ant-modal-footer) {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
  }

  .design-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 20px;
    }

    :deep(.ant-tabs-tab) {
      padding: 12px 20px;
      font-size: 14px;
    }

    :deep(.ant-tabs-tab-active) {
      color: #1890ff;
    }

    :deep(.ant-tabs-ink-bar) {
      background-color: #1890ff;
    }
  }

  .top-title {
    font-size: 14px;
    color: #6b778c;
    font-weight: 500;
    padding-right: 10px;
    text-align: right;
  }

  // 系统参数部分样式
  :deep(.ant-collapse) {
    margin-bottom: 0;
    background: #fff;
    border-radius: 8px;
  }

  :deep(.ant-collapse-header) {
    background-color: #fafafa;
    border-radius: 4px;
    padding: 12px 16px;
  }

  :deep(.ant-collapse-content) {
    padding: 16px;
  }

  // 输入框禁用状态样式
  :deep(.ant-input-disabled) {
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.65);
    border-color: #d9d9d9;
    height: 32px;
  }

  // 表格样式
  :deep(.ant-table) {
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
  }

  :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    font-weight: 500;
    text-align: center;
  }

  :deep(.ant-table-tbody > tr > td) {
    text-align: center;
  }

  // 按钮样式
  :deep(.ant-btn-primary) {
    background-color: #1890ff;
    border-color: #1890ff;
  }

  :deep(.ant-btn-primary:hover) {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
}

/* 操作列按钮样式优化：水平排列并垂直居中 */
.action-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.button-group {
  display: flex;
  flex-direction: row; /* 水平排列 */
  gap: 12px;
  align-items: center;
}

.button-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1890ff;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  font-size: 13px;

  &:hover {
    color: #40a9ff;
  }

  &:disabled {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
}

.disabled-button {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
  white-space: nowrap;
  font-size: 13px;
}

.sent-status {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #52c41a;
  font-weight: 600;
  white-space: nowrap;
  font-size: 13px;
}

:deep(.ant-btn-link) {
  padding: 0;
  height: auto;
  line-height: 1;

  &:disabled {
    color: rgba(0, 0, 0, 0.25);
    background: transparent;
    border-color: transparent;
  }
}
.audit-table-wrapper {
  width: 100%;
  overflow: auto;
}
.audit-table-wrapper :deep(.ant-table) {
  min-width: 1200px;
}
.audit-table-wrapper {
  width: 100%;
  overflow: auto;
}
.audit-table-wrapper :deep(.ant-table) {
  min-width: 1200px;
}
</style>
