<script setup lang="ts">
// 产品排序打分
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { getProductgroupingStyle } from '@/style/StatusStyle';
import { Productgroupingdisplay } from '@/utils/Requirementtablejudgment';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const tableHeight = ref(window.innerHeight - 380);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    width: '235',
    height: '145',
    style: { marginTop: '10px' },
  }),
});
const activeKey = ref<string>('1');
const demandrow = ref<any>({});
const datasource = ref([]);
const dependdatasource = ref([]);
const Detailsflag = ref<boolean>(false);
const userStore = useUserStore();
const emit = defineEmits(['close', 'refreshTableData']);
interface OptionrItem {
  label: string;
  value: number;
}
const divideList = ref<OptionrItem[]>([
  {
    label: '1分',
    value: 1,
  },
  {
    label: '3分',
    value: 3,
  },
  {
    label: '5分',
    value: 5,
  },
]);

/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
// 市场
const marketflag = ref<boolean>(false);
const marketcolumnskey = ref(['marketSpace', 'marketGrowth', 'pressure', 'strategicValue', 'competition', 'threat']);
// 竞争
const competitionflag = ref<boolean>(false);
const competitioncolumnskey = ref(['marketShare', 'advantages', 'brandAdvantage']);
// 财务
const financeflag = ref<boolean>(false);
const financecolumnskey = ref(['developmentCost', 'yieldRate', 'proportionIncome']);
const loading = ref<boolean>(false);
const columns = ref<any>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    align: 'center',
    customRender({ text, record, index }) {
      return h('div', {}, [h('span', { innerText: index + 1 })]);
    },
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    ellipsis: true,
    align: 'center',
    width: 200,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productName, b.productName),
  },
  {
    title: '产品分组',
    dataIndex: 'productGroup',
    key: 'productGroup',
    ellipsis: true,
    align: 'center',
    width: 180,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productGroup, b.productGroup),
  },
  {
    title: '市场吸引力',
    dataIndex: 'key',
    key: 'key',
    children: [
      {
        title: '市场空间',
        dataIndex: 'marketSpace',
        key: 'marketSpace',
        ellipsis: true,
        align: 'center',
        width: 100,
        resizable: true,
      },
      {
        title: '市场增长',
        dataIndex: 'marketGrowth',
        key: 'marketGrowth',
        ellipsis: true,
        align: 'center',
        width: 100,
        resizable: true,
      },
      {
        title: '客户/供应商压力',
        dataIndex: 'pressure',
        key: 'pressure',
        ellipsis: true,
        align: 'center',
        width: 150,
        resizable: true,
      },
      {
        title: '直接/间接竞争',
        dataIndex: 'competition',
        key: 'competition',
        ellipsis: true,
        align: 'center',
        width: 130,
        resizable: true,
      },
      {
        title: '进入的威胁',
        dataIndex: 'threat',
        key: 'threat',
        ellipsis: true,
        align: 'center',
        width: 120,
        resizable: true,
      },
      {
        title: '战略价值',
        dataIndex: 'strategicValue',
        key: 'strategicValue',
        ellipsis: true,
        align: 'center',
        width: 100,
        resizable: true,
      },
    ],
  },
  {
    title: '竞争地位',
    dataIndex: 'key1',
    key: 'key1',
    children: [
      {
        title: '市场份额',
        dataIndex: 'marketShare',
        key: 'marketShare',
        ellipsis: true,
        align: 'center',
        width: 100,
        resizable: true,
      },
      {
        title: '产品优势',
        dataIndex: 'advantages',
        key: 'advantages',
        ellipsis: true,
        align: 'center',
        width: 100,
        resizable: true,
      },
      {
        title: '品牌优势',
        dataIndex: 'brandAdvantage',
        key: 'brandAdvantage',
        ellipsis: true,
        align: 'center',
        width: 100,
        resizable: true,
      },
    ],
  },
  {
    title: '财务',
    dataIndex: 'key2',
    key: 'key2',
    children: [
      {
        title: '开发费用',
        dataIndex: 'developmentCost',
        key: 'developmentCost',
        ellipsis: true,
        align: 'center',
        width: 100,
        resizable: true,
      },
      {
        title: '税前收益率',
        dataIndex: 'yieldRate',
        key: 'yieldRate',
        ellipsis: true,
        align: 'center',
        width: 110,
        resizable: true,
      },
      {
        title: '收入比重',
        dataIndex: 'proportionIncome',
        key: 'proportionIncome',
        ellipsis: true,
        align: 'center',
        width: 100,
        resizable: true,
      },
    ],
  },
]);
const dependcolumns = ref<any>([]);
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
function setdependcolumns() {
  dependcolumns.value = [
    {
      title: WeiI18n.t('序号').value,
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 60,
      customRender({ text, record, index }) {
        return h('div', {}, [h('span', { innerText: index + 1 })]);
      },
    },
    {
      title: '依赖关系得分',
      dataIndex: 'dependTotalScore',
      key: 'dependTotalScore',
      ellipsis: true,
      align: 'center',
      width: 100,
      resizable: true,
      sorter: (a: any, b: any) => sortermethod(a.dependTotalScore, b.dependTotalScore),
    },
    {
      title: '被依赖产品',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
      align: 'center',
      width: 150,
      resizable: true,
      sorter: (a: any, b: any) => sortermethod(a.productName, b.productName),
    },
    {
      title: '依赖程度统计',
      dataIndex: 'key',
      key: 'key',
      children: [
        {
          title: '很强依赖',
          dataIndex: 'highDependProductJson',
          key: 'highDependProductJson',
          ellipsis: true,
          align: 'center',
          width: 100,
          resizable: true,
          sorter: (a: any, b: any) => sortermethod(a.highDependProductJson, b.highDependProductJson),
        },
        {
          title: '较强依赖',
          dataIndex: 'middleDependProductJson',
          key: 'middleDependProductJson',
          ellipsis: true,
          align: 'center',
          width: 100,
          resizable: true,
          sorter: (a: any, b: any) => sortermethod(a.middleDependProductJson, b.middleDependProductJson),
        },
        {
          title: '一定程度依赖',
          dataIndex: 'lowDependProductJson',
          key: 'lowDependProductJson',
          ellipsis: true,
          align: 'center',
          width: 100,
          resizable: true,
          sorter: (a: any, b: any) => sortermethod(a.lowDependProductJson, b.lowDependProductJson),
        },
      ],
    },
  ];
}
/**
 * 详情
 * @param row
 * @param type
 */
