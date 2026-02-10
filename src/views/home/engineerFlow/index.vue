<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
const { TabPane: ATabPane } = ATabs;
import { WeiI18n } from '@/utils/WeiI18n';
import DesignTree from '@/components/tree/DesignTree.vue';
import { useUserStore } from '@/store/modules/user';
import { useRoute, useRouter } from 'vue-router';
import { ProjectInfoRequestDTOModel } from '@/api/models/design/ProjectInfoRequestDTOModel';
import { ProjectTaskRequestDTOModel } from '@/api/models/design/ProjectTaskRequestDTOModel';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import ProjectMaterials from './components/form/ProjectMaterials.vue';
import DesignPlan from './components/form/DesignPlan.vue';
import TopleveLindicators from './components/form/TopleveLindicators.vue';
import HorizontalEquipment from './components/form/HorizontalEquipment.vue';
import SystemFunctions from './components/form/SystemFunctions.vue';
import DesignAssignment from './components/form/DesignAssignment.vue';
import ModuleSelection from './components/form/ModuleSelection.vue';
import ModuleList from './components/form/ModuleList.vue';
import SystemDescription from './components/form/SystemDescription.vue';
import TaskRelease from './components/form/TaskRelease.vue';
import UploadModal from './components/modal/upload-modal.vue';
import { decryptValue } from '@/utils';
/** 声明组件类型  */
interface componentType {
  [key: string]: any;
}
/** 初始化组件 */
const currentComponent = ref<any>(ProjectMaterials);
// 创建一个映射表，将key与对应的组件进行关联
const componentMap = reactive<componentType>({
  323: ProjectMaterials, // 项目资料
  324: DesignPlan, // 设计计划
  325: TopleveLindicators, // 顶层指标
  326: HorizontalEquipment, //平断面及其设备配置
  327: SystemFunctions, //系统设计说明
  9: DesignAssignment, //定义系统参数
  10: ModuleSelection, //模块选型
  11: ModuleList, //模块清单
  12: SystemDescription, //系统配置说明
  13: TaskRelease, //任务发布
});
const detailProject = ref<any>({}); //设计经理任务流程详情
const uploadDate = ref<any>({});
const mainInfo = ref<any>({});
const taskInfoData = ref<any>({});
const taskInfoData1 = ref<any>({});
const router = useRoute();
const isCommit = ref(false);
const isShowBottomBtns = ref(true);
const designUpload = ref<any>([]); // 设计说明文件上传
const systemTableData = ref<any>([]); // 设计说明文件上传
const updateFiles = ref<any>([]);
// 树结构相关属性
const compliance = ref<any>('');
const uploadBelong = ref<any>(''); // 需要pdm上传的地方
const treeData = ref<any>([]); // 树结构数据
const selectedKeys = ref<string>(''); // 选中的树的id
const expandedKeys = ref<string>('');
const selectNodeKeys = ref<string>('');
const treePage = ref<any>(null);
const loadingTree = ref<boolean>(false);
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
const activeTab = ref('system-design'); // 当前激活的tab
const requestProjectParams = reactive(new ProjectInfoRequestDTOModel());
const requestProTaskParams = reactive(new ProjectTaskRequestDTOModel());
const isEdit = ref(false);
const isToUpload = ref(false); // 上传文件弹窗
const loading = ref<boolean>(false);
const fosTreeObj = ref({}); // 目标树形数据
const designType = ref(0); //类别从工作台传递跳转
const taskId = ref(0); //工作台传递流程ID
const editflag = ref<boolean>(false);
const seriesId = ref(0); //工作台传递流程seriesId
const code = ref<string>(''); //工作台传递流程code
const projectId = ref<string>(''); //工作台传递流程cprojectId
const seriesGbomId = ref<string>(''); //工作台传递流程seriesGbomId
const platformId = ref<string>(''); //工作台传递流程platformId
const taskSourceId = ref<string>(''); //工作台传递流程taskSourceId
const taskInfo = ref([]);
const seriesTableData = ref([]); //系列参数列表数据
const saveBtnStatus = ref(false);
const commitBtnStatus = ref(false);
const editBtnStatus = ref(false);
const downloadStatus = ref(false);
const isShowArgsIcon = ref(false);
const systemsData = ref<any>([]); // pdm上传系统数据
const secretData = ref<any>([]); // pdm上传密级数据
const stageData = ref<any>([]); // pdm上传文档阶段数据
const typeData = ref<any>([]); // pdm上传文档类型数据
const uploadSuccesscData = ref<any>([]); // pdm上传成功信息
const dataUpload = ref([]); //项目资料上传文件
const enSystemString = ref(null); //项目资料描述
const designPlanUpload = ref([]); // 设计计划上传文件
const designPlanString = ref(null); // 设计计划描述
const projectPlanUpload = ref([]); // 项目计划上传文件
const projectPlanString = ref(null); // 项目计划描述
const placeFileData = ref([]); //预览本地
const pdmFileData = ref([]); //预览pdm
const uploadPlaceData = ref([]);
const illustrateFile = ref([]);
const illustrateString = ref('');
const equipmentUpload = ref([]); // 车下设备上传文件
const enSystemUpload = ref([]); // 车下设备上传文件
const equipmentString = ref(null); // 车下设备布置描述
const inpuColorType = reactive({}); // 控制参数展示状态
const dynamicCmpRef = ref<any>(null);
const dataString = ref<any>({}); //项目资料描述
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 处理搜索功能 */
async function handleChangeSelectKey(searchValue: string, languageSel: string) {
  // 当搜索值为空时，显示完整树结构
  if (!searchValue) {
    // 重新获取数据
    if (activeTab.value == 'design-input') {
      getTreeData(designType.value, '', 7);
    } else {
      getTreeData(designType.value, '', 2);
    }
    return;
  }

  // 根据搜索值过滤树节点
  const filteredData = filterTreeNodes(dataSource.value, searchValue);
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = filterTreeByTab(treeNodes);
}

