<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';

const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const userStore = useUserStore();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const formRef = ref();
const loadingTree = ref<boolean>(false);
const datasource = ref<any>([]);
const updateId = ref<number>(0);
const fileList = ref<any>([]);
const imgFiled = ref<any>([]);

const fileList2 = ref<any>([]);
const activeKey = ref(['1']);
const draggerMoreFile2 = ref();

// var chartDom = document.getElementById('main');
// var myChart = echarts.init(chartDom);
// const option

// 表单数据
const formData = reactive({
  competitorName: '',
  sortIndex: 0,
});

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData() {
  loadingTree.value = true;
  try {
  } catch (error) {
    message.error('获取数据失败！');
  } finally {
    loadingTree.value = false;
  }
}

const emit = defineEmits(['close', 'refresh-table-data']);

defineExpose({ getListData });
</script>

<template>
  <a-modal title="参数分布散点图" class="modelstyle" v-model:visible="visible" width="800px" :confirm-loading="$isPending()" @cancel="emit('close')">
    <div class="model-content">
      <!--echart 散点图-->
      <div id="myChart" style="width: 100%; height: 100%"></div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <a-button @click="emit('close')">关闭</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
:deep(.ant-collapse-content-box) {
  padding: 0px !important;
  padding-top: 16px !important;
}
.model-content {
  height: calc(100vh - 130px);
  overflow: auto;
}
</style>
