<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, Form, InputNumber, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import topComponents from './topComponents.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import taskStatusComponents from './taskStatusComponents.vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { handleEpcDownload } from '@/utils/file';
import { EpcIcon } from '@/components/icon/EpcIcon';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { downloadFileFromStream } from '@/utils/file.ts';
import { UploadFile } from '@/components/UploadFile';
import { aw } from 'vitest/dist/chunks/reporters.nr4dxCkA';
const userStore = useUserStore();
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const operateFlag = ref<any>('calc(100vh - 380px)');
const topFileComponents = ref<any>(null);
const taskStatusComponentsa = ref<any>(null);
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
const sumbitDisplay = ref<boolean>(false);
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  initPageData();
  await getTaskWorkStatus();
  await getGcFileInfo();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

async function initPageData() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.combinationList(data);
  tableList.value = res.data.data;
}

async function submitOk(type: any) {
  if (type == 0) {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.userId = userStore.getUser.id;
    data.uploadInfoData = uploadInfoData.value;
    data.menuType = '8';
    const res = await AdminApiProductPlanTaskDesign.keepTaskFileInfo(data);
    if (res.data.code == 200) {
      submitAdd();
    }
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 208;
    const res = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data);
    if (res.data.code == 200) {
      submitCommit();
    }
  }
}

const submitStatus = ref<boolean>(false);
//获取过程文件信息111
async function getGcFileInfo() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  data.fileType = '8';
  const res = await AdminApiProductPlanTaskDesign.getTaskGcFileInfo(data);
  uploadInfoData.value = res.data.data.fileListDataEnds || [];
  data.planId = planTaskInfo.value.planId;
  const resb = await AdminApiProductPlanTaskDesign.combinationgetExamineStatus(data);
  console.log(resb);
  if (resb.data.data.length > 0) {
    submitStatus.value = true;
    if (resb.data.data[0].approvalStatus == '已驳回' && resb.data.data[1].processStatus == '待办') {
      updateDisabled.value = true;
    } else if (resb.data.data[0].approvalStatus == '已驳回' && resb.data.data[1].processStatus == '已办') {
      updateDisabled.value = false;
    } else {
      updateDisabled.value = true;
    }
  } else {
    submitStatus.value = false;
  }
}

async function submitCommit() {
  //调取子方法
  taskStatusComponentsa.value?.submitCommit(planTaskInfo.value.progress);
}
async function submitAdd() {
  //调取子方法
  taskStatusComponentsa.value?.submitAdd(planTaskInfo.value.progress);
}

const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    text: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  const lastDotIndex = row.fileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.fileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}

function delEnSystemUpload(row: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      uploadInfoData.value = uploadInfoData.value.filter((item: any) => item.fileId !== row.fileId);
      message.success('删除成功!');
    },
  });
}

function handleClosePowModal() {
  powVisible.value = false;
}

async function downFile(row: any) {
  const downLoadItem = {
    fileId: row.fileId,
  };
  handleEpcDownload(downLoadItem, row.oldFileName);
}

const uploadInfoData = ref<any>([]);
const uploadColumns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '文件名称',
    dataIndex: 'oldFileName',
    key: 'oldFileName',
    ellipsis: true,
    align: 'left',
    width: 150,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.oldFileName, b.oldFileName),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 150,
    align: 'center',
  },
]);

// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
  isParent?: boolean;
}
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      // 实现单选功能，只保留最后选中的项
      if (selectedRowKeys.length > 0) {
        const lastKey = selectedRowKeys[selectedRowKeys.length - 1];
        const lastRow = selectedRows[selectedRows.length - 1];
        // 如果是父节点，不允许选中
        if (!lastRow.isParent) {
          selectedRowkeys.value = [lastKey];
          selectedRowList.value = [lastRow];
        } else {
          // 如果是父节点，清空选中状态
          selectedRowkeys.value = [];
          selectedRowList.value = [];
        }
      } else {
        selectedRowList.value = [];
        selectedRowkeys.value = [];
      }
    },
    // 禁用父节点的选择框
    getCheckboxProps: (record: any) => ({
      disabled: record.isParent,
    }),
  };
});

// 单选点击行选择
function customRow(record: any) {
  return {
    onClick: () => {
      // 如果是父节点，不允许选中
      if (!record.isParent) {
        // 实现单选，直接替换为当前行
        selectedRowkeys.value = [record.id];
        selectedRowList.value = [record];
      }
    },
  };
}