/** 处理Tab切换 */
function handleTabChange(key: string) {
  activeTab.value = key;
  if (activeTab.value == 'design-input') {
    getTreeData(designType.value, '', 7);
  } else {
    getTreeData(designType.value, '', 2);
  }
}

/** 根据Tab过滤树节点 */
function filterTreeByTab(treeNodes: any[]) {
  if (!treeNodes || treeNodes.length === 0) return treeNodes;

  // 深拷贝树节点，避免修改原始数据
  const filteredTree = JSON.parse(JSON.stringify(treeNodes));

  // 根据当前激活的Tab过滤节点
  if (activeTab.value === 'design-input') {
    // 设计输入Tab：显示ID为323-327的节点
    filteredTree[0].children = filteredTree[0].children?.filter((node: any) => {
      const key = parseInt(node.key);
      return key >= 323 && key <= 327;
    });
  } else if (activeTab.value === 'system-design') {
    // 系统设计Tab：显示ID为9-13的节点
    filteredTree[0].children = filteredTree[0].children?.filter((node: any) => {
      const key = parseInt(node.key);
      return key >= 9 && key <= 13;
    });
  }

  return filteredTree;
}

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  return nodes
    .map(node => {
      // 检查当前节点是否匹配搜索值
      const isMatch = node.name && node.name.toLowerCase().includes(searchValue.toLowerCase());

      // 递归检查子节点
      let matchingChildren = [];
      if (node.children && node.children.length > 0) {
        matchingChildren = filterTreeNodes(node.children, searchValue);
      }

      // 如果当前节点匹配或有匹配的子节点，则保留该节点
      if (isMatch || matchingChildren.length > 0) {
        return {
          ...node,
          children: matchingChildren,
        };
      }
      return null;
    })
    .filter(Boolean); // 过滤掉null值
}

async function selectNode(node: any) {
  fosTreeObj.value = node;
  selectedKeys.value = node.key;
  switch (selectedKeys.value) {
    case '323':
      getTaskInfo();
      getDataDetail();
      break;
    case '324':
      getTaskInfo();
      getDesignPlanDetail();
      break;
    case '325':
      getTaskInfo();
      await getOneDetailProject();
      getParameterList();
      break;
    case '326':
      getTaskInfo();
      getFlatCutDetail();
      break;
    case '327':
      getTaskInfo();
      getIllustrateDetai();
      break;
    case '9':
      getTaskInfo();
      getCompliance();
      getDefSysParameterList(1, 2);
      whetheror(1, 2);
      break;
    case '10':
      getTaskInfo();
      getModuleTree();
      whetheror(2, 2);
      break;
    case '11':
      getTaskInfo();
      queryModuleList();
      whetheror(3, 2);
      break;
    case '12':
      nextTick(() => {
        getTaskInfo();
        whetheror(4, 2);
        dynamicCmpRef.value.getDataDetail();
      });
      break;
    case '13':
      nextTick(() => {
        getTaskInfo();
        dynamicCmpRef.value.getProjectBOM(taskId.value);
        whetheror(5, 2);
      });
      break;
    default:
      break;
  }
  currentComponent.value = componentMap[node.key] || null;
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  if (activeTab.value == 'design-input') {
    getTreeData(designType.value, '', 7);
  } else {
    getTreeData(designType.value, '', 2);
  }
}

