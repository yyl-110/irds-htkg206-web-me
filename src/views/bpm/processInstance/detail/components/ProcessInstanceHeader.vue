<template>
  <div class="process-instance-header">
    <img
      v-if="processInstance.status != null && auditIconsMap[processInstance.status]"
      class="process-instance-stamp position-absolute right-50px top-24px"
      :class="{ 'process-instance-stamp--animate': stampAnimated }"
      width="100"
      :src="auditIconsMap[processInstance.status]"
      alt="" />
    <div class="flex items-center gap-5 mb-10px h-40px truncate">
      <div class="text-26px font-bold mb-2px">
        <span v-if="taskName">{{ taskName }} -</span>
        {{ processInstance.formVariables?.PROCESS_BUSINESS_TYPE_NAME }}
      </div>
      <dict-tag
        v-if="processInstance.status"
        :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS"
        :value="processInstance.status" />
    </div>

    <div class="flex items-center gap-5 mb-10px text-13px h-35px">
      <div class="bg-gray-100 h-35px rounded-3xl flex items-center p-8px gap-2 dark:color-gray-600">
        <el-avatar :size="28" v-if="processInstance?.startUser?.avatar" :src="processInstance?.startUser?.avatar" />
        <el-avatar :size="28" v-else-if="processInstance?.startUser?.nickname">
          {{ processInstance?.startUser?.nickname.substring(0, 1) }}
        </el-avatar>
        {{ processInstance?.startUser?.nickname || processInstance.startUser?.psnName }}
      </div>
      <div class="text-#878c93">{{ formatDate(processInstance.startTime) }} {{ $t('提交') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { formatDate } from '@/utils/formatTime';
import { DICT_TYPE } from '@/utils/dict';
import DictTag from '@/components/DictTag/src/DictTag.vue';

const props = defineProps<{
  id: string;
  processInstance: any;
  auditIconsMap: Record<number, string>;
  taskDefinitionKey: string;
  taskName: string;
}>();

const stampAnimated = ref(false);
let stampPlayed = false;

watch(
  () => props.processInstance?.status,
  status => {
    if (stampPlayed || status == null || !props.auditIconsMap[status]) return;
    stampPlayed = true;
    stampAnimated.value = false;
    nextTick(() => {
      setTimeout(() => {
        stampAnimated.value = true;
      }, 500);
    });
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.position-absolute {
  position: absolute;
}
.truncate {
  font-size: 14px;
  color: #161e2e;
}
.process-instance-header {
  position: relative;
}

.process-instance-stamp {
  transform-origin: 50% 50%;
  opacity: 0;
  pointer-events: none;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.process-instance-stamp--animate {
  animation: process-instance-stamp-press 0.48s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes process-instance-stamp-press {
  0% {
    opacity: 0;
    transform: rotate(-58deg) scale(1.82) translate3d(0, -34px, 0);
  }
  16% {
    opacity: 0.35;
    transform: rotate(-45deg) scale(1.58) translate3d(0, -24px, 0);
  }
  32% {
    opacity: 0.58;
    transform: rotate(-35deg) scale(1.36) translate3d(0, -14px, 0);
  }
  48% {
    opacity: 0.78;
    transform: rotate(-25deg) scale(1.16) translate3d(0, -4px, 0);
  }
  62% {
    opacity: 0.9;
    transform: rotate(-20deg) scale(1.06) translate3d(0, 2px, 0);
  }
  76% {
    opacity: 0.97;
    transform: rotate(-15deg) scale(0.99) translate3d(0, 0, 0);
  }
  88% {
    opacity: 1;
    transform: rotate(-10deg) scale(1.01) translate3d(0, 0, 0);
  }
  100% {
    opacity: 1;
    transform: rotate(-10deg) scale(1) translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .process-instance-stamp {
    opacity: 1;
  }

  .process-instance-stamp--animate {
    animation: none;
    transform: rotate(-8deg);
  }
}
</style>
