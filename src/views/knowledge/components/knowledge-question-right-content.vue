<template>
  <div class="rt-layout">
    <a-card class="box-card" :bordered="false">
      <template #title>
        <div class="card-header">
          <span style="font-weight: 600; font-size: 18px">专家板块</span>
          <div class="more" @click="viewMoreFun('records')">更多</div>
        </div>
      </template>
      <div class="pic-list">
        <div class="user-block" v-for="(item, index) in userListData" :key="index">
          <div class="user-info">
            <a-avatar class="elAvatar" :size="44">
              <span style="color: #1366d1; font-size: 30px">{{ item.name[0] }}</span></a-avatar>
            <div>
              <div class="uname">{{ item.name }}</div>
              <div class="udesc">{{ item?.expertRole }}{{ item?.expertRole ? '·' : '' }}{{ item?.ifExpert }}</div>
              <div class="btn-wrap">
                <div class="btnlis" @click="viewExpertDes(item)">查看详情</div>
                <div class="btnlis1" @click="expertFun(item)">提问TA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card class="box-card height240" :bordered="false">
      <template #title>
        <div class="card-header">
          <span style="font-weight: 600; font-size: 18px">热评问题</span>
          <div class="more" @click="viewMoreFun('hot')">更多</div>
        </div>
      </template>
      <div v-for="(artTitle, index) in articList" :key="artTitle.id" class="text item" @click="previewArt">
        <div v-if="artTitle.fileName && index < 5" class="box-item">
          <div class="space">
            <span style="margin-right: 0.625rem"
              :style="{ color: index == 0 ? '#ff0000' : index == 1 || index == 2 ? '#FF8A00' : '' }">{{ index + 1
              }}</span>{{ artTitle.fileName }}
          </div>
        </div>
        <div v-if="artTitle.fileName && index < 5"
          style="margin-left: 10px; margin-top: -40px; display: flex; align-items: center">
          <EyeOutlined style="margin-right: 2px" />
          {{ artTitle.num }}次
        </div>
      </div>
    </a-card>
    <a-modal :maskClosable="false" class="view-more-dialog" :visible="dialogVisible" :title="dialogTit" width="60%"
      @cancel="closeFun">
      <a-card v-if="userList.length > 0 && dialogTit === '专家板块'" class="box-card1" :bordered="false">
        <a-form :model="formInline" layout="inline" class="demo-form-inline">
          <a-form-item style="margin-right: 20px">
            <a-input v-model:value="formInline.userName" placeholder="请输入专家名称搜索" style="width: 212px" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="onSubmit">
              <SearchOutlined />&nbsp;查询
            </a-button>
            <a-button @click="resetFun">
              <UndoOutlined />&nbsp;重置
            </a-button>
          </a-form-item>
        </a-form>
        <div style="width: 100%; display: flex; flex-wrap: wrap; justify-content: flex-start">
          <div v-for="item in userList" :key="item.id" class="pic-list" style="margin-left: 0; margin-bottom: 20px">
            <a-avatar class="elAvatar" :size="44" :src="callBackUserAvatar(item.roleName)"><span
                style="color: #1366d1; font-size: 30px">{{ item.name[0] }}</span></a-avatar>
            <div style="margin-top: 12px">
              <div class="uname">{{ item.name }}</div>
              <div class="udesc">{{ item.expertRole }}</div>
              <div class="btn-wrap">
                <div class="btnlis" @click="viewExpertDes(item)">查看详情</div>
                <div class="btnlis1" @click="expertFun(item)">提问TA</div>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <a-card v-if="userList.length > 0 && dialogTit === '热评问题'" class="box-card" :bordered="false">
        <div v-for="art in articList" :key="art.id" style="border-bottom: 1px solid #ccc">
          <div class="text item text-list">
            <span class="tit">{{ art.fileName }}</span>
            <div>
              <span class="name">{{ art.userName }}</span>
              <span class="time">{{ getTimes(Date.parse(art.addTime)) }}</span>
            </div>
          </div>
          <div style="line-height: 22px; display: flex; align-items: center">
            <EyeOutlined style="margin-right: 2px" />{{ art.num }}次
          </div>
        </div>
      </a-card>
      <template #footer>
        <div class="footer">
          <a-pagination class="elPage" v-model:current="page.currentPage" :total="page.pageCount"
            :default-page-size="page.pageSize" show-less-items show-size-changer show-quick-jumper
            :show-total="(total) => `共${total}条`" @change="handleCurrentChange" @showSizeChange="handleSizeChange" />
          <span class="dialog-footer">
            <a-button type="primary" @click="closeFun">关闭</a-button>
          </span>
        </div>
      </template>
    </a-modal>
    <PoseQuestion :poseDialogVisible="poseDialogVisible" :expertData="expertData" @closeDialogs="closeDialog" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { queryExpertInformationList, hotQuestion } from '@/api/knowledge';
