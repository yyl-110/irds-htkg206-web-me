<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
import { ProjectPageRequestDTOModel } from '@/api/models/design/ProjectPageRequestDTOModel';
import { ProjectUserRequestDTOModel } from '@/api/models/design/ProjectUserRequestDTOModel';
import { ProjectPropRequestDTOModel } from '@/api/models/design/ProjectPropRequestDTOModel';
import { ProjectInfoRequestDTOModel } from '@/api/models/design/ProjectInfoRequestDTOModel';
import { generateRandomNumberByTime } from '@/utils/tools';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { WeiI18n } from '@/utils/WeiI18n';
import Empty from '@/components/Empty/index.vue';
import type { TableProps, FormInstance } from 'ant-design-vue';
const requestParams = reactive(new ProjectPageRequestDTOModel());
const requestUserParams = reactive(new ProjectUserRequestDTOModel());
const requestPropParams = reactive(new ProjectPropRequestDTOModel());
const requestInfoParams = reactive(new ProjectInfoRequestDTOModel());
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});

/** 弹窗状态 */

const visible = computed(() => {
  return props.modalVisible;
});
const userStore = useUserStore();
const id = ref(0);
const activeKey = ref('first'); //项目tab
const parameterName = ref('');
const parameterNum = ref('');
const parameterType = ref('1');
const remarks = ref('');
const dimension = ref('');
const categoryid = ref('');
const loading = ref<boolean>(false);
const loadingPro = ref<boolean>(false);
const loadingSave = ref<boolean>(false);

const memberData = ref([{ member: '设计经理' }, { member: '机械主管' }, { member: '电气主管' }]);
const code = ref('');
const nameCN = ref('');
const platformName = ref('');
const platformId = ref('');
const seriesId = ref('');
const projectCategory = ref('');
const projectType = ref('');
const itemDialog = ref(false); // 项目选择弹窗
const itemKeywords = ref(''); // 项目模糊搜索
const startTime = ref('');
const memberDialogDesign = ref(false); // 角色弹窗
const syncProjectData = ref([]); // 项目列表数据
const endTime = ref('');
const dateRangeParams = ref('');
const memberStanding = ref(''); // 判断要添加的身份
const platformTableData = ref([]); //平台参数列表
const memberPrimitiveData = ref<any>([]); //角色列表数据
const radio = ref('');
const addMemberTit = ref('');
const projectStatus = ref();
const isProjectDec = ref();
// 参数值列表类型编辑
const tabulationVoList = ref([]);
const itemRadio = ref(''); // 项目选择高亮
// 修复后的行选择配置
/** 勾选表格数据源  */
const selectedRowkeys = ref<any>([]); // 存储选中行的key
const selectedRowList = ref<any>([]); // 存储选中行的完整数据
const selectedUseRowkeys = ref<any>([]); // 存储选中行的key
const selectedUserRowList = ref<any>([]); // 存储选中行的完整数据
const emit = defineEmits(['close', 'refresh-table-data']);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: 'radio',
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
      if (record.projectNumber == selectedRowkeys.value[0]) {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
      } else {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
        selectedRowkeys.value.push(record.projectNumber);
        selectedRowList.value.push(record);
      }
    },
  };
}

const rowSelectionUser = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: 'radio',
    selectedRowKeys: selectedUseRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedUserRowList.value = selectedRows;
      selectedUseRowkeys.value = selectedRowKeys;
    },
  };
});
function customRowUser(record: any) {
  return {
    onClick: () => {
      if (record.id == selectedUseRowkeys.value[0]) {
        selectedUseRowkeys.value = [];
        selectedUserRowList.value = [];
      } else {
        selectedUseRowkeys.value = [];
        selectedUserRowList.value = [];
        selectedUseRowkeys.value.push(record.id);
        selectedUserRowList.value.push(record);
      }
    },
  };
}

// 创建本地化的 locale 配置
// const locale = ref({
//   cancelSort: WeiI18n.t('点击取消排序').value,
//   triggerAsc: WeiI18n.t('点击升序').value,
//   triggerDesc: WeiI18n.t('点击降序').value,
// });

/** handle close */
function handleClose() {
  emit('close');
}

