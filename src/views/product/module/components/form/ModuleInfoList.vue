<script lang="ts" setup>
import { defineEmits, getCurrentInstance, reactive, ref } from 'vue';
import { Button, Modal, Popconfirm, TableProps, message } from 'ant-design-vue';
import _ from 'lodash-es';
import { DownOutlined } from '@ant-design/icons-vue';
import * as echarts from 'echarts';
import modelvxeTable from '../table/modelvxeTable.vue';
import addModule from '../modal/addModule.vue';
import applicationModule from '../modal/applicationModule.vue';
import parametricdesign from '../modal/parametricdesign.vue';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { AdminApiwebSocketAuth } from '@/api/tags/管理webSocket';
import { useUserStore } from '@/store/modules/user';
import { characterToList } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import Empty from '@/components/Empty/index.vue';
import ImportFile from '@/components/ImportFile/index.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { handleEpcDownload } from '@/utils/file';
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
import { GlobalQueryPara10Cell, useGlobalQuery } from '../../composables/useGlobalQuery';

defineProps({
  /** 反馈详情 id */
  categoryid: {
    require: false,
    type: String,
    default: '',
  },
});
const emit = defineEmits(['nodeListInfo', 'getCategory']);
const instance = getCurrentInstance();
const modelvxeTableref = ref<any>(null);
const userStore = useUserStore();
const categoryid = ref('');
const menuId = ref<any>(null);
const tabHeight = ref<any>(`${(window.innerHeight - 380) / 16}rem`);
const initSelect = ref(false);
const isArgs = ref<boolean>(false);
const pageFlagDrawer = ref<boolean>(false);
const modulePropertyInfo = ref<any>([]);
const AddVisible = ref<boolean>(false);
const addOrUpdate = ref<any>(null);
const modalInfo = ref<any>([]);
const btnType = ref(true);
const delBtnType = ref(true);
const compareBtnType = ref(true);
const page = reactive({
  pageSize: 10,
  pageCount: 0,
  currentPage: 1,
});
const columns = ref<any>([]);
const queryColumns = ref<any>([]);
const dropdownList = ref<any>([
  { id: 1, name: '导入' },
  { id: 8, name: '导出' },
  { id: 3, name: '列宽保存' },
]);
const parmDesignData = ref<any>([]);
const loading = ref(false);
const selectModelList = ref([]);
const queryForm = reactive<Record<string, any>>({});

const {
  globalQueryModalVisible,
  globalQueryLoading,
  globalQueryList,
  globalQueryTableScrollY,
  globalQueryTablePagination,
  globalQueryColumns,
  globalQueryTypeOptions,
  globalQueryFieldOptions,
  globalQueryGroups,
  selectAllModuleInfo,
  fetchGlobalQueryData,
  handleGlobalTableChange,
  addGlobalQueryGroup,
  removeGlobalQueryGroup,
  resetGlobalQueryGroups,
} = useGlobalQuery(menuId);

// 处理需要计算的属性，比如modelHeight
const modelHeight = ref(0);
onMounted(() => {
  modelHeight.value = document.body.clientHeight - 240;
});

