<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { downloadFileFromStream } from '@/utils/file.ts';
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
const activeKey = ref<string>('1');
const roadSignRange = ref<any>(3);
const roadSignRangeA = ref<any>(undefined);
const roadSignRangeB = ref<any>('');
const roadSignRangeC = ref<any>(undefined);
const selectStr = [
  { label: 3, value: '未来3年' },
  { label: 5, value: '未来5年' },
  { label: 10, value: '未来10年' },
];
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  handleTabChange(1);

  getTaskWorkStatus();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  },
);

async function initPageData() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.signList(data);
  tableList.value = res.data.data.roadSignList;
  roadSignRange.value = res.data.data.roadSignRange;
}

async function submitOk(type: any) {
  Setthesigntime();
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 214;
    const res = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data);
    if (res.data.code == 200) {
      submitCommit();
    }
  }
}
async function Setthesigntime() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.planId = planTaskInfo.value.planId;
  data.roadSignRange = roadSignRange.value;
  const res = await AdminApiProductPlanTaskDesign.saveRoadSignRange(data);
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
const platformList = ref<any>([]);
const productNameList = ref<any>([]);
const yearList = ref<any>([]);
const cardList = ref<any>([]);
async function handleTabChange(key: any) {
  if (key == '1') {
    activeKey.value = '1';
    initPageData();
  } else if (key == '2') {
    const currentYear = new Date().getFullYear();
    if (roadSignRangeB.value == '') {
      roadSignRangeB.value = currentYear;
    }
    activeKey.value = '2';
    let data: any = {};
    data.planId = planTaskInfo.value.planId;
    data.productName = roadSignRangeA.value;
    data.year = roadSignRangeB.value;
    data.productPlatformId = roadSignRangeC.value;
    const res = await AdminApiProductPlanTaskDesign.roadSignThemeCarList(data);
    cardList.value = res.data.data.cardList;
    if (platformList.value.length == 0) {
      platformList.value = res.data.data.platformList;
    }
    if (productNameList.value.length == 0) {
      productNameList.value = [];
      res.data.data.productNameList.forEach((item: any) => {
        productNameList.value.push({
          id: item,
          name: item,
        });
      });
    }
    if (yearList.value.length == 0) {
      yearList.value = [];
      res.data.data.yearList.forEach((item: any) => {
        yearList.value.push({
          id: item,
          name: item,
        });
      });
    }
  }
}

async function query() {
  handleTabChange(2);
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

// 弹框相关状态
const modalVisible = ref<boolean>(false);
const modalVisible2 = ref<boolean>(false);
const productVision = ref<string>('');
const productTarget = ref<string>('');
const themeTableData = ref<any[]>([]);
const currentRecord = ref<any>(null);

// 生成未来5年的年份数据
function generateYearData() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 1; i <= 5; i++) {
    years.push({
      year: currentYear + i,
      coreUserExperience: '',
      intelligence: '',
      environmentalFriendliness: '',
    });
  }
  return years;
}

