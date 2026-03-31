<template>
  <div class="layout">
    <div class="main">
      <!-- 左边儿地图 -->
      <div class="mainCenter">
        <div v-if="detail.templateId === 1" class="totalFirst">
          <div class="mainCenterTop">
            <img class="mainCenterTopImg" :src="detail.templateUrl" alt="" />
            <div class="mainCenterTopTitle">{{ secongData.name }}</div>
            <a-tooltip :title="secongData.queryObj" placement="top" :mouse-enter-delay="0.5" :open="false">
              <div class="mainCenterTopQuery">{{ secongData.queryObj }}</div>
            </a-tooltip>
            <div class="mainCenterTopTotal">
              <div class="mainCenterTopSide" v-for="item in secongData.nodeList" :key="item.id">
                <a-tooltip :title="item.nodeName" placement="top" :mouse-enter-delay="0.5">
                  <div :class="item.color === true ? 'fontColor' : 'mainCenterTopSideText'" class="main—text" @click="getFileInfo(item)">{{ item.nodeName }}</div>
                </a-tooltip>
              </div>
            </div>
            <div v-if="detailData.length > 0">
              <div v-for="data in detailData" :key="data.id">
                <div v-if="data.location === 1">
                  <img class="imagesModal1" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile1" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis1">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 2">
                  <img class="imagesModal2" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile2" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis2">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 3">
                  <img class="imagesModal3" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile3" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis3">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 4">
                  <img class="imagesModal4" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile4" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis4">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 5">
                  <img class="imagesModal5" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile5" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis5">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 6">
                  <img class="imagesModal6" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile6" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis6">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 7">
                  <img class="imagesModal7" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile7" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis7">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 8">
                  <img class="imagesModal8" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile8" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis8">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 9">
                  <img class="imagesModal9" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile9" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis9">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 10">
                  <img class="imagesModal10" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile10" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFileDis10">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="detail.templateId === 2" class="totalSecond">
          <div class="mainCenterTop8">
            <img class="mainCenterTopImg8" :src="detail.templateUrl" alt="" />
            <div class="mainCenterTopTitle8">{{ secongData.name }}</div>
            <div class="mainCenterTopQuery8">{{ secongData.queryObj }}</div>
            <div class="mainCenterTopTotal8">
              <div class="mainCenterTopSide8" v-for="item in secongData.nodeList" :key="item.id">
                <div :class="item.color === true ? 'fontColor' : 'mainCenterTopSideText8'" @click="getFileInfo(item)">{{ item.nodeName }}</div>
              </div>
            </div>
            <div v-if="detailData.length > 0">
              <div v-for="data in detailData" :key="data.id">
                <div v-if="data.location === 1">
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile18" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopDis1">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 2">
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile28" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopDis2">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 3">
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile38" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopDis3">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 4">
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile48" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopDis4">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 5">
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile58" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopDis5">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 6">
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile68" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopDis6">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 7">
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile78" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopDis7">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 8">
                  <a-tooltip v-if="data.status === 1 || data.isNextOne === 1" :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopFile88" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                  <a-tooltip v-else :title="data.nodeName" placement="top" :mouse-enter-delay="0.5">
                    <div class="mainCenterTopDis8">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边儿树结构 -->
      <div class="mainRight">
        <div class="treeData" v-if="treeMapData.length > 0">
          <a-tree
            :tree-data="treeMapData"
            :field-names="{ children: 'children', title: 'nodeName', key: 'id' }"
            default-expand-all
            v-model:selected-keys="selectedKeys"
            @select="handleNodeClick"
          >
            <template #title="nodeData">
              <span>
                <i :class="getIconClass(nodeData.nodeLevel)" style="font-family: iconfont; margin-right: 5px; font-size: 14px;" />
                <span :style="{ color: nodeData.learnStatus === 1 && nodeData.nodeLevel === '3' ? '#008000' : '', fontWeight: 500 }">{{ nodeData.nodeName }}</span>
              </span>
            </template>
          </a-tree>
        </div>
      </div>
    </div>
    <a-button type="primary" class="goBack" @click="goBack">返回</a-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onActivated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { taskMapList, queryMapNodeList, queryMapTaskDetail, getPdfPreviewPath } from '@/api/knowledge';
import { useUserStore } from '@/store/modules/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const treeMapData = ref<any[]>([]);
const secongData = ref<any>({});
const filePath = ref('');
const detailData = ref<any[]>([]);
const detail = ref<any>({});
const pdfFlag = ref('1');
const selectedKeys = ref<string[]>([]);

const getIconClass = (nodeLevel: string) => {
  if (nodeLevel === '1') return 'iconfont icon-wenjianjia1';
  if (nodeLevel === '2') return 'iconfont icon-icon_classification';
  return 'iconfont icon-a-icon_model1';
};

onActivated(async () => {
  detail.value = JSON.parse(localStorage.getItem('detail') || '{}');
  await getTreeList();
  await getDataList();
  localStorage.removeItem('nodeId');
});

