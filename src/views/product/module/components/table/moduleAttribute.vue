<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  height: {
    type: Number,
    default: 200,
  },

  width: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  parmList: {
    type: String,
    default: '',
  },
});
const tableRef = ref(null);
const myEmit = defineEmits(['onChange', 'pageChange', 'selectModelListCheck', 'clickEvent', 'tabToSort', 'showSelectParameter', 'delParm']);
const pageSizeOpts = ref([10, 30, 50, 100]);
const ifShowList = ref([
  { label: '显示', value: 0 },
  { label: '隐藏', value: 1 },
]);
const dfqList = ref([
  { id: 0, name: '否' },
  { id: 1, name: '是' },
]);
const parmTypeList = ref([
  { id: 0, name: '数值' },
  { id: 1, name: '字符串' },
  { id: 2, name: '布尔' },
]);
const sortList = ref([
  { id: 1, name: '一级正序' },
  { id: 2, name: '二级正序' },
  { id: 3, name: '三级正序' },
  { id: 4, name: '一级倒序' },
  { id: 5, name: '二级倒序' },
  { id: 6, name: '三级倒序' },
]);

const checkboxChange = e => {
  const $table = tableRef.value;
  const selectRecords = $table.getCheckboxRecords();
  myEmit('selectModelListCheck', selectRecords);
};

const tabToSort = (dataType, type) => {
  myEmit('tabToSort', dataType, type);
};

const showSelectParameter = (index, scope) => {
  myEmit('showSelectParameter', index - 1);
};

