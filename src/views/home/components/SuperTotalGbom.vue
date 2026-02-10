<template>
  <div>
    <el-table scrollbar-always-on ref="multipleTableRef" default-expand-all :data="tableData" v-loading="loading" style="width: 100%" row-key="id" @selection-change="handleSelectionChange" :tree-props="{ children: 'children' }">
      <el-table-column type="selection" width="55" :selectable="selectEnable" />
      <el-table-column prop="descript" label="超级GBOM"></el-table-column>
      <el-table-column prop="techid" label="系统功能分类标识"></el-table-column>
      <el-table-column prop="signString" label="标记"></el-table-column>
      <el-table-column prop="required" label="必选/可选">
        <template #default="scope">
          {{ scope.row.required == true ? '必选' : '可选' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, nextTick } from 'vue';
// import { findData, findItemInTree } from '@/config/commonMethod';
import _ from 'lodash';
const loading = ref(false); // 列表loading
const multipleTableRef = ref();
const props = defineProps({
  tableData: Array,
  gbomSeriesBomBack: Array,
  loading: Boolean,
});

const emit = defineEmits(['multipleSelection', 'editGbomClick']);
const selectEnable = (row, rowIndex) => {
  if (row.required) {
    return false;
  }
  return true;
};
const handleSelectionChange = val => {
  emit('multipleSelection', val);
};

watch(
  () => props.tableData,
  newVal => {
    multipleTableRef.value.toggleAllSelection();
    const recursive = id => {
      let data = newVal;
      data.forEach(item => {
        nextTick(() => {
          setTimeout(() => {
            multipleTableRef.value.toggleRowSelection(item, item.required ? item.required : item.isBack);
          }, 10);
        });
        function mapChilren(child) {
          child.forEach(itm => {
            nextTick(() => {
              setTimeout(() => {
                multipleTableRef.value.toggleRowSelection(itm, itm.required ? itm.required : itm.isBack);
              }, 500);
            });
            if (itm.children) {
              return mapChilren(itm.children);
            } else {
              return;
            }
          });
        }
        if (item.children) {
          mapChilren(item.children);
        }
      });
    };
    recursive();
  },
  {
    deep: true,
  }
);

// 递归查找树形结构里满足要求的数据
const condition = node => {
  return +node.required === 0;
};

/**
 *
 *  :selectable="disableRow" 方法调用禁用某一条数据的多选框逻辑
 */

const disableRow = row => {
  // 自定义禁用某一条数据的多选框逻辑
  return +row.required !== 0;
};

//树形结构回显操作
const selectItem = (rows, treeTableRef, treeData) => {
  rows.forEach(item => {
    console.log(item);
    const itemToSelect = findItemInTree(treeData, item.id);
    // 加判断解决undefined挂载错误提示
    if (itemToSelect) {
      treeTableRef.toggleRowSelection(itemToSelect, true);
      if (itemToSelect.children) {
        itemToSelect.children.forEach(item => {
          const tableItem = findItemInTree(treeData, item.id); // 找到table中的数据项
          const flag = rows.some(one => one.id === tableItem.id); // 在可选项里是否存在
          if (!flag) treeTableRef.toggleRowSelection(tableItem, false); // 如果不存在则不选中
        });
      }
    }
  });
};
</script>

<style scoped lang="less">
.selected + .sibling .action-btn {
  font-size: 12px;
  color: #1971ff;
  margin-right: 10px;
}

.action-btn {
  font-size: 12px;
  color: #1971ff;
  margin-right: 10px;
}
</style>