watch(
  route,
  (newVal) => {
    if (newVal.query.flag) {
      pdfFlag.value = newVal.query.flag as string;
    }
  },
  { deep: true, immediate: true }
);

// 数据树列表
const getTreeList = async () => {
  const params = {
    taskMapId: JSON.parse(localStorage.getItem('detail') || '{}').id,
    userId: userStore.getUser.id,
  };
  const res = await taskMapList(params);
  if (res && res.data.code === '0') {
    treeMapData.value = res.data.data;
    if (treeMapData.value.length > 0 && treeMapData.value[0].id) {
      selectedKeys.value = [treeMapData.value[0].id];
    }
  } else {
    message.error(res?.data?.msg || '获取树列表失败');
  }
};

const getFileInfo = async (data: any) => {
  localStorage.setItem('nodeId', data.nodeId);
  const params = {
    id: data?.nodeId,
    taskMapId: JSON.parse(localStorage.getItem('detail') || '{}').id || '',
    type: pdfFlag.value,
    userId: userStore.getUser.id,
  };
  const res = await queryMapTaskDetail(params);
  if (res && res.data.code === '0') {
    detailData.value = res.data.data.result;
  } else {
    message.error(res?.data?.msg || '获取详情失败');
  }
  secongData.value.nodeList?.forEach((v: any) => {
    v.color = v.nodeId === data?.nodeId;
  });
};

const getDataList = async () => {
  const params = {
    taskMapId: JSON.parse(localStorage.getItem('detail') || '{}').id || '',
  };
  const res = await queryMapNodeList(params);
  if (res && res.data.code === '0') {
    secongData.value = res.data.data;
    if (secongData.value.nodeList?.length === 1) {
      secongData.value.nodeList[0].color = true;
    } else {
      secongData.value.nodeList?.forEach((v: any, index: number) => {
        v.color = index === 0;
      });
    }
    await getFileInfo(secongData.value.nodeList[0]);
  } else {
    message.error(res?.data?.msg || '获取节点列表失败');
  }
};

const handleNodeClick = (_keys: any, { node }: any) => {
  console.log(node);
};

const viewPdf = async (item: any) => {
  const res = await getPdfPreviewPath({ id: item.fileId });
  if (res && res.data.code === '0') {
    filePath.value = res.data.data.fileUrl;
    router.push({ path: '/knowledgeData/pdfView_index', query: { docId: filePath.value, flag: pdfFlag.value } });
    pdfFlag.value = '1';
  } else {
    message.error(res?.data?.msg || '获取预览路径失败');
  }
};

const viewPdfFun = (item: any) => {
  viewPdf(item);
};

