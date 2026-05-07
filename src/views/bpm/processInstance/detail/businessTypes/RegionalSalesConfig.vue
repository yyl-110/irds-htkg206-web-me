<template>
  <div class="regional-sales-config">
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
              {{ $t('配置版本信息') }}
            </div>
          </template>
          <div class="value-cell">{{ baseInfo.product }}</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="label-cell">
              {{ $t('产品配置信息') }}
            </div>
          </template>
          <div class="value-cell">{{ baseInfo.version }}</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="label-cell">
              {{ $t('区域配置表信息') }}
            </div>
          </template>
          <div class="value-cell">{{ baseInfo.areaVersion }}</div>
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
    <!-- 审批内容 -->
    <CommonApprovalContent
      v-if="titleList.length > 0"
      :title-list="titleListShow"
      :data-list="approvalData"
      :opinion="opinion"
      :clickable-fields="clickableFields"
      @search="handleSearch"
      @row-click="handleRowClick"
    />

    
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CommonApprovalContent from './CommonApprovalContent.vue'
import ApprovalSignInfo from '../components/ApprovalSignInfo.vue'
import { areaGuide } from '@/views/bpm/processInstance/components/config/constant'

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
}>()

const router = useRouter()

// 可点击的字段
const clickableFields = [ 'areaConfigNo' ]
const titleListShow = ref<any[]>([])
const baseInfo = reactive({
  product: '',
  version: '',
  areaVersion: '', 
  guide: areaGuide
})
// 是否显示审签信息
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

  // 跳转到区域销售配置详情页
  router.push({
    path: '/bpm/process-instance/areasalesdetail',
    query: {
      modalType: 'detail',
      areaConfigId: row?.areaConfigId,
    }
  })
}

const handleSignInfoClick = (row: any, field: string) => {
  if (clickableFields.includes(field)) {
    handleRowClick(row, field)
  }
}

watch(() => props.titleList, (newVal) => {
  const sortObj = {
    areaConfigNo: 1,areaConfigName: 2,saleModel: 3,
    productModel: 4,saleArea: 5,countryName: 6,
    colorSolution: 7,basePartNo: 8,areaSaleConfigVer: 9,
    createdBy: 10,lastUpdatedBy: 11,lastUpdatedDate: 12,
  }
  titleListShow.value = newVal.sort((item1, item2) => sortObj[item1.key] - sortObj[item2.key])
}, {
  immediate: true,
  deep: true
})
// 获取基本信息中的产品配置信息
watch(() => [props.approvalData, props.processInstance.formVariables], 
  ([value1, value2]) =>{
    if(value1.length > 0){
      const { productModel = '', areaConfigNo = '', areaConfigName = '', areaSaleConfigVer = '' } = value1?.[0]
      baseInfo.product = productModel
      baseInfo.areaVersion = `${areaConfigNo} ${areaConfigName} ${areaSaleConfigVer}`
    }
    const { configVersionNo = '', configVersionVer = '', configVersion = '' } = value2
    baseInfo.version = `${configVersionNo} ${configVersion} ${configVersionVer}`
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.regional-sales-config {
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
