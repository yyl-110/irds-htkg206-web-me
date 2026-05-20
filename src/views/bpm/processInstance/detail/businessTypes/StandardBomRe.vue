<template>
  <div>
    <el-card style="margin: 10px; min-height: 100px; margin-right: 30px">
      <el-descriptions
        class="margin-top descriptions-container"
        :column="1"
        size="large"
        border
        v-if="procErros && procErros.length > 0"
      >
        <el-descriptions-item v-if="procErros">
          <template #label>
            <div class="cell-item label-cell">
              错误信息
            </div>
          </template>
          <div class="value-cell error-message-cell" v-if="procErros">
            {{ procErros }}
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="流程正常" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  processInstance: any
  titleList: any[]
  approvalData: any[]
  errorTitleList?: any[]
  errorInsatnceList?: any[]
  opinion: string
  todoTask: any
  showColorTip?: boolean
  orderBomColorReq?: any
}>()

const emit = defineEmits<{
}>()
const procErros = ref<any>('')
onMounted(() => {
  if(props.processInstance) {
    const formVariables: any = props.processInstance.formVariables
    if(formVariables) {
      if(formVariables.BUSINESS_ERROR_MESSAGE_VALUE) {
        const errorMsgs = JSON.parse(formVariables.BUSINESS_ERROR_MESSAGE_VALUE)
        if(errorMsgs && errorMsgs.length > 0) {
          procErros.value = errorMsgs[0]?.genStaMbomErrorKey
            || errorMsgs[0]?.pushScpErrorKey || errorMsgs[0]?.errorMsgs
        }
      }
      if(formVariables.errorMsgs) {
        procErros.value = formVariables.errorMsgs
      }
    }
  }
})
</script>

<style lang="scss" scoped>

.descriptions-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  :deep(.el-descriptions__body) {
    width: 100%;
    overflow: hidden;
  }

  :deep(.el-descriptions__table) {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  :deep(.el-descriptions__label) {
    width: 100px !important;
    min-width: 100px !important;
    max-width: 100px !important;
    box-sizing: border-box;
    padding: 8px 8px 8px 12px;
  }

  :deep(.el-descriptions__content) {
    width: calc(100% - 100px) !important;
    min-width: calc(100% - 100px) !important;
    max-width: calc(100% - 100px) !important;
    box-sizing: border-box;
    padding: 8px 12px 8px 8px;
  }

  :deep(.el-descriptions__cell) {
    word-break: break-all;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;
    overflow: hidden;
  }
}

.label-cell {
  min-width: 100px;
  width: 100px;
  flex-shrink: 0;
  font-weight: 500;
  padding-right: 8px;
}

.value-cell {
  width: 100%;
  word-break: break-all;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
}

.error-message-cell {
  max-width: 100%;
  width: 100%;
  word-break: break-all;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.4;
  font-size: 13px;
  color: #f56c6c;
  border-radius: 4px;
  box-sizing: border-box;
  display: block;
}
</style>