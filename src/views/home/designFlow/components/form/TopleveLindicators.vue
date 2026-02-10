<!-- 顶层指标定义 -->
<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { useUserStore } from '@/store/modules/user';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { downloadFileFromStream } from '@/utils/file';
import Empty from '@/components/Empty/index.vue';
const userStore = useUserStore();
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  projectParametersArr: {
    require: false,
    type: Object,
    default: () => [],
  },
  detailProject: {
    require: false,
    type: Object,
    default: () => [],
  },
  taskId: {
    require: false,
    type: Number,
    default: () => '',
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
  downloadStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['TopleveLindicatorssubmitOk', 'toUpload', 'submitOk', 'submitStatus', 'getDetailProject']);
const seriesTableData = ref<any>([]); //系列参数列表数据
const argsItemInfo = ref<any>({});
const compliance = ref<any>('');
const inputInfo = ref('');
const isShowDialog = ref<boolean>(false);
let inpuColorType = reactive<any>({}); // 控制参数展示状态
const versionData = ref([]);
// 新增：我知晓按钮 loading
const setReadLoading = ref(false);
// 获取系列参数列表
const getParameterList = (seriesId: number) => {
  const obj: any = {
    seriesId,
    userId: userStore.getUser.id,
    currentPage: 1,
    numberPage: '5000',
    taskId: props.taskId,
  };
  DesignApiInfo.getSeriesParameterListApi(obj).then(function (res) {
    if (res.data.code == 0) {
      const data = res.data.data ? res.data.data : {};
      const arr = data.data || [];
      // 获取保存的顶层指标定义数据
      const projectParameters = props.detailProject.projectParameters || [];
      arr.map((item: any) => {
        const fos = projectParameters.filter(element => +element.seriesParameterId === +item.id)[0];
        if (fos) {
          item.value = fos.value;
          item.paramVersion = fos.paramVersion;
        }
      });
      projectParameters.forEach((element: any) => {
        inpuColorType[element.seriesParameterId] = element.markerColor;
      });
      seriesTableData.value = arr;
    } else {
      message.error(res.data.msg);
    }
  });
};
const getCompliance = () => {
  let data = {
    taskId: props.taskId,
  };
  DesignApiInfo.getComplianceApi(data).then(function (res) {
    if (res.data.code == 0) {
      compliance.value = res.data.data.compliance ? res.data.data.compliance + '%' : '';
    }
  });
};
const getVersion = (id: string) => {
  debugger;
  let items: any = '';
  let a = props.projectParametersArr;
  console.log('projectParametersArr', a);
  props.projectParametersArr.forEach((item: any) => {
    if (item.seriesParameterId == id && item.paramVersion && item.paramVersion.length > 0 && item.paramVersion != null) {
      items = item;
    }
  });
  argsItemInfo.value = items;
  return items.paramVersion;
};
const showDialog = (items: any) => {
  isShowDialog.value = true;
  versionData.value = items;
};
const versionColumns = ref([
  {
    title: '版本号',
    key: 'versionNum',
    dataIndex: 'versionNum',
    align: 'left',
    resizable: true,
    minWidth: 200,
  },
  {
    title: '参数值',
    key: 'paraValue',
    dataIndex: 'paraValue',
    align: 'center',
    resizable: true,
    minWidth: 200,
  },
  {
    title: '修改时间',
    key: 'addTime',
    dataIndex: 'addTime',
    align: 'center',
    resizable: true,
    minWidth: 200,
  },
  {
    title: '修改人',
    key: 'createUserName',
    dataIndex: 'createUserName',
    align: 'center',
    resizable: true,
    minWidth: 200,
  },
]);
const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const setRead = async () => {
  if (!argsItemInfo.value) {
    console.warn('[TopleveLindicators] setRead aborted: argsItemInfo is empty', argsItemInfo.value);
    isShowDialog.value = false;
    return;
  }
  const data = {
    taskId: props.taskId,
    projectId: argsItemInfo.value.projectId,
    paramId: argsItemInfo.value.seriesParameterId,
    taskNum: 3,
    taskType: 1,
  };

  console.debug('[TopleveLindicators] calling setVersionBeenReadApi with', data);
  setReadLoading.value = true;
  try {
    const res = await DesignApiInfo.setVersionBeenReadApi(data);
    console.debug('[TopleveLindicators] setVersionBeenReadApi res:', res);
    if (res?.data?.code == 0) {
      isShowDialog.value = false;
      message.success('操作成功');
      emit('getDetailProject', props.taskId, 3, 1);
    } else {
      const msg = res?.data?.msg ?? res?.data?.message ?? '操作失败';
      message.error(msg);
    }
  } catch (err) {
    console.error('[TopleveLindicators] setVersionBeenReadApi error:', err);
    message.error('操作失败，请重试');
  } finally {
    setReadLoading.value = false;
  }
};
// 判断顶层指标是否符合规则
const seriesParameterId = ref();
function isNumeric(str: string) {
  return /^[0-9]+$/.test(str);
}
const inputChange = (e: any, id: string) => {
  if (!isNumeric(e)) {
    message.error('当前属性值只允许输入纯数字, 请重新填写!');
    return;
  }
  const data: any = {};
  data.seriesParameterId = id;
  data.value = e;
  seriesParameterId.value = id;
  DesignApiInfo.checkProjectParameterApi(data).then(function (res) {
    if (res.data.code === 0) {
      inpuColorType[id] = res.data.data.color;
      inputInfo.value = res.data.data.info;
    }
  });
};
// 保存
function submitOk(type: any) {
  emit('TopleveLindicatorssubmitOk', type, seriesTableData.value, inpuColorType);
}
function submitStatus(num: any, operationType: any, nodeId?: any) {
  emit('submitStatus', num, operationType, nodeId);
}
function exportTop() {
  const data: any = {};
  data.taskId = props.taskId;
  DesignApiInfo.ckProjectexportDataApi(data).then(function (res) {
    const fileName = props.taskInfoData.taskName + '-顶层指标.xlsx';
    downloadFileFromStream(res, fileName);
  });
}