async function updatePram(record: any) {
  modalTitle.value = '编辑产品信息';
  currentRecord.value = record;
  // 填充表单数据
  formData.productPlatform = record.productPlatform || '';
  formData.mainProduct = record.mainProduct || '';
  formData.productName = record.productName || '';
  formData.version = record.version || '';
  formData.feature = record.feature || '';
  formData.characteristics = record.characteristics || '';
  formData.projectInitiationDate = record.projectInitiationDate || '';
  formData.designDate = record.designDate || '';
  formData.prototypeDate = record.prototypeDate || '';
  formData.productLaunchDate = record.productLaunchDate || '';
  formData.productPlatformId = record.productPlatformId || '';
  formData.mainProductId = record.mainProductId || '';
  modalVisible.value = true;
}

async function deletePram(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条用户痛点记录吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let data: any = {};
        data.id = record.id;
        const res = await AdminApiProductPlanTaskDesign.combinationDelete(data);
        if (res.data.code === 200) {
          message.success('删除成功');
          // 重新加载数据
          await initPageData();
        } else {
          message.error(res.data.message || '删除失败');
        }
      } catch (error) {
        message.error('删除失败，请重试');
      }
    },
  });
}
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const tableList = ref<any>([]);
// 弹窗相关状态
const modalVisible = ref<boolean>(false);
const modalTitle = ref<string>('添加用户痛点');
const currentRecord = ref<any>(null);
// 产品选择弹窗状态
const productModalVisible = ref<boolean>(false);
const productModalTitle = ref<string>('选择主型产品');
// 表单数据
const formData = reactive({
  productPlatform: '',
  mainProduct: '',
  productName: '',
  version: '',
  feature: '',
  characteristics: '',
  projectInitiationDate: '',
  designDate: '',
  prototypeDate: '',
  productLaunchDate: '',
  productPlatformId: '',
  mainProductId: '',
});
// 表单实例
const formRef = ref();
// 表单验证规则
const rules = {
  productPlatform: [
    {
      required: true,
      message: '请输入产品平台',
      trigger: 'blur',
    },
  ],
  mainProduct: [
    {
      required: true,
      message: '请输入主型产品',
      trigger: 'blur',
    },
  ],
  productName: [
    {
      required: true,
      message: '请输入产品名称',
      trigger: 'blur',
    },
  ],
  version: [
    {
      required: true,
      message: '请输入版本',
      trigger: 'blur',
    },
  ],
  feature: [
    {
      required: true,
      message: '请输入技术特征',
      trigger: 'blur',
    },
  ],
  characteristics: [
    {
      required: true,
      message: '请输入功能特征',
      trigger: 'blur',
    },
  ],
};

const columns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '产品平台',
    dataIndex: 'productPlatform',
    key: 'productPlatform',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productPlatform, b.productPlatform),
  },
  {
    title: '主型产品',
    dataIndex: 'mainProduct',
    key: 'mainProduct',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.mainProduct, b.mainProduct),
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    ellipsis: true,
    align: 'center',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productName, b.productName),
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
  },
  {
    title: '产品描述',
    align: 'center',
    resizable: true,
    children: [
      {
        title: '技术特征',
        dataIndex: 'feature',
        key: 'feature',
        ellipsis: true,
        align: 'left',
        width: 170,
        sorter: (a: any, b: any) => sortermethod(a.feature, b.feature),
      },
      {
        title: '功能特征',
        dataIndex: 'characteristics',
        key: 'characteristics',
        ellipsis: true,
        align: 'left',
        width: 170,
        sorter: (a: any, b: any) => sortermethod(a.characteristics, b.characteristics),
      },
    ],
  },
  {
    title: '开发阶段（里程碑）',
    align: 'center',
    resizable: true,
    children: [
      {
        title: '立项',
        dataIndex: 'projectInitiationDate',
        key: 'projectInitiationDate',
        ellipsis: true,
        align: 'left',
        width: 170,
        sorter: (a: any, b: any) => sortermethod(a.projectInitiationDate, b.projectInitiationDate),
      },
      {
        title: '设计',
        dataIndex: 'designDate',
        key: 'designDate',
        ellipsis: true,
        align: 'left',
        width: 170,
        sorter: (a: any, b: any) => sortermethod(a.designDate, b.designDate),
      },
      {
        title: '样机试制',
        dataIndex: 'prototypeDate',
        key: 'prototypeDate',
        ellipsis: true,
        align: 'left',
        width: 170,
        sorter: (a: any, b: any) => sortermethod(a.prototypeDate, b.prototypeDate),
      },
      {
        title: '产品发布',
        dataIndex: 'productLaunchDate',
        key: 'productLaunchDate',
        ellipsis: true,
        align: 'left',
        width: 170,
        sorter: (a: any, b: any) => sortermethod(a.productLaunchDate, b.productLaunchDate),
      },
    ],
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 120,
    align: 'center',
    fixed: 'right',
  },
]);