async function updateSign(record: any) {
  currentRecord.value = record;
  let data: any = {};
  data.combinationId = record.combinationId;

  // 重置表单数据
  productVision.value = '';
  productTarget.value = '';
  themeTableData.value = generateYearData();

  try {
    // 尝试获取现有数据，如果有则填充
    const res = await AdminApiProductPlanTaskDesign.getRoadSignThemeDetail(data);
    if (res.data.code === 200 && res.data.data) {
      productVision.value = res.data.data.visions || '';
      productTarget.value = res.data.data.target || '';
      // 获取addYear值
      const addYear = res.data.data.addYear;
      // 获取主题列表和主题数据
      const themeList = res.data.data.themeList || [];
      themeJson.value = res.data.data.themeJson || [];

      // 根据addYear和roadSignRange生成tableYearsList数据
      tableYearsList.value = [];
      for (let i = 0; i < roadSignRange.value; i++) {
        const currentYear = addYear + i;
        const yearData: any = { years: currentYear };

        // 为每个主题添加数据字段，并从themeList中填充对应年份的值
        themeJson.value.forEach((themeName: any, themeIndex: number) => {
          // 查找当前主题的记录
          const themeRecord = themeList.find((item: any) => item.theme === themeName);
          if (themeRecord) {
            // 计算对应的year字段索引（从1开始）
            const yearFieldIndex = i + 1;
            const yearFieldKey = `year${yearFieldIndex}`;
            // 设置值，如果存在则使用，否则为空字符串
            yearData[themeIndex] = themeRecord[yearFieldKey] || '';
          } else {
            yearData[themeIndex] = '';
          }
        });

        tableYearsList.value.push(yearData);
      }

      // 更新列信息
      columnInfos.value = [];
      columnInfos.value.push({
        title: '时间',
        dataIndex: 'years',
        key: 'years',
        ellipsis: true,
        align: 'left',
        width: 60,
        resizable: true,
      });

      themeJson.value.forEach((item: any, index: number) => {
        columnInfos.value.push({
          title: item,
          dataIndex: index,
          key: index,
          ellipsis: true,
          align: 'left',
          width: 170,
          resizable: true,
          sorter: (a: any, b: any) => sortermethod(a[index], b[index]),
        });
      });
    }
  } catch (error) {
    console.error('获取路标主题详情失败:', error);
  }

  // 显示弹框
  modalVisible.value = true;
}

async function priviewPram(record: any) {
  currentRecord.value = record;
  let data: any = {};
  data.combinationId = record.combinationId;

  // 重置表单数据
  productVision.value = '';
  productTarget.value = '';
  themeTableData.value = generateYearData();

  try {
    // 尝试获取现有数据，如果有则填充
    const res = await AdminApiProductPlanTaskDesign.getRoadSignThemeDetail(data);
    if (res.data.code === 200 && res.data.data) {
      productVision.value = res.data.data.visions || '';
      productTarget.value = res.data.data.target || '';
      // 获取addYear值
      const addYear = res.data.data.addYear;
      // 获取主题列表和主题数据
      const themeList = res.data.data.themeList || [];
      themeJson.value = res.data.data.themeJson;

      // 根据addYear和roadSignRange生成tableYearsList数据
      tableYearsList.value = [];
      for (let i = 0; i < roadSignRange.value; i++) {
        const currentYear = addYear + i;
        const yearData: any = { years: currentYear };

        // 为每个主题添加数据字段，并从themeList中填充对应年份的值
        themeJson.value.forEach((themeName: any, themeIndex: number) => {
          // 查找当前主题的记录
          const themeRecord = themeList.find((item: any) => item.theme === themeName);
          if (themeRecord) {
            // 计算对应的year字段索引（从1开始）
            const yearFieldIndex = i + 1;
            const yearFieldKey = `year${yearFieldIndex}`;
            // 设置值，如果存在则使用，否则为空字符串
            yearData[themeIndex] = themeRecord[yearFieldKey] || '';
          } else {
            yearData[themeIndex] = '';
          }
        });

        tableYearsList.value.push(yearData);
      }

      // 更新列信息
      columnInfos.value = [];
      columnInfos.value.push({
        title: '时间',
        dataIndex: 'years',
        key: 'years',
        ellipsis: true,
        align: 'left',
        width: 60,
        resizable: true,
      });

      themeJson.value.forEach((item: any, index: number) => {
        columnInfos.value.push({
          title: item,
          dataIndex: index,
          key: index,
          ellipsis: true,
          align: 'left',
          width: 170,
          resizable: true,
          sorter: (a: any, b: any) => sortermethod(a[index], b[index]),
        });
      });
    }
  } catch (error) {
    console.error('获取路标主题详情失败:', error);
  }

  // 显示弹框
  modalVisible2.value = true;
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Zdcplb');
}

async function themeManager() {
  // 从已保存的数据中获取时间轴列表
  themeData.value =
    themeJson.value.map((item: string, index: number) => ({
      key: index + 1,
      time: item,
    })) || [];
  timeOutModalVisible.value = true;
}

