<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import ParameterGeneral from './ParameterGeneral.vue';
import { TableColumnType, message, Modal } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
import UploadImg from '@/components/UploadImg/index.vue';
import { sortermethod } from '@/utils/tools';
const props = defineProps({
  checkPageInfoNewId: {
    require: false,
    type: String,
    default: () => '',
  },
  treeId: {
    require: false,
    type: String,
    default: () => '',
  },
});
//CL
const formInline = reactive({
  pageType: '',
  pageName: '',
  remark: '',
  pageImgStr: '',
  workPageWidth: '',
  initCallMethod: '',
});
const fileList = ref<any>([]);
const pictureId = ref<any>('');
const pictureName = ref<any>('');
const pictureFileId = ref<any>('');
const imgWidth = ref<any>(300);
const marginTop = ref<any>(30);
const uploadPictureModal = ref<any>(false);
function handleResizeColumn(w, col) {
  col.width = w;
}
/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const columns = ref<TableColumnType<any>[]>([
  {
    title: WeiI18n.$t('参数类型'),
    dataIndex: 'paramType',
    key: 'paramType',
    align: 'left',
    resizable: true,
    width: 130,
  },
  {
    title: WeiI18n.$t('参数名称'),
    dataIndex: 'parameterName',
    key: 'parameterName',
    align: 'left',
    resizable: true,
    width: 160,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 100,
    fixed: 'right',
  },
]);
const pictureList = ref<any>([]);
const pictureColumns = ref<TableColumnType<any>[]>([
  {
    title: WeiI18n.$t('示意图名称'),
    dataIndex: 'imageName',
    key: 'imageName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.imageName, b.imageName),
    width: 230,
  },
  {
    title: WeiI18n.$t('示意图宽度'),
    dataIndex: 'width',
    key: 'width',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.width, b.width),
    width: 130,
  },
  {
    title: WeiI18n.$t('与上方距离'),
    dataIndex: 'distanceUp',
    key: 'distanceUp',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.distanceUp, b.distanceUp),
    width: 130,
  },
  {
    title: WeiI18n.$t('上传时间'),
    dataIndex: 'addTime',
    key: 'addTime',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.addTime, b.addTime),
    width: 160,
  },
  {
    title: WeiI18n.$t('上传人'),
    dataIndex: 'createBy',
    key: 'createBy',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.createBy, b.createBy),
    width: 160,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 100,
    fixed: 'right',
  },
]);
const layoutManageDialogVisible = ref<any>(false);
const colsFormulaStr = ref<any>('');
const colsParaType = ref<any>('');
const rowNums = ref<any>('');
const colNums = ref<any>('');
const tableHeight = ref<any>('');
const tableWidth = ref<any>('');
const rules = reactive({
  tableName: [{ required: true, message: '请输入表格名称', trigger: 'blur' }],
  tableType: [
    {
      required: true,
      message: '请选择表格类型',
      trigger: 'change',
    },
  ],
  rowNums: [{ required: true, message: '请输入行数', trigger: 'blur' }],
  colNums: [{ required: true, message: '请输入列数', trigger: 'blur' }],
});
const tableType = ref<any>('');
const tableName = ref<any>('');
const ruleFormRef = ref<any>(null);
const isOutput = ref<boolean>(false);
const marginLeft = ref<any>('');
const callFunctionName = ref<any>('');
const inputId = ref<any>('');
const updateInputStyle = ref<any>('');
const tableRowId = ref<any>('');
const tableColsModuleCateId = ref<any>('');
const tableColsModuleCateName = ref<any>('');
const tableColsInputType = ref<any>('');
const tableColsIndex = ref<any>('');
const tableColsType = ref<any>('');
const tableID = ref<any>('');
const colsBackgroundColor = ref<any>('');
const oneTableInputSaveBtn = ref<any>(false);
const oneTableInputValSaveBtn = ref<any>(false);
const tableColsSelectStr = ref<any>('');
const colsIsEdit = ref<any>('');
const tableColsId = ref<any>('');
const tableColsName = ref<any>('');
const tableColsWidth = ref<any>('');
const tableColsIfShow = ref<any>('');
const colsDefaultVal = ref<any>('');
const colsFunctionType = ref<any>('');
const colsFunctionName = ref<any>('');
const __item = ref<any>('');
const __type = ref<any>('');
const parameterId = ref<any>('');
const tableParameterName = ref<any>('');
const tableParameterId = ref<any>('');
const cellParentNum = ref<any>('');
const cellFormulaStr = ref<any>('');
const cellParameterId = ref<any>('');
const cellParamType = ref<any>('');
const cellNum = ref<any>('');
const sheetNum = ref<any>('');
const cellInputList = ref<any>([]);
const tableInheritNum = ref<any>('');
const cellInputType = ref<any>('');
const cellInputOrOutput = ref<any>('');
const tableInfoNum = ref<any>('');
const tableTitleName = ref<any>('');
const tableInfoId = ref<any>('');
const tableColsNum = ref<any>('');
const tableSumHeight = ref<any>('');
const tableSumWidth = ref<any>('');
const tableRowsNum = ref<any>('');
const firstColType = ref<any>('');
const tableNumSummary = ref<any>('');
const ifCanBore = ref<any>('');
const tableStyle = ref<any>('');
const tableInfoPModuleNum = ref<any>('');
const tableInitFunc = ref<any>('');
const tableBtnCheckFunc = ref<any>('');
const tableBtnReloadFunc = ref<any>('');
const returnValuePropStr = ref<any>('');
const synchronizationApiName = ref<any>('');
const filterValuePropStr = ref<any>('');
const moduleCateId = ref<any>('');
const paramID = ref<any>('');
const preference = ref<any>('');
const oneTableMainSaveBtn = ref<any>(false);
const tableInfoType = ref<any>('');
const tableBtnMess = ref<any>([]);
const tableInfoParameterName = ref<any>('');
const tableInfoParameterId = ref<any>('');
const cellParaType = ref<any>('');
const cellDefaultValue = ref<any>('');
const tableInfoDefaultVal = ref<any>('');
const callFunctionTabName = ref<any>('');
const callEventTabType = ref<any>('');
const cellsInheritNum = ref<any>('');

const tableNum = ref<any>();
const cellParaNum = ref<any>('');
const ruleForm = reactive({
  parameterNum: '',
  paramID: '',
  tableName: '',
  tableType: '',
  rowNums: '',
  colNums: '',
});
const ParameterGeneralVisible = ref<boolean>(false);
const ParameterGeneralRef = ref<any>(null);
const selectpropType = ref<any>();
const rangeRightStr = ref<any>('');
const rangeLeftStr = ref<any>('');
const rangeType = ref<any>('');
const propinfoKnowledge = ref<any>('');
const ifBold = ref<any>('');
const synchronizeDataBtn = ref<any>('');
const cellsValFromTable = ref<any>('');
const inputValFromTable = ref<any>('');
const defaultValue = ref<any>('');
const propTitleName = ref<any>('');
const propinfoName = ref<any>('');
const inputList = ref<any>([
  {
    label: '',
  },
]);
const rangeStyle = ref<any>('');
const inputOrOutput = ref<any>('');
const value2 = ref<any>('1');
const propinfoType = ref<any>('');
const oneInputSaveBtn = ref<boolean>(true);
const parameterTempList = ref<any>([]);
const parameterImgList = ref<any>([]);

// 添加新的输入项
const addInputItem = () => {
  inputList.value.push({ label: '' });
};

const addSelectColParms = () => {
  tableColsSelectStr.value.push({ label: '' });
};

// 删除输入项
const removeInputItem = (index: number) => {
  if (inputList.value.length > 1) {
    inputList.value.splice(index, 1);
  }
};

const delSelectColParms = (index: number) => {
  if (tableColsSelectStr.value.length > 1) {
    tableColsSelectStr.value.splice(index, 1);
  }
};
const workPageWidth = ref<number>(0);
const pageImgStr = ref<string>('');
const pageType = ref<string>('');
const customPageUrlStr = ref<string>('');
const activeKey = ref<string>('1');
const leftTableHeight = ref<any>(document.body.clientHeight - 260);
const activeOnClick = async (newTab: string) => {
  activeKey.value = newTab;
  if (newTab == '2') {
    getPictureList();
  } else if (newTab == '3') {
    const response = await AdminApiSystemCheckInfoApi.checkPageInfoNewDetail({
      id: props.checkPageInfoNewId,
    });
    formInline.pageType = response.data.data.result.pageType;
    formInline.pageName = response.data.data.result.pageName;
    formInline.remark = response.data.data.result.remark;
    formInline.pageImgStr = response.data.data.result.pageImgStr;
    formInline.workPageWidth = response.data.data.result.workPageWidth;
    formInline.initCallMethod = response.data.data.result.initCallMethod;
  }
};

async function getPictureList() {
  let data: any = {
    pageInfoNewId: props.checkPageInfoNewId,
  };
  const response = await AdminApiSystemCheckInfoApi.checkPageImageGetlist(data);
  pictureList.value = response.data.data.result || [];
}
async function addTextParam() {
  let data: any = {};
  data.checkPageInfoNewId = props.checkPageInfoNewId;
  data.userid = useUserStore().getUser.id;
  data.pageParamList = [];
  data.pageParamList.push({
    checkPageInfoNewId: props.checkPageInfoNewId,
    elementParamName: '新建参数',
    type: 1,
  });
  const res = await AdminApiSystemCheckInfoApi.checkPageParamSavePageParam(data);
  console.log(res);
  if (res.data.data.result) {
    getCheckPageList();
  }
}
async function getCheckPageList() {
  const res = await AdminApiSystemCheckInfoApi.checkPageParamFindCheckPageParamList({
    checkPageInfoNewId: props.checkPageInfoNewId,
  });
  parameterTempList.value = [];
  parameterImgList.value = [];
  parameterTempList.value = res.data.data.resultVO.paramVOList;
  parameterImgList.value = res.data.data.resultVO.imageDataVOList;
  workPageWidth.value = res.data.data.workPageWidth;
  pageImgStr.value = res.data.data.pageImgStr;
  pageType.value = res.data.data.pageType;
  customPageUrlStr.value = res.data.data.customPageUrl;
}