async function getTaskWorkStatus() {
  let data: any = {};
  data.id = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemProductSpecification.getProductTaskWorkStatus(data);
  paramDisabled.value = res.data.data.paramDisabled;
  keepDisabled.value = res.data.data.keepDisabled;
  submitDisabled.value = res.data.data.submitDisabled;
  updateDisabled.value = res.data.data.updateDisabled;
  sumbitDisplay.value = res.data.data.sumbitDisplay;
  planTaskInfo.value.progress = res.data.data.progress;
  if (
    planTaskInfo.value.headUserId == productInfo.value.headUserId &&
    planTaskInfo.value.parentNodeName == productInfo.value.parentNodeName &&
    updateDisabled.value == true &&
    submitDisabled.value == true &&
    keepDisabled.value == true
  ) {
    paramDisabled.value = true;
  } else if (
    planTaskInfo.value.headUserId == productInfo.value.headUserId &&
    planTaskInfo.value.parentNodeName == productInfo.value.parentNodeName &&
    updateDisabled.value == true
  ) {
    paramDisabled.value = false;
  } else {
    paramDisabled.value = true;
  }
}

const emit = defineEmits(['refreshTree']);
async function refreshTree(id: any) {
  emit('refreshTree', id);
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Dybfgcp');
}

async function downLoadTemplate() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.combinationExcelTemplate(data);
  const fileName = '产品组合清单模板.xlsx';
  downloadFileFromStream(res, fileName);
}

const openfileUploadModal = ref<boolean>(false);
const uploadFileList = ref<any>([]);
const fileList = ref<any>([]);
async function importExcelModal() {
  uploadFileList.value = [];
  fileList.value = [];
  openfileUploadModal.value = true;
}

async function handlefileSave() {
  if (uploadFileList.value[0] && uploadFileList.value[0].id) {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    const file = fileList.value[0];
    const res = await AdminApiProductPlanTaskDesign.combinationExcelImport({
      file,
      data,
    });
    if (res.data.code == 200) {
      openfileUploadModal.value = false;
      await initPageData();
      message.success(WeiI18n.t('导入成功').value);
    }
  } else {
    message.info(WeiI18n.t('请上传文件').value);
  }
}

function datafilechange(file: any) {
  uploadFileList.value[0] = file;
}

async function datacustomRequest(options: any) {
  fileList.value[0] = options.file;
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

async function exportExcel() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.combinationExcelExport(data);
  const fileName = '产品组合清单数据.xlsx';
  downloadFileFromStream(res, fileName);
}

async function submitExamine() {
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.planId = planTaskInfo.value.planId;
  data.taskId = planTaskInfo.value?.id;
  const res = await AdminApiProductPlanTaskDesign.combinationSubmitExamine(data);
  if (res.data.code == 200) {
    submitStatus.value = true;
    updateDisabled.value = true;
    message.success('提交成功');
  }
}
async function addModule() {
  modalTitle.value = '添加产品信息';
  currentRecord.value = null;
  formData.productPlatform = '';
  formData.mainProduct = '';
  formData.productName = '';
  formData.version = '';
  formData.feature = '';
  formData.characteristics = '';
  formData.projectInitiationDate = '';
  formData.designDate = '';
  formData.prototypeDate = '';
  formData.productLaunchDate = '';
  modalVisible.value = true;
}

const productInfoSelect = ref<any>([]);
async function selectProductInfo() {
  productModalTitle.value = '选择主型产品';
  let data: any = {};
  ((data.fileId = 0), (data.id = 0), (data.level = 0), (data.pid = 0), (data.type = 1));
  const res = await AdminApiSystemProduct.getProductTree(data);
  // 处理数据，标记父节点
  if (res.data.data[0] && res.data.data[0].children) {
    productInfoSelect.value = res.data.data[0].children.map((item: any, index: number) => ({
      ...item,
      index: index + 1,
      isParent: item.objType === 'productPlatform', // 假设父节点的objType为productPlatform
    }));
  } else {
    productInfoSelect.value = [];
  }
  // 重置选中状态
  selectedRowkeys.value = [];
  selectedRowList.value = [];
  productModalVisible.value = true;
}