/**
 * 获取固定写死的数据（流程展示的树形节点/上传文件所需要的 系统/秘级/文档阶段）
 * @param {string} type （3=系统/4=秘级/5=文档阶段/6=树形结构）
 * @param {number} id 任务id
 */
const getFakeData = type => {
  const data = {};
  data.type = type;
  data.taskId = taskId.value;
  DesignApiInfo.getFakeDataApi(data).then(function (res) {
    if (res.data.code == 0) {
      const { data } = res.data;
      if (type === 2) {
        // 确保数据格式正确转换为Tree组件所需的格式
        const rawData = res.data.data || [];
        // 转换数据格式
        const convertedData = convertToTreeNodes(rawData);
        // 应用Tab过滤
        treeData.value = filterTreeByTab(convertedData);
        selectNode({ key: selectedKeys.value });
      } else if (+type === 3) {
        systemsData.value = data || [];
      } else if (+type === 4) {
        secretData.value = data || [];
      } else if (+type === 5) {
        stageData.value = data || [];
      } else if (+type === 6) {
        typeData.value = data || [];
      } else {
        treeData.value = data || [];
        const c = data[0].children;
        if (!isCommit.value) {
          selectedKeys.value = c[0].id;
        }
        selectNode({ key: selectedKeys.value });
      }
    }
  });
};

