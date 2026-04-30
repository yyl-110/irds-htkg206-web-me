<template>
  <div style="width: 100%;height: 100%;padding: 30px 0">
    <seamless-scroll :speed="400" direction="up" style="height: 100%;">
      <div class="list">
        <div class="item" v-for="(item, index) in userList" :key="index">
          <div style="flex-shrink: 0;" class="wrap">
            <!-- <img :src="avatar1" alt=""> -->
            <div class="rankIndex">{{ index + 1 }}</div>
            <span>{{ item.name }}</span>
          </div>
          <div class="dept">{{ item.groupName }}</div>
        </div>
      </div>
    </seamless-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import seamlessScroll from '@/components/data-screen/seamless-scroll.vue'
import avatar1 from '@/assets/data-screen/base/avatar1.png'
import avatar2 from '@/assets/data-screen/base/avatar2.png'
import rank from "@/assets/data-screen/module/rank.png";

const props = defineProps({
  userList: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="less" scoped>
.list {
  padding: 0 30px;

  .item {
    height: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;

    .dept {
      color: #fff;
      font-size: 14px;
    }

    .wrap {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 10px;
      .rankIndex {
        width: 30px;
        height: 33px;
        background-image: url('@/assets/data-screen/module/rank.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      img {
        width: 30px;
        height: 30px;
        top: 50%;
        transform: translateY(-50%);
        left: -20px;
        border-radius: 50%;
        flex-shrink: 0;
        position: absolute;
      }

      span {
        font-size: 14px;
        color: #fff;
        margin-left: 10px;
      }
    }


    &:nth-child(2n) {
      background: linear-gradient(to right, rgba(0, 111, 255, .41), rgba(0, 119, 255, 0));
    }

    &:nth-child(2n-1) {
      background: linear-gradient(to right, rgba(0, 221, 255, .41), rgba(0, 246, 255, 0));
    }
  }
}
</style>