const delParm = (index, scope) => {
  myEmit('delParm', index - 1);
};
defineExpose({ tableRef });
</script>
<template>
  <div style="margin-top: 10px; position: relative">
    <div class="tabBox" :style="{ height: height }">
      <vxe-table
        size="mini"
        border
        stripe
        height="100%"
        @checkbox-change="checkboxChange"
        @checkbox-all="checkboxChange"
        :column-config="{ resizable: true }"
        :checkbox-config="{ labelField: '', highlight: true, trigger: 'row', reserve: true, range: true }"
        :cell-config="{ height: 45 }"
        :header-cell-config="{ height: 20 }"
        :sort-config="{ trigger: 'cell', showIcon: false }"
        :row-config="{ isHover: true, isCurrent: true }"
        :data="data"
        :loading="loading"
        ref="tableRef">
        <template #empty>
          <div style="width: 235px; height: 235px">
            <img width="100%" height="auto" src="@/assets/images/empty.png" alt="暂无数据" />
            <div>数据为空</div>
          </div>
        </template>
        <vxe-column type="checkbox" width="60" align="center" />
        <vxe-column field="propertyName" title="列名称" sortable width="140" align="center">
          <template v-slot="scope">
            <a-input v-model:value="scope.row.propertyName" style="width: 100px" v-if="scope.row.columnProperties != 1" />
            <span v-else class="my-input-text">{{ scope.row.propertyName }}</span>
          </template>
        </vxe-column>

        <vxe-column field="paraDictionaryName" title="关联参数字典" sortable width="260" align="center">
          <template v-slot="scope">
            <a-input
              v-model:value="scope.row.paraDictionaryName"
              @on-change="delParm(scope.seq, scope)"
              style="width: 67%; float: left"
              allowClear
              readonly
              v-if="scope.row.paraDictionaryName != '' && scope.row.paraDictionaryName != undefined" />
            <span class="my-input-left" v-else>{{ scope.row.paraDictionaryName }}</span>
            <a-button type="primary" size="small" @click="showSelectParameter(scope.seq, scope)" style="float: right; margin-top: 2px">
              <EpcIcon type="icon-liulan" style="font-size: 18px" />浏览
            </a-button>
          </template>
        </vxe-column>

        <vxe-column field="columnProperties" title="列状态" width="140" sortable align="center">
          <template v-slot="scope">
            <span>{{ scope.row.columnProperties === 1 ? '固定列' : '专用列' }}</span>
          </template>
        </vxe-column>

        <vxe-column field="status" title="显示状态" width="140" sortable align="center">
          <template v-slot="scope">
            <a-select v-model:value="scope.row.status" style="width: 100px" allowClear>
              <a-select-option v-for="item in ifShowList" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </template>
        </vxe-column>

        <vxe-column field="inputBoxLength" title="列宽" width="140" sortable align="center">
          <template v-slot="scope">
            <a-input v-model:value="scope.row.inputBoxLength" style="width: 100px" />
          </template>
        </vxe-column>

        <vxe-column field="defaultQuery" title="默认查询" width="140" sortable align="center">
          <template v-slot="scope">
            <a-select v-model:value="scope.row.defaultQuery" style="width: 100px" allowClear>
              <a-select-option v-for="item in dfqList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </template>
        </vxe-column>

        <vxe-column field="keyword" title="是否关键项" width="140" sortable align="center">
          <template v-slot="scope">
            <a-select v-model:value="scope.row.keyword" style="width: 100px" allowClear>
              <a-select-option v-for="item in dfqList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </template>
        </vxe-column>

        <vxe-column field="isMatching" title="是否*匹配项" width="140" sortable align="center">
          <template v-slot="scope">
            <a-select v-model:value="scope.row.isMatching" style="width: 100px" allowClear>
              <a-select-option v-for="item in dfqList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </template>
        </vxe-column>

        <vxe-column field="pdmValue" title="PDM内部值" width="140" sortable align="center">
          <template v-slot="scope">
            <a-input v-model:value="scope.row.pdmValue" style="width: 100px" />
          </template>
        </vxe-column>

        <vxe-column field="unit" title="单位" width="140" :resizable="true" sortable align="center">
          <template v-slot="scope">
            <a-input v-model:value="scope.row.unit" style="width: 100px" />
          </template>
        </vxe-column>

        <vxe-column field="remark" title="提示信息" width="140" :resizable="true" sortable align="center">
          <template v-slot="scope">
            <a-input v-model:value="scope.row.remark" style="width: 100px" />
          </template>
        </vxe-column>

        <vxe-column field="ifSelectForm" title="下拉属性" width="140" sortable align="center">
          <template v-slot="scope">
            <a-select v-model:value="scope.row.ifSelectForm" style="width: 100px" allowClear>
              <a-select-option v-for="item in dfqList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </template>
        </vxe-column>

        <vxe-column field="selectMultipleValues" title="下拉属性信息" width="140" sortable align="center">
          <template v-slot="scope">
            <a-input v-model:value="scope.row.selectMultipleValues" style="width: 100px" :disabled="scope.row.ifSelectForm == '0'" />
          </template>
        </vxe-column>

        <vxe-column field="modelParaType" title="数值类型" width="140" :resizable="true" sortable align="center">
          <template v-slot="scope">
            <a-select v-model:value="scope.row.modelParaType" style="width: 100px" allowClear>
              <a-select-option v-for="item in parmTypeList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </template>
        </vxe-column>

        <vxe-column field="sortLevel" title="排序级别" width="140" :resizable="true" sortable align="center">
          <template v-slot="scope">
            <a-select v-model:value="scope.row.sortLevel" allowClear style="width: 100px">
              <a-select-option v-for="item in sortList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="sortBox">
      <a-tooltip title="置顶" placement="topLeft">
        <EpcIcon class="sortItem" type="icon-zhidingmian" @click="tabToSort(parmList, '1')" />
      </a-tooltip>
      <a-tooltip title="向上" placement="topLeft">
        <EpcIcon class="sortItem" type="icon-paixujiantou2" @click="tabToSort(parmList, '2')" />
      </a-tooltip>
      <a-tooltip title="向下" placement="topLeft">
        <EpcIcon class="sortItem" type="icon-paixujiantou" @click="tabToSort(parmList, '3')" />
      </a-tooltip>
      <a-tooltip title="置底" placement="topLeft">
        <EpcIcon class="sortItem" type="icon-zhidimian" @click="tabToSort(parmList, '4')" />
      </a-tooltip>
    </div>
  </div>
</template>
<style scoped lang="less">
.sortBox {
  height: 100%;
  background: #fafafa;
  width: 35px;
  position: absolute;
  top: 0;
  right: -35px;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px #e8eaec solid;
  z-index: 3;
}

.sortItem {
  width: 30px;
  height: 35px;
  margin: 15px 0;
  font-size: 30px;
  :hover {
    color: #0d53e2;
    transform: translateY(-2px);
  }
}

.my-input-center {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  -webkit-appearance: none;
  background-color: #ffffff;
  background-image: none;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  /*font-size: inherit;*/
  font-size: 12px;
  outline: none;
  padding: 0 7px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  text-align: center;
}

.my-input-left {
  display: inline-block;
  width: 100px;
  textoverflow: ellipsis;
  whitespace: 'nowrap';
  line-height: 11px;
}
</style>
