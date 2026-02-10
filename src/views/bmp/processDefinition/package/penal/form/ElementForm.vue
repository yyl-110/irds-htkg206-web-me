<template>
  <div class="form-content">
    <!-- 字段列表 -->
    <div class="element-property list-property">
      <a-button type="primary" size="small" @click="addForm()">
        <template #icon><plus-outlined /></template>
        添加表单
      </a-button>
      <a-divider>
        <template #icon><wallet-outlined /></template>
        表单字段
      </a-divider>

      <a-table v-if="fieldList.length" :data-source="fieldList" size="small" :scroll="{ y: 240 }" bordered :pagination="false">
        <a-table-column key="pageName" title="页面名称" data-index="pageName" align="center" :width="80" :ellipsis="true" />
        <a-table-column key="pageType" title="页面类型" data-index="pageType" align="center" :width="80" :ellipsis="true" />
      </a-table>
    </div>

    <!-- 添加表单抽屉 -->
    <a-drawer v-model:visible="drawer" title="添加表单" placement="right" width="600">
      <a-table
        ref="tableRef"
        :data-source="formList"
        size="small"
        :pagination="false"
        :scroll="{ y: 'calc(85vh - 200px)' }"
        row-key="id"
        :row-selection="{
          type: 'radio',
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectionChange,
          columnWidth: 40,
        }">
        <!-- :customRow="customRow" -->
        <a-table-column key="pageName" title="页面名称" data-index="pageName" align="center" :width="100" :ellipsis="true" />
        <a-table-column key="pageType" title="页面类型" data-index="pageType" align="center" :width="100" :ellipsis="true" />
      </a-table>
      <div class="pagination-wrapper">
        <a-pagination
          size="small"
          :total="total"
          :page-size="pageSize"
          :current="pageNum"
          :page-size-options="['10', '30', '50', '100', '200']"
          :show-total="(total: any) => `${$t('共') + total + $t('条')}`"
          :build-option-text="prop => `${prop.value}${$t('条/页')}`"
          show-size-changer
          show-less-items
          @change="onPageChange"
          @show-size-change="onPageSizeChange" />
      </div>
      <div class="action-buttons">
        <a-button type="primary" @click="confirm">确定</a-button>
        <a-button style="margin-left: 8px" @click="cancel">取消</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, WalletOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';
const router = useRouter();
const props = defineProps({
  elementBusinessObject: {
    type: Object,
    default: () => {},
  },
  currentNode: {
    type: Object,
    default: () => {},
  },
});
// 响应式数据
const bpmnElement = ref(null);
const loading = ref(false);
const drawer = ref(false);
const fieldList = ref([]);
const formList = ref([]);
const selectedRowKeys = ref([]);
const selectedRow = ref({});
const pageSize = ref(10);
const pageNum = ref(1);
const total = ref(0);
const deepCope = ref([]);
const arrData = ref([]);
const tableRef = ref();

// 计算属性
// const flowImg = computed(() => store.getters.flowImg);
// const setName = computed(() => store.getters.setName);
// const nameFlag = computed(() => store.getters.nameFlag);

// 生命周期
onMounted(() => {
  bpmnElement.value = window.bpmnInstances?.bpmnElement || null;
  const savedData = localStorage.getItem('selecData');
  if (savedData) {
    try {
      fieldList.value = [JSON.parse(savedData)];
    } catch (error) {
      console.error('解析本地存储数据失败:', error);
    }
  }

  getList();
  // store.dispatch("dict/setFolwjudge", true);
});

onBeforeUnmount(() => {
  cleanUp();
});

// 监听器
// watch(nameFlag, val => {
//   if (val === false) {
//     fieldList.value = [];
//   }
// });

// watch(setName, val => {
//   if (val) {
//     fieldList.value = [];
//     arrData.value = formList.value.filter(v => v.pageName === val);

//     if (arrData.value.length > 0) {
//       fieldList.value = arrData.value;
//       // store.dispatch("dict/setFolwjudge", true);
//     } else {
//       // store.dispatch("dict/setFolwjudge", false);
//     }
//   }
// });

// 方法
const addForm = () => {
  selectedRowKeys.value = [];
  selectedRow.value = {};
  drawer.value = true;
};

