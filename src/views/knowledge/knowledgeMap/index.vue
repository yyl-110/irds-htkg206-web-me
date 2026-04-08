<script setup lang="ts">
import {
  fileList,
  getEchartsDataByTypel,
  getNodeByLevel,
} from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
import { INodeByLevel } from "../types";
import { options, optionsOne, optionsTwo } from "./data";
import RelationGraph from "relation-graph-vue3";
import fileDrawer from "../components/fileDrawer.vue";
import { a } from "vitest/dist/chunks/suite.CcK46U-P";
import { SearchOutlined } from "@ant-design/icons-vue";

const userStore = useUserStore();

const searchData = ref(""); // 搜索
const searchKey = ref(""); // 搜索

const mapLocationTabs = ref<INodeByLevel[]>([]);
const documentList = ref([]);
const tabIndex = ref(1);
const currentTreeId = ref();
const drawer = ref(false);

const graphRef = ref("");
const graphRefOne = ref("");
const graphRefTwo = ref("");
const drawerRef = ref(null);

const colorss = ref(["#326FFE", "#F4BD3F", "#43AAE4", "#1ECFB9", "#F95669"]);

// 文档id
const docId = ref("");

// 所有选中子节点的id
const childsNode = ref([]);

const onSearch = (value: string) => {
  initTree();
};

const mapLocationFun = (item: INodeByLevel) => {
  graphInit(item);
  mapLocationTabs.value.forEach((v) => {
    if (v.id === item.id) {
      v.isCurrent = true;
    } else {
      v.isCurrent = false;
    }
  });
};

// 递归获取所有子节点
const cureionNode = (data) => {
  // childsNode.value = [];
  data.forEach((v) => {
    childsNode.value.push(v.id);
    if (v.lot.childs && v.lot.childs.length > 0) {
      cureionNode(v.lot.childs);
    }
  });
};

// 点击关系图节点
const onNodeClick = (nodeObject, $even) => {
  currentTreeId.value = nodeObject.id;
  const { lot } = nodeObject;
  childsNode.value = [];
  if (lot.childs && lot.childs.length > 0) {
    lot.childs.forEach((v) => {
      if (v.lot.childs && v.lot.childs.length > 0) {
        cureionNode(v.lot.childs);
        childsNode.value.push(v.id);
      } else {
        childsNode.value.push(v.id);
      }
    });
  }
  if (currentTreeId.value) {
    childsNode.value.push(currentTreeId.value);
  }
  childsNode.value = [...new Set(childsNode.value)];

  const params = {
    kldTreeId: childsNode.value.toString() || "", // 机构id和子机构id
    userId: userStore.getUser.id, //
  };
  // 打开抽屉
  drawerRef.value.openDrawer(params);
};