/** 获取分类数据 */
async function getTreeData(type: any, id?: any, treeType?: any) {
  if (!isCommit.value) {
    loadingTree.value = true;
  }
  try {
    if (treeType == undefined || treeType == '') {
      treeType = 7;
    }
    requestProjectParams.type = treeType;
    requestProjectParams.taskId = taskId.value;
    if (id) {
      requestProjectParams.id = id;
    }
    const res = await DesignApiInfo.getFakeDataApi({ ...requestProjectParams });
    if (type == 3) {
      systemsData.value = res.data.data || [];
    } else if (type == 4) {
      secretData.value = res.data.data || [];
    } else if (type == 5) {
      stageData.value = res.data.data || [];
    } else if (type == 6) {
      typeData.value = res.data.data || [];
    } else {
      // 确保数据格式正确转换为Tree组件所需的格式
      const rawData = res.data.data || [];
      // 转换数据格式
      const convertedData = convertToTreeNodes(rawData);
      // 应用Tab过滤
      treeData.value = filterTreeByTab(convertedData);
      // 检查是否有数据
      if (treeData.value.length > 0 && treeData.value[0].children) {
        const c = treeData.value[0].children;
        if (!isCommit.value && c && c.length > 0) {
          selectedKeys.value = c[0].key;
          expandedKeys.value = treeData.value[0].key;
          selectNode(treeData.value[0].children[0]);
          whetheror(1, 1); //判断是否已经提交
        } else {
          selectNode({ key: selectedKeys.value });
        }
      }
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    loadingTree.value = false;
  }
}
async function getTaskInfo() {
  // const designObj = taskId.value ? taskId.value : JSON.parse(localStorage.getItem('designObj'));
  const res = await DesignApiInfo.getTaskInfoApi({ taskId: taskId.value });
  if (res.data.code == 0) {
    taskInfoData.value = { ...res.data.data, enSystemString: enSystemString.value };
  }
}
const getDataDetail = async () => {
  const res = await DesignApiInfo.getDataDetailApi({ taskId: taskId.value });
  if (res.data.code == 0) {
    enSystemUpload.value = res.data.data.dataFile == null ? [] : res.data.data.dataFile;
    enSystemString.value = res.data.data.enSystemString;
    dataUpload.value = res.data.data.dataFile == null ? [] : res.data.data.dataFile;
    taskInfoData.value = { ...res.data.data, enSystemString: enSystemString.value };
    taskInfoData1.value = { ...res.data.data, dataString: res.data.data.dataString };
    console.log('taskInfoData', taskInfoData.value);
    console.log('taskInfoData1', taskInfoData1.value);
  }
};
//判断是否已经提交
async function whetheror(num: number, type: number) {
  debugger;
  console.log('code.value', code.value);
  if (editflag.value) {
    return;
  }
  requestProTaskParams.taskId = taskId.value;
  requestProTaskParams.taskNum = num;
  requestProTaskParams.taskType = type;
  initBtnStatus();
  const res = await DesignApiInfo.whetherToSubmitApi({ ...requestProTaskParams });
  if (res.data.code == 0) {
    let data: any = res.data.data;
    saveBtnStatus.value = data.saveFlag;
    downloadStatus.value = data.saveFlag;
    commitBtnStatus.value = data.submitFlag;
    isShowArgsIcon.value = data.submitFlag;
  }
  getBtnsStatus();
}

function initBtnStatus() {
  editBtnStatus.value = false;
  saveBtnStatus.value = false;
  commitBtnStatus.value = false;
  isEdit.value = false;
}

const getBtnsStatus = () => {
  //没保存 没提交
  if (!saveBtnStatus.value && !commitBtnStatus.value) {
    if (selectedKeys.value == '10' || selectedKeys.value == '11' || selectedKeys.value == '13') {
      editBtnStatus.value = false;
      saveBtnStatus.value = true;
      commitBtnStatus.value = false;
      isEdit.value = false;
    } else {
      //编辑按钮不可点
      editBtnStatus.value = true;
      saveBtnStatus.value = false;
      commitBtnStatus.value = true;
      isEdit.value = false;
    }
    return;
  }
  //保存 没提交
  if (saveBtnStatus.value && !commitBtnStatus.value) {
    //编辑按钮不可点
    editBtnStatus.value = false;
    saveBtnStatus.value = true;
    commitBtnStatus.value = false;
    isEdit.value = true;
    return;
  }

  //没保存 提交
  if (!saveBtnStatus.value && commitBtnStatus.value) {
    //编辑按钮不可点
    editBtnStatus.value = false;
    saveBtnStatus.value = true;
    commitBtnStatus.value = true;
    isEdit.value = true;
    return;
  }

  //保存 提交
  if (saveBtnStatus.value && commitBtnStatus.value) {
    //编辑按钮可点
    editBtnStatus.value = false;
    saveBtnStatus.value = true;
    commitBtnStatus.value = true;
    isEdit.value = true;
    return;
  }
};

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  return data.map(item => {
    // 判断是否为根节点：pid不存在、为0或为空字符串通常表示根节点
    const isRootNode = !item.pid || item.pid === 0 || item.pid === '';
    // 判断是否有子节点
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;

    // 根据规则设置level值
    let level = 3; // 默认值为3（没有子节点的情况）
    if (isRootNode) {
      level = 1; // 根节点level为1
    } else if (hasChildren) {
      level = 2; // 有子节点的非根节点level为2
    }

    return {
      level: level,
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.name || item.title || '',
      // 添加type字段，用于在Tree组件中区分节点类型
      type: 'category', // 对于产品平台管理，所有节点都视为分类节点
      fileId: item.fileId,
      fileUrl: item.fileUrl,
      pid: item.pid,
      seq: item.seq,
      text: item.text,
      userId: item.userId,
      flag: item.flag,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}
const getFlatCutDetail = () => {
  DesignApiInfo.getFlatCutDetailApi({
    taskId: taskId.value,
  }).then(function (res) {
    if (res.data.code === '0') {
      equipmentUpload.value = res.data.data.equipmentFile == null ? [] : res.data.data.equipmentFile;
      equipmentString.value = res.data.data.equipmentString;
      uploadPlaceData.value = res.data.data.flat;
    }
  });
};

const getIllustrateDetai = () => {
  DesignApiInfo.projectFileGetIllustrateDetail({
    id: taskId.value,
  }).then(function (res) {
    if (res.data.code === '0') {
      illustrateFile.value = res.data.data.illustrate.illustrateFile;
      illustrateString.value = res.data.data.illustrate.illustrateString;
    }
  });
};

const getCompliance = () => {
  // const designObj = route.query.id ? route.query : JSON.parse(localStorage.getItem('designObj'));
  let data = {
    taskId: taskId.value,
  };
  DesignApiInfo.getComplianceApi(data).then(function (res) {
    if (res.data.code == 0) {
      compliance.value = res.data.data.compliance ? res.data.data.compliance + '%' : '';
    }
  });
};

async function getModuleTree() {
  const res = await DesignApiInfo.ckSystemDesignGetTree({
    taskId: taskId.value + '',
  });
  systemTableData.value = res.data.data || [];
}
const moduleColumns = ref<any[]>([]);
const moduleList = ref<any>([]);
async function queryModuleList() {
  const res = await DesignApiInfo.queryModuleList({
    projectId: projectId.value,
    taskId: taskId.value + '',
  });
  moduleColumns.value = [];
  moduleList.value = res.data.data.tableData || [];
  var columns = res.data.data.columnList || [];
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
  moduleColumns.value.push({
    title: '模块选取',
    dataIndex: 'label',
    key: 'label',
    width: 230,
  });
}

// 工程师获取定义系统参数数据
const getDefSysParameterList = (taskNum, taskType) => {
  const obj = {
    taskNum,
    taskType,
  };
  obj.projectId = projectId.value;
  obj.seriesgbomId = seriesGbomId.value;
  obj.taskId = taskId.value;
  DesignApiInfo.ckSystemDesignGetDefSysParameterList(obj).then(function (res) {
    if (res.data.code == '0') {
      enParameterList.value = res.data.data || [];
      const dataArr = res.data.data.result || [];
      getGbomParameterList(seriesGbomId.value, dataArr);
      projectParametersArr.value = dataArr;
    }
  });
};
const enParameterList = ref<any>([]);
const projectParametersArr = ref<any>([]);
const gbomPlatformTableData = ref<any>([]);
const enInpuColorType = reactive<any>({}); // 控制参数展示状态
// 获取bom参数定义
const getGbomParameterList = (id, enarr) => {
  const data: any = {
    seriesGBOMId: id,
    taskId: taskId.value,
  };
  DesignApiInfo.seriesGBOMGetParameterList(data).then(function (res) {
    if (res.data.code === '0') {
      const dataArr = res.data.data || [];

      // 先同步颜色映射（以 enarr 为准）
      (enarr || []).forEach((element: any) => {
        enInpuColorType[element.seriesgbomParameterId] = element.markerColor;
      });

      // 如果已提交（commitBtnStatus 为 true），只展示 enarr 中存在对应 seriesgbomParameterId 的参数，
      // 并且字段保持以 dataArr 中的项为准（不覆盖字段）
      debugger;
      if (saveBtnStatus.value == true) {
        enarr.map((item: any) => {
          const fos = (dataArr || []).filter((element: any) => +item.seriesgbomParameterId === +element.id)[0];
          console.log('fos', fos);
          if (fos) {
            // item.value = fos.value;
            item.id = fos.id;
            item.seriesgbomParameterId = fos.id;
            item.fosId = item.id;
            item.markerColor = item.markerColor ?? item.markerColor;
            item.parameterName = fos.parameterName;
            item.parameterId = fos.parameterId;
            item.parameterType = fos.parameterType;
          }
        });
        gbomPlatformTableData.value = enarr || [];
        console.log(' gbomPlatformTableData.value', gbomPlatformTableData.value);
        return;
      }

      // 未提交：按原逻辑，以接口返回为主，合并 enarr 中的已保存值
      dataArr.map((item: any) => {
        const fos = (enarr || []).filter((element: any) => +element.seriesgbomParameterId === +item.id)[0];
        if (fos) {
          item.value = fos.value;
          item.seriesgbomParameterId = fos.seriesgbomParameterId;
          item.fosId = fos.id;
          item.markerColor = fos.markerColor ?? item.markerColor;
        }
      });

      gbomPlatformTableData.value = dataArr || [];
      console.log('gbomPlatformTableData', gbomPlatformTableData);
    }
  });
};

// 获取系列参数列表
async function getParameterList() {
  const res = await DesignApiInfo.seriesParameterGetParameterList({
    seriesId: seriesId.value,
    userId: userStore.getUser.id,
    currentPage: 1,
    numberPage: 10000,
    taskId: taskId.value,
  });
  const arr = res.data.data.data || [];
  // 获取保存的顶层指标定义数据
  const projectParameters = detailProject.value.projectParameters || [];
  arr.map(item => {
    const fos = projectParameters.filter(element => element.seriesParameterId == item.id)[0];
    debugger;
    if (fos) {
      item.value = fos.value;
      console.log('item.name', item.parameterName, 'item.value', item.value);
    }
  });

  projectParameters.forEach(element => {
    inpuColorType[element.seriesParameterId] = element.markerColor;
  });
  seriesTableData.value = arr;
}

// 获取任务流程详情
async function getOneDetailProject() {
  const res = await DesignApiInfo.projectFileGetDetailProject({
    taskId: taskSourceId.value,
    taskNum: 3,
    taskType: 1,
  });
  projectParametersArr.value = res.data.data.projectParameters;
  detailProject.value = res.data.data || [];
}

const getDesignPlanDetail = () => {
  DesignApiInfo.getDesignPlanDetailApi({
    taskId: taskId.value,
  }).then(function (res) {
    if (res.data.code === '0') {
      designPlanUpload.value = res.data.data.designPlanFile == null ? [] : res.data.data.designPlanFile;
      designPlanString.value = res.data.data.designPlanString;
      projectPlanUpload.value = res.data.data.projectPlanFile == null ? [] : res.data.data.projectPlanFile;
      projectPlanString.value = res.data.data.projectPlanString;
    }
  });
};
const taskPageSaveMar = (obj: any) => {
  DesignApiInfo.taskPageSaveMarApi({
    taskId: obj.taskId,
    taskNum: obj.taskNum,
    taskType: obj.taskType,
  }).then(function (res) {});
};
const getIds = (data: any) => {
  let ids: any = [];
  data.forEach((item: any) => {
    ids.push(item.id);
  });
  return ids;
};

// 项目资料定义
const ProjectMaterialssubmitOk = (taskNum: number, gbomPlatformTableData: any) => {
  Modal.confirm({
    title: '确定要保存此次修改吗？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      let data: any = {};
      data.taskId = taskId.value;
      data.userId = userStore.getUser.id;
      if (selectedKeys.value === '9') {
        const voList = gbomPlatformTableData.map(item => {
          return {
            id: item.fosId,
            seriesgbomParameterId: item.id,
            parameterId: item.parameterId,
            markerColor: enInpuColorType[item.id],
            value: item.value,
          };
        });
        data.defSysParameterVoList = voList;
        data.proId = platformId.value;
        data.projectId = projectId.value;
        data.seriesId = seriesId.value;
        data.seriesgbomId = seriesGbomId.value;
        data.taskNum = 1;
        data.taskType = 2;
        DesignApiInfo.defSysParameterSubmit(data).then(function (res) {
          if (res.data.code == 0) {
            taskPageSaveMar({
              taskId: data.taskId,
              taskNum: 1,
              taskType: 2,
            });
            //保存按钮状态
            saveBtnStatus.value = true;
            commitBtnStatus.value = false;
            getBtnsStatus();
            message.success(res.data.msg == '' || res.data.msg == null ? '提交成功' : res.data.msg);
            getDataDetail();
          } else {
            message.error(res.data.msg);
          }
        });
      } else {
        data.projectId = projectId.value;
        data.remark = taskNum;
        const fileIds = ref<any>([]);
        gbomPlatformTableData.forEach((item: any) => {
          fileIds.value.push(item.id);
        });
        data.pdmFileId = fileIds.value;
        DesignApiInfo.ckSystemDesignSysConfigSubmit(data).then(function (res) {
          if (res.data.code == 0) {
            taskPageSaveMar({
              taskId: data.taskId,
              taskNum: 4,
              taskType: 2,
            });
            //保存按钮状态
            saveBtnStatus.value = true;
            commitBtnStatus.value = false;
            getBtnsStatus();
            message.success(res.data.msg == '' || res.data.msg == null ? '提交成功' : res.data.msg);
          } else {
            message.error(res.data.msg);
          }
        });
      }
    },
  });
};

//项目资料定义
//上传文件
const toUpload = async (type: string) => {
  isCommit.value = true;
  await getFakeData(3);
  await getFakeData(4);
  await getFakeData(5);
  await uploadPDMFileLog(type);
  typeData.value = [];
  uploadBelong.value = type;
  await changeSelectDefault(type);
  uploadSuccesscData.value = [];
  isToUpload.value = true;
};

const changeSelectDefault = (type: string) => {
  uploadDate.value.system = null;
  uploadDate.value.secret = null;
  uploadDate.value.stage = null;
  uploadDate.value.type = null;
  uploadDate.value.filePdfNum = '';
  uploadDate.value.filePdfVersion = '';
  if (type == '系统配置文件') {
    uploadDate.value.stage = '设计策划阶段文件';
    uploadDate.value.type = '110设计任务书';
  }
};

const uploadPDMFileLog = async (type: string) => {
  let fileInfoList: any = [];
  if (type == '系统配置文件') {
    fileInfoList = enSystemUpload.value;
  }
  let data: any = {
    fileInfoList: fileInfoList,
  };
  const res = await DesignApiInfo.uploadPDMFileLogApi(data);
  if (res.data.code == 0) {
    let data: any = res.data.data;
    uploadDate.value.system = data.system;
    uploadDate.value.secret = data.miji;
  }
};

//设计经理的任务修改提交状态
const submitStatus = async (num: any, operationType: any, nodeId: any) => {
  editflag.value = false;
  let obj: any = {};
  obj.taskId = taskId.value;
  obj.taskNum = num;
  obj.taskType = 2; //设计经理的任务
  obj.operationType = operationType;
  await DesignApiInfo.taskSubmitApi(obj).then(function (res) {
    debugger;
    if (res.data.code == 0) {
      isCommit.value = true;
      // 设计经理的任务提交状态
      if (operationType) {
        whetheror(num, 2); // 工程师的任务提交状态
        message.success('提交成功');
        if (nodeId >= 13) {
          getFakeData(designType.value);
          return;
        } else {
          nextTick(() => {
            selectedKeys.value = `${Number(nodeId) + 1}`;
          });
          getFakeData(designType.value);
        }
      } else {
        //改变保存和提交按钮
        editflag.value = true;
        saveBtnStatus.value = false;
        commitBtnStatus.value = false;
        getBtnsStatus();
        getFakeData(designType.value);
        message.success('编辑成功');
      }
    } else {
      message.error(res.data.msg);
    }
  });
};
// 选择pdm文档阶段
function editStage(id: string) {
  isCommit.value = true;
  if (activeTab.value == 'design-input') {
    getTreeData(designType.value, '', 7);
  } else {
    getTreeData(designType.value, '', 2);
  }
}
// 上传pdf成功
const uploadExcelSuccessc = (uploadFileList: any) => {
  if (uploadFileList.length) {
    uploadFileList.forEach((item: any) => {
      uploadSuccesscData.value.push(item);
    });
  }
};

const description = ref<string>(''); // 项目描述
// pdm上传确认
const uploadOk = () => {
  if (!uploadDate.value.system) {
    message.error('系统不能为空');
    return false;
  } else if (!uploadDate.value.secret) {
    message.error('密级不能为空');
    return false;
  } else if (!uploadDate.value.uploadType) {
    return message.error('请选择文件上传形式');
  } else if (uploadDate.value.uploadType == '1' && uploadSuccesscData.value.length <= 0) {
    message.error('请上传文件');
    return false;
  } else if (uploadDate.value.uploadType == '2' && !uploadDate.value.filePdfNum) {
    return message.error('文档编号不能为空');
  } else if (uploadDate.value.uploadType == '2' && !uploadDate.value.filePdfVersion) {
    return message.error('文档版本不能为空');
  } else {
    isToUpload.value = false;
  }
  switch (uploadBelong.value) {
    case '系统配置文件':
      dynamicCmpRef.value.Changefilelist(uploadSuccesscData.value);
      break;
    default:
      break;
  }
};
// 确认
function handleSave() {}
watch(
  () => router.query.parms,
  (newvalue: any, oldValue: any) => {
    let parm = decryptValue(newvalue);
    let paramStr = JSON.parse(parm);
    mainInfo.value = paramStr;
    //从路由中获取参数
    designType.value = paramStr.type;
    taskId.value = paramStr.id;
    seriesId.value = paramStr.seriesId;
    code.value = paramStr.code;
    projectId.value = paramStr.projectId;
    seriesGbomId.value = paramStr.seriesGbomId;
    platformId.value = paramStr.platformId;
    taskSourceId.value = paramStr.taskSourceId;
    taskInfo.value = paramStr.taskInfo;
    if (paramStr.seeTask) {
      isShowBottomBtns.value = false;
    } else {
      isShowBottomBtns.value = true;
    }
    getDataDetail();
    getTaskInfo();
    //调用结构树加载方法
    if (activeTab.value == 'design-input') {
      getTreeData(designType.value, '', 7);
    } else {
      getTreeData(designType.value, '', 2);
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="drawerContent">
    <!-- 左侧树结构 -->
    <Splitpanes class="default-theme sbom">
      <Pane min-size="15" :size="20" class="splitpane-cls marginstyle">
        <a-spin :spinning="loadingTree" tip="加载中...">
          <ATabs v-model:activeKey="activeTab" @change="handleTabChange" class="mb-4">
            <ATabPane key="design-input" tab="设计输入">
              <DesignTree
                ref="treePage"
                :operate-flag="true"
                :tree-data="treeData"
                bomType="unBom"
                :selected-keys="selectedKeys"
                :expanded-keys="expandedKeys"
                @select-node="selectNode"
                @reload-tree="reloadTree"
                @change-select-key="handleChangeSelectKey" />
            </ATabPane>
            <ATabPane key="system-design" tab="系统设计">
              <DesignTree
                ref="treePage"
                :operate-flag="true"
                :tree-data="treeData"
                bomType="unBom"
                :selected-keys="selectedKeys"
                :expanded-keys="expandedKeys"
                @select-node="selectNode"
                @reload-tree="reloadTree"
                @change-select-key="handleChangeSelectKey" />
            </ATabPane>
          </ATabs>
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <keep-alive>
          <component
            :is="currentComponent"
            ref="dynamicCmpRef"
            :taskId="taskId"
            :code="code"
            :projectId="projectId"
            :seriesGbomId="seriesGbomId"
            :taskInfoData="taskInfoData"
            :taskInfoData1="taskInfoData1"
            :description="description"
            :dataUpload="dataUpload"
            :isEdit="isEdit"
            :editBtnStatus="editBtnStatus"
            :isShowBottomBtns="isShowBottomBtns"
            :commitBtnStatus="commitBtnStatus"
            :saveBtnStatus="saveBtnStatus"
            :selectedKeys="selectedKeys"
            :designPlanUpload="designPlanUpload"
            :designPlanString="designPlanString"
            :projectPlanUpload="projectPlanUpload"
            :projectPlanString="projectPlanString"
            :seriesTableData="seriesTableData"
            :equipmentUpload="equipmentUpload"
            :equipmentString="equipmentString"
            :uploadPlaceData="uploadPlaceData"
            :illustrateFile="illustrateFile"
            :illustrateString="illustrateString"
            :gbomPlatformTableData="gbomPlatformTableData"
            :compliance="compliance"
            :systemTableData="systemTableData"
            :moduleColumns="moduleColumns"
            :moduleList="moduleList"
            :enSystemUpload="enSystemUpload"
            @toUpload="toUpload"
            @submitStatus="submitStatus"
            @ProjectMaterialssubmitOk="ProjectMaterialssubmitOk"
            @getModuleTree="getModuleTree" />
        </keep-alive>
      </Pane>
    </Splitpanes>
  </div>
  <UploadModal
    ref="addOrUpdate"
    :uploadSuccesscData="uploadSuccesscData"
    :taskId="taskId"
    :systemsData="systemsData"
    :secretData="secretData"
    :stageData="stageData"
    :typeData="typeData"
    :modalVisible="isToUpload"
    :uploadBelong="uploadBelong"
    :uploadDate="uploadDate"
    @uploadOk="uploadOk"
    @handleSave="handleSave"
    @editStage="editStage"
    @uploadsuccess="uploadExcelSuccessc"
    @onClose="isToUpload = false"></UploadModal>
</template>

<style lang="less" scoped>
::v-deep(.splitpanes__splitter:after),
::v-deep(.splitpanes__splitter:before) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.sbom > .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: #fff;
}
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}
.drawerContent {
  display: flex;
  height: calc(100vh - 120px);
  background-color: #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}

//表格里的适用阶段样式
.status-tags {
  span {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 12px;
    color: #6a696e;
    line-height: 12px;
    font-style: normal;
    text-transform: none;
    min-width: 64px;
    height: 20px;
    background: #eaeaf1;
    border-radius: 13px 13px 13px 13px;
    text-align: center;
    padding: 4px 8px;
    margin-right: 4px;
  }
}
</style>
