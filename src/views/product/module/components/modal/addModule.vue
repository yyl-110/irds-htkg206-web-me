<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import { ref, computed, nextTick } from 'vue';
import { TableProps, Modal, Button, Popconfirm, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { WeiI18n } from '@/utils/WeiI18n';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { ModuleMenuAddRequestDTOModel } from '@/api/models/module/ModuleMenuAddRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { useUserStore } from '@/store/modules/user';
import UploadImg from '@/components/UploadImg/index.vue';
import { UploadFile } from '@/components/UploadFile';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { characterToList } from '@/utils/tools';
import dynamicForm from '../form/dynamicForm.vue';
import Empty from '@/components/Empty/index.vue';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
  modalInit: any;
}>();
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { marginTop: '10px' },
  }),
});
const userStore = useUserStore();
const modelType = ref<any>([
  { label: 'prt', value: 'prt' },
  { label: 'asm', value: 'asm' },
]);
const modelStateList = ref<any>([
  { label: '已发布', value: 0 },
  { label: '停用', value: 2 },
]);
const childrenList = ref<any>([]);
const projectList = ref<any>([]);
const Generalapplicability = ref<any>([
  { label: '通用模块', value: '通用模块' },
  { label: '专用模块', value: '专用模块' },
]);
const modeltypeList = ref<any>([
  { label: '标准模块', value: '标准模块' },
  { label: '基型模块', value: '基型模块' },
]);
const rankList = ref<any>([
  { label: '1级', value: '1级' },
  { label: '2级', value: '2级' },
  { label: '3级', value: '3级' },
  { label: '4级', value: '4级' },
  { label: '5级', value: '5级' },
]);
const rootList = ref<any>([]);

/** 表单样式 label对象 */
const variableComp = ref<any>(null);
const labelCol = ref({ style: { width: '120px' } });
const dynamicParm = ref<any[]>([]);
const uploadFileList = ref<any[]>([]);
const treeListGBOMList = ref<any>([]);
const keywords = ref<any>('');
const categoryid = ref<any>('');
const imgId = ref<string>('');
const picture2dURL = ref<string>('');
const radioEqunr = ref<string>('');
const picture3d = ref<string>('');
const loading = ref<boolean>(false);

/** 表单数据  */
const modelData = reactive<any>(new ModuleMenuAddRequestDTOModel());

/** 表单对象 */
const formRef = ref<FormInstance>();

/** 富文本对象 */
const ckeditorRef = ref();

/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
    nextTick(() => {
      if (formRef.value) {
        formRef.value!.resetFields();
      }
    });
  }
  setCkeditorData();
  return props.modalVisible;
});

/**
 * @description 设置编辑器内容
 */
function setCkeditorData() {
  if (ckeditorRef.value) {
    ckeditorRef.value.setData('');
  }
}

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}

// 获取平台
async function getChildrenListsApi(ids: any) {
  if (!ids) {
    return;
  }
  let data: any = {};
  data.ids = ids;
  const res = await AdminApiSystemModule.getChildrenLists(data);
  if (res.data.code == 0) {
    childrenList.value = res.data.data?.map(item => ({ label: item.name, value: item.id })) || [];
  } else {
    message.error(res.data.msg);
  }
}

//获取七大系列
async function getPlatformApi() {
  let data: any = {};
  data.userid = userStore.getUser.id;
  const res = await AdminApiSystemModule.getPlatform(data);
  if (res.data.code == 0) {
    rootList.value = res.data.data?.map(item => ({ label: item.name, value: item.id })) || [];
  } else {
    message.error(res.data.msg);
  }
}

//获取项目列表
async function syncProjectApi() {
  let data: any = {};
  data.keywords = keywords.value;
  const res = await AdminApiSystemModule.syncProject(data);
  if (res.data.code == 0) {
    let data: any = res.data.data;
    projectList.value =
      data?.map((item: any) => ({
        label: item.projectName,
        value: item.projectNumber,
      })) || [];
  } else {
    message.error(res.data.msg);
  }
}

//获取项目列表
async function getTreeListApi() {
  let data: any = {};
  const res = await AdminApiSystemModule.getTreeList(data);
  if (res.data.code == 0) {
    treeListGBOMList.value = res.data || [];
  } else {
    message.error(res.data.msg);
  }
}

const moduleParaList = ref([]);
// 仅列出专有属性（columnProperties === 0）
const specialProps = computed(() => (moduleParaList.value || []).filter((p: any) => Number(p.columnProperties) === 0));