defineExpose({ getParameterList, getCompliance });
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
          <span>顶层指标定义</span>
        </div>

        <div class="textar-wrap" style="margin-bottom: -15px">
          <div class="sub-title">符合性：</div>
        </div>
        <div style="margin: 20px 0 16px 16px; width: 240px; overflow: hidden">
          <a-input disabled v-model:value="compliance" placeholder="符合性..." style="width: 234px" />
        </div>

        <div style="width: 100%; margin-left: 16px">
          <a-button type="primary" :disabled="!downloadStatus" @click="exportTop"><EpcIcon type="icon-daochu" style="font-size: 13px" />数据导出</a-button>
        </div>
        <div v-for="item in seriesTableData" :key="item.id" style="margin: 20px 0 0px 16px; width: 240px; overflow: hidden">
          <a-row>
            <a-col :span="24">
              <!-- 长文本折行显示为省略号，悬浮显示完整内容 -->
              <a-tooltip :title="item.parameterName">
                <div class="top-title ellipsis">{{ item.parameterName }}：</div>
              </a-tooltip>
            </a-col>
            <a-col :span="24" v-if="+item.parameterType === 2">
              <a-select :disabled="isEdit" v-model:value="item.value" placeholder="请选择..." allow-clear show-search style="width: 234px">
                <a-select-option key="是" value="是"> {{ item.name }} </a-select-option>
                <a-select-option key="否" value="否"> {{ item.name }} </a-select-option>
              </a-select>

              <EpcIcon
                v-if="item.paramVersion"
                type="icon-banbenlishi"
                style="position: absolute; top: 10px; right: 10px; font-size: 12px; color: #0d53e2"
                @click="showDialog(getVersion(item.id))" />
            </a-col>

            <a-col :span="24" v-else-if="+item.type === 2">
              <a-select :disabled="isEdit" v-model:value="item.value" placeholder="选择值..." allow-clear show-search style="width: 234px">
                <a-select-option v-for="subitem in item.tabulations" :key="subitem.id" :value="subitem.value"> {{ subitem.value }} </a-select-option>
              </a-select>
              <EpcIcon
                v-if="item.paramVersion"
                type="icon-banbenlishi"
                style="position: absolute; top: 10px; right: 10px; font-size: 12px; color: #0d53e2"
                @click="showDialog(getVersion(item.id))" />
            </a-col>

            <a-col :span="24" v-else-if="+item.parameterType === 1">
              <a-input :disabled="isEdit" v-model:value="item.value" placeholder="暂无参数值..." style="width: 234px" />
              <EpcIcon
                v-if="item.paramVersion"
                type="icon-banbenlishi"
                style="position: absolute; top: 10px; right: 10px; font-size: 12px; color: #0d53e2"
                @click="showDialog(getVersion(item.id))" />
            </a-col>

            <a-col :span="24" v-else-if="+item.type === 1">
              <a-input-number
                :class="{
                  'number-left': true,
                  'green-left': +inpuColorType[item.id] == 3,
                  'yellow-left': +inpuColorType[item.id] == 2,
                  'red-left': +inpuColorType[item.id] == 1,
                }"
                v-model:value="item.value"
                placeholder="请填写数字..."
                @blur="inputChange(item.value, item.id)"
                style="width: 234px"
                :disabled="isEdit" />
              <EpcIcon
                v-if="item.paramVersion"
                type="icon-banbenlishi"
                style="position: absolute; top: 10px; right: 10px; font-size: 12px; color: #0d53e2"
                @click="showDialog(getVersion(item.id))" />
              <div
                style="margin-top: 5px; color: red; font-size: 12px"
                v-if="(item.id == seriesParameterId && inpuColorType[item.id] == 2 && inputInfo) || (item.id == seriesParameterId && inpuColorType[item.id] == 1 && inputInfo)">
                {{ inputInfo }}
              </div>
            </a-col>
            <a-col :span="24" v-else>
              <a-input-number
                :class="{
                  'number-left': true,
                  'green-left': +inpuColorType[item.id] == 3,
                  'yellow-left': +inpuColorType[item.id] == 2,
                  'red-left': +inpuColorType[item.id] == 1,
                }"
                controls-position="right"
                v-model:value="item.value"
                placeholder="请填写数字..."
                :controls="false"
                @blur="inputChange(item.value, item.id)"
                style="width: 234px"
                :disabled="isEdit" />
              <EpcIcon
                v-if="item.paramVersion"
                type="icon-banbenlishi"
                style="position: absolute; top: 10px; right: 10px; font-size: 12px; color: #0d53e2"
                @click="showDialog(getVersion(item.id))" />
              <div
                style="margin-top: 5px; color: red; font-size: 12px"
                v-if="(item.id == seriesParameterId && inpuColorType[item.id] == 2 && inputInfo) || (item.id == seriesParameterId && inpuColorType[item.id] == 1 && inputInfo)">
                {{ inputInfo }}{{ item.paramVersion }}
              </div>
            </a-col>
          </a-row>
        </div>

        <div class="foot-btn" style="margin-top: 28px">
          <div class="backBtn" v-if="isShowBottomBtns">
            <a-button @click="submitOk(3)" type="primary" :disabled="saveBtnStatus">
              <EpcIcon type="icon-baocun" style="font-size: 15px" />
              保存</a-button
            >
            <a-button class="btn_left" type="primary" @click="submitStatus(3, 1, selectedKeys)" :disabled="commitBtnStatus">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button class="btn_left" @click="submitStatus(3, 0)" type="primary" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>
  <!-- 系统功能配置 -->
  <a-modal style="width: 800px" v-model:visible="isShowDialog" title="参数版本信息" draggable>
    <a-table
      style="margin-top: 5px"
      :pagination="false"
      :locale="localeA"
      row-key="id"
      :data-source="versionData"
      :columns="versionColumns"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
    </a-table>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" :loading="setReadLoading" @click="setRead" :disabled="setReadLoading"> 我知晓了 </a-button>
        <a-button @click="isShowDialog = false">取消</a-button>
      </span>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
.box {
  width: 100%;
  height: calc(100vh - 80px);
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