async function getCheckPageList2() {
  updateInputStyle.value = '';
  const res = await AdminApiSystemCheckInfoApi.checkPageParamFindCheckPageParamList({
    checkPageInfoNewId: props.checkPageInfoNewId,
  });
  parameterTempList.value = [];
  parameterImgList.value = [];
  parameterTempList.value = res.data.data.resultVO.paramVOList;
  parameterImgList.value = res.data.data.resultVO.imageDataVOList;
  workPageWidth.value = res.data.data.workPageWidth;
  pageImgStr.value = res.data.data.pageImgStr;
  pageType.value = res.data.data.pageType;
  customPageUrlStr.value = res.data.data.customPageUrl;
}

async function addTableParam() {
  isOutput.value = true;
  tableName.value = '';
  tableNum.value = '';
  tableType.value = '1';
  rowNums.value = '';
  colNums.value = '';
  tableHeight.value = '';
  tableWidth.value = '';
  Object.assign(ruleForm, {});
  __type.value = 2;
}

async function layoutManage() {
  layoutManageDialogVisible.value = true;
}

async function changeOneInput() {
  oneInputSaveBtn.value = false;
}

async function changeTableOneInput(index: any) {
  if (index == 1) {
    colsBackgroundColor.value = '';
  }
  oneTableInputSaveBtn.value = false;
}

async function changeTableMainInput() {
  oneTableMainSaveBtn.value = false;
}

async function changeTableValInput() {
  oneTableInputValSaveBtn.value = false;
}

async function chooseParameter(type: any) {
  selectpropType.value = type;
  ParameterGeneralVisible.value = true;
  nextTick(() => {
    ParameterGeneralRef.value.handlegetData('147');
  });
}
async function handleSave(data: any) {
  tableNum.value = data.id;
  ruleForm.parameterNum = data.parameterNum;
  ruleForm.paramID = data.id;
  //单元格关联参数
  if (selectpropType.value == 12) {
    tableInfoParameterId.value = data.id;
    tableInfoParameterName.value = data.parameterNum;
    changeTableValInput();
  }
  //表格编号浏览
  else if (selectpropType.value == 7) {
    tableInfoNum.value = data.parameterNum;
    changeTableMainInput();
  }
  //继承单元格-表格编号
  else if (selectpropType.value == 6) {
    tableInheritNum.value = data.parameterNum;
    changeTableValInput();
  }
  //继承参数值-继承值编号
  else if (selectpropType.value == 4) {
    cellParameterId.value = data.id;
    cellParentNum.value = data.parameterNum;
  }
  //列编辑-关联参数
  else if (selectpropType.value == 3) {
    tableParameterId.value = data.id;
    tableParameterName.value = data.parameterNum;
  } else {
    parameterId.value = data.id;
    propinfoName.value = data.parameterNum;
    if (propTitleName.value == null || propTitleName.value == '') {
      propTitleName.value = data.parameterName;
    }
    changeOneInput();
  }
  ParameterGeneralVisible.value = false;
}

async function updateFormMsg(item: any) {
  console.log(item);
  __item.value = item;
  updateInputStyle.value = '1';
  if (item.associationParam) {
    getCheckPageParamAssociationParamDetail(item.associationParam, 0);
  } else {
    propinfoName.value = '';
  }

  //整理完的
  parameterId.value = item.associationParam ? item.associationParam : '';
  inputId.value = item.id;
  ifBold.value = item.boldFlag;
  callFunctionName.value = item.callFunctionName;
  marginLeft.value = item.leftMargin;
  defaultValue.value = item.defaultValue;
  synchronizeDataBtn.value = item.synchronizeDataButton;
  propTitleName.value = item.paramName;
  propinfoType.value = item.paramType;
  inputOrOutput.value = item.inputOuputProperties == 'IN' ? '0' : item.inputOuputProperties == 'OUT' ? '1' : '0';
  propinfoKnowledge.value = item.knowledgeDefinition;
  rangeType.value = item.definitionScopeValue;
  rangeStyle.value = item.definitionScopeModality;
  inputValFromTable.value = item.extendTable;
  cellsValFromTable.value = item.cellNumber;
  var leftStr = JSON.parse(item.definitionScope);
  if (leftStr == null) {
    rangeLeftStr.value = '';
    rangeRightStr.value = '';
  } else {
    rangeLeftStr.value = leftStr.left;
    rangeRightStr.value = leftStr.right;
  }

  propinfoName.value = '';
  if (item.dropDownValue == undefined || item.dropDownValue == 'undefined') {
    inputList.value = [{ label: '' }];
  } else {
    inputList.value = JSON.parse(item.dropDownValue);
  }
}

//编辑和保存页面基本信息
async function addInputChildForm() {
  let data: any = {};
  data.checkPageInfoNewId = props.checkPageInfoNewId;
  let pageParamLista = [];
  pageParamLista.push({
    associateModuleLibraryParam: '', //关联模块库参数
    associationParam: parameterId.value, //关联参数
    autoFindFlag: '', //是否自动查找 1：是；0：否
    boldFlag: ifBold.value, //是否加粗 1：是；0：否
    buttonName: propTitleName.value, //按钮名称
    callFunctionName: callFunctionName.value, //调用函数名称
    checkPageInfoNewId: '', //t_check_page_info_new 表id
    colList: '', //计算工具页面表格列关联表集合
    defaultValue: defaultValue.value, //默认值
    elementParamName: propTitleName.value, //元素参数名称
    elementParamValue: defaultValue.value, //元素参数值
    groupName: '', //分组名称
    id: __item.value.id, //主键id
    idList: [],
    inputOuputProperties: propinfoType.value == 2 ? '' : inputOrOutput.value == 0 ? 'IN' : 'OUT', //输入输出属性 输入：IN； 输入：OUT
    knowledgeDefinition: propinfoKnowledge.value, //知识定义
    leftMargin: marginLeft.value, //左边距
    paramName: propTitleName.value, //参数名称
    paramType: propinfoType.value, //参数类型 1：文本域；2：计算按钮；3：模型件号；4：文件上传；5：浏览序列数据；6：参考项目数据
    projectData: 'string', //关联项目数据
    rowList: [], //计算工具页面表格行关联表集合
    seriesData: 'string', //关联系列数据
    type: __item.value.type, //文本类型 1：文本；2：表格
    extendTable: inputValFromTable.value, //继承自表格
    cellNumber: propinfoType.value == 2 ? '' : cellsValFromTable.value, //单元格编号
    synchronizeDataButton: synchronizeDataBtn.value, //是否是同步按钮
    definitionScopeValue: rangeType.value, //取值范围定义 1:强制性范围; 2:警告性范围
    definitionScopeModality: rangeStyle.value, //取值范围形式
    definitionScope: JSON.stringify({
      left: rangeLeftStr.value,
      right: rangeRightStr.value,
    }), //取值范围定义
    dropDownValue: JSON.stringify(inputList.value), //下拉框值,
    userid: useUserStore().getUser.id,
  });
  data.pageParamList = pageParamLista;
  const res = await AdminApiSystemCheckInfoApi.checkPageParamSavePageParam(data);
  console.log(res);
  getCheckPageList();
}

async function addTableColsForm() {
  //propinfoType 2:标题；3:空行;0:文本框;1:下拉框;4:文本域（可输入段落）
  if (tableColsName.value == null || tableColsName.value == '') {
    message.warning('请输入列名称！');
    return;
  }
  if (!/^(\d+\.?)?\d{0,2}$/.test(tableColsWidth.value)) {
    message.warning('请输入有效的数字!');
    return;
  }
  let data: any = {
    colID: tableColsId.value,
    colName: tableColsName.value,
    colWidth: tableColsWidth.value,
    displayFlag: tableColsIfShow.value,
    callFunctionType: colsFunctionType.value,
    callFunctionName: colsFunctionName.value,
    parameterId: tableParameterId.value,
    inputType: tableColsInputType.value,
    selectStr: JSON.stringify(tableColsSelectStr.value),
    colsDefaultVal: colsDefaultVal.value,
    colsBackgroundColor: '',
    colsIsEdit: colsIsEdit.value,
  };
  const res = await AdminApiSystemCheckInfoApi.checkPageTableInfoNewUpdateTableCol(data);
  console.log(res);
  if (res.data.data) {
    getCheckPageList();
    oneTableInputSaveBtn.value = true;
    message.success('保存成功');
  } else {
    return;
  }
}

//单元格修改
async function addTableValForm() {
  let data: any = {
    cellParaNum: cellParaNum.value, // 单元格编号
    dataType: cellParaType.value, // 单元格数据分类：自定义值，继承值,
    parameterId: tableInfoParameterId.value, // 关联参数id (自定义，继承值，继承单元格，文件库读取值，计算值)
    parameterNum: tableInfoParameterName.value, // 关联参数代号(自定义，继承值，继承单元格，文件库读取值，计算值)
    callFunctionType: callEventTabType.value, // 调用函数类型(自定义)（change/click）
    callFunctionName: callFunctionTabName.value, // 调用函数名称(自定义)
    inheritNum: cellsInheritNum.value, // 继承值编号(继承值)
    cellFormulaStr: cellFormulaStr.value, // 列自定义公式(计算值)
    defaultVal: tableInfoDefaultVal.value ? tableInfoDefaultVal.value : defaultValue.value, // 默认值(自定义，继承值)
    inputType: cellInputOrOutput.value, // 文本类型(1:文本，2:下拉)(继承值，)
    selectStr: JSON.stringify(cellInputList.value), // 下拉值属性(继承值，)
    tableInheritNum: tableInheritNum.value, // 表格编号(继承单元格)
    cellsInheritNum: cellsInheritNum.value, // 单元格编号(继承单元格)
    tableInfoParameterId: tableInfoParameterId.value, // 单元格关联参数

    paramType: cellParamType.value, // 参数输入类型 1:输入参数 2:输出参数(继承值，)
    cellNum: cellNum.value,
    sheetNum: sheetNum.value,
  };
  const res = await AdminApiSystemCheckInfoApi.checkPageTableInfoNewUpdateCellInfo(data);
  if (res.data.data) {
    getCheckPageList();
    oneTableInputValSaveBtn.value = true;
    message.success('保存成功');
  } else {
    return;
  }
}