const getList = async () => {
  const params = {
    treeId: props.currentNode?.id || '',
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  };
  try {
    const res = await AdminApiSystemCheckInfoApi.checkPageInfoNewPageList(params);
    if (res && res.data.code == '0') {
      formList.value = res.data.data.data || [];
      total.value = res.data.data.pageCount || 0;
      deepCope.value = JSON.parse(JSON.stringify(formList.value));
      // 如果有设置名称，过滤显示
      if (props.elementBusinessObject.name && formList.value.length > 0) {
        const filtered = formList.value.filter(v => v.pageName === props.elementBusinessObject.name);
        if (filtered.length > 0) {
          fieldList.value = filtered;
        } else {
          fieldList.value = [];
        }
      } else {
        fieldList.value = [];
      }
    } else {
      message.error(res?.data?.msg || '获取表单列表失败');
    }
  } catch (error) {
    console.error('获取表单列表失败:', error);
    message.error('获取表单列表失败，请重试');
  }
};

const onSelectionChange = (selectedKeys, selectedRows) => {
  selectedRowKeys.value = selectedKeys;
  if (selectedRows.length > 0) {
    selectedRow.value = selectedRows[0];
  }
  localStorage.setItem('selecData', JSON.stringify(selectedRow.value));
};

// const customRow = record => {
//   // 单选逻辑
//   if (selectedRowKeys.value.includes(record.id)) {
//     selectedRowKeys.value = [];
//     selectedRow.value = {};
//   } else {
//     selectedRowKeys.value = [record.id];
//     selectedRow.value = record;
//   }
//   localStorage.setItem('selecData', JSON.stringify(selectedRow.value));
//   console.log(JSON.parse(localStorage.getItem('selecData')), '+++-----');
// };

const onPageSizeChange = (current, size) => {
  pageSize.value = size;
  pageNum.value = 1;
  getList();
};

const onPageChange = (page, pageSize) => {
  pageNum.value = page;
  getList();
};

const confirm = () => {
  if (!selectedRow.value || !selectedRow.value.id) {
    message.warning('请选择表单');
    return;
  }

  fieldList.value = [selectedRow.value];
  // 更新 BPMN 属性
  if (window.bpmnInstances?.modeling && bpmnElement.value) {
    window.bpmnInstances.modeling.updateProperties(
      toRaw(bpmnElement.value),
      toRaw({
        formKey: selectedRow.value.id,
        name: selectedRow.value.pageName,
      }),
    );
  }
  //   fieldList.value.map(v => {
  //   // 给xml添加对应的标识
  //   window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), toRaw({ formKey: v.id, name: v.pageName }));
  // });

  // 存储到 Vuex
  // store.dispatch("dict/getPageName", selectedRow.value);

  drawer.value = false;
  message.success('表单添加成功');
};

const cancel = () => {
  drawer.value = false;
  selectedRowKeys.value = [];
  selectedRow.value = {};
};

const cleanUp = () => {
  fieldList.value = [];
  localStorage.removeItem('selecData');
};

// 路由离开前的处理
router.beforeEach((to, from, next) => {
  if (from.name === 'currentRouteName') {
    // 替换为实际的路由名称
    cleanUp();
  }
  next();
});
</script>

<style lang="less" scoped>
.form-content {
  margin: 10px;

  .element-property {
    .ant-btn {
      margin-bottom: 16px;
    }

    .ant-divider {
      margin: 16px 0;

      .anticon {
        margin-right: 8px;
      }
    }
  }
}
.action-buttons {
  margin-top: 50px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  button {
    min-width: 60px;
  }
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
// Ant Design 表格样式调整
:deep(.ant-table-small) {
  font-size: 12px;

  .ant-table-thead > tr > th {
    background-color: #fafafa;
    padding: 8px 8px;
  }

  .ant-table-tbody > tr > td {
    padding: 8px 8px;
  }
}

:deep(.ant-drawer-body) {
  display: flex;
  flex-direction: column;
  height: 100%;

  .ant-table-wrapper {
    flex: 1;
    margin-bottom: 16px;
  }
}

:deep(.ant-drawer-footer) {
  border-top: 1px solid #f0f0f0;
  padding: 10px 16px;
  text-align: right;
}
</style>
