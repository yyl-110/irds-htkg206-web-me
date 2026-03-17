<script setup lang="ts">
import { ref, defineProps, defineExpose, watch, PropType } from 'vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { VxeUI } from 'vxe-pc-ui';
import zhCN from 'vxe-pc-ui/lib/language/zh-CN'; // 简体中文
import _ from 'lodash-es';
defineProps({
  initSelect: {
    type: Boolean,
    default: false,
  },
  isAction: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Array<PagecolumnsProps>,
    default: () => [],
  },
  mcategoryid: {
    type: Number,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  height: {
    type: Number,
    default: 600,
  },
  isArgs: {
    type: Boolean,
    default: false,
  },
  pageFlag: {
    type: Boolean,
    default: true,
  },
  page: {
    type: Object as PropType<PaginationProps>,
    default: () => ({
      current: 1,
      pageSize: 10,
      total: 0,
    }),
  },
  indexFlag: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  checkType: {
    type: Boolean,
    default: true,
  },
  modelType: {
    type: Number,
    default: 1,
  },
});
const selectNum = ref('');
onActivated(() => {
  selectNum.value = '';
  VxeUI.setI18n('zh-CN', zhCN);
  VxeUI.setLanguage('zh-CN');
});

interface PagecolumnsProps {
  id: string;
  type: string;
  title: string;
  key: string;
  width: string;
  filters: string;
}
interface PaginationProps {
  currentPage: number;
  pageSize: number;
  pageCount: number;
}
const pageSizeOptions = ref<string[]>(['10', '20', '30', '40', '50']);
const vxeTable1 = ref(null);
const myEmit = defineEmits([
  'onShowSizeChange',
  'selectModelListCheck',
  'clickEvent',
  'dblclick',
  'showAppList',
  'showUserList',
  'filterChange',
  'openMx',
  'argsMx',
  'openEwt',
  'editMx',
  'fitoutMx',
]);

const filterChange = ({ filters }: any) => {
  // 获取筛选条件
  const filter = filters.map((item: any) => {
    return { modelInfoProp: item.property, modelInfoPropValue: _.join(item.values, ';') };
  });
  myEmit('filterChange', filter);
};
function fetchRemoteData() {}
const onShowSizeChange = (current: number, pageSize: number) => {
  myEmit('onShowSizeChange', current, pageSize);
};
const change = (current: number, pageSize: number) => {
  myEmit('onShowSizeChange', current, pageSize);
};

const openMx = (row: any) => {
  myEmit('openMx', [row]);
};
const fitoutMx = (row: any) => {
  myEmit('fitoutMx', [row]);
};
const editMx = (row: any) => {
  myEmit('editMx', [row]);
};
const openEwt = (row: any) => {
  myEmit('openEwt', [row]);
};
const argsMx = (row: any) => {
  myEmit('argsMx', [row]);
};

const checkboxChange = (e: any) => {
  selectNum.value = e.records.length;
  const $table = vxeTable1.value;
  const selectRecords = $table.getCheckboxRecords();
  myEmit('selectModelListCheck', selectRecords);
};

//单击事件
const editEvent = (row: any, key: any) => {
  myEmit('clickEvent', row, key);
};

const showAppList = (row: any) => {
  myEmit('showAppList', row);
};

const showUserList = (row: any) => {
  myEmit('showUserList', row);
};

//双击事件
const dblclick = (row: any) => {
  myEmit('dblclick', row);
};

