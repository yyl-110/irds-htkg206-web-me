<template>
  <div class="drawerContent">
    <Splitpanes class="default-theme sbom">
      <!-- 左侧 -->
      <Pane min-size="15" :size="20" class="splitpane-cls marginstyle">
        <div class="elAside flex flex-col overflow-y-auto">
          <a-input v-model:value="searchData" placeholder="请输入标题或作者搜索" @change="getMapList" @pressEnter="getMapList">
          </a-input>

          <div class="titleText py-[8px]" @click="addNewMap">
            <span class="creatText">创建一份新地图</span>
            <div class="iconStyle">
              <PlusOutlined class="plus" />
            </div>
          </div>

          <div class="cardWrap flex-1 h-0 overflow-y-auto wei-scrollbar">
            <a-card class="sideContent" :bodyStyle="{ padding: '0px' }" :bordered="false"
              v-for="(item, index) in sideData" :key="item.id" @click="mapDetail(item)">
              <img v-if="item.coverFileUrl" class="sideContent-img" :src="item.coverFileUrl" alt="" />
              <img v-else class="sideContent-img" src="@/assets/images/modal1.png" alt="" />
              <div style="padding: 0 6px 10px 10px; margin-top: 8px">
                <div class="sideContent-data-top">
                  <a-tooltip :mouseEnterDelay="0.5" placement="topLeft">
                    <template #title>{{ item.name }}</template>
                    <span class="sideContent-data-top-left">{{ item.name }}</span>
                  </a-tooltip>
                  <div class="sideContent-data-top-right">
                    <span class="sideContent-data-top-right-text" @click.stop="mapDetail(item)">详情</span>
                    <span v-if="item.enableModify" class="sideContent-data-top-right-text"
                      @click.stop="mapEdit(item)">编辑</span>
                    <span v-if="item.enableDelete" style="color: #155bd4; cursor: pointer"
                      @click.stop="mapDetele(item)">删除</span>
                  </div>
                </div>
                <div class="sideContent-data-bottom">
                  <span class="sideContent-data-bottom-text">{{
                    item.createUserName
                    }}</span>
                  <span class="sideContent-data-bottom-text">{{
                    getTimes(Date.parse(item.addTime))
                    }}</span>
                </div>
              </div>
            </a-card>
          </div>
        </div>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <div class="elMain">
          <div class="mainRight wei-scrollbar">
            <a-card class="pic" :bodyStyle="{ padding: '0px' }" v-for="(item, index) in mainData" :key="index">
              <img class="pic-img" :src="item.coverFileUrl" alt="" @click="player(item)" />
              <div class="pic-data">
                <div class="pic-data-top">
                  <div>{{ item.name }}</div>
                </div>
                <div class="pic-data-bom">摘要：{{ item.summary }}</div>
              </div>
            </a-card>
          </div>
          <a-pagination class="elPage" v-model:current="page.currentPage" v-model:pageSize="page.pageSize"
            :show-total="(total) => `共${total}条`" :total="page.pageCount" show-size-changer
            @change="handleCurrentChange" @showSizeChange="handleSizeChange" />
        </div>
      </Pane>
    </Splitpanes>
  </div>

  <detail-dialog :dialogVisible="dialogVisible" :objData="objData" @getList="getMainData"
    @closeDiaDetail="closeDiaDetail" />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, nextTick, computed, onActivated } from "vue";
