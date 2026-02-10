<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed, nextTick, watch } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import type { TableColumnType } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
import { WeiI18n } from '@/utils/WeiI18n';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { component } from 'vxe-pc-ui';
export default defineComponent({
  name: 'selectBoomTree',
  props: {
    modalVisible: {
      type: Boolean,
    },
    selectTreeData: {
      type: Array,
    },
    parameterInfoData: {
      type: Array,
    },
    parameterCategoryInfoData: {
      type: Array,
    },
    categoryNameStr: {
      type: String,
    },
  },
  components: {
    EpcIcon,
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed(() => {
      return props.modalVisible;
    });
    const showLeft = ref<boolean>(true);
    const isPending = ref(false);
    const confirmSelectTreeNode_B = () => {
      isPending.value = true;
      context.emit('confirmSelectTreeNode');
      // 模拟异步操作完成后重置加载状态
      setTimeout(() => {
        isPending.value = false;
      }, 300);
    };

    function handleKeyIndicatorChange(record: any, checked: boolean) {
      record.keyIndicators = checked;
      context.emit('changeGbom', record);
    }

    function handleDelete(record: any) {
      context.emit('delGbom', record);
    }

    function editGBOMParameterInfo(record: any) {
      context.emit('editGbom', record);
    }

    function moveUpGBOMParameterInfo(record: any) {
      context.emit('moveUp', record);
    }

    const locale = ref({
      cancelSort: WeiI18n.t('点击取消排序').value,
      triggerAsc: WeiI18n.t('点击升序').value,
      triggerDesc: WeiI18n.t('点击降序').value,
      emptyText: h({
        description: '数据为空',
        style: { paddingBottom: '50px' },
      }),
    });

    function moveDownGBOMParameterInfo(record: any) {
      context.emit('moveDown', record);
    }

    const cancelSelectTreeNode_B = () => {
      context.emit('cancelSelectTreeNode_B');
    };

    function customGetContainer() {
      // 返回组件内的容器，确保拖拽功能正常工作
      // 同时避免循环引用问题
      return document.querySelector('.getgnomParamterModule');
    }

    function getParamterInfo() {
      context.emit('getParameterInfo');
    }

    function handleResizeColumn(w, col) {
      col.width = w;
    }
    const columns = ref<TableColumnType<any>[]>([
      {
        title: WeiI18n.$t('序号'),
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        resizable: true,
        width: 90,
      },
      {
        title: WeiI18n.$t('参数代号'),
        dataIndex: 'parameterNum',
        key: 'parameterNum',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.parameterNum, b.parameterNum),
      },
      {
        title: WeiI18n.$t('参数名称'),
        dataIndex: 'parameterName',
        key: 'parameterName',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.parameterName, b.parameterName),
      },
      {
        title: WeiI18n.$t('参数类型'),
        dataIndex: 'parameterType',
        key: 'parameterType',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.parameterType, b.parameterType),
      },
      {
        title: WeiI18n.$t('参数单位'),
        dataIndex: 'unitName',
        key: 'unitName',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.unitName, b.unitName),
      },
      {
        title: WeiI18n.$t('大小量纲'),
        dataIndex: 'dimension',
        key: 'dimension',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.dimension, b.dimension),
      },
      {
        title: WeiI18n.$t('默认值'),
        dataIndex: 'value',
        key: 'value',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.value, b.value),
      },
      {
        title: WeiI18n.$t('参数属性'),
        dataIndex: 'rangeValue',
        key: 'rangeValue',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.rangeValue, b.rangeValue),
      },
      {
        title: WeiI18n.$t('关键指标'),
        dataIndex: 'keyIndicators',
        key: 'keyIndicators',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.keyIndicators, b.keyIndicators),
      },
      {
        title: WeiI18n.$t('所属专业'),
        dataIndex: 'categoryName',
        key: 'categoryName',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.categoryName, b.categoryName),
      },
      {
        title: WeiI18n.$t('备注'),
        dataIndex: 'note',
        key: 'note',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.note, b.note),
      },
      {
        title: WeiI18n.$t('操作'),
        dataIndex: 'operation',
        align: 'left',
        width: 230,
      },
    ]);

    const columnsB = ref<TableColumnType<any>[]>([
      {
        title: WeiI18n.$t('序号'),
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        resizable: true,
        width: 90,
      },
      {
        title: WeiI18n.$t('参数代号'),
        dataIndex: 'parameterNum',
        key: 'parameterNum',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.parameterNum, b.parameterNum),
      },
      {
        title: WeiI18n.$t('参数名称'),
        dataIndex: 'parameterName',
        key: 'parameterName',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.parameterName, b.parameterName),
      },
      {
        title: WeiI18n.$t('参数类型'),
        dataIndex: 'parameterType',
        key: 'parameterType',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.parameterType, b.parameterType),
      },
      {
        title: WeiI18n.$t('参数单位'),
        dataIndex: 'unitName',
        key: 'unitName',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.unitName, b.unitName),
      },
      {
        title: WeiI18n.$t('大小量纲'),
        dataIndex: 'dimension',
        key: 'dimension',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.dimension, b.dimension),
      },
      {
        title: WeiI18n.$t('默认值'),
        dataIndex: 'value',
        key: 'value',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.value, b.value),
      },
      {
        title: WeiI18n.$t('参数属性'),
        dataIndex: 'rangeValue',
        key: 'rangeValue',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.rangeValue, b.rangeValue),
      },
      {
        title: WeiI18n.$t('关键指标'),
        dataIndex: 'keyIndicators',
        key: 'keyIndicators',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.keyIndicators, b.keyIndicators),
      },
      {
        title: WeiI18n.$t('所属专业'),
        dataIndex: 'categoryName',
        key: 'categoryName',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.categoryName, b.categoryName),
      },
      {
        title: WeiI18n.$t('备注'),
        dataIndex: 'note',
        key: 'note',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.note, b.note),
      },
    ]);

    return {
      locale,
      columns,
      columnsB,
      showLeft,
      visible,
      isPending,
      getParamterInfo,
      customGetContainer,
      confirmSelectTreeNode_B,
      cancelSelectTreeNode_B,
      handleResizeColumn,
      handleKeyIndicatorChange,
      handleDelete,
      editGBOMParameterInfo,
      moveUpGBOMParameterInfo,
      moveDownGBOMParameterInfo,
    };
  },
});
</script>

