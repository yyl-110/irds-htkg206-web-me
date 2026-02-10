<template>
  <div class="card-wrap">
    <div v-for="item in seriesTable" :key="item.id" class="div-card">
      <div :body-style="{ padding: '0px' }" @click="designClick(item)" class="elcard">
        <div class="imagebox"><img :src="item.fileUrl" /></div>
        <div class="text-wrap">
          <span class="tit">{{ item.name }}</span>
          <div class="bottom">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  seriesTable: Array,
});
const emit = defineEmits(['design']);

// 去设计
const designClick = item => {
  emit('design', item);
};
</script>

<style scoped lang="less">
:deep(.el-table__header-wrapper .el-table__cell, .el-table__header-wrapper .el-table-column--selection) {
  background: #f5f7fa;
}

:deep(.el-table__header-wrapper th.el-table-fixed-column--left) {
  background: #f5f7fa;
}

:deep(.el-table__header-wrapper th.el-table-fixed-column--right) {
  background: #f5f7fa;
}

.demo-tabs {
  :deep(.el-tabs__nav-scroll) {
    padding-left: 10px;
  }
}
.card-wrap {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 16px);
}
.text-wrap {
  margin-left: 12px;
  .tit {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 14px;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}

.div-card {
  min-width: 610px;
  min-height: 132px;
  max-width: 610px;
  max-height: 132px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #eaeaf1;
  margin-bottom: 16px;
  margin-right: 16px;
  overflow: hidden;
  &:hover {
    border-color: rgb(13, 83, 226);
    box-shadow: 0 0 5px 2px rgba(13, 83, 226, 0.2);
  }
}

.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 8px;
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 12px;
  color: #6a696e;
  line-height: 19px;
  // height: 57px;
  // overflow: hidden;
  text-align: justified;
  font-style: normal;
  text-transform: none;
  text-align: left;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  height: 200px;
  display: block;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;

  .el-icon {
    font-size: 30px;
  }
}

.imagebox {
  min-width: 140px;
  min-height: 100px;
  max-width: 140px;
  max-height: 100px;
  overflow: hidden;
  border-radius: 4px 4px 4px 4px;
  img {
    min-width: 140px;
    min-height: 100px;
    max-width: 140px;
    max-height: 100px;
    overflow: hidden;
  }
}
.elcard {
  cursor: pointer;
  padding: 16px;
  display: flex;
}
</style>
