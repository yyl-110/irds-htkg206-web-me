<script setup lang="ts">
// 查看打分项
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
const userStore = useUserStore();
const emit = defineEmits(['onClose', 'RefreshtableData']);
interface OptionrItem {
  label: string;
  value: string;
}
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
const competitioncolumnskey = ref(['marketShare', 'advantage', 'brandAdvantage']);
// 财务
const financeflag = ref<boolean>(false);
const financecolumnskey = ref(['developmentCost', 'yieldRate', 'proportionIncome']);
const loading = ref<boolean>(false);
const columns = ref([
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
    title: '要素得分',
    dataIndex: 'key',
    key: 'key',
    children: [
      {
        title: '市场吸引力',
        dataIndex: 'marketAllure',
        key: 'marketAllure',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        // sorter: (a: any, b: any) => sortermethod(a.marketAllure, b.marketAllure),
      },
      {
        title: '竞争地位',
        dataIndex: 'competePosition',
        key: 'competePosition',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        // sorter: (a: any, b: any) => sortermethod(a.competePosition, b.competePosition),
      },
      {
        title: '财务',
        dataIndex: 'finance',
        key: 'finance',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        // sorter: (a: any, b: any) => sortermethod(a.finance, b.finance),
      },
      {
        title: '要素总得分',
        dataIndex: 'sortScore',
        key: 'sortScore',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        // sorter: (a: any, b: any) => sortermethod(a.sortScore, b.sortScore),
      },
    ],
  },
  {
    title: '依赖得分',
    dataIndex: 'key1',
    key: 'key1',
    children: [
      {
        title: '很强依赖',
        dataIndex: 'highScore',
        key: 'highScore',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        // sorter: (a: any, b: any) => sortermethod(a.highScore, b.highScore),
      },
      {
        title: '较强依赖产品',
        dataIndex: 'middleScore',
        key: 'middleScore',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        // sorter: (a: any, b: any) => sortermethod(a.middleScore, b.middleScore),
      },
      {
        title: '一定程度依赖产品',
        dataIndex: 'lowScore',
        key: 'lowScore',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        // sorter: (a: any, b: any) => sortermethod(a.lowScore, b.lowScore),
      },
      {
        title: '依赖程度总得分',
        dataIndex: 'dependencySumScore',
        key: 'dependencySumScore',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        // sorter: (a: any, b: any) => sortermethod(a.dependencySumScore, b.dependencySumScore),
      },
    ],
  },

  {
    title: '总得分',
    dataIndex: 'totalScore',
    key: 'totalScore',
    ellipsis: true,
    align: 'center',
    width: 200,
    resizable: true,
    // sorter: (a: any, b: any) => sortermethod(a.totalScore, b.totalScore),
  },
]);

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

/**
 * 详情
 * @param row
 * @param data
 */
const handleModalChange = async (row: any) => {
  demandrow.value = row;
  if (row) {
    loading.value = true;
    try {
      const res = await AdminApiSystemProductPlanningscoring.getScoreResultList({ planId: row.planId });
      if (res.data.code == 200) {
        datasource.value = res.data.data;
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

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
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
  <a-modal wrap-class-name="full-modal" width="100%" v-model:visible="visible" :confirm-loading="$isPending()" :mask-closable="false" :title="'分数列表'" @cancel="cancel">
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
        <template v-if="column.dataIndex === 'sortScore'">
          <span style="color: red; font-weight: bold">{{ record.sortScore }}</span>
        </template>
        <template v-if="column.dataIndex === 'dependencySumScore'">
          <span style="color: red; font-weight: bold">{{ record.dependencySumScore }}</span>
        </template>
        <template v-if="column.dataIndex === 'totalScore'">
          <span style="color: red; font-weight: bold">{{ record.totalScore }}</span>
        </template>
      </template>
    </a-table>
    <!-- <a-tabs :tabBarStyle="tabBarStyle" v-model:active-key="activeKey">
        <a-tab-pane key="1" tab="要素打分"> </a-tab-pane>
        <a-tab-pane key="2" tab="依赖打分"> </a-tab-pane>
      </a-tabs> -->
    <template #footer>
      <a-button @click="cancel" type="primary"> <EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
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
