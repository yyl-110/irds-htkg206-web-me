<template>
  <div class="product-model-finalization">
    <!-- 审批内容 -->
    <!-- <CommonApprovalContent
      v-if="titleList.length > 0"
      :title-list="titleList"
      :data-list="approvalData"
      :opinion="opinion"
      :clickable-fields="clickableFields"
      @search="handleSearch"
      @row-click="handleRowClick"
    /> -->
    
    <!-- 异常信息 -->
    <ApprovalSignInfo
      v-if="showSignInfo"
      :error-title-list="errorTitleList"
      :error-insatnce-list="errorInsatnceList"
      :todo-task="todoTask"
      @click="handleSignInfoClick"
    />
    <el-card class="baseinfo">
      <template #header>
        <div class="baseinfo__header">
          <span>{{ $t('审签信息') }}</span>
        </div>
      </template>
      <el-descriptions
        class="margin-top baseinfo__content"
        :column="1"
        size="large"
        border
      >
        <el-descriptions-item>
          <template #label>
            <div class="label-cell">
              {{ $t('产品配置信息') }}
            </div>
          </template>
          <div class="value-cell">{{ baseInfo.product }}</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="label-cell">
              {{ $t('配置版本信息') }}
            </div>
          </template>
          <div class="value-cell">{{ baseInfo.version }}</div>
        </el-descriptions-item>
        <el-descriptions-item class-name="guide">
          <template #label>
            <div class="label-cell">
              {{ $t('操作指引') }}
            </div>
          </template>
          <div class="value-cell three-line-content">
            <div class="line-item" v-for="item in baseInfo.guide">{{ $t(`${item}`) }}</div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- 表格数据 -->
    <BaseApprovalList
      :tableType="BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_RELEASE"
      :id="id"
      @get-approval-list="getApprovalList"
    />

  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import CommonApprovalContent from './CommonApprovalContent.vue'
import ApprovalSignInfo from '../components/ApprovalSignInfo.vue'
import BaseApprovalList from '@/views/bpm/processInstance/detail/components/ApprovalList.vue'
import { BpmBusinessProcessTypeEnum } from '@/components/config/consts'
import { productGuide } from '@/views/bpm/processInstance/components/config/constant'

type ITableType = BpmBusinessProcessTypeEnum

const props = defineProps<{
  processInstance: any
  titleList: any[]
  approvalData: any[]
  errorTitleList?: any[]
  errorInsatnceList?: any[]
  opinion: string
  todoTask?: any
}>()

const emit = defineEmits<{
  (e: 'search', content: string): void
  (e: 'show-project-config', row: any): void
}>()

const id = ref('') // 获取签审列表所需的productModelId
const tableType = ref('')
const clickableFields = ['name', 'orderNo', 'areaConfigName', 'designModel']
const baseInfo = reactive({
  product: '',
  version: '',
  guide: productGuide
})
const showSignInfo = computed(() => {
  return props.errorInsatnceList && props.errorInsatnceList.length > 0
})

const handleSearch = (content: string) => {
  emit('search', content)
}

const handleRowClick = (row: any, field: string) => {
  if (!clickableFields.includes(field)) {
    return
  }

  emit('show-project-config', row)
}

const handleSignInfoClick = (row: any, field: string) => {
  if (clickableFields.includes(field)) {
    handleRowClick(row, field)
  }
}
// 拿到签审列表数据
const getApprovalList = (list) => {
  const itemInfoList = list.map((item) => `${item.number || ''} ${item.configVersion || ''} ${item.version || ''}`)
  baseInfo.version = itemInfoList.filter((item) => item !== '').join('：')
}
// 流程类型
watch(() => props.processInstance.formVariables?.PROCESS_BUSINESS_TYPE, 
  async (businessType: ITableType) =>{
    tableType.value = businessType
  },
  { immediate: true }
)
// 为流程签审列表提供的源数据
watch(() => props.processInstance.formVariables?.BUSINESS_COLLECTION_VALUE, 
  (value) =>{
    id.value = JSON.parse(value)?.[0].id
  },
  { immediate: true }
)
// 获取基本信息中的产品配置信息
watch(() => [props.approvalData, props.processInstance.formVariables.PROCESS_BUSINESS_TYPE_NAME], 
  ([value1, value2]) =>{
    baseInfo.product = value1?.[0]?.name || value2.split(': ')[1]
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.product-model-finalization {
  width: 100%;
}

.baseinfo {
  margin: 10px;
  min-height: 100px;
  margin-right: 30px;
  width: calc(100% - 40px);
  max-width: calc(100% - 40px);
  box-sizing: border-box;
  overflow: hidden;
  &__header{
    font-weight: 700;
  }
   &__content {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    .label-cell {
      min-width: 100px;
      width: 100px;
      flex-shrink: 0;
      font-weight: 500;
      padding-right: 8px;
    }
    :deep(.guide){
      padding: 0 !important;
      .three-line-content{
        .line-item {
          padding: 12px 15px;
          border-bottom: 1px solid #ebeef5;
        }

        .line-item:last-child {
          border-bottom: none;
        }
      }
    }
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
}
</style>
