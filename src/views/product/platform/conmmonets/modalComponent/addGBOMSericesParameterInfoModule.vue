<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { useUserStore } from '@/store/modules/user';
import { WeiI18n } from '@/utils/WeiI18n';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import type { TableColumnType } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
export default defineComponent({
  props: {
    modalVisible: {
      type: Boolean,
    },
    selectTreeData: {
      type: Array,
    },
    gbomInfo: {
      type: Array,
    },
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed(() => {
      return props.modalVisible;
    });
    const userStore = useUserStore();
    const searchText = ref('');
    const selectedRowKeys = ref<Array<string | number>>([]);
    const selectedRows = ref<Array<any>>([]);
    // GBOM定义表格列配置
    const columns = ref<TableColumnType<ProductPlatformParameterInfoRequestDTOModel>[]>([
      {
        title: WeiI18n.$t('GBOM名称'),
        dataIndex: 'descript',
        key: 'descript',
        align: 'left',
        resizable: true,
        width: 200,
        sorter: (a: any, b: any) => sortermethod(a.descript, b.descript),
      },
      {
        title: WeiI18n.$t('构型项名称'),
        dataIndex: 'pdmName',
        key: 'pdmName',
        align: 'left',
        resizable: true,
        width: 200,
        sorter: (a: any, b: any) => sortermethod(a.pdmName, b.pdmName),
      },
      {
        title: WeiI18n.$t('标记'),
        dataIndex: 'signString',
        key: 'signString',
        align: 'left',
        resizable: true,
        width: 150,
        sorter: (a: any, b: any) => sortermethod(a.signString, b.signString),
      },
    ]);
    const seriesGBOMParameter = reactive(new ProductSeriesGBOMInfoRequestDTOModel());
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-container3');
    }

    // 递归查找所有需要选中的节点ID（包括子节点）
    const findAllSelectedNodeIds = (treeData, idsToSelect) => {
      const allSelectedIds = [];

      const traverseTree = nodes => {
        if (!nodes || !nodes.length) return;

        nodes.forEach(node => {
          // 当前节点是否应该被选中（只根据自身是否匹配idsToSelect）
          const shouldSelect = idsToSelect.includes(node.id);

          if (shouldSelect) {
            allSelectedIds.push(node.id);
          }

          // 递归处理子节点，不传递选中状态
          if (node.children && node.children.length > 0) {
            traverseTree(node.children);
          }
        });
      };

      traverseTree(treeData);
      return allSelectedIds;
    };

    watch(
      () => props.modalVisible,
      newValue => {
        if (newValue && props.selectTreeData && props.gbomInfo) {
          // 当弹窗打开且有参数数据时，自动选中匹配的参数
          // 递归获取所有节点（包括子节点）的platGBOMId
          const getAllPlatGBOMIds = nodes => {
            let allIds = [];

            const traverseNodes = items => {
              if (!items || !items.length) return;

              items.forEach(item => {
                // 添加当前节点的platGBOMId
                if (item.platGBOMId) {
                  allIds.push(item.platGBOMId);
                }

                // 递归处理子节点
                if (item.children && item.children.length > 0) {
                  traverseNodes(item.children);
                }
              });
            };

            traverseNodes(nodes);
            return allIds;
          };

          // 获取所有节点（包括子节点）的platGBOMId
          const existingParameterIds = getAllPlatGBOMIds(props.gbomInfo);
          console.log('所有节点的platGBOMId:', existingParameterIds);

          // 查找所有需要选中的节点（包括子节点）
          // 直接使用existingParameterIds作为需要匹配的ID列表，这样可以确保所有层级的节点都能被正确匹配
          const allSelectedIds = findAllSelectedNodeIds(props.selectTreeData, existingParameterIds);
          selectedRowKeys.value = allSelectedIds;
        } else {
          // 关闭弹窗时清空选中状态
          selectedRowKeys.value = [];
        }
      },
      { immediate: true }
    );

    // 未定义的方法实现
    function updateParaneterInfoList() {
      seriesGBOMParameter.idList = selectedRowKeys.value;
      context.emit('updateGBOMSeriesVisible', seriesGBOMParameter);
    }

    function addParameterInfoData() {}

    function handleCloseList() {
      context.emit('close');
    }

    // 递归获取节点及其所有子节点的ID
    const getAllDescendantIds = (treeData, parentId) => {
      const descendantIds = [];

      const findParentAndChildren = (nodes, isParentFound = false) => {
        if (!nodes || !nodes.length) return;

        nodes.forEach(node => {
          // 如果找到了父节点或已经在父节点的子树中
          const inTargetSubtree = isParentFound || node.id === parentId;

          if (inTargetSubtree && node.id !== parentId) {
            descendantIds.push(node.id);
          }

          // 递归处理子节点
          if (node.children && node.children.length > 0) {
            findParentAndChildren(node.children, inTargetSubtree);
          }
        });
      };

      findParentAndChildren(treeData);
      return descendantIds;
    };

    const locale = ref({
      cancelSort: WeiI18n.t('点击取消排序').value,
      triggerAsc: WeiI18n.t('点击升序').value,
      triggerDesc: WeiI18n.t('点击降序').value,
      emptyText: h({
        description: '数据为空',
        style: { paddingBottom: '50px' },
      }),
    });

    // 行选择配置
    const rowSelection = {
      selectedRowKeys,
      onChange: (newSelectedRowKeys: string[] | number[], newSelectedRows: ProductPlatformParameterInfoRequestDTOModel[]) => {
        // 获取被取消选中的节点ID
        const deselectedIds = selectedRowKeys.value.filter(id => !newSelectedRowKeys.includes(id));

        // 获取新增选中的节点ID
        const newlySelectedIds = newSelectedRowKeys.filter(id => !selectedRowKeys.value.includes(id));

        let finalSelectedKeys = [...newSelectedRowKeys];

        // 处理级联取消勾选
        if (deselectedIds.length > 0 && props.selectTreeData) {
          let allDeselectedIds = [...deselectedIds];

          // 对每个被取消选中的节点，获取其所有子节点ID
          deselectedIds.forEach(parentId => {
            const childIds = getAllDescendantIds(props.selectTreeData, parentId);
            allDeselectedIds = [...allDeselectedIds, ...childIds];
          });

          // 从新选中的节点中移除所有需要取消选中的节点（父节点和子节点）
          finalSelectedKeys = finalSelectedKeys.filter(id => !allDeselectedIds.includes(id));
        }

        // 处理级联选中（当子节点被选中时，自动选中父节点）
        if (newlySelectedIds.length > 0 && props.selectTreeData) {
          // 递归查找所有父节点
          const findAllParentIds = (nodes, targetId) => {
            const parentIds = [];

            const traverseParents = (items, currentParentIds = []) => {
              if (!items || !items.length) return;

              for (const item of items) {
                // 如果找到目标节点，返回其所有父节点ID
                if (item.id === targetId) {
                  return currentParentIds;
                }

                // 如果当前节点有子节点，递归查找
                if (item.children && item.children.length > 0) {
                  const foundParents = traverseParents(item.children, [...currentParentIds, item.id]);
                  if (foundParents) {
                    return foundParents;
                  }
                }
              }
            };

            return traverseParents(nodes);
          };

          // 为每个新增选中的节点，获取并添加其父节点ID
          newlySelectedIds.forEach(childId => {
            const parentIds = findAllParentIds(props.selectTreeData, childId);
            if (parentIds && parentIds.length > 0) {
              parentIds.forEach(parentId => {
                if (!finalSelectedKeys.includes(parentId)) {
                  finalSelectedKeys.push(parentId);
                }
              });
            }
          });
        }

        // 更新选中状态
        selectedRowKeys.value = finalSelectedKeys;

        // 更新选中的行数据
        // 注意：这里可能需要根据实际情况调整，因为我们添加了父节点但可能没有对应的行数据
        // 一个简单的处理方式是只保留原始选中的行数据中包含在最终选中ID列表中的项
        selectedRows.value = newSelectedRows.filter(row => finalSelectedKeys.includes(row.id));

        // 调试用：查看当前选中状态
        console.log('选中的key：', selectedRowKeys.value);
        console.log('选中的行数据：', selectedRows.value);
      },
      type: 'checkbox', // 使用复选框类型
      selections: false, // 隐藏表头的“全选/取消全选”按钮
    };
    return {
      visible,
      searchText,
      columns,
      rowSelection,
      selectedRowKeys,
      locale,
      selectedRows,
      customGetContainer,
      addParameterInfoData,
      handleCloseList,
      updateParaneterInfoList,
    };
  },
});
</script>

