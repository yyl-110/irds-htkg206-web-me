<script setup lang="ts">
// 设置产品分组
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
const demandrow = ref<any>({});
const datasource = ref([]);
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  RefreshtableData: any;
}>();
interface OptionrItem {
  label: string;
  value: string | number;
}
const groupinglist = ref<OptionrItem[]>([
  {
    label: '第一组：市场渗透',
    value: 1,
  },
  {
    label: '第二组：产品开发',
    value: 2,
  },
  {
    label: '第三组：开拓市场',
    value: 3,
  },
  {
    label: '第四组：多元化',
    value: 4,
  },
]);
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});

const loading = ref<boolean>(false);
const columns = ref([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: center;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
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
    width: 200,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productGroup, b.productGroup),
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
const handleModalChange = async (row: any, data: any) => {
  if (row) {
    try {
      loading.value = true;
      demandrow.value = row;
      datasource.value = JSON.parse(JSON.stringify(data));
    } catch (e) {
      console.log(e);
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
};

const onSubmitFormData = async () => {
  let data: any = {
    taskId: demandrow.value.id,
    planId: demandrow.value.planId,
    planGroupList: [],
  };
  if (datasource.value.length > 0) {
    datasource.value.forEach((item: any) => {
      data.planGroupList.push({
        combinationId: item.combinationId,
        productName: item.productName,
        productGroup: item.productGroup,
      });
    });
  }
  Modal.confirm({
    title: `确定设置当前的产品分组吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemProductPlanningscoring.saveProductGroup(data);
      if (res.data.code == 200) {
        message.success('操作成功');
        emit('RefreshtableData');
        emit('onClose', false);
      }
    },
  });
};

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Productgrouping');
}
defineExpose({ handleModalChange });
</script>
<template>
  <div class="Productgrouping" v-dragModal>
    <a-modal
      style="width: 40%"
      v-model:visible="visible"
      :getContainer="customGetContainer"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'产品分组'"
      @cancel="cancel">
      <a-table
        :scroll="{ x: 'max-content', y: 350 }"
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
            <a-select style="width: 220px; margin-left: 20px" v-model:value="record[column.dataIndex]">
              <a-select-option v-for="item in groupinglist" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
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
