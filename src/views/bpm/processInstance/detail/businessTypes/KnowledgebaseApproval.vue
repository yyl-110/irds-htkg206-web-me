<template>
  <div class="knowledge-base-approval">
    <text-card v-if="cardType === KnowledgeCardType.TEXT && modelItem" :text-data="modelItem" hide-submit-audit />
    <video-card v-else-if="cardType === KnowledgeCardType.VIDEO && modelItem" :video-data="modelItem" hide-submit-audit />
    <img-card v-else-if="cardType === KnowledgeCardType.IMAGE && modelItem" :img-data="modelItem" hide-submit-audit />
    <el-empty v-else description="暂无知识审批数据" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import TextCard from '@/views/product/knowledge/sys/components/textCard.vue';
import VideoCard from '@/views/product/knowledge/sys/components/videoCard.vue';
import ImgCard from '@/views/product/knowledge/sys/components/imgCard.vue';
import { KnowledgeCardType } from '@/enums/Knowledgebase';

const props = defineProps<{
  processInstance: any;
  titleList: any[];
  opinion: string;
}>();

function getFormVariables() {
  return props.processInstance?.formVariables ?? props.processInstance?.processVariables ?? {};
}

const modelList = computed<any[]>(() => {
  const list = getFormVariables().ModelList;
  return Array.isArray(list) ? list : [];
});

const modelItem = computed(() => modelList.value[0] ?? null);

const cardType = computed(() => modelItem.value?.cardType ?? '');
</script>

<style lang="scss" scoped>
.knowledge-base-approval {
  width: 100%;
  padding: 10px 10px 10px 0;
}
</style>