const initData = () => {
  if (currentTreeId.value) {
    childsNode.value.push(currentTreeId.value);
  }
  childsNode.value = [...new Set(childsNode.value)];
  const params = {
    kldTreeId: childsNode.value.toString() || "", //机构id和子机构id
    userId: userStore.getUser.id, //
  };
  fileList(params).then((res) => {
    if (res.data && res.data.code === "0") {
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
    nodeLevel: "2",
    nodeName: searchData.value,
  };
  getNodeByLevel(params).then((res) => {
    if (res?.data && res.data.code === "0") {
      mapLocationTabs.value = [];
      mapLocationTabs.value = res.data.data.result;
      if (mapLocationTabs.value.length > 0) {
        mapLocationTabs.value.map((v) => {
          v.isCurrent = false;
        });
      }
      // initialize.value = mapLocationTabs.value[0].id;
      console.log("mapLocationTabs:", mapLocationTabs.value);
      graphInit(mapLocationTabs.value[0]);
      mapLocationTabs.value[0].isCurrent = true;
    }
  });
};

// 展示节点图
const graphInit = (item) => {
  const params = {
    menuId: 45,
    menuParentId: 15,
    treeType: 2,
    treeId: item.id, //所选节点tree id
    taggingId: "", //图标展示类型，tree里有 目前数据格式都一样传不传无所谓
  };
  getEchartsDataByTypel(params).then((res) => {
    if (res && res.data.code === "0") {
      if (item.style === "1" || !item.style) {
        tabIndex.value = 1;
        const jsonData = {
          rootId: res.data.data.result.rootId,
          nodes: res.data.data.result.nodes || [],
          lines: res.data.data.result.lines || [],
        };
        graphRef.value.setJsonData(jsonData);
      } else if (item.style === "2") {
        tabIndex.value = 2;
        const jsonDataOne = {
          rootId: res.data.data.result.rootId,
          nodes: res.data.data.result.nodes || [],
          lines: res.data.data.result.lines || [],
        };
        graphRefOne.value.setJsonData(jsonDataOne);
      } else if (item.style === "3") {
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
});
</script>

<template>
  <div class="knowledgeMap h-full">
    <a-row>
      <a-col :span="6" style="border-right: 1px solid #EAEAF1" class="pr-[16px]">
        <div class="searchAll mb-[16px]">
          <a-input-search
            v-model:value="searchData"
            placeholder="请输入标题或作者搜索"
            @search="onSearch"
          >
            <template #enterButton>
              <div class="flex items-center">
                <SearchOutlined />
                <span class="ml-[4px]">搜索</span>
              </div>
            </template>
          </a-input-search>
        </div>
        <div
          class="pic-list"
          :class="item.isCurrent ? 'current-pic-list' : ''"
          v-for="(item, index) in mapLocationTabs"
          :key="index"
          @click="mapLocationFun(item)"
        >
          <a-avatar
            class="elava"
            :style="{
              backgroundColor:
                colorss[Math.floor(Math.random() * colorss.length)],
            }"
            :size="36"
            >{{ item.nodeName[0] }}</a-avatar
          >
          <a-tooltip
            v-if="item.nodeName && item.nodeName.length >= 9"
            class="box-item"
            placement="right"
          >
            <template #title>{{ item.nodeName }}</template>
            <div class="uname">{{ item.nodeName }}</div>
          </a-tooltip>
          <div v-else class="uname">{{ item.nodeName }}</div>
        </div>
      </a-col>
      <a-col :span="18">
        <div class="content">
          <div class="map-wrap">
            <relation-graph
              class="rac"
              ref="graphRef"
              :options="options"
              v-show="tabIndex === 1"
              :on-node-click="onNodeClick"
            />
            <relation-graph
              class="avitive"
              ref="graphRefOne"
              :options="optionsOne"
              v-show="tabIndex === 2"
              :on-node-click="onNodeClick"
            />
            <RelationGraph
              class="avitive"
              ref="graphRefTwo"
              :options="optionsTwo"
              v-show="tabIndex === 3"
              :on-node-click="onNodeClick"
            />
          </div>
        </div>
      </a-col>
    </a-row>
    <file-drawer ref="drawerRef" />
  </div>
</template>

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

  .current-pic-list {
    // .elava {
    //   background: #155bd4;
    // }
    width: 100%;
    height: 60px;
    background: #e6effb;
    border-radius: 4px 4px 4px 4px;
  }

  .content {
    position: relative;
    background-color: #f7f8fa;
    height: ~"calc(100vh - 224px)";

    .map-wrap {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
    }
  }
}

:deep(.avitive .rel-node-peel-checked) {
  // width: 150px !important;
  overflow: hidden;
  /* 隐藏超出部分 */
  min-height: 40px;
  height: auto !important;
}

:deep(.avitive .c-node-text) {
  width: 150px !important;
  overflow: hidden;
  /* 隐藏超出部分 */
  // justify-content: flex-start;
}

:deep(.avitive .rel-node) {
  min-height: 40px;
  height: auto !important;
  overflow: hidden;
  display: flex;
  align-items: center;
}
</style>
