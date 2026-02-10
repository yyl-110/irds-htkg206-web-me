<template>
  <el-table scrollbar-always-on :data="tableData" style="width: 100%" stripe align="left" :default-sort="{ prop: 'taskName', order: 'nameCN' }" class="eltable">
    <el-table-column header-align="left" align="left" prop="taskName" label="任务名称" min-width="120" fixed="left" show-overflow-tooltip sortable />
    <el-table-column header-align="left" align="left" prop="designName" label="任务接收人" min-width="120" show-overflow-tooltip sortable />
    <el-table-column header-align="left" align="left" prop="code" label="项目编号" min-width="120" show-overflow-tooltip sortable />
    <el-table-column header-align="left" align="left" prop="nameCN" label="项目名称" min-width="120" show-overflow-tooltip sortable />
    <el-table-column header-align="left" align="left" prop="platformName" label="平台名称" min-width="180" show-overflow-tooltip sortable />
    <el-table-column width="120" prop="projectCategory" label="项目类别" show-overflow-tooltip sortable>
      <template #default="scope">
        <div v-if="scope.row.projectCategory === '1'">市场执行项目</div>
        <div v-else-if="scope.row.projectCategory === '2'">科技开发项目</div>
        <div v-else-if="scope.row.projectCategory === '3'">机电业务项目</div>
        <div v-else-if="scope.row.projectCategory === '4'">检修运维项目</div>
      </template>
    </el-table-column>
    <el-table-column header-align="left" align="left" prop="projectType" label="项目类型" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <div v-if="scope.row.projectType === '1'">一般改进型产品</div>
        <div v-else-if="scope.row.projectType === '2'">重大改进型产品</div>
        <div v-else-if="scope.row.projectType === '3'">延续型产品</div>
        <div v-else>全新产品</div>
      </template>
    </el-table-column>

    <el-table-column header-align="left" align="left" prop="createName" label="创建人" min-width="120" show-overflow-tooltip sortable />

    <el-table-column min-width="120" prop="startTime" label="计划开始时间" show-overflow-tooltip sortable />
    <el-table-column min-width="120" prop="endTime" label="计划结束时间" show-overflow-tooltip sortable />
    <el-table-column min-width="120" prop="acStartTime" label="实际开始时间" show-overflow-tooltip sortable />
    <el-table-column min-width="120" prop="go" label="项目状态" align="left" show-overflow-tooltip sortable>
      <template #default="scope">
        <div v-if="+scope.row.taskStatus === 0">待启动</div>
        <div v-else-if="+scope.row.taskStatus === 1">正在工作</div>
        <div v-else>已完成</div>
      </template>
    </el-table-column>
    <el-table-column header-align="left" align="left" fixed="right" min-width="180" label="操作">
      <template #default="scope">
        <div class="cells">
          <el-tooltip class="box-item" effect="dark" content="开始" placement="top" v-if="scope.row.workStatus == 1 && !isSendTask">
            <el-icon @click="startDes(scope.row)" class="icon" size="16px">
              <VideoPlay />
            </el-icon>
          </el-tooltip>
          <el-button class="box-item" link disabled v-else style="margin-left: 0px; padding: 0">
            <el-icon class="icon" size="16px" style="color: #ccc"><VideoPlay /></el-icon>
          </el-button>
          <el-tooltip class="box-item" effect="dark" content="转办" placement="top" v-if="scope.row.workStatus == 1 && !isSendTask">
            <el-icon @click="turnTo(scope.row)" class="icon" size="16px">
              <RefreshRight />
            </el-icon>
          </el-tooltip>
          <el-button class="box-item" link disabled v-else style="margin-left: 0px; padding: 0">
            <el-icon class="icon" size="16px" style="color: #ccc"><RefreshRight /></el-icon>
          </el-button>
          <el-tooltip class="box-item" effect="dark" content="驳回" placement="top" v-if="scope.row.workStatus == 1 && !isSendTask">
            <el-icon @click="turnDown(scope.row)" class="icon" size="16px">
              <RefreshLeft />
            </el-icon>
          </el-tooltip>
          <el-button class="box-item" link disabled v-else style="margin-left: 0px; padding: 0">
            <el-icon class="icon" size="16px" style="color: #ccc"><RefreshLeft /></el-icon>
          </el-button>
          <el-tooltip class="box-item" effect="dark" content="导出" placement="top" v-if="scope.row.type == 1 && !isSendTask">
            <el-icon @click="exportE(scope.row)" class="icon" size="16px">
              <Download />
            </el-icon>
          </el-tooltip>
          <el-button class="box-item" link disabled v-else style="margin-left: 0px; padding: 0">
            <el-icon class="icon" size="16px" style="color: #ccc"><Download /></el-icon>
          </el-button>
          <el-tooltip class="box-item" effect="dark" content="修改" placement="top" v-if="scope.row.workStatus == 2 && !isSendTask">
            <el-icon @click="editE(scope.row)" class="icon" size="16px">
              <Edit />
            </el-icon>
          </el-tooltip>
          <el-button class="box-item" link disabled v-else style="margin-left: 0px; padding: 0">
            <el-icon class="icon" size="16px" style="color: #ccc"><Edit /></el-icon>
          </el-button>
          <el-tooltip class="box-item" effect="dark" content="查看" placement="top" v-if="scope.row.workStatus == 2 || scope.row.taskStatus == 2">
            <el-icon @click="seeE(scope.row)" class="icon" size="16px">
              <View />
            </el-icon>
          </el-tooltip>
          <el-button class="box-item" link disabled v-else style="margin-left: 0px; padding: 0">
            <el-icon class="icon" size="16px" style="color: #ccc"><View /></el-icon>
          </el-button>
          <!-- <el-tooltip class="box-item" effect="dark" content="详情" placement="top">
            <el-icon @click="deitDes(scope.row)" class="icon" size="16px">
              <Warning />
            </el-icon>
          </el-tooltip> -->
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { defineProps, defineEmits, nextTick, watch } from 'vue';
const props = defineProps({
  tableData: Array,
  loading: Boolean,
  isSendTask: Boolean,
});
const emit = defineEmits(['detailTask', 'startTask', 'settingsTask', 'turnDownTask', 'turnToTask', 'exportTask', 'modificationTask', 'seeToTask']);

watch(
  () => props.tableData,
  newVal => {
    props.tableData = newVal;
  },
  {
    deep: true,
    immediate: true,
  }
);

// 详情
const deitDes = row => {
  emit('detailTask', row);
};

//任务开始
const startDes = row => {
  emit('startTask', row);
};
// 驳回
const turnDown = row => {
  emit('turnDownTask', row);
};
// 设置
const settings = row => {
  emit('settingsTask', row);
};
//转办
const turnTo = row => {
  emit('turnToTask', row);
};
const exportE = row => {
  emit('exportTask', row);
};
const editE = row => {
  emit('modificationTask', row);
};
const seeE = row => {
  emit('seeToTask', row);
};
</script>

<style scoped lang="less">
.icon {
  cursor: pointer;

  :hover {
    color: #1971ff;
  }
}
.eltable {
  width: 100%;
}
:deep(.el-table__header-wrapper .caret-wrapper) {
  display: none;
}
.cells {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
