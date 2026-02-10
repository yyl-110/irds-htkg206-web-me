<!-- 工作说明 -->
<script lang="ts" setup>
import { ref, watch, nextTick, computed } from 'vue';
import { message } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { sortermethod, findNodeByIdFromKey } from '@/utils/tools';
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
  workExplainStringEnd: {
    require: false,
    type: String,
    default: () => '',
  },
  twoRoundVersionBuilds: {
    require: false,
    type: Array,
    default: () => [],
  },
  auditDataListDataEnd: {
    require: false,
    type: Array,
    default: () => [],
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
const emit = defineEmits(['definitionSave', 'submitStatus', 'clickisShowVersionDialog']);
const labelCol = ref({ style: { width: '120px' } });
// 定义响应式数据（根据实际需求调整）
const formValidate = reactive({}); // 表单模型（若需表单验证，需配合a-form的rules）
const workExplainStringEnds = ref('');
/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const columns = ref<any>([
  {
    title: WeiI18n.$t('需求级别'),
    dataIndex: 'requirementLevel',
    key: 'requirementLevel',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.requirementLevel, b.requirementLevel),
    width: 120,
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('名称'),
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.name, b.name),
    width: 120,
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('描述'),
    dataIndex: 'standard',
    key: 'standard',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.standard, b.standard),
    width: 200, // 增加宽度
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('需求分类'),
    dataIndex: 'requirementsClassification',
    key: 'requirementsClassification',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.requirementsClassification, b.requirementsClassification),
    width: 120,
    ellipsis: true,
  },
  {
    title: WeiI18n.t('适用阶段').value,
    dataIndex: 'term',
    key: 'term',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('备注').value,
    dataIndex: 'text',
    key: 'text',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('查核说明').value,
    dataIndex: 'auditExplain',
    key: 'auditExplain',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    fixed: 'right',
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
/** 勾选表格数据源  */
const selectedRowList = ref<any[]>([]);
const selectedRowkeys = ref<any[]>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.id;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.id);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowList.value = selectedRows.filter(item => item.id !== key);
      } else {
        // 如果未选中则选中
        selectedRowList.value = [...selectedRows, record];
      }
    },
  };
}
// 编辑查核说明
const fosAuditData = ref<any>({});
const auditExplainStr = ref(''); // 查核库说明
// 使用局部响应式变量同步 props 的数据，避免同名覆盖 props
const auditDataList = ref<any[]>(props.auditDataListDataEnd || []);
const auditDialog = ref(false); // 编辑查核库说明

// 同步父组件传入的 prop 到本地变量
watch(
  () => props.auditDataListDataEnd,
  newVal => {
    auditDataList.value = newVal || [];
  },
  { immediate: true, deep: true }
);

const addAuditExplain = (row: any) => {
  fosAuditData.value = row;
  auditExplainStr.value = fosAuditData.value.auditExplain;
  auditDialog.value = true;
};
// 保存查核库说明
const saveAuditExplai = () => {
  const data: any = {};
  data.id = fosAuditData.value.id;
  data.taskId = props.taskId;
  data.auditExplain = auditExplainStr.value;
  DesignApiInfo.updateAuditExplainApi(data).then(async function (res) {
    debugger;
    if (res.data.code === '0') {
      auditDialog.value = false;
      // 更新本地列表显示
      let arr = (auditDataList.value || []).map((item: any) => {
        if (item.id === fosAuditData.value.id) {
          return { ...item, auditExplain: auditExplainStr.value };
        }
        return item;
      });
      auditDataList.value = arr;
      console.log('auditDataList.value', auditDataList.value);
    } else {
      message.error(res.data.msg);
    }
  });
};
// 保存
function definitionSave() {
  if (selectedRowList.value.length == 0) {
    return message.error('请先勾选要保存的数据!');
  }
  emit('definitionSave', selectedRowList.value);
}

function submitStatus(operationType: any, nodeId: any) {
  emit('submitStatus', operationType, nodeId);
}
function clickisShowVersionDialog() {
  emit('clickisShowVersionDialog');
}
function handleResizeColumn(w, col) {
  col.width = w;
}
watch(
  () => props.workExplainStringEnd,
  (newPath, oldPath) => {
    workExplainStringEnds.value = newPath;
  },
  { immediate: true, deep: true }
);
// 是否所有查核项都已勾选（用于在原有 commitBtnStatus 逻辑基础上额外校验）
const isAllSelected = computed(() => {
  const total = (auditDataList.value || []).length;
  return total > 0 && selectedRowList.value.length === total;
});

defineExpose({});
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
          <span>工作说明描述</span>
          <EpcIcon
            v-if="twoRoundVersionBuilds && twoRoundVersionBuilds.length"
            @click="clickisShowVersionDialog()"
            type="icon-banbenlishi"
            style="font-size: 12px; color: #0d53e2; width: 14px; height: 14px; margin-left: 5px" />
        </div>
        <div class="textar-wrap">
          <div class="sub-title">说明描述：</div>
          <a-textarea class="textarea" disabled v-model:value="workExplainStringEnds" :rows="4" placeholder="说明描述" />
        </div>

        <div class="content-title">
          <i></i>
          <span>查核项配置</span>
        </div>

        <div style="margin: 0 20px 0px 16px; width: 97%; padding-bottom: 30px">
          <a-table
            style="margin-top: 5px; margin-right: 16px"
            :pagination="false"
            row-key="id"
            :locale="locale"
            :columns="columns"
            :data-source="auditDataList"
            :row-selection="rowSelection"
            @resizeColumn="handleResizeColumn"
            :customRow="customRow"
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
              <template v-if="column.dataIndex === 'action'">
                <span v-if="isEdit">编辑</span>
                <a v-else @click.stop="addAuditExplain(record)">编辑</a>
              </template>
            </template>
          </a-table>
        </div>
        <div class="foot-btn">
          <div class="backBtn" v-if="isShowBottomBtns">
            <a-button type="primary" @click="definitionSave()" :disabled="saveBtnStatus">
              <EpcIcon type="icon-baocun" style="font-size: 15px" />
              保存</a-button
            >
            <a-button type="primary" class="btn_left" @click="submitStatus(1, 331)" :disabled="commitBtnStatus || !isAllSelected">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button @click="submitStatus(0, 331)" class="btn_left" type="primary" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>
  <!-- 编辑查核库数据 -->
  <a-modal v-model:visible="auditDialog" width="50%" title="编辑查核说明">
    <a-form ref="ruleFormRef" :model="formValidate" :label-col="labelCol" v-if="auditDialog">
      <div style="width: 100%; background: #fff; margin-top: 4px">
        <section style="width: 100%; background-color: #ffffff">
          <div style="width: 100%; height: 100%">
            <a-form-item label="查核说明" prop="auditExplain" :label-width="115" style="margin-bottom: 24px">
              <a-textarea class="textarea" v-model:value="auditExplainStr" :rows="4" placeholder="请输入..." />
            </a-form-item>
          </div>
        </section>
      </div>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="saveAuditExplai"> 保存 </a-button>
      <a-button @click="auditDialog = false">取消</a-button>
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
  /* 设置为滚动容器，position: sticky 在其子元素上生效 */
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 固定顶部区域（设计计划定义） */
.top-block {
  position: sticky;
  top: 0; /* 若页面有全局 header，调整为 header 高度（例如 64px） */
  z-index: 50;
  color: #6b778c; /* 遮盖下方内容，保持视觉一致 */
  /* 保持原有内边距/布局，避免添加 box-shadow 以不改变视觉 */
}

/* 其余保持原样 */
</style>
