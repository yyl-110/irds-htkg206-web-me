<script setup lang="ts">
import { generateRandomNumberByTime } from '@/utils/tools';
import { Button, Popconfirm, message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import type { CarouselProps, TableColumnType, TableProps, TreeProps } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import { cloneDeep } from 'lodash-es';
import { WeiI18n } from '@/utils/WeiI18n';
import UploadModal from '@/views/system/language/modal/upload-modal.vue';
import AddModal from '@/views/system/language/modal/add-modal.vue';
import Label from '@/components/label/Label.vue';
import { AdminApiSystemLanguage } from '@/api/tags/管理后台多语言';
import { AdminApiSystemBasiclanguage } from '@/api/tags/管理基础语言';
import { LanguagePageRequestDTOModel } from '@/api/models/language/LanguagePageRequestDTOModel';
import { exportFile } from '@/utils/file';
import type { ColumnsLanguagePOModel } from '@/api/models/language/LanguagePOModel';
import { EpcIcon } from '@/components/icon/EpcIcon';

/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); //
const loading = ref(false);
const saveloading = ref(false);
// 声明key 类型
type Key = string | number;
// 声明表格类型
interface DataType {
  id: Key;
  partCod: string;
  partNam: number;
  amount: string;
}
/** tab切换  */
const activeKey = ref('1');

/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);

/** 主表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowList.value = selectedRows;
  },
};

/**
 * @description 导出数据
 */
async function exportData() {
  const res = await AdminApiSystemLanguage.excelExport({}).then(res => {
    exportFile(res, '语言列表.xlsx');
  });
}
/**
 * @description 导出数据
 */
async function exportstandardData() {
  const res = await AdminApiSystemLanguage.excelstandardExport({}).then(res => {
    exportFile(res, '语言列表.xlsx');
  });
}

/** 附件上传 弹窗状态 */
const modalVisible = ref(false);

/** 列表请求参数 */
const requestParams = reactive(new LanguagePageRequestDTOModel());
requestParams.searchKey = undefined;

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 多语言列属性定义 */
const columnsLanguage = ref<Array<ColumnsLanguagePOModel>>([]);

/** 多语言添加属性定义 */
const addLanguage = ref<Array<ColumnsLanguagePOModel>>([]);

/** 多语言列数据 定义 */
const dataSource = ref<Array<any>>([]);
// eslint-disable-next-line jsdoc/check-indentation
/**  获取共同的 operation 操作属性  */
const operationWidth = computed<number>(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root).getPropertyValue('--main-operation4-width');
  return Number(width);
});

/** 操作按钮定义 */
const operation = ref<ColumnsLanguagePOModel>({
  title: WeiI18n.t('操作').value,
  align: 'left',
  dataIndex: 'operation',
  width: operationWidth.value,
  fixed: 'right',
});

/** 当前编辑数据 */
const editableData: UnwrapRef<Record<string, any>> = reactive({});

/** 当前删除数据 */
const delData: UnwrapRef<Record<string, any>> = reactive({});

/** 列属性key  */
const columnsKey = ref<Array<string>>([]);

/** list 请求方法  */
const pageListMethod = ref('getLanguagePage');

/** update 请求方法  */
const updateMethod = ref('updateLanguage');

/** delete 请求方法  */
const deleteMethod = ref('deleteLanguage');

/**
 * @description 获取语言数据列表
 */
async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemLanguage[pageListMethod.value]({
      ...requestParams,
    });
    if (res.data.code === 200) {
      columnsLanguage.value = res.data.data?.language || [];
      // 获取列key，页面编辑使用
      if (columnsLanguage.value) {
        columnsLanguage.value.forEach((item: any) => {
          item.dataIndex = item.lang;
          item.title = item.langDesc;
          // item.width = 100
          columnsKey.value.push(item.dataIndex);
        });
      }
      addLanguage.value = cloneDeep(columnsLanguage.value || []);
      // 添加操作列
      columnsLanguage.value.push(operation.value);
      dataSource.value = res.data.data?.list || [];
      dataSource.value.forEach(item => {
        item.key = generateRandomNumberByTime();
      });
      pagination.total = res.data.data?.total;
    }
  } finally {
    loading.value = false;
  }
}

/**
 * @description 编辑点击事件
 * @param key 行数据key
 */
function edit(key: string) {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
}

/**
 * @description 保存点击事件
 * @param key 行数据key
 */
async function handleSave(key: string) {
  saveloading.value = true;
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  try {
    const res = await AdminApiSystemLanguage[updateMethod.value](editableData[key]);
    if (res.data.code === 200) {
      saveloading.value = false;
      message.success(WeiI18n.t('修改成功').value);
    }
  } finally {
    saveloading.value = false;
  }

  delete editableData[key];
}

async function delLanguage(key: string) {
  delData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  const res = await AdminApiSystemLanguage[deleteMethod.value](delData[key]);
  if (res.data.code === 200) {
    message.success(WeiI18n.t('删除成功').value);
  }
  getListData();
}