function parseOptions(item: any) {
  if (!item || !item.selectMultipleValues) return [];
  return String(item.selectMultipleValues)
    .split(';')
    .map((s: string) => s.trim())
    .filter(Boolean);
}

//初始化数据
async function initColumnData(categoryidStr: any) {
  categoryid.value = categoryidStr;
  loading.value = true;
  try {
    let params: any = {};
    params.userId = userStore.getUser.id;
    params.categoryId = categoryidStr;
    const res = await AdminApiSystemModule.findModuleProperty(params);
    if (res.data.code == 0) {
      var moduleParaList = res.data.data.moduleParaList;
      let newList: any = [];
      for (let i = 0; i < moduleParaList.length; i++) {
        if (moduleParaList[i].columnProperties == 0) {
          newList.push({
            id: moduleParaList[i].id,
            name: 'rxLabel',
            labelName: moduleParaList[i].propertyName + '：',
            type: moduleParaList[i].ifSelectForm == undefined ? '0' : moduleParaList[i].ifSelectForm + '',
            modeTypeList: characterToList(moduleParaList[i].selectMultipleValues),
            typeKey: moduleParaList[i].modelInfoProp,
            modeTypeVal: moduleParaList[i].paraValue,
          });
        }
      }
      dynamicParm.value = newList;
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

// 添加
async function handleModalAdd(id: string, pdmType: string) {
  try {
    categoryid.value = id;
    loading.value = true;
    await getPlatformApi();
    await initColumnData(categoryid.value);
    syncProjectApi();
    getTreeListApi();

    modelData.id = '';
    modelData.categoryid = '';
    modelData.modelNumber = '';
    modelData.codeNum = '';
    modelData.modelName = '';
    modelData.modelType = '';
    modelData.para5 = '';
    modelData.para9 = '';
    modelData.para10 = '';
    modelData.para11 = '';
    modelData.para12 = '';
    modelData.para13 = '';
    modelData.para14 = '';
    modelData.creator = '';
    modelData.modelState = '';
    modelData.remarks = '';
    modelData.fileName = '';
    modelData.fileRemarks = '';
    // let list: any = dynamicParm.value;
    // let newList = [];
    // for (let i = 0; i < list.length; i++) {
    //   newList.push({
    //     id: list[i].id + Date.now(),
    //     name: 'rxLabel',
    //     labelName: list[i].labelName,
    //     type: list[i].type,
    //     modeTypeList: list[i].modeTypeList,
    //     typeKey: list[i].typeKey,
    //     modeTypeVal: '',
    //   });
    // }
    // dynamicParm.value = newList;
    filedataSource.value = [];
    imagedataSource.value = [];
    uploadFileList.value = [];
    modelData.para7 = [];
    modelData.para8 = [];
    modelData.para15 = modelData.para15 || '3级';
    modelData.para16 = modelData.para16 || '3级';
    modelData.para17 = modelData.para17 || '3级';
    modelData.para18 = modelData.para18 || '3级';
    modelData.para19 = modelData.para19 || '3级';
    modelData.para20 = modelData.para20 || '3级';
    modelData.modelEngName = pdmType;
    loading.value = false;
  } catch (error) {
    message.error(error);
    loading.value = false;
  }
}

// 编辑
async function handleModalUpdate(id: string, row: any) {
  loading.value = true;
  try {
    categoryid.value = id;
    imagedataSource.value = [];
    dynamicParm.value = [];
    imgId.value = '';
    picture2dURL.value = '';
    let params: any = {};
    params.userId = userStore.getUser.id;
    params.categoryId = id;
    params.id = row.id;
    const res = await AdminApiSystemModule.findModuleInfoDetailedById(params);
    const data: any = res.data.data || {};
    if (data.pictureList.length > 0) {
      data.pictureList.forEach((item: any) => {
        imagedataSource.value.push({
          documentName: item.oldFileName,
          id: item.id,
          picture2dURL: item.picture2dURL,
          createData: item.addtime,
        });
      });
    }
    filedataSource.value = data.attachmentList;
    imgId.value = data.picture2d;
    picture2dURL.value = data.picture2dURL;
    modelData.categoryid = data.moduleInfo.categoryId;
    modelData.createUser = data.moduleInfo.createUserName;
    modelData.id = data.moduleInfo.id;
    modelData.modelState = data.moduleInfo.status;
    modelData.modelNumber = data.moduleInfo.para1;
    modelData.codeNum = data.moduleInfo.para2;
    modelData.modelName = data.moduleInfo.para3;
    modelData.modelType = data.moduleInfo.para4;
    modelData.para5 = data.moduleInfo.para5;
    modelData.modelEngName = data.moduleInfo.para6;
    modelData.para9 = data.moduleInfo.para9;
    modelData.para10 = data.moduleInfo.para10 ? data.moduleInfo.para10 : '通用';
    modelData.para11 = data.moduleInfo.para11;
    modelData.para12 = data.moduleInfo.para12;
    modelData.para13 = data.moduleInfo.para13;
    modelData.para14 = data.moduleInfo.para14;
    modelData.para15 = data.moduleInfo.para15;
    modelData.para16 = data.moduleInfo.para16;
    modelData.para17 = data.moduleInfo.para17;
    modelData.para18 = data.moduleInfo.para18;
    modelData.para19 = data.moduleInfo.para19;
    modelData.para20 = data.moduleInfo.para20;
    const productLibrary = data.productLibrary || [];
    const productSeries = data.productSeries || [];
    if (productLibrary.length > 0) {
      var productLibraryids = productLibrary.map((item: any) => item.id);
    }
    if (productSeries.length > 0) {
      var productSeriesids = productSeries.map((item: any) => item.id);
    }
    modelData.para7 = productLibraryids;
    modelData.para8 = productSeriesids;
    radioEqunr.value = data.moduleInfo.para6;
    getPlatformApi();
    syncProjectApi();
    getTreeListApi();
    if (productLibraryids) {
      getChildrenListsApi(productLibraryids);
    }
    picture3d.value = data.picture3d;
    var moduleParaList = data.moduleParaList;
    for (let i = 0; i < moduleParaList.length; i++) {
      if (moduleParaList[i].columnProperties == 0) {
        dynamicParm.value.push({
          id: moduleParaList[i].id,
          name: 'rxLabel',
          labelName: moduleParaList[i].propertyName + '：',
          type: moduleParaList[i].ifSelectForm == undefined ? '0' : moduleParaList[i].ifSelectForm + '',
          modeTypeList: characterToList(moduleParaList[i].selectMultipleValues),
          typeKey: moduleParaList[i].modelInfoProp,
          modeTypeVal: moduleParaList[i].paraValue,
        });
      }
    }
    loading.value = false;
    nextTick(() => {
      if (ckeditorRef.value) {
        ckeditorRef.value.setData(data.moduleInfo.remark);
      }
    });
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

const selectedRowList = ref<any[]>([]);
const imagedataSource = ref<any[]>([]);
const filedataSource = ref<any[]>([]);
const imgColumns = ref([
  {
    title: '图片名称',
    key: 'documentName',
    dataIndex: 'documentName',
    align: 'left',
    resizable: true,
    minWidth: 200,
  },
  {
    title: '创建时间',
    key: 'createData',
    dataIndex: 'createData',
    align: 'center',
    resizable: true,
    minWidth: 200,
  },
]);
const FileColumns = ref([
  {
    title: '文件名称',
    key: 'documentName',
    dataIndex: 'documentName',
    align: 'left',
    minWidth: 200,
  },
  {
    title: '文件类型',
    key: 'fileType',
    dataIndex: 'fileType',
    align: 'left',
    minWidth: 100,
  },
  {
    title: '下载',
    key: 'operation',
    dataIndex: 'operation',
    align: 'center',
    width: 100,
  },
]);

// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag: boolean;
}

/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowList.value = selectedRows;
  },
};

// 图片上传-----------------
const fileList = ref<any>([]);
const pictureIdList = ref<any>([]);
const openImgUploadModal = ref<boolean>(false);

function openImgUpload() {
  fileList.value = [];
  openImgUploadModal.value = true;
}

function filechange(file: any) {
  fileList.value = [];
}

async function customRequest(options: any) {
  fileList.value.push({
    ...options,
    name: options?.documentName,
    status: 'done',
    url: options.fileUrl,
  });
}

// 图片保存
async function handleimgSave() {
  if (fileList.value[0] && fileList.value[0].id) {
    let data: any = {};
    data.newFileName = fileList.value[0].newFileName;
    data.documentName = fileList.value[0].documentName;
    data.fileId = fileList.value[0].id;
    data.userId = userStore.getUser.id;
    data.oldFileName = fileList.value[0].oldFileName;
    data.createName = fileList.value[0].createName;
    data.fileType = fileList.value[0].fileType;
    const res = await AdminApiSystemModule.saveSinglePicture(data);
    if (res.data.code == 0) {
      let data: any = res.data;
      pictureIdList.value.push({
        id: data.data.id,
      });
      imagedataSource.value.push({
        id: data.data.id,
        delIndex: fileList.value.length,
        documentName: fileList.value[0].documentName,
        createName: userStore.getUser.id,
        createData: fileList.value[0].createData,
        fileType: fileList.value[0].fileType,
        url: fileList.value[0].fileUrl,
      });
      openImgUploadModal.value = false;
    } else {
      message.error(res.data.msg);
    }
  } else {
    message.info('请上传图片');
  }
}

const previewImage = ref<string>('');
const previewVisible = ref<boolean>(false);
const previewTitle = ref<string>('');

/** 删除按钮状态 */
const deleteFlag = computed(() => {
  return selectedRowList.value?.length === 0;
});

// 预览
function handleShowPreview() {
  if (selectedRowList.value.length == 0) {
    message.error('请选择要预览的图片');
    return;
  }
  previewImage.value = selectedRowList.value[0].url || selectedRowList.value[0].picture2dURL;
  previewTitle.value = selectedRowList.value[0].documentName || selectedRowList.value[0].oldFileName;
  previewVisible.value = true;
}

// 删除
function removeImgFile() {
  if (selectedRowList.value.length == 0) {
    message.error('请选择要删除的图片');
    return;
  }
  Modal.confirm({
    title: '确认删除此数据？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      let data: any = {};
      data.pictureIdList = selectedRowList.value;
      const res = await AdminApiSystemModule.deleteSinglePicture(data);
      if (res.data.code == 0) {
        imagedataSource.value = imagedataSource.value.filter(item => !selectedRowList.value.find(t => t.id === item.id));
        selectedRowList.value = [];
        message.success(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
    },
  });
}

// 文件上传---------------------
const selectedRowfileList = ref<any[]>([]);
const openfileUploadModal = ref<boolean>(false);

/** 表格勾选事件 */
const rowSelectionfile: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowfileList.value = selectedRows;
  },
};

/** 删除按钮状态 */
const deletefileFlag = computed(() => {
  return selectedRowfileList.value?.length === 0;
});

function openUpload() {
  uploadFileList.value = [];
  modelData.fileRemarks = '';
  openfileUploadModal.value = true;
}

async function downloadFile(record: any) {
  window.open(record.fileUrl);
}

async function datacustomRequest(options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
    });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      uploadFileList.value[0] = file;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

