<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiCompetitor } from '@/api/tags/competitor/竞品数据库管理';
import { EpcIcon } from '@/components/icon/EpcIcon';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  fileTitle: {
    require: false,
    type: String,
    default: '',
  },
  fileName: {
    require: false,
    type: String,
    default: '',
  },
});
const userStore = useUserStore();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const loadingTree = ref<boolean>(false);
const fileTypes = ref<any>(2);

const fileList2 = ref<any>([]);
const activeKey = ref(['1']);
const draggerMoreFile2 = ref();
const columns = [
  {
    title: '附件信息',
    dataIndex: 'oldFileName',
    key: 'oldFileName',
    align: 'center',
    width: 300,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    align: 'center',
    width: 100,
  },
];

// var chartDom = document.getElementById('main');
// var myChart = echarts.init(chartDom);
// const option

// 表单数据
const formData = reactive({
  competitorName: '',
  sortIndex: 0,
});

/** 获取分类数据 */
function getListData(id: any, type: any) {
  loadingTree.value = true;
  fileTypes.value = type;
  try {
    //根据ID获取附件列表信息
    AdminApiCompetitor.getCompetitorFileList({ id: id, type: type }).then(res => {
      if (res && res.data.code == 200) {
        fileList2.value = res.data.data;
      }
    });
  } catch (error) {
    message.error('获取数据失败！');
  } finally {
    loadingTree.value = false;
  }
}

function downloadFile(filePath: any) {
  if (filePath && filePath.startsWith('http')) {
    window.open(filePath);
  } else {
    window.open(import.meta.env.VITE_MINIO_PREVIEW_URL + filePath);
  }
}

const emit = defineEmits(['close', 'refresh-table-data']);

defineExpose({ getListData });
</script>

<template>
  <a-modal :title="fileTitle" v-model:visible="visible" width="800px" :confirm-loading="$isPending()" @cancel="emit('close')">
    <div class="model-content">
      <a-table :data-source="fileList2" row-key="id" bordered :pagination="false">
        <a-table-column align="left" header-align="left" data-index="oldFileName" :title="fileName" />
        <a-table-column align="left" header-align="left" data-index="action" title="操作">
          <template #default="{ record }">
            <a-link v-if="fileTypes == 2" @click="downloadFile(record.filePath)" style="color: #165dff"><u style="color: #165dff; cursor: pointer">下载</u></a-link>
            <a-link v-if="fileTypes == 3" @click="downloadFile(record.filePath)" style="color: #165dff"><u style="color: #165dff; cursor: pointer">查看</u></a-link>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <a-button type="primary" @click="emit('close')"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
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
  height: calc(100vh - 300px);
  overflow: auto;
}
</style>
