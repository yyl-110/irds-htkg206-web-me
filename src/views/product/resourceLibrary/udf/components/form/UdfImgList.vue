<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';

const emit = defineEmits(['actionNode', 'getCategory']);

const loading = ref(false);
const nodeList = ref<any[]>([]);
const categoryid = ref('');
const menuId = ref<any>('');

async function infoReload(categoryidStr: string, menuid: any, _query?: string) {
  loading.value = true;
  try {
    categoryid.value = categoryidStr;
    menuId.value = menuid;
    const res = await AdminApiSystemModule.getCategpryImgListById({ id: categoryidStr });
    nodeList.value = res?.data?.data || [];
  } catch (error) {
    message.error('加载模型图列表失败');
  } finally {
    loading.value = false;
  }
}

function handleClick(item: any) {
  emit('actionNode', item);
}

defineExpose({ infoReload });
</script>

<template>
  <div class="img-list">
    <a-spin :spinning="loading" tip="加载中...">
      <div v-if="nodeList.length" class="cards">
        <div v-for="item in nodeList" :key="item?.id || item?.moduleId || item?.name" class="card" @click="handleClick(item)">
          <div class="title">{{ item?.name || item?.moduleName || '--' }}</div>
          <div class="desc">{{ item?.para1 || item?.remarks || '点击进入详情' }}</div>
        </div>
      </div>
      <a-empty v-else description="暂无数据" />
    </a-spin>
  </div>
</template>

<style scoped lang="less">
.img-list {
  height: 100%;
  padding: 12px;
  overflow: auto;
  background: #fff;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.card {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.card:hover {
  border-color: #1677ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.title {
  color: #222;
  font-weight: 600;
  margin-bottom: 6px;
}
.desc {
  color: #888;
  font-size: 12px;
}
</style>