const goBack = () => {
  router.go(-1);
  pdfFlag.value = '1';
  localStorage.removeItem('nodeId');
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  margin: 0 0px;
  overflow: hidden;
  .main {
    display: flex;
    margin: 10px;
    height: 98%;
    overflow: auto;
    .mainCenter {
      width: 80%;
      height: 100%;
      overflow: auto;
      .totalFirst {
        overflow: auto;
        height: 100%;
        background-color: #1262a7;
        display: flex;
        justify-content: center;
        .mainCenterTop {
          width: 100%;
          position: relative;
          margin: 0 auto;
          .mainCenterTopImg {
            width: 100%;
            max-width: 1200px;
            min-width: 1200px;
            height: 610px;
          }
          .mainCenterTopTitle {
            font-size: 20px;
            color: #fff;
            position: absolute;
            top: 50px;
            left: 345px;
            width: 450px;
            text-align: center;
          }
          .mainCenterTopQuery {
            color: #fff;
            position: absolute;
            top: 159px;
            left: 150px;
            font-size: 16px;
            width: 100px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0 auto;
          }
          .mainCenterTopTotal {
            height: 125px;
            color: #fff;
            position: absolute;
            top: 215px;
            left: 145px;
            cursor: pointer;
            width: 126px;
            text-align: center;
            overflow: auto;
            .mainCenterTopSide {
              .fontColor {
                margin-top: 5px;
                cursor: pointer;
                color: #0400f2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                pointer-events: none;
              }
              .mainCenterTopSideText {
                margin-top: 5px;
                cursor: pointer;
              }
            }
          }
          .main—text {
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0 auto;
          }
          .imagesModal1 { width: 115px; position: absolute; top: 420px; left: 30px; }
          .mainCenterTopFile1 { color: #fff; position: absolute; top: 448px; left: 45px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis1 { color: #333; position: absolute; top: 448px; left: 45px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal2 { width: 115px; position: absolute; top: 250px; left: 150px; }
          .mainCenterTopFile2 { color: #fff; position: absolute; top: 277px; left: 170px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis2 { color: #333; position: absolute; top: 277px; left: 170px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal3 { width: 115px; position: absolute; top: 167px; left: 275px; }
          .mainCenterTopFile3 { color: #fff; position: absolute; top: 195px; left: 295px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis3 { color: #333; position: absolute; top: 195px; left: 295px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal4 { width: 115px; position: absolute; top: 337px; left: 338px; }
          .mainCenterTopFile4 { color: #fff; position: absolute; top: 365px; left: 355px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis4 { color: #333; position: absolute; top: 365px; left: 355px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal5 { width: 115px; position: absolute; top: 421px; left: 459px; }
          .mainCenterTopFile5 { color: #fff; position: absolute; top: 448px; left: 480px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis5 { color: #333; position: absolute; top: 448px; left: 480px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal6 { width: 115px; position: absolute; top: 251px; left: 520px; }
          .mainCenterTopFile6 { color: #fff; position: absolute; top: 280px; left: 540px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis6 { color: #333; position: absolute; top: 280px; left: 540px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal7 { width: 115px; position: absolute; top: 165px; left: 641px; }
          .mainCenterTopFile7 { color: #fff; position: absolute; top: 195px; left: 660px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis7 { color: #333; position: absolute; top: 195px; left: 660px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal8 { width: 115px; position: absolute; top: 338px; left: 700px; }
          .mainCenterTopFile8 { color: #fff; position: absolute; top: 365px; left: 720px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis8 { color: #333; position: absolute; top: 365px; left: 720px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal9 { width: 115px; position: absolute; top: 421px; left: 823px; }
          .mainCenterTopFile9 { color: #fff; position: absolute; top: 448px; left: 840px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis9 { color: #333; position: absolute; top: 448px; left: 840px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .imagesModal10 { width: 115px; position: absolute; top: 165px; left: 945px; }
          .mainCenterTopFile10 { color: #fff; position: absolute; top: 195px; left: 965px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
          .mainCenterTopFileDis10 { color: #333; position: absolute; top: 195px; left: 965px; font-size: 14px; cursor: pointer; width: 85px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
        }
      }
      .totalSecond {
        overflow: auto;
        height: 100%;
        background-color: #c9ddf8;
        display: flex;
        justify-content: center;
        .mainCenterTop8 {
          width: 100%;
          position: relative;
          .mainCenterTopImg8 { width: 100%; max-width: 1200px; min-width: 1200px; height: 610px; }
          .mainCenterTopTitle8 { font-size: 24px; color: #176dfc; position: absolute; top: 30px; text-align: center; width: 1200px; }
          .mainCenterTopQuery8 { color: #fff; position: absolute; top: 163px; left: 60px; font-size: 16px; width: 90px; text-align: center; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
          .mainCenterTopTotal8 { height: 125px; color: #f78e41; position: absolute; top: 210px; left: 58px; width: 92px; text-align: center; cursor: pointer; overflow: auto; white-space: nowrap; text-overflow: ellipsis; pointer-events: none;
            .mainCenterTopSide8 {
              .fontColor { margin-top: 5px; cursor: pointer; color: #176dfc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
              .mainCenterTopSideText8 { margin-top: 5px; width: 92px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
            }
          }
          .mainCenterTopFile18 { color: green; position: absolute; top: 475px; left: 165px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
          .mainCenterTopDis1 { color: #176dfc; position: absolute; top: 475px; left: 165px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-weight: 600; }
          .mainCenterTopFile28 { color: green; position: absolute; top: 150px; left: 200px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
          .mainCenterTopDis2 { color: #176dfc; position: absolute; top: 150px; left: 200px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-weight: 600; }
          .mainCenterTopFile38 { color: green; position: absolute; top: 140px; left: 675px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
          .mainCenterTopDis3 { color: #176dfc; position: absolute; top: 140px; left: 675px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-weight: 600; }
          .mainCenterTopFile48 { color: green; position: absolute; top: 155px; left: 890px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
          .mainCenterTopDis4 { color: #176dfc; position: absolute; top: 155px; left: 890px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-weight: 600; }
          .mainCenterTopFile58 { color: green; position: absolute; top: 490px; left: 550px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
          .mainCenterTopDis5 { color: #176dfc; position: absolute; top: 490px; left: 550px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-weight: 600; }
          .mainCenterTopFile68 { color: green; position: absolute; top: 300px; left: 430px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
          .mainCenterTopDis6 { color: #176dfc; position: absolute; top: 300px; left: 430px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-weight: 600; }
          .mainCenterTopFile78 { color: green; position: absolute; top: 290px; left: 640px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
          .mainCenterTopDis7 { color: #176dfc; position: absolute; top: 290px; left: 640px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-weight: 600; }
          .mainCenterTopFile88 { color: green; position: absolute; top: 380px; left: 980px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
          .mainCenterTopDis8 { color: #176dfc; position: absolute; top: 380px; left: 980px; font-size: 14px; cursor: pointer; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-weight: 600; }
        }
      }
    }
    .mainRight {
      width: 20%;
      padding: 10px;
      min-height: 100%;
      background-color: #fff;
      margin-left: 10px;
      overflow-x: auto;
      overflow-y: hidden;
      .treeData {
        width: 700px;
        overflow-x: auto;
        overflow-y: hidden;
        height: 100%;
        :deep(.ant-tree-node-content-wrapper) {
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
  .goBack {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 100%;
  }
}
</style>
