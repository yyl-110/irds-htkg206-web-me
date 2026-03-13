<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import moduleAttribute from '../table/moduleAttribute.vue';
import { useUserStore } from '@/store/modules/user';
import { TableProps, Modal, Button, Popconfirm, message } from 'ant-design-vue';
import { uxTabTop, uxTabToUp, uxTabToDown, uxTabDown, getUmyIndex } from '@/utils/tools';
import { businessApiLibrary } from '@/api/tags/library/基础资源库';
import ImportFile from '@/components/ImportFile/index.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { EpcIcon } from '@/components/icon/EpcIcon';
import ParameterGeneral from '../modal/ParameterGeneral.vue';
const requestParams = reactive(new ModuleTypeRequestDTOModel());
const userStore = useUserStore();
const columns = ref([
  //属性添加列
  {
    type: 'selection',
    width: 60,
    align: 'center',
    fixed: 'left',
  },
  {
    id: '1',
    title: '列名称',
    key: 'propertyName',
    align: 'center',
    width: 130,
    slot: 'propertyName',
  },
  {
    id: '2',
    title: '模型参数名',
    key: 'modelPara',
    align: 'center',
    width: 130,
    slot: 'modelPara',
  },
  {
    id: '3',
    title: '关联参数字典',
    key: 'paraDictionaryName',
    align: 'center',
    width: 320,
    slot: 'paraDictionaryName',
  },
  // {
  //   id:'4',
  //   title: '分类',
  //   key: 'columnProperties',
  //   align: "center",
  //   width: 80,
  // },
  {
    id: '6',
    title: '显示状态',
    key: 'status',
    align: 'center',
    width: 100,
    slot: 'status',
  },
  {
    id: '7',
    title: '列宽',
    key: 'inputBoxLength',
    align: 'center',
    width: 100,
    slot: 'inputBoxLength',
  },
  {
    id: '8',
    title: '默认查询',
    key: 'defaultQuery',
    align: 'center',
    width: 100,
    slot: 'defaultQuery',
  },
  {
    id: '9',
    title: '是否关键项', //dfqList
    key: 'keyword',
    align: 'center',
    width: 100,
    slot: 'keyword',
  },
  {
    id: '10',
    title: '是否*匹配项',
    key: 'isMatching',
    align: 'center',
    width: 100,
    slot: 'isMatching',
  },
  {
    id: '6',
    title: 'PDM内部值',
    key: 'pdmValue',
    align: 'center',
    // resizable: true,
    width: 120,
    slot: 'pdmValue',
  },
  {
    id: '13',
    title: '单位',
    key: 'unit',
    align: 'center',
    width: 100,
    slot: 'unit',
  },
  {
    id: '14',
    title: '提示信息',
    key: 'remark',
    align: 'center',
    width: 120,
    slot: 'remark',
  },
  {
    id: '15',
    title: '下拉属性',
    key: 'ifSelectForm',
    align: 'center',
    width: 120,
    slot: 'ifSelectForm',
  },
  {
    id: '15',
    title: '下拉参数',
    key: 'selectMultipleValues',
    align: 'center',
    width: 120,
    slot: 'selectMultipleValues',
  },
  {
    id: '16',
    title: '数值类型',
    key: 'modelParaType',
    align: 'center',
    resizable: true,
    width: 110,
    slot: 'modelParaType',
  },
  {
    id: '17',
    title: '排序级别',
    key: 'sortLevel',
    align: 'center',
    minWidth: 100,
    slot: 'sortLevel',
  },
]);
const categoryid = ref('');
const dataSource = ref([]);
const delFlag = ref(true);
const saveFlag = ref(false);
const updFlag = ref<boolean>(false);
const loading = ref<boolean>(false);
const batchflag = ref<boolean>(false);
const ParameterGeneralVisible = ref<boolean>(false);
const ParameterGeneralRef = ref<any>(null);
const moduleParaList = ref([]);
const checkList = ref<any>([]);
const indexList = ref<any>([]);
const vxeTable = ref<any>(null);
const selectParmIndex = ref('');
const tabHeight = ref<any>((window.innerHeight - 270) / 16 + 'rem');
//初始化数据
async function initColumnData(categoryidStr: any) {
  categoryid.value = categoryidStr;
  delFlag.value = true;
  loading.value = true;
  try {
    let params: any = {};
    params.categoryId = categoryidStr;
    params.paraType = 1;
    const res = await businessApiLibrary.getPropertyList(params);
    if (res.data.code == 200) {
      loading.value = false;
      moduleParaList.value = res.data.data;
      dataSource.value = res.data.data;
      nextTick(() => {
        vxeTable.value.tableRef.remove();
        let { row: newRow } = vxeTable.value.tableRef.insertAt(moduleParaList.value, -1);
      });
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

function selectCheck(selection: any) {
  checkList.value = selection;
  if (selection.length > 0) {
    delFlag.value = false;
  } else {
    delFlag.value = true;
  }
  if (selection.length == 1) {
    updFlag.value = false;
  } else {
    updFlag.value = true;
  }
  indexList.value = getVxeSelectionIndexs(selection);
}
function getVxeSelectionIndexs(selection: any) {
  let indexList: any = [];
  if (selection.length > 0) {
    selection.forEach((item: any) => {
      indexList.push({
        id: item.id,
        index: vxeTable.value.tableRef.getRowIndex(item),
      });
    });
  }
  return indexList;
}
function delParm(index: any) {
  let list = [];
  let list1 = vxeTable.value.tableRef.getTableData().tableData;
  dataSource.value = [];
  for (let i = 0; i < list1.length; i++) {
    if (i == index) {
      list1[i]['paraDictionaryName'] = '';
      list1[i]['paraDictionary'] = '';
    }
    list.push(list1[i]);
  }
  vxeTable.value.tableRef.remove();
  dataSource.value = list1;
  vxeTable.value.tableRef.loadData(list1);
}
function tabToSort(dataType: any, type: any) {
  const tableRef = vxeTable.value.tableRef;
  const originData = tableRef.getTableData().tableData as any[];
  const arr = originData.slice();
  //1 :置顶 2：向上 3：向下 4:置底
  let index: number | null = null;
  if (indexList.value.length != 1) {
    message.warning('请选择一条数据进行排序！');
    return;
  } else {
    index = indexList.value[0].index;
    indexList.value = [];
  }
  if (index === null) return;

  // 根据 type 计算与谁交换位置（子组件传入的是字符串 '1'/'2'/'3'/'4'）
  const sortType = Number(type);
  let targetIndex = index;
  if (sortType === 1) {
    // 置顶：与第一条交换
    if (index === 0) {
      message.warning('已经是列表中第一条数据！');
      return;
    }
    targetIndex = 0;
  } else if (sortType === 2) {
    // 向上：与上一条交换
    if (index === 0) {
      message.warning('已经是列表中第一条数据！');
      return;
    }
    targetIndex = index - 1;
  } else if (sortType === 3) {
    // 向下：与下一条交换
    if (index === arr.length - 1) {
      message.warning('已经是列表中最后一条数据！');
      return;
    }
    targetIndex = index + 1;
  } else if (sortType === 4) {
    // 置底：与最后一条交换
    if (index === arr.length - 1) {
      message.warning('已经是列表中最后一条数据！');
      return;
    }
    targetIndex = arr.length - 1;
  }

  const currentRow = arr[index];
  const targetRow = arr[targetIndex];
  // 如果 sort 字段不存在或为空，先按当前顺序补全 sort
  const hasValidSort = arr.every((row: any) => row.sort !== undefined && row.sort !== null && row.sort !== '');
  if (!hasValidSort) {
    arr.forEach((row: any, i: number) => {
      row.sort = i + 1;
    });
  }
  // 与目标行互换 sort 字段
  const tempSort = currentRow.sort;
  currentRow.sort = targetRow.sort;
  targetRow.sort = tempSort;
  // 同时在数组中交换两行位置，保证界面顺序与 sort 一致
  arr[index] = targetRow;
  arr[targetIndex] = currentRow;

  // 刷新表格并同步 dataSource
  tableRef.remove();
  dataSource.value = arr;
  tableRef.loadData(arr);

  // 排序后保持当前行选中
  const newIndex = targetIndex;
  checkUxSelection(newIndex);
}
//排序后继续选中
function checkUxSelection(index: any) {
  let getRecordset = vxeTable.value.tableRef.getTableData().tableData;
  vxeTable.value.tableRef.toggleCheckboxRow(getRecordset[index]);
  let selection = vxeTable.value.tableRef.getCheckboxRecords();
  indexList.value = getVxeSelectionIndexs(selection);
}

function showSelectParameter(index: any) {
  selectParmIndex.value = index;
  ParameterGeneralVisible.value = true;
  nextTick(() => {
    ParameterGeneralRef.value.handlegetData('147');
  });
}
function addColumn() {
  const tableRef = vxeTable.value.tableRef;
  const tableData = (tableRef.getTableData().tableData as any[]) || [];
  // 新添加的列 sort = 当前表格最大 sort + 1
  let maxSort = 0;
  tableData.forEach((row: any) => {
    const s = row.sort;
    if (s !== undefined && s !== null && s !== '' && !Number.isNaN(Number(s))) {
      maxSort = Math.max(maxSort, Number(s));
    }
  });
  const nextSort = maxSort + 1;

  let str: any = {
    id: '',
    showFlag: 0,
    colWidth: 100,
    delIndex: tableRef.getInsertRecords().length,
    propertyType: 1,
    parameterType: 1,
    searchFlag: 1,
    propertyName: '',
    creator: userStore.getUser.id,
    sort: nextSort,
  };

  let { row: newRow } = tableRef.insertAt(str, -1);

  // 获取行索引
  const rowIndex = vxeTable.value.tableRef.getRowIndex(newRow);

  // 延迟执行，确保 DOM 更新
  setTimeout(() => {
    // 1. 先滚动
    scrollToRow(rowIndex);

    // 2. 再聚焦
    setTimeout(() => {
      focusToPropertyName(rowIndex);
    }, 0);
  }, 0);
}

function scrollToRow(rowIndex: number) {
  // 最简单的滚动：找到表格容器并滚动到底部
  const container = document.querySelector('.tabBox') || document.querySelector('.vxe-table--body-wrapper');
  if (container) {
    (container as HTMLElement).scrollTop = (container as HTMLElement).scrollHeight;
  }
}

function focusToPropertyName(rowIndex: number) {
  // 查找新行的 propertyName 输入框
  setTimeout(() => {
    // 选择器组合
    const selectors = [
      `tr[rowid="${rowIndex}"] [field="propertyName"] input`,
      `tr[data-row-id="${rowIndex}"] [field="propertyName"] input`,
      `.vxe-table--body tr:nth-child(${rowIndex + 1}) [field="propertyName"] input`,
      `[rowid="${rowIndex}"] input`,
      `.vxe-table--body tr:last-child input`,
    ];

    for (const selector of selectors) {
      const input = document.querySelector(selector) as HTMLInputElement;
      if (input) {
        console.log('找到输入框，正在聚焦...');

        // 确保在视图中
        input.scrollIntoView({ block: 'center' });

        // 聚焦
        input.focus();

        // 选中文本
        input.select();

        // 视觉反馈
        highlightInput(input);
        break;
      }
    }
  }, 0);
}

function highlightInput(input: HTMLInputElement) {
  const originalBorder = input.style.border;
  const originalBoxShadow = input.style.boxShadow;

  input.style.border = '2px solid #1890ff';
  input.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';

  // 3秒后恢复
  setTimeout(() => {
    input.style.border = originalBorder;
    input.style.boxShadow = originalBoxShadow;
  }, 0);
}
function addUpload() {
  fileList.value = [];
  batchflag.value = true;
}
async function saveColumns() {
  saveFlag.value = true;
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.userName = userStore.getUser.userName;
  data.categoryId = categoryid.value;
  data.propertyDto = vxeTable.value.tableRef.getTableData().tableData;
  let columnList = vxeTable.value.tableRef.getTableData().tableData;
  let falg = 0;
  columnList.forEach((item: any) => {
    if (item.propertyName == null || item.propertyName == '') {
      falg = falg + 1;
      return;
    }
  });
  if (falg === 0) {
    const res = await AdminApiSystemModule.updateModuleProperty(data);
    initColumnData(categoryid.value);
    message.success('保存成功');
  } else {
    message.warning('列名称不能为空！');
  }
  saveFlag.value = false;
}
function delColumn() {
  let delFalg: boolean = true;
  let delcheckList: any = [];
  let delcheckdata: any = [];
  if (delFalg) {
    Modal.confirm({
      title: '确认删除此数据？',
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      onOk: async () => {
        checkList.value.forEach(function (val: any) {
          if (val.delIndex != undefined) {
            delcheckList.push(val);
          }

          if (val.id != undefined && val.id != '') {
            delcheckdata.push(val);
          }
        });
        let params: any = {};
        params.userId = userStore.getUser.id;
        params.categoryId = categoryid.value;
        params.propertyDto = delcheckdata;
        if (delcheckdata.length > 0) {
          const res = await AdminApiSystemModule.batchDeleteModuleProperty(params);
          vxeTable.value.tableRef.removeCheckboxRow();
          const tableData = vxeTable.value.tableRef.getTableData().tableData;
          dataSource.value = tableData;
          message.info('删除成功');
        } else if (delcheckList.length > 0) {
          vxeTable.value.tableRef.removeCheckboxRow();
        }
        if (checkList.value.length > 0) {
          delFlag.value = true;
        } else {
          delFlag.value = false;
        }
      },
    });
  }
}
// 下载附件
async function templateDownload() {
  let dom = document.createElement('a');
  dom.href = '/DownloadTemplate/moduleProperty-Template.xlsx';
  dom.download = 'moduleProperty-Template.xlsx';
  document.body.appendChild(dom);
  dom.click();
  document.body.removeChild(dom);
}
/** 文件列表 */
const fileList = ref<any>([]);
async function customRequest(options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFileTransfer({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code == 0) {
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
function filechange(file: any) {
  fileList.value[0] = file;
}
// 导入附件
async function importSuccessfulFun() {
  let exceldata: any = {};
  exceldata.categoryId = categoryid.value;
  exceldata.userid = userStore.getUser.id;
  exceldata.userName = userStore.getUser.userName;
  exceldata.moduleName = fileList.value[0].newFileName;
  const res = await AdminApiSystemModule.ImportingConfigurationColumnsNew(exceldata);
  if (res.data.code == 0) {
    let data: any = res.data.data;
    message.info({
      top: 80,
      duration: 10,
      content: data.importMsg,
      closable: true,
    });
    batchflag.value = false;
    initColumnData(categoryid.value);
  } else {
    message.error({
      top: 80,
      duration: 10,
      content: res.data.msg,
      closable: true,
    });
  }
}
function handleSave(e: any) {
  console.log(e, 'e');

  var list = [];
  var list1 = vxeTable.value.tableRef.getTableData().tableData;
  columns.value = [];
  for (let i = 0; i < list1.length; i++) {
    if (i == selectParmIndex.value) {
      list1[i]['paraDictionaryName'] = e.parameterNum;
      list1[i]['paraDictionary'] = e.id;
    }
    list.push(list1[i]);
  }
  vxeTable.value.tableRef.remove();
  columns.value = list1;
  vxeTable.value.tableRef.loadData(list1);
  ParameterGeneralVisible.value = false;
}
defineExpose({ initColumnData });
</script>

<template>
  <div>
    <!-- 列管理 -->
    <div class="module-body">
      <div style="min-height: 40px; width: 100%; margin-top: 10px">
        <a-button type="primary" @click="addColumn">
          <EpcIcon type="icon-md-add" style="font-size: 17px; position: absolute; left: 4px; top: 6px" />
          {{ $t('添加列') }}
        </a-button>
        <a-button type="primary" danger class="btn_left" :disabled="delFlag" @click="delColumn">
          <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
          删除
        </a-button>
        <a-button type="primary" class="btn_left" :disabled="saveFlag" @click="saveColumns">
          <EpcIcon type="icon-baocun" style="font-size: 15px" />
          保存
        </a-button>
        <a-button type="primary" class="btn_left" @click="addUpload">
          <Icon type="ios-cloud-upload-outline" />
          <EpcIcon type="icon-wenjiandaoru" style="font-size: 15px" />
          属性导入
        </a-button>
      </div>
      <div v-if="!loading" style="width: 97%" class="layout-content2" ref="mainDiv">
        <moduleAttribute
          @delParm="delParm"
          @selectModelListCheck="selectCheck"
          @tabToSort="tabToSort"
          @showSelectParameter="showSelectParameter"
          ref="vxeTable"
          :columns="columns"
          :data="dataSource"
          :parmList="'pageCloum'"
          :height="tabHeight" />
      </div>
      <div v-else class="example">
        <a-spin tip="加载中..." />
      </div>
    </div>

    <ImportFile
      :modalVisible="batchflag"
      :fileList="fileList"
      @change="filechange"
      @customRequest="customRequest"
      @templateDownload="templateDownload"
      @importSuccessfulFun="importSuccessfulFun"
      @close="batchflag = false"></ImportFile>

    <ParameterGeneral ref="ParameterGeneralRef" :modalVisible="ParameterGeneralVisible" @onClose="ParameterGeneralVisible = false" @handleSave="handleSave"></ParameterGeneral>
  </div>
</template>

<style lang="less" scoped>
.module-body {
  padding-right: 20px;
}
.btn_left {
  margin-left: 20px;
}
.example {
  position: absolute;
  top: 50%;
  left: 60%;
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
:deep(.ant-card-body) {
  width: 100%;
}
:deep(.bodyprop) {
  height: calc(100vh - 425px) !important;
  overflow: hidden !important;
}
</style>
