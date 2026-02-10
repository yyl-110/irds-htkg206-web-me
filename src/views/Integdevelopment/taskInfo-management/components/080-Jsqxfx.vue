<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { ProdTechnicaldRequestDTOModel } from '@/api/models/technicaldisciplines/ProdTechnicaldRequestDTOModel';
import { AdminApiSystemTechnicaldisciplines } from '@/api/tags/technicaldisciplines/管理后台技术学科管理';
import { downloadFileFromStream } from '@/utils/file.ts';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { UploadFile } from '@/components/UploadFile';
const userStore = useUserStore();
const requestParams = reactive(new ProdTechnicaldRequestDTOModel());
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const operateFlag = ref<any>('calc(100vh - 380px)');
const topFileComponents = ref<any>(null);
const taskStatusComponentsa = ref<any>(null);
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  initPageData();
  getTaskWorkStatus();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 202;
    const res = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data);
    if (res.data.code == 200) {
      submitCommit();
    }
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

async function getTaskWorkStatus() {
  let data: any = {};
  data.id = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemProductSpecification.getProductTaskWorkStatus(data);
  paramDisabled.value = res.data.data.paramDisabled;
  keepDisabled.value = res.data.data.keepDisabled;
  submitDisabled.value = res.data.data.submitDisabled;
  updateDisabled.value = res.data.data.updateDisabled;
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

async function keepTechnology() {
  if (selectedRowList.value.length == 0) {
    message.error('请选择技术维度');
    return;
  }
  const existingNames = new Set(technologyData.value.map(item => item.name));
  selectedRowList.value.forEach((sourceItem: any) => {
    const { categoryName } = sourceItem;
    // 若name不在existingNames中，则添加到targetArray
    if (!existingNames.has(categoryName)) {
      // 转换为targetArray的结构（此处id、parentId、sort需根据实际需求生成，示例中暂用默认值）
      technologyData.value.push({
        key: technologyData.value.length + 1, // 临时生成唯一id（实际场景需替换为业务逻辑）
        name: categoryName,
      });
      // 将新增的name加入existingNames，避免重复添加
      existingNames.add(categoryName);
    }
  });

  categoryModal.value = false;
}

async function initPageData() {
  const res = await AdminApiSystemProductSpecification.getDynamicList({
    taskId: planTaskInfo.value.id,
    type: '技术趋势分析',
  });
  // 保存数据到currentPageData，供弹窗使用
  if (res.data.data) {
    currentPageData.value = {
      firstColumnJson: res.data.data.firstColumnJson || [],
      headerJson: res.data.data.headerJson || [],
    };
  }
  uploadColumns.value = [];
  uploadColumns.value.push({
    title: '技术维度',
    dataIndex: 'rowId',
    key: 'rowId',
    ellipsis: true,
    align: 'left',
    width: 160,
    resizable: true,
  });
  var herderCodeJson = res.data.data.herderCodeJson;
  tableContentJson.value = res.data.data.tableContentJson;

  // 创建firstColumnCodeJson和firstColumnJson的映射对象
  const firstColumnMap: Record<string, string> = {};
  const firstColumnCodeJson = res.data.data.firstColumnCodeJson || [];
  const firstColumnJson = res.data.data.firstColumnJson || [];

  // 构建映射关系
  firstColumnCodeJson.forEach((code: string, index: number) => {
    if (firstColumnJson[index]) {
      firstColumnMap[code] = firstColumnJson[index];
    }
  });

  // 更新tableContentJson中的rowId值
  if (Array.isArray(tableContentJson.value)) {
    tableContentJson.value = tableContentJson.value.map((item: any) => {
      if (item.rowId && firstColumnMap[item.rowId]) {
        return {
          ...item,
          rowId: firstColumnMap[item.rowId],
        };
      }
      return item;
    });
  }
  // 确保herderCodeJson使用正确的格式
  herderCodeJson = res.data.data.headerJson.map((header: string) => `${header}`);

  res.data.data.headerJson.forEach((item: any, index: number) => {
    uploadColumns.value.push({
      title: item,
      dataIndex: herderCodeJson[index],
      key: herderCodeJson[index],
      ellipsis: true,
      align: 'left',
      width: 170,
      resizable: true,
      sorter: (a: any, b: any) => sortermethod(a[herderCodeJson[index]], b[herderCodeJson[index]]),
    });
  });

  uploadColumns.value.push({
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    ellipsis: true,
    align: 'center',
    width: 120,
    fixed: 'right',
  });
}

const uploadColumns = ref<TableColumnType<any>[]>([]);

const tableContentJson = ref<any>([]);

// 技术维度弹窗相关状态
const technologyModalVisible = ref(false);
const technologyColumns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    width: 60,
    align: 'center',
  },
  {
    title: '技术维度',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 150,
    align: 'center',
  },
]);
const technologyData = ref<any[]>([]);

