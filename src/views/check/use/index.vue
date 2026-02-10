<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemCheckFlowInfoApi } from '@/api/tags/check/计算流程后台';
import Tree from '@/components/tree/checkTree.vue';
import { findNodeByIdFromKey } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Select from './components/select.vue';
const currentNodeLevel = ref<number>();
// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const selectNodeKeys = ref<string>('');
const loadingTree = ref<boolean>(false);
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
const categoryId = ref<string>('');
const imageArr = ref<any>([]);
const pageName = ref<string>('');
const modelHeightContent = ref<any>(500);

function imgSrc() {
  return new URL(`@/assets/images/noimg.jpg`, import.meta.url).href;
}
/**
 * 获取图片区域高度
 */
const getWindowHeight = () => {
  modelHeightContent.value = 'calc(' + 100 + 'vh - 225px)';
};
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    let data: any = {};
    data.productType = '17';
    data.toolType = '1';
    const res = await AdminApiSystemCheckFlowInfoApi.checkGetAllCheckTreeData(data);
    console.log(res);
    // 处理返回的数据格式
    if (res.data.code == 200 && res.data.data) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      dataSource.value = rawData;
      const treeNodes = convertToTreeNodes(rawData);
      treeData.value = treeNodes;
      // 默认选中第一个节点
      if (treeNodes.length > 0) {
        // 侦听器监听选中节点
        selectedKeys.value = '';
        nextTick(() => {
          if (type) {
            if (currentNode.value.key) {
              let rootNode = findNodeByIdFromKey(treeData.value, currentNode.value.key, 'key');
              selectNode(rootNode);
            }
          } else {
            selectedKeys.value = treeNodes[0].key;
            expandedKeys.value = treeNodes[0].key;
            selectNode(treeNodes[0]);
            getPic();
          }
        });
      }
    }
  } catch (error) {
    console.error('获取树数据失败:', error);
    message.error('获取数据失败');
  } finally {
    loadingTree.value = false;
  }
}

async function getPic() {
  let data: any = {
    pageNum: 1,
    pageSize: 20000,
    productType: '17',
    proname: pageName.value,
    toolType: '1',
  };
  const res = await AdminApiSystemCheckFlowInfoApi.checkGetAllActDesignData(data);
  imageArr.value = res?.data?.data?.records ?? [];
}

async function czPic() {
  pageName.value = '';
  getPic();
}

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  return data.map(item => {
    // 判断是否为根节点：pid不存在、为0或为空字符串通常表示根节点
    const isRootNode = item.parentId === 0;
    // 判断是否有子节点
    const hasChildren = item.childrenList && Array.isArray(item.childrenList) && item.childrenList.length > 0;

    // 根据规则设置level值
    let level = 3; // 默认值为3（没有子节点的情况）
    if (isRootNode) {
      level = 1; // 根节点level为1
    } else if (hasChildren) {
      level = 2; // 有子节点的非根节点level为2
    }
    return {
      level: level,
      key: item.nodeId?.toString() || item.tid?.toString() || '',
      partName: item.nodeName,
      type: 'category', // 对于产品平台管理，所有节点都视为分类节点
      parentId: item.nodeParentId,
      children: hasChildren ? convertToTreeNodes(item.childrenList) : [],
      id: item.nodeId,
      toolType: item.toolType,
      isActDesignPd: item.isActDesignPd,
      proId: item.proId,
      proname: item.proname,
      version: item.version,
      createTime: item.createTime,
      coverImagePath: item.coverImagePath,
      coverImageName: item.coverImageName,
    };
  });
}

/** 处理搜索功能 */
async function handleChangeSelectKey(searchValue: string, languageSel: string) {
  // 当搜索值为空时，显示完整树结构
  if (!searchValue) {
    // 重新获取数据
    await getListData();
    return;
  }

  // 根据搜索值过滤树节点
  const filteredData = filterTreeNodes(dataSource.value, searchValue);
  console.log(filteredData);
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;
}

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  return nodes
    .map(node => {
      // 检查当前节点是否匹配搜索值
      const isMatch = node.nodeName && node.nodeName.toLowerCase().includes(searchValue.toLowerCase());

      // 递归检查子节点
      let matchingChildren = [];
      if (node.childrenList && node.childrenList.length > 0) {
        matchingChildren = filterTreeNodes(node.childrenList, searchValue);
      }

      // 如果当前节点匹配或有匹配的子节点，则保留该节点
      if (isMatch || matchingChildren.length > 0) {
        return {
          ...node,
          childrenList: matchingChildren,
        };
      }
      return null;
    })
    .filter(Boolean); // 过滤掉null值
}
const formKeyData = ref<any>([]);
const hidden = ref(true);
const showHide = ref(false);
const currentNode = ref();
const auditId = ref<string>('');
async function selectNode(node: any) {
  imageArr.value = [];
  currentNode.value = node;
  currentNodeLevel.value = node.level;
  auditId.value = node.key;
  selectNodeKeys.value = node.key;
  categoryId.value = node.key;
  if (node.isActDesignPd === '3') {
    hidden.value = false;
    showHide.value = true;
    getProId(node);
  } else {
    if (node.isActDesignPd === '1') {
      hidden.value = true;
      showHide.value = false;
    } else {
      getPic();
      hidden.value = true;
      showHide.value = false;
    }
  }
  // 收集图片集合
  if (node.children && node.children.length > 0) {
    node.children.forEach((v: any) => {
      if (v.proId && v.proId !== null) {
        imageArr.value.push(v);
      }
      if (v.children && v.children.length > 0) {
        // 递归找到需要的图片
        recursion(v.children);
      }
    });
  }
}