const handleAddTime = () => {
  // 保存添加前的数据副本，用于重新映射
  const oldTableYearsList = [...tableYearsList.value];

  // 添加新主题行
  themeData.value.push({
    key: themeData.value.length + 1,
    time: '',
  });

  // 关键点：添加新主题后，重新映射表格数据
  // 1. 清空现有表格数据
  tableYearsList.value = [];

  // 2. 重新构建themeJson
  themeJson.value = themeData.value.map(item => item.time);

  // 3. 为每个年份重新映射数据，新主题列默认为空字符串
  const startYear = 2025;
  const newIndex = themeJson.value.length - 1; // 新添加的主题索引
  const stringNewIndex = newIndex.toString();

  for (let i = 0; i < roadSignRange.value; i++) {
    const currentYear = startYear + i;
    const newYearData: any = { years: currentYear };

    // 查找旧数据中相同年份的记录
    const existingYearData = oldTableYearsList.find((item: any) => item.years === currentYear);

    // 核心数据映射逻辑：保留原有主题数据，新主题列设置为空
    themeJson.value.forEach((_, index: number) => {
      const stringIndex = index.toString();

      // 如果是新添加的主题列，设置为空字符串
      if (index === newIndex) {
        newYearData[stringIndex] = '';
      } else {
        // 从旧数据中获取原有的主题数据
        if (existingYearData) {
          newYearData[stringIndex] =
            existingYearData[stringIndex] !== undefined ? existingYearData[stringIndex] : existingYearData[index] !== undefined ? existingYearData[index] : '';
        } else {
          newYearData[stringIndex] = '';
        }
      }
    });

    tableYearsList.value.push(newYearData);
  }

  // 强制更新列配置和表格渲染
  updateColumns();
  nextTick(() => {
    updateColumns();
    tableYearsList.value = [...tableYearsList.value];
  });
};

// 删除行功能
const delEnSystemUpload = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      const index = themeData.value.findIndex(item => item.key === record.key);
      if (index > -1) {
        // 保存删除前的数据副本，用于重新映射
        const oldTableYearsList = [...tableYearsList.value];

        // 删除主题项
        themeData.value.splice(index, 1);
        // 重新排序序号
        themeData.value.forEach((item, i) => {
          item.key = i + 1;
        });

        // 关键点：删除主题后，重新映射表格数据
        // 1. 清空现有表格数据
        tableYearsList.value = [];

        // 2. 重新构建themeJson
        themeJson.value = themeData.value.map(item => item.time);

        // 3. 为每个年份重新映射数据
        const startYear = 2025;
        for (let i = 0; i < roadSignRange.value; i++) {
          const currentYear = startYear + i;
          const newYearData: any = { years: currentYear };

          // 查找旧数据中相同年份的记录
          const existingYearData = oldTableYearsList.find((item: any) => item.years === currentYear);

          // 核心数据映射逻辑：根据新的主题顺序重新映射数据
          themeJson.value.forEach((_, newIndex: number) => {
            // 转换为字符串索引
            const stringNewIndex = newIndex.toString();

            // 计算原始索引（跳过已删除的索引）
            let originalIndex = newIndex;
            let originalStringIndex = originalIndex.toString();

            // 如果新索引大于等于删除的索引，需要调整原始索引
            if (originalIndex >= index) {
              originalIndex += 1;
              originalStringIndex = originalIndex.toString();
            }

            // 从旧数据中获取对应索引的值
            if (existingYearData) {
              // 优先检查字符串索引，然后检查数字索引
              newYearData[stringNewIndex] =
                existingYearData[originalStringIndex] !== undefined
                  ? existingYearData[originalStringIndex]
                  : existingYearData[originalIndex] !== undefined
                    ? existingYearData[originalIndex]
                    : '';
            } else {
              newYearData[stringNewIndex] = '';
            }
          });

          tableYearsList.value.push(newYearData);
        }

        // 强制更新列配置和表格渲染
        updateColumns();
        nextTick(() => {
          updateColumns();
          tableYearsList.value = [...tableYearsList.value];
        });
      }
      message.success('删除成功!');
    },
  });
};