const loadData = (data: any) => {
  const $table = vxeTable1.value;
  $table.loadData(data);
};
const filterAgeMethod = ({ column, option, row }: any) => {
  if (column.title == '状态' && option.value == '已发布') {
    return row.status === 0;
  } else if (column.title == '状态' && option.value == '设计中') {
    return row.status === 1;
  } else if (column.title == '状态' && option.value == '已停用') {
    return row.status === 2;
  } else if (column.title == '状态' && option.value == '审核中') {
    return row.status === 3;
  } else {
    return row[column.property] === option.value;
  }
};
defineExpose({
  loadData,
  vxeTable1,
});
</script>
<template>
  <div style="margin-top: 10px; position: relative; overflow: hidden">
    <div class="tabBox" :style="{ height: height }">
      <vxe-table
        size="mini"
        stripe
        border
        :filter-config="{ confirmButtonText: '确定', resetButtonText: '取消', showIcon: false }"
        @filter-change="filterChange"
        @filter-visible="fetchRemoteData"
        :column-filter-config="true"
        height="99%"
        @checkbox-change="checkboxChange"
        @checkbox-all="checkboxChange"
        @cell-dblclick="dblclick"
        :column-config="{ resizable: true }"
        :cell-config="{ height: 45 }"
        :header-cell-config="{ height: 20 }"
        :edit-config="{ trigger: dblclick }"
        :checkbox-config="{
          labelField: '',
          highlight: true,
          trigger: 'row',
          reserve: true,
          range: true,
        }"
        :sort-config="{ trigger: 'cell', ascTitle: '升序', descTitle: '降序', showIcon: true }"
        :row-config="{ isHover: true, isCurrent: true }"
        :data="data"
        :loading="loading"
        show-overflow="tooltip"
        ref="vxeTable1">
        <!-- 空数据插槽 -->
        <template #empty>
          <div style="width: 235px; height: 235px">
            <img width="100%" height="auto" src="@/assets/images/empty.png" alt="暂无数据" />
            <div>数据为空</div>
          </div>
        </template>
        <!-- <vxe-table-column fixed="left" type="seq" width="100" title="序号" align="left" v-if="indexFlag" /> -->
        <vxe-table-column
          v-for="item in columns"
          :key="item"
          :filters="item.filters"
          align="left"
          :field="item.key"
          :title="item.title"
          :type="item.type"
          :id="item.id"
          :params="item.id"
          :width="item.width"
          :sortable="true"
          :filter-method="filterAgeMethod">
          <template v-slot="scope" v-if="modelType === 0">
            <div v-if="item.key == 'status'" style="max-width: 100px">
              <div v-if="scope.row[item.key] === 0" style="color: rgba(80, 188, 109, 1)">已发布</div>
              <div v-else-if="scope.row[item.key] === 1" style="color: rgb(83, 112, 199)">设计中</div>
              <div v-else-if="scope.row[item.key] === 2" style="color: #a2a1a6">已停用</div>
              <div v-else-if="scope.row[item.key] === 3" style="color: rgb(240, 231, 73)">审核中</div>
            </div>
            <div v-if="item.key != 'para2' && item.key != 'status'">
              <span class="table-text">{{ scope.row[item.key] }}</span>
            </div>
            <span v-if="item.key === 'para2'" style="text-decoration: underline; cursor: pointer; color: #1979e0" @click.stop="editEvent(scope.row, item.key)">
              {{ scope.row[item.key] }}</span
            >
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" align="left" width="155" fixed="right" v-if="isAction">
          <template #default="{ row }">
            <div class="cells">
              <!-- <a @click="openMx(row)">{{ $t('打开模型') }}</a>
              <a-divider type="vertical" />
              <a @click="fitoutMx(row)">{{ $t('装配模型') }}</a>
              <a-divider type="vertical" />
              <a @click="openEwt(row)">{{ $t('打开二维图') }}</a>
              <a-divider type="vertical" />
              <a @click="argsMx(row)">{{ $t('参数化设计') }}</a> -->
              <a-tooltip title="打开模型" placement="topLeft">
                <EpcIcon class="act-btns" type="icon-folder-opened" @click="openMx(row)" />
              </a-tooltip>
              <a-tooltip title="装配模型" placement="topLeft">
                <EpcIcon class="act-btns" style="font-size: 17px" type="icon-element-plus" @click="fitoutMx(row)" />
              </a-tooltip>
              <a-tooltip title="打开二维图" placement="topLeft">
                <EpcIcon class="act-btns" type="icon-picture" @click="openEwt(row)" />
              </a-tooltip>
              <a-tooltip title="参数化设计" placement="topLeft">
                <EpcIcon class="act-btns" type="icon-a-3Dbeifen" @click="argsMx(row)" />
              </a-tooltip>
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
    <div class="rx-page" v-if="pageFlag">
      <div v-if="selectNum" style="color: #000; float: left">
        已选<span style="color: #0d53e2">{{ selectNum }}</span
        >条数据
      </div>
      <a-pagination
        v-model:current="page.currentPage"
        v-model:page-size="page.pageSize"
        :page-size-options="pageSizeOptions"
        :total="page.pageCount"
        size="small"
        show-size-changer
        @change="change"
        @showSizeChange="onShowSizeChange">
        <template #buildOptionText="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>

<style lang="less" scoped>
.rx-page {
  padding: 10px 0px 10px 0px;
  margin: 0 auto;
  text-align: right;
}

:deep(.vxe-cell--title) {
  cursor: pointer;
}

.table-text {
  white-space: nowrap;
  /* 设置不换行 */
  overflow: hidden;
  /* 溢出隐藏 */
  text-overflow: ellipsis;
}
.tabBox {
  margin-top: 10px;
  position: relative;
  :deep(.vxe-table--filter-wrapper.is--active) {
    text-align: left !important;
  }
}
.cells {
  margin-left: -5px;
  .act-btns {
    margin-left: 10px;
    font-size: 15px;
    cursor: pointer;
    :hover {
      color: #0d53e2;
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }
  }
}
</style>