const recursion = (data: any) => {
  // 递归找到需要的图片（只收集有 proId 的节点）
  data.forEach((v: any) => {
    if (v.proId != null) {
      imageArr.value.push(v);
    }
    if (v.children?.length) {
      recursion(v.children);
    }
  });
};

// 图片
const imgList = ref({});
async function getProId(item: any) {
  hidden.value = false;
  showHide.value = true;
  imgList.value = item;
  let data: any = {
    processDefinitionId: item.proId,
  };
  const res = await AdminApiSystemCheckFlowInfoApi.allTasksForDefinitionProcess(data);
  formKeyData.value = [];
  const list = res?.data?.data;
  if (Array.isArray(list)) {
    list.forEach((v: any) => {
      formKeyData.value.push(v.formKey);
    });
  }
}

async function backFun() {
  selectedKeys.value = selectNodeKeys.value;
  hidden.value = true;
  showHide.value = false;
}

onMounted(() => {
  getListData();
  getWindowHeight();
});
</script>

<template>
  <div class="drawerContent" v-if="hidden">
    <!-- 左侧树结构 -->
    <Splitpanes class="default-theme sbom">
      <Pane min-size="15" :size="20" class="splitpane-cls marginstyle">
        <a-spin :spinning="loadingTree" tip="加载中...">
          <Tree
            ref="treePage"
            :operate-flag="false"
            :tree-data="treeData"
            bomType="unBom"
            :selected-keys="selectedKeys"
            :expanded-keys="expandedKeys"
            :current-node="currentNode"
            @select-node="selectNode"
            @change-select-key="handleChangeSelectKey" />
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <div class="calclationCheck-splitPane">
          <div class="calclationCheck-splitPane-search">
            <a-form class="calclationCheck-splitPane-search-form">
              <a-form-item>
                <a-input v-model:value="pageName" style="width: 220px" placeholder="请输入关键字搜索" />
              </a-form-item>
            </a-form>
            <a-button class="calclationCheck-splitPane-search-btn" type="primary" @click="getPic">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              查询
            </a-button>
            <a-button class="calclationCheck-splitPane-search-btn" @click="czPic">
              <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
              重置
            </a-button>
          </div>
          <div :style="'height:' + modelHeightContent" class="calclationCheck-content">
            <div class="calculateItem" v-for="(item, index) in imageArr" :key="item.proId ?? item.key ?? item.id ?? index" @click="getProId(item)">
              <div class="Img-box">
                <img v-if="item.coverImagePath" class="calclationCheckImg" :src="item.coverImagePath" alt="" />
                <img v-if="!item.coverImagePath" :src="imgSrc()" alt="" />
              </div>
              <div class="calclation-content">
                <h3>{{ item.proname }}</h3>
                <div style="display: flex; justify-content: space-between; height: 40px">
                  <div class="vserion">
                    <span>
                      <EpcIcon type="icon-xiangqingon" style="font-size: 16px" class="infoFilled-ico" />
                    </span>
                    <span class="iconText">V{{ item.version == undefined ? 1 : item.version }}.0</span>
                  </div>
                  <div style="margin-left: 70px" v-if="item.createTime != undefined">
                    <span class="iconText">王文华</span>
                  </div>
                  <div class="time" v-if="item.createTime != undefined">
                    <span class="iconText">{{ item.createTime.split(' ')[0] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Pane>
    </Splitpanes>
  </div>
  <Select ref="selectPage" :showHide="showHide" :imgList="imgList" :formKeyData="formKeyData" @OnBackFun="backFun"></Select>
</template>

<style lang="less" scoped>
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
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  display: flex;
  background-color: #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
.tab-container {
  height: calc(100vh - 150px);
}
//表格里的适用阶段样式
.status-tags {
  span {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 12px;
    color: #6a696e;
    line-height: 12px;
    font-style: normal;
    text-transform: none;
    min-width: 64px;
    height: 20px;
    background: #eaeaf1;
    border-radius: 13px 13px 13px 13px;
    text-align: center;
    padding: 4px 8px;
    margin-right: 4px;
  }
}

.calclationCheck {
  background-color: #fff;
  height: 100%;
  border: 1px solid #dcdee2;

  &-splitPane {
    height: calc(100vh - 10px);
    margin: 20px 0px 0px 20px;

    &-search {
      display: flex;
      height: 35px;

      &-btn {
        margin-left: 20px;
      }
    }

    &-content {
      width: 100%;
      height: calc(100vh - 20px);
      display: flex;
      overflow: auto;
      flex-wrap: wrap;
      margin-top: 5px;

      &-outer {
        position: relative;
        width: 280px;
        height: 280px;
        margin-right: 20px;
        margin-top: 20px;
      }

      &-shadow {
        position: absolute;
        top: 0px;
        left: 0;
        background: rgba(0, 0, 0, 0.2);
        width: 280px;
        height: 240px;
      }

      &-img {
        width: 280px;
        height: 240px;
        background: rgba(51, 55, 82, 0.7);
      }

      &-desc {
        width: 280px;
        background-color: #fff;
        line-height: 40px;
        text-align: center;
        color: #222222;
        margin-top: -6px;
        box-shadow: 0px 1px 4px rgba(21, 34, 50, 0.08);
      }
    }

    &-pagetion {
      margin-top: 20px;
      margin-right: 20px;
      display: flex;
      justify-content: flex-end;
    }

    &-center {
      height: calc(100vh - 24px);
      display: flex;
      background-color: #fff;

      &-steps {
        width: 20%;
        margin: 20px 0px 0px 20px;
        cursor: pointer;
      }

      &-divider {
        width: 10px;
        background-color: #f7f8fa;
        height: 100vh;
      }

      &-right {
        width: 100%;

        &-name {
          margin-top: 30px;
        }

        &-result {
          margin-top: 20px;
        }

        &-topLine {
          height: 2px;
          margin: 10px 0px;
        }

        &-input {
          display: flex;
          flex-wrap: wrap;
        }

        &-botLine {
          height: 2px;
          margin: 10px 0px;
        }
      }

      &-form {
        margin: 20px 0px 0px 20px;
        width: 80%;
        height: 32px;
        display: flex;

        &-btn {
          margin-left: 20px;
        }
      }
    }
  }

  &-tree {
    height: calc(100vh - 15px);
    margin: 20px 10px 0 10px;
    overflow-y: auto;
  }

  .changInput {
    border: 1px solid #dcdfe6;
    color: #606266;
    margin-top: 5px;
    margin-bottom: 30px;
    height: 32px;
    border-radius: 4px;
    padding-left: 10px;
  }

  .changInput:focus {
    outline: 1px solid #1971ff !important;
  }

  // ::-webkit-scrollbar {
  //   // display: none
  // }
}

.calclationCheck-splitPane-content-desc {
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 0 0 10px 10px;
  border: 1px solid #ebeef5;
}

.calclationCheck-content {
  align-content: flex-start;
  width: 100%;
  display: flex;
  overflow: auto;
  flex-wrap: wrap;
  margin-top: 5px;
  padding-top: 18px;
  cursor: pointer;
}

.calclationCheck-splitPane-content-shadow,
.calclationCheck-splitPane-content-img {
  border-radius: 10px 10px 0 0;
}
.calculateItem {
  position: relative;
  // width: 21.8%;
  width: 256px;
  float: left;
  margin-bottom: 25px;
  margin-right: 25px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: block;
  background: #cbdcf5;
  box-shadow: 0 0 15px 6px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  text-decoration: none;
  outline: 0;
}
.calculateItem:hover {
  transform: translateY(-10px);
  background: #1971ff;
  color: #fff;
  .vserion,
  .time {
    color: #fff;
  }

  .calclation-content {
    h3 {
      color: #fff;
    }
  }

  .imgItemHover {
    display: inline;
  }

  .imgItem {
    display: none;
  }
}

.Img-box {
  position: relative;
  display: block;
  width: 100%;
  height: 192px;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
  img {
    width: 100%;
    height: 100%;
  }
}

.iconText {
  margin-left: 5px;
}
.infoFilled-ico {
  color: #1971ff;
  font-size: 18px;
  cursor: pointer;
}
</style>