// 上移功能
const timeUpParam = (record: any) => {
  const index = themeData.value.findIndex(item => item.key === record.key);
  if (index > 0) {
    // 保存移动前的数据副本，用于重新映射
    const oldTableYearsList = [...tableYearsList.value];

    // 交换位置
    const temp = themeData.value[index];
    themeData.value[index] = themeData.value[index - 1];
    themeData.value[index - 1] = temp;
    // 重新排序序号
    themeData.value.forEach((item, i) => {
      item.key = i + 1;
    });

    // 关键点：交换主题顺序后，重新映射表格数据
    // 1. 清空现有表格数据
    tableYearsList.value = [];

    // 2. 重新构建themeJson
    themeJson.value = themeData.value.map(item => item.time);

    // 3. 为每个年份重新映射数据
    const startYear = 2025;
    for (let i = 0; i < roadSignRange.value; i++) {
      const currentYear = startYear + i;
      const newYearData: any = { years: currentYear };

      // 查找旧数据中相同年份的记录
      const existingYearData = oldTableYearsList.find((item: any) => item.years === currentYear);

      // 核心数据映射逻辑：处理上移操作后的数据映射
      themeJson.value.forEach((_, newIndex: number) => {
        // 转换为字符串索引
        const stringNewIndex = newIndex.toString();

        // 计算原始索引
        let originalIndex = newIndex;
        let originalStringIndex = originalIndex.toString();

        // 处理上移后的索引映射：
        // - 如果新索引是index-1，原始索引应该是index
        // - 如果新索引是index，原始索引应该是index-1
        // - 其他情况保持不变
        if (newIndex === index - 1) {
          originalIndex = index;
          originalStringIndex = index.toString();
        } else if (newIndex === index) {
          originalIndex = index - 1;
          originalStringIndex = (index - 1).toString();
        }

        // 从旧数据中获取对应索引的值
        if (existingYearData) {
          // 优先检查字符串索引，然后检查数字索引
          newYearData[stringNewIndex] =
            existingYearData[originalStringIndex] !== undefined
              ? existingYearData[originalStringIndex]
              : existingYearData[originalIndex] !== undefined
                ? existingYearData[originalIndex]
                : '';
        } else {
          newYearData[stringNewIndex] = '';
        }
      });

      tableYearsList.value.push(newYearData);
    }

    // 强制更新列配置和表格渲染
    updateColumns();
    nextTick(() => {
      updateColumns();
      tableYearsList.value = [...tableYearsList.value];
    });
  }
};

// 下移功能
const timeDownParam = (record: any) => {
  const index = themeData.value.findIndex(item => item.key === record.key);
  if (index < themeData.value.length - 1) {
    // 保存移动前的数据副本，用于重新映射
    const oldTableYearsList = [...tableYearsList.value];

    // 交换位置
    const temp = themeData.value[index];
    themeData.value[index] = themeData.value[index + 1];
    themeData.value[index + 1] = temp;
    // 重新排序序号
    themeData.value.forEach((item, i) => {
      item.key = i + 1;
    });

    // 关键点：交换主题顺序后，重新映射表格数据
    // 1. 清空现有表格数据
    tableYearsList.value = [];

    // 2. 重新构建themeJson
    themeJson.value = themeData.value.map(item => item.time);

    // 3. 为每个年份重新映射数据
    const startYear = 2025;
    for (let i = 0; i < roadSignRange.value; i++) {
      const currentYear = startYear + i;
      const newYearData: any = { years: currentYear };

      // 查找旧数据中相同年份的记录
      const existingYearData = oldTableYearsList.find((item: any) => item.years === currentYear);

      // 核心数据映射逻辑：处理下移操作后的数据映射
      themeJson.value.forEach((_, newIndex: number) => {
        // 转换为字符串索引
        const stringNewIndex = newIndex.toString();

        // 计算原始索引
        let originalIndex = newIndex;
        let originalStringIndex = originalIndex.toString();

        // 处理下移后的索引映射：
        // - 如果新索引是index，原始索引应该是index+1
        // - 如果新索引是index+1，原始索引应该是index
        // - 其他情况保持不变
        if (newIndex === index) {
          originalIndex = index + 1;
          originalStringIndex = (index + 1).toString();
        } else if (newIndex === index + 1) {
          originalIndex = index;
          originalStringIndex = index.toString();
        }

        // 从旧数据中获取对应索引的值
        if (existingYearData) {
          // 优先检查字符串索引，然后检查数字索引
          newYearData[stringNewIndex] =
            existingYearData[originalStringIndex] !== undefined
              ? existingYearData[originalStringIndex]
              : existingYearData[originalIndex] !== undefined
                ? existingYearData[originalIndex]
                : '';
        } else {
          newYearData[stringNewIndex] = '';
        }
      });

      tableYearsList.value.push(newYearData);
    }

    // 强制更新列配置和表格渲染
    updateColumns();
    nextTick(() => {
      updateColumns();
      tableYearsList.value = [...tableYearsList.value];
    });
  }
};

