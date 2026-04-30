<template>
  <div style="width: 100%;height: 100%;padding: 30px 0">
    <seamless-scroll :speed="800" direction="up" style="height: 100%;">
      <div class="list">
        <div class="item" v-for="(item, index) in userList" :key="index">
          <div style="flex-shrink: 0;">
            <img :src="avatar1" alt="">
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

    >div {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 20px;

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