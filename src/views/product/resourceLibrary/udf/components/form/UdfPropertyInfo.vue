<script lang="ts" setup>
import { ref } from 'vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import moduleAttribute from '@/views/product/module/components/table/moduleAttribute.vue';
import { useUserStore } from '@/store/modules/user';
import { Modal, message } from 'ant-design-vue';
import { businessApiLibrary } from '@/api/tags/library/基础资源库';
import ImportFile from '@/components/ImportFile/index.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { EpcIcon } from '@/components/icon/EpcIcon';
import ParameterGeneral from '@/views/product/module/components/modal/ParameterGeneral.vue';

const userStore = useUserStore();
const columns = ref([
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
    title: '是否关键项',
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

async function initColumnData(categoryidStr: any) {
  categoryid.value = categoryidStr;
  delFlag.value = true;
  loading.value = true;
  try {
    const params: any = {
      categoryId: categoryidStr,
      paraType: 1,
    };
    const res = await businessApiLibrary.getPropertyList(params);
    if (res.data.code == 200) {
      loading.value = false;
      moduleParaList.value = res.data.data;
      dataSource.value = res.data.data;
      nextTick(() => {
        vxeTable.value.tableRef.remove();
        vxeTable.value.tableRef.insertAt(moduleParaList.value, -1);
      });
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

function selectCheck(selection: any) {
  checkList.value = selection;
  delFlag.value = selection.length === 0;
  updFlag.value = selection.length !== 1;
  indexList.value = getVxeSelectionIndexs(selection);
}

function getVxeSelectionIndexs(selection: any) {
  const list: any = [];
  if (selection.length > 0) {
    selection.forEach((item: any) => {
      list.push({
        id: item.id,
        index: vxeTable.value.tableRef.getRowIndex(item),
      });
    });
  }
  return list;
}

function delParm(index: any) {
  const list1 = vxeTable.value.tableRef.getTableData().tableData;
  dataSource.value = [];
  for (let i = 0; i < list1.length; i++) {
    if (i == index) {
      list1[i]['paraDictionaryName'] = '';
      list1[i]['paraDictionary'] = '';
    }
  }
  vxeTable.value.tableRef.remove();
  dataSource.value = list1;
  vxeTable.value.tableRef.loadData(list1);
}

function tabToSort(_dataType: any, type: any) {
  const tableRef = vxeTable.value.tableRef;
  const originData = tableRef.getTableData().tableData as any[];
  const arr = originData.slice();
  let index: number | null = null;
  if (indexList.value.length != 1) {
    message.warning('请选择一条数据进行排序！');
    return;
  }
  index = indexList.value[0].index;
  indexList.value = [];
  if (index === null) return;

  const sortType = Number(type);
  let targetIndex = index;
  if (sortType === 1) {
    if (index === 0) {
      message.warning('已经是列表中第一条数据！');
      return;
    }
    targetIndex = 0;
  } else if (sortType === 2) {
    if (index === 0) {
      message.warning('已经是列表中第一条数据！');
      return;
    }
    targetIndex = index - 1;
  } else if (sortType === 3) {
    if (index === arr.length - 1) {
      message.warning('已经是列表中最后一条数据！');
      return;
    }
    targetIndex = index + 1;
  } else if (sortType === 4) {
    if (index === arr.length - 1) {
      message.warning('已经是列表中最后一条数据！');
      return;
    }
    targetIndex = arr.length - 1;
  }

  const currentRow = arr[index];
  const targetRow = arr[targetIndex];
  const hasValidSort = arr.every((row: any) => row.sort !== undefined && row.sort !== null && row.sort !== '');
  if (!hasValidSort) {
    arr.forEach((row: any, i: number) => {
      row.sort = i + 1;
    });
  }
  const tempSort = currentRow.sort;
  currentRow.sort = targetRow.sort;
  targetRow.sort = tempSort;
  arr[index] = targetRow;
  arr[targetIndex] = currentRow;

  tableRef.remove();
  dataSource.value = arr;
  tableRef.loadData(arr);
  checkUxSelection(targetIndex);
}

function checkUxSelection(index: any) {
  const getRecordset = vxeTable.value.tableRef.getTableData().tableData;
  vxeTable.value.tableRef.toggleCheckboxRow(getRecordset[index]);
  const selection = vxeTable.value.tableRef.getCheckboxRecords();
  indexList.value = getVxeSelectionIndexs(selection);
}

function showSelectParameter(index: any) {
  selectParmIndex.value = index;
  ParameterGeneralVisible.value = true;
  nextTick(() => {
    ParameterGeneralRef.value.handlegetData('');
  });
}

function addColumn() {
  const tableRef = vxeTable.value.tableRef;
  const tableData = (tableRef.getTableData().tableData as any[]) || [];
  let maxSort = 0;
  tableData.forEach((row: any) => {
    const s = row.sort;
    if (s !== undefined && s !== null && s !== '' && !Number.isNaN(Number(s))) {
      maxSort = Math.max(maxSort, Number(s));
    }
  });
  const nextSort = maxSort + 1;

  const str: any = {
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

  const { row: newRow } = tableRef.insertAt(str, -1);
  const rowIndex = vxeTable.value.tableRef.getRowIndex(newRow);

  setTimeout(() => {
    scrollToRow(rowIndex);
    setTimeout(() => {
      focusToPropertyName(rowIndex);
    }, 0);
  }, 0);
}

function scrollToRow(_rowIndex: number) {
  const container = document.querySelector('.tabBox') || document.querySelector('.vxe-table--body-wrapper');
  if (container) {
    (container as HTMLElement).scrollTop = (container as HTMLElement).scrollHeight;
  }
}

function focusToPropertyName(rowIndex: number) {
  setTimeout(() => {
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
        input.scrollIntoView({ block: 'center' });
        input.focus();
        input.select();
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
  const data: any = {
    userId: userStore.getUser.id,
    userName: userStore.getUser.userName,
    categoryId: categoryid.value,
    propertyDto: vxeTable.value.tableRef.getTableData().tableData,
  };
  const columnList = vxeTable.value.tableRef.getTableData().tableData;
  let falg = 0;
  columnList.forEach((item: any) => {
    if (item.propertyName == null || item.propertyName == '') {
      falg += 1;
    }
  });
  if (falg === 0) {
    await AdminApiSystemModule.updateModuleProperty(data);
    initColumnData(categoryid.value);
    message.success('保存成功');
  } else {
    message.warning('列名称不能为空！');
  }
  saveFlag.value = false;
}

function delColumn() {
  Modal.confirm({
    title: '确认删除此数据？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      const delcheckList: any = [];
      const delcheckdata: any = [];
      checkList.value.forEach((val: any) => {
        if (val.delIndex != undefined) {
          delcheckList.push(val);
        }
        if (val.id != undefined && val.id != '') {
          delcheckdata.push(val);
        }
      });
      const params: any = {
        userId: userStore.getUser.id,
        categoryId: categoryid.value,
        propertyDto: delcheckdata,
      };
      if (delcheckdata.length > 0) {
        await AdminApiSystemModule.batchDeleteModuleProperty(params);
        vxeTable.value.tableRef.removeCheckboxRow();
        dataSource.value = vxeTable.value.tableRef.getTableData().tableData;
        message.info('删除成功');
      } else if (delcheckList.length > 0) {
        vxeTable.value.tableRef.removeCheckboxRow();
      }
      delFlag.value = checkList.value.length === 0;
    },
  });
}

async function templateDownload() {
  const dom = document.createElement('a');
  dom.href = '/DownloadTemplate/moduleProperty-Template.xlsx';
  dom.download = 'moduleProperty-Template.xlsx';
  document.body.appendChild(dom);
  dom.click();
  document.body.removeChild(dom);
}

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

async function importSuccessfulFun() {
  const exceldata: any = {
    categoryId: categoryid.value,
    userid: userStore.getUser.id,
    userName: userStore.getUser.userName,
    moduleName: fileList.value[0].newFileName,
  };
  const res = await AdminApiSystemModule.ImportingConfigurationColumnsNew(exceldata);
  if (res.data.code == 200) {
    const data: any = res.data.data;
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
  const list1 = vxeTable.value.tableRef.getTableData().tableData;
  for (let i = 0; i < list1.length; i++) {
    if (i == selectParmIndex.value) {
      list1[i]['parameterNum'] = e.parameterNum;
      list1[i]['parameterId'] = e.id;
    }
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
        <a-button type="primary" class="btn_left" @click="saveColumns">
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
          ref="vxeTable"
          :columns="columns"
          :data="dataSource"
          :parmList="'pageCloum'"
          :height="tabHeight"
          @delParm="delParm"
          @selectModelListCheck="selectCheck"
          @tabToSort="tabToSort"
          @showSelectParameter="showSelectParameter" />
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
      @close="batchflag = false" />

    <ParameterGeneral
      ref="ParameterGeneralRef"
      :modalVisible="ParameterGeneralVisible"
      @onClose="ParameterGeneralVisible = false"
      @handleSave="handleSave" />
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
