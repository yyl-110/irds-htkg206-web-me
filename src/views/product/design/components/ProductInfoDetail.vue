<script lang="ts" setup>
import type { TableColumnType } from 'ant-design-vue';
import { ProjectPageRequestDTOModel } from '@/api/models/design/ProjectPageRequestDTOModel';
import { ProjectUserRequestDTOModel } from '@/api/models/design/ProjectUserRequestDTOModel';
import { ProjectPropRequestDTOModel } from '@/api/models/design/ProjectPropRequestDTOModel';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { useUserStore } from '@/store/modules/user';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
const requestParams = reactive(new ProjectPageRequestDTOModel());
const requestUserParams = reactive(new ProjectUserRequestDTOModel());
const requestPropParams = reactive(new ProjectPropRequestDTOModel());
import ProductDelivery from './childrenComponents/productDeliveryFileList.vue';
import Empty from '@/components/Empty/index.vue';
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
const loading = ref<boolean>(false);
const loadingPro = ref<boolean>(false);

const memberData = ref([{ member: '设计经理' }, { member: '机械主管' }, { member: '电气主管' }]);
const code = ref('');
const nameCN = ref('');
const platformName = ref('');
const platformId = ref('');
const seriesId = ref('');
const projectCategory = ref('');
const projectType = ref('');
const itemDialog = ref(false); // 项目选择弹窗
const syncProjectData = ref([]); // 项目列表数据
const dateRangeParams = ref([null, null]);
const platformTableData = ref([]); //平台参数列表
const itemRadio = ref(''); // 项目选择高亮
const emit = defineEmits(['close', 'refresh-table-data']);

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
    align: 'center',
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
    align: 'center',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.roleName, b.roleName),
    width: 150,
  },
  { width: 1 },
]);

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

//初始化数据
async function infoReload(modelTypeIdS: string, productSericeName: string, productSericeId: string, row: any, resourceType: string) {
  loadingPro.value = true;
  productId.value = row.id;
  platformName.value = productSericeName;
  seriesId.value = modelTypeIdS;
  platformId.value = productSericeId;
  //情况表格表单数据
  activeKey.value = 'first';
  id.value = row.id;
  code.value = row.code;
  nameCN.value = row.nameCN;
  projectCategory.value = row.projectCategory;
  projectType.value = row.projectType;
  dateRangeParams.value = [row.startTime, row.endTime];
  requestUserParams.project = row.code;
  const res = await DesignApiInfo.sycnProjectUserApi({ ...requestUserParams });
  let designManager = {};
  let mechanical = {};
  let electrical = {};
  if (row.designManagerUserName) {
    designManager = res.data.data.filter(item => item.userId === row.designManagerUserName)[0];
  }
  if (row.mechanicalUserName) {
    mechanical = res.data.data.filter(item => item.userId === row.mechanicalUserName)[0];
  }
  if (row.electricalUserName) {
    electrical = res.data.data.filter(item => item.userId === row.electricalUserName)[0];
  }
  memberData.value[0] = { ...designManager, member: '设计经理' };
  memberData.value[1] = { ...mechanical, member: '机械主管' };
  memberData.value[2] = { ...electrical, member: '电气主管' };

  nextTick(() => {
    loadingPro.value = false;
  });
}
const productDeliverylistRef = ref<any>(null);
const productId = ref('');
// 切换项目和参数列表
async function tabDesignClick(tab: any) {
  // 先切换 tab，这样对应的子组件才会被挂载
  activeKey.value = tab;

  if (tab === 'second') {
    getParameterList(seriesId.value);
  } else if (tab === 'third') {
    // 等待 DOM 更新/子组件挂载后再调用子组件方法
    await nextTick();
    productDeliverylistRef.value?.reloadTaskInfosss(productId.value, 'detail');
  }
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

// 去选择项目
function itemSelect() {
  syncProject('');
  itemRadio.value = code.value;
  nextTick(() => {
    itemDialog.value = true;
  });
}

// 若名称长度超过 4 个字符，截断并加省略号
function getShortName(name: any) {
  if (name === null || name === undefined) return '';
  const s = String(name);
  return s.length > 4 ? s.slice(0, 4) + '...' : s;
}

//获取项目列表数据
async function syncProject(keywords: string) {
  requestParams.keywords = keywords;
  const res = await DesignApiInfo.syncProjectApi({ ...requestParams });
  syncProjectData.value = res.data.data;
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
      :title="$t('项目详情')"
      :cancel-text="$t('取消')"
      :ok-text="$t('确定')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @cancel="handleClose">
      <a-tabs v-model:active-key="activeKey" @tab-click="tabDesignClick" style="margin-top: -20px">
        <a-tab-pane tab="项目信息" key="first">
          <a-form model="ruleFormRef" style="margin-top: 20px; display: flex; flex-wrap: wrap" :label-col="{ style: { width: '80px' } }">
            <a-form-item :label="$t('项目编号')" width="350">
              <a-input v-model:value="code" name="code" disabled />
            </a-form-item>
            <a-form-item :label="$t('项目名称')" width="350">
              <a-input v-model:value="nameCN" name="nameCN" disabled />
            </a-form-item>
            <a-form-item :label="$t('平台名称')" width="350">
              <a-input v-model:value="platformName" placeholder="请输入平台名称" name="platformName" disabled />
            </a-form-item>
            <a-form-item :label="$t('项目类别')" width="350">
              <a-select v-model:value="projectCategory" placeholder="请选择项目类别" style="width: 220px" disabled>
                <a-select-option value="1">市场执行项目</a-select-option>
                <a-select-option value="2">科技开发项目</a-select-option>
                <a-select-option value="3">机电业务项目</a-select-option>
                <a-select-option value="4">检修运维项目</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('项目类型')" width="350">
              <a-select v-model:value="projectType" placeholder="请选择项目类别" style="width: 220px" disabled>
                <a-select-option value="1">一般改进型产品</a-select-option>
                <a-select-option value="2">重大改进型产品</a-select-option>
                <a-select-option value="3">延续型产品</a-select-option>
                <a-select-option value="4">全新产品</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('计划时间')" width="350">
              <a-range-picker
                v-model:value="dateRangeParams"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                disabled
                style="width: 230px; text-align: left"
                :placeholder="[$t('开始时间'), $t('结束时间')]" />
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
        <a-tab-pane tab="项目进度及输出物" key="third">
          <ProductDelivery ref="productDeliverylistRef" />
        </a-tab-pane>
      </a-tabs>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="handleClose()" type="primary"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
        </span>
      </template>
    </a-modal>
  </div>
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