<template>
  <div class="modal-container3" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      style="width: 50%"
      :title="$t('关联GBOM节点')"
      :mask-closable="false"
      @ok="updateParaneterInfoList"
      @cancel="handleCloseList">
      <a-card>
        <a-table
          :columns="columns"
          row-key="id"
          :data-source="selectTreeData"
          :pagination="false"
          :locale="locale"
          style="height: 500px; overflow-y: auto; overflow-x: hidden"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
          :row-selection="rowSelection">
          <template #emptyText>
            <p>暂无数据</p>
          </template>
        </a-table>
      </a-card>
      <template #footer>
        <a-button type="primary" @click="updateParaneterInfoList">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleCloseList">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.modal-container3 {
  position: relative;
}
/deep/ .ant-modal-mask {
}
/deep/ .ant-form {
  width: 100%;
}
/deep/ .ant-form-item {
  margin-bottom: 16px;
}
/deep/ .ant-form-item-label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  width: 130px; /* 固定label宽度 */
}
/deep/ .ant-form-item-control {
  position: relative;
  flex: 1;
  min-width: 0;
}
/deep/ .ant-form-item-control-input {
  position: relative;
  display: flex;
  align-items: center;
}
/deep/ .ant-input,
/deep/ .ant-select-selector {
  width: 100%; /* 确保输入框宽度占满剩余空间 */
  box-sizing: border-box;
}

/* 确保下拉菜单可以正确显示，不会被Modal遮挡 */
/deep/ .ant-select-dropdown {
}
</style>