// 时间轴弹窗相关状态
const timeOutModalVisible = ref(false);
const timeColumns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    width: 60,
    align: 'center',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 170,
    align: 'center',
  },
]);
const timeData = ref<any[]>([]);

const categoryModal = ref(false);
const categoryModalColumns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    align: 'center',
    resizable: true,
  },
  {
    title: '技术维度',
    dataIndex: 'categoryName',
    key: 'categoryName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.categoryName, b.categoryName),
  },
]);
const categoryModalData = ref<any[]>([]);

// 保存当前页面数据，供弹窗使用
const currentPageData = ref<any>({ firstColumnJson: [], headerJson: [] });

// 技术维度管理弹窗
const technologyModule = () => {
  technologyData.value =
    currentPageData.value.firstColumnJson.map((item: string, index: number) => ({
      key: index + 1,
      name: item,
    })) || [];
  technologyModalVisible.value = true;
};

// 时间轴管理弹窗
const timeOutModule = () => {
  // 从已保存的数据中获取时间轴列表
  timeData.value =
    currentPageData.value.headerJson.map((item: string, index: number) => ({
      key: index + 1,
      time: item,
    })) || [];
  timeOutModalVisible.value = true;
};

// 弹窗操作方法
const handleAddTechnology = async () => {
  const res = await AdminApiSystemTechnicaldisciplines.getLevel2Node({});
  categoryModal.value = true;
  selectedRowkeys.value = [];
  selectedRowList.value = [];
  categoryModalData.value = res.data.data || [];
  technologyData.value.forEach((item: any) => {
    selectedRowkeys.value.push(item.name);
    const matchedItem = categoryModalData.value.find((ite: any) => ite.categoryName === item.name);
    if (matchedItem) {
      selectedRowList.value.push(matchedItem);
    }
  });
};

const handleAdd = () => {
  technologyData.value.push({
    key: technologyData.value.length + 1,
    name: '',
  });
};

const categorySubmit = async () => {
  const validData = technologyData.value.filter(item => item.name.trim() !== '');
  if (validData.length === 0) {
    message.warning('请至少输入一个技术维度');
    return;
  }

  try {
    const newTableContentJson = [...tableContentJson.value];
    const existingRowIds = tableContentJson.value.map(item => item.rowId);

    validData.forEach((item, index) => {
      const rowId = item.name;
      const existingIndex = existingRowIds.indexOf(rowId);

      if (existingIndex === -1) {
        // 新添加的技术维度，创建新条目
        const newRow: any = { rowId };
        // 为每个时间维度创建空值字段
        currentPageData.value.headerJson.forEach((header, yearIndex) => {
          newRow[`${header}`] = '';
        });
        newTableContentJson.push(newRow);
      }
    });

    const updatedTableContentJson = newTableContentJson.filter(item => validData.some(techItem => techItem.name === item.rowId));

    const orderedTableContentJson = validData.map(item => {
      const rowId = item.name;
      const existingItem = updatedTableContentJson.find(i => i.rowId === rowId);
      return existingItem || { rowId };
    });

    // 准备保存参数
    const saveData = {
      taskId: planTaskInfo.value.id,
      type: '技术趋势分析',
      headerJson: currentPageData.value.headerJson,
      herderCodeJson: currentPageData.value.headerJson.map(header => `${header}`),
      firstColumnJson: validData.map(item => item.name),
      firstColumnCodeJson: validData.map((_, index) => `tech_${index + 1}`),
      tableContentJson: orderedTableContentJson,
      planId: planTaskInfo.value.planId,
    };
    const res = await AdminApiSystemProductSpecification.saveDynamicList(saveData);
    if (res.data.code === 200) {
      message.success('保存成功');
      initPageData();
      currentPageData.value.firstColumnJson = validData.map(item => item.name);
      technologyModalVisible.value = false;
    }
  } catch (error) {
    message.error('保存失败，请重试');
  }
};

