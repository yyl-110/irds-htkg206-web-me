<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { defineComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { message, Modal } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { encryptValue } from '@/utils';
import Empty from '@/components/Empty/index.vue';
const router = useRouter()
const userStore = useUserStore();
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h({
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});


onMounted(() => {

});

</script>

<template>
  <div>首页</div>
</template>

<style lang="less" scoped>
@import '../../assets/css/workbench/workbench.less';
// :deep()
.box {
  height: 100%;
  width: 100%;
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 0px 0px;
  /*display: flex;*/
  /*flex-wrap:nowrap;*/
  /*justify-content:space-between;*/
  overflow-x: hidden;
  background: #fff;
  display: flex;
}

.work-list {
  margin: 0 10px;
  padding: 0;
  // height: 100vh;
  width: 80%;
  overflow: hidden;

  .tabs-main-wrap {
    background: #fff;
    padding-top: 10px;
    padding-right: 10px;
  }
}

.sysmsg-list-ref {
  width: 20%;
  height: 100%;
  overflow: hidden;
  background: #f7f8fa;

  .title {
    padding-left: 24px;
    padding-top: 16px;
    padding-bottom: 10px;
    font-size: 14px;
    color: #515a6e;
  }

  .tabs-wrap {
    background: #fff;
    padding-bottom: 10px;
    margin-top: 10px;
    overflow: hidden;

    .tab-pane-list {
      min-height: 30vh;
      max-height: 30vh;
    }

    .cell-group-wrap {
      margin-top: -10px;
      margin-left: -5px;
      height: calc(40vh - 10px);
      overflow-y: auto;
    }

    // .InfoItem {
    //   overflow: auto;
    // }
    .info-item {
      display: flex;
      justify-content: space-between;
      margin: 12px 0px;
      flex-wrap: nowrap;
      overflow: hidden;
      cursor: pointer;

      &-nums {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin: 0px 0 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #000;
        color: var(--color);
        background-color: var(--background-color);
      }

      &-text {
        margin: 0px 0 0 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1;
        line-height: 16px;
        width: 40%;

        &:hover {
          color: #2d8cf0;
        }
      }

      &-text-def {
        &:hover {
          color: #515a6e;
        }
      }

      &-time {
        margin-right: 10px;
        font-size: 12px;
        width: 60%;
        height: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: right;
      }
    }
  }

  .fold-flag2 {
    padding: 0 10px;

    .fold-flag2-wrap {
      width: 100%;
      background: #fff;

      .title {
        height: 36px;
        line-height: 36px;
        padding-top: 0;
        border-bottom: 1px solid #f0f0f0;
      }

      :deep(.grid-wrap) {
        max-height: 70px;
        overflow: hidden;
      }

      :deep(.ivu-grid-item) {
        border-right: 1px solid #f0f0f0;
        box-shadow: none;
        cursor: pointer;

        &:hover {
          box-shadow: -3px 5px 8px 5px #eee;
          color: #2d8cf0;
        }
      }

      :deep(.ivu-grid-item-main) {
        padding: 0px !important;
        text-align: center;
        line-height: 70px;
        height: 70px;
        overflow: hidden;
      }
    }
  }
}

.elrow {
  height: 40px;
  margin-bottom: 10px;

  .grid-content {
    height: 100%;
    // background: rgb(225, 246, 255, 0.2);
    background: #f9f9f9;
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    border: 1px solid #f5f7fa;

    .act-btn {
      display: flex;
      align-items: center;
      margin-right: 15px;
      color: #1971ff;
      font-size: 13px;
      cursor: pointer;

      &:hover {
        color: #1971ff;
      }
    }
  }
}

.top-title {
  height: 100%;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-collapse-item__header) {
  background: #f5f7fa;
}
.mg10 {
  margin-top: 10px;
}
.fast-wrap {
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  height: 156px;
  overflow: hidden;
  .fast-list {
    width: 25%;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: 10px;
    flex: 0 0 25%;
    &:hover {
      .tit {
        color: #1971ff;
      }
    }
    img {
      display: block;
      width: 40px;
      height: 40px;
      background: #ccc;
      border-radius: 4px;
      border: 1px solid #f6f6f6;
      margin: 0 auto;
      overflow: hidden;
    }
    .tit {
      font-size: 12px;
      color: #0c1116;
      text-align: center;
      margin: 3px auto 0 auto;
      height: 20px;
      max-width: 70px;
      overflow: hidden;
    }
  }
}
:deep(.layout) {
  padding: 0 0px 0px 0px !important;
}

// .user-selector-modal{
:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

// :deep(.ant-table-tbody > tr > td) {
//   padding: 5px;
// }

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}

.show-right-content-btn {
  position: fixed;
  bottom: 30px;
  right: 20px;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  border-radius: 40px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  background: rgb(13, 83, 226, 0.2);
  z-index: 10;
}
:deep(.ant-tabs-nav::before) {
  border-bottom: 0px solid #f0f0f0 !important;
}
:deep(.ant-tabs-tab) {
  margin-right: 0px !important;
}

/* 成员选择弹窗：固定高度，头部/搜索/底部固定，中间表格滚动 */
.member-modal-body {
  width: 100%;
  background: #fff;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  /* 固定高度，可根据需要调整 */
  height: 520px;
}
.member-search-row {
  padding: 12px 0;
  flex: 0 0 auto;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 3;
}
.member-table-wrap {
  flex: 1 1 auto;
  overflow-y: auto;
}
</style>