async function saveCustomPageURL() {
  let data: any = {
    id: props.checkPageInfoNewId,
    customPageUrl: customPageUrlStr.value,
  };
  const res = await AdminApiSystemCheckInfoApi.checkPageInfoNewSaveCustomPageURL(data);
  message.success('保存成功');
}

async function updateTableMainForm() {
  if (tableTitleName.value == '') {
    message.warning('请输入参数！');
    return;
  }
  if (!/^(\d+\.?)?\d{0,2}$/.test(tableColsWidth.value)) {
    message.warning('请输入有效的数字!');
    return;
  }
  let data: any = {
    tableID: tableInfoId.value, //表格ID
    tableName: tableTitleName.value, //表格名称
    rowNumber: tableRowsNum.value, //行数
    colNumber: tableColsNum.value, //列数
    tableTotalWidth: tableSumWidth.value, //表格总宽度
    tableTotalHeight: tableSumHeight.value, //表格总高度
    tableNum: tableInfoNum.value ? tableInfoNum.value : tableNumSummary.value, //表格编号
    paramID: paramID.value, //参数ID
    firstColType: firstColType.value, //表头类型
    tableBtnMess: JSON.stringify(tableBtnMess.value), //表格上方按钮信息
    tableInitFunc: tableInitFunc.value, //表格初始化方法调用
    tableBtnCheckFunc: tableBtnCheckFunc.value, //计算按钮方法调用
    tableBtnReloadFunc: tableBtnReloadFunc.value, //刷新按钮方法调用
    modulecategoryid: moduleCateId.value, //关联模块库节点ID
    preference: preference.value, //表格是否展示 0隐藏1展示
  };
  const res = await AdminApiSystemCheckInfoApi.checkPageTableInfoNewUpdateTable(data);
  if (res.data.data) {
    getCheckPageList();
    oneTableMainSaveBtn.value = true;
    message.success('保存成功');
  } else {
    return;
  }
}

async function delTableCols() {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除本列？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      let data: any = {
        colID: tableColsId.value,
        tableID: tableID.value,
      };
      const res = await AdminApiSystemCheckInfoApi.checkPageTableInfoNewDeleteTableCol(data);
      if (res.data.data) {
        message.success('删除成功');
        getCheckPageList();
      }
    },
  });
}

//获取取值范围类型
function getRangeStr(data: any, type: any) {
  let str = '';
  if (type == 'left') {
    str = JSON.parse(data);
    str = JSON.parse(data).left;
  } else {
    str = JSON.parse(data);
    str = JSON.parse(data).right;
  }
  return str;
}

async function okOutput() {
  ruleFormRef.value
    .validate()
    .then(async () => {
      let data: any = {};
      data.checkPageInfoNewID = props.checkPageInfoNewId;
      data.tableName = ruleForm.tableName;
      data.tableType = ruleForm.tableType;
      data.rowNumber = ruleForm.rowNums;
      data.colNumber = ruleForm.colNums;
      data.tableTotalWidth = tableWidth.value;
      data.tableTotalHeight = tableHeight.value;
      data.tableNum = ruleForm.parameterNum;
      data.paramID = ruleForm.paramID;
      data.userID = useUserStore().getUser.id;
      const res = await AdminApiSystemCheckInfoApi.checkPageTableInfoNewSaveTable(data);
      console.log(res);
      if (res.data.data) {
        getCheckPageList();
        isOutput.value = false;
        message.info('添加成功');
      }
    })
    .catch(errorInfo => {
      // 验证失败
      console.log('验证失败', errorInfo);
    });
}

function getParamName(row: any) {
  let str = '';
  str = row.elementParamName ? row.elementParamName : row.tableMap.tableName;
  return str;
}

function getParamType(row: any) {
  let str = '';
  let tp = row.type ? row.type : '';
  if (tp && row.tableMap) {
    str = '表格';
    return str;
  } else {
    let type = row.paramType ? row.paramType : '7';
    switch (type) {
      case '1':
        str = '文本域';
        return str;
      case '2':
        str = '计算按钮';
        return str;
      case '7':
        str = '文本框';
        return str;
      case '8':
        str = '标题';
        return str;
      case '9':
        str = '下拉框';
        return str;
      case '10':
        str = '单选按钮';
        return str;
      default:
    }
  }
}

async function moveParam(row: any, type: any) {
  let data: any = {
    paramId: row.id,
    type: type,
  };

  const response = await AdminApiSystemCheckInfoApi.checkPageParamMoveSort(data);
  message.success('调整成功');
  getCheckPageList();
}

async function deleteParam(params: any) {
  var idLista = [];
  idLista.push(Number(params.id));
  let data: any = {
    idList: idLista,
  };
  const response = await AdminApiSystemCheckInfoApi.checkPageParamdeletePageParam(data);
  message.success('删除成功');
  getCheckPageList();
}

async function selectParameter(selectpropTypea: any) {
  selectpropType.value = selectpropTypea;
  if (selectpropTypea == 8 || selectpropTypea == 12 || selectpropTypea == 7 || selectpropTypea == 6 || selectpropTypea == 4 || selectpropTypea == 3) {
    //显示选取单元格弹窗
    ParameterGeneralVisible.value = true;
    nextTick(() => {
      ParameterGeneralRef.value.handlegetData('147');
    });
  }
}

//获取表头宽度
function getWidthStyle(arr: any) {
  let width = 0;
  arr.forEach((item: any) => {
    width = Number(width) + Number(item.colWidth);
  });
  return 'width:' + width + 'px';
}

//表格title编辑
function changeTabelTitle(item: any, index: any, itm: any) {
  updateInputStyle.value = '3';
  tableColsId.value = item.id;
  tableColsName.value = item.colName;
  tableColsWidth.value = item.colWidth;
  tableColsIfShow.value = String(item.ifShowCols);
  colsDefaultVal.value = item.colsDefaultVal;
  colsFunctionType.value = item.callFunctionType;
  colsFunctionName.value = item.callFunctionName;
  tableParameterId.value = item.parameterId;
  tableColsInputType.value = item.inputType;
  tableColsIndex.value = index;
  tableColsType.value = itm.tableMap.tableType;
  tableID.value = itm.tableMap.id;
  colsBackgroundColor.value = item.colsBackgroundColor ? '#' + item.colsBackgroundColor : '';
  colsIsEdit.value = item.colsIsEdit;
  if (item.selectStr == undefined || item.selectStr == 'undefined') {
    tableColsSelectStr.value = [{ label: '' }];
  } else {
    tableColsSelectStr.value = JSON.parse(item.selectStr);
  }
  if (item.parameterId) {
    getCheckPageParamAssociationParamDetail(item.parameterId, updateInputStyle.value);
  } else {
    tableParameterId.value = '';
    tableParameterName.value = '';
  }
}

async function getCheckPageParamAssociationParamDetail(id: any, type: any) {
  const response = await AdminApiSystemCheckInfoApi.checkPageParamAssociationParamDetail({
    id: id,
  });
  if (type == 3) {
    tableParameterName.value = response.data.data.result.parameterNum || '';
    tableParameterId.value = response.data.data.result.id;
  } else {
    propinfoName.value = response.data.data.result.parameterNum;
    parameterId.value = response.data.data.result.id;
  }
}

async function updateTableMainMsg(item: any) {
  console.log(item);
  updateInputStyle.value = '5';
  let data: any = {
    tableID: item.tableMap.id,
  };
  const res = await AdminApiSystemCheckInfoApi.checkPageTableInfoNewFindTableInfo(data);
  console.log(res);
  let result = res.data.data;
  tableTitleName.value = result.tableName;
  tableInfoNum.value = result.tableNum;
  tableInfoId.value = result.id;
  tableColsNum.value = result.colNum;
  tableSumHeight.value = result.tableTotalHeight;
  tableSumWidth.value = result.tableTotalWidth;
  tableRowsNum.value = result.rowNum;
  firstColType.value = result.firstColType;
  tableNumSummary.value = result.tableNumSummary;
  ifCanBore.value = result.ifCanBore;
  tableStyle.value = result.tableStyle;
  tableInfoPModuleNum.value = result.tableInfoPModuleNum;
  tableInitFunc.value = result.tableInitFunc;
  tableBtnCheckFunc.value = result.tableBtnCheckFunc;
  tableBtnReloadFunc.value = result.tableBtnReloadFunc;
  returnValuePropStr.value = result.returnValuePropStr;
  synchronizationApiName.value = result.synchronizationApiName;
  filterValuePropStr.value = result.filterValuePropStr;
  moduleCateId.value = result.moduleCateId;
  paramID.value = result.paramID;
  preference.value = result.preference ? result.preference : '1';
  let btnMess = result.tableBtnMess;
  if (btnMess != null && btnMess != '') {
    tableBtnMess.value = [];
    tableBtnMess.value = JSON.parse(btnMess);
  } else {
    tableBtnMess.value = [];
  }
  if (result.tableType == 1 || result.tableType == '1') {
    tableInfoType.value = '固定行列表格';
  } else if (result.tableType == 2 || result.tableType == '2') {
    tableInfoType.value = '列固定行可扩展表格';
  } else if (result.tableType == 3 || result.tableType == '3') {
    tableInfoType.value = '列固定行部分可扩展表格';
  } else if (result.tableType == 4 || result.tableType == '4') {
    tableInfoType.value = 'handsontable固定行列表格';
  } else if (result.tableType == 5 || result.tableType == '5') {
    tableInfoType.value = 'handsontable行可扩展表格';
  }
  oneTableMainSaveBtn.value = true;
}

