<script lang="ts" setup>
import { defineEmits, getCurrentInstance, reactive, ref } from 'vue';
import { Button, Modal, Popconfirm, TableProps, message } from 'ant-design-vue';
import _ from 'lodash-es';
import { DownOutlined } from '@ant-design/icons-vue';
import * as echarts from 'echarts';
import modelvxeTable from '../../components/table/modelvxeTable.vue';
import addModule from '../../components/modal/addModule.vue';
import applicationModule from '../../components/modal/applicationModule.vue';
import parametricdesign from '../../components/modal/parametricdesign.vue';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { AdminApiwebSocketAuth } from '@/api/tags/管理webSocket';
import { useUserStore } from '@/store/modules/user';
import { characterToList } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon.js';

import ImportFile from '@/components/ImportFile/index.vue';
import {
  DownloadModuleFile,
  GetLocParametersInFirstCsys,
  apiRenameModel,
  assembleModule,
  openDrawing,
  openModule,
  openTopAsmTemplateInterfaceModel,
  parameterInFirstCsys,
} from '@/libs/webSocket';
import { AdminApiSystemAuth } from '@/api/tags/管理后台认证';

defineProps({
  /** 反馈详情 id */
  categoryid: {
    require: false,
    type: String,
    default: '',
  },
});
const emit = defineEmits(['nodeListInfo']);
const modelType = ref([
  {
    label: '通用',
    value: '通用',
  },
  {
    label: '专用',
    value: '专用',
  },
]);
const formInline = reactive<any>({
  mdName: '',
  mdDegree: undefined,
  mdNum: '',
});
const instance = getCurrentInstance();
const modelvxeTableref = ref<any>(null);
const userStore = useUserStore();
const categoryid = ref('');
const tabHeight = ref<any>(`${(window.innerHeight - 300) / 16}rem`);
const initSelect = ref(false);
const isArgs = ref<boolean>(false);
const pageFlagDrawer = ref<boolean>(false);
const AddVisible = ref<boolean>(false);
const addOrUpdate = ref<any>(null);
const modalInfo = ref<any>([]);
const btnType = ref(true);
const delBtnType = ref(true);
const compareBtnType = ref(true);
const checkList = ref<any>([]);
const nodeList = ref([]);
const page = reactive({
  pageSize: 10,
  pageCount: 0,
  currentPage: 1,
});

const compactData = ref<any>([]); // 数组用ref
const columns = ref<any>([]);
const dropdownList = ref<any>([
  // { id: 0, name: '另存' },
  { id: 1, name: '导入' },
  { id: 8, name: '导出' },
  // { id: 2, name: '列管理' },
  { id: 3, name: '列宽保存' },
  // {id:4,name:'图片上传'},
  // { id: 5, name: '上传模型' },
  // { id: 6, name: '提交审核' },
  // { id: 7, name: '参数化设计' },
]);

const parmDesignData = ref<any>([]);
const loading = ref(false);
const selectModelList = ref([]);

// 处理需要计算的属性，比如modelHeight
const modelHeight = ref(0);
onMounted(() => {
  modelHeight.value = document.body.clientHeight - 240;
});

const dataSource = ref<any>([]);
const dynamicParm = ref<any>([]);
const columnsData4 = ref<any>([]);
function handleAddOrUpdate() {
  AddVisible.value = true;
  nextTick(() => {
    addOrUpdate.value?.handleModalAdd(categoryid.value, pdmType.value);
  });
}

