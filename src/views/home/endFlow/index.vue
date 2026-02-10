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
import InputConfiguration from './components/form/InputConfiguration.vue';
import JobDescription from './components/form/JobDescription.vue';
import DesignOutput from './components/form/DesignOutput.vue';
import VersionInformation from './components/modal/VersionInformation.vue';
import UploadModal from './components/modal/upload-modal.vue';
import { decryptValue } from '@/utils';
/** 声明组件类型  */
interface componentType {
  [key: string]: any;
}
const VersionInformationRef = ref<any>(null);
// 上传参数
/** 初始化组件 */
const currentComponent = ref<any>(InputConfiguration);
// 创建一个映射表，将key与对应的组件进行关联
const componentMap = reactive<componentType>({
  329: InputConfiguration, // 输入配置
  331: JobDescription, // 工作说明
  332: DesignOutput, // 设计输出
});
const userStore = useUserStore();
const detailProject = ref<any>({}); //设计经理任务流程详情
const uploadDate = ref<any>({});
const mainInfo = ref<any>({});
const taskInfoData = ref<any>({});
const router = useRoute();
const isCommit = ref(false);
const isShowBottomBtns = ref(true);
const designUpload = ref<any>([]); // 设计说明文件上传
const loginData = reactive<any>({
  userId: userStore.getUser.id,
});
const isShowVersionDialog = ref<boolean>(false);
// 树结构相关属性
const uploadBelong = ref<any>(''); // 需要pdm上传的地方
const treeData = ref<any>([]); // 树结构数据
const selectedKeys = ref<string>(''); // 选中的树的id
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const loadingTree = ref<boolean>(false);
const activeTab = ref('system-design'); // 当前激活的tab
const requestProjectParams = reactive(new ProjectInfoRequestDTOModel());
const isEdit = ref(false);
const isToUpload = ref(false); // 上传文件弹窗
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
const taskInfo = ref<any>({});
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
const designPlanUpload = ref([]); // 设计计划上传文件
const designPlanString = ref(null); // 设计计划描述
const projectPlanUpload = ref([]); // 项目计划上传文件
const projectPlanString = ref(null); // 项目计划描述
const placeFileData = ref([]); //预览本地
const pdmFileData = ref([]); //预览pdm
const uploadPlaceData = ref([]);
const equipmentUpload = ref([]); // 车下设备上传文件
const equipmentString = ref(null); // 车下设备布置描述
const inpuColorType = reactive({}); // 控制参数展示状态
const dynamicCmpRef = ref<any>(null);
const illustrateObj = ref({}); // 系统设计说明详情
const definitionFos = ref<any>({}); // 任务定义的当前数据
const twoRoundVersionBuilds = ref([]);
const engineerTreeData = ref<any>([]); //工程师任务树
// 获取任务流程详情
const getDetailProject = (id: number) => {
  DesignApiInfo.getEnDesignInputDetailApi({ id: id || taskId, taskSourceId: taskSourceId.value }).then(function (res) {
    if (res.data.code == 0) {
      const { data } = res.data;
      detailProject.value = data || [];
      const projectFile = data.projectFile || {};
      const dataData = data.data || {};
      const designPlan = data.designPlan || {};
      const projectPlan = data.projectPlan || {};
      const equipment = data.equipment || {};
      const findAllModuleAttach = data.findAllModuleAttachment || {};
      const flatSectionFile = data.flatSectionFile || {};
      const flatSectionFileurl = data.flatSectionFileurl;
      const illustrate = data.illustrate || {};
      const flat = data.flat;

      // dataString.value = projectFile.dataString;
      // dataUpload.value = dataData;

      designPlanString.value = projectFile.designPlanString;
      designPlanUpload.value = designPlan;

      projectPlanString.value = projectFile.projectPlanString;
      projectPlanUpload.value = projectPlan;

      equipmentString.value = projectFile.equipmentString;
      equipmentUpload.value = equipment;

      // uploadPlaceData.value = flatSectionFile;
      // uploadPlaceData.value.fileUrl = flatSectionFileurl;
      uploadPlaceData.value = flat;
      //预览详情平断面
      placeFileData.value = findAllModuleAttach.attachmentList || [];
      pdmFileData.value = findAllModuleAttach.pdmResult || [];
      illustrateObj.value = illustrate;
    }
  });
};
// 获取三轮任务定义详情
const getDefinitionDataEnd = ref();
const workExplainStringEnd = ref();
const auditDataListDataEnd = ref();
const dimensionalStringEnd = ref();
const accomplishStringEnd = ref();
const fileListDataEnd = ref([]);