<template>
  <div class="getgnomParamterModule" v-dragModal>
    <a-modal
      v-model:visible="visible"
      title="添加系列参数"
      :getContainer="customGetContainer"
      width="1500px"
      @ok="confirmSelectTreeNode_B"
      @cancel="cancelSelectTreeNode_B"
      :confirm-loading="isPending"
      :mask-closable="false">
      <div class="right-list-common">
        <a-tabs default-active-key="1" type="card">
          <!-- 第一个Tab页 -->
          <a-tab-pane tab="添加系列参数" key="1">
            <a-button type="primary" class="ml-2" @click="getParamterInfo">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              {{ $t('添加') }}
            </a-button>
            <a-table
              style="margin-top: 5px"
              :scroll="{ x: 1200 }"
              :row-key="(record: any) => record.id"
              @resizeColumn="handleResizeColumn"
              :columns="columns"
              :locale="locale"
              :pagination="false"
              :data-source="parameterInfoData"
              :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'index'">
                  <!-- 序号从 1 开始自增 -->
                  {{ index + 1 }}
                </template>
                <template v-else-if="column.dataIndex === 'parameterType'">
                  <span>
                    <span v-if="record.parameterType === '0'"> {{ $t('实数') }}</span>
                    <span v-else-if="record.parameterType === '1'"> {{ $t('字符串') }}</span>
                    <span v-else-if="record.parameterType === '2'"> {{ $t('布尔型') }}</span>
                    <span v-else-if="record.parameterType === '9'"> {{ $t('整数') }}</span>
                    <span v-else>{{ $t('未知') }}</span>
                  </span>
                </template>
                <template v-else-if="column.dataIndex === 'keyIndicators'">
                  <a-switch :checked="record.keyIndicators === true" @change="handleKeyIndicatorChange(record, $event)" style="margin-left: 10px" />
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                  <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
                    <a-button type="link" danger class="p-0">
                      {{ $t('删除') }}
                    </a-button>
                  </a-popconfirm>
                  <a-divider type="vertical" />
                  <a @click="editGBOMParameterInfo(record)">{{ $t('编辑') }}</a>
                  <a-divider type="vertical" />
                  <a @click="moveUpGBOMParameterInfo(record)">{{ $t('上移') }}</a>
                  <a-divider type="vertical" />
                  <a @click="moveDownGBOMParameterInfo(record)">{{ $t('下移') }}</a>
                  <a-divider type="vertical" />
                </template>
              </template>
            </a-table>
          </a-tab-pane>

          <!-- 第二个Tab页 - CRH5型系列参数 -->
          <a-tab-pane :tab="categoryNameStr" key="2">
            <div style="margin-top: 5px">
              <a-table
                :scroll="{ x: 1200 }"
                :row-key="(record: any) => record.id"
                @resizeColumn="handleResizeColumn"
                :columns="columnsB"
                :pagination="false"
                :locale="locale"
                :data-source="parameterCategoryInfoData"
                :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.dataIndex === 'index'">
                    <!-- 序号从 1 开始自增 -->
                    {{ index + 1 }}
                  </template>
                  <template v-else-if="column.dataIndex === 'parameterType'">
                    <span>
                      <span v-if="record.parameterType === '0'"> {{ $t('实数') }}</span>
                      <span v-else-if="record.parameterType === '1'"> {{ $t('字符串') }}</span>
                      <span v-else-if="record.parameterType === '2'"> {{ $t('布尔型') }}</span>
                      <span v-else-if="record.parameterType === '9'"> {{ $t('整数') }}</span>
                      <span v-else>{{ $t('未知') }}</span>
                    </span>
                  </template>
                  <template v-else-if="column.dataIndex === 'keyIndicators'">
                    <a-switch :checked="record.keyIndicators === true" disabled="true" style="margin-left: 10px" />
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template #footer>
        <a-button type="primary" @click="confirmSelectTreeNode_B">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="cancelSelectTreeNode_B">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.getgnomParamterModule {
  position: relative;
  z-index: 1000; /* 确保模态框内容显示在遮罩层上方 */
}

.user-page {
  display: flex;
  overflow: hidden;

  .left-tree {
    width: 240px;
    overflow-y: auto;
  }

  .right-list-common {
    margin-left: 20px;
    margin-right: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
  }

  .right-list-show-left {
    width: calc(100% - 260px);
  }

  .right-list-noshow-left {
    width: calc(100%);
  }
}

/* 确保表格区域有足够高度 */
.ant-table-wrapper {
  height: 480px;
  overflow-y: auto;
}

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}
:deep(.ant-table-column-title) {
  flex: none;
}
</style>
