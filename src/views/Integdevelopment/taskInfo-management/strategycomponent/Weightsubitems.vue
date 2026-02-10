<script setup lang="ts">
// 设置打分权重
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  initScoreFlag: {
    require: false,
    type: Boolean,
    default: false,
  },
});
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
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  RefreshtableData: any;
}>();
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
const datasource = ref<any[]>([
  {
    weight: 'marketSpace',
    key1: '市场吸引力',
    key2: '市场规模',
    key3: '',
  },
  {
    weight: 'marketGrowth',
    key1: '市场吸引力',
    key2: '市场增长',
    key3: '',
  },
  {
    weight: 'pressure',
    key1: '市场吸引力',
    key2: '客户/供应商压力',
    key3: '',
  },
  {
    weight: 'competition',
    key1: '市场吸引力',
    key2: '直接/间接竞争',
    key3: '',
  },
  {
    weight: 'threat',
    key1: '市场吸引力',
    key2: '进入的威胁',
    key3: '',
  },
  {
    weight: 'strategicValue',
    key1: '市场吸引力',
    key2: '战略价值',
    key3: '',
  },
  {
    total: 'total1',
    key1: '市场吸引力',
    key2: '',
    key3: '',
  },
  {
    weight: 'marketShare',
    key1: '竞争地位',
    key2: '市场份额',
    key3: '',
  },
  {
    weight: 'advantages',
    key1: '竞争地位',
    key2: '产品优势',
    key3: '',
  },
  {
    weight: 'brandAdvantage',
    key1: '竞争地位',
    key2: '品牌优势',
    key3: '',
  },
  {
    total: 'total2',
    key1: '竞争地位',
    key2: '',
    key3: '',
  },
  {
    weight: 'developmentCost',
    key1: '财务',
    key2: '开发费用',
    key3: '',
  },
  {
    weight: 'yieldRate',
    key1: '财务',
    key2: '税前收益率',
    key3: '',
  },
  {
    weight: 'proportionIncome',
    key1: '财务',
    key2: '收入比重',
    key3: '',
  },
  {
    total: 'total3',
    key1: '财务',
    key2: '',
    key3: '',
  },
]);
const loading = ref<boolean>(false);
const columns = ref([
  {
    title: '打分项权重设置',
    dataIndex: 'key',
    key: 'key',
    children: [
      {
        title: '属性',
        dataIndex: 'key1',
        key: 'key1',
        align: 'center',
        width: 150,
        resizable: true,
        customCell: (record: any, index: any) => {
          let obj: any = {};
          // 查找相同值的行数
          let rowSpan = 1;
          for (let i = index + 1; i < datasource.value.length; i++) {
            if (datasource.value[i].key1 === record.key1) {
              rowSpan++;
            } else {
              break;
            }
          }
          // 如果不是第一个相同值的行，则隐藏单元格
          if (index > 0 && datasource.value[index - 1].key1 === record.key1) {
            obj.rowSpan = 0;
          } else {
            obj.rowSpan = rowSpan;
          }
          return obj;
        },
      },
      {
        title: '评估要素',
        dataIndex: 'key2',
        key: 'key2',
        align: 'center',
        width: 200,
        resizable: true,
      },
      {
        title: '权重',
        dataIndex: 'key3',
        key: 'key3',
        align: 'center',
        width: 80,
        resizable: true,
      },
    ],
  },
]);
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
const taskId = ref();
const planId = ref();
/**
 * 详情
 * @param row
 */