function updModule() {
  if (selectModelList.value.length == 0) {
    message.warning({
      content: '请选择一条数据进行修改!',
      duration: 3,
      closable: true,
    });
    return;
  }
  if (selectModelList.value.length >= 2) {
    message.warning({
      content: '只能选中一条数据进行修改!',
      duration: 3,
      closable: true,
    });
    return;
  }
  AddVisible.value = true;
  nextTick(() => {
    addOrUpdate.value?.handleModalUpdate(categoryid.value, selectModelList.value[0]);
  });
}
function selectModelListCheck2(selection: any) {
  selectModelList.value = selection;
  if (selection.length == 1) {
    btnType.value = false;
  } else {
    btnType.value = true;
  }

  if (selection.length == 0) {
    delBtnType.value = true;
  } else {
    delBtnType.value = false;
  }

  if (selection.length == 0 || selection.length == 1) {
    compareBtnType.value = true;
  }

  if (selection.length >= 2) {
    compareBtnType.value = false;
  }
}
const pdmType = ref<string>('');
async function getCategoryPdm(id: string) {
  const data: any = {};
  data.categoryId = id;
  const res = await AdminApiSystemModule.getCategoryPdmType(data);
  if (res.data.code == 0) {
    pdmType.value = res.data.pdmType;
  }
}
async function initData(categoryidStr: string) {
  categoryid.value = categoryidStr;
  getCategoryPdm(categoryidStr);
  columnsData4.value = [];
  compactData.value = [];
  checkList.value = [];
  selectModelList.value = [];
  const data: any = {};
  data.categoryId = categoryidStr;
  data.userName = userStore.getUser.userName;
  data.userId = userStore.getUser.id;
  modalInit();
  initData2(categoryid.value, 1);
  const res = await AdminApiSystemModule.findCurrentModuleInfoByCategoryId(data);
  columnsData4.value = res.data.data.moduleParaList;
  for (let i = 0; i < columnsData4.value.length; i++) {
    if (columnsData4.value[i].defaultQuery == 1) {
      if (compactData.value.length < 5) {
        compactData.value.push({
          id: columnsData4.value[i].id,
          name: 'rxLabel',
          labelName: `${columnsData4.value[i].propertyName}：`,
          type: columnsData4.value[i].ifSelectForm == undefined ? '0' : `${columnsData4.value[i].ifSelectForm}`,
          modeTypeList: characterToList(columnsData4.value[i].selectMultipleValues),
          typeKey: columnsData4.value[i].modelInfoProp,
        });
        checkList.value.push(columnsData4.value[i]);
      }
    }
  }
}
// 列表初始化
async function modalInit() {
  loading.value = true;
  delBtnType.value = true;
  btnType.value = true;
  compareBtnType.value = true;
  columns.value = [];
  dataSource.value = [];
  const data: any = {};
  data.userId = userStore.getUser.id;
  data.moduleParaList = [];
  data.categoryId = categoryid.value;
  data.currentPage = page.currentPage;
  data.numberPage = page.pageSize;
  for (const i in formInline) {
    if (formInline[i]) {
      data.moduleParaList.push({
        modelInfoProp: i == 'mdName' ? 'para3' : i == 'mdNum' ? 'para2' : 'para10',
        modelInfoPropValue: formInline[i],
      });
    }
  }
  const res = await AdminApiSystemModule.preciseQueryModuleLibrary(data);
  if (res.data.code == 0) {
    const resData: any = res.data.data;
    page.currentPage = resData.currentPage;
    page.pageCount = resData.pageCount;
    const parm: any = [];
    for (let i = 0; i < resData.moduleParaList.length; i++) {
      if (resData.moduleParaList[i].status == 0 || resData.moduleParaList[i].status == undefined) {
        parm.push({
          id: resData.moduleParaList[i].id,
          title: resData.moduleParaList[i].propertyName,
          key: resData.moduleParaList[i].modelInfoProp,
          align: 'center',
          resizable: true,
          filters: [],
          width: resData.moduleParaList[i].inputBoxLength == undefined ? 70 : resData.moduleParaList[i].inputBoxLength,
          sortable: true,
          render:
            resData.moduleParaList[i].modelInfoProp == 'para2' ? renderFunTiele(resData.moduleParaList[i].modelInfoProp) : renderFunTiele3(resData.moduleParaList[i].modelInfoProp),
        });
      }
    }

    const moduleListData = resData.moduleList || [];
    const requestPromises = parm.map(async (item: any) => {
      const data: any = {};
      data.categoryId = `${categoryid.value}`;
      data.userId = userStore.getUser.id;
      data.propName = item.key;
      const res = await AdminApiSystemModule.getModuleColumnData(data);
      if (res.data.code == 0) {
        const { valueList = [] } = res.data.data;
        const filters = valueList.map((fositem: any) => ({
          label: fositem[item.key],
          value: fositem[item.key],
        }));
        item.filters = _.uniqWith(filters, _.isEqual);
      } else {
        message.error(res.data.msg);
      }
    });
    // 使用 Promise.all 来等待所有接口请求完成
    Promise.all(requestPromises).then(() => {
      loading.value = false;
      parm.unshift({
        fixed: 'left',
        type: 'checkbox',
        align: 'left',
        width: '60',
      });
      columns.value = parm;
      dataSource.value = moduleListData;
    });

    dynamicParm.value = [];
    const moduleParaList = resData.moduleParaList;
    for (let i = 0; i < moduleParaList.length; i++) {
      if (moduleParaList[i].columnProperties == 0) {
        dynamicParm.value.push({
          id: moduleParaList[i].id,
          name: 'dynamicForm',
          labelName: `${moduleParaList[i].propertyName}：`,
          type: moduleParaList[i].ifSelectForm == undefined ? '0' : `${moduleParaList[i].ifSelectForm}`,
          modeTypeList: characterToList(moduleParaList[i].selectMultipleValues),
          typeKey: moduleParaList[i].modelInfoProp,
          modeTypeVal: '',
        });
      }
    }
  }
}
function onSeachSubmit() {
  searchmodalInit();
}
function onSeachReset() {
  formInline.mdName = '';
  formInline.mdDegree = undefined;
  formInline.mdNum = '';
  searchmodalInit();
}
async function searchmodalInit() {
  try {
    loading.value = true;
    delBtnType.value = true;
    btnType.value = true;
    compareBtnType.value = true;
    dataSource.value = [];
    const data: any = {};
    data.userId = userStore.getUser.id;
    data.moduleParaList = [];
    data.categoryId = categoryid.value;
    data.currentPage = page.currentPage;
    data.numberPage = page.pageSize;
    for (const i in formInline) {
      if (formInline[i]) {
        data.moduleParaList.push({
          modelInfoProp: i == 'mdName' ? 'para3' : i == 'mdNum' ? 'para2' : 'para10',
          modelInfoPropValue: formInline[i],
        });
      }
    }
    const res = await AdminApiSystemModule.preciseQueryModuleLibrary(data);
    if (res.data.code == 0) {
      loading.value = false;
      const resData: any = res.data.data;
      page.currentPage = resData.currentPage;
      page.pageCount = resData.pageCount;
      dataSource.value = resData.moduleList || [];
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}
// 删除列表数据
function delModule() {
  if (selectModelList.value.length == 0) {
    message.warning({
      content: '请选择数据进行删除!',
      duration: 3,
      closable: true,
    });
    return;
  }
  Modal.confirm({
    title: '确认删除此数据？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      const list: any = [];
      selectModelList.value.forEach(val => {
        list.push({ id: `${val.id}` });
      });
      const data: any = {};
      data.categoryId = categoryid.value;
      data.userId = userStore.getUser.id;
      data.moduleInfoList = list;
      const res = await AdminApiSystemModule.batchDeleteModuleInfo(data);
      if (res.data.data.result) {
        message.info('删除成功');
        modalInit();
        btnType.value = true;
        delBtnType.value = true;
      }
    },
  });
}

function renderFunTiele(key: any) {
  const render = (h: any, params: any) => {
    return h(
      'div',
      {
        props: {
          type: 'text', // 类型
        },
        style: {
          color: '#1979e0',
          'text-decoration': 'underline',
          cursor: 'pointer',
        },
        on: {
          click: () => {
            pdmModuleCode.value = params.row[key];
            PDMid.value = params.row.id;
            moduleDetails(params.row.id);
          },
        },
      },
      params.row[key],
    );
  };
  return render;
}
async function moduleDetails(id: string) {
  const data: any = {};
  modalInfo.value = [];
  data.userId = userStore.getUser.id;
  data.categoryId = categoryid.value;
  data.id = id;
  const res = await AdminApiSystemModule.findModuleInfoDetailedById(data);

  pageFlagDrawer.value = true;
  parmType.value == 0;
  const moduleParaList = res.data.data.moduleParaList;
  for (let i = 0; i < moduleParaList.length; i++) {
    if (moduleParaList[i].propertyName == '模型类型') {
      modalInfo.value.push({
        name: moduleParaList[i].propertyName,
        str: moduleParaList[i].modelInfoProp,
        val: moduleParaList[i].paraValue == '0' ? 'prt' : moduleParaList[i].paraValue == '1' ? 'asm' : '',
      });
    } else {
      modalInfo.value.push({
        name: moduleParaList[i].propertyName,
        str: moduleParaList[i].modelInfoProp,
        val: moduleParaList[i].paraValue,
      });
    }
  }
}

// 超出宽度隐藏字符串 。。。代替
function renderFunTiele3(key: any) {
  const render = (h: any, params: any) => {
    return h('div', [
      h(
        'span',
        {
          style: {
            display: 'inline-block',
            width: `${params.column._width * 0.8}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        params.row[key],
      ),
    ]);
  };
  return render;
}
async function initData2(id: string, type: number) {
  const data: any = {};
  data.userId = userStore.getUser.id;
  data.categoryid = id;
  data.categoryType = type;
  data.organizationID = '';
  data.rootType = 0;
  const res = await AdminApiSystemModule.queryClassificationNode(data);
  nodeList.value = res.data.list;
  emit('nodeListInfo', res.data.list);
}
function onShowSizeChange(current: number, pageSize: number) {
  page.currentPage = current;
  page.pageSize = pageSize;
  queryModuleLibrary();
}
// 模块库模糊查询
async function queryModuleLibrary(filterArr?: any) {
  try {
    const data: any = {};
    data.userId = userStore.getUser.id;
    data.categoryId = categoryid.value;
    data.userName = userStore.getUser.userName;
    data.currentPage = page.currentPage;
    data.numberPage = page.pageSize;
    data.moduleParaList = filterArr || [];
    const res = await AdminApiSystemModule.moduleDataScreening(data);
    if (res.data.code == 0) {
      const resData: any = res.data.data;
      if (resData.moduleList) {
        dataSource.value = resData.moduleList;
        page.pageCount = resData.pageCount;
        page.currentPage = resData.currentPage;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
function filterChange() {}
// 打开模型
function openMx(data: any) {
  if (data.length == 1) {
    openModule(instance, data[0].para1, data[0].para4, '', '', '');
    addModelLog(data[0], 8);
  } else {
    message.warning({
      content: '只能选择一条数据进行操作！',
      duration: 3,
      closable: true,
    });
  }
}
// 添加日志
async function addModelLog(moduleInfo: any, logUpdateType: any) {
  const data: any = {};
  data.categoryId = categoryid.value;
  data.userId = userStore.getUser.id;
  data.userName = userStore.getUser.userName;
  data.moduleId = moduleInfo.id;
  data.moduleNum = moduleInfo.para1 == undefined ? '' : moduleInfo.para1;
  data.logUpdateType = logUpdateType;
  const res = await AdminApiwebSocketAuth.setOperationalModel(data);
}
// 装配模型
function fitoutMx(data: any) {
  if (data.length == 1) {
    assembleModule(instance, data[0].para1, data[0].para4, '', '', '', '');
    addModelLog(data[0], 9);
  } else {
    message.warning({
      content: '只能选择一条数据进行操作！',
      duration: 3,
      closable: true,
    });
  }
}
const bomInfoData = ref<any>([]);
const applicationEditFlag = ref<boolean>(false);
// 编辑应用
function editMx(data: any) {
  applicationEdit(data);
}
/**
 * 应用编辑
 * @param list
 */
async function applicationEdit(list: any) {
  const arr = list || selectModelList.value;
  if (arr.length === 1) {
    const fos = arr[0];
    if (fos.para4 === 'prt') {
      const data: any = {};
      data.number = fos.para1;
      const res = await AdminApiwebSocketAuth.getBomNewNumberApi(data);
      if (res.data.code == 0) {
        const { moduleNewNum } = res.data.data;
        openModule(instance, fos.para1, fos.para4, moduleNewNum, '', '');
      } else {
        message.error(res.data.msg);
      }
    } else {
      const data: any = {};
      data.number = fos.para1;
      data.commonName = fos.para3;
      data.userId = userStore.getUser.id;
      const res = await AdminApiwebSocketAuth.getBomInfoTestApi(data);
      if (res.data.code == 0) {
        const newTree = await recursiveMapWithAction(res.data);
        bomInfoData.value = [];
        bomInfoData.value.push(newTree.data);
        applicationEditFlag.value = true;
      } else {
        message.error(res.data.msg);
      }
    }
  }
}
/**
 * 递归初始化树形结构
 * @param tree
 */
function recursiveMapWithAction(tree: any) {
  if (Array.isArray(tree)) {
    return Promise.all(tree.map((subtree: any) => recursiveMapWithAction(subtree)));
  } else if (typeof tree === 'object' && tree !== null) {
    const mapped: any = {};
    const promises = [];
    for (const key in tree) {
      if (tree.hasOwnProperty(key)) {
        const promise = new Promise(resolve => {
          recursiveMapWithAction(tree[key]).then(result => {
            mapped[key] = result;
            resolve();
          });
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises).then(() => {
      return new Promise(resolve => {
        if (mapped.supeq === 0) {
          mapped.action = '自动命名';
          resolve(
            AdminApiwebSocketAuth.getBomNewNumberApi({
              number: mapped.equnr,
            }).then(res => {
              if (res.data.code === 0) {
                const { moduleNewNum } = res.data;
                mapped.moduleNewNum = moduleNewNum;
                return mapped;
              } else {
                message.error(res.data.msg);
                return mapped;
              }
            }),
          );
        } else {
          mapped.action = '重新使用';
          resolve(mapped);
        }
      });
    });
  } else {
    return Promise.resolve(tree);
  }
}
function openEwt(data: any) {
  if (data.length == 1) {
    openDrawing(instance, data[0].para1);
  } else {
    message.warning({
      content: '只能选择一条数据进行操作！',
      duration: 3,
      closable: true,
    });
  }
}

const parmDesign = ref<any>(false);
const moduleId = ref<string>('');
const paramsObject = ref<any>({
  templateModuleNum: '',
  templateModuleType: '',
  inputVal: '',
});
async function argsMx(row: any) {
  const params: any = {};
  params.categoryId = categoryid.value;
  params.userId = userStore.getUser.id;
  const parmDesignData1: any = [];
  paramsObject.value.templateModuleNum = '';
  paramsObject.value.templateModuleType = '';
  paramsObject.value.inputVal = '';
  if (row.length > 0) {
    params.id = row[0].id;
    const res = await AdminApiwebSocketAuth.modelDesignParametric(params);
    const data: any = res.data.data;
    if (data.moduleNum != null && data.moduleNum != '') {
      paramsObject.value.templateModuleNum = data.moduleNum;
    }
    if (data.moduleType != null && data.moduleType != '') {
      paramsObject.value.templateModuleType = data.moduleType;
    }

    moduleId.value = data.moduleId;
    for (let i = 0; i < data.moduleParaList.length; i++) {
      let modelInfoProp = data.moduleParaList[i].modelInfoProp;
      if (modelInfoProp.length > 4) {
        modelInfoProp = modelInfoProp.substring(4);
        if (modelInfoProp > 9) {
          parmDesignData1.push(data.moduleParaList[i]);
        }
      }
    }
    parmDesignData.value = parmDesignData1;
    parmDesign.value = true;
    addModelLog(row[0], 10);
  } else {
    message.warning({
      content: '请选择数据，进行设计',
      duration: 3,
      closable: true,
    });
  }
}
function changeData(moduleNewNum: string) {
  paramsObject.value.inputVal = moduleNewNum;
}
function handleSave() {
  AddVisible.value = false;
}
// 更多
function dropdownAction(type: number) {
  if (type == 1) {
    batchExport();
  } else if (type == 3) {
    cWidth();
  } else if (type == 8) {
    upDerive();
  }
}

/** 文件列表 */
const fileList = ref<any>([]);
const batchflag = ref<boolean>(false);
// 导入
function batchExport() {
  fileList.value = [];
  batchflag.value = true;
}
function filechange(file: any) {
  fileList.value[0] = file;
}
async function customRequest(options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFileTransfer({
      file: options.file as File,
      userId: userStore.getUser.id,
    });
    if (res.data.code === 0) {
      const file: any = { ...res.data, name: res.data?.oldFileName };
      fileList.value[0] = file;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}
// 下载附件
async function templateDownload() {
  debugger;
  const data: any = {};
  data.categoryId = categoryid.value;
  data.userid = userStore.getUser.id;
  const res = await AdminApiSystemModule.createModuleLibraryTemplateApi(data);
  if (res.data.code == 0) {
    downloadFile(res.data.data.fileUrl);
    message.success(res.data.msg == '' || res.data.msg == null ? '导出模版成功' : res.data.msg);
  } else {
    message.error(res.data.msg);
  }
}
// 导入附件
async function importSuccessfulFun() {
  const exceldata: any = {};
  exceldata.categoryId = categoryid.value;
  exceldata.userid = userStore.getUser.id;
  exceldata.userName = userStore.getUser.userName;
  exceldata.moduleName = fileList.value[0].newFileName;
  const res = await AdminApiSystemModule.importingModelInformationNew(exceldata);
  if (res.data.code == 0) {
    const data: any = res.data.data;
    message.info({
      top: 80,
      duration: 10,
      content: data.importMsg,
      closable: true,
    });
    modalInit();
  } else {
    message.error({
      top: 80,
      duration: 10,
      content: res.data.msg,
      closable: true,
    });
  }
}
// 列宽保存
function cWidth() {
  const columnList = [];
  const list = modelvxeTableref.value.vxeTable1.getTableColumn().tableColumn;
  for (let i = 0; i < list.length; i++) {
    if (list[i].params) {
      columnList.push({
        propertyId: list[i].params,
        width: list[i].renderWidth,
      });
    }
  }
  const data: any = {};
  data.categoryId = categoryid.value;
  data.userId = userStore.getUser.id;
  data.scene = 0;
  data.columnList = columnList;
  AdminApiSystemModule.columnWidthSave(data);
  message.success('列宽保存成功');
}
// 导出
async function upDerive() {
  const data: any = {};
  data.categoryId = categoryid.value;
  data.userName = userStore.getUser.userName;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemModule.exportModuleLibraryApi(data);
  if (res.data.code == 0) {
    downloadFile(res.data.data.fileUrl);
    message.success(res.data.msg == '' || res.data.msg == null ? '导出成功' : res.data.msg);
  } else {
    message.error(res.data.msg);
  }
}
// 下载
function downloadFile(url: any) {
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getDynamicComponentVal(comp: any) {
  // 获取动态组件内的查询条件
  const prmList = comp.value;
  const moduleParaList: any = [];
  if (prmList != undefined) {
    prmList.forEach((item: any) => {
      let val = '';
      const newModeTypeVal = item.newModeTypeVal;
      if (newModeTypeVal != undefined && newModeTypeVal != '' && item.typeKey == 'para4') {
        val = newModeTypeVal.toLowerCase() == 'prt' ? 'prt' : newModeTypeVal.toLowerCase() == 'asm' ? 'asm' : newModeTypeVal.toLowerCase() == 'gph' ? 'gph' : '';
      } else {
        val = item.newModeTypeVal;
      }
      moduleParaList.push({
        modelInfoProp: item.typeKey,
        modelInfoPropValue: val,
      });
    });
  }
  return moduleParaList;
}
const radioModal = ref<any>({});
const radioList = ref<any>([]);
const radarflag = ref(false);
const myRadar = ref<any>(null);
const option = ref({
  isArgs: false,
  width: '100%',
  height: '100%',
  title: {
    text: '',
  },
  legend: {
    data: ['MKWLM110137'],
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: '经济性', max: 5 },
      { name: '模块成熟度', max: 5 },
      { name: '轻量化', max: 5 },
      { name: '安全性', max: 5 },
      { name: '可靠性', max: 5 },
      { name: '可维护性', max: 5 },
    ],
  },
  series: [
    {
      name: '',
      type: 'radar',
      data: [{ name: 'MKWLM110137', value: '1级,2级,2级,2级,,4级' }],
    },
  ],
});
/**
 * 雷达图展示
 */
async function openRadarInfo() {
  radioModal.value = {};
  radarflag.value = true;
  let myChart: any;
  if (selectModelList.value.length) {
    radioList.value = selectModelList.value;
    nextTick(() => {
      myChart = echarts.init(myRadar.value);
    });
    const list = selectModelList.value.map(item => ({ id: item.id }));
    const data: any = {};
    data.moduleIdList = list;
    const res = await AdminApiSystemModule.moduleRadarDataMapApi(data);
    if (res.data.code == 0) {
      const { dataList = [] } = res.data.data;
      option.value.legend.data = dataList.map((item: any) => item.name);
      option.value.series[0].data = dataList;
      nextTick(() => {
        myChart.setOption(option.value);
      });
    } else {
      message.error(res.data.msg);
    }
  }
}
const fileData1 = ref<any>([]);
const fileData2 = ref<any>([]);
const parmType = ref<number>(0);
const pdmModuleCode = ref<any>();
const PDMid = ref<any>();
const pdmModelType = ref<any>();
// 详情
function clickEvent(row: any, key: any) {
  fileData1.value = [];
  fileData2.value = [];
  parmType.value = 0;
  pdmModuleCode.value = row[key];
  PDMid.value = row.id;
  pdmModelType.value = row.para4;
  moduleDetails(row.id);
  queryPdmModuleNumDetailed(row.para2);
}
function queryPdmModuleNumDetailed(id: string) {
  const data: any = {};
  data.pdmModuleNum = id;
  // data.pdmModuleNum =  'mxbmtest001'
  AdminApiSystemModule.getPdmModuleNumDetailed(data).then(res => {
    // $emit('treeType', 1, res.data.data.pdmResult, id);
  });
}

const compareParm = ref<number>(0);
const tabularflag = ref(false);
const tabularColumn = ref();
const tabularData = ref<any>([]);
const checkParmList = ref<any>([]);
function tabularCheckList() {
  let parm1 = 0;
  let parm2 = 0;
  let str = 0;
  if (checkParmList.value.length > 0) {
    checkParmList.value.forEach((item: any) => {
      if (item == '隐藏相同项') {
        parm1 = 1;
      }
      if (item == '只看关键项') {
        parm2 = 1;
      }
    });
    if (parm1 === 1 && parm2 === 1) {
      str = 3;
    } else if (parm1 === 1 && parm2 === 0) {
      str = 1;
    } else if (parm1 === 0 && parm2 === 1) {
      str = 2;
    }
  }
  compareParm.value = str;
  compareData();
}
async function compareData() {
  const data: any = {};
  data.categoryId = categoryid.value;
  data.userId = userStore.getUser.id;
  data.moduleInfoList = selectModelList.value;
  data.compareType = compareParm.value;
  const res = await AdminApiSystemModule.moduleDataComparison(data);
  let parmList = [];
  const parm = [];
  const list = [];
  parmList = res.data.data.listPropertyName;
  const strlist = res.data.data.listModule;
  let str: any = { A: '选择' };
  parm.push({
    id: '数据',
    title: '列名',
    key: '数据',
    dataIndex: '数据',
    align: 'center',
    minWidth: 100,
  });
  for (let j = 0; j < strlist.length; j++) {
    if (list.length == 0) {
      // str['A' + j] = false;
      parm.push({
        id: strlist[j].id, // 缺少id
        title: '数据',
        key: `数据${j}`,
        dataIndex: `数据${j}`,
        align: 'center',
        minWidth: 100,
      });
    }
  }
  // list.push(str);

  for (let i = 0; i < parmList.length; i++) {
    // 循环左侧标题key
    const parmKey = Object.keys(parmList[i])[0];
    // 循环左侧标题Val
    const parmVal = parmList[i][parmKey];
    str = {};
    str['数据'] = parmVal;
    for (let k = 0; k < strlist.length; k++) {
      const id = parmKey;
      const val = strlist[k][id];
      str[`数据${k}`] = val;
    }
    list.push(str);
  }
  tabularColumn.value = parm;
  tabularData.value = list;

  const arr: any = [];
  for (let i = 0; i < tabularColumn.value.length; i++) {
    arr.push(i);
  }
  tabularData.value.forEach((item: any) => {
    const brr: any = [];
    arr.map(i => {
      if (item[`数据${i}`]) {
        brr.push(item[`数据${i}`]);
      }
    });
    if (brr.length === arr.length - 1 && brr.every(item => item === brr[0])) {
      arr.map(i => {
        item[`数据${i}`] = item[`数据${i}`] ? `${item[`数据${i}`]} ✅` : '';
      });
    }
  });
  if (!tabularflag.value) {
    tabularflag.value = true;
  }
}

function handlefileSave() {
  tabularflag.value = false;
}
// 使用ref创建响应式变量
const pdmDataFlag = ref(false);
const attributeParmList = ref<any>([]);
const doudata = ref<any>([]);
const pdmData = ref<any>([]);
function toParm(type: any) {
  pdmDataFlag.value = false;
  parmType.value = type;
  attributeParmList.value = [];
  doudata.value = [];
  const params = {
    id: PDMid.value,
    pdmModuleNum: pdmModuleCode.value,
    userName: userStore.getUser.userName,
    userId: userStore.getUser.id,
    pdmModelType: pdmModelType.value,
    moduleNum: pdmModuleCode.value,
    moduleType: pdmModelType.value,
  };
  if (type == 3) {
    AdminApiSystemModule.getModuleUserUploadDocument(params).then(res => {
      if (res.data.code == 0) {
        const data: any = res.data.data;
        if (data.attachmentList.length > 0) {
          fileData1.value = data.attachmentList;
        }
      }
    });

    AdminApiSystemModule.getPdmDocument(params).then(res => {
      if (res.data.code == 0) {
        const data: any = res.data.data;
        if (data.pdmResult && data.pdmResult.length > 0) {
          fileData2.value = data.pdmResult;
        }
      }
    });
  } else if (type == 1) {
    AdminApiSystemModule.krAttribute(params).then(res => {
      if (res.data.code == 0) {
        const data: any = res.data.data;
        if (data.pdmResult) {
          pdmData.value = data.pdmResult;
          pdmDataFlag.value = true;
          const str = Object.keys(pdmData.value.parameter);
          str.forEach(item => {
            const parm: any = {};
            parm.name = item;
            parm.val = pdmData.value.parameter[item] == null ? '' : pdmData.value.parameter[item];
            attributeParmList.value.push(parm);
          });
        }
      }
    });
  } else if (type == 5) {
    AdminApiSystemModule.syncBOMApi({ number: pdmModuleCode.value }).then(res => {
      if (res.data.code == 0) {
        const data = res.data.data || [];
        doudata.value = data;
      } else {
        message.error(res.data.msg);
      }
    });
  }
}
const udfBoxRef = ref<any>();
function udfBoxStyle() {
  let lastPixelRatio: any = window.devicePixelRatio;
  window.addEventListener('resize', () => {
    const currentPixelRatio: any = window.devicePixelRatio;
    if (currentPixelRatio !== lastPixelRatio) {
      const screenheight = window.innerHeight;
      let pageHeight = 0;
      if (lastPixelRatio < 1 && currentPixelRatio != 1) {
        pageHeight = screenheight - 220;
      } else if (currentPixelRatio == 1 && Number.parseFloat(currentPixelRatio) > Number.parseFloat(lastPixelRatio)) {
        pageHeight = screenheight - 241;
      } else if (lastPixelRatio == 1 && Number.parseFloat(currentPixelRatio) > Number.parseFloat(lastPixelRatio)) {
        pageHeight = screenheight;
      } else {
        pageHeight = screenheight;
      }
      udfBoxRef.value.style.minHeight = `${pageHeight}px`;
    }
    lastPixelRatio = currentPixelRatio;
  });
}
const supGbomcolumns = ref<any>([
  {
    title: WeiI18n.t('GBOM名称').value,
    dataIndex: 'descript',
    key: 'descript',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('物料编码').value,
    dataIndex: 'equnr',
    key: 'equnr',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('版本').value,
    dataIndex: 'version',
    key: 'version',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
const fileColumns1 = ref<any>([
  {
    title: '文件名称',
    key: 'documentName',
    dataIndex: 'documentName',
    align: 'left',
    resizable: true,
    minWidth: 100,
  },
  {
    title: '文件类型',
    key: 'fileType',
    dataIndex: 'fileType',
    align: 'left',
    resizable: true,
    minWidth: 100,
  },
  {
    title: '操作',
    key: 'oldFileName',
    dataIndex: 'oldFileName',
    slot: 'action',
    align: 'left',
    resizable: true,
    minWidth: 100,
  },
]);
const fileColumns2 = ref<any>([
  {
    title: '文件编号',
    key: 'docnumber',
    dataIndex: 'docnumber',
    align: 'center',
    resizable: true,
    minWidth: 150,
  },
  {
    title: '文件名称',
    key: 'docname',
    dataIndex: 'docname',
    align: 'center',
    minWidth: 150,
    resizable: true,
  },
]);
function downloadPDF(id: number) {
  const baseUrl = import.meta.env.VITE_BASE_HTMLPREVIEW_URL;
  if (id) {
    window.location.href = `${baseUrl}/cirpoint-base-api/fileManagerController/download?fileId=${id}`;
  } else {
    window.location.href = `${baseUrl}/fileManagerController/download?fileId=${id}`;
  }
}
function handleNameClick(row: any) {
  const data: any = {};
  data.docnumber = row.docnumber;
  AdminApiSystemModule.getURLApi(data).then(res => {
    if (res.data.code == 0) {
      window.open(res.data.data);
    } else {
      message.error(res.data.msg);
    }
  });
}
function setFixedRowClass(record, index) {
  // 为前三行分别添加类名：fixed-row-0、fixed-row-1、fixed-row-2
  return index < 3 ? `fixed-row-${index}` : '';
}
defineExpose({ initData });
</script>

<template>
  <div>
    <div class="seach-wrap">
      <a-form layout="inline" :model="formInline" class="form-inline">
        <a-form-item class="mgrt10">
          <a-input v-model:value="formInline.mdName" style="width: 220px" placeholder="请输入模块名称" />
        </a-form-item>
        <a-form-item class="mgrt10">
          <a-select v-model:value="formInline.mdDegree" placeholder="请选择模型类型" style="width: 220px">
            <a-select-option v-for="item in modelType" :key="item.value" :value="item.value" placeholder="请选择模型类型">
              {{ $t(item.label) }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="mgrt10">
          <a-input v-model:value="formInline.mdNum" style="width: 220px" placeholder="请输入模块编码" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSeachSubmit">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            查询
          </a-button>
          <a-button style="margin-left: 10px" @click="onSeachReset">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
  <div class="module-body">
    <div class="selectLeft">
      <div class="btn-box">
        <div style="background-color: #e5efff; width: 100%; height: 100%">
          <div class="btn-box-left">
            <div
              :class="{
                'btn-item-select': compareBtnType,
                'btn-item': !compareBtnType,
              }"
              @click="compareData">
              <EpcIcon class="act-btns" style="margin-right: 5px" type="icon-tandem" />
              比较数据
            </div>
            <div
              :class="{
                'btn-item-select': delBtnType,
                'btn-item': !delBtnType,
              }"
              @click="openRadarInfo">
              <EpcIcon class="act-btns" style="margin-right: 5px" type="icon-leidatu1" />
              雷达图
            </div>
            <!-- <div class="btn-item">
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  更多
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <div v-for="(item, index) in dropdownList" :key="index" style="text-align: left">
                      <a-menu-item @click.native="dropdownAction(item.id)">{{ item.name }}</a-menu-item>
                    </div>
                  </a-menu>
                </template>
              </a-dropdown>
            </div> -->
          </div>
          <!-- <div class="btn-box-right">
            <div class="btn-item" @click="handleAddOrUpdate">
              <EpcIcon type="icon-md-add" style="color: #1a71ff; font-size: 17px" />
              添加数据
            </div>
            <div :class="{ 'btn-item-select': btnType, 'btn-item': !btnType }" @click="updModule">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑
            </div>
            <div :class="{ 'btn-item-select': delBtnType, 'btn-item': !delBtnType }" @click="delModule">
              <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
              删除
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div v-if="!loading" style="width: 100%">
      <modelvxeTable
        ref="modelvxeTableref"
        :loading="loading"
        :init-select="initSelect"
        :is-args="isArgs"
        :columns="columns"
        :data="dataSource"
        :height="tabHeight"
        :page="page"
        :model-type="0"
        :categoryid="categoryid"
        @select-model-list-check="selectModelListCheck2"
        @click-event="clickEvent"
        @on-show-size-change="onShowSizeChange"
        @filter-change="filterChange"
        @open-mx="openMx"
        @fitout-mx="fitoutMx"
        @edit-mx="editMx"
        @open-ewt="openEwt"
        @args-mx="argsMx" />
    </div>
    <div v-else class="example">
      <a-spin tip="加载中..." />
    </div>
  </div>
  <addModule ref="addOrUpdate" :modal-visible="AddVisible" @handle-save="handleSave" @modal-init="modalInit" @on-close="AddVisible = false" />
  <applicationModule :bom-info-data="bomInfoData" :modal-visible="applicationEditFlag" @on-close="applicationEditFlag = false" />
  <parametricdesign
    :module-id="moduleId"
    :categoryid="categoryid"
    :select-model-list="selectModelList"
    :parm-design-data="parmDesignData"
    :modal-visible="parmDesign"
    :params-object="paramsObject"
    @change-data="changeData"
    @on-close="parmDesign = false" />
  <a-modal v-model:visible="radarflag" style="width: 50%" title="雷达图" @on-cancel="radarflag = false">
    <div class="text-Box">
      <div class="text-sm">
        <a-radio-group v-model:value="radioModal" name="radioGroup">
          <a-radio v-for="item in radioList" :key="item.id" :value="item.id">
            {{ item.para1 }}
          </a-radio>
        </a-radio-group>
      </div>
      <div ref="myRadar" style="width: 900px; height: 550px; margin-left: 50%; transform: translateX(-50%)" />
    </div>
    <template #footer>
      <a-button type="primary" @click="radarflag = false"> 取消 </a-button>
    </template>
  </a-modal>
  <a-modal
    v-model:visible="tabularflag"
    style="width: 60%"
    :title="$t('模块数据比较')"
    :confirm-loading="$isPending()"
    :ok-text="$t('确定')"
    :cancel-text="$t('取消')"
    :mask-closable="false">
    <div style="margin-bottom: 10px">
      <a-checkbox-group v-model:value="checkParmList" style="width: 100%" @change="tabularCheckList">
        <a-checkbox value="隐藏相同项">
          {{ '隐藏相同项' }}
        </a-checkbox>
        <a-checkbox value="只看关键项">
          {{ '只看关键项' }}
        </a-checkbox>
      </a-checkbox-group>
    </div>

    <a-table
      ref="elementTable"
      :scroll="{ x: 'max-content', y: 500 }"
      :pagination="false"
      :columns="tabularColumn"
      :data-source="tabularData"
      style="overflow-y: hidden"
      :row-class-name="setFixedRowClass" />
    <template #footer>
      <a-button type="primary" @click="handlefileSave"> 确定 </a-button>
      <a-button type="text" @click="tabularflag = false"> 取消 </a-button>
    </template>
  </a-modal>
  <ImportFile
    :modal-visible="batchflag"
    :file-list="fileList"
    @change="filechange"
    @custom-request="customRequest"
    @template-download="templateDownload"
    @import-successful-fun="importSuccessfulFun"
    @close="batchflag = false" />
  <a-drawer v-model:visible="pageFlagDrawer" title="模块详情" placement="right" :closable="false" width="500">
    <!--    详情页面 -->
    <div class="dalIconList2" style="margin-top: 0">
      <div :class="{ seDalIcon: parmType == 0, dalIcon: parmType != 0 }" @click="toParm(0)">
        <EpcIcon type="icon-a-xiangmu1" />
        <span>分类参数</span>
      </div>
      <div :class="{ seDalIcon: parmType == 1, dalIcon: parmType != 1 }" @click="toParm(1)">
        <EpcIcon type="icon-a-xiangmu1" />
        <span>常规属性</span>
      </div>
      <div :class="{ seDalIcon: parmType == 3, dalIcon: parmType != 3 }" @click="toParm(3)">
        <EpcIcon type="icon-a-xiangmu1" />
        <span>知识文档</span>
      </div>
      <div :class="{ seDalIcon: parmType == 5, dalIcon: parmType != 5 }" @click="toParm(5)">
        <EpcIcon type="icon-a-xiangmu1" />
        <span>GBOM</span>
      </div>
    </div>
    <!--  -->
    <div ref="udfBoxRef" :style="udfBoxStyle()" class="udfPage_style">
      <div v-show="parmType == 0">
        <a-descriptions v-for="item in modalInfo" :key="item.id" style="margin-top: 20px" size="small" bordered>
          <a-descriptions-item :label="item.name">
            {{ item.val }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div v-show="parmType == 1">
        <div v-if="pdmDataFlag">
          <a-descriptions style="margin-top: 20px" size="small" bordered>
            <a-descriptions-item label="名称：">
              {{ pdmData.name }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div v-if="pdmDataFlag">
          <a-descriptions style="margin-top: 20px" size="small" bordered>
            <a-descriptions-item label="编码：">
              {{ pdmData.number }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div v-if="pdmDataFlag">
          <a-descriptions style="margin-top: 20px" size="small" bordered>
            <a-descriptions-item label="版本：">
              {{ pdmData.version }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-descriptions v-for="item in attributeParmList" :key="item.id" style="margin-top: 20px" size="small" bordered>
            <a-descriptions-item :label="item.name">
              {{ item.val }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>

      <div v-if="parmType == 3">
        <div style="width: 100%; height: 30px; text-align: left; margin-top: 10px">模块库知识:</div>
        <div style="width: 100%">
          <a-table
            :scroll="{ x: 400, y: 400 }"
            row-key="id"
            :loading="loading"
            :pagination="false"
            default-expand-all
            :data-source="fileData1"
            :columns="fileColumns1"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'oldFileName'">
                <a class="action-btn" @click.stop="downloadPDF(record.id)">下载</a>
              </template>
            </template>
          </a-table>
        </div>

        <div style="width: 100%; height: 30px; text-align: left; margin-top: 20px">PDM知识:</div>
        <div style="width: 100%">
          <a-table
            :scroll="{ x: 400, y: 400 }"
            row-key="id"
            :loading="loading"
            :pagination="false"
            default-expand-all
            :data-source="fileData2"
            :columns="fileColumns2"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'docnumber'">
                <a @click.stop="handleNameClick(record)">{{ record.docnumber }}</a>
              </template>
            </template>
          </a-table>
        </div>
      </div>
      <div v-show="parmType == 5" style="width: 100%; margin-top: 20px">
        <a-table
          :scroll="{ x: 400, y: 400 }"
          row-key="id"
          :loading="loading"
          :pagination="false"
          default-expand-all
          :data-source="doudata"
          :columns="supGbomcolumns"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')" />
      </div>
    </div>
  </a-drawer>
</template>

<style lang="less" scoped>
.module-body {
  margin-top: 10px;
  padding-right: 20px;
}
.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
.selectLeft {
  width: 100%;
  height: 100%;
  padding-top: 5px;
  background-color: #ffffff;
  overflow: auto;
  overflow-y: hidden;
}
.btn-box {
  width: 100%;
  height: 35px;
  background-color: #ffffff;
  text-align: left;
  font-size: 14px;
}
.btn-box-left {
  float: left;
  display: flex;
}

.btn-box-right {
  float: right;
  display: flex;
}
.btn-item-select {
  min-width: 28px;
  height: 35px;
  margin: 0 10px;
  text-align: center;
  line-height: 35px;
  color: #9a9fa7;
  cursor: pointer;
}

.btn-item {
  min-width: 28px;
  height: 35px;
  margin: 0 10px;
  text-align: center;
  line-height: 35px;
  color: #1a71ff;
  cursor: pointer;
}

.dalIconList2 {
  width: 98%;
  height: 40px;
  background-color: #e5efff;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  padding-left: 20px;
  color: #a2b7bf;
}
.udfPage_style {
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;
  height: calc(100vh - 190px);
}

.seDalIcon {
  width: 80px;
  font-size: 15px;
  cursor: pointer;
  color: #2d8cf0;
}
.dalIcon {
  width: 80px;
  font-size: 15px;
  cursor: pointer;
}

:deep(.ant-descriptions-item-label) {
  width: 105px;
}
.form-inline {
  margin-top: 10px;
}

/* 固定行样式：脱离文档流，固定在表格顶部 */
:deep(.ant-table-body .fixed-row-0) {
  position: sticky !important;
  top: 0;
  background: #fff !important;
  z-index: 3; /* 最高层级 */
  border-bottom: 1px solid #f0f0f0;
}
:deep(.ant-table-body .fixed-row-1) {
  position: sticky !important;
  top: 40px; /* 需根据第一行高度调整（假设行高40px） */
  background: #fff !important;
  z-index: 2;
  border-bottom: 1px solid #f0f0f0;
}
:deep(.ant-table-body .fixed-row-2) {
  position: sticky !important;
  top: 80px; /* 第一行高度×2 */
  background: #fff !important;
  z-index: 1;
  border-bottom: 1px solid #f0f0f0;
}
/* 解决表头与固定行的重叠问题 */
:deep(.ant-table-header) {
  position: sticky !important;
  top: 0;
  z-index: 4 !important;
}
</style>