function changeModuleRowInfo(rowId: any, moduleCateId: any, moduleCateName: any, tableStylea: any) {
  updateInputStyle.value = '6';
  tableRowId.value = rowId;
  tableColsModuleCateId.value = moduleCateId;
  tableColsModuleCateName.value = moduleCateName;
  tableStyle.value = tableStylea;
}

async function changeTabelInfo(colids: any, rowId: any, defaultValuea: any, tableType: any, row: any, key: any) {
  updateInputStyle.value = '4';
  if (tableType == 1 || tableType == '1') {
    tableInfoType.value = '固定行列表格';
  } else if (tableType == 2 || tableType == '2') {
    tableInfoType.value = '列固定行可扩展表格';
  } else if (tableType == 3 || tableType == '3') {
    tableInfoType.value = '列固定行部分可扩展表格';
  } else if (tableType == 4 || tableType == '4') {
    tableInfoType.value = 'handsontable固定行列表格';
  } else if (tableType == 5 || tableType == '5') {
    tableInfoType.value = 'handsontable行可扩展表格';
  }
  let data: any = {
    colID: colids,
    rowID: rowId,
  };
  const response = await AdminApiSystemCheckInfoApi.checkPageTableInfoNewFindCellsInfo(data);
  console.log(response);
  const cellsInfo = response.data.data.cellsInfo;
  cellParaNum.value = cellsInfo.cellParaNum;
  tableInfoParameterName.value = cellsInfo.parameterNum;
  tableInfoParameterId.value = cellsInfo.parameterId;
  cellParaType.value = cellsInfo.dataType;
  cellDefaultValue.value = cellsInfo.defaultVal;
  tableInfoDefaultVal.value = cellsInfo.defaultVal;
  callFunctionTabName.value = cellsInfo.callFunctionName;
  callEventTabType.value = cellsInfo.callFunctionType;
  cellsInheritNum.value = cellsInfo.cellsInheritNum;
  tableInheritNum.value = cellsInfo.tableInheritNum;
  cellInputType.value = cellsInfo.inputType;
  cellInputOrOutput.value = cellsInfo.inputType;
  cellParentNum.value = cellsInfo.cellParaNum;
  cellFormulaStr.value = cellsInfo.cellFormulaStr;
  cellParameterId.value = cellsInfo.parameterId;
  cellParamType.value = cellsInfo.paramType; // 参数输入类型 1:输入参数 2:输出参数(继承值，)
  cellNum.value = cellsInfo.cellNum;
  sheetNum.value = cellsInfo.sheetNum;
  defaultValue.value = cellsInfo.defaultVal;
  let cellSelectStr = cellsInfo.cellSelectStr;
  if (cellSelectStr) {
    cellInputList.value = eval(cellSelectStr);
  } else {
    cellInputList.value = [{ label: '' }];
  }
}

async function uploadPicture() {
  pictureId.value = '';
  pictureName.value = '';
  pictureFileId.value = '';
  imgWidth.value = 300;
  marginTop.value = 30;
  uploadPictureModal.value = true;
}

async function okUploadInfo() {
  let data: any = {
    id: pictureId.value || '',
    pageInfoNewId: props.checkPageInfoNewId,
    imageName: pictureName.value,
    fileId: pictureFileId.value,
    width: imgWidth.value,
    distanceUp: marginTop.value,
    createBy: useUserStore().getUser.id,
  };
  const res = await AdminApiSystemCheckInfoApi.checkPageImageSaveOrUpdate(data);
  uploadPictureModal.value = false;
  getPictureList();
}
function datafilechange(file: any) {
  fileList.value = [];
}

async function datacustomRequest(options: any) {
  fileList.value.push({
    ...options,
    name: options?.documentName,
    status: 'done',
    url: options.fileUrl,
  });
  console.log(fileList.value);
  pictureName.value = fileList.value[0].oldFileName || '';
  pictureFileId.value = fileList.value[0].id || '';
}

async function updatePictureInfo(record: any) {
  pictureName.value = record.imageName;
  pictureFileId.value = record.fileId;
  imgWidth.value = record.width;
  marginTop.value = record.distanceUp;
  pictureId.value = record.id;
  uploadPictureModal.value = true;
}

async function deletePictureInfo(record: any) {
  var idListA = [];
  idListA.push(Number(record.id));
  let data: any = {
    idList: idListA,
  };
  const res = await AdminApiSystemCheckInfoApi.checkPageImageDeleteBatch(data);
  message.success('删除成功');
  getPictureList();
}

async function saveOrUpdatePageInfo() {
  let data: any = {};
  data.id = props.checkPageInfoNewId;
  data.createBy = useUserStore().getUser.id;
  data.pageType = formInline.pageType;
  data.pageName = formInline.pageName;
  data.remark = formInline.remark;
  data.pageImgStr = formInline.pageImgStr;
  data.workPageWidth = formInline.workPageWidth;
  data.initCallMethod = formInline.initCallMethod;
  const res = await AdminApiSystemCheckInfoApi.checkPageInfoNewSaveOrUpdate(data);
  message.success('保存成功');
}
defineExpose({ getCheckPageList, getCheckPageList2 });
</script>

