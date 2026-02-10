<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { AdminApiCompetitor } from '@/api/tags/competitor/竞品数据库管理';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod } from '@/utils/tools';
import { ParameterPageRequestDTOModel } from '@/api/models/parameter/ParameterPageRequestDTOModel';
import { ParameterInfoRequestDTOModel } from '@/api/models/parameter/ParameterInfoRequestDTOModel';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { number } from 'mathjs';
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
const formRef = ref();
const loadingTree = ref<boolean>(false);
const userStore = useUserStore();
/** 列表请求参数 */
const requestParams = reactive(new ParameterPageRequestDTOModel());
/** 列表数据 */
const datasource = ref<Array<ParameterInfoRequestDTOModel>>([]);

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

const updateVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const AddDialogVisible = ref(false);
const competitorName = ref('');
const sortIndex = ref<number>(0);
const DataTitle = ref('');
const updateId = ref<number>(0);
// 表单数据
const formData = reactive({
  competitorName: '',
  sortIndex: 0,
});

const columns = ref<TableColumnType<any>[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: 60,
    fixed: 'left',
    customRender({ text, record, index }) {
      return h('div', {}, [h('span', { innerText: index + 1 })]);
    },
  },
  {
    title: WeiI18n.$t('竞争对手名称'),
    dataIndex: 'competitorName',
    key: 'competitorName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.competitorName, b.competitorName),
    width: 200,
  },
  {
    title: WeiI18n.$t('状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
    width: 100,
  },
  {
    title: WeiI18n.$t('排序索引'),
    dataIndex: 'sortIndex',
    key: 'sortIndex',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.sortIndex + '', b.sortIndex + ''),
    width: 100,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 100,
    fixed: 'right',
  },
]);

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData() {
  loadingTree.value = true;
  AddDialogVisible.value = false;
  try {
    //加载表格数据
    AdminApiCompetitor.getCompetitorInfoList().then(res => {
      if (res && res.data.code == 200) {
        datasource.value = res.data.data;
        AddDialogVisible.value = false;
      }
    });
  } catch (error) {
    message.error('获取数据失败！');
  } finally {
    loadingTree.value = false;
  }
}

// onActivated(() => {
//   getListData();
// });

/**
 * 新增
 * @param id id
 * @param parentId parentId
 */
function handleAddOrUpdate() {
  formData.competitorName = '';
  formData.sortIndex = 0;
  updateId.value = 0;
  AddDialogVisible.value = true;
  formRef.value.resetFields();
  DataTitle.value = '添加竞争对手';
}

/**
 * 修改
 * @param data data
 */
function handleUpdate(data: any) {
  AddDialogVisible.value = true;
  formRef.value.resetFields();
  formData.competitorName = data.competitorName;
  formData.sortIndex = data.sortIndex;
  updateId.value = data.id;
  DataTitle.value = '编辑竞争对手';
}

function handleResizeColumn(w, col) {
  col.width = w;
}

/**
 * 删除数据
 * @param id id
 */
async function handleParameterDelete(data: any) {
  console.log('删除数据', data);
  const params = {
    id: data.id,
  };
  await AdminApiCompetitor.deleteCompetitorInfo(params);
  getListData();
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.TreeModuleModal');
}

// 增加编辑弹窗
async function confirm() {
  await formRef.value?.validate();
  const params = {
    id: updateId.value,
    competitorName: formData.competitorName,
    sortIndex: number(formData.sortIndex),
  };
  AdminApiCompetitor.competitorInfoAdd(params).then(res => {
    if (res && res.data.code == 200) {
      getListData();
      AddDialogVisible.value = false;
    }
  });
}

const emit = defineEmits<{
  /** 获取兄弟节点数组 */
  close: any;
}>();

defineExpose({ getListData });
</script>

<template>
  <div class="TreeModuleModal">
    <a-modal title="竞争对手管理" v-model:visible="visible" width="1000px" :getContainer="customGetContainer" :confirm-loading="$isPending()" @cancel="emit('close')">
      <a-card>
        <a-button type="primary" @click="handleAddOrUpdate()" style="margin-left: 5px">
          <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
          {{ $t('添加') }}
        </a-button>
      </a-card>
      <a-card style="margin-top: 10px" class="comptable-body">
        <!--    表格处 -->

        <a-table
          :scroll="{ x: 600 }"
          :row-key="(record: any) => record.id"
          :columns="columns"
          :data-source="datasource"
          :pagination="false"
          @resizeColumn="handleResizeColumn"
          :locale="locale"
          :loading="loading"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              {{ record.name }}
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <span>
                <a-tag v-if="record.status == 0" color="blue">{{ $t('不可删除') }}</a-tag>
                <a-tag v-else-if="record.status == 1" color="red">{{ $t('可删除') }}</a-tag>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="handleUpdate(record)">{{ $t('编辑') }}</a>
              <a-divider type="vertical" v-if="record.status == 1" />
              <a-popconfirm :title="`${$t('确定要删除吗')}?`" v-if="record.status == 1" ok-text="确定" cancel-text="取消" @confirm="handleParameterDelete(record)">
                <a-button type="link" danger class="p-0" v-if="record.status == 1">
                  {{ $t('删除') }}
                </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </a-card>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="emit('close')">关闭</a-button>
        </div>
      </template>
    </a-modal>
  </div>

  <a-modal v-model:visible="AddDialogVisible" :title="DataTitle" width="30%">
    <a-form :label-col="{ style: { width: '140px' } }" ref="formRef" :model="formData" label-position="right" label-width="100">
      <a-form-item label="竞争对手名称" name="competitorName" :rules="{ required: true, message: '请输入竞争对手名称' }">
        <a-input v-model:value="formData.competitorName" allowClear></a-input>
      </a-form-item>
      <a-form-item label="排序索引">
        <a-input v-model:value="formData.sortIndex" allowClear></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="dialog-footer">
        <a-button type="primary" @click="confirm">确定</a-button>
        <a-button @click="AddDialogVisible = false">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
::v-deep(.splitpanes__splitter:after),
::v-deep(.splitpanes__splitter:before) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.sbom > .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: #fff;
}
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  display: flex;
  background-color: #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
.comptable-body {
  height: calc(100vh - 400px);
  overflow-y: auto;
}
</style>
