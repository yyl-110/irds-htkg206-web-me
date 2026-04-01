<template>

<div class="centerSearch">
    <div v-dragModal>
      <a-modal :maskClosable="false" class="layout" :visible="addDataDialogVisible" title="添加数据" width="70%" @cancel="handleClose">
        <div class="elMain">
        <!-- <div class="top-header">
          <div class="search-wrap">
            <input v-model="keyWord" placeholder="输入关键字进行搜索" class="input-with-select" />
            <el-button class="btn" @click="searchData">
              <el-icon class="elIcon"><Search /></el-icon>
              搜索
            </el-button>
          </div>
        </div> -->
        <div class="content">
          <a-tabs v-model:activeKey="activeName" class="elTabs" @change="handleTabChange">
            <a-tab-pane tab="文档" key="doc">
              <searchTag
                :elTagcheckedOneData="elTagcheckedOneData"
                :claListWidthOne="claListWidthOne"
                :claListWidthTwo="claListWidthTwo"
                :hiddenStatus="hiddenStatus"
                :elTagcheckedOneStatus="elTagcheckedOneStatus"
                :elTagcheckedTwoStatus="elTagcheckedTwoStatus"
                :elTagcheckedTwoData="elTagcheckedTwoData"
                @onChangeElCheckTagOne="onChangeElCheckTagOne"
                @onChangeElCheckTagTwo="onChangeElCheckTagTwo"
                @onOffFun="onOffFun"></searchTag>
              <div class="doc-wrap">
                <div class="doc-list" v-for="(item, index) in documentList" :key="item.content?.id || index">
                  <a-checkbox v-model:checked="item.content.isSelected" @change="e => getChangeBox(e.target.checked, item.content)">
                    <h3 class="highlightName" @click="viewPdfFun(item)">{{ item.content.fileName }}.{{ item.content.fileType }}</h3>
                  </a-checkbox>
                  <div class="desc">{{ item.content.summary }}</div>
                  <div class="author">
                    <span class="name">{{ item.content.userName }}</span
                    ><span class="time">{{ getTimes(Date.parse(item.content.addTime)) || '' }}</span>
                  </div>
                  <div class="action-wrap">
                    <div class="act-list">
                      <EyeOutlined /><span>{{ JSON.parse(item.content.counting).previewed }}</span>
                    </div>
                    <div class="act-list elChatDotSquare" @click="commentFun(item)">
                      <MessageOutlined /><span>{{ JSON.parse(item.content.counting).commented }}</span>
                    </div>
                    <div v-if="!item.content?.lightCollected" class="act-list elStarFilled" @click="followFun(item)">
                      <StarFilled /><span>{{ JSON.parse(item.content.counting).collectd }}</span>
                    </div>
                    <div v-else class="act-list elStarFilled1" @click="followFun(item)">
                      <StarFilled /><span>{{ JSON.parse(item.content.counting).collectd }}</span>
                    </div>
                    <div class="act-list elShare" @click="shareFun(item)">
                      <ShareAltOutlined /><span>{{ JSON.parse(item.content.counting).shared }}</span>
                    </div>
                    <div v-if="item.content.allowDownload !== '1'" class="act-list elShare" @click="downFun(item)">
                      <DownloadOutlined /><span>{{ JSON.parse(item.content.counting).downloaded }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane v-if="props.numberFlag !== 1" tab="问答" key="ask">
              <searchTag
                :elTagcheckedOneData="elTagcheckedOneData"
                :claListWidthOne="claListWidthOne"
                :claListWidthTwo="claListWidthTwo"
                :hiddenStatus="hiddenStatus"
                :elTagcheckedOneStatus="elTagcheckedOneStatus"
                :elTagcheckedTwoStatus="elTagcheckedTwoStatus"
                :elTagcheckedTwoData="elTagcheckedTwoData"
                @onChangeElCheckTagOne="onChangeElCheckTagOne"
                @onChangeElCheckTagTwo="onChangeElCheckTagTwo"
                @onOffFun="onOffFun"></searchTag>
              <div class="quest-wrap">
                <div class="doc-list ask-list" v-for="(allQues, index) in documentList" :key="allQues.content?.id || index">
                  <a-checkbox
                    v-if="allQues.highlightFields?.description && allQues.highlightFields?.description.length > 0"
                    v-model:checked="allQues.highlightFields.content.isSelected"
                    @change="e => getChangeBox(e.target.checked, allQues.highlightFields)">
                    <h3 v-html="allQues.highlightFields?.description[0]" class="highlightName" @click="changeHideFlag(allQues.content)"></h3>
                  </a-checkbox>
                  <a-checkbox v-else v-model:checked="allQues.content.isSelected" @change="e => getChangeBox(e.target.checked, allQues.content)">
                    <h3 class="highlightName" @click="changeHideFlag(allQues.content)">
                      {{ allQues.content.description }}
                    </h3>
                  </a-checkbox>

                  <span v-if="allQues.content.urgency === '紧急'" class="status exigency">{{ allQues.content.urgency }}</span
                  ><span v-if="allQues.content.urgency === '重要'" class="status importance">{{ allQues.content.urgency }}</span
                  ><span v-if="allQues.content.urgency === '一般'" class="status normal">{{ allQues.content.urgency }}</span>
                  <div class="author">
                    <a-avatar class="elAvatar" :size="24" /><span class="name">{{ allQues.content.userName }}</span
                    ><span class="time">{{ getTimes(Date.parse(allQues.content.addTime)) }}</span>
                    <span class="isRelated">{{ allQues.content.isRelated === 1 ? '未关联' : '已关联' }}</span>
                    <div v-if="!allQues.content.interestLight" class="elStarFilled" @click="starFun(allQues.content)">
                      <StarOutlined />
                    </div>
                    <div v-else class="elStarFilled1" @click="starFun(allQues.content)">
                      <StarOutlined />
                    </div>
                    <div class="act-list elShare" @click="shareFun(allQues)">
                      <ShareAltOutlined /><span>{{ 0 }}</span>
                    </div>
                    <span v-if="!allQues.content.hideAnswerButton" class="author-myAnser" @click="myAnswerFun(allQues.content)">
                      <EditOutlined class="imgColor" /><span class="author-myAnser-text">我来回答</span>
                    </span>
                  </div>
                  <div class="commont" v-if="hideAnswer && allQues.content.replay === true">
                    <a-textarea v-model:value="answer" />
                    <a-button class="commont-btn" type="primary" @click="confirmAnswer">确定</a-button>
                  </div>
                  <div v-if="hideFlag && allQues.content.hidden === true && allQues.content.answer.length > 0">
                    <div class="bottomAnswer" v-for="(myAnser, index) in allQues.content.answer" :key="myAnser.id">
                      <div class="titleTop">
                        <a-avatar class="elAvatar" :size="24" /><span class="name">{{ myAnser.userName }}</span
                        ><span class="time">{{ getTimes(Date.parse(myAnser.addTime)) }}</span>
                      </div>
                      <div class="content"><span>回答：</span> {{ myAnser.content }}</div>
                      <div class="starComment">
                        <div class="elChatDotSquare" @click="commentQuestFun(myAnser)">
                          <MessageOutlined /><span>{{ myAnser.discussNum }}</span>
                        </div>
                      </div>
                    </div>
                    <span class="up" @click="upData">向上收起</span>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane v-if="props.numberFlag !== 1" tab="视频" key="video">
              <searchTag
                :elTagcheckedOneData="elTagcheckedOneData"
                :claListWidthOne="claListWidthOne"
                :claListWidthTwo="claListWidthTwo"
                :hiddenStatus="hiddenStatus"
                :elTagcheckedOneStatus="elTagcheckedOneStatus"
                :elTagcheckedTwoStatus="elTagcheckedTwoStatus"
                :elTagcheckedTwoData="elTagcheckedTwoData"
                @onChangeElCheckTagOne="onChangeElCheckTagOne"
                @onChangeElCheckTagTwo="onChangeElCheckTagTwo"
                @onOffFun="onOffFun"></searchTag>
              <div class="video-wrap">
                <div class="doc-list" v-for="(item, index) in documentList" :key="item.content?.id || index">
                  <video :src="item.content.fileUrl" width="500" height="260" controls></video>
                  <div class="video-wrap-title" style="display: flex">
                    <a-checkbox v-model:checked="item.content.isSelected" @change="e => getChangeBox(e.target.checked, item.content)">
                      <a-tooltip :mouseEnterDelay="0.5" :title="item.content.fileName + '' + item.content.fileType" placement="top">
                        <h3 class="fontHide" @click="viewPdfFun(item)">{{ item.content.fileName }}.{{ item.content.fileType }}</h3>
                      </a-tooltip>
                    </a-checkbox>
                    <div class="video-wrap-title-right">
                      <span class="play">{{ JSON.parse(item.content.counting).previewed }}次播放</span>
                      <div v-if="!item.content?.lightCollected" class="act-list elStarFilled" @click="followFun(item)">
                        <StarFilled /><span>{{ JSON.parse(item.content.counting).collectd }}</span>
                      </div>
                      <div v-else class="act-list elStarFilled1" @click="followFun(item)">
                        <StarFilled /><span>{{ JSON.parse(item.content.counting).collectd }}</span>
                      </div>
                      <div class="act-list elShare" @click="shareFun(item)">
                        <ShareAltOutlined /><span>{{ JSON.parse(item.content.counting).shared }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="author" style="display: flex">
                    <div>
                      <span class="name">{{ item.content.userName }}</span>
                      <span class="time">{{ getTimes(Date.parse(item.content.addTime)) || '' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane v-if="props.numberFlag !== 1" tab="图片" key="pic">
              <searchTag
                :elTagcheckedOneData="elTagcheckedOneData"
                :claListWidthOne="claListWidthOne"
                :claListWidthTwo="claListWidthTwo"
                :hiddenStatus="hiddenStatus"
                :elTagcheckedOneStatus="elTagcheckedOneStatus"
                :elTagcheckedTwoStatus="elTagcheckedTwoStatus"
                :elTagcheckedTwoData="elTagcheckedTwoData"
                @onChangeElCheckTagOne="onChangeElCheckTagOne"
                @onChangeElCheckTagTwo="onChangeElCheckTagTwo"
                @onOffFun="onOffFun"></searchTag>
              <div class="img-wrap">
                <div class="doc-list" v-for="(item, index) in documentList" :key="item.content?.id || index">
                  <img style="width: 450px; height: 260px" :src="item.content.fileUrl" alt="" />
                  <div class="img-wrap-title">
                    <a-checkbox v-model:checked="item.content.isSelected" @change="e => getChangeBox(e.target.checked, item.content)">
                      <a-tooltip :mouseEnterDelay="0.5" :title="item.content.fileName + '' + item.content.fileType" placement="top">
                        <h3 class="fontHide" @click="viewPdfFun(item)">{{ item.content.fileName }}.{{ item.content.fileType }}</h3>
                      </a-tooltip>
                    </a-checkbox>
                    <div class="img-wrap-title-right">
                      <span class="play">{{ JSON.parse(item.content.counting).previewed }}次播放</span>
                      <div v-if="!item.content?.lightCollected" class="act-list elStarFilled" @click="followFun(item)">
                        <StarFilled /><span>{{ JSON.parse(item.content.counting).collectd }}</span>
                      </div>
                      <div v-else class="act-list elStarFilled1" @click="followFun(item)">
                        <StarFilled /><span>{{ JSON.parse(item.content.counting).collectd }}</span>
                      </div>
                      <div class="act-list elShare" @click="shareFun(item)">
                        <ShareAltOutlined /><span>{{ JSON.parse(item.content.counting).shared }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="author" style="display: flex">
                    <div>
                      <span class="name">{{ item.content.userName }}</span>
                      <span class="time">{{ getTimes(Date.parse(item.content.addTime)) || '' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
          <!-- <div style="display: flex; justify-content: space-between">
            <ElPage class="elPage" :page="page" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></ElPage>
            <div style="line-height: 64px">
              <el-button type="primary" @click="confirmDialog">确定</el-button>
              <el-button @click="cancelDialog">取消</el-button>
            </div>
          </div> -->
          <div class="top-header">
            <div class="search-wrap">
              <a-input-search v-model:value="keyWord" placeholder="输入关键字进行搜索" @search="searchData">
                <template #enterButton>
                  <div class="flex items-center">
                    <SearchOutlined />
                    <span class="ml-[4px]">搜索</span>
                  </div>
                </template>
              </a-input-search>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="bottomFooter">
          <a-pagination
            class="elPage"
            :current="page.currentPage"
            :pageSize="page.pageSize"
            :total="page.pageCount"
            show-size-changer
            @change="handleCurrentChange"
            @showSizeChange="handleSizeChange" />
          <div style="line-height: 48px">
            <a-button type="primary" @click="confirmDialog">确定</a-button>
            <a-button @click="cancelDialog">取消</a-button>
          </div>
        </div>
      </template>
      <shareCell :shareDialogVisible="shareDialogVisible" :docId="docId" @closeShare="closeShare"></shareCell>
      <comment :commentDialogVisible="commentDialogVisible" :commonDeail="commonDeail" @closeCommentDialogNotification="closeCommentDialogNotification"></comment>
      <Video :videoHide="videoHide" :fileUrlPlay="fileUrlPlay" :dialogType="dialogType" :titleType="titleType" @getVideoHide="getVideoHide"></Video>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated, computed } from 'vue';
import { message } from 'ant-design-vue';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, MessageOutlined, SearchOutlined, ShareAltOutlined, StarFilled, StarOutlined } from '@ant-design/icons-vue';
import shareCell from '@/view/knowledge-managment/cell/share.vue';
import comment from '@/components/Comment/index.vue';
import searchTag from '@/view/knowledge-base/cell/search-tag.vue';
import { useRouter } from 'vue-router';
import {
  shareUserDetailList,
  centerSearch,
  userCollectFile,
  viewList,
  hotFileList,
  saveLookFileLog,
  queryPageQuestion,
  answerQuestion,
  doInterestQuestion,
  getNodeByLevel,
  tagtList,
} from '@/api/knowledgeBaseApply/index.js';
import { getPdfPreviewPath, doCollectFile, updateKldCounting, knowledgeFileMapDataSave } from '@/api/knowledgeBaseManagment';
import { globaluserId } from '@/libs/rongxunUtil';
import Cookies from 'js-cookie';
import { getTimes } from '@/utils/dateUtils.js';
import Video from './videoImg.vue';
import { useStore } from 'vuex';
import { baseUrl } from '@/config/env';

const store = useStore();

const props = defineProps({
  addDataDialogVisible: Boolean,
  numberFlag: Number,
});

const emit = defineEmits('closeCenterDia');

const commentDialogVisible = ref(false);
const commentDialogVisibleQuest = ref(false);
const router = useRouter();
const activeName = ref('doc');

// 文档列表页数据
const documentList = ref([]);

// const checkedDoc1 = ref(false);

// 搜索内容
const keyWord = ref('');

const shareDialogVisible = ref(false);
const docId = ref('');
const page = ref({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

// 关键字和下载项
const isKeyWord = ref(false);
const isDownload = ref(false);

// 三级节点选中的id
const selectId = ref('');

// 初始化收藏的数据
const collectHide = ref(false);

// 点击评论获得当前条数据
const commonDeail = ref({});

// tab标识
const tabFlag = ref(1);

const videoHide = ref(false);

const fileUrlPlay = ref();

const titleType = ref();

const dialogType = ref('');

// 浏览记录数据
const viewHistoryData = ref([]);

// 热点文章数据
const hotArticleData = ref([]);

// 浏览总数
const viewTotal = ref();

// 热点总数
const hotFileTotal = ref();

// 保存路径
const filePath = ref('');

// 隐藏搜索范围
const hideTitle = ref(true);

// 问答需要
const flagId = ref();

// 隐藏我得回答
const hideAnswer = ref(false);

const answer = ref('');

// 显示隐藏标识
const hideFlag = ref(false);

const numberFlag = ref();

// 问答标识
const questFlag = ref(1);

// 所属类目1
const elTagcheckedOneData = ref([]);
// 所属类目2
const elTagcheckedTwoData = ref([]);

// 三级节点选中的数据
const thirdData = ref([]);

// 所有三级节点的id
const arrayData = ref([]);

// 判断所属类目一标识
const flagFirst = ref(1);

// 所属类目1的id
const firstId = ref();

// 操作所属类目2数据
const flagSecondData = ref([]);

// 检索中心tab类别
const centerTabFlag = ref(1);

const claListWidthOne = ref('1400px');
const claListWidthTwo = ref('1400px');

// 展开收藏的控制
const elTagcheckedOneStatus = ref(false);
const elTagcheckedTwoStatus = ref(false);

const hiddenStatus = ref(false);

// 选中的总数居
const selectedCheckArr = ref([]);

// 过滤后的数据
const filterData = ref([]);

// tab栏的名称
const tabName = computed(() => {
  return store.getters.tabName;
});

// menuid
const itemObj = computed(() => {
  return store.getters.itemObj;
});

// 点击侧边栏树结构数据
const nodeData = computed(() => {
  return store.getters.nodeData;
});

onActivated(() => {
  // userList();
  searchData();
  getTaglist();
});

watch(
  () => props.addDataDialogVisible,
  val => {
    if (val) {
      // userList();
      searchData();
      getTaglist();
      checkedDoc.value = false;
    }
  }
);

const getListData = () => {
  if (tabFlag.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
};

const getSearchCurrentChange = val => {
  page.value.currentPage = val;
  if (tabFlag.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
};

const getSearchSizeChange = val => {
  page.value.pageSize = val;
  if (tabFlag.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
};

// 切换标识
const handleTabChange = key => {
  if (key === 'doc') {
    tabFlag.value = 1;
  } else if (key === 'video') {
    tabFlag.value = 2;
  } else if (key === 'pic') {
    tabFlag.value = 3;
  } else {
    tabFlag.value = 4;
    hideTitle.value = false;
    getQuestList();
  }

  if (tabFlag.value !== 4) {
    searchData();
  }
  getTaglist();
};

// 获取二级节点数据
const getTaglist = () => {
  const params = {
    menuId: itemObj.value.id,
    menuParentId: itemObj.value.categoryID,
    tagType: tabName.value,
    nodeLevel: '2',
    fileType: tabFlag.value,
  };
  getNodeByLevel(params).then(res => {
    if (res && res.code === '0') {
      // 二级节点
      elTagcheckedOneData.value = [];
      elTagcheckedOneData.value = res.data.result;
      if (res.data.result.length > 12 && elTagcheckedOneStatus.value === false) {
        elTagcheckedOneData.value = [];
        elTagcheckedOneData.value = res.data.result.splice(0, 13);
        console.log(elTagcheckedOneData.value, '获取二级节点数据vlueeeeee');
      } else if (res.data.result.length > 12 && elTagcheckedOneStatus.value === true) {
        elTagcheckedOneData.value = [];
        elTagcheckedOneData.value = res.data.result;
      }
    }
  });
};

// 获取三级节点数据
const getThirdData = id => {
  const params = {
    menuId: itemObj.value.id,
    menuParentId: itemObj.value.categoryID,
    tagType: tabName.value,
    id: id,
    fileType: tabFlag.value,
  };
  tagtList(params).then(res => {
    if (res && res.code === '0') {
      arrayData.value = [];
      elTagcheckedTwoData.value = [];
      flagSecondData.value = [];
      // 三级节点
      flagSecondData.value = JSON.parse(JSON.stringify(res.data.result));
      elTagcheckedTwoData.value = res.data.result;

      res.data.result.map(v => {
        arrayData.value.push(v.id);
      });

      if (elTagcheckedTwoData.value.length > 12 && elTagcheckedTwoStatus.value === false) {
        elTagcheckedTwoData.value = elTagcheckedTwoData.value.splice(0, 13);
        console.log(elTagcheckedTwoData.value, 'vlueeeeee');
      } else if (elTagcheckedTwoData.value.length > 12 && elTagcheckedTwoStatus.value === true) {
        elTagcheckedTwoData.value = [];
        elTagcheckedTwoData.value = flagSecondData.value;
        // console.log(elTagcheckedTwoData.value, 'elTagcheckedTwoData.value999999');
      }
      if (tabFlag.value === 4) {
        getQuestList();
      } else {
        searchData();
      }
    }
  });
};

//所属类目1切换
const onChangeElCheckTagOne = (val, item, index) => {
  console.log('我是所属类目1');
  console.log(val, item, index, '1111111');
  if (item.id && val) {
    hiddenStatus.value = true;
    getThirdData(item.id);
  }
  // 保存类目1的id
  firstId.value = item.id;
  elTagcheckedOneData.value.forEach(item => {
    item.check = false;
  });
  elTagcheckedOneData.value[index].check = val;
  if (val === false && tabFlag.value === 4) {
    arrayData.value = [];
    getQuestList();
    hiddenStatus.value = false;
  } else if (val === false && tabFlag.value !== 4) {
    arrayData.value = [];
    searchData();
    hiddenStatus.value = false;
  }
};

//所属类目2切换
const onChangeElCheckTagTwo = (val, item, index) => {
  console.log('我是所属类目2');
  console.log(val, item, index, '222222');
  item.check = !item.check;
  elTagcheckedTwoData.value[index].check = item.check;
  if (item.check === true) {
    thirdData.value.push(item);
  }
  if (item.check === false) {
    thirdData.value.map((v, index) => {
      if (v.id === item.id) {
        thirdData.value.splice(index, 1);
      }
    });
  }
  arrayData.value = [];
  thirdData.value.map(v => {
    arrayData.value.push(v.id);
  });
  if (arrayData.value.length < 1) {
    arrayData.value = [];
    elTagcheckedTwoData.value.map(v => {
      arrayData.value.push(v.id);
    });
    // emit('changeFlag', arrayData.value);
  }
  if (tabFlag.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
  // 把需要的三级节点id传给父级
};

//展开收起
const onOffFun = type => {
  if (type == 'elTagcheckedTwo') {
    if (!elTagcheckedTwoStatus.value) {
      claListWidthTwo.value = '1400px';
      elTagcheckedTwoStatus.value = true;
      getThirdData(firstId.value);
    } else {
      claListWidthTwo.value = '1400px';
      elTagcheckedTwoStatus.value = false;
      getThirdData(firstId.value);
    }
  }
  if (type == 'elTagcheckedOne') {
    if (!elTagcheckedOneStatus.value) {
      claListWidthOne.value = '1400px';
      elTagcheckedOneStatus.value = true;
      getTaglist();
    } else {
      claListWidthOne.value = '1400px';
      elTagcheckedOneStatus.value = false;
      getTaglist();
    }
  }
};

// 搜索数据按钮接口
const searchData = () => {
  const params = {
    kldType: tabFlag.value,
    keyWords: isKeyWord.value ? keyWord.value : '', // 判断点没点关键字
    userName: Cookies.get('userName'),
    allowDownload: isDownload.value ? '0' : '',
    all: keyWord.value || '',
    kldTagIds: arrayData.value.toString() || '',
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
    userId: globaluserId(),
  };
  // console.log(params, 'params');
  centerSearch(params).then(res => {
    if (res && res.code === '0') {
      documentList.value = [];
      documentList.value = res.data.data;
      page.value.pageCount = res.data.total;
      // console.log(documentList.value, 'documentList.value111111111');
      if (documentList.value && documentList.value.length > 0) {
        documentList.value.map(v => {
          if (v.highlightFields?.content) {
            v.highlightFields.content.isSelected = false;
          } else {
            v.content.lightCollected = false;
            v.content.isSelected = false;
          }
        });
      }
      // console.log(documentList.value, 'documentList.value');
    }
  });
};

// 获取问答列表
const getQuestList = () => {
  const params = {
    all: keyWord.value || '',
    kldTagIds: arrayData.value.toString() || '',
    userId: globaluserId(),
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  queryPageQuestion(params).then(res => {
    if (res && res.code === '0') {
      // console.log(res, 'sdkjfaskhdbf');
      documentList.value = [];
      documentList.value = res.data.data;
      page.value.pageCount = res.data.total;
      documentList.value.map(v => {
        v.content.replay = false;
        v.content.hidden = false;
      });
      // viewHistory();
      // hotArticle();
    }
  });
};

// 选中的数据
const getChangeBox = (val, data) => {
  console.log(val, 'valvalvla');
  console.log(data, 'datadata');
  if (val) {
    selectedCheckArr.value.push(data);
  } else {
    selectedCheckArr.value.filter((v, index) => {
      if (v.id === data.id) {
        selectedCheckArr.value.splice(index, 1);
      }
    });
  }
  if (documentList.value && documentList.value.length > 0) {
    documentList.value.map(v => {
      if (v.highlightFields?.id === data.id && v.highlightFields?.content) {
        v.highlightFields.content.isSelected = val;
      }
      if (v.content.id === data.id) {
        v.content.isSelected = val;
      }
    });
  }
  console.log(documentList.value, 'documentList.value');
  console.log(selectedCheckArr.value, 'selectedCheckArr.value');
};

const confirmDialog = () => {
  // let obj = {};
  filterData.value = [];

  if (props.numberFlag === 1) {
    selectedCheckArr.value.map(v => {
      let obj = {
        fileName: v.fileName,
        kldFileId: v.id, //要存储的文件Id
        fileId: v.fileId, // 文件位置id,
      };
      filterData.value.push(obj);
    });
    store.commit('SET_CENTERDATA', filterData.value);
    emit('closeCenterDia');
    selectedCheckArr.value = [];
  } else {
    selectedCheckArr.value.map(v => {
      let obj = {
        title: v.attachmentType ? v.fileName : v.description,
        kldTreeId: nodeData.value.id, //treeId
        type: v.attachmentType ? v.attachmentType : '4', //知识类型：1文档，2视频，3图片，4问答，
        source: v.attachmentType ? '知识中心' : '知识问答',
        url: v.attachmentType ? v.fileUrl : '',
        kldFileId: v.id, //要存储的文件Id
        fileId: v.attachmentType ? v.fileId : null, // 文件位置id,
        kldTagName: v?.kldTageNames || v.kldTagName,
      };
      filterData.value.push(obj);
    });
    requestData();
  }
};

// 确定的接口请求
const requestData = () => {
  const params = {
    data: filterData.value,
  };
  knowledgeFileMapDataSave(params).then(res => {
    if (res && res.code === '0') {
      console.log(res.data, '我是去请求的数据');
      emit('closeCenterDia');
      selectedCheckArr.value = [];
      message.success(res.msg);
    } else {
      message.warning(res.msg);
    }
  });
};

const cancelDialog = () => {
  emit('closeCenterDia');
  selectedCheckArr.value = [];
  searchData();
};

// 查询用户列表
const userList = () => {
  const params = {
    userIds: globaluserId(),
  };
  shareUserDetailList(params).then(res => {
    if (res && res.code === '0') {
      console.log(res.data, '查询用户列表');
    }
  });
};

// 浏览记录
const viewHistory = () => {
  const params = {
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
    userId: globaluserId(),
    type: '1', //1,浏览  2，下载
    fileType: tabFlag.value,
  };
  viewList(params).then(res => {
    if (res && res.code === '0') {
      viewHistoryData.value = res.data.result;
      viewTotal.value = res.data.total;
    }
  });
};

// 热点文章
const hotArticle = () => {
  const params = {
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
    fileType: tabFlag.value,
  };
  hotFileList(params).then(res => {
    if (res && res.code === '0') {
      hotArticleData.value = res.data.result;
      hotFileTotal.value = res.data.total;
    }
  });
};

// 收藏
const initCollect = () => {
  const params = {
    userId: globaluserId(),
  };
  userCollectFile(params).then(res => {
    if (res && res.code === '0') {
      documentList.value.map(v => {
        res.data.map(k => {
          if (v.content.id === k.id) {
            collectHide.value = false;
          } else {
            collectHide.value = true;
          }
        });
      });
    }
  });
};

// 我来回答
const myAnswerFun = item => {
  flagId.value = item.id;
  documentList.value.map(v => {
    if (v.content.id === item.id) {
      v.content.replay = true;
      hideAnswer.value = !hideAnswer.value;
    } else {
      v.content.replay = false;
    }
  });
};

// 回答接口
const confirmAnswer = () => {
  const params = {
    questionId: flagId.value,
    userId: globaluserId(),
    content: answer.value,
  };
  answerQuestion(params).then(res => {
    if (res && res.code === '0') {
      hideAnswer.value = false;
      answer.value = '';
      setTimeout(() => {
        getQuestList();
      }, 2000);
    }
  });
};

// 显示隐藏评论数据
const changeHideFlag = item => {
  documentList.value.map(v => {
    if (v.content.id === item.id) {
      hideFlag.value = true;
      v.content.hidden = true;
    } else {
      v.content.hidden = false;
    }
  });
  const paramss = {
    name: Cookies.get('userName'), //userName
    userId: globaluserId(),
    kldId: item.id, //fileId
    type: '1', //1,浏览  2，下载
  };
  saveLookFileLog(paramss).then(res => {
    if (res && res.code === '0') {
      // 浏览问题数据
      console.log(res, '显示隐藏评论数据');
      // getQuestList();
      // viewHistory();
    }
  });
};

// 向上收起
const upData = () => {
  hideFlag.value = false;
};

//star星星数
const starFun = item => {
  const params = {
    questionId: item.id,
    userId: globaluserId(),
  };
  doInterestQuestion(params).then(res => {
    if (res && res.code === '0') {
      // console.log(item, '有没有interestLight');
      if (item.interestLight === true) {
        message.success('取消关注成功！');
      } else {
        message.success('关注成功！');
      }
      setTimeout(() => {
        getQuestList();
      }, 2000);
    }
  });
};

// 关键字选中与否
const changeKeyWord = val => {
  isKeyWord.value = val;
};

// 下载项选中与否
const changeisDown = val => {
  isDownload.value = val;
};

// 评论
const commentFun = item => {
  commonDeail.value = item.content;
  commentDialogVisible.value = true;
};

// 问答评论
const commentQuestFun = item => {
  commonDeail.value = item;
  numberFlag.value = 2;
  commentDialogVisibleQuest.value = true;
};

//关注
const followFun = item => {
  collectHide.value = !collectHide.value;
  const params = {
    kldId: item.content.id,
    userId: globaluserId(),
  };
  doCollectFile(params).then(res => {
    if (res && res.code === '0') {
      message.success(res.msg);
      setTimeout(() => {
        searchData();
        setTimeout(() => {
          documentList.value.map(v => {
            if (v.content.id === item.content.id && !collectHide.value) {
              v.content.lightCollected = true;
            } else {
              v.content.lightCollected = false;
            }
          });
        }, 800);
      }, 1000);
    }
  });
};
//分享
const shareFun = item => {
  docId.value = item.content.id;
  if (tabFlag.value === 4) {
    questFlag.value = 2;
  }
  shareDialogVisible.value = true;
};
//关闭分享
const closeShare = () => {
  shareDialogVisible.value = false;
  setTimeout(() => {
    searchData();
  }, 1000);
};

//下载
const downFun = item => {
  console.log(item, 'item');
  window.location.href = baseUrl + '/base-server/fileManagerController/download.json?fileId=' + item.fileId;
};

const getVideoHide = val => {
  videoHide.value = val;
  searchData();
};

//分页
const handleSizeChange = val => {
  page.value.pageSize = val;
  if (tabFlag.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
};
//分页
const handleCurrentChange = val => {
  page.value.currentPage = val;
  if (tabFlag.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
};

const closeCommentDialogNotification = () => {
  commentDialogVisible.value = false;
  commentDialogVisibleQuest.value = false;
};

// 查看pdf
const viewPdf = id => {
  const params = {
    id: id,
  };
  getPdfPreviewPath(params).then(res => {
    if (res && res.code === 200) {
      filePath.value = res.data.fileUrl;
      router.push({ path: '/knowledgeData/pdfView_index', query: { docId: filePath.value } });
    }
  });
};

//查看pdf
const viewPdfFun = item => {
  const paramss = {
    name: Cookies.get('userName'), //userName
    userId: globaluserId(),
    kldId: item.content.id, //fileId
    type: '1', //1,浏览  2，下载
  };
  updateKldCounting;
  saveLookFileLog(paramss).then(res => {
    if (res && res.code === '0') {
      // 浏览记录数据
      console.log(res, 'dfgsdfdfhfd');
    }
  });

  store.commit('SET_OBJECTITEM', item);
  if (tabFlag.value === 1) {
    viewPdf(item.content.fileId);
  }
  if (tabFlag.value === 2) {
    fileUrlPlay.value = item.content.fileUrl;
    videoHide.value = true;
    titleType.value = '视频播放';
    dialogType.value = '2';
  }
  if (tabFlag.value === 3) {
    fileUrlPlay.value = item.content.fileUrl;
    videoHide.value = true;
    titleType.value = '图片查看';
    dialogType.value = '3';
  }
  const params = {
    kldFileId: item.content.id,
    countingType: 1,
  };
  updateKldCounting(params).then(res => {
    if (res && res.code === '0') {
      console.log(res, '我是浏览接口返回的数据2222222');
    }
  });
  searchData();
};

const handleClose = () => {
  emit('closeCenterDia');
};
</script>

<style lang="less" scoped>
.centerSearch {
  :deep(.ant-modal-body) {
    padding: 0;
    margin: 0;
  }
  :deep(.ant-modal-header) {
    margin-bottom: 10px !important;
  }
  :deep(.ant-modal-footer) {
    height: 48px;
    padding: 0 20px !important;
  }
}
.layout {
  padding-bottom: 20px;
}
.elMain {
  padding: 0;
  width: 100%;
  margin-right: 1%;
  height: 680px;
  // .top-header {
  //   height: 42px;
  //   background: #ffffff;
  //   border-radius: 4px;
  //   overflow: hidden;
  //   .search-wrap {
  //     width: 432px;
  //     height: 32px;
  //     position: relative;
  //     margin: 0 20px 10px auto;
  //     display: flex;
  //     .input-with-select {
  //       width: 100%;
  //       height: 32px;
  //       line-height: 32px;
  //       background: #f7f8fa !important;
  //       border: none;
  //       outline: none;
  //       padding-left: 10px;
  //       flex: 1;
  //     }
  //     .btn {
  //       width: 96px;
  //       height: 32px;
  //       background: #155bd4;
  //       position: absolute;
  //       top: 0;
  //       right: -1px;
  //       font-size: 16px !important;
  //       font-family: PingFangSC, PingFang SC;
  //       font-weight: 400;
  //       color: #ffffff !important;
  //       line-height: 32px;
  //       .elIcon {
  //         margin-right: 10px;
  //       }
  //     }
  //   }
  // }
  .content {
    // margin-top: -48px;
    position: relative;
    margin-top: -5px;
    .elTabs {
      :deep(.el-tabs__header) {
        height: 32px;
      }
      :deep(.el-tabs__nav-wrap) {
        height: 48px;
        margin: 0;
      }
      :deep(.el-tabs__nav-scroll) {
        padding-left: 20px;
        overflow: visible;
      }
      :deep(.el-tabs__item) {
        min-width: 70px !important;
        padding: 0;
      }
      :deep(.el-tabs__active-bar) {
        min-width: 70px !important;
        bottom: -7px;
      }
    }
    .doc-wrap {
      min-height: 554px;
      background: #ffffff;
      border-radius: 4px;
      padding: 0 20px;
      .doc-list {
        border-bottom: 1px solid #ebedf0;
        margin-bottom: 20px;
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
          .status {
            height: 20px;
            border-radius: 2px;
            font-size: 12px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            line-height: 20px;
            padding: 1px 10px;
            margin-left: 8px;
          }
          .exigency {
            color: #d40000;
            background: #ffebeb;
          }
          .importance {
            color: red;
            background: #ffebeb;
          }
          .normal {
            color: #333;
            background: #ffebeb;
          }
          &:hover {
            color: #155bd4;
          }
        }
        .desc {
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: #646566;
          line-height: 22px;
        }
        .author {
          margin-top: 8px;
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
        &:last-child {
          border: none;
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
      :deep(.el-checkbox__input) {
        margin-top: -10px;
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
      &-title {
        display: flex;
        &-right {
          display: flex;
          margin-left: 20px;
          line-height: 22px;
          .act-list {
            display: flex;
            align-items: center;
            margin-left: 10px;
            &:last-child {
              border: none;
            }
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
        // border-bottom: 1px solid #ebedf0;
        margin-bottom: 20px;
        width: 550px;
        margin-right: 30px;
        h3 {
          height: 22px;
          font-size: 16px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          color: #323233;
          line-height: 22px;
          display: inline-block;
          cursor: pointer;
          .status {
            height: 20px;
            border-radius: 2px;
            font-size: 12px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            line-height: 20px;
            padding: 1px 10px;
            margin-left: 8px;
          }
          .exigency {
            color: #d40000;
            background: #ffebeb;
          }
          .importance {
            color: red;
            background: #ffebeb;
          }
          .normal {
            color: #333;
            background: #ffebeb;
          }
          &:hover {
            color: #155bd4;
          }
        }
        .desc {
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: #646566;
          line-height: 22px;
        }
        .author {
          margin-top: 8px;
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
        &:last-child {
          border: none;
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
      :deep(.el-checkbox__input) {
        margin-top: 0 !important;
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
      &-title {
        display: flex;
        &-right {
          display: flex;
          margin-left: 20px;
          line-height: 22px;
          .act-list {
            display: flex;
            align-items: center;
            margin-left: 10px;
            &:last-child {
              border: none;
            }
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
        // border-bottom: 1px solid #ebedf0;
        margin-bottom: 20px;
        width: 450px;
        margin-right: 30px;
        h3 {
          height: 22px;
          font-size: 16px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          color: #323233;
          line-height: 22px;
          display: inline-block;
          cursor: pointer;
          .status {
            height: 20px;
            border-radius: 2px;
            font-size: 12px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            line-height: 20px;
            padding: 1px 10px;
            margin-left: 8px;
          }
          .exigency {
            color: #d40000;
            background: #ffebeb;
          }
          .importance {
            color: red;
            background: #ffebeb;
          }
          .normal {
            color: #333;
            background: #ffebeb;
          }
          &:hover {
            color: #155bd4;
          }
        }
        .desc {
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: #646566;
          line-height: 22px;
        }
        .author {
          margin-top: 8px;
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
        &:last-child {
          border: none;
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
      :deep(.el-checkbox__input) {
        margin-top: 0 !important;
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
          .status {
            height: 20px;
            border-radius: 2px;
            font-size: 12px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            line-height: 20px;
            padding: 1px 10px;
            margin-left: 8px;
          }
          .exigency {
            color: #d40000;
            background: #ffebeb;
          }
          .importance {
            color: red;
            background: #ffebeb;
          }
          .normal {
            color: #333;
            background: #ffebeb;
          }
          &:hover {
            color: #155bd4;
          }
        }
        .desc {
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: #646566;
          line-height: 22px;
        }
        .author {
          margin-top: 8px;
          border-bottom: 2px solid #efefef;
          padding-bottom: 10px;
          span {
            height: 22px;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            // color: #969799;
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
            // margin: 0 13px;
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
          border-bottom: 1px dashed #c3c3c3;
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
            // color: #969799;
            line-height: 22px;
          }
          span.time {
            margin-left: 13px;
            margin-right: 13px;
          }
          .content {
            margin: 10px 0 0 13px;
          }
        }
        .up {
          color: #155bd4;
          position: relative;
          top: -10px;
          left: 50%;
          cursor: pointer;
        }
        .starComment {
          display: flex;
          margin: 5px 0 0 10px;
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
            // margin-left: 10px;
          }
        }
        .commont {
          // display: flex;
          &-btn {
            margin-top: 5px;
          }
        }
        &:last-child {
          border: none;
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
      :deep(.el-checkbox__input) {
        margin-top: -10px;
      }
    }
    .top-header {
      height: 42px;
      background: #ffffff;
      border-radius: 4px;
      overflow: hidden;
      position: absolute;
      top: 0;
      right: 10px;
      margin-top: 5px;
      .search-wrap {
        width: 432px;
        height: 32px;
        position: relative;
        margin: 0 20px 10px auto;
        display: flex;
        .input-with-select {
          width: 100%;
          height: 32px;
          line-height: 32px;
          background: #f7f8fa !important;
          border: none;
          outline: none;
          padding-left: 10px;
          flex: 1;
        }
        .btn {
          width: 96px;
          height: 32px;
          background: #155bd4;
          position: absolute;
          top: 0;
          right: -1px;
          font-size: 16px !important;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #ffffff !important;
          line-height: 32px;
          .elIcon {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .isRelated {
    color: #ff3399;
  }
}
.bottomFooter {
  display: flex;
  justify-content: space-between;
  height: 48px;
  .elPage {
    // margin-bottom: 20px;
    margin-top: 0 !important;
  }
  :deep(.el-pagination--small .el-select .el-input) {
    width: 84px !important;
  }
}
.elAside {
  width: 25%;
}
.fontHide {
  width: 270px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.play {
  line-height: 32px;
}
.tooltip-base-box .box-item {
  width: 20px;
  margin-top: 10px;
}
.highlightName {
  :deep(em) {
    color: red !important;
  }
}
.exigency {
  color: #d40000;
  background: #ffebeb;
  padding: 1px 10px;
  margin-left: 10px;
}
.importance {
  color: red;
  background: #ffebeb;
  padding: 1px 10px;
  margin-left: 10px;
}
.normal {
  color: #333;
  background: #ffebeb;
  padding: 1px 10px;
  margin-left: 10px;
}
.elStarFilled1 {
  cursor: pointer;
  color: red;
}
</style>