function datafilechange(file: any) {
  uploadFileList.value[0] = file;
}

function handlefileSave() {
  if (uploadFileList.value[0] && uploadFileList.value[0].id) {
    filedataSource.value.push({
      ...uploadFileList.value[0],
      remark: modelData.fileRemarks,
    });
    openfileUploadModal.value = false;
  } else {
    message.info(WeiI18n.t('请上传文件').value);
  }
}

function FileDownload(row: any) {
  window.open(row.fileUrl);
}

// 删除文件
function removeFile() {
  if (selectedRowfileList.value.length == 0) {
    message.error('请选择要删除的文件');
    return;
  }
  Modal.confirm({
    title: '确认删除此数据？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      let data: any = {};
      data.userId = userStore.getUser.id;
      data.categoryId = categoryid.value;
      data.moduleAttachmentIdList = selectedRowfileList.value;
      const res = await AdminApiSystemModule.deleteModuleAttachmentByModuleId(data);
      if (res.data.code == 0) {
        filedataSource.value = filedataSource.value.filter(item => !selectedRowfileList.value.find(t => t.id === item.id));
        selectedRowfileList.value = [];
        message.success(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
    },
  });
}

const moduleNumVal = ref<string>('');
const pdmFileWindow = ref<boolean>(false);

function alineFile() {
  moduleNumVal.value = '';
  pdmFileWindow.value = true;
}

interface ModulepdmAssociatedDocRequestDTOModel {
  /** 创建时间 */
  docNum: string;
  /** 创建人 */
  moduleNum: string;
}

// 关联PDM文件
async function onLineSubmit() {
  if (!moduleNumVal.value) {
    return message.info('关联文件编码不能为空');
  }
  let data: ModulepdmAssociatedDocRequestDTOModel = {
    docNum: modelData.modelNumber,
    moduleNum: moduleNumVal.value,
  };
  const res = await AdminApiSystemModule.pdmAssociatedDoc(data);
  if (res.data.code == 0) {
    message.success('关联成功');
  } else {
    message.error(res.data.msg);
  }
}

function getDynamicComponentVal() {
  //获取动态组件内的查询条件
  let prmList: any = variableComp.value;
  let moduleParaList: any = [];
  if (prmList != undefined) {
    prmList.forEach(function (item: any) {
      let val = '';
      let newModeTypeVal = item.newModeTypeVal;
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

/**
 * @description 点击确认
 */
async function handleSave() {
  formRef.value?.validate().then(async () => {
    let root: any = [];
    let childrenroot: any = [];
    if (modelData.para7) {
      modelData.para7.forEach((sitem: any) => {
        if (rootList.value.filter((item: any) => +item.value === +sitem)[0]) {
          root.push(rootList.value.filter((item: any) => +item.value === +sitem)[0].label);
        }
      });
    }
    if (modelData.para8) {
      modelData.para8.forEach((sitem: any) => {
        if (childrenList.value.filter((item: any) => +item.value === +sitem)[0]) {
          childrenroot.push(childrenList.value.filter((item: any) => +item.value === +sitem)[0].label);
        }
      });
    }
    let moduleObj = {
      createUser: userStore.getUser.id,
      para1: modelData.modelNumber, //物料编码  modelData
      para2: modelData.codeNum, //模块编码
      para3: modelData.modelName, //模块名称(一般对应中文名称)
      para4: modelData.modelType, //模型类型
      para5: modelData.para5, //模型坐标系,未知参数
      para6: modelData.modelEngName,
      para7: root.join(','),
      para8: childrenroot.join(','),
      para9: modelData.para9,
      para10: modelData.para10,
      para11: modelData.para11,
      para12: modelData.para12,
      para13: modelData.para13,
      para14: modelData.para14,
      para15: modelData.para15,
      para16: modelData.para16,
      para17: modelData.para17,
      para18: modelData.para18,
      para19: modelData.para19,
      para20: modelData.para20,
      status: parseInt(modelData.modelState),
      remark: ckeditorRef.value.getData(),
    };
    let moduleObj2: any = getDynamicComponentVal();
    if (moduleObj2.length > 0) {
      for (let i = 0; i < moduleObj2.length; i++) {
        moduleObj[moduleObj2[i].modelInfoProp] = moduleObj2[i].modelInfoPropValue;
      }
    }
    if (modelData.para7) {
      var productLibrary = modelData.para7.map((item: any) => ({ id: item }));
    }
    if (modelData.para8) {
      var productSeries = modelData.para8.map((item: any) => ({ id: item }));
    }
    let data: any = {};
    data.productLibrary = productLibrary;
    data.productSeries = productSeries;
    data.moduleId = modelData.id;
    data.userId = userStore.getUser.id;
    data.categoryId = categoryid.value;
    data.moduleObj = moduleObj;
    data.attachmentList = filedataSource.value; //文件上传列表
    data.pictureList = pictureIdList.value;
    if (modelData.id == '' || modelData.id == undefined) {
      const res = await AdminApiSystemModule.moduleInfoSave(data);
      if (res.data.code == -1) {
        message.warning({
          content: res.data.msg,
          duration: 3,
          closable: true,
        });
      } else {
        if (res.data.data.result) {
          message.info('添加成功');
          emit('modalInit');
          emit('onClose', false);
        }
      }
    } else {
      data.moduleObj.id = modelData.id;
      data.moduleObj.categoryId = modelData.categoryid;
      const res = await AdminApiSystemModule.moduleInfoUpdate(data);
      if (res.data.code == -1) {
        message.warning({
          content: res.data.msg,
          duration: 3,
          closable: true,
        });
      } else {
        if (res.data.data.result) {
          message.info('修改成功');
          emit('modalInit');
          emit('onClose', false);
        }
      }
    }
  });
}

watch(
  () => modelData.para7,
  (newVal: any, oldVal) => {
    // 在这里处理 para7 属性的变化
    if (newVal.length) {
      getChildrenListsApi(newVal);
    }
  },
  { immediate: true, deep: true },
);

defineExpose({ handleModalAdd, handleModalUpdate });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    class="fixed-modal"
    :style="{ width: '900px', top: '2%' }"
    :title="$t('模块信息')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handleSave"
    @cancel="cancel">
    <div v-if="!loading" class="modal-body">
      <!-- 基本属性 -->
      <section class="module-section">
        <h3 class="module-section-title">基本属性</h3>
        <a-form ref="formRef" layout="vertical" :model="modelData" :label-col="labelCol" class="form-grid">
          <a-form-item label="模块物料码：" name="modelNumber" :rules="[{ required: true, message: WeiI18n.t('请输入模块物料码').value }]">
            <a-input v-model:value="modelData.modelNumber" placeholder="请输入模块物料码" />
          </a-form-item>

          <a-form-item label="模块编码：" name="codeNum" :rules="[{ required: true, message: WeiI18n.t('请输入模块编码').value }]">
            <a-input v-model:value="modelData.codeNum" placeholder="请输入模块编码" />
          </a-form-item>

          <a-form-item label="模块名称：" name="modelName" :rules="[{ required: true, message: WeiI18n.t('请输入模块名称').value }]">
            <a-input v-model:value="modelData.modelName" placeholder="请输入模块名称" />
          </a-form-item>

          <a-form-item label="构型编码：" name="modelEngName">
            <a-input v-model:value="modelData.modelEngName" disabled />
          </a-form-item>

          <a-form-item label="模型类型：" name="modelType" :rules="[{ required: true, message: WeiI18n.t('请选择模型类型').value }]">
            <a-select v-model:value="modelData.modelType" show-search placeholder="请选择模型类型">
              <a-select-option v-for="item in modelType" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="创建人：" name="createUser">
            <a-input v-model:value="modelData.createUser" disabled />
          </a-form-item>

          <a-form-item label="状态：" name="modelState" :rules="[{ required: true, message: WeiI18n.t('请选择状态').value }]">
            <a-select v-model:value="modelData.modelState" show-search placeholder="请选择状态">
              <a-select-option v-for="item in modelStateList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </section>

      <!-- 平台属性 -->
      <section class="module-section">
        <h3 class="module-section-title">平台属性</h3>
        <a-form layout="vertical" :model="modelData" :label-col="labelCol" class="form-grid">
          <a-form-item label="产品平台：" name="para7">
            <a-select v-model:value="modelData.para7" mode="multiple" show-search placeholder="请选择产品平台">
              <a-select-option v-for="item in rootList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="主型产品：" name="para8">
            <a-select v-model:value="modelData.para8" mode="multiple" show-search placeholder="请选择主型产品">
              <a-select-option v-for="item in childrenList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </section>

      <!-- 模块属性 -->
      <section class="module-section">
        <h3 class="module-section-title">模块属性</h3>
        <a-form layout="vertical" :model="modelData" :label-col="labelCol" class="form-grid">
          <a-form-item label="通用程度：" name="para10">
            <a-select v-model:value="modelData.para10" show-search placeholder="请选择通用程度">
              <a-select-option v-for="item in Generalapplicability" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="模块类型：" name="para11">
            <a-select v-model:value="modelData.para11" show-search placeholder="请选择模块类型">
              <a-select-option v-for="item in modeltypeList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="模块系列：" name="para13">
            <a-input v-model:value="modelData.para13" placeholder="请输入模块系列" />
          </a-form-item>
        </a-form>
      </section>

      <!-- 项目属性 -->
      <section class="module-section">
        <h3 class="module-section-title">项目属性</h3>
        <a-form layout="vertical" :model="modelData" :label-col="labelCol" class="form-grid">
          <a-form-item label="模块来源：" name="para9">
            <a-select v-model:value="modelData.para9" show-search placeholder="请选择模块来源">
              <a-select-option v-for="item in projectList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="应用项目：" name="para12">
            <a-select v-model:value="modelData.para12" show-search placeholder="请选择应用项目">
              <a-select-option v-for="item in projectList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </section>

      <!-- 六性分析 -->
      <section class="module-section">
        <h3 class="module-section-title">六性分析</h3>
        <a-form layout="vertical" :model="modelData" :label-col="labelCol" class="form-grid">
          <a-form-item label="成本分析：" name="para14">
            <a-input v-model:value="modelData.para14" placeholder="请输入成本分析" />
          </a-form-item>

          <a-form-item label="经济性：" name="para15">
            <a-select v-model:value="modelData.para15" show-search>
              <a-select-option v-for="item in rankList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="模块成熟度：" name="para16">
            <a-select v-model:value="modelData.para16" show-search>
              <a-select-option v-for="item in rankList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="轻量化：" name="para17">
            <a-select v-model:value="modelData.para17" show-search>
              <a-select-option v-for="item in rankList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="安全性：" name="para18">
            <a-select v-model:value="modelData.para18" show-search>
              <a-select-option v-for="item in rankList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="可靠性：" name="para19">
            <a-select v-model:value="modelData.para19" show-search>
              <a-select-option v-for="item in rankList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="可维护性：" name="para20">
            <a-select v-model:value="modelData.para20" show-search>
              <a-select-option v-for="item in rankList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </section>

      <!-- 可变参数与附件区域 -->
      <div class="variableParm-box" v-if="dynamicParm && dynamicParm.length > 0">
        <div class="section-subtitle">专有属性</div>
        <div class="varargsBox">
          <dynamicForm
            ref="variableComp"
            v-for="(item, index) in dynamicParm"
            :key="item.id"
            :label="item.labelName"
            :modeTypeList="item.modeTypeList"
            :type="item.type"
            :typeKey="item.typeKey"
            :modeTypeVal="item.modeTypeVal"
            :width="252"
            prop="id"
            :labelWidth="55" />
        </div>
      </div>

      <div class="attachments-row">
        <div class="attachments-column">
          <!-- 新增：专有属性 -->
          <!-- <div class="section-subtitle">专有属性</div> -->
          <!-- <div class="special-attrs" style="margin-left: 0; margin-bottom: 8px">
            <template v-for="item in specialProps" :key="item.id">
              <a-form-item :label="item.propertyName" :name="item.modelInfoProp" style="margin-bottom: 8px">
                <a-select
                  v-if="Number(item.ifSelectForm) === 1"
                  v-model:value="modelData[item.modelInfoProp]"
                  :placeholder="'请选择' + item.propertyName"
                  allow-clear
                >
                  <a-select-option v-for="opt in parseOptions(item)" :key="opt" :value="opt">{{ opt }}</a-select-option>
                </a-select>
                <a-input
                  v-else
                  v-model:value="modelData[item.modelInfoProp]"
                  :placeholder="'请输入' + item.propertyName"
                />
              </a-form-item>
            </template>
          </div> -->

          <div class="section-subtitle">备注信息</div>
          <CkeditorPlugin ref="ckeditorRef" height="160" />
        </div>

        <div class="attachments-column">
          <div class="section-subtitle">2D图片</div>
          <div class="attachments-actions">
            <a-button type="primary" size="small" @click="openImgUpload">图片上传</a-button>
            <a-button type="primary" :disabled="deleteFlag" size="small" class="btn_left" @click="handleShowPreview">预览</a-button>
            <a-button type="primary" :disabled="deleteFlag" danger size="small" class="btn_left" @click="removeImgFile">删除</a-button>
          </div>
          <a-table
            bordered
            :locale="locale"
            :scroll="{ x: 'calc(27vw - 10px)' }"
            style="margin-top: 8px"
            :pagination="false"
            row-key="id"
            :data-source="imagedataSource"
            :columns="imgColumns"
            :row-selection="rowSelection" />
        </div>

        <div class="attachments-column">
          <div class="section-subtitle">技术资料</div>
          <div class="attachments-actions">
            <a-button type="primary" size="small" @click="openUpload">文件上传</a-button>
            <a-button type="primary" :disabled="deletefileFlag" danger size="small" class="btn_left" @click="removeFile">删除</a-button>
            <a-button type="primary" :disabled="deletefileFlag" size="small" class="btn_left" @click="alineFile">关联PDM文件</a-button>
          </div>
          <a-table
            bordered
            :locale="locale"
            :scroll="{ x: 'calc(27vw - 10px)' }"
            style="margin-top: 8px"
            :pagination="false"
            row-key="id"
            :data-source="filedataSource"
            :columns="FileColumns"
            :row-selection="rowSelectionfile">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'operation'">
                <a-button shape="circle" type="link" @click="downloadFile(record)">下载</a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>

    <div v-else class="example"><a-spin tip="加载中..." /></div>

    <template #footer>
      <a-button type="primary" @click="handleSave">确定</a-button>
      <a-button @click="cancel">取消</a-button>
    </template>
  </a-modal>

  <!-- 图片上传 -->
  <a-modal
    v-model:visible="openImgUploadModal"
    style="width: 40%"
    :title="$t('图片上传')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handleimgSave"
    @cancel="openImgUploadModal = false">
    <UploadImg ref="refUpload" :fileList="fileList" @change="filechange" @customRequest="customRequest" />
    <template #footer>
      <a-button type="primary" @click="handleimgSave">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="openImgUploadModal = false">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>

  <!-- 文件上传 -->
  <a-modal
    v-model:visible="openfileUploadModal"
    style="width: 40%"
    :title="$t('技术文档与资料上传')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handlefileSave"
    @cancel="openfileUploadModal = false">
    <div style="color: red">温馨提示： 允许上传pdf、doc、docx、xls、xlsx等格式文件</div>
    <UploadFile style="margin-top: 10px; color: red" :fileList="uploadFileList" @change="datafilechange" @customRequest="datacustomRequest" />
    <div style="margin-top: 10px">备注：</div>
    <a-textarea v-model:value="modelData.fileRemarks" placeholder="请输入" allow-clear />
    <template #footer>
      <a-button type="primary" @click="handlefileSave">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="openfileUploadModal = false">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>

  <!-- 图片预览 -->
  <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="previewVisible = false">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>

  <!-- 关联PDM文件-->
  <a-modal width="40%" :visible="pdmFileWindow" title="关联PDM文件" @on-cancel="pdmFileWindow = false">
    <div>
      <el-row>
        <a-form-item label="模块物料码：" class="elformitem">
          <a-input v-model:value="modelData.modelNumber" disabled :placeholder="$t('模块物料码')" style="width: 200px; margin-left: 14px" />
        </a-form-item>
      </el-row>
      <el-row>
        <a-form-item label="关联文件编码：" class="elformitem" style="display: flex">
          <a-input v-model:value="moduleNumVal" :placeholder="$t('关联文件编码')" style="width: 200px" />
          <a-button type="primary" @click="onLineSubmit" style="margin-left: 10px">关联文件</a-button>
        </a-form-item>
      </el-row>
    </div>
    <template #footer>
      <a-button type="primary" @click="pdmFileWindow = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.example {
  position: absolute;
  top: 45%;
  left: 50%;
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
    overflow: auto;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.btn_left {
  margin-left: 15px;
}

:deep(.ant-table-content) {
  overflow: hidden !important;
}

:deep(.ant-form-item) {
  margin-left: 20px !important;
}

.elformitem :deep(.el-form-item__label) {
  width: 120px;
}

.module-section {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

.module-section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  position: relative;
  padding-left: 12px;
}

.module-section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, #1890ff, #2db7f5);
  border-radius: 2px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 24px;
}

.attachments-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.attachments-column {
  width: 100%;
  margin-bottom: 8px;
}

.attachments-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.section-subtitle {
  font-weight: 700;
  margin-bottom: 8px;
}

/* footer 按钮右对齐 */
:deep(.ant-modal-footer) {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 固定 Modal 的头部和底部，内容区可滚动 */
.fixed-modal ::v-deep(.ant-modal-header) {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  /* 保持原有头部高度与分隔线 */
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

/* 限高并允许内部滚动，避免 modal 内容撑开整个视图 */
.fixed-modal ::v-deep(.ant-modal-body) {
  max-height: calc(75vh - 120px);
  overflow: auto;
  padding: 16px 24px;
}

/* 底部按钮固定显示（覆盖原有 .ant-modal-footer 样式） */
.fixed-modal ::v-deep(.ant-modal-footer) {
  position: sticky;
  bottom: 0;
  z-index: 30;
  background: #fff;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04);
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 在窄屏时稍微降低 body 的 max-height */
@media (max-width: 920px) {
  .fixed-modal ::v-deep(.ant-modal-body) {
    max-height: calc(70vh - 120px);
  }
}

/* 响应式 */
@media (max-width: 920px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .single-line ::v-deep(.ant-input),
  .single-line ::v-deep(.ant-select-selector) {
    width: 100% !important;
  }
}
</style>

<style lang="less">
/* Modal 被 teleport，作用域样式无效 -> 全局样式生效 */

/* 选择器针对 a-modal 加的 class="fixed-modal" */
.fixed-modal .ant-modal-content .ant-modal-header {
  position: sticky;
  top: 0;
  z-index: 1200;
  background: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

/* 限高并允许内部滚动 */
.fixed-modal .ant-modal-content .ant-modal-body {
  max-height: calc(75vh - 120px);
  overflow: auto;
  padding: 16px 24px;
  background: #fff;
}

/* 底部按钮固定 */
.fixed-modal .ant-modal-content .ant-modal-footer {
  position: sticky;
  bottom: 0;
  z-index: 1300;
  background: #fff;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04);
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 兼容窄屏 */
@media (max-width: 920px) {
  .fixed-modal .ant-modal-content .ant-modal-body {
    max-height: calc(70vh - 120px);
  }
}
</style>