<template>
  <div>
    <a-tabs
      @tab-click="activeOnClick"
      v-model:activeKey="activeKey"
      :tabBarStyle="{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#fff',
        width: '90%',
      }">
      <a-tab-pane key="1" tab="工作区配置">
        <a-row v-if="pageType != '自定义类'">
          <a-button type="primary" style="margin-left: 10px" plain @click="addTextParam"><EpcIcon type="icon-md-add" />添加文本元素</a-button>
          <!-- <a-button
            type="primary"
            style="margin-left: 10px"
            plain
            @click="addTableParam"
            ><EpcIcon type="icon-md-add" />添加表格</a-button
          > -->
          <a-button type="primary" style="margin-left: 10px" plain @click="layoutManage"><EpcIcon type="icon-edit" />布局管理</a-button>
        </a-row>
        <a-row style="margin-top: 10px">
          <a-col :span="16">
            <div class="module-body">
              <a-card :style="'height: ' + leftTableHeight + 'px;margin-top: 0px;background-color: #ffffff;overflow-y:auto;overflow-x:none;'" class="cardWrap">
                <!-- <div class="formWrap" :style="{ width: workPageWidth + 'px' }"> -->
                <div class="formWrap">
                  <a-form :layout="'vertical'" style="display: flex; flex-wrap: wrap">
                    <div
                      v-for="(item, index) in parameterTempList"
                      :key="index"
                      class="divList"
                      :class="item.paramType == 8 || item.paramType == 1 || item.paramType == 2 || item.paramType == 11 || item.type == 2 ? 'divListBlock' : 'divListLine'">
                      <div class="item-wrap" @dblclick="updateFormMsg(item)">
                        <!--默认添加的-->
                        <a-form-item v-if="item.type == 1 && !item.paramType" :label="item.elementParamName">
                          <a-input v-model:value="item.defaultValue" style="width: 192px" readonly></a-input>
                        </a-form-item>
                        <a-form-item v-if="item.paramType == 7" :label="item.elementParamName">
                          <a-input v-model:value="item.defaultValue" style="width: 192px" readonly></a-input>
                        </a-form-item>
                        <a-form-item v-if="item.paramType == 9" :label="item.elementParamName + '：'" aba-colon="true" :key="index">
                          <a-select v-model:value="item.defaultValue" class="m-2" style="width: 192px">
                            <a-select-option v-for="item2 in JSON.parse(item.dropDownValue)" :key="item2.value" :value="item2.label" :label="item2.label" />
                          </a-select>
                        </a-form-item>
                        <!--单选按钮 -->
                        <a-form-item v-if="item.paramType == 10" :label="item.elementParamName + '：'">
                          <a-radio-group v-model:value="item.defaultValue">
                            <a-radio v-for="(item2, index) in JSON.parse(item.dropDownValue)" :key="index" :value="item2.value" class="radioStyle">
                              {{ item2.label }}
                            </a-radio>
                          </a-radio-group>
                        </a-form-item>
                        <!--范围值显示 -->
                        <div v-if="item.paramType == 7 && item.definitionScopeModality" style="margin-left: 5px; margin-right: 5px">
                          <div v-if="item.definitionScopeModality == 1">
                            <div class="rx-range-div">X=<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                          </div>
                          <div v-if="item.definitionScopeModality == 2">
                            <div class="rx-range-div">X＞<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                          </div>
                          <div v-if="item.definitionScopeModality == 3">
                            <div class="rx-range-div">X≥<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                          </div>
                          <div v-if="item.definitionScopeModality == 4">
                            <div class="rx-range-div">X＜<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                          </div>
                          <div v-if="item.definitionScopeModality == 5">
                            <div class="rx-range-div">X≤<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                          </div>
                          <div v-if="item.definitionScopeModality == 6">
                            <div class="rx-range-div">
                              <span v-html="getRangeStr(item.definitionScope, 'left')"></span>＜X＜<span v-html="getRangeStr(item.definitionScope, 'right')"></span>
                            </div>
                          </div>
                          <div v-if="item.definitionScopeModality == 7">
                            <div class="rx-range-div">
                              <span v-html="getRangeStr(item.definitionScope, 'left')"></span>≤X＜<span v-html="getRangeStr(item.definitionScope, 'right')"></span>
                            </div>
                          </div>
                          <div v-if="item.definitionScopeModality == 8">
                            <div class="rx-range-div">
                              <span v-html="getRangeStr(item.definitionScope, 'left')"></span>＜X≤<span v-html="getRangeStr(item.definitionScope, 'right')"></span>
                            </div>
                          </div>
                          <div v-if="item.definitionScopeModality == 9">
                            <div class="rx-range-div">
                              <span v-html="getRangeStr(item.definitionScope, 'left')"></span>≤X≤<span v-html="getRangeStr(item.definitionScope, 'right')"></span>
                            </div>
                          </div>
                        </div>
                        <!--知识图标显示 -->
                        <div class="rx-knowledge-wrap" v-if="item.paramType == 7 && item.knowledgeDefinition">
                          <a-tooltip :title="item.knowledgeDefinition" placement="top">
                            <EpcIcon class="infoFilled-ico" type="icon-xiangqingon" :style="{ fontSize: '18px' }" />
                          </a-tooltip>
                        </div>
                      </div>
                      <!--分割线-->
                      <div class="block-layout" @dblclick="updateFormMsg(item)" v-if="item.paramType == 11">
                        <a-divider style="width: 98%; margin: 10px 0 0 0" />
                      </div>
                      <!--标题 -->
                      <div class="block-layout" @dblclick="updateFormMsg(item)" v-if="item.paramType == 8">
                        <!--标题行 -->
                        <a-form-item :label="item.elementParamName" style="font-weight: 700; height: 32px; line-height: 32px; overflow: hidden"> &nbsp; </a-form-item>
                      </div>
                      <!-- 文本域 -->
                      <div class="block-layout" @dblclick="updateFormMsg(item)" v-if="item.paramType == 1">
                        <!--文本域 -->
                        <a-form-item :label="item.elementParamName + '：'">
                          <a-textarea
                            v-model:value="item.defaultValue"
                            v-if="item.inputOuputProperties == 'IN'"
                            placeholder=""
                            style="width: 560px; float: left; padding-left: 10px" />
                          <a-textarea
                            v-model:value="item.defaultValue"
                            v-else
                            placeholder=""
                            style="width: 560px; float: left; background-color: #f3f3f3; padding-left: 10px"
                            disabled />
                        </a-form-item>
                      </div>
                      <!-- 计算按钮 -->
                      <div class="block-layout" @dblclick="updateFormMsg(item)" v-if="item.paramType == 2">
                        <!--计算校核按钮 -->
                        <a-form-item :style="'margin-left:' + item.leftMargin + 'px;'">
                          <a-button type="primary" class="btnStyPage2" style="margin-left: 5px" v-if="item.buttonName != ''">{{ item.buttonName }}</a-button>
                          <a-button type="primary" class="btnStyPage2" style="margin-left: 5px" v-else>计算</a-button>
                        </a-form-item>
                      </div>
                      <!-- 表格配置 -->
                      <div class="block-layout" style="text-align: left" v-if="item.type == '2'">
                        <!--标题行 -->
                        <div @dblclick="updateTableMainMsg(item)">
                          <a-form-item class="formitem" :label="item.tableMap.tableName" inline :key="index">
                            <a v-if="item.tableMap.tableBtnMess != null && item.tableMap.tableBtnMess.indexOf('计算') != -1">计算</a>
                            <a v-if="item.tableMap.tableBtnMess != null && item.tableMap.tableBtnMess.indexOf('刷新') != -1">刷新</a>
                            <a v-if="item.tableMap.tableBtnMess != null && item.tableMap.tableBtnMess.indexOf('添加行') != -1">添加行</a>
                            <a v-if="item.tableMap.tableBtnMess != null && item.tableMap.tableBtnMess.indexOf('删除行') != -1">删除行</a>
                          </a-form-item>
                        </div>
                        <!--表格内容 -->
                        <div class="workList" :style="'width:' + item.tableMap.tableTotalWidth + 'px;height:' + item.tableMap.tableTotalHeight + 'px;margin-top: -50px;'">
                          <div class="settingTableWrap" :style="getWidthStyle(item.tableMap.colList)">
                            <div class="settingTitleTable" style="display: flex">
                              <div
                                class="titleTableItem"
                                :class="index == item.tableMap.colList.length - 1 ? 'titleTableItemLast' : 'titleTableItem' + index"
                                v-for="(itemcol, index) in item.tableMap.colList"
                                :key="index"
                                :style="{ width: itemcol.colWidth + 'px' }"
                                @dblclick="changeTabelTitle(itemcol, index, item)">
                                {{ itemcol.colName }}
                              </div>
                            </div>
                            <!-- 表格 -->
                            <div>
                              <vxe-table
                                border
                                :show-header="false"
                                v-show="item.tableMap.tableType == 1 || item.tableMap.tableType == 3 || item.tableMap.tableType == 4 || item.tableMap.tableType == 5"
                                @checkbox-change="checkboxChange"
                                @checkbox-all="checkboxChange"
                                @cell-dblclick="dblclick"
                                :edit-config="{ trigger: dblclick }"
                                :checkbox-config="{
                                  labelField: '',
                                  trigger: 'row',
                                  reserve: true,
                                  range: true,
                                }"
                                size="small"
                                :sort-config="{
                                  trigger: 'cell',
                                  showIcon: false,
                                }"
                                :data="item.tableMap.rowData"
                                ref="vxeTable1"
                                class="vxeTable">
                                <vxe-column
                                  v-for="(itemcol2, index2) in item.tableMap.colDataMap"
                                  :key="index2"
                                  sortable
                                  align="center"
                                  :field="'firstCol' + index2"
                                  :title="itemcol2.colName"
                                  :width="itemcol2.width">
                                  <template v-slot="scope">
                                    <div v-if="item.tableMap.firstColType == '序号' && index2 == 0" :key="'firstCol' + index2">
                                      <div
                                        class="celllist"
                                        v-if="scope.row.moduleCateId != undefined && scope.row.moduleCateId != null && scope.row.moduleCateId != ''"
                                        style="text-align: center; cursor: pointer; background-color: #19be6b; height: 32px"
                                        @dblclick="changeModuleRowInfo(scope.row.id, scope.row.moduleCateId, scope.row.moduleCateName, item.tableStyle)">
                                        {{ scope.seq }}
                                      </div>
                                      <div
                                        class="btnWrap"
                                        v-else
                                        style="text-align: center; cursor: pointer"
                                        @dblclick="changeModuleRowInfo(scope.row.id, scope.row.moduleCateId, scope.row.moduleCateName, item.tableStyle)">
                                        {{ scope.seq }}
                                      </div>
                                    </div>
                                    <div v-if="item.tableMap.firstColType == '单选按钮' && index2 == 0" :key="'firstCol' + index2">
                                      <div
                                        class="btnWrap"
                                        v-if="scope.row.moduleCateId != null && scope.row.moduleCateId != ''"
                                        style="text-align: center; cursor: pointer; background-color: #19be6b; height: 32px"
                                        @dblclick="changeModuleRowInfo(scope.row.id, scope.row.moduleCateId, scope.row.moduleCateName, item.tableStyle)">
                                        <input type="radio" :id="item.tableId + '_' + scope.row.id" :name="itemcol2.id" />&nbsp;
                                      </div>
                                      <div
                                        class="btnWrap"
                                        v-else
                                        style="text-align: center; cursor: pointer"
                                        @dblclick="changeModuleRowInfo(scope.row.id, scope.row.moduleCateId, scope.row.moduleCateName, item.tableStyle)">
                                        <input type="radio" :id="item.tableId + '_' + scope.row.id" :name="itemcol2.id" />
                                      </div>
                                    </div>
                                    <div v-if="item.tableMap.firstColType == '复选框' && index2 == 0" :key="'firstCol' + index2">
                                      <div
                                        class="btnWrap"
                                        style="text-align: center; cursor: pointer"
                                        @dblclick="changeModuleRowInfo(scope.row.id, scope.row.moduleCateId, scope.row.moduleCateName, item.tableStyle)">
                                        <input type="checkbox" :id="item.tableId + '_' + scope.row.id" :name="itemcol2.id" />
                                      </div>
                                    </div>
                                    <div
                                      v-if="
                                        (item.tableMap.firstColType != '序号' && item.tableMap.firstColType != '单选按钮' && item.tableMap.firstColType != '复选框') || index2 != 0
                                      "
                                      :key="'col' + index2">
                                      <div>
                                        <div
                                          class="celllist btnWrapCurrent"
                                          v-if="scope.row[itemcol2.key] == 1"
                                          @dblclick="changeTabelInfo(itemcol2.id, scope.row.id, scope.row[itemcol2.key], item.tableType, scope.row, '')">
                                          已设置
                                        </div>
                                        <div
                                          class="celllist"
                                          style="text-align: center; cursor: pointer"
                                          v-else
                                          @dblclick="changeTabelInfo(itemcol2.id, scope.row.id, scope.row[itemcol2.key], item.tableType, scope.row, itemcol2.key)">
                                          &nbsp;
                                        </div>
                                      </div>
                                    </div>
                                  </template>
                                </vxe-column>
                              </vxe-table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-form>
                </div>
                <div class="imgWrap" v-if="parameterImgList && parameterImgList.length > 0">
                  <a-image
                    v-for="(item, index) in parameterImgList"
                    :key="index"
                    :src="item.filePath"
                    :preview="false"
                    :style="{ marginTop: item.distanceUp + 'px' }"
                    class="img" />
                </div>
              </a-card>
            </div>
          </a-col>
          <a-col :span="8">
            <a-card
              :style="'height: ' + leftTableHeight + 'px;margin-top: 0px;background-color: #ffffff;overflow-y:auto;overflow-x:none;margin-left:10px;'"
              class="cardList"
              v-if="updateInputStyle == '1' && pageType != '自定义类'">
              <div style="width: 100%; height: 100%">
                <div style="border-bottom: 1px solid #dcdee2; padding-bottom: 15px; margin-left: 15px">
                  &nbsp;&nbsp;&nbsp;&nbsp;参数类型:
                  <a-select v-model:value="propinfoType" class="w170" allow-clear style="margin-left: 40px" placeholder="请选择" @on-change="changeOneInput">
                    <a-select-option value="7">文本框</a-select-option>
                    <a-select-option value="2">计算按钮</a-select-option>
                    <a-select-option value="8">标题</a-select-option>
                    <a-select-option value="9">下拉值</a-select-option>
                    <a-select-option value="11">分割线</a-select-option>
                    <a-select-option value="1">文本域</a-select-option>
                    <a-select-option value="10">单选按钮</a-select-option>
                  </a-select>
                </div>

                <div>
                  <a-collapse class="custom-collapse" v-model:activeKey="value2" :bordered="false">
                    <a-collapse-panel key="1" header="基本信息">
                      <div v-if="propinfoType != '11' && propinfoType != '8' && propinfoType != '2'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;关联参数:
                        <a-input v-model:value="propinfoName" class="w170" allow-clear style="margin-left: 40px" placeholder="请选择" disabled="true"></a-input>
                        <a-button type="primary" style="margin-left: 10px" @click="chooseParameter(0)"><EpcIcon type="icon-liulan" style="font-size: 15px" />浏览</a-button>
                      </div>
                      <div v-if="propinfoType == '2'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;按钮名称:
                        <a-input v-model:value="propTitleName" class="w170" allow-clear style="margin-left: 40px" placeholder="请输入" @on-change="changeOneInput"></a-input>
                      </div>
                      <div v-if="propinfoType != '2'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;参数名称:
                        <a-input v-model:value="propTitleName" class="w170" allow-clear style="margin-left: 40px" placeholder="请输入" @on-change="changeOneInput"></a-input>
                      </div>
                      <div v-if="propinfoType != '11' && propinfoType != '8' && propinfoType != '2'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;默认值:
                        <a-input v-model:value="defaultValue" class="w170" allow-clear style="margin-left: 55px" placeholder="请输入" @on-change="changeOneInput"></a-input>
                      </div>
                      <div v-if="propinfoType == '7' || propinfoType == '1'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;输入输出:
                        <a-select v-model:value="inputOrOutput" class="w170" allow-clear placeholder="请选择" style="margin-left: 40px" @on-change="changeOneInput">
                          <a-select-option value="0">输入</a-select-option>
                          <a-select-option value="1">输出</a-select-option>
                        </a-select>
                      </div>
                      <div v-if="propinfoType == '7'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;Sheet编号:
                        <a-input v-model:value="inputValFromTable" class="w170" allow-clear style="margin-left: 30px" placeholder="请输入" @on-change="changeOneInput"></a-input>
                      </div>
                      <div v-if="propinfoType == '7'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;单元格编号:
                        <a-input v-model:value="cellsValFromTable" class="w170" allow-clear style="margin-left: 25px" placeholder="请输入" @on-change="changeOneInput"></a-input>
                      </div>
                      <div v-if="propinfoType == '7' && inputOrOutput == '1'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;同步数据按钮:
                        <a-select v-model:value="synchronizeDataBtn" class="w170" allow-clear style="margin-left: 10px" placeholder="请选择" @on-change="changeOneInput">
                          <a-select-option value="0">无</a-select-option>
                          <a-select-option value="1">有</a-select-option>
                        </a-select>
                      </div>
                      <div v-if="propinfoType != '11' && propinfoType != '2'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;是否加粗:
                        <a-select v-model:value="ifBold" class="w170" allow-clear placeholder="请选择" style="margin-left: 40px" @on-change="changeOneInput">
                          <a-select-option value="0">否</a-select-option>
                          <a-select-option value="1">是</a-select-option>
                        </a-select>
                      </div>
                    </a-collapse-panel>
                    <a-collapse-panel key="2" v-if="propinfoType == '9' || propinfoType == '10'">
                      <template #header>
                        <div class="custom-header">
                          <span v-if="propinfoType == '9'">下拉属性定义</span>
                          <span v-else>单选按钮属性定义</span>
                        </div>
                      </template>
                      <div v-if="propinfoType == '9' || propinfoType == '10'" style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;序列值配置:
                        <div style="margin-left: 15px; margin-top: 10px">
                          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px">
                            <div v-for="(item, index) in inputList" :key="index" style="margin-bottom: 10px; display: block">
                              <a-input v-model:value="item.label" class="w170" allow-clear placeholder="请输入" style="width: 110px" @change="changeOneInput"></a-input>
                              <a-button type="primary" size="small" @click="addInputItem" style="margin-left: 5px">+</a-button>
                              <a-button type="default" size="small" @click="removeInputItem(index)" v-if="inputList.length > 1" style="margin-left: 5px">-</a-button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a-collapse-panel>
                    <a-collapse-panel key="3" v-if="propinfoType != '11' && propinfoType != '2'" header="知识定义">
                      <div style="padding-bottom: 15px">
                        <a-textarea
                          v-model:value="propinfoKnowledge"
                          class="w170"
                          allow-clear
                          placeholder="请输入"
                          style="margin-left: 10px; width: 350px"
                          @on-change="changeOneInput">
                        </a-textarea>
                      </div>
                    </a-collapse-panel>
                    <a-collapse-panel key="5" v-if="propinfoType == '7'" header="取值范围定义">
                      <div style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;取值范围类型:
                        <a-select v-model:value="rangeType" class="w170" placeholder="请选择" allow-clear style="margin-left: 10px" @on-change="changeOneInput">
                          <a-select-option value="2">警告性范围</a-select-option>
                          <a-select-option value="1">强制性范围</a-select-option>
                          <a-select-option value=""></a-select-option>
                        </a-select>
                      </div>
                      <div style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;范围形式:
                        <a-select v-model:value="rangeStyle" class="w170" allow-clear placeholder="请选择" style="margin-left: 38px" @on-change="changeOneInput">
                          <a-select-option value="1">=</a-select-option>
                          <a-select-option value="2">＞</a-select-option>
                          <a-select-option value="3">≥</a-select-option>
                          <a-select-option value="4">＜</a-select-option>
                          <a-select-option value="5">≤<</a-select-option>
                          <a-select-option value="6">＜;＜</a-select-option>
                          <a-select-option value="7">≤;＜</a-select-option>
                          <a-select-option value="8">＜;≤</a-select-option>
                          <a-select-option value="9">≤;≤</a-select-option>
                          <a-select-option value=""></a-select-option>
                        </a-select>
                      </div>
                      <div style="padding-bottom: 15px">
                        &nbsp;&nbsp;&nbsp;&nbsp;范围定义:
                        <span v-if="rangeStyle != 4 && rangeStyle != 5">
                          <a-input v-model:value="rangeLeftStr" class="w170" allow-clear placeholder="请输入" style="margin-left: 35px" @on-change="changeOneInput"></a-input>
                        </span>
                        <div v-if="rangeStyle != 1 && rangeStyle != 2 && rangeStyle != 3" style="margin-top: 10px">
                          <a-input v-model:value="rangeRightStr" class="w170" allow-clear placeholder="请输入" style="margin-left: 115px" @on-change="changeOneInput"></a-input>
                        </div>
                      </div>
                    </a-collapse-panel>
                  </a-collapse>
                  <a-button type="primary" style="margin-left: 10px" @click="addInputChildForm"> <EpcIcon type="icon-baocun" style="font-size: 15px" />保存 </a-button>
                </div>
              </div>
            </a-card>
            <a-card
              :style="'height: ' + leftTableHeight + 'px;margin-top: 0px;background-color: #ffffff;overflow-y:auto;overflow-x:none;margin-left:10px;'"
              class="cardList"
              v-if="updateInputStyle == '3' && pageType != '自定义类'">
              <div style="width: 100%; height: 100%">
                <div style="margin-left: 15px">
                  &nbsp;&nbsp;&nbsp;&nbsp;列名称:
                  <a-input v-model:value="tableColsName" class="w170" allow-clear style="margin-left: 40px" placeholder="请输入" @on-change="changeTableOneInput"> </a-input>
                </div>
                <div style="margin-left: 15px" v-if="tableColsType == 2 || tableColsType == 3">
                  &nbsp;&nbsp;&nbsp;&nbsp;列编号:
                  <a-input v-model:value="tableColsId" class="w170" allow-clear style="margin-left: 40px" placeholder="请输入" @on-change="changeTableOneInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;关联参数:
                  <a-input v-model:value="tableParameterName" class="w170" allow-clear style="margin-left: 25px" :disabled="true" placeholder="请浏览选择参数编号"> </a-input>
                  <a-button type="primary" style="margin-left: 10px" @click="chooseParameter(3)"><EpcIcon type="icon-liulan" style="font-size: 15px" />浏览</a-button>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;列宽:
                  <a-input v-model:value="tableColsWidth" class="w170" allow-clear style="margin-left: 51px" placeholder="请输入" @on-change="changeTableOneInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;是否显示:
                  <a-select v-model:value="tableColsIfShow" class="w170" allow-clear placeholder="请选择" style="margin-left: 23px" @on-change="changeTableOneInput">
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                  </a-select>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;文本类型:
                  <a-select v-model:value="tableColsInputType" class="w170" allow-clear placeholder="请选择" style="margin-left: 23px" @on-change="changeTableOneInput">
                    <a-select-option value="文本框">文本框</a-select-option>
                    <a-select-option value="下拉值" v-if="tableInfoType != '接口汇总表格'">下拉值</a-select-option>
                    <a-select-option value="附件链接" v-if="tableInfoType != '模型同步表格' && tableInfoType != '接口汇总表格'">附件链接</a-select-option>
                  </a-select>
                </div>
                <div style="margin-left: 15px; margin-top: 20px" v-if="tableColsInputType == '下拉值'">
                  &nbsp;&nbsp;&nbsp;&nbsp;下拉属性:
                  <div style="margin-left: 15px; margin-top: 10px">
                    <!-- 使用 Flex 容器包裹所有下拉项 -->
                    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px">
                      <div v-for="(item, index) in tableColsSelectStr" :key="index" style="display: flex; align-items: center">
                        <a-input v-model:value="item.label" class="w170" allow-clear placeholder="请输入" style="width: 110px" @change="changeTableOneInput"></a-input>
                        <div style="display: flex; margin-left: 5px">
                          <a-button type="primary" size="small" @click="addSelectColParms" style="margin-right: 5px">+</a-button>
                          <a-button type="default" size="small" @click="delSelectColParms(index)" v-if="tableColsSelectStr.length > 1">-</a-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="margin-left: 15px; margin-top: 20px" v-if="(tableColsType == 2 || tableColsType == 3) && tableColsInputType == '文本框'">
                  &nbsp;&nbsp;&nbsp;&nbsp;数据分类:
                  <a-select v-model:value="colsParaType" class="w170" allow-clear placeholder="请选择" style="margin-left: 23px" @on-change="changeTableOneInput">
                    <a-select-option value="自定义值">自定义值</a-select-option>
                    <a-select-option value="模块库读取值">模块库读取值</a-select-option>
                    <a-select-option value="计算值">计算值</a-select-option>
                  </a-select>
                </div>
                <div style="margin-left: 15px; margin-top: 20px" v-if="(tableColsType == 2 || tableColsType == 3) && colsParaType == '计算值'">
                  &nbsp;&nbsp;&nbsp;&nbsp;计算值:
                  <a-textarea v-model:value="colsFormulaStr" class="w170" allow-clear placeholder="请输入" style="margin-left: 38px" @on-change="changeTableOneInput"> </a-textarea>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;默认值:
                  <a-input v-model:value="colsDefaultVal" class="w170" allow-clear style="margin-left: 36px" placeholder="请输入默认值" @on-change="changeTableOneInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;函数类型:
                  <a-select v-model:value="colsFunctionType" class="w170" allow-clear placeholder="请选择" style="margin-left: 23px" @on-change="changeTableOneInput">
                    <a-select-option value="click">click</a-select-option>
                    <a-select-option value="change">change</a-select-option>
                  </a-select>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;函数名称:
                  <a-input v-model:value="colsFunctionName" class="w170" allow-clear style="margin-left: 23px" placeholder="请输入函数名称" @on-change="changeTableOneInput">
                  </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px" v-if="tableColsType == 4 || tableColsType == 5">
                  &nbsp;&nbsp;&nbsp;&nbsp;是否可编辑:
                  <a-select v-model:value="colsIsEdit" class="w170" allow-clear placeholder="请选择" style="margin-left: 10px" @on-change="changeTableOneInput">
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                  </a-select>
                </div>
              </div>
              <a-button type="primary" style="margin-left: 30px; margin-top: 30px" @click="addTableColsForm">
                <EpcIcon type="icon-baocun" style="font-size: 15px" />
                保存
              </a-button>
              <a-button v-if="tableColsIndex != 0 || tableColsType == 4 || tableColsType == 5" type="danger" style="margin-left: 30px; margin-top: 30px" @click="delTableCols">
                <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                删除本列
              </a-button>
            </a-card>

            <a-card
              :style="'height: ' + leftTableHeight + 'px;margin-top: 0px;background-color: #ffffff;overflow-y:auto;overflow-x:none;margin-left:10px;'"
              class="cardList"
              v-if="updateInputStyle == '4' && pageType != '自定义类'">
              <div style="width: 100%; height: 100%">
                <div style="margin-left: 15px">
                  &nbsp;&nbsp;&nbsp;&nbsp;单元格编码:
                  <a-input v-model:value="cellParaNum" class="w170" allow-clear :disabled="true" style="margin-left: 10px" @on-change="changeTableOneInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;数据分类:
                  <a-select v-model:value="cellParaType" class="w170" allow-clear placeholder="请选择数据分类" style="margin-left: 23px" @on-change="changeTableValInput">
                    <a-select-option value="计算值">计算值</a-select-option>
                  </a-select>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;Sheet名称:
                  <a-input v-model:value="sheetNum" class="w170" allow-clear style="margin-left: 13px" placeholder="请输入Sheet名称" @on-change="changeTableValInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;单元格编号:
                  <a-input v-model:value="cellNum" class="w170" allow-clear style="margin-left: 9px" placeholder="请输入单元格编号" @on-change="changeTableValInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;默认值:
                  <a-input v-model:value="defaultValue" class="w170" allow-clear style="margin-left: 36px" placeholder="请输入默认值" @on-change="changeTableValInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;输入输出:
                  <a-select v-model:value="cellParamType" class="w170" allow-clear placeholder="请选择输入或输出" style="margin-left: 23px" @on-change="changeTableValInput">
                    <a-select-option value="0">输入</a-select-option>
                    <a-select-option value="1">输出</a-select-option>
                  </a-select>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;关联参数:
                  <a-input v-model:value="tableInfoParameterName" class="w170" allow-clear style="margin-left: 25px" :disabled="true" placeholder="请浏览选择参数编号"> </a-input>
                  <a-button type="primary" style="margin-left: 10px" @click="chooseParameter(12)"><EpcIcon type="icon-liulan" style="font-size: 15px" />浏览</a-button>
                </div>
                <div style="margin-left: 15px; margin-top: 20px" v-if="cellParaType == '计算值'">
                  &nbsp;&nbsp;&nbsp;&nbsp;计算值:
                  <a-textarea v-model:value="cellFormulaStr" class="w170" allow-clear placeholder="请输入计算值" style="margin-left: 38px" @on-change="changeTableValInput">
                  </a-textarea>
                </div>
              </div>
              <a-button type="primary" style="margin-left: 30px; margin-top: 30px" @click="addTableValForm"
                ><EpcIcon type="icon-baocun" style="font-size: 15px" />
                保存
              </a-button>
            </a-card>

            <a-card
              :style="'height: ' + leftTableHeight + 'px;margin-top: 0px;background-color: #ffffff;overflow-y:auto;overflow-x:none;margin-left:10px;'"
              class="cardList"
              v-if="updateInputStyle == '5' && pageType != '自定义类'">
              <div style="width: 100%; height: 100%">
                <div style="margin-left: 15px">
                  &nbsp;&nbsp;&nbsp;&nbsp;表格类型:
                  <a-input v-model:value="tableInfoType" class="w170" allow-clear :disabled="true" style="margin-left: 23px" @on-change="changeTableMainInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;表格标题:
                  <a-input v-model:value="tableTitleName" class="w170" allow-clear style="margin-left: 23px" @on-change="changeTableMainInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;表格行数:
                  <a-input v-model:value="tableRowsNum" class="w170" allow-clear style="margin-left: 23px" @on-change="changeTableMainInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;表格列数:
                  <a-input v-model:value="tableColsNum" class="w170" allow-clear style="margin-left: 23px" @on-change="changeTableMainInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;表格总宽度:
                  <a-input v-model:value="tableSumWidth" class="w170" allow-clear style="margin-left: 9px" @on-change="changeTableMainInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;表格总高度:
                  <a-input v-model:value="tableSumHeight" class="w170" allow-clear style="margin-left: 9px" @on-change="changeTableMainInput"> </a-input>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;表格编号:
                  <a-input
                    v-model:value="tableInfoNum"
                    class="w170"
                    allow-clear
                    style="margin-left: 25px"
                    :disabled="true"
                    placeholder="请浏览选择表格编号"
                    @on-change="changeTableMainInput">
                  </a-input>
                  <a-button type="primary" style="margin-left: 10px" @click="chooseParameter(7)"><EpcIcon type="icon-liulan" style="font-size: 15px" />浏览</a-button>
                </div>
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;首列定义:
                  <a-select v-model:value="firstColType" class="w170" allow-clear placeholder="请选择" style="margin-left: 23px" @on-change="changeTableValInput">
                    <a-select-option value="序号">序号</a-select-option>
                    <a-select-option value="单选按钮">单选按钮</a-select-option>
                    <a-select-option value="自定义">自定义</a-select-option>
                  </a-select>
                </div>

                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;是否隐藏:
                  <a-select v-model:value="preference" class="w170" allow-clear placeholder="请选择" style="margin-left: 23px" @on-change="changeTableValInput">
                    <a-select-option value="1">显示</a-select-option>
                    <a-select-option value="0">隐藏</a-select-option>
                  </a-select>
                </div>
              </div>
              <a-button type="primary" style="margin-left: 30px; margin-top: 30px" @click="updateTableMainForm">
                <EpcIcon type="icon-baocun" style="font-size: 15px" />
                保存
              </a-button>
            </a-card>
            <a-card
              :style="'height: ' + leftTableHeight + 'px;margin-top: 0px;background-color: #ffffff;overflow-y:auto;overflow-x:none;margin-left:10px;'"
              class="cardList"
              v-if="pageType == '自定义类'">
              <div style="width: 100%; height: 100%">
                <div style="margin-left: 15px; margin-top: 20px">
                  &nbsp;&nbsp;&nbsp;&nbsp;关联页面:
                  <a-input v-model:value="customPageUrlStr" class="w170" allow-clear style="margin-left: 23px"> </a-input>
                </div>
              </div>
              <a-button type="primary" style="margin-left: 30px; margin-top: 30px" @click="saveCustomPageURL">
                <EpcIcon type="icon-baocun" style="font-size: 15px" />
                保存
              </a-button>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane key="2" tab="图片区配置" v-if="pageType != '自定义类'">
        <div>
          <a-button type="primary" @click="uploadPicture"><EpcIcon type="icon-shangchuanwenjian" style="font-size: 15px" />上传图片</a-button>
        </div>
        <div style="margin-top: 20px">
          <a-table
            :scroll="{ x: 1200 }"
            :row-key="(record: any) => record.id"
            :columns="pictureColumns"
            :data-source="pictureList"
            @resizeColumn="handleResizeColumn"
            :locale="locale"
            :sticky="true"
            :pagination="false"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <!-- 操作列：编辑/删除 等，阻止事件冒泡 -->
              <template v-if="column.dataIndex === 'operation'">
                <div style="display: flex; gap: 8px; align-items: center">
                  <a @click.stop.prevent="updatePictureInfo(record)">{{ $t('编辑') }}</a>
                  <!-- <a-divider type="vertical" /> -->
                  <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="deletePictureInfo(record)">
                    <a @click.stop style="color: #ff4d4f; cursor: pointer">{{ $t('删除') }}</a>
                  </a-popconfirm>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key="3" tab="基本信息">
        <dev>
          <a-form :model="formInline" label-width="150">
            <a-row>
              <a-form-item label="页面类型：" class="elformitem">
                <a-input v-model:value="formInline.pageType" style="margin-left: 27px; width: 220px" :disabled="true" />
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item label="页面名称：" class="elformitem">
                <a-input v-model:value="formInline.pageName" style="margin-left: 27px; width: 220px" allow-clear />
              </a-form-item>
            </a-row>
            <a-row v-if="pageType != '自定义类'" style="display: none">
              <a-form-item label="页面初始化方法：" class="elformitem">
                <a-input v-model:value="formInline.initCallMethod" allow-clear />
              </a-form-item>
            </a-row>
            <a-row v-if="pageType != '自定义类'">
              <a-form-item label="工作区宽度：" class="elformitem">
                <a-input v-model:value="formInline.workPageWidth" style="margin-left: 13px; width: 220px" allow-clear />
              </a-form-item>
            </a-row>
            <a-row v-if="pageType != '自定义类'">
              <a-form-item label="图片输出信息：" class="elformitem">
                <a-input v-model:value="formInline.pageImgStr" style="width: 220px" allow-clear />
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item label="备注：">
                <a-textarea v-model:value="formInline.remark" style="margin-left: 57px; width: 220px" allow-clear />
              </a-form-item>
            </a-row>

            <a-button type="primary" @click="saveOrUpdatePageInfo"> <EpcIcon type="icon-baocun" style="font-size: 15px" />保存</a-button>
          </a-form>
        </dev>
      </a-tab-pane>
    </a-tabs>
  </div>
  <ParameterGeneral ref="ParameterGeneralRef" :modalVisible="ParameterGeneralVisible" @onClose="ParameterGeneralVisible = false" @handleSave="handleSave"></ParameterGeneral>

  <a-modal
    v-model:visible="isOutput"
    style="width: 700px; height: 500px; overflow-y: auto"
    :style="{ top: '10%' }"
    :title="$t('添加')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="okOutput"
    @cancel="isOutput = false">
    <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
      <a-row>
        <a-form-item :label="$t('表格名称')" prop="tableName">
          <a-input v-model:value="ruleForm.tableName" placeholder="请输入表格名称" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item :label="$t('表格类型')" prop="tableName" style="margin-left: 20px">
          <a-select v-model:value="ruleForm.tableType" placeholder="请选择" allow-clear style="width: 200px">
            <a-select-option value="4">handsontable固定行列表格</a-select-option>
          </a-select>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item :label="$t('固定行数')" prop="rowNums">
          <a-input v-model:value="ruleForm.rowNums" allow-clear placeholder="请输入固定行数" style="width: 200px" />
        </a-form-item>
        <a-form-item :label="$t('列数')" style="margin-left: 50px" prop="colNums">
          <a-input v-model:value="ruleForm.colNums" allow-clear placeholder="请输入列数" style="width: 200px" />
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item :label="$t('表格编号')" style="margin-left: 10px">
          <a-input v-model:value="ruleForm.parameterNum" allow-clear disabled placeholder="请浏览选择表格编号" style="width: 200px" />
        </a-form-item>
        <a-button type="primary" style="margin-left: 10px" @click="selectParameter(8)"><EpcIcon type="icon-liulan" style="font-size: 15px" />浏览</a-button>
      </a-row>
    </a-form>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="okOutput()"> 确定 </a-button>
        <a-button @click="isOutput = false">取消</a-button>
      </span>
    </template>
  </a-modal>

  <a-modal
    v-model:visible="uploadPictureModal"
    style="width: 700px; height: 500px; overflow-y: auto"
    :style="{ top: '10%' }"
    :title="$t('上传图片')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="okUploadInfo"
    @cancel="uploadPictureModal = false">
    <a-form>
      <a-row>
        <a-form-item :label="$t('示意图宽度')">
          <a-input v-model:value="imgWidth" placeholder="请输入示意图宽度" allow-clear style="width: 200px" />
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item :label="$t('与上方距离')">
          <a-input v-model:value="marginTop" allow-clear placeholder="请输入与上方距离" style="width: 200px" />
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item :label="$t('请选择附件')">
          <UploadImg style="color: red" :fileList="fileList" @change="datafilechange" @customRequest="datacustomRequest" />
        </a-form-item>
      </a-row>
    </a-form>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="okUploadInfo()"> 确定 </a-button>
        <a-button @click="uploadPictureModal = false">取消</a-button>
      </span>
    </template>
  </a-modal>

  <!--布局管理-->
  <a-modal
    v-model:visible="layoutManageDialogVisible"
    :width="700"
    :style="{ top: '10%' }"
    :title="$t('布局管理')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @cancel="layoutManageDialogVisible = false">
    <a-table
      :row-key="(record: any) => record.id"
      :columns="columns"
      :data-source="parameterTempList"
      @resizeColumn="handleResizeColumn"
      :pagination="false"
      :sticky="true"
      style="height: 500px; overflow-y: auto"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <!-- 操作列：编辑/删除 等，阻止事件冒泡 -->
        <template v-if="column.dataIndex === 'paramType'">
          <div style="display: flex; gap: 8px; align-items: center">
            <span v-html="getParamType(record)"></span>
          </div>
        </template>

        <template v-if="column.dataIndex === 'parameterName'">
          <div style="display: flex; gap: 8px; align-items: center">
            <span v-html="getParamName(record)"></span>
          </div>
        </template>

        <template v-if="column.dataIndex === 'operation'">
          <div style="display: flex; gap: 8px; align-items: center">
            <a @click.stop.prevent="moveParam(record, 1)">{{ $t('上移') }}</a>
            <a @click.stop.prevent="moveParam(record, 2)">{{ $t('下移') }}</a>

            <!-- <a-divider type="vertical" /> -->
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="deleteParam(record)">
              <a @click.stop style="color: #ff4d4f; cursor: pointer">{{ $t('删除') }}</a>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="layoutManageDialogVisible = false"> <EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
      </span>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
