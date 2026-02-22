<template>
  <div style="margin-left: 20px">
    <div class="calculateItem" v-for="item in nodeData" :key="item.id">
      <div class="Img-box">
        <img :src="item.imageFileUrl != null && item.imageFileUrl != '' ? item.imageFileUrl : imgSrc()" style="width: 256px; height: 185px" @click="actionNode(item)" />
      </div>

      <div class="calclation-content">
        <div class="title-text">{{ item.nodeName }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';
const emit = defineEmits(['actionNode']);
const props = defineProps({
  nodeData: {
    type: Array,
    default: [],
  },
});
function imgSrc() {
  return new URL(`@/assets/images/noimg.jpg`, import.meta.url).href;
}
const actionNode = item => {
  emit('actionNode', item);
};
</script>
<style lang="less" scoped>
.calculateItem {
  position: relative;
  width: 256px;
  float: left;
  margin-bottom: 25px;
  margin-right: 25px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: block;
  background: #cbdcf5;
  box-shadow: 0 0 15px 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
}
.calculateItem:hover {
  transform: translateY(-10px);
  background: #1971ff;
  color: #fff;

  .calclation-content {
    color: #fff;
    display: flex;
    justify-content: space-between;
  }

  .calclation-content2 {
    color: #fff;
  }
}

.Img-box {
  position: relative;
  display: block;
  width: 100%;
  height: 192px;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  img {
    width: 100%;
    height: 100%;
  }
}

.calclation-content {
  width: 100%;
  padding: 10px 20px 15px 20px;
  text-align: center;
  color: #222222;
  display: flex;
  justify-content: space-between;
}

.calclation-content2 {
  width: 100%;
  padding: 10px 20px 15px 20px;
  text-align: center;
  color: #222222;
}
.title-text {
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}
</style>