const columns = ref<TableColumnType[]>([
  {
    title: WeiI18n.$t('角色'),
    dataIndex: 'member',
    key: 'member',
    align: 'center',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.member, b.member),
    width: 130,
  },
  {
    title: WeiI18n.$t('成员'),
    dataIndex: 'userName',
    key: 'userName',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.userName, b.userName),
    width: 150,
  },
  {
    title: WeiI18n.$t('工号'),
    dataIndex: 'userId',
    key: 'userId',
    align: 'center',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.userId, b.userId),
    width: 130,
  },
  {
    title: WeiI18n.$t('PDM职位'),
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.roleName, b.roleName),
    width: 150,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 120,
  },
  { width: 1 },
]);

const projectcolumns = ref<TableColumnType[]>([
  {
    title: WeiI18n.$t('项目编号'),
    dataIndex: 'projectNumber',
    key: 'projectNumber',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.projectNumber, b.projectNumber),
    width: 200,
  },
  {
    title: WeiI18n.$t('项目名称'),
    dataIndex: 'projectName',
    key: 'projectName',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.projectName, b.projectName),
    width: 300,
  },
]);

const usercolumns = ref<TableColumnType[]>([
  {
    title: WeiI18n.$t('成员'),
    dataIndex: 'userName',
    key: 'userName',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.userName, b.userName),
    width: 200,
  },
  {
    title: WeiI18n.$t('工号'),
    dataIndex: 'userId',
    key: 'userId',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.userId, b.userId),
    width: 300,
  },
  {
    title: WeiI18n.$t('PDM职位'),
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.roleName, b.roleName),
    width: 300,
  },
]);

const userName = ref();
const userId = ref();
function resetTurnToTask() {
  itemKeywords.value = '';
  itemRadio.value = '';
  syncProject(itemKeywords.value);
}

function turnToTask() {
  radio.value = '';
  if (code.value) {
    sycnProjectUser(code.value);
  }
}

function resetTurnToTask22() {
  userName.value = '';
  userId.value = '';
  radio.value = '';
  if (code.value) {
    sycnProjectUser(code.value);
  }
}

/** handle close */
async function savePageInfo() {}

//初始化数据
const infoReload = (modelTypeIdS: string, productSericeName: string, productSericeId: string) => {
  loadingPro.value = true;
  platformName.value = productSericeName;
  seriesId.value = modelTypeIdS;
  platformId.value = productSericeId;
  //情况表格表单数据
  activeKey.value = 'first';
  code.value = '';
  nameCN.value = '';
  projectCategory.value = '';
  projectType.value = '';
  dateRangeParams.value = '';
  memberData.value = [{ member: '设计经理' }, { member: '机械主管' }, { member: '电气主管' }];
  platformTableData.value = [];
  selectedRowList.value = [];
  nextTick(() => {
    loadingPro.value = false;
  });
};
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.modal-container');
}

// 切换项目和参数列表
function tabDesignClick(tab: any) {
  if (tab === 'second') {
    getParameterList(seriesId.value);
  }
  activeKey.value = tab;
}

// 获取平台参数列表
async function getParameterList(seriesIds: string) {
  requestPropParams.seriesId = seriesIds;
  requestPropParams.userId = userStore.getUser.id;
  const res = await DesignApiInfo.getSeriesParameterListApi({ ...requestPropParams });
  platformTableData.value = res.data.data.data || [];
}

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

//去选择角色
function editmemberClick(row: any) {
  memberStanding.value = row.member;
  addMemberTit.value = row.member;
  if (row.member === '设计经理') {
    radio.value = memberData.value[0].userId;
  } else if (row.member === '机械主管') {
    radio.value = memberData.value[1].userId;
  } else {
    radio.value = memberData.value[2].userId;
  }
  if (code.value) {
    sycnProjectUser(code.value);
    nextTick(() => {
      memberDialogDesign.value = true;
    });
  } else {
    message.error('请先选择项目编号～');
  }
}

//去删除角色
function dlmemberClick(row: any) {
  if (row.member === '设计经理') {
    memberData.value[0] = { member: '设计经理' };
  } else if (row.member === '机械主管') {
    memberData.value[1] = { member: '机械主管' };
  } else {
    memberData.value[2] = { member: '电气主管' };
  }
}
interface memberPrimitiveDataItem {
  member?: string;
  userId?: string;
  userName?: string;
  roleName?: string;
}
//删除列表配置
function deleteRow(row: memberPrimitiveDataItem) {
  console.log(row, 'row');
  console.log(memberData.value, 'memberData');
  memberData.value.forEach((item: memberPrimitiveDataItem) => {
    if (item.member === row.member) {
      item.userId = '';
      item.userName = '';
      item.roleName = '';
    }
  });
}

