<script lang="ts" setup>
// 系统功能配置
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { useUserStore } from '@/store/modules/user';
import SuperTotalGbom from '../table/SuperTotalGbom.vue';
import { TableProps } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
const userStore = useUserStore();
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  taskId: {
    require: false,
    type: Number,
    default: () => '',
  },
  seriesId: {
    require: false,
    type: Number,
    default: () => 0,
  },
  isEdit: {
    require: false,
    type: Boolean,
    default: false,
  },
  selectedKeys: {
    require: false,
    type: String,
    default: false,
  },
  commitBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  saveBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  isShowBottomBtns: {
    require: false,
    type: Boolean,
    default: false,
  },
  editBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['submitStatus']);
const dialogSystemConfig = ref<boolean>(false);
const tableDataLoading = ref<boolean>(false);
const designDialogDesign = ref<boolean>(false);
const loading = ref<boolean>(false);
const gbomSeriesTableData = ref<any>([]);
const gbomSeriesBomBack = ref<any>([]); // 系统功能配置数据回显
const systemTableData = ref<any>([]); // 系统功能配置数据
const defaultExpandedKeys = ref<any>([]);
const mselection = ref([]); // 选中的参数
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
// 获取系统功能配置数据
const getProjectBOM = (taskId: number, defaultExpandedKeys?: string[]) => {
  if (!defaultExpandedKeys) {
    loading.value = true;
  }
  try {
    const obj: any = {
      taskId,
      defaultExpandedKeys,
    };
    DesignApiInfo.getProjectBOMApi(obj).then(function (res) {
      if (res.data.code == 0) {
        loading.value = false;
        systemTableData.value = res.data.data || [];
      } else {
        message.error(res.data.msg);
      }
    });
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};
// 系统功能配置
async function systemConfiguration() {
  dialogSystemConfig.value = true;
  await getBomBackApi();
  getSeriesGBOM();
}
// 获取系统功能配置列表回显
const getBomBackApi = () => {
  let obj: any = {};
  obj.taskId = props.taskId;
  DesignApiInfo.bomBackApi(obj).then(function (res) {
    if (res.data.code == 0) {
      const data = res.data.data ? res.data.data : {};
      gbomSeriesBomBack.value = data;
    } else {
      message.error(res.data.msg);
    }
  });
};

// 获取系列Gbom列表
function getSeriesGBOM() {
  tableDataLoading.value = true;
  const obj = {
    seriesId: props.seriesId,
    taskId: props.taskId,
  };
  DesignApiInfo.getSeriesGBOMApi(obj).then(function (res) {
    if (res.data.code == 0) {
      const data = res.data.data ? res.data.data : {};
      gbomSeriesTableData.value = data;
      tableDataLoading.value = false;
    } else {
      message.error(res.data.msg);
    }
  });
}
const expandChange = (expandedRows: any, expanded: any) => {
  getProjectBOM(props.taskId, updateDefaultExpandedKeys(expandedRows, expanded.id));
};
const updateDefaultExpandedKeys = (type: any, id: any) => {
  if (type) {
    defaultExpandedKeys.value.push(id);
    let uniqueValues = [...new Set(defaultExpandedKeys.value)];
    defaultExpandedKeys.value = uniqueValues;
  } else {
    defaultExpandedKeys.value = defaultExpandedKeys.value.filter(item => item != id);
  }
  return defaultExpandedKeys.value;
};
function submitStatus(num: any, operationType: any, nodeId?: any) {
  emit('submitStatus', num, operationType, nodeId);
}
/** 表格列属性 */
const columns = ref<any[]>([
  {
    title: WeiI18n.t('超级GBOM').value,
    dataIndex: 'descript',
    key: 'descript',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('系统功能分类标识').value,
    dataIndex: 'techid',
    key: 'techid',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('标记').value,
    dataIndex: 'signString',
    key: 'signString',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
// 选中的参数
const multipleSelection = (arr: any) => {
  mselection.value = arr;
};
function handleResizeColumn(w, col) {
  col.width = w;
}
// 保存系统功能配置
const saveSystemConfigOK = () => {
  tableDataLoading.value = true;
  try {
    let obj: any = {};
    obj.userId = userStore.getUser.id;
    obj.taskId = props.taskId;
    obj.idList = mselection.value.map(item => item.id);
    DesignApiInfo.addProjectBOMApi(obj).then(function (res) {
      if (res.data.code == 0) {
        getProjectBOM(props.taskId);
        designDialogDesign.value = false;
        dialogSystemConfig.value = false;
        tableDataLoading.value = false;
        message.success('保存成功');
      } else {
        message.error(res.data.msg);
      }
    });
  } catch (error) {
    tableDataLoading.value = false;
    console.log(error);
  }
};
/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: []) => {},
};
watch(
  () => systemTableData.value,
  newVal => {
    if (newVal) {
      nextTick(() => {
        const numArray = newVal[0].defaultExpandedKeys.map(Number);
        defaultExpandedKeys.value = numArray;
      });
    }
  },
  {
    deep: true,
  }
);
defineExpose({ getProjectBOM });
</script>

<template>
  <div class="container">
    <div class="box">
      <a-row class="elrowheight">
        <div class="top-block">
          <div class="block-inner">
            <img class="pic" :src="taskInfoData.picUrl" />
            <div class="dec-wrap">
              <div class="t">{{ taskInfoData.taskName }}</div>
              <div class="tm">平台名称：{{ taskInfoData.platformName }}</div>
              <div class="tm">任务时间：{{ taskInfoData.startTime }} ~ {{ taskInfoData.endTime }}</div>
              <div class="pr">
                <span>当前进度：{{ taskInfoData.taskPercentage }}%</span><span>距截止还剩{{ taskInfoData.deadlineDays }}天</span>
              </div>
              <div class="user-wrap">
                <a-progress status="active" :percent="taskInfoData?.taskPercentage" class="elprogress" />
                <div class="create-pop">
                  创建人：<span class="user"><img src="../../../../../assets/workbench/avatar.jpg" alt="" />{{ taskInfoData.createUserName }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-title">
          <i></i>
          <span>系统功能配置</span>
        </div>
        <div style="margin-left: 16px; width: 100%">
          <a-button type="primary" :disabled="isEdit" @click="systemConfiguration"><EpcIcon type="icon-gongnengpeizhi" style="font-size: 16px" />系统功能配置</a-button>
        </div>
        <div style="margin: 20px 20px 28px 16px; width: 100%">
          <a-table
            :loading="loading"
            :scroll="{ y: 400 }"
            style="margin-top: 5px; margin-right: 16px"
            :pagination="false"
            row-key="id"
            :locale="locale"
            :columns="columns"
            @resizeColumn="handleResizeColumn"
            :data-source="systemTableData"
            v-model:expandedRowKeys="defaultExpandedKeys"
            @expand="expandChange"
            :row-selection="rowSelection"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          </a-table>
        </div>
        <div class="foot-btn">
          <div class="backBtn" v-if="isShowBottomBtns">
            <a-button type="primary" @click="submitStatus(5, 1, selectedKeys)" :disabled="commitBtnStatus">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button type="primary" class="btn_left" @click="submitStatus(5, 0)" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>
  <!-- 系统功能配置 -->
  <a-modal style="width: 800px" v-model:visible="dialogSystemConfig" title="系统功能配置">
    <div style="width: 100%; background: #fff; margin-top: 4px" v-if="dialogSystemConfig">
      <div style="width: 100%; height: 100%">
        <SuperTotalGbom
          :dialogSystemConfig="dialogSystemConfig"
          :tableData="gbomSeriesTableData"
          :loading="tableDataLoading"
          @multipleSelection="multipleSelection"
          :systemTableData="systemTableData"
          :gbomSeriesBomBack="gbomSeriesBomBack" />
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="saveSystemConfigOK()"> 确定 </a-button>
      <a-button @click="dialogSystemConfig = false">取消</a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
.box {
  width: 100%;
  height: calc(100vh - 80px);
  background: #fff;
  position: relative;
  /* 必须是滚动容器，sticky 才会生效 */
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
/* 顶部区域固定（在 .box 内滚动时保持可见） */
.top-block {
  position: sticky;
  top: 0; /* 根据需要可改成 top: 64px（避开全局 header） */
  z-index: 50;
  color: #6b778c; /* 遮盖下方内容，保持视觉一致 */
  /* 保持原有内边距/布局，不要加 box-shadow/border-radius（避免样式变化） */
}

/* 其余保持原样 */
.ellipsis {
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
