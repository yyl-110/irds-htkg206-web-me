<template>
  <div class="knowledgeMap h-full">
    <a-row>
      <a-col :span="5" class="max-w-[264px]">
        <div class="searchAll">
          <a-input-search v-model:value="searchData" placeholder="请输入标题或作者搜索" enter-button @search="onSearch" />
        </div>
        <div class="pic-list" v-for="(item, index) in mapLocationTabs" :key="index" @click="mapLocationFun(item)">
          <a-avatar class="elava" :style="{ backgroundColor: colorss[Math.floor(Math.random() * colorss.length)] }"
            :size="36">{{ item.nodeName[0] }}</a-avatar>
          <a-tooltip v-if="item.nodeName && item.nodeName.length >= 9" class="box-item" placement="right">
            <template #title>{{ item.nodeName }}</template>
            <div class="uname">{{ item.nodeName }}</div>
          </a-tooltip>
          <div v-else class="uname">{{ item.nodeName }}</div>
        </div>
      </a-col>
      <a-col :span="18">
        <div class="content">
          <div class="map-wrap">
            <relation-graph class="rac" ref="graphRef" :options="options" v-show="tabIndex === 1"
              :on-node-click="onNodeClick" />
            <relation-graph class="avitive" ref="graphRefOne" :options="optionsOne" v-show="tabIndex === 2"
              :on-node-click="onNodeClick" />
            <RelationGraph class="avitive" ref="graphRefTwo" :options="optionsTwo" v-show="tabIndex === 3"
              :on-node-click="onNodeClick" />
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { fileList, getEchartsDataByTypel, getNodeByLevel } from '@/api/knowledge';
import { useUserStore } from '@/store/modules/user';
import { INodeByLevel } from '../types';
import { options, optionsOne, optionsTwo } from './data';
import RelationGraph from 'relation-graph-vue3';

const userStore = useUserStore();


const searchData = ref(''); // 搜索
const searchKey = ref(''); // 搜索

const mapLocationTabs = ref<INodeByLevel[]>([]);
const documentList = ref([]);
const tabIndex = ref(1);
const currentTreeId = ref();
const drawer = ref(false);

const graphRef = ref('');
const graphRefOne = ref('');
const graphRefTwo = ref('');

const colorss = ref(['#326FFE', '#F4BD3F', '#43AAE4', '#1ECFB9', '#F95669']);

// 文档id
const docId = ref('');
const page = ref({
  pageSize: 10000,
  pageCount: 100,
  currentPage: 1,
});

// 所有选中子节点的id
const childsNode = ref([]);

const onSearch = (value: string) => {
  initTree();
}

const mapLocationFun = (item: INodeByLevel) => {
  graphInit(item);
  initData();
  mapLocationTabs.value.forEach(v => {
    if (v.id === item.id) {
      v.isCurrent = true;
    } else {
      v.isCurrent = false;
    }
  });
}

// 递归获取所有子节点
const cureionNode = data => {
  // childsNode.value = [];
  data.forEach(v => {
    childsNode.value.push(v.id);
    if (v.lot.childs && v.lot.childs.length > 0) {
      cureionNode(v.lot.childs);
    }
  });
};

//点击关系图节点
const onNodeClick = (nodeObject, $even) => {
  currentTreeId.value = nodeObject.id;
  drawer.value = true;
  const { lot } = nodeObject;
  childsNode.value = [];
  if (lot.childs && lot.childs.length > 0) {
    lot.childs.forEach(v => {
      if (v.lot.childs && v.lot.childs.length > 0) {
        cureionNode(v.lot.childs);
        childsNode.value.push(v.id);
      } else {
        childsNode.value.push(v.id);
      }
    });
  }
  initData();
};