//请求成员列表
async function sycnProjectUser(id: string) {
  requestUserParams.userId = userId.value;
  requestUserParams.userName = userName.value;
  requestUserParams.project = id;
  const res = await DesignApiInfo.sycnProjectUserApi({ ...requestUserParams });
  memberPrimitiveData.value = [];
  res.data.data.forEach((item: any) => {
    memberPrimitiveData.value.push({
      roleName: item.roleName,
      userId: item.userId,
      userName: item.userName,
      id: generateRandomNumberByTime(),
    });
  });
}

// 去选择项目
function itemSelect() {
  syncProject('');
  itemRadio.value = code.value;
  nextTick(() => {
    itemDialog.value = true;
  });
}

//获取项目列表数据
async function syncProject(keywords: string) {
  requestParams.keywords = keywords;
  const res = await DesignApiInfo.syncProjectApi({ ...requestParams });
  syncProjectData.value = res.data.data;
}

// 搜索项目
function itemSearch() {
  itemRadio.value = '';
  syncProject(itemKeywords.value);
}

// 确认选择项目
function itemOk() {
  if (selectedRowList.value.length > 0) {
    code.value = selectedRowList.value[0].projectNumber;
    nameCN.value = selectedRowList.value[0].projectName;
    itemDialog.value = false;
  } else {
    message.error('请选择项目');
  }
}

function itemDialogCance() {
  itemDialog.value = false;
}

// 确认选择角色
const memberOk = () => {
  console.log(memberStanding.value, 'memberStanding.value');
  console.log(selectedUserRowList.value, 'selectedUserRowList.value');
  if (selectedUserRowList.value.length > 0) {
    if (memberStanding.value === '设计经理') {
      memberData.value[0] = { ...selectedUserRowList.value[0], member: '设计经理' };
    } else if (memberStanding.value === '机械主管') {
      memberData.value[1] = { ...selectedUserRowList.value[0], member: '机械主管' };
    } else {
      memberData.value[2] = { ...selectedUserRowList.value[0], member: '电气主管' };
    }
    nextTick(() => {
      memberDialogDesign.value = false;
    });
  } else {
    message.error('请选择设计经理');
  }
};

function memberCancel() {
  memberDialogDesign.value = false;
}
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

//保存项目信息
async function saveDesign() {
  loadingSave.value = true;
  try {
    // 前端校验：项目信息不能为空
    if (!code.value) {
      message.error('项目编号不能为空');
      loadingSave.value = false;
      return;
    }
    if (!nameCN.value) {
      message.error('项目名称不能为空');
      loadingSave.value = false;
      return;
    }
    if (!projectCategory.value) {
      message.error('项目类别不能为空');
      loadingSave.value = false;
      return;
    }
    if (!projectType.value) {
      message.error('项目类型不能为空');
      loadingSave.value = false;
      return;
    }
    if (!dateRangeParams.value || !Array.isArray(dateRangeParams.value) || dateRangeParams.value.length < 2 || !dateRangeParams.value[0] || !dateRangeParams.value[1]) {
      message.error('计划时间不能为空');
      loadingSave.value = false;
      return;
    }

    // 前端校验：成员管理不能为空（至少需有一个成员被选择）
    const hasMemberAssigned = memberData.value.some((m: any) => !!m.userId || !!m.userName);
    if (!hasMemberAssigned) {
      message.error('成员管理不能为空，请至少添加一名成员');
      loadingSave.value = false;
      return;
    }

    requestInfoParams.platformId = platformId.value;
    requestInfoParams.createUserId = userStore.getUser.id;
    requestInfoParams.code = code.value;
    requestInfoParams.nameCN = nameCN.value;
    requestInfoParams.projectCategory = projectCategory.value;
    requestInfoParams.projectType = projectType.value;
    requestInfoParams.seriesId = seriesId.value;
    requestInfoParams.startTime = dateRangeParams.value[0];
    requestInfoParams.endTime = dateRangeParams.value[1];
    requestInfoParams.designManagerName = memberData.value[0].userId;
    requestInfoParams.mechanicalName = memberData.value[1].userId;
    requestInfoParams.electricalName = memberData.value[2].userId;
    const res = await DesignApiInfo.addProjectApi({ ...requestInfoParams });
    debugger;
    const resCode = res.data.code;
    if (resCode !== '0') {
      message.error(res.data.msg);
      return;
    } else {
      message.success('保存成功');
      //刷新父页面列表数据
      emit('refresh-table-data');
      //关闭当前窗口
      emit('close');
    }
  } catch (error) {
    message.error('保存失败:' + error);
  } finally {
    loadingSave.value = false;
  }
}