// 保存功能
const timeSave = async () => {
  try {
    const emptyItems = themeData.value.filter(item => !item.time.trim());
    if (emptyItems.length > 0) {
      message.warning('请填写所有主题名称');
      return;
    }
    const themeList = themeData.value.map(item => item.time);
    themeJson.value = themeList;

    // 更新表格列信息
    updateColumns();

    message.success('保存成功');
    timeOutModalVisible.value = false;
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败，请重试');
  }
};

// 更新表格列信息
const updateColumns = () => {
  columnInfos.value = [];
  columnInfos.value.push({
    title: '时间',
    dataIndex: 'years',
    key: 'years',
    width: 80,
    align: 'center',
  });
  themeJson.value.forEach((item: string, index: number) => {
    columnInfos.value.push({
      title: item,
      dataIndex: index.toString(),
      key: index.toString(),
      width: 180,
      align: 'center',
    });
  });
};

// 开始编辑单元格
const edit = (record: any, column: any) => {
  editingKey.value = `${record.years}-${column.dataIndex}`;
};

// 检查并保存编辑
const checkEdit = (record: any, column: any) => {
  editingKey.value = '';
};

// 处理输入变化
const handleChange = (record: any, column: any) => {
  // 这里可以添加验证逻辑
  console.log('内容已更新:', record.years, column.dataIndex, record[column.dataIndex]);
};

// 保存弹框数据
async function handleSave() {
  if (!productVision.value.trim()) {
    message.error('请输入产品愿景');
    return;
  }
  if (!productTarget.value.trim()) {
    message.error('请输入目标');
    return;
  }

  // 构建符合API格式的参数
  let data: any = {
    combinationId: currentRecord.value.combinationId,
    id: currentRecord.value.id,
    visions: productVision.value,
    target: productTarget.value,
    roadSignRange: roadSignRange.value,
    themeList: [], // 将表格数据转换为themelist格式
    themeJson: themeJson.value, // 包含所有主题名称的数组
  };

  // 构建themelist数组
  themeData.value.forEach((themeItem: any, themeIndex: number) => {
    const themeObj: any = {
      combinationId: currentRecord.value.combinationId,
      theme: themeItem.time,
      addYear: roadSignRange.value > 0 ? 2025 : '', // 假设起始年份为2025
      // 添加year1到year10字段
      year1: '',
      year2: '',
      year3: '',
      year4: '',
      year5: '',
      year6: '',
      year7: '',
      year8: '',
      year9: '',
      year10: '',
    };

    // 从tableYearsList中提取对应主题和年份的数据
    tableYearsList.value.forEach((yearItem: any, yearIndex: number) => {
      const yearKey = `year${yearIndex + 1}`;
      if (yearItem[themeIndex.toString()] !== undefined && yearKey in themeObj) {
        themeObj[yearKey] = yearItem[themeIndex.toString()];
      }
    });

    data.themeList.push(themeObj);
  });

  try {
    const res = await AdminApiProductPlanTaskDesign.saveRoadSignTheme(data);
    if (res.data.code === 200) {
      message.success('保存成功');
      modalVisible.value = false;
      modalVisible2.value = false;
      // 刷新列表数据
      initPageData();
    } else {
      message.error('保存失败：' + (res.data.message || '未知错误'));
    }
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败');
  }
}

