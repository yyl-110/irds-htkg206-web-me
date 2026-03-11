<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
const requestParams = reactive(new ModuleTypeRequestDTOModel());
import { useUserStore } from '@/store/modules/user';
import RxImageList from './imageList.vue';
const loading = ref<boolean>(false);
const userStore = useUserStore();
const nodeList = ref<any>([]);
const categoryid = ref('');
const emit = defineEmits(['actionNode']);

//初始化数据
async function infoReload(categoryidStr: string) {
  try {
    loading.value = true;
    categoryid.value = categoryidStr;
    const data: any = {};
    data.id = categoryidStr;
    const res = await AdminApiSystemModule.getCategpryImgListById(data);
    nodeList.value = res.data.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
}

function actionNode(item: any) {
  emit('actionNode', item);
}

defineExpose({ infoReload });
</script>

<template>
  <div class="imgList">
    <div v-if="!loading">
      <RxImageList :nodeData="nodeList" @actionNode="actionNode" :countFlag="true" />
    </div>
    <div v-else class="example">
      <a-spin tip="加载中..." />
    </div>
  </div>
</template>

<style scoped lang="less">
.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
.imgList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 20px;
  background-color: #ffffff;
  width: auto;
  height: calc(100vh - 122px);
  overflow-y: auto;
}

.imgBox {
  width: 231px;
  height: 210px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #eaeaf1;
  margin-left: 16px;
  cursor: pointer;
  margin-bottom: 16px;
}
.imgBox:hover {
  border-color: rgb(13, 83, 226);
  box-shadow: 0 0 5px 2px rgba(13, 83, 226, 0.2);
}
.imgBox:hover .itemBoxTitle {
  color: #0d53e2;
}

.itemBox1 {
  width: 199px;
  height: 142px;
  border-radius: 4px 4px 4px 4px;
  margin: 16px 16px 10px 16px;
}
.itemBox1 img {
  border-radius: 4px 4px 4px 4px;
}

.itemBoxTitle {
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-left: 16px;
}

.itemInfo {
  word-wrap: break-word;
  word-break: break-all;
}
</style>
