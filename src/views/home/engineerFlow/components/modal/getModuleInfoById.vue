<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed, nextTick, watch } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import type { TableColumnType } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
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
      type: Object,
      default: () => ({
        moduleParaList: [],
        moduleList: [],
      }),
    },
    selectTreeSelectedKeys: { type: String },
    categoryNamesString: { type: String },
    existingResources: { type: Array, default: () => [] },
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed(() => {
      return props.modalVisible;
    });
    const showLeft = ref<boolean>(true);
    const isPending = ref(false);

    // 存储每个分类节点下的选中行ID
    const selectedRowsMap = ref<Record<string, any[]>>({});
    // 当前选中的分类节点ID
    const currentCategoryId = ref<string>('');
    // 选中的参数ID - 基于当前分类动态计算
    const selectedRowKeys = computed(() => {
      if (!currentCategoryId.value) {
        return [];
      }
      return selectedRowsMap.value[currentCategoryId.value] || [];
    });
    // 选中的树节点
    const selectedTreeKeys = ref<any[]>([]);
    // 搜索框的值
    const searchValue = ref('');
    // 过滤后的树数据
    // 过滤后的树数据
    const filteredTreeData = computed(() => {
      // 如果没有树数据，直接返回空数组
      if (!props.selectTreeData || !Array.isArray(props.selectTreeData)) {
        return [];
      }

      // 当搜索值为空时，直接返回原始数据的完整深拷贝
      if (!searchValue.value || searchValue.value.trim() === '') {
        return JSON.parse(JSON.stringify(props.selectTreeData));
      }

      // 确保searchValue是字符串
      const searchStr = String(searchValue.value).toLowerCase().trim();

      // 递归过滤树节点的函数 - 确保不会修改原始数据
      const filterTree = (nodes: any[]) => {
        // 创建整个节点数组的深拷贝
        const nodesCopy = JSON.parse(JSON.stringify(nodes));

        return nodesCopy.filter(node => {
          // 检查当前节点是否匹配搜索条件
          const matchesSearch = node.categoryName && String(node.categoryName).toLowerCase().includes(searchStr);

          // 如果有子节点，递归过滤子节点
          if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            node.children = filterTree(node.children);
          } else {
            node.children = [];
          }

          // 返回当前节点是否匹配或者有匹配的子节点
          return matchesSearch || (node.children && node.children.length > 0);
        });
      };

      // 传入原始数据的完整深拷贝，确保filterTree不会直接操作原始数据
      return filterTree(JSON.parse(JSON.stringify(props.selectTreeData)));
    });

    // 处理搜索
    const handleSearch = (event: any) => {
      // 在Vue 3中，@change事件传递的是event对象
      searchValue.value = event.target?.value || '';
      // 搜索时自动展开所有匹配节点的父节点
      nextTick(() => {
        // 实际项目中可能需要更复杂的展开逻辑
      });
    };

    // 清空搜索
    const handleClearSearch = () => {
      searchValue.value = '';
    };

    const confirmSelectTreeNode = () => {
      isPending.value = true;
      console.log(selectedRowkeys.value)
      context.emit('confirmSelectTreeNode', selectedRowkeys.value);
      setTimeout(() => {
        isPending.value = false;
      }, 300);
    };

    const cancelSelectTreeNode = () => {
      // 如果当前有选中的分类，则清空该分类下的选中状态
      if (currentCategoryId.value) {
        selectedRowsMap.value[currentCategoryId.value] = [];
      }
      context.emit('cancelSelectTreeNode');
    };

    const handleSelectTreeNode = (selectedKeys: any[], info: any) => {
      if (!info.node || !info.node.id) {
        // 更新内部选中状态
        selectedTreeKeys.value = selectedKeys;
        context.emit('handleSelectTreeNode', selectedKeys, info);
        return;
      }

      const categoryId = info.node.id;

      // 如果是取消选择，则不做处理
      if (!info.selected) {
        // 更新内部选中状态
        selectedTreeKeys.value = selectedKeys;
        context.emit('handleSelectTreeNode', selectedKeys, info);
        return;
      }

      // 更新当前选中的分类ID
      currentCategoryId.value = categoryId;

      // 保存当前分类的选中状态
      selectedTreeKeys.value = [categoryId];

      // 调用父组件的方法
      context.emit('handleSelectTreeNode', [categoryId], info);
    };

    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-container0');
    }

    function handleResizeColumn(w, col) {
      col.width = w;
    }

        // 声明表格类型
    interface DataType {
    // id: Key
    objType: string;
    objId: string;
    amount: number;
    buyFlag?: boolean;
    }
    const selectedRowList = ref<any>([]);
    const selectedRowkeys = ref<any>([]);
    /** 表格勾选事件 */
    const rowSelection = computed(() => {
    /**
     * @param selectedRowKeys 选中的行数量
     * @param selectedRows  选中的行数据
     */
    return {
        // 单选模式
        type: 'radio',
        selectedRowKeys: selectedRowkeys.value,
        onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
          // 只保留第一条选中数据，确保单选
          selectedRowList.value = selectedRows && selectedRows.length > 0 ? [selectedRows[0]] : [];
          selectedRowkeys.value = selectedRowKeys && selectedRowKeys.length > 0 ? [selectedRowKeys[0]] : [];
        },
    };
    });

    // 单选点击行选择
    function customRow(record: any) {
    return {
        onClick: () => {
        // 单选：点击行时直接把该行设为唯一选中项
        const key = record.id;
        selectedRowkeys.value = key ? [key] : [];
        selectedRowList.value = key ? [record] : [];
        },
    };
    }

    // 处理行选择变化
    const onSelectChange = (newSelectedRowKeys: any[]) => {
      if (currentCategoryId.value) {
        selectedRowsMap.value[currentCategoryId.value] = newSelectedRowKeys;
      }
    };

    // 动态生成表头
    const dynamicColumns = ref<TableColumnType<any>[]>([]);

    // 基于moduleParaList动态生成列
    const columns = computed(() => {
      // 如果没有moduleParaList数据，使用默认列
      if (!props.parameterInfoData?.moduleParaList || props.parameterInfoData.moduleParaList.length === 0) {
        return dynamicColumns.value;
      }
      const generatedColumns = props.parameterInfoData.moduleParaList.map((para: any) => {
        const columnTitle = para.propertyName || para.modelInfoProp || '未知属性';
        let columnWidth = 120;
        if (para.inputBoxLength !== undefined && para.inputBoxLength !== null) {
          // 尝试将inputBoxLength转换为数字
          const parsedWidth = parseInt(String(para.inputBoxLength), 10);
          // 确保宽度有效且不小于最小宽度50
          if (!Number.isNaN(parsedWidth) && parsedWidth >= 50) {
            columnWidth = parsedWidth;
          }
        }

        return {
          title: columnTitle,
          dataIndex: para.modelInfoProp,
          key: para.modelInfoProp || `column_${Date.now()}_${Math.random()}`,
          align: 'center',
          resizable: true,
          width: columnWidth,
          ellipsis: true,
          tooltip: true,
          sorter: (a: any, b: any) => {
            const valA = a[para.modelInfoProp] || '';
            const valB = b[para.modelInfoProp] || '';
            // 确保比较的是字符串
            return String(valA).localeCompare(String(valB));
          },
        };
      });
      return [...generatedColumns];
    });

    // 监听modalVisible变化，当打开弹窗时自动选中已有的参数和根节点
    watch(
      () => props.modalVisible,
      newValue => {
        if (newValue) {
          // 当弹窗打开且有参数数据时，自动选中已有的参数
          if (props.parameterInfoData && props.parameterInfoData.moduleList && props.existingResources && props.existingResources.data) {
            // 遍历data对象下的所有分类ID和对应的选中模块ID数组
            const existingData = props.existingResources.data;
            for (const categoryId in existingData) {
              if (existingData.hasOwnProperty(categoryId)) {
                const selectedModuleIds = existingData[categoryId];
                // 存储每个分类下的选中行ID
                selectedRowsMap.value[categoryId] = selectedModuleIds;
              }
            }
          }

          // 当弹窗打开且有树数据时，自动选中第一个根节点
          if (props.selectTreeData && props.selectTreeData.length > 0 && selectedTreeKeys.value.length === 0) {
            // 延迟执行，确保树组件已经渲染完成
            nextTick(() => {
              const firstRootNodeId = props.selectTreeData[0].id;
              if (firstRootNodeId) {
                selectedTreeKeys.value = [firstRootNodeId];
                currentCategoryId.value = firstRootNodeId;
                // 如果有选中的根节点，调用接口获取数据
                if (firstRootNodeId) {
                  handleSelectTreeNode([firstRootNodeId], {
                    node: { id: firstRootNodeId },
                    selected: true,
                  });
                }
              }
            });
          }
        } else {
          // 关闭弹窗时清空选中状态
          selectedRowsMap.value = {};
          selectedTreeKeys.value = [];
          currentCategoryId.value = '';
        }
      },
      { immediate: true }
    );

    return {
      columns,
      showLeft,
      visible,
      isPending,
      selectedRowKeys,
      customGetContainer,
      confirmSelectTreeNode,
      cancelSelectTreeNode,
      handleSelectTreeNode,
      handleResizeColumn,
      onSelectChange,
      searchValue,
      filteredTreeData,
      handleSearch,
      rowSelection,
      customRow,
      handleClearSearch,
    };
  },
});

