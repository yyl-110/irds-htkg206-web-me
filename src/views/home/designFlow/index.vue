<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { Modal, Popconfirm, message } from 'ant-design-vue';
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
  2: ProjectMaterials, // 项目资料定义
  3: DesignPlan, // 设计计划定义
  4: TopleveLindicators, // 顶层指标定义
  5: HorizontalEquipment, //平断面及其设备配置
  6: SystemFunctions, //系统功能配置
  7: DesignAssignment, //设计任务发放
});
const detailProject = ref({}); //设计经理任务流程详情
const uploadDate = ref<any>({});
const mainInfo = ref<any>({});
const taskInfoData = ref<any>({});
const router = useRoute();
const isCommit = ref(false);
const isShowBottomBtns = ref(true);
const updateFiles = ref([]);
// 树结构相关属性

const uploadBelong = ref(''); // 需要pdm上传的地方
const treeData = ref<any>([]); // 树结构数据
const selectedKeys = ref<string>(''); // 选中的树的id
const expandedKeys = ref<any>();
const selectNodeKeys = ref<string>('');
const treePage = ref<any>(null);
const loadingTree = ref<boolean>(false);
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
const requestProjectParams = reactive(new ProjectInfoRequestDTOModel());
const requestProTaskParams = reactive(new ProjectTaskRequestDTOModel());
const isEdit = ref(false);
const isToUpload = ref(false); // 上传文件弹窗
const loading = ref<boolean>(false);
const fosTreeObj = ref({}); // 目标树形数据
const designType = ref(0); //类别从工作台传递跳转
const taskId = ref(0); //工作台传递流程ID
const seriesId = ref(0); //工作台传递流程seriesId
const code = ref<string>(''); //工作台传递流程code
const projectId = ref<string>(''); //工作台传递流程cprojectId
const seriesGbomId = ref<string>(''); //工作台传递流程seriesGbomId
const platformId = ref<string>(''); //工作台传递流程platformId
const taskSourceId = ref<string>(''); //工作台传递流程taskSourceId
const taskInfo = ref([]);

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
const dataString = ref(null); //项目资料描述
const designPlanUpload = ref([]); // 设计计划上传文件
const designPlanString = ref(null); // 设计计划描述
const projectPlanUpload = ref([]); // 项目计划上传文件
const projectPlanString = ref(null); // 项目计划描述
const placeFileData = ref([]); //预览本地
const pdmFileData = ref([]); //预览pdm
const uploadPlaceData = ref([]);
const actionPlaceUrl = ref('');
const equipmentUpload = ref([]); // 车下设备上传文件
const equipmentString = ref(null); // 车下设备布置描述
let inpuColorType = reactive({}); // 控制参数展示状态
const dynamicCmpRef = ref<any>(null);
const editflag = ref<boolean>(false);
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 处理搜索功能 */
async function handleChangeSelectKey(searchValue: string, languageSel: string) {
  // 当搜索值为空时，显示完整树结构
  if (!searchValue) {
    // 重新获取数据
    await getTreeData(designType.value);
    return;
  }

  // 根据搜索值过滤树节点
  const filteredData = filterTreeNodes(dataSource.value, searchValue);
  console.log(filteredData);
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;
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

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getTreeData(designType.value);
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
      treeData.value = convertToTreeNodes(rawData);
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
  const res = await DesignApiInfo.getTaskInfoApi({ taskId: taskId.value });
  if (res.data.code == 0) {
    taskInfoData.value = { ...res.data.data };
  }
}
const getDataDetail = async () => {
  const res = await DesignApiInfo.getDataDetailApi({ taskId: taskId.value });
  if (res.data.code == 0) {
    dataUpload.value = res.data.data.dataFile == null ? [] : res.data.data.dataFile;
    dataString.value = res.data.data.dataString;
  }
};
//判断是否已经提交
async function whetheror(num: number, type: number) {
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

function getBtnsStatus() {
  //没保存 没提交
  if (!saveBtnStatus.value && !commitBtnStatus.value) {
    if (selectedKeys.value == '6' || selectedKeys.value == '7') {
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
  if (saveBtnStatus.value && !commitBtnStatus.value) {
    //编辑按钮不可点
    editBtnStatus.value = false;
    saveBtnStatus.value = true;
    commitBtnStatus.value = false;
    isEdit.value = true;
    return;
  }
  if (!saveBtnStatus.value && commitBtnStatus.value) {
    //编辑按钮不可点
    editBtnStatus.value = false;
    saveBtnStatus.value = true;
    commitBtnStatus.value = true;
    isEdit.value = true;
    return;
  }
  if (saveBtnStatus.value && commitBtnStatus.value) {
    //编辑按钮可点
    editBtnStatus.value = false;
    saveBtnStatus.value = true;
    commitBtnStatus.value = true;
    isEdit.value = true;
    return;
  }
}

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
//获取树形节点数据
const getFakeData = (type: any, id?: any) => {
  const data: any = {};
  data.type = type;
  data.taskId = taskId.value;
  if (id) {
    data.id = id;
  }
  return DesignApiInfo.getFakeDataApi(data).then(function (res) {
    if (res.data.code == 0) {
      const { data } = res.data;
      if (type === 3) {
        systemsData.value = data || [];
      } else if (type === 4) {
        secretData.value = data || [];
      } else if (type === 5) {
        stageData.value = data || [];
      } else if (type === 6) {
        typeData.value = data || [];
      } else {
        treeData.value = data || [];
        const c = data[0].children;
        if (!isCommit.value) {
          selectedKeys.value = c[0].id;
          whetheror(1, 1); //判断是否已经提交
        }
      }
    }
  });
};
const uploadPDMFileLog = async (type: string) => {
  let fileInfoList: any = [];
  if (type == '项目资料') {
    fileInfoList = dataUpload.value;
  } else if (type == '设计计划') {
    fileInfoList = designPlanUpload.value;
  } else if (type == '项目计划') {
    fileInfoList = projectPlanUpload.value;
  } else if (type == '车辆平断面') {
    fileInfoList = uploadPlaceData.value;
  } else if (type == '车下设备布置') {
    fileInfoList = equipmentUpload.value;
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
const changeSelectDefault = (type: string) => {
  uploadDate.value.system = null;
  uploadDate.value.secret = null;
  uploadDate.value.stage = null;
  uploadDate.value.type = null;
  uploadDate.value.filePdfNum = '';
  uploadDate.value.filePdfVersion = '';
  if (type == '车下设备布置') {
    uploadDate.value.stage = '设计策划阶段文件';
    uploadDate.value.type = '103车下设备布置图';
  }
  if (type == '设计说明') {
    uploadDate.value.stage = '设计策划阶段文件';
    uploadDate.value.type = '110设计任务书';
  }
  if (type == '更新设计说明') {
    uploadDate.value.stage = '设计策划阶段文件';
    uploadDate.value.type = '110设计任务书';
  }
  if (type == '项目资料') {
    uploadDate.value.stage = '设计策划阶段文件';
    uploadDate.value.type = '030设计输入文件清单';
  }
  if (type == '设计计划') {
    uploadDate.value.stage = '设计策划阶段文件';
    uploadDate.value.type = '100研发计划';
  }
  if (type == '项目计划') {
    uploadDate.value.stage = '设计策划阶段文件';
    uploadDate.value.type = '100研发计划';
  }
  if (type == '车辆平断面') {
    uploadDate.value.stage = '设计策划阶段文件';
    uploadDate.value.type = '101列车编组、断面图';
  }
};

// 项目资料定义
const ProjectMaterialssubmitOk = (taskNum: number, dataString: number, dataUpload: any) => {
  Modal.confirm({
    title: '确定要保存此次修改吗？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      let data: any = {};
      data.taskId = taskId.value;
      data.userId = userStore.getUser.id;
      if (selectedKeys.value == '2') {
        data.dataString = dataString;
        data.dataNumber = getIds(dataUpload);
        DesignApiInfo.addDataProjectApi(data).then(function (res) {
          if (res.data.code == 0) {
            taskPageSaveMar({
              taskId: data.taskId,
              taskNum: taskNum,
              taskType: 1,
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
      }
    },
  });
};
// 设计计划定义
const DesignPlansubmitOk = (taskNum: number, designPlanString: string, designPlanUpload: any, projectPlanString: string, projectPlanUpload: any) => {
  Modal.confirm({
    title: '确定要保存此次修改吗？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      let data: any = {};
      data.taskId = taskId.value;
      data.userId = userStore.getUser.id;
      if (selectedKeys.value == '3') {
        data.designPlanString = designPlanString;
        data.designPlanNumber = getIds(designPlanUpload);
        data.projectPlanString = projectPlanString;
        data.projectPlanNumber = getIds(projectPlanUpload);
        DesignApiInfo.addDesignPlanApi(data).then(function (res) {
          if (res.data.code == 0) {
            taskPageSaveMar({
              taskId: data.taskId,
              taskNum: taskNum,
              taskType: 1,
            });
            //保存按钮状态
            saveBtnStatus.value = true;
            commitBtnStatus.value = false;
            getBtnsStatus();
            message.success(res.data.msg == '' || res.data.msg == null ? '提交成功' : res.data.msg);
            dynamicCmpRef.value.getDesignPlanDetail();
          } else {
            message.error(res.data.msg);
          }
        });
      }
    },
  });
};
// 顶层指标定义
const TopleveLindicatorssubmitOk = (taskNum: number, seriesTableData: any, inpuColorType: any) => {
  Modal.confirm({
    title: '确定要保存此次修改吗？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      let data: any = {};
      data.taskId = taskId.value;
      data.userId = userStore.getUser.id;
      if (selectedKeys.value == '4') {
        const voList = seriesTableData.map((item: any) => {
          return {
            seriesParameterId: item.id,
            markerColor: inpuColorType[item.id],
            value: item.value,
          };
        });
        data.voList = voList;
        data.taskNum = taskNum;
        data.taskType = 1;
        DesignApiInfo.defineProjectParameterApi(data).then(function (res) {
          if (res.data.code == 0) {
            taskPageSaveMar({
              taskId: data.taskId,
              taskNum: taskNum,
              taskType: 1,
            });
            //保存按钮状态
            saveBtnStatus.value = true;
            commitBtnStatus.value = false;
            getBtnsStatus();
            message.success(res.data.msg == '' || res.data.msg == null ? '提交成功' : res.data.msg);
            getDetailProject(data.taskId, taskNum, 1);
            dynamicCmpRef.value.getCompliance();
          } else {
            message.error(res.data.msg);
          }
        });
      }
    },
  });
};
// 顶层指标定义
const submitOkHorizontalEquipment = (taskNum: number, equipmentString: any, equipmentUpload: any, uploadPlaceData: any) => {
  Modal.confirm({
    title: '确定要保存此次修改吗？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      let data: any = {};
      data.taskId = taskId.value;
      data.userId = userStore.getUser.id;
      if (selectedKeys.value == '5') {
        data.equipmentString = equipmentString;
        data.equipmentNumber = getIds(equipmentUpload);
        let arr: any = [];
        uploadPlaceData.forEach((item: any) => {
          arr.push({
            id: item,
            fileType: item.fileType ? item.fileType : 0,
          });
        });
        data.flatSectionFileId = arr;
        DesignApiInfo.addEquipmentApi(data).then(function (res) {
          if (res.data.code == 0) {
            taskPageSaveMar({
              taskId: data.taskId,
              taskNum: taskNum,
              taskType: 1,
            });

            //保存按钮状态
            saveBtnStatus.value = true;
            commitBtnStatus.value = false;
            getBtnsStatus();
            message.success(res.data.msg == '' || res.data.msg == null ? '提交成功' : res.data.msg);
            dynamicCmpRef.value.getFlatCutDetail();
          } else {
            message.error(res.data.msg);
          }
        });
      }
    },
  });
};

const projectParametersArr = ref([]);
// 获取任务流程详情
const getDetailProject = (id: any, taskNum?: any, taskType?: any) => {
  const taskIdval = taskId.value;
  let __data = {
    taskId: id || taskIdval,
    taskNum,
    taskType,
  };
  DesignApiInfo.getDetailProjectApi(__data).then(function (res) {
    if (res.data.code == 0) {
      let data: any = res.data.data;
      detailProject.value = data || [];
      const projectFile = data.projectFile || {};
      const dataData = data.data || {};
      const designPlan = data.designPlan || {};
      const projectPlan = data.projectPlan || {};
      const equipment = data.equipment || {};
      const krAttributeMap = data.krAttributeMap || {};
      const flat = data.flat || [];
      // const flatSectionFile = data.flatSectionFile || {};
      // const flatSectionFileurl = data.flatSectionFileurl;

      // dataString.value = projectFile.dataString;
      // dataUpload.value = dataData;

      // designPlanString.value = projectFile.designPlanString;
      // designPlanUpload.value = designPlan;

      // projectPlanString.value = projectFile.projectPlanString;
      // projectPlanUpload.value = projectPlan;

      // equipmentString.value = projectFile.equipmentString;
      // equipmentUpload.value = equipment;

      // uploadPlaceData.value = flatSectionFile;
      // uploadPlaceData.value.fileUrl = flatSectionFileurl;
      // uploadSuccessFiles.value = flat;
      uploadPlaceData.value = flat;
      //预览详情平断面
      placeFileData.value = krAttributeMap.attachmentList || [];
      pdmFileData.value = krAttributeMap.pdmResult || [];
      //先覆盖处理
      projectParametersArr.value = data.projectParameters;
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
//设计经理的任务修改提交状态
const submitStatus = async (num: any, operationType: any, nodeId: any) => {
  editflag.value = false;
  let obj: any = {};
  obj.taskId = taskId.value;
  obj.taskNum = num;
  obj.taskType = 1; //设计经理的任务
  obj.operationType = operationType;
  await DesignApiInfo.taskSubmitApi(obj).then(function (res) {
    if (res.data.code == 0) {
      isCommit.value = true;
      // 设计经理的任务提交状态
      if (operationType) {
        whetheror(num, 1);
        message.success('提交成功');
        if (nodeId > treeData.value[0].children.length) {
          getTreeData(designType.value);
          return;
        } else {
          nextTick(() => {
            selectedKeys.value = `${Number(nodeId) + 1}`;
          });
          getTreeData(designType.value);
        }
      } else {
        //改变保存和提交按钮
        editflag.value = true;
        saveBtnStatus.value = false;
        commitBtnStatus.value = false;
        getBtnsStatus();
        getTreeData(designType.value);
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
  getTreeData('6', id);
}
// 上传pdf成功
const uploadExcelSuccessc = (uploadFileList: any) => {
  if (uploadFileList.length > 0) {
    uploadFileList.forEach((item: any) => {
      uploadSuccesscData.value.push(item);
    });
  }
};
const removeParamFileList = (file: any) => {
  if (uploadSuccesscData.value.length > 0) {
    const newUsers = uploadSuccesscData.value.filter((item: any) => item.id !== file.id);
    uploadSuccesscData.value = newUsers;
  }
  // let obj = {
  //   id: file.response.data.id,
  // };
  // deletePdmFileInfoApi(obj).then(function (res) {
  //   if (res.code == 0) {
  //     message.success('删除成功');
  //   } else {
  //     message.error('删除失败');
  //   }
  // });
};
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
    case '项目资料':
      if (uploadSuccesscData.value.length) {
        dynamicCmpRef.value.Changefilelist(uploadSuccesscData.value);
      }
      break;
    case '设计计划':
      if (uploadSuccesscData.value.length) {
        dynamicCmpRef.value.designChangefilelist(uploadSuccesscData.value);
      }
      break;
    case '项目计划':
      if (uploadSuccesscData.value.length) {
        dynamicCmpRef.value.projectChangefilelist(uploadSuccesscData.value);
      }
      break;
    case '车下设备布置':
      if (uploadSuccesscData.value.length) {
        dynamicCmpRef.value.equipmentUploadDatafilelist(uploadSuccesscData.value);
      }
      break;
    case '设计说明':
      if (uploadSuccesscData.value.length) {
        dynamicCmpRef.value.Assignmentfilelist(uploadSuccesscData.value);
      }
      break;
    case '更新设计说明':
      if (uploadSuccesscData.value.length) {
        dynamicCmpRef.value.updateAssignmentfilelist(uploadSuccesscData.value);
      }
      break;
    case '车辆平断面':
      if (uploadSuccesscData.value.length) {
        dynamicCmpRef.value.uploadPlaceDatafilelist(uploadSuccesscData.value);
        addFileList();
      }
      break;
    default:
      break;
  }
};
const addFileList = () => {
  const data: any = {};
  let arr: any = [];
  data.taskId = taskId.value;
  uploadPlaceData.value.forEach(item => {
    arr.push(item.id);
  });
  data.ids = arr;
  DesignApiInfo.addFileListApi(data).then(function (res) {
    if (res.data.code == 0) {
      // dynamicCmpRef.value.getFlatCutDetail();
    } else {
      message.error(res.data.msg);
    }
  });
};

async function selectNode(node: any) {
  fosTreeObj.value = node;
  selectedKeys.value = node.key;
  currentComponent.value = componentMap[node.key] || null;
  // 使用映射表来直接获取对应的组件，并赋值给currentComponent
  if (node.key) {
    switch (node.key) {
      case '2':
        nextTick(() => {
          whetheror(1, 1);
          dynamicCmpRef.value.getDataDetail();
        });
        break;
      case '3':
        nextTick(() => {
          whetheror(2, 1);
          dynamicCmpRef.value.getDesignPlanDetail();
        });
        break;
      case '4':
        nextTick(() => {
          dynamicCmpRef.value.getParameterList(seriesId.value);
          dynamicCmpRef.value.getCompliance();
          whetheror(3, 1);
          getDetailProject(taskId.value, 3, 1);
        });
        break;
      case '5':
        nextTick(() => {
          whetheror(4, 1);
          dynamicCmpRef.value.getFlatCutDetail();
        });
        break;
      case '6':
        nextTick(() => {
          dynamicCmpRef.value.getProjectBOM(taskId.value);
          whetheror(5, 1);
        });
        break;
      case '7':
        nextTick(() => {
          dynamicCmpRef.value.getProjectBOM(taskId.value);
          whetheror(6, 1);
        });
        break;
      default:
        break;
    }
  }
}
onMounted(() => {
  getTaskInfo();
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
    taskInfo.value = paramStr.taskInfo;
    if (paramStr.seeTask) {
      isShowBottomBtns.value = false;
    } else {
      isShowBottomBtns.value = true;
    }
    //调用结构树加载方法;
    if (paramStr.id) {
      getTreeData(paramStr.type);
      getDetailProject(paramStr.id);
      getDataDetail();
    } else {
      getTreeData(paramStr.type);
      getDataDetail();
      getDetailProject(paramStr.id);
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
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <keep-alive>
          <component
            ref="dynamicCmpRef"
            :is="currentComponent"
            :taskId="taskId"
            :seriesId="seriesId"
            :taskInfoData="taskInfoData"
            :dataUpload="dataUpload"
            :isEdit="isEdit"
            :code="code"
            :projectPlanUpload="projectPlanUpload"
            :editBtnStatus="editBtnStatus"
            :isShowBottomBtns="isShowBottomBtns"
            :commitBtnStatus="commitBtnStatus"
            :saveBtnStatus="saveBtnStatus"
            :selectedKeys="selectedKeys"
            :downloadStatus="downloadStatus"
            :projectParametersArr="projectParametersArr"
            :detailProject="detailProject"
            @toUpload="toUpload"
            @getDetailProject="getDetailProject"
            @ProjectMaterialssubmitOk="ProjectMaterialssubmitOk"
            @DesignPlansubmitOk="DesignPlansubmitOk"
            @TopleveLindicatorssubmitOk="TopleveLindicatorssubmitOk"
            @submitOkHorizontalEquipment="submitOkHorizontalEquipment"
            @submitStatus="submitStatus" />
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
    @onFileremove="removeParamFileList"
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