/**
 * @description 取消点击事件
 * @param key 行数据key
 */
function cancel(key: string) {
  delete editableData[key];
}

/**
 * @description 清除搜索
 */
function clearSearch() {
  if (requestParams.searchKey === '') {
    requestParams.pageNo = 1;
    pagination.current = 1;
    getListData();
  }
}

/**
 * @description tab切换
 * @param key tab切换key
 */
function tabChange(key: string) {
  if (key === '1') {
    pageListMethod.value = 'getLanguagePage';
    updateMethod.value = 'updateLanguage';
    deleteMethod.value = 'deleteLanguage';
  } else if (key === '2') {
    pageListMethod.value = 'getLanguageBackendPage';
    updateMethod.value = 'updateBackendLanguage';
    deleteMethod.value = 'deleteBackendLanguage';
  }
  getListData();
}

/**
 * @description 导入数据成功回调
 */
function importSuccess() {
  getListData();
  modalVisible.value = false;
}

const addModalVisible = ref<boolean>(false);
/**
 * @description 打开弹窗
 */
function handleAddModal() {
  addModalVisible.value = true;
}

/**
 * @param modelData 添加对象
 * @description 添加确认
 */
async function handleAddSave(modelData: any) {
  const res = await AdminApiSystemLanguage.createBackendLanguage(modelData);
  if (res.data.code === 200) {
    message.success(WeiI18n.t('添加成功').value);
  }
  addModalVisible.value = false;
  getListData();
}
onActivated(() => {
  getListData();
});
/** 查询表格数据 */
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}
const loading1 = ref(false);
const loading2 = ref(false);
/**
 * 同步
 */
async function Sincronizar() {
  loading1.value = true;
  try {
    const res = await AdminApiSystemBasiclanguage.Sincronizar();
    if (res.data.code === 200) {
      message.success(WeiI18n.t('同步成功').value);
      loading1.value = false;
    }
  } catch (error) {
    loading1.value = false;
  }
}
async function Sincronizarredis() {
  loading2.value = true;
  try {
    const res = await AdminApiSystemBasiclanguage.Sincronizarredis();
    if (res.data.code === 200) {
      message.success(WeiI18n.t('同步成功').value);
      loading2.value = false;
    }
  } catch (error) {
    loading2.value = false;
  }
}
</script>

