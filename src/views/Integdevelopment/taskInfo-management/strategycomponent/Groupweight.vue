<script setup lang="ts">
// 设置产品分组权重
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { Productgroupingdisplay } from '@/utils/Requirementtablejudgment';
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
const formRef = ref();
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
const datasource = ref<any[]>([]);
const loading = ref<boolean>(false);
const columns = ref<any>([
  {
    title: '产品分组权重设置',
    dataIndex: 'key',
    key: 'key',
    children: [],
  },
]);
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
const constlenght = ref<number>(0);
/**
 * 详情
 * @param row
 */
const handleModalChange = async (row: any) => {
  if (row) {
    try {
      loading.value = true;
      const res = await AdminApiSystemProductPlanningscoring.getProductGroupWeight({ taskId: row.id });
      if (res.data.code == 200) {
        let data: any = res.data.data;
        columns.value[0].children = [
          {
            title: '',
            dataIndex: 'scoreAttribute',
            key: 'scoreAttribute',
            align: 'center',
            width: 150,
            resizable: true,
          },
        ];
        if (data.length > 0) {
          const count = Object.keys(data[0]).filter(key => key.startsWith('productGroup')).length;
          constlenght.value = count;
          for (let index = 0; index < count; index++) {
            columns.value[0].children.push({
              title: Productgroupingdisplay(index + 1),
              dataIndex: 'productGroup' + (index + 1),
              key: 'productGroup' + (index + 1),
              align: 'center',
              width: 200,
              resizable: true,
            });
          }
        }
        datasource.value = data;
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

function blurinput(record: any, column: any) {
  record[column.dataIndex] = record[column.dataIndex] || 0;
  // if (column.title == '第一组：市场渗透') {
  //   if (!validateCrossProductGroupSums(datasource.value, column.key)) {
  //     message.error(`第一组：市场渗透权重必须为1！`);
  //   }
  // } else if (column.title == '第二组：产品开发') {
  //   if (!validateCrossProductGroupSums(datasource.value, column.key)) {
  //     message.error(`第二组：产品开发权重必须为1！`);
  //   }
  // } else if (column.title == '第三组：开拓市场') {
  //   if (!validateCrossProductGroupSums(datasource.value, column.key)) {
  //     message.error(`第三组：开拓市场权重必须为1！`);
  //   }
  // } else if (column.title == '第四组：多元化') {
  //   if (!validateCrossProductGroupSums(datasource.value, column.key)) {
  //     message.error(`第四组：多元化权重必须为1！`);
  //   }
  // }
}
const onSubmitFormData = async () => {
  if (!validateCrossProductGroupSums(datasource.value, 'productGroup')) {
    message.error('各产品分组权重总和必须为1！');
    return;
  }
  Modal.confirm({
    title: `确定设置当前的产品分组权重吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemProductPlanningscoring.saveProductGroupWeight(datasource.value);
      if (res.data.code == 200) {
        message.success('操作成功');
        emit('RefreshtableData');
        emit('onClose', false);
      }
    },
  });
};
function validateCrossProductGroupSums(data: any[], type: string) {
  // 1. 收集所有productGroup开头的键
  const productGroupKeys = new Set();
  // 首先遍历数据找出所有productGroup开头的键
  for (const item of data) {
    for (const key in item) {
      if (key.startsWith(type) && typeof item[key] === 'number') {
        productGroupKeys.add(key);
      }
    }
  }
  // 如果没有找到任何productGroup键，不进行校验
  if (productGroupKeys.size === 0) {
    console.warn('未找到任何productGroup开头的键');
    return false;
  }
  // 判断输入的productGroup键个数是否等于constlenght.value-每个分组至少填写一项权重
  if (type == 'productGroup' && productGroupKeys.size !== constlenght.value) {
    return false;
  }
  // 2. 初始化累加器
  const sumMap = new Map();
  for (const key of productGroupKeys) {
    sumMap.set(key, 0);
  }
  // 3. 遍历所有对象并进行累加
  for (const item of data) {
    for (const [key, sum] of sumMap) {
      // 如果对象没有当前键或值不是数字，设置为0
      const value = typeof item[key] === 'number' ? item[key] : 0;
      sumMap.set(key, sum + value);
    }
  }
  // 4. 验证每个键的累加和是否等于1
  for (const [key, total] of sumMap) {
    // 处理JS浮点数精度问题
    const isEqual = Math.abs(total - 1) < 0.000001;
    if (!isEqual) {
      console.error(`[${key}] 累加失败: ` + `所有对象中的 ${key} 值之和为 ${total.toFixed(2)}, 不等于1`);
      return false;
    }
  }
  // 5. 打印验证结果
  console.log('所有productGroup键的跨对象累加和验证通过:');
  for (const [key, total] of sumMap) {
    console.log(`  ${key}: ${total.toFixed(2)}`);
  }
  return true;
}

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Groupweight');
}
defineExpose({ handleModalChange });
</script>
<template>
  <div class="Groupweight" v-dragModal>
    <a-modal
      style="width: 70%"
      v-model:visible="visible"
      :getContainer="customGetContainer"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'产品分组权重'"
      @cancel="cancel">
      <a-table
        :scroll="{ x: 'max-content' }"
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
          <template v-if="column.dataIndex.startsWith('productGroup')">
            <a-input-number v-model:value="record[column.dataIndex]" :step="0.1" :min="0" :max="1" style="width: 100%" @blur="blurinput(record, column)" />
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