const initData = () => {
  if (currentTreeId.value) {
    childsNode.value.push(currentTreeId.value);
  }
  childsNode.value = [...new Set(childsNode.value)];
  const params = {
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
    type: 1, //1.文档2.视频3.图片4.问答
    kldTreeId: childsNode.value.toString() || '', //机构id和子机构id
    userId: userStore.getUser.id, //
    //搜索条件
    titleOrUserName: searchKey.value || '',
  };
  fileList(params).then(res => {
    if (res.data && res.data.code === '0') {
      console.log(res.data, '111');
      documentList.value = [];
      documentList.value = res.data.data.result;
      page.value.pageCount = res.data.data.total;
    }
  });
};

// 树结构数据
const initTree = () => {
  const params = {
    menuId: 45,
    menuParentId: 15,
    treeType: 2,
    nodeLevel: '2',
    nodeName: searchData.value,
  };
  getNodeByLevel(params).then(res => {
    if (res?.data && res.data.code === '0') {
      mapLocationTabs.value = [];
      mapLocationTabs.value = res.data.data.result;
      if (mapLocationTabs.value.length > 0) {
        mapLocationTabs.value.map(v => {
          v.isCurrent = false;
        });
      }
      // initialize.value = mapLocationTabs.value[0].id;
      console.log('mapLocationTabs:', mapLocationTabs.value)
      graphInit(mapLocationTabs.value[0]);
      initData();
      mapLocationTabs.value[0].isCurrent = true;
    }
  });
};

// 展示节点图
const graphInit = item => {
  const params = {
    menuId: 45,
    menuParentId: 15,
    treeType: 2,
    treeId: item.id, //所选节点tree id
    taggingId: '', //图标展示类型，tree里有 目前数据格式都一样传不传无所谓
  };
  getEchartsDataByTypel(params).then(res => {
    if (res && res.data.code === '0') {
      console.log(res.data.data, 'wwwwwwwwwwwwwwwww');
      if (item.style === '1' || !item.style) {
        tabIndex.value = 1;
        const jsonData = {
          rootId: res.data.data.result.rootId,
          nodes: res.data.data.result.nodes || [],
          lines: res.data.data.result.lines || [],
        };
        graphRef.value.setJsonData(jsonData);
      } else if (item.style === '2') {
        tabIndex.value = 2;
        const jsonDataOne = {
          rootId: res.data.data.result.rootId,
          nodes: res.data.data.result.nodes || [],
          lines: res.data.data.result.lines || [],
        };
        graphRefOne.value.setJsonData(jsonDataOne);
      } else if (item.style === '3') {
        tabIndex.value = 3;
        const jsonDataTwo = {
          rootId: res.data.data.result.rootId,
          nodes: res.data.data.result.nodes || [],
          lines: res.data.data.result.lines || [],
        };
        graphRefTwo.value.setJsonData(jsonDataTwo);
      }
    }
  });
};

onMounted(() => {
  initTree();
})

</script>

