<template>
  <draggabl-modal
    :visible="dialogVisible1"
    title="地图详情"
    :width="600"
    :footer="null"
    :mask-closable="false"
    @cancel="handleClose"
  >
    <img class="image" :src="objData?.coverFileUrl" alt="" />
    <div class="title">
      <div class="text">名称：{{ objData?.name }}</div>
      <a-progress
        class="progress"
        :percent="objData?.percent"
        :show-info="false"
        size="small"
      />
      <PlayCircleOutlined class="iconColor" @click="player" />
    </div>
    <div>摘要：{{ objData?.summary }}</div>
  </draggabl-modal>
</template>

<script lang="ts" setup>
import { PlayCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { startLearning } from '@/api/knowledge';
import { useUserStore } from '@/store/modules/user';
import draggableModal from "@/components/DraggableModal/index.vue";

const router = useRouter();

const props = defineProps<{
  dialogVisible1: boolean;
  objData: Record<string, any>;
}>();

const emit = defineEmits(['getList1', 'closeDiaDetail1']);

const player = async () => {
  const params = {
    taskMapId: props.objData.id,
    userId: useUserStore().getUser.id,
  };
  const res = await startLearning(params);
  if (res && res.data.code === '0') {
    emit('getList1');
    emit('closeDiaDetail1');
    router.push({ path: '/knowledge/createTaskMap' });
  } else {
    message.error(res?.data?.msg || '开始学习失败');
  }
};

const handleClose = () => {
  emit('closeDiaDetail1');
};
</script>

<style lang="less" scoped>
.image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
}

.title {
  display: flex;
  align-items: center;
  margin: 12px 0 8px;

  .text {
    white-space: nowrap;
    line-height: 24px;
    margin-right: 10px;
  }

  .progress {
    flex: 1;
    margin-right: 10px;
  }

  .iconColor {
    font-size: 24px;
    color: #ff8800;
    cursor: pointer;
    flex-shrink: 0;
  }
}
</style>