import { WeiI18n } from '@/utils/WeiI18n';
</script>

<template>
  <div class="modal-container0" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      v-model:visible="visible"
      title="关联模块"
      width="1500px"
      @ok="confirmSelectTreeNode"
      @cancel="cancelSelectTreeNode"
      :confirm-loading="isPending"
      :mask-closable="false"
      :z-index="2000">
      <div class="user-page" style="display: flex; justify-content: space-between">
        <div class="right-list-common" :class="{ 'right-list-show-left': showLeft, 'right-list-noshow-left': !showLeft }">
          <a-table
            style="margin-top: 10px"
            :row-key="(record: any) => record.id"
            @resizeColumn="handleResizeColumn"
            :columns="columns"
            :pagination="false"
            :data-source="parameterInfoData.moduleList || []"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
            :row-selection="rowSelection"
            :customRow="customRow"
            :scroll="{ x: 'max-content' }">
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

  .left-tree {
    width: 240px;
    overflow-y: auto;
    flex-shrink: 0;

    // 树节点选中样式 - 保持与未选中节点一致的背景色
    /deep/ .ant-tree-node-selected {
      background-color: transparent !important;
    }

    // 调整树节点标题的内边距，使间距更紧凑
    /deep/ .ant-tree-title {
      padding: 2px 6px;
      border-radius: 2px;
      line-height: 1.2;
    }

    // 调整树节点的整体高度
    /deep/ .ant-tree-treenode {
      padding: 2px 0;
    }
  }

  .right-list-common {
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
    /* 确保内容超出时可以滚动 */
    overflow: auto;
  }

  .right-list-show-left {
    /* 左侧树显示时，自动占据剩余空间 */
  }

  .right-list-noshow-left {
    /* 左侧树隐藏时，自动占据全部空间 */
  }
}

.modal-container0 {
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
</style>