import { message, Modal } from "ant-design-vue";
import {
  PlusOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons-vue";
import { Pane, Splitpanes } from "splitpanes";
import { useRouter } from "vue-router";
// 接口导入保持不变
import { getTimes } from "@/utils/dateUtils.js";
import { useUserStore } from "@/store/modules/user";
import {
  personalMapList,
  taskMaplist,
  modifyInitMap,
  removeMap,
} from "@/api/knowledge";
import detailDialog from "../components/detailDialog.vue";

const page = ref({
  pageSize: 10,
  pageCount: 0,
  currentPage: 1,
});

// 详情弹窗
const dialogVisible = ref(false);

// 弹窗需要的数据
const objData = ref({});
const searchData = ref("");

// 左侧数据
const sideData = ref([]);

const mainData = ref([]);

const upPageDis = ref(true);
const nextPageDis = ref(false);

const router = useRouter();
const props = defineProps({
  mainCurrentTab: String,
});

onMounted(() => {
  getMapList();
  getMainData();
});

const upPage = () => {
  page.value.currentPage--;
  if (page.value.currentPage === 1) {
    upPageDis.value = true;
  } else {
    upPageDis.value = false;
  }
  getMapList();
};

const nextPage = () => {
  page.value.currentPage++;
  upPageDis.value = false;
  getMapList();
};

const getMapList = () => {
  const params = {
    userId: useUserStore().getUser.id,
    queryContent: searchData.value,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  taskMaplist(params).then((res) => {
    if (res && res.data.code === "0") {
      sideData.value = [];
      sideData.value = res.data.data.result;
      if (sideData.value.length < 10) {
        nextPageDis.value = true;
      } else {
        nextPageDis.value = false;
      }
    } else {
      message.error(res.data.msg);
    }
  });
};

// 获取主列表数据
const getMainData = () => {
  const params = {
    userId: useUserStore().getUser.id,
    type: 2,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  personalMapList(params).then((res) => {
    if (res && res.data.code === "0") {
      mainData.value = [];
      mainData.value = res.data.data.result;
      page.value.pageCount = res.data.data.rowCount;
    } else {
      message.error(res.data.msg);
    }
  });
};

const addNewMap = () => {
  router.push({ path: "/knowledgemgt/createTaskMap" });
};

// 详情
const mapDetail = (item) => {
  localStorage.setItem("detail", JSON.stringify(item));
  objData.value = item;
  if (item.viewed) {
    router.push({
      path: "/knowledge/taskMapDetail",
      query: { flag: "2" },
    });
  } else {
    dialogVisible.value = true;
  }
};

// 编辑
const mapEdit = (item) => {
  router.push({ path: "/knowledgemgt/createTaskMap", query: { id: item.id } });

};

// 删除
const mapDetele = (item) => {
  Modal.confirm({
    title: "确定要删除?",
    content: "",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      const params = {
        taskMapId: item.id,
        userId: useUserStore().getUser.id,
      };
      return removeMap(params).then((res) => {
        if (res && res.data.code === "0") {
          getMapList();
          getMainData();
          message.success("删除成功");
        } else {
          message.error(res.data.msg);
        }
      });
    },
    onCancel() {
      message.info("取消删除");
    },
  });
};

// 查看详情
const player = (item) => {
  localStorage.setItem("detail", JSON.stringify(item));
  router.push({
    path: "/knowledge/taskMapDetail",
    query: { flag: "2" },
  });
};

// 分页 - pageSize 改变
const handleSizeChange = (current, size) => {
  page.value.pageSize = size;
  page.value.currentPage = current;
  getMainData();
};
// 分页 - current 改变
const handleCurrentChange = (pageNo, pageSize) => {
  page.value.currentPage = pageNo;
  getMainData();
};

// 关闭弹窗
const closeDiaDetail = () => {
  getMapList();
  dialogVisible.value = false;
};
</script>

<style lang="less" scoped>
.elAside {
  height: 100%;
  overflow-x: hidden;

  .cardWrap {
    overflow-x: hidden;
    width: 100%;
  }

  .titleText {
    align-items: center;
    justify-content: center;
    display: flex;
    cursor: pointer;

    .creatText {
      font-size: 14px;
      margin-right: 10px;
      color: #155bd4;
    }

    .iconStyle {
      display: flex;
      justify-content: center;
      align-items: center;

      .plus {
        background-color: #0089ff;
        color: #fff;
        cursor: pointer;
        font-size: 13px;
        border-radius: 50%;
        /* 如果原有图标是圆形的可以加上这个 */
      }
    }
  }

  .sideContent {
    margin: 0 auto 10px;
    width: 196px;
    cursor: pointer;
    border: 1px solid #ccc;

    &-img {
      width: 196px;
      height: 80px;
      border-bottom: 1px solid #e6e6e6;
    }

    &-data {
      border-top: none;
      margin-top: -17px;

      &-top {
        display: flex;
        justify-content: space-between;

        &-left {
          color: #155bd4;
          font-size: 12px;
          height: 16px;
          line-height: 16px;
          display: inline-block;
          width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &-right {
          height: 16px;
          line-height: 16px;
          font-size: 11px;

          &-text {
            margin-right: 5px;
            color: #155bd4;
            cursor: pointer;

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }

      &-bottom {
        text-align: left;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        margin-top: 4px;

        &-text {
          margin-right: 20px;
        }
      }
    }
  }

  .bottomBtn {
    width: 100%;
    margin: 0 20px 20px 10px;
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
  }
}

.elMain {
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

  .mainRight {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    place-content: flex-start;
    padding-top: 16px;

    .pic {
      width: 480px;
      height: 132px;
      border-radius: 6px;
      border: 1px solid #eaeaf1;
      margin: 0 16px 16px 0;

      &:hover {
        border-color: #155bd4;

        .pic-data-top {
          color: #155bd4;
        }
      }

      :deep(.ant-card-body) {
        display: flex;
      }

      &-img {
        width: 140px;
        height: 100px;
        border-radius: 4px;
        margin: 16px;
        cursor: pointer;
      }

      &-data {
        margin-top: 24px;

        &-top {
          display: flex;
          font-family: Source Sans 3, Source Sans 3;
          font-weight: 600;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.8);
          line-height: 22px;
          text-align: left;
          cursor: pointer;
        }

        &-bom {
          margin: 8px 16px 0 0;
          height: 57px;
          font-family: Source Sans 3, Source Sans 3;
          font-weight: 400;
          font-size: 12px;
          color: #6a696e;
          line-height: 19px;
          text-align: justify;
          overflow: hidden;
        }

        &-center {
          padding-left: 15px;
        }
      }
    }
  }

  .elPage {
    margin-top: 15px;
    text-align: right;
  }
}

/* 匹配原有的暗黑气泡框样式 */
:deep(.ant-tooltip-inner) {
  max-width: 200px !important;
  background: #4b4b4b;
}

:deep(.ant-tooltip-arrow-content) {
  background: #4b4b4b;
}

::v-deep(.splitpanes__splitter:after),
::v-deep(.splitpanes__splitter:before) {
  border-left: 1px solid #e6e7e9 !important;
}

::v-deep(.sbom > .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}

::v-deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: #fff;
}

.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}

:deep(.marginstyle) {
  padding: 10px !important;
  padding-bottom: 5px !important;
  padding-left: 0 !important;
}

.drawerContent {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #ffffff !important;
}
</style>