@import '../../../../../sheets/collapse.less';
.rx-range-div {
  width: 80px;
  height: 30px;
  color: #515a6e;
  line-height: 30px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  background-color: #f3f3f3;
  margin-top: 5px;
  border-radius: 4px;
}
:deep(.ant-form div.divList) {
  display: block;
  overflow: hidden;
  clear: both;
}
.cardWrap {
  :deep(.ant-card-body) {
    display: flex;
  }

  :deep(.module-body) {
    padding: 0 0px 10px 0px;
    min-height: auto !important;
  }

  .formWrap {
    min-width: 75%;
    overflow: auto;
    padding-bottom: 30px;
    :deep(.ant-form-vertical) {
      display: flex;
      flex-wrap: wrap;
      .divList {
        margin-top: 10px;
        overflow: inherit;
        // width: 100%;
      }
      .divListBlock {
        width: 100%;
      }
      .divListLine {
        width: 368px;
      }
    }
  }
}
.imgWrap {
  margin-left: 2%;
  width: 100%;
  border-left: 1px dotted #ddd;
  padding-left: 10px;
  overflow: hidden;
  .img {
    border: 1px solid #f0f0f0;
    width: 100%;
    display: block;
    border-radius: 5px;
  }
}

.item-wrap {
  text-align: left;
  display: flex;
  align-items: center;
  .rx-knowledge-wrap {
    margin-top: 8px;
  }
}