<template>
  <div class="bg-body">
    <div class="center-body">
      <a-tabs v-model:active-key="activeKey" @change="tabChange">
        <a-tab-pane key="1" :tab="$t('界面元素')">
          <a-row type="flex">
            <a-col flex="1 1 200px" style="height: 100%">
              <!-- v-hasPermi="['system:multilangFront:expData']" -->
              <a-button type="primary" class="m-right" @click="exportData">
                <EpcIcon type="icon-daochu" style="font-size: 12px" />
                {{ $t('导出') }}
              </a-button>
              <!-- v-hasPermi="['system:multilangFront:impData']" -->
              <a-button type="primary" class="m-right" @click="modalVisible = true">
                <EpcIcon type="icon-daoru1" style="font-size: 12px" />
                {{ $t('导入') }}
              </a-button>
              <a-button type="primary" :loading="loading1" @click="Sincronizar()">
                {{ $t('同步') }}
              </a-button>
            </a-col>
            <a-col flex="0 1 260px" style="height: 100%">
              <div class="w-full w-input-c">
                <a-input
                  v-model:value="requestParams.searchKey"
                  allow-clear
                  class="min-w-[100px] max-w-[400px]"
                  :placeholder="$t('根据中文搜索')"
                  @change="clearSearch"
                  @press-enter="handleFinish">
                  <template #suffix>
                    <SearchOutlined @click="handleFinish" />
                  </template>
                </a-input>
              </div>
            </a-col>
          </a-row>
          <div style="padding-top: 20px">
            <a-table
              :scroll="{ x: 1200, y: tableHXH }"
              :pagination="pagination"
              :loading="loading"
              row-key="id"
              :data-source="dataSource"
              :columns="columnsLanguage"
              :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
              <!-- :row-selection="rowSelection" -->
              <template #bodyCell="{ column, text, record }">
                <template v-if="columnsKey.includes(column.dataIndex)">
                  <div>
                    <a-input
                      v-if="editableData[record.key]"
                      v-model:value="editableData[record.key][column.dataIndex]"
                      style="margin: -5px 0"
                      :disabled="column.dataIndex == 'zh_CN' ? true : false" />
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                  <div>
                    <span v-if="editableData[record.key]">
                      <!-- v-hasPermi="['system:multilangFront:update']" -->
                      <a-typography-link @click="handleSave(record.key)">{{ $t('保存') }}</a-typography-link>
                      <!-- v-hasPermi="['system:multilangFront:update']" -->
                      <a-divider type="vertical" />
                      <a-typography-link @click="cancel(record.key)">{{ $t('取消') }}</a-typography-link>
                    </span>
                    <span v-else>
                      <!-- v-hasPermi="['system:multilangFront:update']" -->
                      <a @click="edit(record.key)">{{ $t('编辑') }}</a>
                      <a-divider type="vertical" />
                      <a-popconfirm :title="`${$t('确定要删除吗')}?`" @confirm="delLanguage(record.key)">
                        <a class="del-text">{{ $t('删除') }}</a>
                      </a-popconfirm>
                    </span>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('标准名称')">
          <a-row type="flex">
            <a-col flex="1 1 200px" style="height: 100%">
              <!-- v-hasPermi="['system:multilangFront:update']" -->
              <a-button type="primary" class="m-right" @click="handleAddModal">
                <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
                {{ $t('添加') }}
              </a-button>
              <a-button type="primary" class="m-right" @click="exportstandardData">
                <EpcIcon type="icon-daochu" style="font-size: 12px" />
                {{ $t('导出') }}
              </a-button>
              <a-button type="primary" class="m-right" @click="modalVisible = true">
                <EpcIcon type="icon-daoru1" style="font-size: 12px" />
                {{ $t('导入') }}
              </a-button>
              <a-button type="primary" :loading="loading2" @click="Sincronizarredis()">
                {{ $t('同步') }}
              </a-button>
            </a-col>
            <a-col flex="0 1 260px" style="height: 100%">
              <div class="w-full w-input-c">
                <a-input
                  v-model:value="requestParams.searchKey"
                  allow-clear
                  class="min-w-[100px] max-w-[400px]"
                  :placeholder="$t('根据中文搜索')"
                  @change="clearSearch"
                  @press-enter="handleFinish">
                  <template #suffix>
                    <SearchOutlined @click="handleFinish" />
                  </template>
                </a-input>
              </div>
            </a-col>
          </a-row>
          <div style="padding-top: 20px">
            <a-table
              :scroll="{ x: 1200, y: tableHXH }"
              :pagination="pagination"
              :loading="loading"
              row-key="cnKey"
              :data-source="dataSource"
              :columns="columnsLanguage"
              :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
              <template #bodyCell="{ column, text, record }">
                <template v-if="columnsKey.includes(column.dataIndex)">
                  <div>
                    <a-input
                      v-if="editableData[record.key]"
                      v-model:value="editableData[record.key][column.dataIndex]"
                      :disabled="column.dataIndex == 'zh_CN' ? true : false"
                      style="margin: -5px 0" />
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                  <div class="editable-row-operations">
                    <span v-if="editableData[record.key]">
                      <a-button type="link" :loading="saveloading" @click="handleSave(record.key)">{{ $t('保存') }}</a-button>
                      <a-divider type="vertical" />
                      <a-typography-link class="table-m-right" @click="cancel(record.key)">{{ $t('取消') }}</a-typography-link>
                    </span>
                    <span v-else>
                      <!-- v-hasPermi="['system:multilangFront:update']" -->
                      <a @click="edit(record.key)">{{ $t('编辑') }}</a>
                      <!-- v-hasPermi="['system:multilangFront:update']" -->
                      <a-divider type="vertical" />
                      <a-popconfirm :title="`${$t('确定要删除吗')}?`" @confirm="delLanguage(record.key)">
                        <!-- v-hasPermi="['system:multilangFront:delete']" -->
                        <a class="del-text">{{ $t('删除') }}</a>
                      </a-popconfirm>
                    </span>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <UploadModal :activeKey="activeKey" :modal-visible="modalVisible" @cancel="modalVisible = false" @import-success="importSuccess" />
  <AddModal :modal-visible="addModalVisible" :language-form="addLanguage" @handle-save="handleAddSave" @cancel="addModalVisible = false" />
</template>

<style lang="less" scoped>
.del-text {
  color: var(--ant-error-color);
}
.bg-body {
  width: 100%;
  height: auto;
  background-color: #ffffff;
  padding-left: 20px;
  padding-right: 20px;
}

.assemContent {
  display: flex;
  height: calc(100vh - 163px);
  background-color: #ffffff;
  width: calc(100vw - 40px);
  margin: 0 20px;
  .dragLine {
    cursor: ew-resize;
    position: absolute;
    right: 0;
    width: 15px;
    height: 84%;
    padding-top: 35vh;
    top: 0;
  }

  .left-body {
    min-width: 150px;
    height: auto;
    position: relative;
    background-color: #ffffff;
  }

  .center-body {
    min-width: 300px;
    height: auto;
    background-color: #ffffff;
    position: relative;
    margin-left: 20px;
    padding-bottom: 20px;
  }
  .right-body {
    min-width: 300px;
    height: auto;
    background-color: #ffffff;
    padding: 20px;
  }

  .carousel-item {
    width: 100%;
    height: 550px;
  }
}
</style>