// 若名称长度超过 4 个字符，截断并加省略号
function getShortName(name: any) {
  if (name === null || name === undefined) return '';
  const s = String(name);
  return s.length > 4 ? s.slice(0, 4) + '...' : s;
}

defineExpose({
  infoReload,
});
</script>

<template>
  <div class="modal-container">
    <a-modal
      v-model:visible="visible"
      style="width: 90%"
      :style="{ top: '5%', height: '700px' }"
      :title="$t('项目管理')"
      :cancel-text="$t('取消')"
      :ok-text="$t('确定')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="saveDesign"
      @cancel="handleClose">
      <a-tabs v-model:active-key="activeKey" @tab-click="tabDesignClick" style="margin-top: -20px">
        <a-tab-pane tab="项目信息" key="first">
          <a-form model="ruleFormRef" style="margin-top: 20px; display: flex; flex-wrap: wrap" :label-col="{ style: { width: '80px' } }">
            <a-form-item :label="$t('项目编号')" width="350">
              <a-input v-model:value="code" name="code" disabled />
              <a class="selectLi" @click="itemSelect">浏览</a>
            </a-form-item>
            <a-form-item :label="$t('项目名称')" width="350">
              <a-input v-model:value="nameCN" name="nameCN" disabled />
            </a-form-item>
            <a-form-item :label="$t('平台名称')" width="350">
              <a-input v-model:value="platformName" placeholder="请输入平台名称" name="platformName" disabled />
            </a-form-item>
            <a-form-item :label="$t('项目类别')" width="350">
              <a-select v-model:value="projectCategory" placeholder="请选择项目类别" style="width: 220px">
                <a-select-option value="1">市场执行项目</a-select-option>
                <a-select-option value="2">科技开发项目</a-select-option>
                <a-select-option value="3">机电业务项目</a-select-option>
                <a-select-option value="4">检修运维项目</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('项目类型')" width="350">
              <a-select v-model:value="projectType" placeholder="请选择项目类别" style="width: 220px">
                <a-select-option value="1">一般改进型产品</a-select-option>
                <a-select-option value="2">重大改进型产品</a-select-option>
                <a-select-option value="3">延续型产品</a-select-option>
                <a-select-option value="4">全新产品</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('计划时间')" width="350">
              <a-range-picker format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" style="width: 230px" v-model:value="dateRangeParams" />
            </a-form-item>
          </a-form>
          <a-divider />
          <a-row class="elrow">
            <a-col :span="24">
              <div style="margin: 10px">成员管理</div>
            </a-col>
            <!--    表格处 -->
            <a-table
              :scroll="{ x: 800 }"
              :row-key="(record: any) => record.id"
              :columns="columns"
              :locale="locale"
              style="width: 100%"
              :pagination="false"
              :data-source="memberData"
              @resizeColumn="handleResizeColumn"
              :loading="loading"
              :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                  {{ record.name }}
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                  <a @click="editmemberClick(record)">{{ $t('添加') }}</a>
                  <a-divider type="vertical" v-if="record.userName" />
                  <a-popconfirm title="确认删除?" ok-text="确定" cancel-text="取消" @confirm="deleteRow(record)" v-if="record.userName">
                    <a class="action-btn">删除</a>
                  </a-popconfirm>
                </template>
              </template>
            </a-table>
          </a-row>
        </a-tab-pane>
        <a-tab-pane tab="参数信息" key="second">
          <a-form style="margin-top: 20px; display: flex; flex-wrap: wrap" :label-col="{ style: { width: '80px' } }">
            <a-form-item width="350" v-for="item in platformTableData" :key="item.id">
              <template #label>
                <a-tooltip :title="item.parameterName">
                  <span>{{ getShortName(item.parameterName) }}</span>
                </a-tooltip>
              </template>
              <a-input v-model:value="item.value" name="item.value" placeholder="暂无参数值..." disabled />
              <EpcIcon type="icon-xiangqingon" v-if="item.rangeValue" style="margin-left: 5px; position: absolute; line-height: 35px; cursor: pointer" :title="item.rangeValue" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <template #footer v-if="activeKey === 'first'">
        <span class="dialog-footer">
          <a-button type="primary" @click="saveDesign()" v-if="isProjectDec != 'dec'"> 确定 </a-button>
          <a-button @click="handleClose()">取消</a-button>
        </span>
      </template>
      <template #footer v-else>
        <span class="dialog-footer"> </span>
      </template>
    </a-modal>
  </div>

  <!-- 选择项目 -->
  <a-modal v-model:visible="itemDialog" title="选择项目" draggable width="1000px">
    <div style="width: 100%; background: #fff; margin-top: 4px">
      <div class="grid-content" style="padding: 0; background: #fff; border: none">
        <a-input v-model:value="itemKeywords" style="width: 220px; margin-right: 10px" placeholder="请输入编号进行搜索" allowClear />
        <a-button type="primary" @click="itemSearch"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />查询</a-button>
        <a-button @click="resetTurnToTask" style="margin-left: 10px"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
      </div>
      <!--    表格处 -->
      <a-table
        v-if="!loadingPro"
        :scroll="{ x: 800, y: '50vh' }"
        :row-key="(record: any) => record.projectNumber"
        :columns="projectcolumns"
        :row-selection="rowSelection"
        :customRow="customRow"
        :locale="locale"
        :pagination="false"
        style="width: 100%; margin-top: 10px"
        :data-source="syncProjectData"
        :loading="loadingPro"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            {{ record.name }}
          </template>
        </template>
      </a-table>
      <div v-else class="example">
        <a-spin tip="加载中..." />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="itemOk()"> 确定 </a-button>
        <a-button @click="itemDialogCance()">取消</a-button>
      </span>
    </template>
  </a-modal>

  <!-- 选择成员弹窗 -->
  <a-modal v-model:visible="memberDialogDesign" :title="'添加' + addMemberTit" draggable width="1000px">
    <div style="width: 100%; background: #fff; margin-top: 4px">
      <div class="grid-content" style="padding: 0; background: #fff; border: none">
        <a-input v-model:value="userName" style="width: 220px" placeholder="请输入姓名" claerable />
        <a-input v-model:value="userId" style="width: 220px; margin-left: 10px" placeholder="请输入工号" allowClear />
        <a-button type="primary" style="margin-left: 10px" @click="turnToTask"><EpcIcon type="icon-fangdajing" style="font-size: 12px" />搜索</a-button>
        <a-button @click="resetTurnToTask22" style="margin-left: 10px"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
      </div>
      <!--    表格处 -->
      <a-table
        v-if="!loadingPro"
        :scroll="{ x: 800, y: '50vh' }"
        :row-key="(record: any) => record.id"
        :columns="usercolumns"
        :row-selection="rowSelectionUser"
        :customRow="customRowUser"
        :locale="locale"
        :pagination="false"
        style="width: 100%; margin-top: 10px"
        :data-source="memberPrimitiveData"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            {{ record.name }}
          </template>
        </template>
      </a-table>
      <div v-else class="example">
        <a-spin tip="加载中..." />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="memberOk()"> 确定 </a-button>
        <a-button @click="memberCancel()">取消</a-button>
      </span>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
:deep(.ant-input) {
  width: 220px !important;
}

:deep(.ant-form-item) {
  margin-left: 50px;
}
:deep(.ant-divider-horizontal) {
  margin: 5px 0 !important;
}

.selectLi {
  margin-left: 5px;
  position: absolute;
  width: 60px;
  line-height: 30px;
}

:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

// :deep(.ant-table-tbody > tr > td) {
//   padding: 5px;
// }

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
.example {
  position: absolute;
  top: 50%;
  left: 50%;
}
.action-btn {
  color: red;
}
</style>