async function exportExcel() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.signExcelExport(data);
  const fileName = '产品路标.xlsx';
  downloadFileFromStream(res, fileName);
}

const tableList = ref<any>([]);
const tableYearsList = ref<any>([]);
const themeJson = ref<any>([]);
const themeData = ref<any>([]);
const timeOutModalVisible = ref(false);
const editingKey = ref<string>(''); // 用于标记当前编辑的单元格
const timeColumns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    width: 60,
    align: 'center',
  },
  {
    title: '主题',
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
const columnInfos = ref<TableColumnType<any>[]>([
  {
    title: '时间',
    key: 'years',
    width: 60,
    align: 'center',
  },
]);
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
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productPlatform, b.productPlatform),
  },
  {
    title: '主型产品',
    dataIndex: 'mainProduct',
    key: 'mainProduct',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.mainProduct, b.mainProduct),
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productName, b.productName),
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
  },
  {
    title: '愿景',
    dataIndex: 'visions',
    key: 'visions',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.visions, b.visions),
  },
  {
    title: '目标',
    dataIndex: 'target',
    key: 'target',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.target, b.target),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
  },
]);

defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">产品路标规划</span>
      <a-button type="primary" @click="exportExcel()" style="margin-left: 20px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
    </div>
    <div style="margin-left: 15px; margin-top: -15px">
      <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
        <a-tab-pane key="1" tab="产品路标设置">
          <div>
            <span style="margin-left: 1px; font-weight: 500; font-size: 15px">路标时间设置：</span>
            <a-select v-model:value="roadSignRange" placeholder="请选择路标时间" style="width: 200px; margin-top: 10px">
              <a-select-option v-for="option in selectStr" :key="option.label" :value="option.label">
                {{ option.value }}
              </a-select-option>
            </a-select>
          </div>
          <a-div>
            <a-table
              :scroll="{ x: 'max-content' }"
              :locale="localeA"
              @resizeColumn="handleResizeColumn"
              style="margin-left: 1px; margin-right: 10px; overflow-y: auto; height: 390px; margin-top: 10px"
              :columns="columns"
              bordered
              :pagination="false"
              :data-source="tableList">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                  {{ index + 1 }}
                </template>
                <template v-if="column.dataIndex === 'action'">
                  <a v-if="paramDisabled" :disabled="paramDisabled" type="link">设置路标</a>
                  <a v-else @click="updateSign(record)" type="link">设置路标</a>
                  <a-divider type="vertical" />
                  <a @click="priviewPram(record)" type="link">详情</a>
                </template>
              </template>
            </a-table>
          </a-div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="产品路标卡片">
          <div>
            <span style="margin-left: 1px; font-weight: 500; font-size: 15px">平台：</span>
            <a-select v-model:value="roadSignRangeC" allow-clear placeholder="请选择路标时间" style="width: 200px; margin-top: 10px">
              <a-select-option v-for="option in platformList" :key="option.id" :value="option.id">
                {{ option.name }}
              </a-select-option>
            </a-select>
            <span style="margin-left: 20px; font-weight: 500; font-size: 15px">产品：</span>
            <a-select v-model:value="roadSignRangeA" allow-clear placeholder="请选择路标时间" style="width: 200px; margin-top: 10px">
              <a-select-option v-for="option in productNameList" :key="option.name" :value="option.name">
                {{ option.name }}
              </a-select-option>
            </a-select>
            <span style="margin-left: 20px; font-weight: 500; font-size: 15px">年度：</span>
            <a-select v-model:value="roadSignRangeB" allow-clear placeholder="请选择路标时间" style="width: 200px; margin-top: 10px">
              <a-select-option v-for="option in yearList" :key="option.name" :value="option.name">
                {{ option.name }}
              </a-select-option>
            </a-select>
            <a-button type="primary" style="margin-left: 20px" @click="query()"> <EpcIcon type="icon-fangdajing" style="font-size: 16px" />查询</a-button>
          </div>
          <div style="background-color: ffffff; width: 1000px; height: 580px">
            <div class="calculateItem" v-for="item in cardList" :key="item.id">
              <div class="Img-box">
                <div style="width: 100%; text-align: center; font-weight: 700; margin-top: 5px">{{ item.productName }}</div>
                <ul style="margin-left: 20px; margin-top: 5px">
                  <li style="line-height: 25px" v-for="(value, key) of item.themeData" :key="key">
                    {{ key }}： <span style="margin-left: 10px">{{ value }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>

  <!-- 产品路标设置弹框 -->
  <div class="Zdcplb" v-dragModal>
    <a-modal v-model:visible="modalVisible" :getContainer="customGetContainer" title="XXX产品路标设置" :footer="null" width="800px" destroy-on-close>
      <div class="modal-content">
        <!-- 产品愿景 -->
        <div class="form-item">
          <label class="form-label required">产品愿景</label>
          <a-textarea v-model:value="productVision" placeholder="请输入产品愿景" style="width: 100%" />
        </div>

        <!-- 目标 -->
        <div class="form-item">
          <label class="form-label required">目标</label>
          <a-textarea v-model:value="productTarget" placeholder="请输入目标" style="width: 100%" />
        </div>

        <!-- 路标主题定义 -->
        <div class="theme-section">
          <div class="theme-header">
            <span>路标主题定义</span>
            <a-button type="primary" size="small" @click="themeManager">主题管理</a-button>
          </div>
        </div>
        <div>
          <a-table
            :scroll="{ x: 'max-content' }"
            :locale="localeA"
            @resizeColumn="handleResizeColumn"
            style="margin-left: 1px; margin-right: 10px; overflow-y: auto; height: 410px; margin-top: 10px"
            :columns="columnInfos"
            bordered
            :pagination="false"
            :data-source="tableYearsList"
            row-key="years">
            <template #bodyCell="{ column, record, index }">
              <!-- 跳过时间列，只对主题列实现编辑功能 -->
              <template v-if="column.dataIndex !== 'years'">
                <div class="editable-cell">
                  <div v-if="editingKey === `${record.years}-${column.dataIndex}`" class="editable-cell-input-wrapper">
                    <a-input
                      v-model:value="record[column.dataIndex]"
                      @change="handleChange(record, column)"
                      @pressEnter="checkEdit(record, column)"
                      @blur="checkEdit(record, column)"
                      placeholder="请输入内容" />
                  </div>
                  <div v-else class="editable-cell-text-wrapper" @click="edit(record, column)">
                    {{ record[column.dataIndex] }}
                  </div>
                </div>
              </template>
            </template>
          </a-table>
        </div>

        <!-- 底部按钮 -->
        <div class="modal-footer">
          <a-button type="primary" @click="handleSave">确定</a-button>
          <a-button @click="modalVisible = false">取消</a-button>
        </div>
      </div>
    </a-modal>
  </div>

  <a-modal v-model:visible="modalVisible2" title="XXX产品路标设置" :footer="null" width="800px" destroy-on-close>
    <div class="modal-content">
      <!-- 产品愿景 -->
      <div class="form-item">
        <label class="form-label required">产品愿景</label>
        <a-textarea v-model:value="productVision" placeholder="请输入产品愿景" style="width: 100%" :disabled="true" />
      </div>

      <!-- 目标 -->
      <div class="form-item">
        <label class="form-label required">目标</label>
        <a-textarea v-model:value="productTarget" placeholder="请输入目标" style="width: 100%" :disabled="true" />
      </div>

      <!-- 路标主题定义 -->
      <div class="theme-section">
        <div class="theme-header">
          <span>路标主题定义</span>
        </div>
      </div>
      <div>
        <a-table
          :scroll="{ x: 'max-content' }"
          :locale="localeA"
          @resizeColumn="handleResizeColumn"
          style="margin-left: 1px; margin-right: 10px; overflow-y: auto; height: 410px; margin-top: 10px"
          :columns="columnInfos"
          bordered
          :pagination="false"
          :data-source="tableYearsList"
          row-key="years">
          <template #bodyCell="{ column, record, index }">
            <!-- 跳过时间列，只对主题列实现编辑功能 -->
            <template v-if="column.dataIndex !== 'years'">
              <div class="editable-cell">
                <div v-if="editingKey === `${record.years}-${column.dataIndex}`" class="editable-cell-input-wrapper">
                  <a-input
                    v-model:value="record[column.dataIndex]"
                    @change="handleChange(record, column)"
                    @pressEnter="checkEdit(record, column)"
                    @blur="checkEdit(record, column)"
                    placeholder="请输入内容" />
                </div>
                <div v-else>
                  {{ record[column.dataIndex] }}
                </div>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- 底部按钮 -->
      <div class="modal-footer">
        <a-button type="primary" @click="handleSave">确定</a-button>
        <a-button @click="modalVisible2 = false">取消</a-button>
      </div>
    </div>
  </a-modal>
  <!-- 时间轴管理弹窗 -->
  <a-modal class="Zdcplb2" v-model:visible="timeOutModalVisible" title="时间轴管理" :width="700" :mask-closable="false">
    <div style="margin-bottom: 16px">
      <a-button type="primary" @click="handleAddTime">添加行</a-button>
    </div>
    <a-table :columns="timeColumns" :data-source="themeData" :pagination="false" style="height: 500px; overflow-y: auto" row-key="key">
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
</template>

<style lang="less" scoped>
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

/* 可编辑单元格样式 */
:deep(.editable-cell) {
  position: relative;
}

:deep(.editable-cell-input-wrapper),
:deep(.editable-cell-text-wrapper) {
  padding-right: 24px;
}

:deep(.editable-cell-text-wrapper) {
  padding: 5px 24px 5px 5px;
  cursor: pointer;
  min-height: 32px;
  display: flex;
  align-items: center;
}

:deep(.editable-cell-text-wrapper:hover) {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

:deep(.editable-cell-input-wrapper .ant-input) {
  margin: 0;
  text-align: center;
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

.calculateItem {
  position: relative;
  width: 290px;
  float: left;
  margin-top: 30px;
  margin-left: 26px;
  margin-bottom: 10px;
  margin-right: 10px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: block;
  background: #cbdcf5;
  box-shadow: 0 0 15px 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
}

.calculateItem:hover {
  transform: translateY(-10px);
  background: #1971ff;
  color: #fff;

  .calclation-content {
    color: #fff;
    display: flex;
    justify-content: space-between;
  }
  .calclation-content2 {
    color: #fff;
  }
}

.Img-box {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.bodyPageStyle {
  background-color: #ffffff !important;
  overflow-y: auto;
}

/* 弹框样式 */
.modal-content {
  padding: 0 10px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: inline-block;
  width: 100px;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-label.required::after {
  content: '*';
  color: #ff4d4f;
  margin-left: 4px;
}

.theme-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.theme-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #f0f0f0;
}

.theme-table th,
.theme-table td {
  border: 1px solid #f0f0f0;
  padding: 8px 12px;
  text-align: left;
}

.theme-table th {
  background-color: #fafafa;
  font-weight: 500;
}

.theme-table td {
  height: 40px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.modal-footer .ant-btn {
  margin-left: 10px;
}

.Zdcplb {
  position: relative;
  z-index: 1000;
}

.Zdcplb2 {
  z-index: 1500;
}
</style>