const timeSave = async () => {
  const validData = timeData.value.filter(item => item.time.trim() !== '');
  if (validData.length === 0) {
    message.warning('请至少输入一个时间项');
    return;
  }

  try {
    // 为每个表格行更新时间字段
    const updatedTableContentJson = tableContentJson.value.map(row => {
      const updatedRow: any = { rowId: row.rowId }; // 只保留rowId

      // 根据新的时间维度重新创建字段
      validData.forEach((timeItem, timeIndex) => {
        // 如果原始数据中有值，则保留，否则设为空
        updatedRow[`${timeItem.time}`] = row[`${timeItem.time}`] || '';
      });

      return updatedRow;
    });

    // 准备保存参数
    const saveData = {
      taskId: planTaskInfo.value.id,
      type: '技术趋势分析',
      headerJson: validData.map(item => item.time),
      herderCodeJson: validData.map(item => `${item.time}`),
      firstColumnJson: currentPageData.value.firstColumnJson,
      firstColumnCodeJson: currentPageData.value.firstColumnJson.map((_, index) => `tech_${index + 1}`),
      tableContentJson: updatedTableContentJson,
      planId: planTaskInfo.value.planId,
    };
    const res = await AdminApiSystemProductSpecification.saveDynamicList(saveData);
    if (res.data.code === 200) {
      message.success('保存成功');
      initPageData();
      currentPageData.value.headerJson = validData.map(item => item.time);
      timeOutModalVisible.value = false;
    }
  } catch (error) {
    message.error('保存失败，请重试');
    console.error('保存时间轴失败:', error);
  }
};

const delCechnologyColumns = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      // 获取要删除的技术维度名称
      const deletedName = record.name;

      // 删除技术维度
      technologyData.value = technologyData.value.filter((item: any) => item.key !== record.key);

      // 更新key值
      technologyData.value = technologyData.value.map((item, idx) => ({
        ...item,
        key: idx + 1,
      }));

      // 过滤掉被删除的技术维度的数据行
      tableContentJson.value = tableContentJson.value.filter(row => row.rowId !== deletedName);

      message.success('删除成功!');
    },
  });
};

const upParam = (record: any) => {
  const index = technologyData.value.findIndex(item => item.key === record.key);
  if (index > 0) {
    // 交换位置
    const temp = technologyData.value[index];
    technologyData.value[index] = technologyData.value[index - 1];
    technologyData.value[index - 1] = temp;

    // 更新key值
    technologyData.value = technologyData.value.map((item, idx) => ({
      ...item,
      key: idx + 1,
    }));

    // 交换对应的数据行
    if (tableContentJson.value.length > 1) {
      // 获取要交换的两个技术维度名称
      const currentName = temp.name;
      const prevName = technologyData.value[index].name;

      // 查找并交换对应的数据行
      const currentRowIndex = tableContentJson.value.findIndex(row => row.rowId === currentName);
      const prevRowIndex = tableContentJson.value.findIndex(row => row.rowId === prevName);

      if (currentRowIndex !== -1 && prevRowIndex !== -1) {
        // 创建新的数组以触发响应式更新
        const newTableContent = [...tableContentJson.value];
        // 交换数据行
        [newTableContent[currentRowIndex], newTableContent[prevRowIndex]] = [newTableContent[prevRowIndex], newTableContent[currentRowIndex]];
        tableContentJson.value = newTableContent;
      }
    }

    message.success(`技术维度上移成功`);
  } else {
    message.warning('已经是第一项，无法上移');
  }
};