const dataSource = ref<any>([]);
function handleAddOrUpdate() {
  AddVisible.value = true;
  nextTick(() => {
    addOrUpdate.value?.handleModalAdd(categoryid.value, pdmType.value, menuId.value);
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
    addOrUpdate.value?.handleModalUpdate(categoryid.value, selectModelList.value[0], menuId.value);
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
async function initData(categoryidStr: string, menuid: any) {
  categoryid.value = categoryidStr;
  menuId.value = menuid;
  selectModelList.value = [];
  modalInit();
}
// 列表初始化
async function modalInit() {
  loading.value = true;
  delBtnType.value = true;
  btnType.value = true;
  compareBtnType.value = true;
  columns.value = [];
  queryColumns.value = [];
  dataSource.value = [];
  const data: any = {};
  data.userId = userStore.getUser.id;
  data.moduleParaList = [];
  data.categoryId = categoryid.value;
  data.currentPage = page.currentPage;
  data.numberPage = page.pageSize;
  data.menuId = menuId.value;
  const res = await AdminApiSystemModule.preciseQueryModuleLibrary(data);

  const clumnsRes = await AdminApiSystemModule.getDistinctValuesByDefaultQueryFields(data);
  const distinctValues: Record<string, any[]> = (clumnsRes as any)?.data?.data?.values || (clumnsRes as any)?.data?.values || (clumnsRes as any)?.data?.data || {};

  const param: any = {};
  param.categoryId = categoryid.value;
  param.menuId = menuId.value;
  const libRes = await AdminApiSystemModule.findCurrentModuleInfoByCategoryId(param);
  if (libRes.data.code == 200) {
    modulePropertyInfo.value = libRes.data.data;
    const resData: any = libRes.data.data;
    const parm: any = [];
    for (let i = 0; i < resData.length; i++) {
      // 动态查询条件：searchFlag == 0（默认查询）
      if (resData[i].searchFlag == 0) {
        const key = resData[i].propertyName == '贡献者' ? 'para7Name' : resData[i].dataProp;
        // 查询字段全部以下拉形式展示；下拉值来源于 clumnsRes 返回的 distinctValues
        const valueKeyCandidates = [String(resData[i].dataProp ?? ''), String(key ?? ''), String(key ?? '').endsWith('Name') ? String(key).slice(0, -4) : ''].filter(Boolean);
        const rawOptions = valueKeyCandidates.map(k => distinctValues?.[k]).find(v => Array.isArray(v) && v.length > 0) || [];
        const options = (rawOptions || []).map((v: any) => String(v)).filter((v: string) => v.trim() !== '');
        queryColumns.value.push({
          id: resData[i].id,
          title: resData[i].propertyName,
          key,
          inputType: 'select',
          options,
        });
        if (!(key in queryForm)) queryForm[key] = '';
      }

      if (resData[i].showFlag == 0) {
        parm.push({
          id: resData[i].id,
          title: resData[i].propertyName,
          key: resData[i].propertyName == '贡献者' ? 'para7Name' : resData[i].dataProp,
          align: 'center',
          resizable: true,
          filters: [],
          width: resData[i].colWidth == undefined ? 70 : resData[i].colWidth,
          sortable: true,
          render: resData[i].dataProp == 'para2' ? renderFunTiele(resData[i].dataProp) : renderFunTiele3(resData[i].dataProp),
        });
      }
    }
    parm.unshift({
      fixed: 'left',
      type: 'checkbox',
      align: 'left',
      width: '60',
    });
    columns.value = parm;
  }
  if (res.data.code == 200) {
    const resData: any = res.data.data;
    const moduleListData = resData.list || [];
    dataSource.value = moduleListData;
    // 总条数：优先使用 total（总记录数），其次 pageCount / totalPage
    page.pageCount = resData.total ?? resData.pageCount ?? resData.totalPage ?? 0;
  }
  loading.value = false;
}
async function fetchModuleList(filterArr?: any) {
  loading.value = true;
  const data: any = {
    userId: userStore.getUser.id,
    moduleParaList: filterArr || [],
    categoryId: categoryid.value,
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    menuId: menuId.value,
  };
  const res = await AdminApiSystemModule.preciseQueryModuleLibrary(data);
  if (res.data.code == 200) {
    const resData: any = res.data.data;
    dataSource.value = resData.list || [];
    page.pageCount = resData.total ?? resData.pageCount ?? resData.totalPage ?? 0;
  }
  loading.value = false;
}

async function queryModuleLibrary(filterArr?: any) {
  await fetchModuleList(filterArr);
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
      // 直接从 selectModelList 提取 id 数组
      const moduleIds = selectModelList.value.map(val => `${val.id}`);
      // 直接传递数组
      const res = await AdminApiSystemModule.batchDeleteModuleInfo(moduleIds);
      message.info('删除成功');
      modalInit();
      btnType.value = true;
      delBtnType.value = true;
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
          },
        },
      },
      params.row[key],
    );
  };
  return render;
}
async function moduleDetails(rowRecord: any) {
  pageFlagDrawer.value = true;
  parmType.value == 0;
  const moduleParaList = modulePropertyInfo.value;
  modalInfo.value = moduleParaList.map((item: any) => ({
    name: item.propertyName,
    str: item.dataProp,
    val: rowRecord != null && item.dataProp != null ? rowRecord[item.dataProp] : undefined,
  }));
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
function onShowSizeChange(current: number, pageSize: number) {
  page.currentPage = current;
  page.pageSize = pageSize;
  // 分页变化：若当前存在筛选条件，走筛选接口；否则走普通列表接口
  const hasFilter = queryColumns.value.some((c: any) => {
    const v = queryForm[c.key];
    return v !== undefined && v !== null && String(v).trim() !== '';
  });
  if (hasFilter) {
    handleQuery(false);
  } else {
    fetchModuleList();
  }
}

function buildFilterArr() {
  const moduleParaList: any[] = [];
  queryColumns.value.forEach((c: any) => {
    const v = queryForm[c.key];
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      moduleParaList.push({
        modelInfoProp: c.key,
        modelInfoPropValue: String(v).trim(),
      });
    }
  });
  return moduleParaList;
}

