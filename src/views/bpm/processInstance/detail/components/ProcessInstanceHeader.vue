<template>
  <div class="process-instance-header">
    <img
      class="position-absolute right-20px top-35px"
      width="150"
      :src="auditIconsMap[processInstance.status]"
      alt="" />
    <div class="text-#878c93 h-15px">{{ $t('编号：') }}{{ id }}</div>
    <el-divider class="!my-8px" />
    <div class="flex items-center gap-5 mb-10px h-40px truncate">
      <div class="text-26px font-bold mb-5px">
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
import { formatDate } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
import DictTag from '@/components/DictTag/src/DictTag.vue'
defineProps<{
  id: string
  processInstance: any
  auditIconsMap: Record<number, string>
  taskDefinitionKey: string
  taskName: string
}>()
</script>

<style lang="scss" scoped>
.position-absolute {
  position: absolute;
}
.truncate {
  font-size: 22px;
  color: #161e2e;
}
.process-instance-header {
  position: relative;
}
</style>