import { getTimes } from '@/utils/dateUtils.js';
import PoseQuestion from './PoseQuestion.vue';
import { EyeOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons-vue';


const dialogVisible = ref(false);
const dialogTit = ref('');
const page = ref({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

const userListData = ref([]);
const userList = ref([]);
const formInline = ref({
  userName: '',
});

const articList = ref([]);

const poseDialogVisible = ref(false);

const expertData = ref({});

const typeData = ref();

const props = defineProps({
  expertFlag: Number,
  getCurrentTab: String,
});

const emit = defineEmits(['closeDialogs', 'exposeId', 'exposeAskDes']);


watch(
  () => props.getCurrentTab,
  val => {
    if (val && val === 'knowledgeAsk') {
      getUserList();
      getHotArtic();
    }
  }
);

onMounted(() => {
  getUserList();
  getHotArtic();
})

const closeFun = () => {
  formInline.value = {
    userName: '',
  };
  page.value = {
    pageSize: 10,
    currentPage: 1,
  };
  dialogVisible.value = false;
};

const onSubmit = () => {
  page.value = {
    pageSize: 10,
    currentPage: 1,
  };
  getUserList();
};

const resetFun = () => {
  formInline.value = {
    userName: '',
  };
  page.value = {
    pageSize: 10,
    currentPage: 1,
  };
  getUserList();
};

const getUserList = () => {
  const params = {
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
    userNameOrExpertRole: formInline.value.userName, //筛选条件，用户名字或职位
  };

  queryExpertInformationList(params).then(res => {
    if (res && res.data.code === '0') {
      userList.value = [];
      userList.value = res.data.data.result || [];
      if (!userListData.value.length) {
        userListData.value = res.data.data.result || [];
      }
      page.value.pageCount = res.data.data.total;
    }
  });
};

const getHotArtic = () => {
  const params = {
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
    userNameOrDes: '', //筛选条件：用户名字或问题描述
  };
  hotQuestion(params).then(res => {
    if (res && res.data.code === '0') {
      articList.value = [];
      articList.value = res.data.data.result;
      page.value.pageCount = res.data.data.total;
    }
  });
};

const viewExpertDes = item => {
  dialogVisible.value = false;
  emit('exposeAskDes', item.id);
};

// 直接点击头像向专家提问
const expertFun = val => {
  poseDialogVisible.value = true;
  expertData.value = val;
};

// 提问
const viewExpose = item => {
  emit('exposeId', item.id);
  dialogVisible.value = false;
};

const viewMoreFun = type => {
  typeData.value = type;
  dialogVisible.value = true;
  if (type == 'hot') {
    dialogTit.value = '热评问题';
    getHotArtic();
  } else {
    dialogTit.value = '专家板块';
    getUserList();
  }
};

//分页
const handleSizeChange = (current, size) => {
  page.value.pageSize = size;
  if (typeData.value == 'hot') {
    getHotArtic();
  } else {
    getUserList();
  }
};
//分页
const handleCurrentChange = val => {
  page.value.currentPage = val;
  if (typeData.value == 'hot') {
    getHotArtic();
  } else {
    getUserList();
  }
};

const closeDialog = () => {
  poseDialogVisible.value = false;
  emit('closeDialogs');
};
</script>
<style lang="less" scoped>
.rt-layout {
  margin-top: 10px;
  overflow: hidden;

  .tooltip-base-box .box-item {
    width: 20px;
    margin-top: 10px;
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

  .item {
    display: flex;
    align-items: center;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #333;
    line-height: 20px;
    margin-top: 5px;
    margin-bottom: 5px;
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

.box-card {
  height: 496px;
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 16px;
  border: none;

  :deep(.ant-card-head) {
    padding: 18px 16px;
    border-bottom: none;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .more {
      cursor: pointer;
      width: 28px;
      height: 22px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #1366d1;
      line-height: 22px;
    }
  }

  :deep(.ant-card-body) {
    padding: 0 10px 10px;
    height: 430px;
    overflow: hidden;

    .pic-list {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;

      .elAvatar {
        min-height: 44px;
        min-width: 44px;
        margin-right: 7px;
      }

      .uname {
        height: 26px;
        font-family: PingFang-SC, PingFang-SC;
        line-height: 26px;
        margin-bottom: 2px;
        font-weight: 500;
        font-size: 16px !important;
        color: #313133;
      }

      .udesc {
        height: 12px;
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #969799;
        line-height: 12px;
      }
    }
  }

  .user-block {
    width: 212px;
    height: 98px;
    background: #f2f5f7;
    border-radius: 4px 4px 4px 4px;
    padding: 12px 0 0 12px;
    overflow: hidden;
    margin-bottom: 10px;

    .user-info {
      display: flex;

      .uname {
        font-size: 12px;
        margin-top: 2px;
        margin-bottom: 0;
        word-break: break-all;
        overflow: hidden;
      }

      .udesc {
        font-size: 12px;
        word-break: break-all;
        overflow: hidden;
      }
    }

    .btn-wrap {
      display: flex;
      justify-content: center;
      margin-top: 8px;

      .btnlis {
        width: 64px;
        height: 24px;
        line-height: 24px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        font-size: 12px;
        color: #6a696e;
        cursor: pointer;
        margin-right: 8px;
        text-align: center;
      }

      .btnlis1 {
        width: 64px;
        height: 24px;
        line-height: 24px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        font-size: 12px;
        color: #1366d1;
        cursor: pointer;
        margin-right: 8px;
        text-align: center;
      }
    }
  }
}

.height240 {
  height: ~'calc(100vh - 585px)';
  overflow-y: auto;
  width: 244px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  margin-bottom: 0;

  :deep(.ant-card-body) {
    padding: 0 20px 20px 20px;

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
    }
  }
}

:deep(.view-more-dialog) {
  .ant-modal-body {
    margin: 0;
  }

  .ant-modal-header {
    margin-bottom: 0 !important;
  }

  .text-list {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tit {
      display: inline-block;
      width: 32.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 22px;
      font-size: 14px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: #646566;
      line-height: 22px;
      justify-content: start;
      cursor: pointer;

      &:hover {
        color: #155bd4;
      }
    }

    .name {
      height: 22px;
      font-size: 12px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: #969799;
      line-height: 22px;
      text-align: right;
      cursor: default;
    }

    .time {
      height: 22px;
      font-size: 12px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: #969799;
      line-height: 22px;
      margin-left: 8px;
      cursor: default;
    }
  }

  .box-card .ant-card-body {
    padding: 5px 0 0 0;
  }

  .elPage {
    margin-bottom: 20px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    height: 40px;
  }

  .dialog-footer {
    line-height: 40px;
  }

  .box-card1 {
    height: 520px;
    width: 100%;
    border: none !important;
    overflow: auto;

    .pic-list {
      width: 212px;
      height: 98px;
      margin-right: 20px;
      background: #f2f5f7;
      border-radius: 4px 4px 4px 4px;
      display: flex;

      .elAvatar {
        height: 44px;
        width: 44px;
        margin-right: 7px;
        margin: 12px 7px 0 12px;
      }

      .uname {
        height: 26px;
        font-family: PingFang-SC, PingFang-SC;
        line-height: 26px;
        margin-bottom: 2px;
        font-weight: 500;
        font-size: 16px;
        color: #000;
      }

      .udesc {
        height: 12px;
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #969799;
        line-height: 12px;
      }

      .btn-wrap {
        display: flex;
        justify-content: center;
        margin-top: 8px;

        .btnlis {
          width: 64px;
          height: 24px;
          line-height: 24px;
          background: #ffffff;
          border-radius: 4px 4px 4px 4px;
          font-size: 12px;
          color: #6a696e;
          cursor: pointer;
          margin-right: 8px;
          text-align: center;
        }

        .btnlis1 {
          width: 64px;
          height: 24px;
          line-height: 24px;
          background: #ffffff;
          border-radius: 4px 4px 4px 4px;
          font-size: 12px;
          color: #1366d1;
          cursor: pointer;
          margin-right: 8px;
          text-align: center;
        }
      }
    }

    :deep(.ant-card-body) {
      width: 850px;
      padding: 0 !important;
    }
  }

  .fontStyle {
    font-family: DIN Alternate, DIN Alternate;
    font-weight: bold;
    font-size: 16px;
    color: #ff0000;
    margin-right: 10px;
  }

  .fontStyle1 {
    font-family: DIN Alternate, DIN Alternate;
    font-weight: bold;
    font-size: 16px;
    color: #ff8a00;
  }

  .fontStyle2 {
    font-family: DIN Alternate, DIN Alternate;
    font-weight: bold;
    font-size: 16px;
    color: #ecaa00;
  }
}
</style>