const downParam = (record: any) => {
  const index = technologyData.value.findIndex(item => item.key === record.key);
  if (index < technologyData.value.length - 1) {
    // 交换位置
    const temp = technologyData.value[index];
    technologyData.value[index] = technologyData.value[index + 1];
    technologyData.value[index + 1] = temp;

    // 更新key值
    technologyData.value = technologyData.value.map((item, idx) => ({
      ...item,
      key: idx + 1,
    }));

    // 交换对应的数据行
    if (tableContentJson.value.length > 1) {
      // 获取要交换的两个技术维度名称
      const currentName = temp.name;
      const nextName = technologyData.value[index].name;

      // 查找并交换对应的数据行
      const currentRowIndex = tableContentJson.value.findIndex(row => row.rowId === currentName);
      const nextRowIndex = tableContentJson.value.findIndex(row => row.rowId === nextName);

      if (currentRowIndex !== -1 && nextRowIndex !== -1) {
        // 创建新的数组以触发响应式更新
        const newTableContent = [...tableContentJson.value];
        // 交换数据行
        [newTableContent[currentRowIndex], newTableContent[nextRowIndex]] = [newTableContent[nextRowIndex], newTableContent[currentRowIndex]];
        tableContentJson.value = newTableContent;
      }
    }

    message.success(`技术维度下移成功`);
  } else {
    message.warning('已经是最后一项，无法下移');
  }
};

const timeUpParam = (record: any) => {
  const index = timeData.value.findIndex(item => item.key === record.key);
  if (index > 0) {
    // 交换位置
    const temp = timeData.value[index];
    timeData.value[index] = timeData.value[index - 1];
    timeData.value[index - 1] = temp;
    // 更新key值
    timeData.value = timeData.value.map((item, idx) => ({
      ...item,
      key: idx + 1,
    }));
    let arr = JSON.parse(JSON.stringify(tableContentJson.value));
    // 交换对应的数据字段值
    tableContentJson.value = arr.map(row => {
      const newRow = { ...row };
      // 交换当前位置和上一个位置的字段值
      const prevYearCode = `${timeData.value[index - 1].time}`;
      const tempValue = newRow[record.time];
      newRow[record.time] = newRow[prevYearCode];
      newRow[prevYearCode] = tempValue;
      return newRow;
    });
    message.success(`时间轴上移成功`);
  } else {
    message.warning('已经是第一项，无法上移');
  }
};

const timeDownParam = (record: any) => {
  const index = timeData.value.findIndex(item => item.key === record.key);
  if (index < timeData.value.length - 1) {
    const temp = timeData.value[index];
    timeData.value[index] = timeData.value[index + 1];
    timeData.value[index + 1] = temp;
    timeData.value = timeData.value.map((item, idx) => ({
      ...item,
      key: idx + 1,
    }));
    // 交换对应的数据字段值
    tableContentJson.value = tableContentJson.value.map(row => {
      const newRow = { ...row };
      // 交换当前位置和下一个位置的字段值
      const nextYearCode = `${timeData.value[index + 1].time}`;
      const tempValue = newRow[record.time];
      newRow[record.time] = newRow[nextYearCode];
      newRow[nextYearCode] = tempValue;
      return newRow;
    });
    message.success(`时间轴下移成功`);
  } else {
    message.warning('已经是最后一项，无法下移');
  }
};

// 编辑弹窗相关状态
const editModalVisible = ref(false);
const currentEditRecord = ref<any>({});
const editFormData = ref<any>({});

// 打开编辑弹窗
const downFile = (record: any) => {
  currentEditRecord.value = { ...record };
  // 复制当前记录的数据用于编辑
  editFormData.value = { ...record };
  editModalVisible.value = true;
};

// 保存编辑
const saveEdit = async () => {
  try {
    // 更新tableContentJson中的数据
    const index = tableContentJson.value.findIndex((item: any) => item.rowId === currentEditRecord.value.rowId);
    if (index !== -1) {
      // 创建新数组以触发响应式更新
      const newTableContent = [...tableContentJson.value];
      newTableContent[index] = { ...editFormData.value };
      tableContentJson.value = newTableContent;

      // 准备保存参数
      const saveData = {
        taskId: planTaskInfo.value.id,
        type: '技术趋势分析',
        headerJson: currentPageData.value.headerJson,
        herderCodeJson: currentPageData.value.headerJson.map(header => `${header}`),
        firstColumnJson: currentPageData.value.firstColumnJson,
        firstColumnCodeJson: currentPageData.value.firstColumnJson.map((_, index) => `tech_${index + 1}`),
        tableContentJson: newTableContent,
        planId: planTaskInfo.value.planId,
      };

      const res = await AdminApiSystemProductSpecification.saveDynamicList(saveData);
      if (res.data.code === 200) {
        message.success('保存成功');
        editModalVisible.value = false;
        // 刷新页面数据
        initPageData();
      }
    }
  } catch (error) {
    message.error('保存失败，请重试');
    console.error('保存编辑失败:', error);
  }
};