function handleQuery(resetPage = true) {
  if (resetPage) page.currentPage = 1;
  const filterArr = buildFilterArr();
  if (filterArr.length > 0) {
    queryModuleLibrary(filterArr);
  } else {
    fetchModuleList();
  }
}

function handleQueryReset() {
  queryColumns.value.forEach((c: any) => {
    queryForm[c.key] = '';
  });
  page.currentPage = 1;
  fetchModuleList();
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
  // const res = await AdminApiwebSocketAuth.setOperationalModel(data);
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
//打开二维图
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
    params.moduleId = row[0].id;
    const res = await AdminApiwebSocketAuth.modelDesignParametric(params);
    console.log(res);
    const data: any = res.data.data;
    if (data.moduleNum != null && data.moduleNum != '') {
      paramsObject.value.templateModuleNum = data.moduleNum;
    }
    if (data.moduleType != null && data.moduleType != '') {
      paramsObject.value.templateModuleType = data.moduleType;
    }
    moduleId.value = data.moduleId;
    if (data.moduleParaList && data.moduleParaList.length > 0) {
      const rowRecord = row[0];
      parmDesignData.value = data.moduleParaList.map((item: any) => ({
        ...item,
        parameterValue: rowRecord != null && item.dataProp != null ? rowRecord[item.dataProp] : undefined,
      }));
    } else {
      parmDesignData.value = [];
    }
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
function updateParmDesignData(data: any[]) {
  parmDesignData.value = data;
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
  const data: any = {};
  data.categoryId = categoryid.value;
  data.userid = userStore.getUser.id;
  const res = await AdminApiSystemModule.createModuleLibraryTemplateApi(data);
  console.log(res);
  if (res.data.code == 200) {
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
  exceldata.userId = userStore.getUser.id;
  exceldata.userName = userStore.getUser.userName;
  exceldata.moduleName = fileList.value[0].newFileName;
  exceldata.menuId = menuId.value;
  const res = await AdminApiSystemModule.importingModelInformationNew(exceldata);
  if (res.data.code == 200) {
    message.info({
      top: 80,
      duration: 10,
      content: res.data.data,
      closable: true,
    });
    batchflag.value = false;
    modalInit();
  } else {
    message.error({
      top: 80,
      duration: 10,
      content: res.data.data,
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
        id: list[i].params,
        colWidth: list[i].renderWidth,
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
  data.menuId = menuId.value;
  data.userName = userStore.getUser.userName;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemModule.exportModuleLibraryApi(data);
  if (res.data.code == 200) {
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
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
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
  moduleDetails(row);
}

function handleGlobalModelNumClick(record: any) {
  globalQueryModalVisible.value = false;
  emit('getCategory', record.categoryId);
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.moduleInfoListComponents');
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
  data.menuId = menuId.value;
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
  for (let i = 0; i < parmList.length; i++) {
    debugger;
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
    AdminApiSystemModule.findAllModuleAttachment(params).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        const data: any = res.data.data;
        if (data.attachmentList.length > 0) {
          fileData1.value = data.attachmentList || [];
          fileData2.value = data.pdmsResults || [];
        }
      }
    });
  } else if (type == 1) {
    AdminApiSystemModule.krAttribute(params).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        const data: any = res.data.data;
        if (data.pdmsResults) {
          pdmData.value = data.pdmsResults;
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
    supGbomcolumns.value = [];
    let data: any = {};
    data.categoryId = categoryid.value;
    data.menuId = menuId.value;
    data.moduleId = PDMid.value;
    AdminApiSystemModule.findParametricDesign(data).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        doudata.value = res.data.data.modulesList || [];
        const resData = res.data.data.moduleParaList || [];
        for (let i = 0; i < resData.length; i++) {
          if (resData[i].propertyName == '模型件号') {
            resData[i].dataProp = 'moduleNewNum';
          } else if (resData[i].propertyName == '模型类型') {
            resData[i].dataProp = 'moduleType';
          }
          supGbomcolumns.value.push({
            title: resData[i].propertyName,
            dataIndex: resData[i].dataProp,
            key: resData[i].dataProp,
            align: 'center',
            resizable: true,
            minWidth: resData[i].colWidth == undefined ? 70 : resData[i].colWidth,
            sortable: true,
          });
        }
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
function setFixedRowClass(record, index) {
  // 为前三行分别添加类名：fixed-row-0、fixed-row-1、fixed-row-2
  return index < 3 ? `fixed-row-${index}` : '';
}
async function downloadPDF(id: number, documentName: any) {
  const downLoadItem: any = {
    fileId: id,
  };
  handleEpcDownload(downLoadItem, documentName);
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

defineExpose({ initData, selectAllModuleInfo });
</script>

<template>
  <div class="module-body">
    <div class="selectLeft">
      <div class="btn-box">
        <div class="btn-box-middle" v-if="queryColumns.length">
          <div class="query-scroll">
            <a-row :gutter="[12, 6]">
              <a-col v-for="item in queryColumns" :key="item.key" :span="8">
                <a-form-item :label="item.title" class="query-item">
                  <a-select
                    v-if="item.inputType === 'select'"
                    v-model:value="queryForm[item.key]"
                    allowClear
                    show-search
                    :filter-option="
                      (input, option) =>
                        String(option?.value ?? '')
                          .toLowerCase()
                          .includes(String(input ?? '').toLowerCase())
                    "
                    size="middle"
                    style="width: 100%"
                    placeholder="请选择">
                    <a-select-option v-for="opt in item.options" :key="opt" :value="opt">
                      {{ opt }}
                    </a-select-option>
                  </a-select>
                  <a-input v-else v-model:value="queryForm[item.key]" allowClear size="middle" placeholder="请输入" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="query-actions">
            <a-button type="primary" size="middle" @click="handleQuery()"><EpcIcon type="icon-fangdajing" style="font-size: 12px" />查询</a-button>
            <a-button size="middle" @click="handleQueryReset"><EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
          </div>
        </div>
        <div class="btn-box-container">
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
            <div class="btn-item">
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  更多
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <div v-for="(item, index) in dropdownList" :key="index" style="text-align: left">
                      <a-menu-item @click.native="dropdownAction(item.id)">
                        {{ item.name }}
                      </a-menu-item>
                    </div>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>

          <div class="btn-box-right">
            <div class="btn-item" @click="handleAddOrUpdate">
              <EpcIcon type="icon-md-add" style="color: #1a71ff; font-size: 17px" />
              添加数据
            </div>
            <div :class="{ 'btn-item-select': btnType, 'btn-item': !btnType }" @click="updModule">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑
            </div>
            <div
              :class="{
                'btn-item-select': delBtnType,
                'btn-red': !delBtnType,
              }"
              @click="delModule">
              <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
              删除
            </div>
          </div>
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
        :page-flag="true"
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
    @update-parm-design-data="updateParmDesignData"
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

  <div class="moduleInfoListComponents" v-dragModal>
    <a-modal
      v-model:visible="globalQueryModalVisible"
      :getContainer="customGetContainer"
      style="width: 80%"
      :title="$t('全局查询')"
      :confirm-loading="globalQueryLoading"
      :mask-closable="false"
      @on-cancel="globalQueryModalVisible = false">
      <div style="margin-bottom: 12px">
        <div v-for="(group, idx) in globalQueryGroups" :key="idx" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 8px">
          <a-select v-model:value="group.field" style="width: 140px" :options="globalQueryFieldOptions" />
          <a-select v-model:value="group.queryType" style="width: 140px" :options="globalQueryTypeOptions" />
          <a-input v-model:value="group.keyword" allowClear placeholder="请输入内容" style="width: 180px" />
          <EpcIcon type="icon-md-add" style="color: #1a71ff; font-size: 18px; cursor: pointer" @click="addGlobalQueryGroup" />
          <EpcIcon v-if="globalQueryGroups.length > 1" type="icon-shanchu2" style="color: #ff4d4f; font-size: 16px; cursor: pointer" @click="removeGlobalQueryGroup(idx)" />
          <span v-if="idx === 0" style="color: #999; font-size: 12px">最多3组条件</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center">
          <a-button type="primary" :loading="globalQueryLoading" @click="fetchGlobalQueryData(1, globalQueryTablePagination.pageSize, 'manager')">查询</a-button>
          <a-button @click="resetGlobalQueryGroups">重置</a-button>
        </div>
      </div>

      <a-table
        row-key="_rowKey"
        :columns="globalQueryColumns"
        :data-source="globalQueryList"
        :scroll="{ y: globalQueryTableScrollY }"
        :pagination="globalQueryTablePagination"
        :loading="globalQueryLoading"
        @change="handleGlobalTableChange">
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'para1'">
            <a @click.stop="handleGlobalModelNumClick(record)">{{ record.para1 }}</a>
          </template>
          <GlobalQueryPara10Cell v-else-if="column.dataIndex === 'para10'" :text="text" />
          <template v-else>{{ text }}</template>
        </template>
      </a-table>
      <template #footer>
        <a-button type="primary" @click="globalQueryModalVisible = false"> 关闭 </a-button>
      </template>
    </a-modal>
  </div>

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
  <a-drawer v-model:visible="pageFlagDrawer" title="模块详情" placement="right" :closable="false" width="800">
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
        <span>历史文档</span>
      </div>
    </div>
    <!--  -->
    <div ref="udfBoxRef" :style="udfBoxStyle()" class="udfPage_style">
      <div v-if="parmType == 0">
        <a-descriptions v-for="item in modalInfo" :key="item.id" style="margin-top: 20px" size="small" bordered>
          <a-descriptions-item :label="item.name" style="width: 200px">
            {{ item.val }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div v-if="parmType == 1">
        <div v-if="pdmDataFlag">
          <a-descriptions style="margin-top: 20px" size="small" bordered>
            <a-descriptions-item label="名称：" style="width: 200px">
              {{ pdmData.name }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div v-if="pdmDataFlag">
          <a-descriptions style="margin-top: 20px" size="small" bordered>
            <a-descriptions-item label="编码：" style="width: 200px">
              {{ pdmData.number }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div v-if="pdmDataFlag">
          <a-descriptions style="margin-top: 20px" size="small" bordered>
            <a-descriptions-item label="版本：" style="width: 200px">
              {{ pdmData.version }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-descriptions v-for="item in attributeParmList" :key="item.id" style="margin-top: 20px" size="small" bordered>
            <a-descriptions-item :label="item.name" style="width: 200px">
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
            :locale="locale"
            :pagination="false"
            default-expand-all
            :data-source="fileData1"
            :columns="fileColumns1"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'oldFileName'">
                <a class="action-btn" @click.stop="downloadPDF(record.fileId, record.documentName)">下载</a>
              </template>
            </template>
          </a-table>
        </div>

        <div style="width: 100%; height: 30px; text-align: left; margin-top: 20px">PDM知识:</div>
        <div style="width: 100%">
          <a-table
            :scroll="{ x: 400, y: 400 }"
            row-key="id"
            :locale="locale"
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
      <div v-if="parmType == 5" class="history-doc-table-wrap">
        <a-table
          :scroll="{ x: 1200, y: 400 }"
          row-key="id"
          :loading="loading"
          :locale="locale"
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
  padding-right: 20px;
}

/* 历史文档表格：限制宽度，超出显示横向滚动条 */
.history-doc-table-wrap {
  width: 100%;
  max-width: 100%;
  margin-top: 20px;
  min-width: 0;
  overflow-x: auto;

  :deep(.ant-table-wrapper) {
    min-width: 0;
  }
  :deep(.ant-table-body) {
    overflow-x: auto !important;
  }
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
  min-height: 35px;
  background-color: #ffffff;
  text-align: left;
  font-size: 14px;
}
.btn-box-container {
  background-color: #e5efff;
  width: 100%;
  min-height: 35px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.btn-box-left {
  display: flex;
}

.btn-box-right {
  display: flex;
}
.btn-box-middle {
  flex: 1;
  padding: 4px 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  height: 78px;
  overflow: hidden;
}
.query-scroll {
  flex: 1;
  min-width: 0;
  max-height: 78px; /* 默认最多两行，超出滚动 */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 6px; /* 抵消 a-row gutter 的负 margin，避免横向滚动条 */
}
.query-actions {
  display: flex;
  gap: 8px;
  padding-top: 35px;
  white-space: nowrap;
}
:deep(.query-item) {
  margin-bottom: 0 !important;
  display: flex;
  align-items: center;
}
:deep(.query-item .ant-form-item-label) {
  flex: 0 0 96px; /* 固定 label 宽度，保证对齐 */
  text-align: right;
  padding-right: 8px;
  padding-top: 0 !important;
  display: flex;
  align-items: center;
}
:deep(.query-item .ant-form-item-label > label) {
  font-size: 14px;
  color: #333;
  display: inline-block;
  width: 100%;
  line-height: 26px;
  transform: translateY(1px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.query-item .ant-form-item-control) {
  min-width: 0;
  flex: 1;
}

:deep(.query-item .ant-input-affix-wrapper),
:deep(.query-item .ant-input),
:deep(.query-item .ant-select-selector) {
  height: 32px !important;
}
:deep(.query-item .ant-input-affix-wrapper) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex;
  align-items: center;
}
:deep(.query-item .ant-input-affix-wrapper > input.ant-input) {
  height: 28px !important;
  line-height: 28px !important;
}
:deep(.query-item .ant-select-selection-search-input) {
  height: 28px !important;
}
:deep(.query-item .ant-select-selection-item),
:deep(.query-item .ant-select-selection-placeholder) {
  line-height: 28px !important;
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

.btn-red {
  min-width: 28px;
  height: 35px;
  margin: 0 10px;
  text-align: center;
  line-height: 35px;
  color: #ff4d4f;
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