const handleModalChange = async (row: any) => {
  if (row) {
    try {
      loading.value = true;
      const res = await AdminApiSystemProductPlanningscoring.getProductScoreWeight({ taskId: row.id });
      if (res.data.code == 200) {
        taskId.value = res.data.data.taskId;
        planId.value = res.data.data.planId;
        let data: any = res.data.data;
        datasource.value.forEach(item => {
          const weightKey = item.weight;
          item.key3 = data[weightKey] ?? '';
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
};
function weighttotal(type: string) {
  const marketAttractionTotal = datasource.value.filter(item => item.key1 === type && typeof item.key3 === 'number').reduce((sum, item) => (sum * 100 + item.key3 * 100) / 100, 0); // 修正精度
  return marketAttractionTotal.toFixed(1);
}
// 市场吸引力
let key1 = ['marketSpace', 'marketGrowth', 'pressure', 'competition', 'threat', 'strategicValue'];
// 竞争地位
let key2 = ['marketShare', 'advantages', 'brandAdvantage'];
// 财务
let key3 = ['developmentCost', 'yieldRate', 'proportionIncome'];
const onSubmitFormData = async () => {
  // 筛选并转换符合条件的对象
  const result = datasource.value.reduce((acc, item) => {
    // 仅处理 weight 存在且不为空的对象（排除 total 类型）
    if (item.weight && item.weight.trim() !== '') {
      acc[item.weight] = item.key3; // weight 作为 key，key3 作为 value
    }
    return acc;
  }, {}); // 初始值为空对象
  result.taskId = taskId.value;
  result.planId = planId.value;
  const shouldBlock = checkSumExceedsOne(result, key1);
  const shouldBlock2 = checkSumExceedsOne(result, key2);
  const shouldBlock3 = checkSumExceedsOne(result, key3);
  if (shouldBlock) {
    message.error('市场吸引力权重总和必须为1！');
    return;
  } else if (shouldBlock2) {
    message.error('竞争地位权重总和必须为1！');
    return;
  } else if (shouldBlock3) {
    message.error('财务权重总和必须为1！');
    return;
  }
  Modal.confirm({
    title: `确定设置当前的打分权重吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemProductPlanningscoring.saveProductScoreWeight(result);
      if (res.data.code == 200) {
        message.success('操作成功');
        emit('RefreshtableData');
        emit('onClose', false);
      }
    },
  });
};
function checkSumExceedsOne(obj: any, targetKeys: any[]) {
  // 1. 筛选对象中存在于targetKeys且值为数字的key
  const validValues = targetKeys.filter(key => obj.hasOwnProperty(key) && typeof obj[key] === 'number').map(key => obj[key]);
  // 2. 累加值（保留2位小数，避免浮点数精度问题）
  const total = validValues.reduce((sum, val) => sum + val, 0).toFixed(2);
  // 3. 判断总和是否 != 1（转换为数字比较）
  return Number(total) != 1;
}
function blurinput(record: any, column: any) {
  record[column.dataIndex] = record[column.dataIndex] || 0;
  if (record.key1 == '市场吸引力') {
    if (weighttotal('市场吸引力') != 1) {
      message.error(`市场吸引力权重总和必须为1！`);
    }
  } else if (record.key1 == '竞争地位') {
    if (weighttotal('竞争地位') != 1) {
      message.error(`竞争地位权重总和必须为1！`);
    }
  } else if (record.key1 == '财务') {
    if (weighttotal('财务') != 1) {
      message.error(`财务权重总和必须为1！`);
    }
  }
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Weightsubitems');
}
defineExpose({ handleModalChange });
</script>
<template>
  <div class="Weightsubitems" v-dragModal>
    <a-modal
      style="width: 70%"
      v-model:visible="visible"
      :getContainer="customGetContainer"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'打分权重'"
      @cancel="cancel">
      <a-table
        :scroll="{ x: 'max-content', y: 450 }"
        row-key="id"
        :columns="columns"
        :data-source="datasource"
        :locale="locale"
        bordered
        :pagination="false"
        @resizeColumn="handleResizeColumn"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'key3'">
            <span v-if="record.total == 'total1'" :style="{ color: weighttotal('市场吸引力') != 1 ? 'red' : 'green' }">{{ weighttotal('市场吸引力') }}</span>
            <span v-else-if="record.total == 'total2'" :style="{ color: weighttotal('竞争地位') != 1 ? 'red' : 'green' }">{{ weighttotal('竞争地位') }}</span>
            <span v-else-if="record.total == 'total3'" :style="{ color: weighttotal('财务') != 1 ? 'red' : 'green' }">{{ weighttotal('财务') }}</span>
            <a-input-number v-else v-model:value="record[column.dataIndex]" :step="0.1" :min="0" :max="1" style="width: 100%" @blur="blurinput(record, column)" />
          </template>
        </template>
      </a-table>
      <template #footer>
        <a-button v-if="!initScoreFlag" @click="onSubmitFormData()" type="primary">
          <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
          确定</a-button
        >
        <a-button v-else @click="cancel()" type="primary">
          <EpcIcon type="icon-quxiao" style="font-size: 15px" />
          关闭</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
:deep(.ant-table-content) {
  overflow-x: hidden !important;
}
</style>