// 时间轴删除功能
const delEnSystemUpload = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      // 获取要删除的时间项索引
      const deletedIndex = timeData.value.findIndex(item => item.key === record.key);

      // 删除时间项
      timeData.value = timeData.value.filter((item: any) => item.key !== record.key);
      // 更新key值
      timeData.value = timeData.value.map((item, idx) => ({
        ...item,
        key: idx + 1,
      }));

      // 重新映射tableContentJson中的字段
      tableContentJson.value = tableContentJson.value.map(row => {
        const newRow: any = { rowId: row.rowId };

        // 为每个剩余的时间项重新映射值
        timeData.value.forEach((timeItem, timeIndex) => {
          // 获取原始数据中对应位置的值
          // 如果删除的是前面的列，需要从后面的列取值
          let originalValue = '';
          if (timeIndex < deletedIndex) {
            // 对于删除列之前的列，直接使用对应位置的值
            originalValue = row[`${timeItem.time}`] || '';
          } else {
            // 对于删除列之后的列，使用下一个位置的值
            originalValue = row[`${timeData.value[timeIndex + 1]?.time}`] || '';
          }
          newRow[`${timeItem.time}`] = originalValue;
        });

        return newRow;
      });

      message.success('删除成功!');
    },
  });
};

const handleAddTime = () => {
  timeData.value.push({
    key: timeData.value.length + 1,
    time: '',
  });
};

// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
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
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});

// 多选点击行选择
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.id;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.id);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowList.value = selectedRows.filter(item => item.id !== key);
      } else {
        // 如果未选中则选中
        selectedRowList.value = [...selectedRows, record];
      }
    },
  };
}