.celllist {
  text-align: center;
}

.btnWrapCurrent {
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  background-color: #19be6b;
  height: 22px;
  line-height: 22px;
  color: #fff;
  width: 60px;
  margin: 0 auto;
  border-radius: 10px;
}

.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
.imgList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 3px;
  background-color: #ffffff;
  width: auto;
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.imgBox {
  width: 231px;
  height: 210px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #eaeaf1;
  margin-left: 16px;
  cursor: pointer;
  margin-bottom: 16px;
}
.imgBox:hover {
  border-color: rgb(13, 83, 226);
  box-shadow: 0 0 5px 2px rgba(13, 83, 226, 0.2);
}
.imgBox:hover .itemBoxTitle {
  color: #0d53e2;
}

.itemBox1 {
  width: 199px;
  height: 142px;
  border-radius: 4px 4px 4px 4px;
  margin: 16px 16px 10px 16px;
}
.itemBox1 img {
  border-radius: 4px 4px 4px 4px;
}

.itemBoxTitle {
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-left: 16px;
}

.workList {
  height: 100%;
  width: 100%;
}

.settingTableWrap {
  width: 100%;
  overflow-x: auto;
}

.settingTitleTable {
  height: 32px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-bottom: none;
}

.titleTableItem {
  cursor: pointer;
  border-right: 1px solid #ccc;
  text-align: center;
  line-height: 32px;
}

.titleTableItemLast {
  border-right: 0 !important;
}

.itemInfo {
  word-wrap: break-word;
  word-break: break-all;
}
.selectLeft {
  width: 100%;
  height: 8%;
  padding-top: 10px;
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
.cardList {
  :deep(.ant-card-body) {
    padding: 16px 0;
  }
  margin-top: 0px;
  margin-left: 20px;
  background-color: #ffffff;
  overflow-y: auto;
  overflow-x: none;
  .w170 {
    width: 230px;
  }
}
.radioStyle:not(:first-child) {
  margin-left: 30px;
}
.infoFilled-ico {
  color: #1971ff;
  font-size: 18px;
  cursor: pointer;
}
</style>
