<script setup lang="ts">
import { ref, watch } from "vue";
import { UserOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { getTimes } from "@/utils/dateUtils.js";
import { getPdfPreviewPath, updateKldCounting } from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
// import { getPdfPreviewPath } from "@/api/knowledgeBaseManagment";
import draggableModal from "@/components/DraggableModal/index.vue";
const userStore = useUserStore()

const props = defineProps({
  userInfoList: Object,
  viewHistoryData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  hotArticleData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  hotFileTotal: {
    type: Number,
    required: true,
  },
  viewTotal: {
    type: Number,
    required: true,
  },
  tabFlag: Number,
});

const emit = defineEmits("getSearch");

const router = useRouter();
const dialogVisible = ref(false);
const dialogTit = ref("");

const page = ref({
  pageSize: 10000,
  pageCount: 100,
  currentPage: 1,
});

const myData = ref([]);

/** 浏览记录表格列配置 */
const viewHistoryColumns = [
  { title: '项目名', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
  { title: '创建者', dataIndex: 'userName', key: 'userName', width: 100 },
  { title: '创建时间', dataIndex: 'addTime', key: 'addTime', width: 160 },
];

/** 热点文档表格列配置 */
const hotArticleColumns = [
  { title: '项目名', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
  { title: '创建者', dataIndex: 'userName', key: 'userName', width: 100 },
  { title: '创建时间', dataIndex: 'addTime', key: 'addTime', width: 160 },
  { title: '浏览次数', dataIndex: 'lookUpNum', key: 'lookUpNum', width: 100 },
];
// 用户信息
const userInfoList = ref({});
const roleName = ref();

watch(
  () => props.userInfoList,
  (val) => {
    if (val) {
      userInfoList.value = val.userInfo;
      roleName.value = val.roleName;
      myData.value = [
        {
          title: "收藏",
          key: "my-contribution",
          value: val.collectsSize,
        },
        {
          title: "关注",
          value: val.interestSize,
          key: "my-follow",
        },

        // {
        //   title: "问题",
        //   key: "my-collect",
        //   value: val.questionSize,
        // },

        // {
        //   title: "回答",
        //   value: val.answerSize,
        //   key: "my-quest",
        // },
        {
          title: "分享",
          key: "my-contribution",
          value: val.shareSize,
        },
      ];
    }
  }
);

const getInfo = (item) => {
  console.log(item, "itemitem");
};

// 查看pdf
const viewPdf = async (item) => {
  const params = {
    id: item.fileId,
  };
  try {
    updateKldCounting({ kldFileId: item.id, countingType: 1 });
    const res = await getPdfPreviewPath(params);
    router.push({
      path: "/knowledge/pdfView",
      query: { docId: res.data.fileUrl },
    });
  } catch (error) {
    console.log('error:', error)
  }
};

//查看pdf
const viewPdfFun = (item) => {
  closeFun();
  if (
    item.fileType === "doc" ||
    item.fileType === "word" ||
    item.fileType === "docx" ||
    item.fileType === "pdf" ||
    item.fileType === "excel" ||
    item.fileType === "ppt" ||
    item.fileType === "pptx" ||
    item.fileType === "xls" ||
    item.fileType === "xlsx"
  ) {
    viewPdf(item);
  }
};

const viewMoreFun = (type) => {
  dialogVisible.value = true;
  if (type === "hot") {
    if (props.tabFlag === 1) {
      dialogTit.value = "热点文档";
    } else if (props.tabFlag === 2) {
      dialogTit.value = "热点视频";
    } else if (props.tabFlag === 3) {
      dialogTit.value = "热点图片";
    } else {
      dialogTit.value = "热点问答";
    }
    page.value.pageCount = props.hotFileTotal;
  } else {
    dialogTit.value = "浏览记录";
    page.value.pageCount = props.viewTotal;
  }
};

//分页
const handleSizeChange = (val) => {
  page.value.pageSize = val;
  // emit('getSearchSizeChange', val);
};
//分页
const handleCurrentChange = (val) => {
  page.value.currentPage = val;
  // emit('getSearchCurrentChange', val);
};

const closeFun = () => {
  dialogVisible.value = false;
};
</script>

<template>
  <div class="rt-layout flex flex-col">
    <div class="home-intro">
      <div class="user">
        <a-avatar :size="50" class="flex-shrink-0">
          <template #icon> <user-outlined /></template>
        </a-avatar>
        <div class="intro">
          <div class="name">{{ userInfoList.name || userStore.getUser.userName }}</div>
          <div class="tags">{{ userInfoList.expertRole }}</div>
        </div>
      </div>
      <div class="flex justify-between px-[16px]">
        <div v-for="(item, index) in myData" :key="index" class="text item" @click="getInfo(item)">
          <div style="
              width: 63px;
              height: 65px;
              text-align: center;
              background-color: #fff;
              padding-top: 10px;
            ">
            <div style="
                height: 20px;
                font-weight: bold;
                font-size: 16px;
                color: #000;
                margin-bottom: 4px;
              ">
              {{ item.value }}
            </div>
            <div style="
                height: 20px;
                font-weight: 400;
                font-size: 14px;
                color: #6a696e;
              ">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-card class="box-cards" :bordered="false">
      <template #title>
        <div class="card-header">
          <span style="font-weight: 600; font-size: 16px">浏览记录</span>
          <div class="more" @click="viewMoreFun('records')">更多</div>
        </div>
      </template>
      <div v-for="(item, index) in viewHistoryData" :key="item.id" class="text item w-full" @click="viewPdfFun(item)">
        <div v-if="!item.attachmentType" class="box-item w-full">
          <div class="fontHide w-full" v-if="!item.attachmentType">
            {{ item.description }}
          </div>
        </div>
        <div v-if="item.attachmentType" class="box-item  w-full">
          <div class="fontHide w-full" v-if="item.attachmentType">
            {{ item.fileName }}
          </div>
        </div>
      </div>
    </a-card>
    <a-card class="box-card hot-card flex-1 overflow-hidden flex flex-col" :bordered="false">
      <template #title>
        <div class="card-header">
          <span style="font-weight: 600; font-size: 16px" v-if="tabFlag === 1">热点文档</span>
          <span style="font-weight: 600; font-size: 16px" v-if="tabFlag === 2">热点视频</span>
          <span style="font-weight: 600; font-size: 16px" v-if="tabFlag === 3">热点图片</span>
          <span style="font-weight: 600; font-size: 16px" v-if="tabFlag === 4">热点问答</span>
          <div class="more" @click="viewMoreFun('hot')">更多</div>
        </div>
      </template>
      <div v-for="(val, index) in hotArticleData" :key="val.id" class="text item" @click="viewPdfFun(val)">
        <div v-if="val.fileName" class="box-item">
          <div class="space">
            <span style="margin-right: 0.625rem" :style="{
              color:
                index === 0
                  ? '#ff0000'
                  : index == 1 || index == 2
                    ? '#FF8A00'
                    : '',
            }">{{ index + 1 }}</span>{{ val.fileName }}
          </div>
        </div>
        <div v-if="val.fileName">
          <eye-outlined class="mr-[2px]" />
          {{ val.lookUpNum || val.num }}次
        </div>
      </div>
    </a-card>
    <div class="rightDialog">
      <draggable-modal v-model:visible="dialogVisible" :title="dialogTit" width="50%" cancel-text="关闭"
        @cancel="closeFun" class="record-modal">
        <div v-if="dialogTit === '浏览记录'" class="p-[16px]">
          <a-table
            :columns="viewHistoryColumns"
            :data-source="viewHistoryData"
            :pagination="false"
            :scroll="{ y: 400 }"
            row-key="id"
            size="small"
            :custom-row="(record) => ({ onClick: () => viewPdfFun(record) })"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'fileName'">
                <a-tooltip :title="record.fileName" placement="topLeft">
                  <span class="cursor-pointer hover:text-[var(--ant-primary-color)]" style="color: var(--ant-primary-color)">{{ record.fileName }}</span>
                </a-tooltip>
              </template>
              <template v-if="column.key === 'addTime'">
                {{ getTimes(Date.parse(record.addTime)) }}
              </template>
            </template>
          </a-table>
        </div>
        <div v-else class="p-[16px]">
          <a-table
            :columns="hotArticleColumns"
            :data-source="hotArticleData"
            :pagination="false"
            :scroll="{ y: 400 }"
            row-key="id"
            size="small"
            :custom-row="(record) => ({ onClick: () => viewPdfFun(record) })"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'fileName'">
                <a-tooltip :title="record.fileName" placement="topLeft">
                  <span class="cursor-pointer hover:text-[var(--ant-primary-color)]" style="color: var(--ant-primary-color)">{{ record.fileName }}</span>
                </a-tooltip>
              </template>
              <template v-if="column.key === 'addTime'">
                {{ getTimes(Date.parse(record.addTime)) }}
              </template>
              <template v-if="column.key === 'lookUpNum'">
                <span class="flex items-center">
                  <eye-outlined class="mr-[2px]" />
                  {{ record.lookUpNum || record.num }}次
                </span>
              </template>
            </template>
          </a-table>
        </div>
        <template #footer>
          <div class="footer">
            <span class="dialog-footer">
              <a-button type="primary" @click="dialogVisible = false">关闭</a-button>
            </span>
          </div>
        </template>
      </draggable-modal>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/sheets/scrollbar.less';
/* modal 通过 teleport 渲染到 body，scoped 无法穿透，样式移到下方全局块 */

:deep(.ant-card-body) {
  padding: 16px !important;
}

.rt-layout {
  height: 100%;
  // margin-top: 10px;
  // margin-right: 10px;
  overflow: hidden;

  :deep(.ant-card-head-title) {
    padding: 12px 0 8px 0;
  }

  .home-intro {
    // height: 367px;
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 16px;
    // padding: 20px 0 20px 20px;
    // overflow: hidden;
    width: 100%;
    padding-bottom: 16px;
    background: linear-gradient(181deg, #fae2ab 0%, #ffffff 100%);
    border-radius: 4px 4px 4px 4px;

    .user {
      display: flex;
      border-bottom: 1px solid #ebedf0;
      // padding-bottom: 20px;
      // margin-right: 20px;
      display: flex;
      align-items: center;
      padding: 16px;

      .elAvatar {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        // margin-top: 24px;
        // margin-left: 16px;
      }

      .intro {
        padding-left: 16px;

        .name {
          height: 26px;
          margin-bottom: 6px;
          font-family: PingFangSC, PingFang SC;
          line-height: 26px;
          font-weight: 600;
          font-size: 16px;
          color: #000000;
        }

        .tags {
          width: 90px;
          line-height: 24px;
          text-align: center;
          border-radius: 2px 2px 2px 2px;
          background: #f4bd3f;
          font-weight: 400;
          font-size: 14px;
          color: #674800;
          // .elTag {
          //   height: 24px;
          //   // color: var(--ant-primary-color) !important;
          //   // background: #edf4ff !important;
          //   font-family: Source Sans 3, Source Sans 3;
          //   font-weight: 400;
          //   font-size: 14px;
          //   color: #674800;
          //   // &:last-child {
          //   //   margin-right: 0;
          //   // }
          // }
        }
      }
    }

    .elCard {
      padding-top: 23px;
      border: none;

      :deep(.el-card__body) {
        padding: 0;
      }

      .item {
        display: flex;
        align-items: center;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #333;
        line-height: 20px;
        margin-bottom: 15px;
        cursor: pointer;

        .elIcon {
          margin-right: 10px;
          margin-left: 8px;
          font-size: 14px;
          cursor: pointer;

          .TrophyBase-ico {
            color: #2da641;
          }

          .StarFilled-ico {
            color: #fad20c;
          }

          .Opportunity-ico {
            color: #d40000;
          }

          .Document-ico {
            color: var(--ant-primary-color);
          }
        }
      }
    }
  }

  .box-cards {
    width: 100%;
    height: 190px;
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 16px;
    border: none;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    :deep(.ant-card-head) {
      width: 100%;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333;

      // padding: 18px 0 0px 0;
      .more {
        cursor: pointer;
        // color: var(--ant-primary-color);
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: var(--ant-primary-color);
      }
    }

    :deep(.ant-card-body) {
      padding: 16px;
      flex: 1;
      height: 0;
      overflow-y: auto;
      .wei-scrollbar-mixin();

      .item {
        display: flex;
        align-items: center;
        height: 34px;
        // line-height: 12px;
        // padding-left: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #646566;

        &:hover {
          cursor: pointer;
          color: var(--ant-primary-color);
        }

        .elTag {
          margin-right: 8px;
          color: var(--ant-primary-color) !important;
          background: #edf4ff !important;
        }

        .el-tag--light {
          margin-right: 8px;
        }
      }
    }
  }

  .hot-card {
    margin-bottom: 0;
    width: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333;

      // padding: 18px 0 0 0;
      .more {
        cursor: pointer;
        // color: var(--ant-primary-color);
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: var(--ant-primary-color);
      }
    }

    :deep(.ant-card-body) {
      padding: 0 16px 16px 16px;
      flex: 1;
      height: 0;
      overflow-y: auto;
      .wei-scrollbar-mixin();

      .box-item {
        flex: 1;
        width: 0;
      }

      .item {
        display: flex;
        align-items: center;
        line-height: 30px;
        padding: 8px 0;
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #646566;
        flex-wrap: wrap;
        border-bottom: 1px solid #E7EAEE;
        justify-content: space-between;

        &:hover {
          cursor: pointer;
          color: var(--ant-primary-color);
        }

        .elTag {
          margin-right: 8px;
          color: var(--ant-primary-color) !important;
          background: #edf4ff !important;
        }

        .el-tag--light {
          margin-right: 8px;
        }
      }
    }
  }

  .space {
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;

    &:hover {
      color: var(--ant-primary-color);
    }
  }

  // .elPage {
  //   margin-bottom: 20px;
  // }

  .footer {
    display: flex;
    justify-content: space-between;
  }

  .footer {
    // line-height: 64px;
    display: flex;
    justify-content: flex-end;
  }

  .fontHide {
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
    background-color: #f2f5f7;
    // padding: 6px 0 6px 8px;
    border-radius: 4px;
    margin-bottom: 12px;

    &:hover {
      color: var(--ant-primary-color);
    }
  }

  .tooltip-base-box .box-item {
    width: 20px;
    margin-top: 10px;
  }
}

:deep(.ant-table-body) {
  overflow-y: auto !important;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
}

</style>

<style lang="less">
.record-modal {
  .ant-modal-body {
    padding: 0 !important;
  }
}
</style>