const categoryModalColumns = ref<TableColumnType<any>[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'index',
    key: 'index',
    width: 80,
    customRender({ text, record, index }) {
      return h('div', {}, [h('span', { innerText: index + 1 })]);
    },
  },
  {
    title: '产品平台',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.name, b.name),
  },
]);

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};

async function customRequest_A(options: any, type: any) {
  // 调用上传接口
  loading.value = true;
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      uploadInfoData.value = [];
      uploadInfoData.value.push({
        fileId: res.data.data.id,
        oldFileName: res.data.data.oldFileName,
        filePath: imgRooturl + res.data.data.newFileName,
        pdfFileName: imgRooturl + res.data.data.pdfFileName,
      });
      loading.value = false;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      loading.value = false;
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
}

function keepTechnology() {
  console.log(selectedRowList.value);
  // 处理选中的产品信息
  if (selectedRowList.value.length > 0) {
    if (selectedRowList.value[0].level == 2) {
      message.warning('请选择子产品');
    } else {
      formData.mainProduct = selectedRowList.value[0].name;
      formData.productPlatformId = selectedRowList.value[0].pid;
      formData.mainProductId = selectedRowList.value[0].id;
      productInfoSelect.value.forEach((item: any) => {
        if (item.id === selectedRowList.value[0].pid) {
          formData.productPlatform = item.name;
        }
      });
      productModalVisible.value = false;
    }
  } else {
    // 如果没有选中任何项，提示用户
    message.warning('请选择一个产品');
  }
}
// 保存表单数据
async function saveForm() {
  // 使用表单验证
  try {
    await formRef.value?.validate();

    let data: any = {
      id: currentRecord.value ? currentRecord.value.id : null,
      productPlatform: formData.productPlatform,
      mainProduct: formData.mainProduct,
      productName: formData.productName,
      version: formData.version,
      feature: formData.feature,
      characteristics: formData.characteristics,
      projectInitiationDate: formData.projectInitiationDate,
      designDate: formData.designDate,
      prototypeDate: formData.prototypeDate,
      productLaunchDate: formData.productLaunchDate,
      productPlatformId: formData.productPlatformId,
      mainProductId: formData.mainProductId,
      planId: planTaskInfo.value.planId,
      taskId: planTaskInfo.value.id,
    };

    let res;
    // 这里根据实际API调整调用的接口方法
    // 假设使用painPoint相关接口作为示例，实际应根据项目需求修改
    if (currentRecord.value == null) {
      // 添加操作
      // 这里可以根据实际API修改为正确的添加接口
      res = await AdminApiProductPlanTaskDesign.combinationCreate(data);
      if (res.data.code === 200) {
        message.success('添加成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '添加失败');
      }
    } else {
      // 编辑操作
      // 这里可以根据实际API修改为正确的更新接口
      res = await AdminApiProductPlanTaskDesign.combinationUpdate(data);
      if (res.data.code === 200) {
        message.success('修改成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '修改失败');
      }
    }
  } catch (error: any) {
    if (error?.errorFields) {
      message.error('表单验证失败，请检查输入信息');
    } else {
      message.error('操作失败，请重试');
    }
  }
}
const loading = ref<boolean>(false);
function submitDisplayshow() {
  if (!submitDisabled.value && !submitStatus.value) {
    return false;
  } else {
    return true;
  }
}
const ailoading = ref<boolean>(false);
async function aiAnalysis() {
  try {
    ailoading.value = true;
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 8;
    const res = await AdminApiProductPlanTaskDesign.aiAnalytics(data);
    if (res.data.code == 200) {
    }
  } catch (error) {
    console.log(error);
  } finally {
    ailoading.value = false;
  }
}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <a-spin :spinning="loading" tip="加载中...">
    <div class="bodyPageStyle" :style="{ height: operateFlag }">
      <div class="content-title">
        <i></i>
        <span class="test">产品组合清单</span>
        <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate()"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板</a-button>
        <a-button type="primary" @click="importExcelModal()" style="margin-left: 20px" :disabled="paramDisabled">
          <EpcIcon type="icon-mobanxiazai" style="font-size: 16px" />导入</a-button
        >
        <a-button type="primary" @click="exportExcel()" style="margin-left: 20px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
        <a-button type="primary" style="margin-left: 20px" @click="addModule()" :disabled="paramDisabled"> <EpcIcon type="icon-tianjia1" style="font-size: 12px" />添加</a-button>
        <a-button v-if="sumbitDisplay" type="primary" @click="submitExamine()" style="margin-left: 20px" :disabled="submitDisplayshow()">
          <EpcIcon type="icon-tijiaoqueren" style="font-size: 16px" />提交审核</a-button
        >
      </div>
      <a-div>
        <a-div :span="23">
          <a-table
            :scroll="{ x: 'max-content' }"
            :locale="localeA"
            bordered
            @resizeColumn="handleResizeColumn"
            style="margin-left: 20px; margin-right: 10px; overflow-y: auto; height: 390px"
            :columns="columns"
            :pagination="false"
            :data-source="tableList">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                {{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'action'">
                <a v-if="paramDisabled" :disabled="paramDisabled" type="link">编辑</a>
                <a v-else @click="updatePram(record)" type="link">编辑</a>
                <a-divider type="vertical" />
                <a v-if="paramDisabled" :disabled="paramDisabled" type="link">删除</a>
                <a v-else @click="deletePram(record)" type="link">删除</a>
              </template>
            </template>
          </a-table>
        </a-div>
      </a-div>
      <div class="content-title" style="margin-top: 10px">
        <i></i>
        <span class="test">AI分析结果</span>
        <!-- <a-upload ref="fileUpload" multiple :before-upload="beforeUpload" :custom-request="options => customRequest_A(options, 1)" :show-upload-list="false">
        </a-upload> -->
        <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled" :loading="ailoading" @click="aiAnalysis">
          <EpcIcon type="icon-rengongzhineng" style="font-size: 16px" />
          {{ $t('AI分析') }}
        </a-button>
        <!-- 大约30分钟, -->
        <span style="margin-left: 20px; color: red">{{ '注：AI分析加载时间较长,请耐心等待!' }}</span>
      </div>
      <a-div>
        <a-div :span="18">
          <a-table
            :scroll="{ x: 'max-content' }"
            :locale="localeA"
            bordered
            @resizeColumn="handleResizeColumn"
            style="margin-left: 20px; margin-right: 10px; overflow-y: auto"
            :columns="uploadColumns"
            :pagination="false"
            :data-source="uploadInfoData">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                {{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'action'">
                <a type="link" v-if="paramDisabled" :disabled="paramDisabled">删除</a>
                <a @click="delEnSystemUpload(record)" type="link" v-else>删除</a>
                <a-divider type="vertical" />
                <a @click="priview(record)" type="link">预览</a>
                <a-divider type="vertical" />
                <a @click="downFile(record)" type="link">下载</a>
              </template>
            </template>
          </a-table>
        </a-div>
      </a-div>
    </div>
  </a-spin>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
  <div class="Dybfgcp" v-dragModal>
    <a-modal v-model:visible="modalVisible" :title="modalTitle" :getContainer="customGetContainer" :width="900" :mask-closable="false">
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" style="padding: 20px">
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="产品平台" name="productPlatform" required>
              <a-input v-model:value="formData.productPlatform" :disabled="true" placeholder="请输入产品平台" :style="{ width: '73%' }" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="主型产品" name="mainProduct" required>
              <div style="display: flex; gap: 8px; align-items: center">
                <a-input v-model:value="formData.mainProduct" disabled="true" placeholder="请输入主型产品" :style="{ width: '73%' }" />
                <a-button type="primary" @click="selectProductInfo">浏览</a-button>
              </div>
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="产品名称" name="productName" required>
              <a-input v-model:value="formData.productName" placeholder="请输入产品名称" :style="{ width: '73%' }" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="版本" name="version" required>
              <a-input v-model:value="formData.version" placeholder="请输入版本" :style="{ width: '73%' }" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="技术特征" name="feature" required>
              <a-input v-model:value="formData.feature" placeholder="请输入技术特征" :style="{ width: '73%' }" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="功能特征" name="characteristics" required>
              <a-input v-model:value="formData.characteristics" placeholder="请输入功能特征" :style="{ width: '73%' }" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="立项日期" name="projectInitiationDate">
              <a-date-picker
                :locale="locale"
                v-model:value="formData.projectInitiationDate"
                format="YYYY-MM-DD"
                placeholder="请选择立项日期"
                value-format="YYYY-MM-DD"
                style="width: 73%" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="设计日期" name="designDate">
              <a-date-picker :locale="locale" v-model:value="formData.designDate" format="YYYY-MM-DD" placeholder="请选择设计日期" value-format="YYYY-MM-DD" style="width: 73%" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="样机试制日期" name="prototypeDate">
              <a-date-picker
                :locale="locale"
                v-model:value="formData.prototypeDate"
                format="YYYY-MM-DD"
                placeholder="请选择样机试制日期"
                value-format="YYYY-MM-DD"
                style="width: 73%" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="产品发布日期" name="productLaunchDate">
              <a-date-picker
                :locale="locale"
                v-model:value="formData.productLaunchDate"
                format="YYYY-MM-DD"
                placeholder="请选择产品发布日期"
                value-format="YYYY-MM-DD"
                style="width: 73%" />
            </a-form-item>
          </div>
        </div>
      </a-form>
      <template #footer>
        <div class="modal-footer">
          <a-button type="primary" @click="saveForm">确定</a-button>
          <a-button @click="modalVisible = false">取消</a-button>
        </div>
      </template>
    </a-modal>
  </div>

  <!-- 产品选择弹窗 -->
  <div class="Dybfgcp">
    <a-modal v-model:visible="productModalVisible" class="product-modal" :title="productModalTitle" :getContainer="customGetContainer" :width="600" :mask-closable="false">
      <a-table
        :columns="categoryModalColumns"
        :data-source="productInfoSelect"
        @resizeColumn="handleResizeColumn"
        :pagination="false"
        :row-key="(record: any) => record.id"
        :row-selection="rowSelection"
        :customRow="customRow"
        style="height: 300px; overflow-y: auto"
        :row-class-name="
          (record, index) => {
            let className = index % 2 === 0 ? 'odd' : 'even';
            if (record.isParent) className += ' parent-row';
            return className;
          }
        ">
      </a-table>
      <template #footer>
        <a-button type="primary" @click="keepTechnology()"> 确定 </a-button>
        <a-button @click="productModalVisible = false">取消</a-button>
      </template>
    </a-modal>
  </div>

  <a-modal
    v-model:visible="openfileUploadModal"
    style="width: 40%"
    :title="$t('技术文档与资料上传')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handlefileSave"
    @cancel="openfileUploadModal = false">
    <div style="color: red">温馨提示： 只允许上传xls、xlsx格式文件</div>
    <UploadFile style="margin-top: 10px; color: red" :fileList="uploadFileList" @change="datafilechange" @customRequest="datacustomRequest" />
    <template #footer>
      <a-button type="primary" @click="handlefileSave">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="openfileUploadModal = false">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>

  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :submitDisplay="false"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>
</template>

<style lang="less" scoped>
:deep(.product-modal .ant-table-content) {
  overflow-x: hidden !important;
}
/* 父节点样式 */
:deep(.ant-table-row.parent-row) {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}
:deep(.ant-table-row.parent-row:hover) {
  background-color: #f5f5f5 !important;
}
/* 奇数行和偶数行样式 */
:deep(.ant-table-row.odd) {
  background-color: #ffffff;
}
:deep(.ant-table-row.even) {
  background-color: #fafafa;
}
// 两列表单布局样式
.form-row {
  display: flex;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-col {
  flex: 1;
  padding: 0 8px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }

  &.full-width {
    flex: none;
    width: 100%;
    padding: 0;
  }
}

.Dybfgcp {
  position: relative;
  z-index: 1000;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input {
  text-align: left;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

:deep(.ant-picker) {
  width: 100%;
  border-radius: 2px;
}

:deep(.ant-table-thead > tr > th:last-child) {
  border-right: none;
}

:deep(.ant-table-tbody > tr > td) {
  text-align: center;
  height: 40px;
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr > td:last-child) {
  border-right: none;
}

:deep(.ant-table-tbody > tr > td:first-child) {
  font-weight: 500;
}

:deep(.ant-table) {
  margin-bottom: 0;
}

// 表单样式
.form-content {
  padding: 10px 0;

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }

  :deep(.ant-input-number) {
    width: 100%;
  }
}

// 弹窗底部按钮样式
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;

  .ant-btn {
    margin-left: 8px;
  }
}

//底部按钮
.foot-btn {
  width: 100%;
  height: 60px;
  background-color: #fff;
  margin-left: 16px;
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  .btn_left {
    margin-left: 15px;
  }
}

//内容标题
.content-title {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  margin-left: 16px;
  i {
    width: 6px;
    height: 20px;
    background: #0d53e2;
    border-radius: 0px 0px 0px 0px;
    margin-right: 8px;
  }
  .test {
    height: 20px;
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.bodyPageStyle {
  background-color: #ffffff !important;
  overflow-y: auto;
}
</style>