<style lang="less" scoped>
.knowledgeMap {
  .pic-list {
    display: flex;
    align-items: center;
    // margin-bottom: 40px;
    height: 60px;
    line-height: 60px;
    width: 100%;

    .elava {
      margin-left: 12px;
      min-width: 36px;
      max-width: 36px;
      // background: #43aae4;
    }

    .uname {
      font-weight: 500;
      font-size: 16px;
      font-weight: bold;
      color: #313133;
      margin-left: 8px;
      // border-bottom: 1px solid #e5e5e5;
      line-height: 48px;
      flex: 1;
      cursor: pointer;
      word-break: keep-all;
      overflow: hidden;
      width: 100%;
      /* 定义容器宽度 */
      white-space: nowrap;
      /* 确保文本不换行 */
      overflow: hidden;
      /* 隐藏超出容器的内容 */
      text-overflow: ellipsis;
      /* 使用省略号显示被截断的文本 */
    }

    &:first-child {
      margin-top: 20px;
    }
  }

  .content {
    position: relative;
    background-color: #f7f8fa;
    height: ~'calc(100vh - 224px)';

    .map-wrap {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
    }

    .elTabs {
      border-radius: 4px;
      background-color: #ffffff;
      padding-top: 20px;
      height: ~'calc(100vh - 534px)';
      overflow-y: auto;

      .doc-wrap {
        min-height: 554px;
        background: #ffffff;
        border-radius: 4px;
        padding: 20px;

        .doc-list {
          margin-bottom: 10px;
          border: 1px solid #eee;
          padding: 0 16px;

          .desc {
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            color: #333;
            height: 55px;
            line-height: 30px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            /* 定义文本的行数 */
          }

          .elAvatar {
            margin-right: 5px;
          }

          .author {
            margin-top: 8px;

            span {
              height: 22px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              color: rgba(51, 51, 51, 0.8);
              line-height: 22px;
            }

            span.time {
              margin-left: 13px;
            }
          }

          .action-wrap {
            display: flex;
            margin-right: 10px;
            justify-content: center;
            align-items: center;

            .act-list {
              display: flex;
              align-items: center;
              border-right: 1px solid #dcdee0;
              margin-right: 10px;
              height: 16px;

              &:last-child {
                border: none;
              }

              span {
                margin: 0 9px;
              }
            }

            .elChatDotSquare,
            .elConnection,
            .elEdit,
            .elDelete,
            .elStarFilled,
            .elShare {
              cursor: pointer;

              &:hover {
                color: #155bd4;
              }

              &:last-child {
                margin-right: 0;
              }
            }

            .elStarFilled1 {
              cursor: pointer;
              color: red;
            }
          }

          .highlightName {
            height: 26px !important;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 16px;
            color: #000;
            line-height: 26px;
            width: calc(100% - 10px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;

            :deep(em) {
              color: red !important;
            }
          }

          .descColor {
            :deep(em) {
              color: red !important;
            }
          }
        }

        .ask-list {
          .author {
            display: flex;
            align-items: center;
            height: 24px;
            margin-bottom: 8px;

            .elAvatar {
              min-height: 24px;
              min-width: 24px;
            }

            .name {
              margin-left: 8px;
              font-weight: 500;
              color: #323233;
            }
          }

          .desc {
            height: 22px;
            overflow: hidden;

            span {
              height: 22px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              color: #155bd4;
              line-height: 22px;
              margin-right: 11px;
            }
          }

          .action-wrap {
            position: relative;

            .right-action {
              position: absolute;
              right: 0;
              top: 0;
              display: flex;

              .act-list {
                color: #155bd4;

                .delete-wrap {
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
        }
      }

      .video-wrap {
        min-height: 554px;
        background: #ffffff;
        border-radius: 4px;
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        place-content: flex-start;

        .img-list {
          margin: 16px 16px 0 16px;
          border-radius: 4px;
          overflow: hidden;
          background: #ccc;
        }

        &-title {
          padding-left: 16px;

          &-right {
            display: flex;
            line-height: 22px;

            .act-list {
              display: flex;
              align-items: center;
              margin-left: 10px;

              span {
                margin: 0 5px;
              }
            }

            .elChatDotSquare,
            .elConnection,
            .elEdit,
            .elDelete,
            .elStarFilled,
            .elShare {
              cursor: pointer;

              &:hover {
                color: #155bd4;
              }
            }

            .elStarFilled1 {
              cursor: pointer;
              color: red;
            }
          }
        }

        .doc-list {
          margin-bottom: 16px;
          width: 240px;
          height: 240px;
          margin-right: 16px;
          border: 1px solid #eaeaf1;

          h3 {
            height: 22px;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            // font-weight: bold;
            color: #155bd4;
            line-height: 22px;
            display: inline-block;
            cursor: pointer;
          }

          .desc {
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            color: #646566;
            line-height: 22px;
          }

          .author {
            padding-left: 16px;

            span {
              height: 22px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              color: #969799;
              line-height: 22px;
            }

            span.time {
              margin-left: 13px;
            }
          }

          .action-wrap {
            display: flex;
            margin: 5px 0 20px 0;

            .act-list {
              display: flex;
              align-items: center;
              border-right: 1px solid #dcdee0;
              margin-right: 10px;
              height: 16px;

              &:last-child {
                border: none;
              }

              span {
                margin: 0 9px;
              }
            }

            .elChatDotSquare,
            .elConnection,
            .elEdit,
            .elDelete,
            .elStarFilled,
            .elShare {
              cursor: pointer;

              &:hover {
                color: #155bd4;
              }
            }

            .elStarFilled1 {
              cursor: pointer;
              color: red;
            }
          }

          .highlightName {
            :deep(em) {
              color: red !important;
            }
          }

          .descColor {
            :deep(em) {
              color: red !important;
            }
          }
        }

        .ask-list {
          .author {
            display: flex;
            align-items: center;
            height: 24px;
            margin-bottom: 8px;

            .elAvatar {
              min-height: 24px;
              min-width: 24px;
            }

            .name {
              margin-left: 8px;
              font-weight: 500;
              color: #323233;
            }
          }

          .desc {
            height: 22px;
            overflow: hidden;

            span {
              height: 22px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              color: #155bd4;
              line-height: 22px;
              margin-right: 11px;
            }
          }

          .action-wrap {
            position: relative;

            .right-action {
              position: absolute;
              right: 0;
              top: 0;
              display: flex;

              .act-list {
                color: #155bd4;

                .delete-wrap {
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
        }
      }

      .img-wrap {
        min-height: 554px;
        background: #ffffff;
        border-radius: 4px;
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        place-content: flex-start;

        .img-list {
          margin: 16px 16px 0 16px;
          border-radius: 4px;
          overflow: hidden;
          background: #ccc;
        }

        &-title {
          // display: flex;
          margin-left: 16px;

          &-right {
            display: flex;
            // margin-left: 20px;
            line-height: 22px;

            .act-list {
              display: flex;
              align-items: center;
              margin-left: 10px;

              // &:last-child {
              //   border: none;
              // }
              span {
                margin: 0 5px;
              }
            }

            .elChatDotSquare,
            .elConnection,
            .elEdit,
            .elDelete,
            .elStarFilled,
            .elShare {
              cursor: pointer;

              &:hover {
                color: #155bd4;
              }
            }

            .elStarFilled1 {
              cursor: pointer;
              color: red;
            }
          }
        }

        .doc-list {
          margin-bottom: 16px;
          margin-right: 10px;
          width: 230px;
          height: 245px;
          border-radius: 6px;
          border: 1px solid #eaeaf1;

          h3 {
            height: 22px;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 400;
            color: #155bd4;
            line-height: 22px;
            display: inline-block;
            cursor: pointer;
          }

          .desc {
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            color: #646566;
            line-height: 22px;
          }

          .author {
            // margin-top: 8px;
            margin-left: 16px;

            span {
              height: 22px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              color: #969799;
              line-height: 22px;
            }

            span.time {
              margin-left: 13px;
            }
          }

          // &:last-child {
          //   border: none;
          // }
          .action-wrap {
            display: flex;
            margin: 5px 0 20px 0;

            .act-list {
              display: flex;
              align-items: center;
              border-right: 1px solid #dcdee0;
              margin-right: 10px;
              height: 16px;

              &:last-child {
                border: none;
              }

              span {
                margin: 0 9px;
              }
            }

            .elChatDotSquare,
            .elConnection,
            .elEdit,
            .elDelete,
            .elStarFilled,
            .elShare {
              cursor: pointer;

              &:hover {
                color: #155bd4;
              }
            }

            .elStarFilled1 {
              cursor: pointer;
              color: red;
            }
          }

          .highlightName {
            :deep(em) {
              color: red !important;
            }
          }

          .descColor {
            :deep(em) {
              color: red !important;
            }
          }
        }

        .ask-list {
          .author {
            display: flex;
            align-items: center;
            height: 24px;
            margin-bottom: 8px;

            .elAvatar {
              min-height: 24px;
              min-width: 24px;
            }

            .name {
              margin-left: 8px;
              font-weight: 500;
              color: #323233;
            }
          }

          .desc {
            height: 22px;
            overflow: hidden;

            span {
              height: 22px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              color: #155bd4;
              line-height: 22px;
              margin-right: 11px;
            }
          }

          .action-wrap {
            position: relative;

            .right-action {
              position: absolute;
              right: 0;
              top: 0;
              display: flex;

              .act-list {
                color: #155bd4;

                .delete-wrap {
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
        }
      }

      .quest-wrap {
        min-height: 554px;
        overflow-y: auto;
        background: #ffffff;
        border-radius: 4px;
        padding: 20px;

        .doc-list {
          margin-bottom: 20px;

          .ask-list-top {
            display: flex;
            justify-content: space-between;
            line-height: 32px;

            .ask-list-left {
              // line-height: 32px;
              display: flex;
              justify-content: center;
              align-items: center;

              .elAvatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 1px solid #d3d2d9;
              }

              .name {
                margin: 0 12px 0 8px;
              }

              .time {
                margin-right: 8px;
              }

              .exigency {
                width: 36px;
                line-height: 20px;
                font-size: 12px;
                text-align: center;
                color: #f56c6c;
                border-radius: 2px 2px 2px 2px;
                border: 1px solid #f56c6c;
              }

              .importance {
                width: 36px;
                line-height: 20px;
                font-size: 12px;
                text-align: center;
                color: #e6a23c;
                border-radius: 2px 2px 2px 2px;
                border: 1px solid #e6a23c;
              }

              .normal {
                width: 36px;
                line-height: 20px;
                font-size: 12px;
                text-align: center;
                color: #909399;
                border-radius: 2px 2px 2px 2px;
                border: 1px solid #909399;
              }
            }

            .ask-list-right {
              display: flex;
              align-items: center;

              .imgColor {
                width: 14px;
                height: 14px;
                margin-right: 2px;
                color: #1366d1;
              }

              .author-myAnser-text {
                font-weight: 400;
                font-size: 16px;
                color: #1366d1;
                margin-left: 5px;
              }
            }
          }

          .ask-list-title {
            cursor: pointer;
            line-height: 26px;

            .ask-list-title-name {
              font-family: PingFang SC, PingFang SC;
              font-weight: 600;
              font-size: 16px;
              color: #000;
            }

            .ask-list-title-answerNum {
              font-size: 14px;
              height: 24px;
              padding: 0 10px;
              background-color: #e5f0db;
              font-weight: 500;
              margin-left: 10px;
              color: #155bd4;
            }

            .ask-list-title-answerUp {
              font-size: 14px;
              font-weight: 500;
              margin-left: 10px;
              color: #155bd4;
            }
          }

          .author {
            border-bottom: 2px solid #efefef;
            display: flex;

            .isRelated {
              height: 22px;
              font-size: 12px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              line-height: 22px;
            }

            span.time {
              margin-left: 13px;
              margin-right: 13px;
            }

            &-myAnser {
              margin-left: 13px;
              display: flex;
              align-items: center;

              &-text {
                color: #155bd4;
                cursor: pointer;
              }
            }

            &-elEdit {
              margin: 0 13px;
              display: flex;
              align-items: center;

              &-text {
                color: #155bd4;
                cursor: pointer;
              }
            }

            &-elDelete {
              display: flex;
              align-items: center;

              &-text {
                color: #155bd4;
                cursor: pointer;
              }
            }

            .imgColor {
              color: #155bd4;
            }

            .elStarFilled {
              cursor: pointer;
              display: flex;
              align-items: center;
              margin-left: 10px;

              &:hover {
                color: #155bd4;
              }
            }

            .elStarFilled1 {
              display: flex;
              align-items: center;
              cursor: pointer;
              color: red;
              margin-left: 10px;
            }

            .elShare {
              margin-left: 10px;
              cursor: pointer;
              display: flex;
              align-items: center;
            }
          }

          .bottomAnswer {
            margin-top: 8px;
            // border-bottom: 1px dashed #c3c3c3;
            padding-bottom: 10px;
            margin-left: 10px;
            position: relative;

            .titleTop {
              display: flex;
              align-items: center;

              .elAvatar {
                margin-right: 8px;
              }
            }

            span {
              height: 22px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              line-height: 22px;
            }

            span.time {
              margin-left: 13px;
              margin-right: 13px;
            }

            .contents {
              margin: 5px 20px 0 30px;
              height: 24px;
              line-height: 24px;

              .content-answer {
                position: absolute;
                left: -10px;
                display: inline-block;
                text-align: center;
                width: 26px;
                height: 22px;
                background: #e6effb;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                font-size: 14px;
                color: #1366d1;
                // line-height: 26px;
                border-radius: 8px 8px 0 8px;
                // padding: 3px;
                margin-right: 10px;
              }
            }
          }

          .up {
            // color: #155bd4;
            position: relative;
            top: 10px;
            // left: 50%;
            cursor: pointer;
            font-family: Source Sans 3, Source Sans 3;
            font-weight: 400;
            font-size: 14px;
            color: #6a696e;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .starComment {
            display: flex;
            margin: 15px 0 0 30px;
            padding-bottom: 15px;
            border-bottom: 2px dotted #c3c3c3;

            .elStarFilled {
              cursor: pointer;
              display: flex;
              align-items: center;

              &:hover {
                color: #155bd4;
              }
            }

            .elStarFilled1 {
              display: flex;
              align-items: center;
              cursor: pointer;
              color: red;
            }

            .elChatDotSquare {
              display: flex;
              align-items: center;
              cursor: pointer;
              height: 14px;
              margin-right: 17px;
            }
          }

          .commont {
            &-btn {
              margin-top: 5px;
            }
          }

          h3 {
            height: 22px;
            font-size: 16px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: bold;
            color: #323233;
            line-height: 22px;
            margin-bottom: 10px;
            display: inline-block;
            cursor: pointer;
          }

          h3:hover {
            color: #155bd4;
          }

          .desc {
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            color: #646566;
            line-height: 22px;
          }

          .action-wrap {
            display: flex;
            margin: 21px 0 20px 0;

            .act-list {
              display: flex;
              align-items: center;
              border-right: 1px solid #dcdee0;
              margin-right: 10px;
              height: 16px;

              &:last-child {
                border: none;
              }

              span {
                margin: 0 9px;
              }
            }

            .elChatDotSquare,
            .elConnection,
            .elEdit,
            .elDelete,
            .elStarFilled,
            .elShare {
              cursor: pointer;

              &:hover {
                color: #155bd4;
              }
            }

            .elStarFilled1 {
              cursor: pointer;
              color: red;

              &:hover {
                color: #155bd4;
              }
            }
          }
        }

        .ask-list {
          .author {
            display: flex;
            align-items: center;
            // height: 24px;
            padding-bottom: 15px;

            .elAvatar {
              min-height: 24px;
              min-width: 24px;
            }

            .name {
              margin-left: 8px;
              font-weight: 500;
              color: #323233;
            }
          }

          .desc {
            height: 22px;
            overflow: hidden;

            span {
              height: 22px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 500;
              color: #155bd4;
              line-height: 22px;
              margin-right: 11px;
            }
          }

          .action-wrap {
            position: relative;

            .right-action {
              position: absolute;
              right: 0;
              top: 0;
              display: flex;

              .act-list {
                color: #155bd4;

                .delete-wrap {
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
        }
      }

      :deep(.el-tabs__header) {
        height: 32px;
        border-bottom: none;
      }

      :deep(.el-tabs__nav-wrap) {
        height: 32px;
        margin: 0;
        padding-left: 20px;
      }

      :deep(.el-tabs__nav-scroll) {
        height: 32px;
        overflow: hidden;
      }

      :deep(.el-tabs__nav) {
        height: 32px;
        border: none;
      }

      :deep(.el-tabs__item) {
        width: 68px;
        height: 32px;
        background: #f2f5f7;
        border: 1px solid #ffffff;
        margin: 0 !important;
        padding: 0 !important;
        font-weight: 400;
        font-size: 14px;
        color: #6a696e;
      }

      :deep(.is-active) {
        font-weight: 600;
        font-size: 14px;
        color: #1366d1;
      }
    }
  }
}
</style>