async function downLoadTemplate() {
  let data: any = {};
  data.type = '技术趋势分析';
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.tableExcelTemplate(data);
  const fileName = '技术趋势分析模板.xlsx';
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
    data.type = '技术趋势分析';
    const file = fileList.value[0];
    const res = await AdminApiProductPlanTaskDesign.tableExcelImport({
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
  data.type = '技术趋势分析';
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.tableExcelExport(data);
  const fileName = '技术趋势分析数据.xlsx';
  downloadFileFromStream(res, fileName);
}

defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">技术趋势分析</span>
      <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate()"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板</a-button>
      <a-button type="primary" @click="importExcelModal()" style="margin-left: 20px" :disabled="paramDisabled">
        <EpcIcon type="icon-mobanxiazai" style="font-size: 16px" />导入</a-button
      >
      <a-button type="primary" @click="exportExcel()" style="margin-left: 20px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="technologyModule()" :disabled="paramDisabled">
        <EpcIcon type="icon-bianji-blue" style="font-size: 16px" />
        技术维度管理</a-button
      >
      <a-button type="primary" style="margin-left: 20px" @click="timeOutModule()" :disabled="paramDisabled">
        <EpcIcon type="icon-shujuguanli" style="font-size: 16px" />
        时间轴管理</a-button
      >
    </div>
    <a-div>
      <a-div>
        <a-table
          :scroll="{ x: 'max-content' }"
          :locale="localeA"
          bordered
          @resizeColumn="handleResizeColumn"
          style="margin-left: 20px; overflow-y: auto; height: 390px"
          :columns="uploadColumns"
          :pagination="false"
          :data-source="tableContentJson">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a v-if="paramDisabled" :disabled="paramDisabled" type="link">编辑</a>
              <a v-else @click="downFile(record)" type="link">编辑</a>
            </template>
          </template>
        </a-table>
      </a-div>
    </a-div>
  </div>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>

  <!-- 技术维度管理弹窗 -->
  <a-modal v-model:visible="technologyModalVisible" title="技术维度管理" :width="700" :mask-closable="false">
    <div style="margin-bottom: 16px">
      <a-button type="primary" @click="handleAddTechnology">浏览</a-button>
      <a-button type="primary" style="margin-left: 10px" @click="handleAdd">添加行</a-button>
    </div>
    <a-table :columns="technologyColumns" :data-source="technologyData" :pagination="false" row-key="key" style="height: 500px; overflow-y: auto">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'name'">
          <a-input v-model:value="record.name" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a type="link" v-if="paramDisabled" :disabled="paramDisabled">删除</a>
          <a @click="delCechnologyColumns(record)" type="link" v-else>删除</a>
          <a-divider type="vertical" />
          <a @click="upParam(record)" type="link">上移</a>
          <a-divider type="vertical" />
          <a @click="downParam(record)" type="link">下移</a>
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="categorySubmit()"> 保存 </a-button>
      <a-button @click="technologyModalVisible = false">关闭</a-button>
    </template>
  </a-modal>

  <a-modal v-model:visible="categoryModal" title="技术纬度选取" :width="700" :mask-closable="false">
    <a-table
      :columns="categoryModalColumns"
      :locale="localeA"
      :data-source="categoryModalData"
      @resizeColumn="handleResizeColumn"
      :pagination="false"
      :row-key="(record: any) => record.categoryName"
      :row-selection="rowSelection"
      :customRow="customRow"
      style="height: 300px; overflow-y: auto"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="keepTechnology()"> 确定 </a-button>
      <a-button @click="categoryModal = false">取消</a-button>
    </template>
  </a-modal>

  <!-- 时间轴管理弹窗 -->
  <a-modal v-model:visible="timeOutModalVisible" title="时间轴管理" :width="700" :mask-closable="false">
    <div style="margin-bottom: 16px">
      <a-button type="primary" @click="handleAddTime">添加行</a-button>
    </div>
    <a-table :columns="timeColumns" :data-source="timeData" :pagination="false" style="height: 500px; overflow-y: auto" row-key="key">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'time'">
          <a-input v-model:value="record.time" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a type="link" v-if="paramDisabled" :disabled="paramDisabled">删除</a>
          <a @click="delEnSystemUpload(record)" type="link" v-else>删除</a>
          <a-divider type="vertical" />
          <a @click="timeUpParam(record)" type="link">上移</a>
          <a-divider type="vertical" />
          <a @click="timeDownParam(record)" type="link">下移</a>
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="timeSave"> 保存 </a-button>
      <a-button @click="timeOutModalVisible = false">关闭</a-button>
    </template>
  </a-modal>

  <!-- 编辑弹窗 -->
  <a-modal v-model:visible="editModalVisible" :title="`编辑 ${currentEditRecord.rowId}`" :width="1000" style="height: 500px; overflow-y: auto" :mask-closable="false">
    <div class="edit-form">
      <div v-for="(header, index) in currentPageData.headerJson" :key="index" class="edit-row">
        <div v-if="index % 2 === 0" class="edit-column-pair">
          <!-- 第一列 -->
          <div class="edit-item">
            <span class="edit-label">{{ header }}:</span>
            <a-input v-model:value="editFormData[`${header}`]" placeholder="请输入值" style="width: 300px" />
          </div>

          <!-- 第二列，如果存在 -->
          <div v-if="index + 1 < currentPageData.headerJson.length" class="edit-item">
            <span class="edit-label">{{ currentPageData.headerJson[index + 1] }}:</span>
            <a-input v-model:value="editFormData[`${currentPageData.headerJson[index + 1]}`]" placeholder="请输入值" style="width: 300px" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="saveEdit">确定</a-button>
      <a-button @click="editModalVisible = false">取消</a-button>
    </template>
  </a-modal>

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
</template>

<style lang="less" scoped>
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

// 编辑弹窗样式
.edit-form {
  max-height: 400px;
  overflow-y: auto;
}

.edit-column-pair {
  display: flex;
  margin-bottom: 16px;
}

.edit-item {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.edit-label {
  width: 80px;
  text-align: right;
  margin-right: 10px;
}
</style>
