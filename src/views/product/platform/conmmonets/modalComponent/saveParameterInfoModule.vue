<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed, nextTick, watch } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import type { TableColumnType } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
import Empty from '@/components/Empty/index.vue';
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
    selectTreeSelectedKeys: { type: String },
    existingResources: { type: Array, default: () => [] },
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed(() => {
      return props.modalVisible;
    });
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
    const showLeft = ref<boolean>(true);
    const isPending = ref(false);

    // 选中的行keys
    const selectedRowkeys = ref<any[]>([]);
    /** 表格勾选事件 */
    const rowSelection = computed(() => {
      /**
       * @param selectedRowkeys 选中的行数量
       * @param selectedRows  选中的行数据
       */
      return {
        selectedRowKeys: selectedRowkeys.value,
        onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
          selectedRowkeys.value = selectedRowKeys;
        },
      };
    });
    function customRow(record: any) {
      return {
        onClick: () => {
          const selectedRowKeys = [...selectedRowkeys.value];
          const key = record.id;
          if (selectedRowKeys.includes(key)) {
            // 如果已选中则取消选中
            selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
          } else {
            // 如果未选中则选中
            selectedRowkeys.value = [...selectedRowKeys, key];
          }
        },
      };
    }
    const confirmSelectTreeNode = () => {
      isPending.value = true;
      // 获取选中的行数据
      const selectedRows = props.parameterInfoData.filter(item => selectedRowkeys.value.includes(item.id));
      context.emit('confirmSelectTreeNode', selectedRows);
      // 模拟异步操作完成后重置加载状态
      setTimeout(() => {
        isPending.value = false;
      }, 300);
    };

    const cancelSelectTreeNode = () => {
      // 清空选中状态
      selectedRowkeys.value = [];
      context.emit('cancelSelectTreeNode');
    };

    const handleSelectTreeNode = (selectedKeys: any[], info: any) => {
      context.emit('handleSelectTreeNode', selectedKeys, info);
    };

    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-container');
    }

    // 监听modalVisible变化，当打开弹窗时自动选中已有的参数
    watch(
      () => props.modalVisible,
      newValue => {
        if (newValue && props.parameterInfoData && props.existingResources) {
          // 当弹窗打开且有参数数据时，自动选中匹配的参数
          const existingParameterIds = props.existingResources.map(item => item.parameterId);
          selectedRowkeys.value = props.parameterInfoData.filter(item => existingParameterIds.includes(item.id)).map(item => item.id);
        } else {
          // 关闭弹窗时清空选中状态
          selectedRowkeys.value = [];
        }
      },
      { immediate: true }
    );

    function handleResizeColumn(w, col) {
      col.width = w;
    }

    // 处理行选择变化
    const onSelectChange = (newSelectedRowKeys: any[]) => {
      selectedRowkeys.value = newSelectedRowKeys;
    };

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
        title: WeiI18n.$t('参数名称'),
        dataIndex: 'parameterName',
        key: 'parameterName',
        align: 'center',
        resizable: true,
        width: 120,
        sorter: (a: any, b: any) => sortermethod(a.parameterName, b.parameterName),
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
        title: WeiI18n.$t('所属分类'),
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
      showLeft,
      visible,
      isPending,
      selectedRowkeys,
      customRow,
      customGetContainer,
      confirmSelectTreeNode,
      cancelSelectTreeNode,
      handleSelectTreeNode,
      handleResizeColumn,
      onSelectChange,
      rowSelection,
    };
  },
});

import { WeiI18n } from '@/utils/WeiI18n';
</script>

<template>
  <div class="modal-container" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      v-model:visible="visible"
      title="添加平台参数"
      width="80%"
      @ok="confirmSelectTreeNode"
      @cancel="cancelSelectTreeNode"
      :confirm-loading="isPending"
      :mask-closable="false"
      :z-index="2000">
      <div class="user-page" style="display: flex; justify-content: space-between">
        <div v-show="showLeft" class="wei-content-full left-tree">
          <a-directory-tree
            style="height: calc(100vh - 260px); width: 250px; overflow-y: auto"
            :show-icon="true"
            :tree-data="selectTreeData"
            :expand-action="false"
            default-expand-all
            :selected-keys="[selectTreeSelectedKeys]"
            @select="handleSelectTreeNode">
            <template #title="item">
              {{ item.partName }}
            </template>
          </a-directory-tree>
        </div>
        <div class="right-list-common" :class="{ 'right-list-show-left': showLeft, 'right-list-noshow-left': !showLeft }">
          <a-table
            style="height: calc(100vh - 260px)"
            :scroll="{ x: 1200 }"
            :locale="locale"
            :row-key="(record: any) => record.id"
            @resizeColumn="handleResizeColumn"
            :columns="columns"
            :pagination="false"
            :data-source="parameterInfoData"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
            :row-selection="rowSelection"
            :customRow="customRow">
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
            </template>
          </a-table>
        </div>
      </div>
      <template #footer>
        <a-button type="primary" @click="confirmSelectTreeNode">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="cancelSelectTreeNode">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
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

.modal-container {
  position: relative;
  z-index: 2000;
}

/* 确保表格区域有足够高度 */
.ant-table-wrapper {
  height: 480px;
  overflow-y: auto;
}

/deep/ .ant-modal-mask {
  z-index: 1999 !important;
}
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}
:deep(.ant-table-column-title) {
  flex: none;
}
</style>
