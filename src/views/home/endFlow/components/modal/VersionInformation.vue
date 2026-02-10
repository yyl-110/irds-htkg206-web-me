<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },

  twoRoundVersionBuilds: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
  secretData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
  stageData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
  typeData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
  uploadBelong: {
    require: false,
    type: String,
    default: false,
  },
  taskId: {
    require: false,
    type: Number,
    default: false,
  },
  uploadSuccesscData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
});
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
  editStage: [type: string];
  uploadsuccess: [fileList: any];
  onFileremove: [fileList: any];
  uploadOk: [fileList: any];
  getTaskInfo: any;
}>();
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});

const UploadfileList = ref<Array<UploadFile>>([]);
const loading = ref<boolean>(false);
const versioncolumns = ref<any>([
  {
    title: WeiI18n.t('版本号').value,
    dataIndex: 'versionNum',
    key: 'versionNum',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('描述').value,
    dataIndex: 'illustrate',
    key: 'illustrate',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('开始时间').value,
    dataIndex: 'startTime',
    key: 'startTime',
    width: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('结束时间').value,
    dataIndex: 'endTime',
    key: 'endTime',
    width: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('负责人').value,
    dataIndex: 'headName',
    key: 'headName',
    width: 100,
    align: 'center',
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('文件信息').value,
    dataIndex: 'Fileinformation',
    key: 'Fileinformation',
    minWidth: 200,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
// --------------------------查看版本----------------
const versionTabShow = ref(false);
const versionTabData = ref([]);

const versionTabcolumns = ref<any>([
  {
    title: WeiI18n.t('类别').value,
    dataIndex: 'content',
    key: 'content',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('查核项点').value,
    dataIndex: 'standard',
    key: 'standard',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('适用阶段').value,
    dataIndex: 'term',
    key: 'term',
    width: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('备注').value,
    dataIndex: 'text',
    key: 'text',
    width: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
const seeTable = (data: any) => {
  versionTabShow.value = true;
  versionTabData.value = [];
  versionTabData.value = data;
};
function awareOfIt(arr: any) {
  function getArrIds(arr: any) {
    let __arr: any = [];
    arr.forEach((item: any) => {
      __arr.push(item.versionId);
    });
    return __arr;
  }
  DesignApiInfo.awareOfItApi({
    versionIds: getArrIds(arr),
    userId: userStore.getUser.id,
  }).then(function (res) {
    if (res.data.code == 0) {
      cancel();
      emit('getTaskInfo');
    }
  });
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
</script>
<template>
  <a-modal style="width: 60%" v-model:visible="visible" title="版本信息" @cancel="cancel">
    <a-table
      :scroll="{ x: 400, y: 400 }"
      row-key="userId"
      :loading="loading"
      :pagination="false"
      :data-source="twoRoundVersionBuilds"
      :columns="versioncolumns"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'Fileinformation'">
          <div style="color: blue; cursor: pointer" v-if="record.ckPdmFileInfos && record.ckPdmFileInfos.length" @click="seeTable(record.ckPdmFileInfos)">查看</div>
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="awareOfIt(twoRoundVersionBuilds)"> 我知晓了 </a-button>
      <a-button @click="cancel">取消</a-button>
    </template>
  </a-modal>
  <a-modal style="width: 800px" v-model:visible="versionTabShow" title="查核项">
    <a-table
      :scroll="{ x: 400, y: 400 }"
      row-key="userId"
      :pagination="false"
      :data-source="versionTabData"
      :columns="versionTabcolumns"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'term'">
          <div v-if="record.term === 1">方案设计</div>
          <div v-else-if="record.term === 2">系统设计</div>
          <div v-else-if="record.term === 3">详细设计</div>
          <div v-else-if="record.term === 4">方案设计,系统设计</div>
          <div v-else-if="record.term === 5">方案设计,详细设计</div>
          <div v-else-if="record.term === 6">系统设计,详细设计</div>
          <div v-else-if="record.term === 7">方案设计,系统设计,详细设计</div>
          <div v-else>未知</div>
        </template>
      </template>
    </a-table>
    <template #footer>
      <el-button type="primary" @click="versionTabShow = false"> 确定 </el-button>
      <el-button @click="versionTabShow = false">取消</el-button>
    </template>
  </a-modal>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.upload-demo {
  margin-top: 8px;
}
</style>
