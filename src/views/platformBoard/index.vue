<template>
  <div class="platformBoardContainer">
    <div class="video-fallback" :style="{ backgroundImage: `url(${bgImg})` }"></div>
    <!-- 视频背景 -->
    <video autoplay muted loop playsinline preload="auto" class="video-bg">
      <source :src="bgVideo" type="video/mp4" />
    </video>
    
    <screen-container :width="1920" :height="1080">
      <div class="boardContainer">
        <header class="header">
          <a-button type="link" class="back-btn" @click="router.back()" style="position: absolute; left: 40px; top: 40px; color: #fff; z-index: 100;">
            <template #icon><left-outlined /></template>
            返回
          </a-button>
          <img src="@/assets/data-screen/home/title.png" alt="" />
        </header>
        <main>
          <img src="@/assets/data-screen/home/LOGO.png" alt="" class="logo" />
          <div v-for="item in list" :key="item.id" class="child" @click="goTo(item)">
            <div style="width: 361px">
              <span class="topWrap">
                <img style="width: 100%; height: 100%" :src="item.topurl" alt="" />
                <img class="inside" :src="item.topinsideurl" alt="" />
              </span>
              <img class="mainWrap" :src="item.mainurl" alt="" />
              <img :src="item.bottomurl" alt="" />
            </div>
          </div>
        </main>
        <div class="page"></div>
        <footer class="footer" />
      </div>
    </screen-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import {
  DashboardOutlined,
  InfoCircleOutlined,
  LeftOutlined,
} from '@ant-design/icons-vue';
import ScreenContainer from '@/components/data-screen/screen-container.vue';
import { useIndexStore } from '@/store/data-screen';
import { getReportProjectPhaseList } from '@/api/data-screen';

// Import assets from the new location
import module1_1 from '@/assets/data-screen/home/module1_1.png';
import module1_2 from '@/assets/data-screen/home/module1_2.png';
import module1_3 from '@/assets/data-screen/home/module1_3.png';
import module1_4 from '@/assets/data-screen/home/module1_4.png';
import module2_2 from '@/assets/data-screen/home/module2_2.png';
import module2_3 from '@/assets/data-screen/home/module2_3.png';
import module3_2 from '@/assets/data-screen/home/module3_2.png';
import module3_3 from '@/assets/data-screen/home/module3_3.png';
import module4_2 from '@/assets/data-screen/home/module4_2.png';
import module4_3 from '@/assets/data-screen/home/module4_3.png';
import bgVideo from '@/assets/data-screen/bgvideo.mp4';
import bgImg from '@/assets/data-screen/home/bg.png';

const router = useRouter();
const indexStore = useIndexStore();
const { updateProjectList, updateSelectProjectId } = indexStore;

const fetchProjectList = async () => {
  try {
    const res: any = await getReportProjectPhaseList();
    if (res.code === '0' || res.code === 200) {
      updateProjectList(res.data);
      if (res.data && res.data.length > 0) {
        updateSelectProjectId(res.data[0]?.projectId);
      }
    }
  } catch (error) {
    console.log('error:', error);
  }
};

onMounted(() => {
  fetchProjectList();
});

const list = [
  { topurl: module1_1, topinsideurl: module3_2, mainurl: module3_3, bottomurl: module1_4, id: 1, path: '/demand', name: '需求分析' },
  { topurl: module1_1, topinsideurl: module2_2, mainurl: module2_3, bottomurl: module1_4, id: 2, path: '/base', name: '基础数据' },
  { topurl: module1_1, topinsideurl: module1_2, mainurl: module1_3, bottomurl: module1_4, id: 3, path: '/product', name: '产品定义' },
  { topurl: module1_1, topinsideurl: module4_2, mainurl: module4_3, bottomurl: module1_4, id: 4, path: '/system', name: '系统设置' },
];

const goTo = (item: any) => {
  if (item.path) {
    router.push({ path: item.path });
  }
};
</script>

<style lang="less">
body {
  margin: 0;
  padding: 0;
  background-color: #030409;
}
</style>

<style lang="less" scoped>
.platformBoardContainer {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #030409;
  overflow: hidden;
  z-index: 100;

  .video-fallback {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/data-screen/home/bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 1;
  }

  .video-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 2;
  }

  .boardContainer {
    width: 100%!important;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 3;

    main {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      
      .logo {
        position: absolute;
        width: 350px;
        top: -25px;
        left: 100px;
      }
      
      .topWrap {
        display: inline-block;
        width: 194px;
        height: 194px;
        position: relative;
        top: 160px;
        .inside {
          width: 62.18px;
          height: 60.72px;
          position: relative;
          top: -128px;
        }
      }
      
      .mainWrap {
        width: 184px;
        height: 110px;
        position: relative;
        top: 120px;
      }
      
      > div {
        width: 50%;
        margin-top: 150px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:nth-of-type(1) {
          padding-left: 240px;
        }

        &:nth-of-type(4) {
          padding-right: 240px;
        }
        
        &:hover {
          transform: translateY(-10px) scale(1.1);
          filter: brightness(1.1);
        }
      }
      
      img {
        width: 292px;
      }
    }

    .footer {
      width: 100%;
      height: 70px;
      background-image: url('@/assets/data-screen/home/bottom_url.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center center;
    }

    .header {
      width: 100%;
      height: 167px;
      text-align: center;
      background-image: url('@/assets/data-screen/home/top_url.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center center;
      padding-top: 33px;

      img {
        width: 596px;
      }
    }
  }
}

.page {
  position: absolute;
  width: 100%;
  height: 85%;
  top: 100px;
  z-index: 1;
  pointer-events: none;
}

.page::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  width: 15vw;
  height: 100%;
  background-image: url('@/assets/data-screen/home/left_url.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.page::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 0;
  width: 15vw;
  height: 100%;
  background-image: url('@/assets/data-screen/home/right_url.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