const relevantDataEnd = ref<any>({});
const relevantStringEnd = ref();
const getDefinitionEnd = (row: any) => {
  const obj: any = {};
  obj.taskId = row.id;
  obj.engineerGbomId = row.engineerGbomId;
  DesignApiInfo.getAuditDataApi(obj).then(function (res) {
    if (res.data.code == 0) {
      let condata: any = res.data.data || [];
      getDefinitionDataEnd.value = condata;
      if (condata.relatedFileName) {
        relevantDataEnd.value.oldFileName = condata.relatedFileName ? condata.relatedFileName : '';
      }
      if (condata.relatedFileUrl) {
        relevantDataEnd.value.fileUrl = condata.relatedFileUrl ? condata.relatedFileUrl : '';
      }
      if (condata.relatedFileId) {
        relevantDataEnd.value.id = condata.relatedFileId ? condata.relatedFileId : '';
      }
      relevantStringEnd.value = condata.relatedFileString;
      workExplainStringEnd.value = condata.jobDescription;
      auditDataListDataEnd.value = condata.auditDataList || [];
      const designer = condata.designer || {};
      const designerFiles = condata.designerFiles || [];
      dimensionalStringEnd.value = designer.drawing;
      accomplishStringEnd.value = designer.complete;
      // fileListDataEnd.value = designerFiles.map(item => {
      //   return { id: item.fileId, oldFileName: item.fileName, fileUrl: item.fileUrl };
      // });
      fileListDataEnd.value = designerFiles;
    } else {
      message.error(res.data.msg);
    }
  });
};
const enParameterListEnd = ref();
const projectParametersArrEnd = ref([]);
const getDefSysParameterListEnd = (row: any) => {
  const obj: any = {};
  obj.projectId = row.projectId;
  obj.seriesgbomId = row.seriesGbomId;
  obj.taskId = row.taskSourceId;
  obj.taskNum = 1;
  obj.taskType = 2;
  DesignApiInfo.getDefSysParameterListApi(obj).then(function (res) {
    if (res.data.code == 0) {
      enParameterListEnd.value = res.data.data || [];
      const dataArr = res.data.data.result || [];
      getGbomParameterListEnd(row.seriesGbomId, dataArr);
      projectParametersArrEnd.value = dataArr;
    } else {
      message.error(res.data.msg);
    }
  });
};
// 获取bom参数定义
const gbomPlatformTableDataEnd = ref<any>([]);
const getGbomParameterListEnd = (id: any, enarr: any) => {
  const data: any = {};
  data.seriesGBOMId = id;
  DesignApiInfo.getGbomParameterListApi(data).then(function (res) {
    if (res.data.code == 0) {
      const dataArr = res.data.data || [];
      dataArr.map((item: any) => {
        const fos = enarr.filter((element: any) => +element.seriesgbomParameterId === +item.id)[0];
        if (fos) {
          item.value = fos.value;
          item.seriesgbomParameterId = fos.seriesgbomParameterId;
          item.fosId = fos.id;
        }
      });
      gbomPlatformTableDataEnd.value = dataArr || [];
    } else {
      message.error(res.data.msg);
    }
  });
};

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 处理搜索功能 */
async function handleChangeSelectKey(searchValue: string, languageSel: string) {
  // 当搜索值为空时，显示完整树结构
  if (!searchValue) {
    // 重新获取数据
    if (activeTab.value == 'design-input') {
      getTreeData(designType.value);
    } else {
      getTreeData(designType.value);
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
    getTreeData('8');
  } else {
    getTreeData('9');
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
const definitionTaName = ref<string>('');
async function selectNode(node: any) {
  fosTreeObj.value = node;
  selectedKeys.value = node.key;
  currentComponent.value = componentMap[node.key] || null;
  switch (selectedKeys.value) {
    case '329':
      nextTick(() => {
        dynamicCmpRef.value.getDefSysParameterList(1, 2);
        dynamicCmpRef.value.eninventoryEnd(taskInfo.value);
      });
      definitionTaName.value = '输入配置';
      break;
    case '331':
      definitionTaName.value = '工作说明';
      getDefinitionEnd(taskInfo.value);
      nextTick(() => {
        whetheror(1);
      });
      break;
    case '332':
      definitionTaName.value = '设计输出';
      getDefinitionEnd(taskInfo.value);
      nextTick(() => {
        whetheror(2);
      });
      break;

    default:
      break;
  }
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  if (activeTab.value == 'design-input') {
    getTreeData(designType.value);
  } else {
    getTreeData(designType.value);
  }
}
/** 获取分类数据 */
async function getTreeData(type: any, id?: any) {
  if (!isCommit.value) {
    loadingTree.value = true;
  }
  try {
    requestProjectParams.type = type;
    requestProjectParams.taskId = taskId.value;
    if (id) {
      requestProjectParams.id = id;
    }
    const res = await DesignApiInfo.getFakeDataApi({ ...requestProjectParams });
    if (res.data.code == 0) {
      const { data } = res.data;
      debugger;
      if (type == 9) {
        // 转换数据格式
        engineerTreeData.value = convertToTreeNodes(data);
        if (engineerTreeData.value[0].children) {
          const c = engineerTreeData.value[0].children;
          if (!isCommit.value && c && c.length > 0) {
            selectedKeys.value = c[0].key;
            expandedKeys.value = engineerTreeData.value[0].key;
            selectNode(engineerTreeData.value[0].children[0]);
            // whetheror(1, 1); //判断是否已经提交
          } else {
            selectNode({ key: selectedKeys.value });
          }
        }
      } else if (type === 3) {
        systemsData.value = data || [];
      } else if (type === 4) {
        secretData.value = data || [];
      } else if (type === 5) {
        stageData.value = data || [];
      } else if (type === 6) {
        typeData.value = data || [];
      } else {
        treeData.value = convertToTreeNodes(data) || [];
        if (treeData.value.length > 0 && treeData.value[0].children) {
          const c = treeData.value[0].children;
          if (!isCommit.value && c && c.length > 0) {
            selectedKeys.value = c[0].key;
            expandedKeys.value = treeData.value[0].key;
            selectNode(treeData.value[0].children[0]);
            // whetheror(1, 1); //判断是否已经提交
          } else {
            selectNode({ key: selectedKeys.value });
          }
        }
      }
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    loadingTree.value = false;
  }
}
function clickisShowVersionDialog() {
  isShowVersionDialog.value = true;
}
async function getTaskInfo() {
  const res = await DesignApiInfo.getTaskInfoApi({ taskId: taskId.value, tag: 2, userId: userStore.getUser.id });
  if (res.data.code == 0) {
    taskInfoData.value = { ...res.data.data };
    twoRoundVersionBuilds.value = res.data.data.twoRoundVersionBuilds || [];
  }
}

//判断是否已经提交
const whetheror = (num: number, row?: any) => {
  if (editflag.value) {
    return;
  }
  let obj: any = {};
  if (row) {
    obj.taskId = row.id;
  } else {
    obj.taskId = taskId.value;
  }
  obj.taskNum = num;
  obj.taskType = 3;
  initBtnStatus();
  DesignApiInfo.whetherToSubmitApi(obj).then(function (res) {
    if (res.data.code == 0) {
      saveBtnStatus.value = res.data.data.saveFlag;
      commitBtnStatus.value = res.data.data.submitFlag;
      getBtnsStatus();
    }
  });
};

function initBtnStatus() {
  editBtnStatus.value = false;
  saveBtnStatus.value = false;
  commitBtnStatus.value = false;
  isEdit.value = false;
}

const getBtnsStatus = () => {
  //没保存 没提交
  if (!saveBtnStatus.value && !commitBtnStatus.value) {
    //编辑按钮不可点
    editBtnStatus.value = true;
    saveBtnStatus.value = false;
    commitBtnStatus.value = true;
    isEdit.value = false;

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
// 保存第三轮任务定义
const definitionSave = (chIds: any, accomplishStringEnds: any, dimensionalStringEnds: any) => {
  const data: any = {};
  data.taskId = taskId.value;
  data.userId = userStore.getUser.id;
  data.complete = accomplishStringEnds;
  data.drawing = dimensionalStringEnds;
  if (chIds.length > 0) {
    data.ids = chIds.map((item: any) => item.id);
  }
  data.designerFileVos = fileListDataEnd.value.map((item: any) => {
    return { fileId: item.id };
  });
  DesignApiInfo.commitContentApi(data).then(function (res) {
    if (res.data.code == 0) {
      //保存按钮状态
      saveBtnStatus.value = true;
      commitBtnStatus.value = false;
      getBtnsStatus();
      taskPageSaveMar({
        taskId: data.taskId,
        taskNum: definitionTaName.value == '工作说明' ? 1 : 2,
        taskType: 3,
      });
      message.success('保存成功');
    } else {
      message.error(res.data.msg);
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
  await getTreeData(3);
  await getTreeData(4);
  await getTreeData(5);
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
    fileInfoList = fileListDataEnd.value;
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
const submitStatus = async (operationType: any, nodeId: any) => {
  editflag.value = false;
  let obj: any = {};
  obj.taskId = definitionFos.value.id;
  let num = 0;
  if (definitionTaName.value === '工作说明') {
    num = 1;
  } else if (definitionTaName.value === '设计输出') {
    num = 2;
  }
  obj.taskNum = num;
  obj.taskType = 3; //设计师的任务
  obj.operationType = operationType;
  await DesignApiInfo.taskSubmitApi(obj).then(function (res) {
    if (res.data.code == 0) {
      isCommit.value = true;
      if (operationType) {
        whetheror(num); // 设计师的任务提交状态
        message.success('提交成功');
        if (nodeId >= 332) {
          getTreeData('9');
          return;
        } else {
          nextTick(() => {
            selectedKeys.value = `${Number(nodeId) + 1}`;
          });
          getTreeData('9');
        }
      } else {
        editflag.value = true;
        saveBtnStatus.value = false;
        commitBtnStatus.value = false;
        getBtnsStatus();
        getTreeData('9');
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
  getTreeData(6, id);
}
// 上传pdf成功
const uploadExcelSuccessc = (uploadFileList: any) => {
  if (uploadFileList.length) {
    uploadFileList.forEach((item: any) => {
      uploadSuccesscData.value.push(item);
    });
  }
};
function delEnSystemUpload(row: any) {
  fileListDataEnd.value = fileListDataEnd.value.filter(item => item.id !== row.id);
}
// pdm上传确认
const uploadOk = (data: any) => {
  loginData.system = data.system;
  loginData.miji = data.secret;
  loginData.docType = data.type;
  loginData.taskId = data.id;
  debugger;
  console.log(uploadDate.value, 'uploadDate.value');
  if (!uploadDate.value.system) {
    return message.error('系统不能为空');
  } else if (!uploadDate.value.secret) {
    return message.error('密级不能为空');
  } else if (!uploadDate.value.uploadType) {
    message.error('请选择文件上传形式');
    return false;
  } else if (uploadDate.value.uploadType == '1' && uploadSuccesscData.value.length <= 0) {
    if (!loginData.docType) {
      message.error('请上传文件');
      return false;
    }
  } else if (uploadDate.value.uploadType == '2') {
    if (!uploadDate.value.filePdfNum) {
      message.error('文档编号不能为空');
      return false;
    } else if (!uploadDate.value.filePdfVersion) {
      message.error('文档版本不能为空');
      return false;
    }
  } else {
    isToUpload.value = false;
  }
  switch (uploadBelong.value) {
    case '项目资料':
      dataUpload.value = uploadSuccesscData.value;
      break;
    case '设计计划':
      designPlanUpload.value = uploadSuccesscData.value;
      break;
    case '项目计划':
      projectPlanUpload.value = uploadSuccesscData.value;
      break;
    case '车下设备布置':
      equipmentUpload.value = uploadSuccesscData.value;
      break;
    case '设计说明':
      designUpload.value = uploadSuccesscData.value;
      break;
    case '系统配置文件':
      if (uploadSuccesscData.value.length) {
        if (fileListDataEnd.value != undefined && fileListDataEnd.value != null && fileListDataEnd.value.length > 0) {
          fileListDataEnd.value = fileListDataEnd.value.concat(uploadSuccesscData.value);
        } else {
          fileListDataEnd.value = uploadSuccesscData.value;
        }
      }
      break;
    default:
      break;
  }
};

onMounted(() => {
  //调用结构树加载方法
  getTaskInfo();
  getTreeData('9'); // 经理任务流程树
  getDetailProject(taskId.value);
});
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
    taskInfo.value = JSON.parse(paramStr.taskInfo);
    if (paramStr.seeTask) {
      isShowBottomBtns.value = false;
    } else {
      isShowBottomBtns.value = true;
    }
    if (taskInfo.value) {
      definitionFos.value = taskInfo.value;
      getDefinitionEnd(taskInfo.value);
      getDefSysParameterListEnd(taskInfo.value);
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
                :tree-data="engineerTreeData"
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
            :accomplishStringEnd="accomplishStringEnd"
            :dimensionalStringEnd="dimensionalStringEnd"
            :fileListDataEnd="fileListDataEnd"
            :twoRoundVersionBuilds="twoRoundVersionBuilds"
            :gbomPlatformTableDataEnd="gbomPlatformTableDataEnd"
            :workExplainStringEnd="workExplainStringEnd"
            :relevantDataEnd="relevantDataEnd"
            :relevantStringEnd="relevantStringEnd"
            :auditDataListDataEnd="auditDataListDataEnd"
            :taskInfo="taskInfo"
            :projectId="projectId"
            :seriesGbomId="seriesGbomId"
            :taskInfoData="taskInfoData"
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
            :equipmentUpload="equipmentUpload"
            :equipmentString="equipmentString"
            :uploadPlaceData="uploadPlaceData"
            @delEnSystemUpload="delEnSystemUpload"
            @toUpload="toUpload"
            @submitStatus="submitStatus"
            @definitionSave="definitionSave"
            @ProjectMaterialssubmitOk="ProjectMaterialssubmitOk"
            @clickisShowVersionDialog="clickisShowVersionDialog" />
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
  <VersionInformation :modalVisible="isShowVersionDialog" ref="VersionInformationRef" @getTaskInfo="getTaskInfo" @onClose="isShowVersionDialog = false"></VersionInformation>
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
