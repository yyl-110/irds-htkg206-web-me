<script setup lang="ts">
import { ref, watch } from "vue";
import { UserOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { getTimes } from "@/utils/dateUtils.js";
import { getPdfPreviewPath } from "@/api/knowledge";
// import { getPdfPreviewPath } from "@/api/knowledgeBaseManagment";

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
const viewPdf = (id) => {
  const params = {
    id: id,
  };
  getPdfPreviewPath(params).then((res) => {
    if (res && res.data.code === 200) {
      router.push({
        path: "/knowledge/pdfView_index",
        query: { docId: res.data.data.fileUrl },
      });
    }
  });
};

//查看pdf
const viewPdfFun = (item) => {
  console.log(item, "itemsdkfhakshfds");
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
    viewPdf(item.fileId);
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
          <div class="name">{{ userInfoList.name }}</div>
          <div class="tags">{{ userInfoList.expertRole }}</div>
        </div>
      </div>
      <div class="desc">个人简介：{{ userInfoList.remarks }}</div>
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
        <div v-if="val.fileName" style="
            margin-left: 10px;
            margin-top: -40px;
            display: flex;
            align-items: center;
          ">
          <eye-outlined class="mr-[2px]" />
          {{ val.lookUpNum || val.num }}次
        </div>
      </div>
    </a-card>
    <div class="rightDialog">
      <a-modal v-model:visible="dialogVisible" :title="dialogTit" width="50%" cancel-text="关闭" @cancel="closeFun"
        class="record-modal">
        <a-card v-if="dialogTit === '浏览记录'" class="box-card2" style="height: 18.75rem; overflow-y: auto"
          :bordered="false">
          <div v-for="(item, index) in viewHistoryData" :key="item.id" class="text item text-list"
            @click="viewPdfFun(item)">
            <div class="box-item">
              <div class="tit">{{ item.fileName }}</div>
            </div>
            <div>
              <span class="name">{{ item.userName }}</span>
              <span class="time">{{ getTimes(Date.parse(item.addTime)) }}</span>
            </div>
          </div>
        </a-card>
        <a-card v-else class="box-card1" :bordered="false" style="height: 18.75rem; overflow-y: auto">
          <div v-for="(item, index) in hotArticleData" :key="item.id" @click="viewPdfFun(item)"
            style="border-bottom: 1px solid #ccc">
            <div class="text item text-list">
              <div class="box-item">
                <div class="tit">{{ item.fileName }}</div>
              </div>
              <div>
                <span class="name">{{ item.userName }}</span>
                <span class="time">{{
                  getTimes(Date.parse(item.addTime))
                }}</span>
              </div>
            </div>
            <div style="line-height: 22px; display: flex; align-items: center">
              <eye-outlined class="mr-[2px]" />
              {{ item.lookUpNum || item.num }}次
            </div>
          </div>
        </a-card>
        <template #footer>
          <div class="footer">
            <span class="dialog-footer">
              <a-button type="primary" @click="dialogVisible = false">关闭</a-button>
            </span>
          </div>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/sheets/scrollbar.less';
/* modal 通过 teleport 渲染到 body，scoped 无法穿透，样式移到下方全局块 */

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
    height: 200px;
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
          //   // color: #155bd4 !important;
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

    .desc {
      padding: 8px 16px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #333;
      line-height: 20px;
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
            color: #155bd4;
          }
        }
      }
    }
  }

  .box-cards {
    width: 100%;
    height: 160px;
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
        // color: #155bd4;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #0d53e2;
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
          color: #155bd4;
        }

        .elTag {
          margin-right: 8px;
          color: #155bd4 !important;
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
        // color: #155bd4;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #0d53e2;
      }
    }

    :deep(.ant-card-body) {
      padding: 0 16px 16px 16px;
      flex: 1;
      height: 0;
      overflow-y: auto;
      .wei-scrollbar-mixin();

      .item {
        display: flex;
        align-items: center;
        height: 61px;
        line-height: 60px;
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #646566;
        flex-wrap: wrap;
        border-bottom: 1px solid #ccc;

        &:hover {
          cursor: pointer;
          color: #155bd4;
        }

        .elTag {
          margin-right: 8px;
          color: #155bd4 !important;
          background: #edf4ff !important;
        }

        .el-tag--light {
          margin-right: 8px;
        }
      }
    }
  }

  .space {
    width: 12.375rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
    margin-top: -10px;

    &:hover {
      color: #0d53e2;
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
      color: #0d53e2;
    }
  }
  .tooltip-base-box .box-item {
    width: 20px;
    margin-top: 10px;
  }

  .rightDialog {
    :deep(.el-dialog > .el-dialog__body) {
      padding: 0;
    }

    .view-more-dialog {
      .box-card1 {
        overflow: auto;
        padding: 0 10px;
        background: #ffffff;
        border-radius: 4px;
        margin-bottom: 10px;
        border: none;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #333;

          .more {
            cursor: pointer;
            color: #155bd4;
          }
        }

        :deep(.el-card__body) {
          padding: 0 !important;

          .item {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            color: #646566;

            &:hover {
              cursor: pointer;
              color: #155bd4;
            }

            .elTag {
              margin-right: 8px;
              color: #155bd4 !important;
              background: #edf4ff !important;
            }

            .el-tag--light {
              margin-right: 8px;
            }
          }
        }
      }

      .box-card2 {
        overflow: auto;
        padding: 0 10px;
        background: #ffffff;
        border-radius: 4px;
        margin-bottom: 10px;
        border: none;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #333;

          .more {
            cursor: pointer;
            color: #155bd4;
          }
        }

        :deep(.el-card__body) {
          padding: 0 !important;

          .item {
            display: flex;
            align-items: center;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            color: #646566;
            margin: 5px 0;
            border-bottom: 1px solid #f0f0f0;

            &:hover {
              cursor: pointer;
              color: #155bd4;
            }

            .elTag {
              margin-right: 8px;
              color: #155bd4 !important;
              background: #edf4ff !important;
            }

            .el-tag--light {
              margin-right: 8px;
            }
          }
        }
      }

      .el-dialog__body {
        margin: 0;
      }

      .text-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        height: 32px;
        line-height: 32px;

        .tit {
          width: 32.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 32px;
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          // color: #155bd4;
          line-height: 32px;
          justify-content: flex-start;
          cursor: pointer;

          &:hover {
            color: #409eff;
          }
        }

        .name {
          height: 22px;
          font-size: 12px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 0.8);
          line-height: 22px;
          text-align: right;
          cursor: default;
          margin-right: 10px;
        }

        .time {
          height: 22px;
          font-size: 12px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 0.8);
          line-height: 22px;
          margin-left: 8px;
          cursor: default;
        }
      }

      .box-card .el-card__body {
        padding: 5px 0 0 0;
      }
    }
  }
}

:deep(.box-card > .el-card__header) {
  padding: 0 20px 0 20px !important;
  border-bottom: none;
}
</style>

<style lang="less">
.record-modal {
  .ant-modal-body {
    padding: 0 !important;
  }
}
</style>
