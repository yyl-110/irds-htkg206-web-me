<template>
  <a-row :gutter="[16, 0]" class="layout">
    <a-col :span="5" class="h-full">
      <div class="elAside flex flex-col">
        <a-input v-model:value="searchData" class="search" placeholder="请输入标题或作者搜索" allow-clear @change="getMapList">
          <template #suffix>
            <SearchOutlined class="text-[#999]" />
          </template>
        </a-input>
        <div class="mt-[16px] flex-1 overflow-y-auto">
          <a-card v-for="item in sideData" :key="item.id" class="sideContent"
            :body-style="{ padding: '0px' }" @click="mapDetail(item)">
            <img class="sideContent-img" :src="item.coverFileUrl" alt="" />
            <div style="padding: 0 6px 10px 10px; margin-top: -8px">
              <div class="sideContent-data-top">
                <a-tooltip :title="item.name" placement="top" :mouse-enter-delay="0.5">
                  <span class="sideContent-data-top-left">{{ item.name }}</span>
                </a-tooltip>
                <div class="sideContent-data-top-right">
                  <span class="sideContent-data-top-right-text" @click.stop="mapDetail(item)">详情</span>
                </div>
              </div>
              <div class="sideContent-data-bottom">
                <span class="sideContent-data-bottom-text">{{ item.createUserName }}</span>
                <span class="sideContent-data-bottom-text">{{ getTimes(Date.parse(item.addTime)) }}</span>
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </a-col>
    <a-col :span="19" class="h-full">
      <div class="elMain">
        <div class="mainRight">
          <a-card v-for="(item, index) in mainData" :key="index" class="pic"
            :body-style="{ padding: '0px', display: 'flex' }">
            <img class="pic-img" :src="item.coverFileUrl" alt="" @click="player(item)" />
            <div class="pic-data">
              <div @click="player(item)" class="pic-data-top">
                <div>{{ item.name }}</div>
              </div>
              <div class="pic-data-top">
                <a-progress class="pic-data-top-progress" :percent="item.percent" :show-info="false" size="small" />
                <PlayCircleOutlined class="pic-data-top-iconColor" @click="player(item)" />
                <img v-if="item.percent === 0" class="pic-data-top-result" src="@/assets/svg/start.svg" alt="" />
                <img v-if="item.percent !== 100 && item.percent !== 0" class="pic-data-top-result"
                  src="@/assets/svg/progress.svg" alt="" />
                <img v-if="item.percent === 100" class="pic-data-top-result" src="@/assets/svg/completed.svg" alt="" />
              </div>
              <div class="info">摘要：{{ item.summary }}</div>
            </div>
          </a-card>
        </div>
        <a-pagination class="elPage" v-model:current="page.currentPage" v-model:page-size="page.pageSize"
          :total="page.pageCount" show-size-changer show-quick-jumper :page-size-options="['10', '20', '50']"
          @change="handlePageChange" @show-size-change="handlePageChange" />
      </div>
    </a-col>
  </a-row>
  <DetailDialog
    :dialogVisible1="dialogVisible1"
    :objData="objData"
    @getList1="getMainData"
    @closeDiaDetail1="closeDiaDetail1"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { SearchOutlined, PlayCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { startLearning, personalMapList, taskMaplist } from '@/api/knowledge';
import { getTimes } from '@/utils/dateUtils.js';
import { useUserStore } from '@/store/modules/user';
import DetailDialog from './detailDialog.vue';

const router = useRouter();

const page = ref({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

const searchData = ref('');
const objData = ref<any>({});
const dialogVisible1 = ref(false);
const sideData = ref<any[]>([]);
const mainData = ref<any[]>([]);

// 获取左侧列表
const getMapList = async () => {
  const params = {
    userId: useUserStore().getUser.id,
    queryContent: searchData.value || '',
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
    clientEnd: 1,
  };
  const res = await taskMaplist(params);
  if (res && res.data.code === '0') {
    sideData.value = res.data.data.result;
  } else {
    message.error(res?.data?.msg || '获取列表失败');
  }
};

// 获取主列表数据
const getMainData = async () => {
  const params = {
    userId: useUserStore().getUser.id,
    type: 1,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  const res = await personalMapList(params);
  if (res && res.data.code === '0') {
    mainData.value = res.data.data.result;
    page.value.pageCount = res.data.data.rowCount;
  } else {
    message.error(res?.data?.msg || '获取列表失败');
  }
};

// 分页变化
const handlePageChange = async (current: number, pageSize: number) => {
  page.value.currentPage = current;
  page.value.pageSize = pageSize;
  await getMainData();
};

// 详情
const mapDetail = (item: any) => {
  localStorage.setItem('detail', JSON.stringify(item));
  objData.value = item;
  if (item.learned) {
    router.push({ path: '/knowledgeData/createTaskMap_index' });
  } else {
    dialogVisible1.value = true;
  }
};

const closeDiaDetail1 = () => {
  getMapList();
  dialogVisible1.value = false;
};

// 播放
const player = async (item: any) => {
  localStorage.setItem('detail', JSON.stringify(item));
  await startLearn(item.id);
  router.push({ path: '/knowledgeData/createTaskMap_index' });
};

// 开始学习
const startLearn = async (id: string) => {
  const params = {
    userId: useUserStore().getUser.id,
    taskMapId: id,
  };
  const res = await startLearning(params);
  if (res && res.data.code !== '0') {
    message.error(res?.data?.msg || '开始学习失败');
  }
};

const reload = async () => {
  await Promise.all([getMapList(), getMainData()]);
};

onMounted(() => {
  reload();
});

defineExpose({ reload });
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
}

.elAside {
  height: 100%;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;


  .sideContent {
    margin: 0 10px 10px 10px;
    cursor: pointer;

    &-img {
      width: 100%;
      height: 80px;
      object-fit: cover;
      border-bottom: 1px solid #e6e6e6;
    }

    &-data {
      &-top {
        display: flex;
        justify-content: space-between;
        height: 16px;
        line-height: 16px;
        margin-top: 10px;

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
          cursor: pointer;

          &:hover {
            color: #409eff;
          }
        }

        &-right {
          height: 16px;
          line-height: 16px;
          font-size: 11px;

          &-text {
            margin-right: 10px;
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
}

.elMain {
  height: 100%;
  padding: 10px;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  .mainRight {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    place-content: flex-start;

    .pic {
      width: 480px;
      height: 132px;
      border-radius: 6px;
      border: 1px solid #eaeaf1;
      margin: 0 16px 16px 0;

      &:hover {
        border-color: #155bd4;

        .pic-data-top {
          color: #409eff;
        }
      }

      &-img {
        width: 140px;
        height: 100px;
        border-radius: 4px;
        margin: 16px;
        cursor: pointer;
        object-fit: cover;
      }

      &-data {
        margin-top: 24px;

        .info {
          margin-top: 5px;
          height: 40px;
          line-height: 20px;
          overflow: hidden;
          font-size: 12px;
          color: #6a696e;
        }

        &-top {
          display: flex;
          font-weight: 600;
          font-size: 14px;
          color: #155bd4;
          line-height: 22px;
          cursor: pointer;
          align-items: center;

          &-progress {
            width: 200px;
            margin: 0 10px 0 0;
          }

          &-iconColor {
            font-size: 20px;
            color: #ff8800;
            margin-right: 10px;
            cursor: pointer;
          }

          &-result {
            max-width: 17px;
            min-width: 17px;
            height: 20px;
          }
        }
      }
    }
  }

  .elPage {
    padding: 15px 0;
    text-align: right;
  }
}

:deep(.ant-row) {
  height: 100%;
}
</style>