const handleModalChange = async (row: any, type: string) => {
  activeKey.value = '1';
  marketflag.value = false;
  competitionflag.value = false;
  financeflag.value = false;
  setdependcolumns();
  if (row) {
    if (row.type === '市场-产品规划排序打分') {
      marketflag.value = true;
    } else if (row.type === '研发-产品规划排序打分') {
      competitionflag.value = true;
    } else if (row.type === '财务-产品规划排序打分') {
      financeflag.value = true;
    }
    loading.value = true;
    try {
      demandrow.value = row;
      if (type == 'detail') {
        Detailsflag.value = true;
      } else {
        Detailsflag.value = false;
      }
      const res = await AdminApiSystemProductPlanningscoring.scoreList({ planId: row.planId });
      if (res.data.code == 200) {
        let data = res.data.data;
        if (data.length > 0) {
          data.forEach((item: any, index: number) => {
            if (item.highDependProductJson == null) {
              item.highDependProductJson = [];
            }
            if (item.middleDependProductJson == null) {
              item.middleDependProductJson = [];
            }
            if (item.lowDependProductJson == null) {
              item.lowDependProductJson = [];
            }
            dependcolumns.value.push({
              title: item.productName,
              dataIndex: 'divide' + (index + 1),
              key: 'divide' + (index + 1),
              align: 'center',
              width: 160,
              resizable: true,
            });
          });
        }
        datasource.value = data;
        dependdatasource.value = data;
        Processdropdown();
      }
    } catch (error) {
      console.log(error, 'error');
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
};
// 回显时处理分数选项逻辑
function Processdropdown() {
  dependdatasource.value.forEach((item: any) => {
    dependcolumns.value.forEach((ite: any) => {
      if (item.highDependProductJson.length > 0) {
        item.highDependProductJson.forEach((item2: any) => {
          if (ite.title == item2) {
            item[ite.key] = '很强依赖';
          }
        });
      }
      if (item.middleDependProductJson.length > 0) {
        item.middleDependProductJson.forEach((item2: any) => {
          if (ite.title == item2) {
            item[ite.key] = '较强依赖';
          }
        });
      }
      if (item.lowDependProductJson.length > 0) {
        item.lowDependProductJson.forEach((item2: any) => {
          if (ite.title == item2) {
            item[ite.key] = '一定程度依赖';
          }
        });
      }
    });
  });
}

/**
 * 校验产品数组中是否存在必填字段为空的对象
 * @param products 待校验的产品数组
 * @returns { isPass: boolean, errorMsg: string } 校验结果（是否通过 + 错误信息）
 */
const validateProductFields = (products: Array<Record<string, any>>): { isPass: boolean; errorMsg: string } => {
  for (const product of products) {
    const { productName } = product; // 获取产品名称用于错误提示
    let arr: any = [];
    if (marketflag.value) {
      arr = marketcolumnskey.value;
    } else if (competitionflag.value) {
      arr = competitioncolumnskey.value;
    } else if (financeflag.value) {
      arr = financecolumnskey.value;
    }
    // 遍历每个必填字段检查是否为空
    for (const field of arr) {
      const value = product[field];
      // 判断空值场景：null、undefined、空字符串（根据实际需求调整）
      if (value === null || value === undefined || value === '') {
        return {
          isPass: false,
          errorMsg: `要素打分产品名称 ${productName || '未知产品'} 有打分项未输入，请填写完全部字段后重试`,
        };
      }
    }
  }
  // 所有字段均通过校验
  return { isPass: true, errorMsg: '' };
};
function deletedivide(originalArray: any[]) {
  // 处理后数组（删除含 divide 的字段）
  const filteredArray = originalArray.map(item => {
    // 遍历对象的每个键，过滤掉含 'divide' 的字段
    const newItem: any = {};
    for (const key in item) {
      // 若键名不包含 'divide'（区分大小写，如需忽略大小写可改为 key.toLowerCase().includes('divide')）
      if (!key.includes('divide')) {
        newItem[key] = item[key];
      }
    }
    return newItem;
  });
  return filteredArray;
}
// 检测是否存在空的 "divide" 字段
function hasEmptyDivideField(data: any) {
  const flag = data.some((item: any) => {
    // 遍历对象的所有键名
    return Object.keys(item).some(key => {
      // 筛选键名包含 "divide" 的字段
      if (key.includes('divide')) {
        const value = item[key];
        // 判断是否为空值（null/undefined/空字符串）
        return value === null || value === undefined || value === '';
      }
      return false;
    });
  });
  return flag;
}

const onSubmitFormData = async (type: string) => {
  if (type == 'submit') {
    const { isPass, errorMsg } = validateProductFields(datasource.value);
    if (!isPass) {
      message.error(errorMsg);
      return; // 终止后续代码执行
    }
    // 若存在空字段，提示并终止后续逻辑
    if (hasEmptyDivideField(dependdatasource.value)) {
      message.error('依赖打分有打分项未选择，请填写完全部字段后重试');
      return; // 若在函数中，可直接 return
    }
  }
  let data: any = {
    planId: demandrow.value.planId,
    processTaskId: demandrow.value.id,
    scoreInfoList: [],
  };
  data.scoreInfoList = deletedivide(datasource.value);
  if (type == 'save') {
    data.saveStatus = 1;
    Saveandsubmitform(data);
  } else {
    data.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该打分吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        Saveandsubmitform(data);
        emit('close', false);
      },
    });
  }
};
async function Saveandsubmitform(data: any) {
  const res = await AdminApiSystemProductPlanningscoring.updateScoreList(data);
  if (res.data.code == 200) {
    message.success('操作成功');
    emit('refreshTableData');
  }
}
function DependencyScore(record: any, column: any) {
  let dependTotalScore = 0;
  const { lowDependProductJson, middleDependProductJson, highDependProductJson } = record;
  if (lowDependProductJson && middleDependProductJson && highDependProductJson) {
    dependTotalScore = Number(lowDependProductJson.length) * 1 + Number(middleDependProductJson.length) * 3 + Number(highDependProductJson.length) * 5;
  }
  record[column.dataIndex] = dependTotalScore;
  return dependTotalScore;
}
function NumberDependencies(record: any, column: any, dependType: string) {
  let strongDependCount = 0;
  const divideFields: Record<string, string> = {};
  // 遍历对象筛选含 'divide' 的字段并统计
  Object.entries(record).forEach(([key, value]) => {
    if (key.includes('divide') && typeof value === 'string') {
      divideFields[key] = value; // 收集divide字段
      if (value === dependType) strongDependCount++; // 累加次数
    }
  });
  return strongDependCount;
}
function divideflag(record: any, column: any, index: any) {
  let flag = false;
  const lastChar = column.key[column.key.length - 1];
  if (index + 1 == lastChar) {
    flag = true;
  }
  return flag;
}
// 下拉时处理分数选项逻辑
function handleChange(key: any, record: any, column: any) {
  if (key == '很强依赖') {
    record.highDependProductJson.push(column.title);
    record.highDependProductJson = [...new Set(record.highDependProductJson)];
    if (record.middleDependProductJson && record.middleDependProductJson.length > 0 && record.middleDependProductJson.includes(column.title)) {
      record.middleDependProductJson = record.middleDependProductJson.filter((item: any) => item !== column.title);
    }
    if (record.lowDependProductJson && record.lowDependProductJson.length > 0 && record.lowDependProductJson.includes(column.title)) {
      record.lowDependProductJson = record.lowDependProductJson.filter((item: any) => item !== column.title);
    }
  } else if (key == '较强依赖') {
    record.middleDependProductJson.push(column.title);
    record.middleDependProductJson = [...new Set(record.middleDependProductJson)];
    if (record.highDependProductJson && record.highDependProductJson.length > 0 && record.highDependProductJson.includes(column.title)) {
      record.highDependProductJson = record.highDependProductJson.filter((item: any) => item !== column.title);
    }
    if (record.lowDependProductJson && record.lowDependProductJson.length > 0 && record.lowDependProductJson.includes(column.title)) {
      record.lowDependProductJson = record.lowDependProductJson.filter((item: any) => item !== column.title);
    }
  } else if (key == '一定程度依赖') {
    record.lowDependProductJson.push(column.title);
    record.lowDependProductJson = [...new Set(record.lowDependProductJson)];
    if (record.highDependProductJson && record.highDependProductJson.length > 0 && record.highDependProductJson.includes(column.title)) {
      record.highDependProductJson = record.highDependProductJson.filter((item: any) => item !== column.title);
    }
    if (record.middleDependProductJson && record.middleDependProductJson.length > 0 && record.middleDependProductJson.includes(column.title)) {
      record.middleDependProductJson = record.middleDependProductJson.filter((item: any) => item !== column.title);
    }
  }
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('close', false);
}
const tabBarStyle = {
  position: 'sticky', // 关键属性：粘滞定位
  top: 0, // 粘住容器顶部
  zIndex: 10, // 避免被内容遮挡
  background: '#fff', // 背景色覆盖下方内容
  width: '100%',
};
defineExpose({ handleModalChange });
</script>
<template>
  <a-modal wrap-class-name="full-modal" width="100%" v-model:visible="visible" :confirm-loading="$isPending()" :mask-closable="false" :title="'产品排序打分'" @cancel="cancel">
    <a-tabs :tabBarStyle="tabBarStyle" v-model:active-key="activeKey">
      <a-tab-pane key="1" tab="要素打分">
        <a-table
          :scroll="{ x: 'max-content', y: tableHeight }"
          row-key="id"
          bordered
          :columns="columns"
          :data-source="datasource"
          :locale="locale"
          :pagination="false"
          @resizeColumn="handleResizeColumn"
          :loading="loading"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'productGroup'">
              <span :style="getProductgroupingStyle(record.productGroup)">{{ Productgroupingdisplay(record.productGroup) }}</span>
            </template>
            <template v-else-if="marketcolumnskey.includes(column.dataIndex)">
              <a-select :disabled="Detailsflag" v-if="marketflag" v-model:value="record[column.dataIndex]" :style="{ width: '100%', color: 'red' }">
                <a-select-option v-for="option in divideList" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
              <span v-else>{{ '暂无权限查看' }}</span>
            </template>
            <template v-else-if="competitioncolumnskey.includes(column.dataIndex)">
              <a-select :disabled="Detailsflag" v-if="competitionflag" v-model:value="record[column.dataIndex]" :style="{ width: '100%', color: 'red' }">
                <a-select-option v-for="option in divideList" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
              <span v-else>{{ '暂无权限查看' }}</span>
            </template>
            <template v-else-if="financecolumnskey.includes(column.dataIndex)">
              <a-select :disabled="Detailsflag" v-if="financeflag" v-model:value="record[column.dataIndex]" :style="{ width: '100%', color: 'red' }">
                <a-select-option v-for="option in divideList" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
              <span v-else>{{ '暂无权限查看' }}</span>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="依赖打分" v-if="competitionflag">
        <a-table
          :scroll="{ x: 'max-content', y: tableHeight }"
          row-key="id"
          bordered
          :columns="dependcolumns"
          :data-source="dependdatasource"
          :locale="locale"
          :pagination="false"
          @resizeColumn="handleResizeColumn"
          :loading="loading"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'productGroup'">
              <span :style="getProductgroupingStyle(record.productGroup)">{{ Productgroupingdisplay(record.productGroup) }}</span>
            </template>
            <template v-if="column.dataIndex === 'dependTotalScore'">
              <span style="color: red">{{ DependencyScore(record, column) }}</span>
            </template>
            <template v-if="column.dataIndex === 'highDependProductJson'">
              <span style="color: red">{{ NumberDependencies(record, column, '很强依赖') }}</span>
            </template>
            <template v-if="column.dataIndex === 'middleDependProductJson'">
              <span style="color: red">{{ NumberDependencies(record, column, '较强依赖') }}</span>
            </template>
            <template v-if="column.dataIndex === 'lowDependProductJson'">
              <span style="color: red">{{ NumberDependencies(record, column, '一定程度依赖') }}</span>
            </template>
            <template v-if="column.dataIndex.includes('divide')">
              <span v-if="divideflag(record, column, index)">{{ '该单元格无需打分' }}</span>
              <a-select :disabled="Detailsflag" v-else v-model:value="record[column.dataIndex]" style="width: 100%" @change="handleChange($event, record, column)">
                <a-select-option key="很强依赖" value="很强依赖">
                  <span style="background-color: #4caf50; color: aliceblue; border-radius: 3px; padding: 2px 6px">很强依赖</span>
                </a-select-option>
                <a-select-option key="较强依赖" value="较强依赖">
                  <span style="background-color: #ffc107; color: aliceblue; border-radius: 3px; padding: 2px 6px">较强依赖</span>
                </a-select-option>
                <a-select-option key="一定程度依赖" value="一定程度依赖">
                  <span style="background-color: #f44336; color: aliceblue; border-radius: 3px; padding: 2px 6px">一定程度依赖</span>
                </a-select-option>
              </a-select>
            </template>
          </template>
        </a-table></a-tab-pane
      >
    </a-tabs>
    <template #footer>
      <a-button v-if="!Detailsflag" @click="onSubmitFormData('save')" type="primary">
        <EpcIcon type="icon-baocun" style="font-size: 15px" />
        保存</a-button
      >
      <a-button v-if="!Detailsflag" @click="onSubmitFormData('submit')" type="primary">
        <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
        提交</a-button
      >
      <a-button v-if="Detailsflag" @click="cancel" type="primary"> 取消</a-button>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
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
</style>
