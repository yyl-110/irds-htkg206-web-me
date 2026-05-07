<template>
  <div class="order-config-process">
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

    <!-- 审签信息 -->
    <!-- <ApprovalSignInfo
      v-if="showSignInfo"
      :error-title-list="errorTitleList"
      :error-insatnce-list="errorInsatnceList"
      :todo-task="todoTask"
      :order-bom-color-req="processInstance.formVariables?.orderBomColorReq"
      :show-color-tip="true"
      @click="handleSignInfoClick"
    /> -->
    <ExceptionInformation :error-insatnce-list="errorInsatnceList" :remark = "remark"/>
    <el-card
      class="error-info-card"
      v-if="props.errorInsatnceList && props.errorInsatnceList.length > 0"
    >
      <template #header>
        <div class="card-header">
          <span>{{ $t('审签信息') }}</span>
        </div>
      </template>
      <!-- <div v-if="props.errorInsatnceList && props.errorInsatnceList.length > 0">
        <div v-for="(intstance, index2) in props.errorInsatnceList" :key="index2">
          <div v-for="(item, index3) in props.errorTitleList" :key="index3">
            <el-row class="intstance-row" v-if="intstance[item.key]">
              <el-form-item :label="item.value + ':'" class="i-r-l">
                <span
                  style="font-weight: 300"
                  :style="handleStyle(item.key)"
                  @click="handleRowClick(intstance, item.key)"
                >
                  {{ intstance[item.key] }}
                </span>
              </el-form-item>
            </el-row>
          </div>
        </div>
      </div> -->
      <el-descriptions
        class="margin-top descriptions-container"
        :column="1"
        size="large"
        border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item label-cell">
              {{ $t('订单编号') }}
            </div>
          </template>
          <div class="value-cell">
            {{ props.errorInsatnceList[0]['orderNo'] }}
            <el-button type="primary" plain size="small" @click="showSuperBomDrawer(props.errorInsatnceList[0])">
              {{ $t('查看单车BOM') }}
            </el-button>
            <el-button type="primary" plain size="small" @click="showEpCompareDrawer(props.errorInsatnceList[0])">
              {{ $t('查看订单BOM与可配置BOM对比') }}
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item label-cell">
              {{ $t('配置识别码') }}
            </div>
          </template>
          <div class="value-cell">
            {{ configIdenInfo?.configIden }}
            <span v-if="configIdenInfo?.configIden?.endsWith('.E')"
              style="color: red; margin-left: 15px; cursor: default; font-weight: 800;">
              {{ $t('特配订单需要全部审核') }}
            </span>
            <span v-else-if="configIdenInfo?.apprDate && configIdenInfo?.apprDate !== '' && configIdenInfo?.apprDate !== null"
            >
              <span v-if="isFirstApproval" style="margin-left: 10px; color: red;font-weight: 800;">
                {{ $t('首次审签') }}
              </span>
              <span v-else style="color: #409EFF; margin-left: 15px; cursor: default; font-weight: 800;">
                {{$t("最后审签时间:")}} {{ configIdenInfo?.apprDate }}
              </span>
            </span>
            <span v-else style="color: red;font-weight: 800;">
              {{ $t('首次审签') }}
            </span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item label-cell">
              {{ $t('特配需求') }}
            </div>
          </template>
          <div class="value-cell">
            {{ specialReqInfos }}
            <el-button type="primary" v-if="ifModuleReqInfos" plain size="small" @click="ifModuleReqInfosShow = true">
              {{ $t(MODULEREQUIRES_NAME) }}
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item class-name="guide">
          <template #label>
            <div class="cell-item label-cell">
              {{ $t('操作指引') }}
            </div>
          </template>
          <div class="value-cell three-line-content">
            <div class="line-item" v-for="item in orderApprovalGuides">{{ $t(`${item}`) }}</div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <!-- <div style="height: 300px" v-else>
        <Empty text="暂无审核信息" />
      </div> -->
      <div style="color:red;margin-top: 15px;"
        v-if="todoTask?.name.includes('工艺审核') && orderBomColorReq"
      >
      <gs-icon svg icon="icon_prompt" size="18px" style="margin-right: 5px" />
      {{ $t('该订单涉及颜色需求，请基于该订单指定对应的颜色标识') }}
    </div>
    </el-card>

    <el-card
      class="error-info-card"
      v-if="!props.errorInsatnceList || props.errorInsatnceList.length == 0"
    >
      <template #header>
        <div class="card-header">
          <span>{{ $t('审签信息') }}</span>
        </div>
      </template>
      <div style="height: 300px">
        <Empty text=" ">
          <template #emptyTip>
            <span style="color:red;">{{ $t('流程异常，缺少流程变量，请联系管理员') }}</span>
          </template>
        </Empty>
      </div>
    </el-card>
    <!-- 表格数据 -->
    <BaseApprovalList :tableType="BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS" />
     <!-- 模块信息弹窗 -->
    <el-dialog
      v-model="ifModuleReqInfosShow"
      :title="MODULEREQUIRES_NAME"
      width="75%"
      :close-on-click-modal="false"
    >
      <template #header>
        <span style="font-weight: 700;color: #161e2e; font-size: 18px;">{{ MODULEREQUIRES_NAME  }}</span>
      </template>
      <div class="moduleinfo">
        <template v-for="item in Object.keys(moduleReqInfosKeys)">
          <!--国内 是1否2转换 -->
          <div v-if="ifOrderSourceCN && ['newproduct','chassisproduct','new_warranty','islicensed','needstestreport','militaryproduct'].includes(item) && moduleReqInfos.hasOwnProperty(item)" class="moduleinfo--item">
            <div class="itemkey">{{ moduleReqInfosKeys[item] }}：</div>
            <div class="itemvalue">{{ loadConstants('stateOptions', moduleReqInfos[item]) }}</div>
          </div>
          <!--国外 是1否0转换 -->
          <div v-if="!ifOrderSourceCN && ['newproduct','commodityInspection','waxSpray'].includes(item) && moduleReqInfos.hasOwnProperty(item)" class="moduleinfo--item">
            <div class="itemkey">{{ moduleReqInfosKeys[item] }}：</div>
            <div class="itemvalue">{{ loadConstants('stateOptionsZero', moduleReqInfos[item]) }}</div>
          </div>
          <!-- 转换 -->
          <div v-else-if="['chassisprocurement','enginespecification','provinceid','workingpower','testreportype', 'workEvnNeed', 'transportationNeed', 'packageNeed'].includes(item) && moduleReqInfos.hasOwnProperty(item)" class="moduleinfo--item">
            <div class="itemkey">{{ moduleReqInfosKeys[item] }}：</div>
            <div class="itemvalue">{{ keyTOptions(item, moduleReqInfos[item]) }}</div>
          </div>
          <!-- 时间 转换 -->
          <div v-else-if="item == 'deliverydate' && moduleReqInfos.hasOwnProperty(item)" class="moduleinfo--item">
            <div class="itemkey">{{ moduleReqInfosKeys[item] }}：</div>
            <div class="itemvalue">{{ timestampToDateString(moduleReqInfos[item]) }}</div>
          </div>
          <!-- 城市 转换 -->
          <div v-else-if="item == 'cityid' && moduleReqInfos.hasOwnProperty(item)" class="moduleinfo--item">
            <div class="itemkey">{{ moduleReqInfosKeys[item] }}：</div>
            <div class="itemvalue">{{ cityOptions(moduleReqInfos.provinceid, moduleReqInfos[item]) }}</div>
          </div>
          <div v-else-if="moduleReqInfos.hasOwnProperty(item)" class="moduleinfo--item">
            <div class="itemkey">{{ moduleReqInfosKeys[item] }}：</div>
            <div class="itemvalue">{{  moduleReqInfos[item] }}</div>
          </div>
        </template>
      </div>
      <template #footer>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import {
  getSingleCarEbomListParamFromOrder,
  getDesignModelByOrderId,
  getAreaSaleInfo,
  getCountry,
  getRegions,
} from '@/api/productConfig'
import { getConfigIdenInfo, getOrderConfigDetail } from '@/api/orderBom'
import { BpmBusinessProcessTypeEnum } from '@/components/config/consts'
import { orderApprovalGuide } from '@/views/bpm/processInstance/components/config/constant'
import ExceptionInformation from '@/views/bpm/processInstance/detail/components/ExceptionInformation.vue'
import BaseApprovalList from '@/views/bpm/processInstance/detail/components/ApprovalList.vue'
import { moduleReqKeyTLabelCN, moduleReqKeyTLabelEN, constantsList, cityList } from '@/views/Order/component/constant'
import { timestampToDateString } from '@/utils/formatTime'

interface IReqInfo{
  modType: string,
  reqDesc: string
}

const MODULEREQUIRES_NAME = '模块需求'
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

const moduleReqInfosKeys = computed(() => ifOrderSourceCN.value ? moduleReqKeyTLabelCN : moduleReqKeyTLabelEN)
// 特配需求数据
const requireInfos = ref<IReqInfo[]>([])
const ifModuleReqInfosShow = ref(false)
const orderApprovalGuides = ref(orderApprovalGuide)
const areaSaleConfigId = ref('')
const remark = ref('')
const ifOrderSourceCN = ref(true)
const specialReqInfos = computed(() => {
  const matchReqInfos = requireInfos.value.filter((item) => item.modType !== MODULEREQUIRES_NAME)
  const reqInfoList = matchReqInfos.map((item) => {
    if(item.modType == '防腐特殊需求'){
      return `${item.modType}：${item.reqDesc || ''}；防腐等级：${item['reqDescLevel'] || ''}`
    }
    return item.modType ? `${item.modType}：${item.reqDesc || ''}` : item.reqDesc || ''
  })
  return reqInfoList.filter((item) => item).join('；')
})
const ifModuleReqInfos = computed(() => requireInfos.value.some((item) => item.modType == MODULEREQUIRES_NAME))
const moduleReqInfos = computed(() => {
  const infos = JSON.parse(requireInfos.value.find((item) => item.modType == MODULEREQUIRES_NAME)?.reqDesc || '{}')
  return infos
})

const orderBomColorReq = computed(() => props.processInstance.formVariables?.orderBomColorReq == true)
const emit = defineEmits<{
  (e: 'search', content: string): void
  (e: 'show-super-bom', data: { areaSConfigId: string; type: string; bomData: any }): void
  (e: 'show-ep-compare', data: { orderId: string; orderNo: string; designModelId: string; configNo: string }): void
}>()

const configIdenInfo = ref<{
  configIden?: string
  apprDate?: string
}>({})

// 判断是否为首次审签（审签时间超过2天）
const isFirstApproval = computed(() => {
  if (!configIdenInfo.value?.apprDate) {
    return false
  }

  const apprDate = new Date(configIdenInfo.value.apprDate)
  const currentDate = new Date()
  const diffTime = currentDate.getTime() - apprDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays >= 2
})
// 模块需求 下拉选项value匹配label显示
const keyTOptions = (objKey, objVal) => {
  const optionKey = {
    chassisprocurement: 'purchaseOptions',
    enginespecification: 'engineOptions',
    provinceid: 'provinceList',
    workingpower: 'powerSupplyOptions',
    testreportype: 'testreportypeOptions',
    workEvnNeed: 'workingEnvironmentOptions',
    transportationNeed: 'transportationNeedOptions',
    packageNeed: 'packageNeedOptions'
  }
  return loadConstants(optionKey[objKey], objVal)
}
const loadConstants = (key, val) => constantsList[key]?.find(item => item.value === val)?.label || '';
// 城市名称根据城市id转换显示
const cityOptions =  (provinceKey, cityKey) => {
  return  cityList(provinceKey)?.find(item => item.value === cityKey)?.label || '';
}
// 显示单车BOM抽屉
const showSuperBomDrawer = async (row: any) => {
  let areaSConfigId = ''
  let type = '' // 0:研发审核点单签审流程  1:区域销售配置表变更审签流程

  if (
    props.processInstance.formVariables?.PROCESS_BUSINESS_TYPE ===
    BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS
  ) {
    areaSConfigId = row.orderId
    type = '0'
  } else {
    type = '1'
    areaSConfigId = row.areaSaleConfigId
  }

  try {
    const res = await getSingleCarEbomListParamFromOrder({ orderId: row.orderId })
    if (res.code === 800) {
      emit('show-super-bom', {
        areaSConfigId,
        type,
        bomData: res.data
      })
    }
  } catch (error) {
    console.error('获取单车BOM数据失败:', error)
  }
}

// 显示EP对比抽屉
const showEpCompareDrawer = async (row: any) => {
  try {
    const res = await getDesignModelByOrderId({ orderId: row.orderId })
    if (res.code === 800) {
      emit('show-ep-compare', {
        orderId: row.orderId,
        orderNo: row.orderNo,
        designModelId: res.data.designModelId,
        configNo: res.data.configNo
      })
    }
  } catch (error) {
    console.error('获取设计模型数据失败:', error)
  }
}

// 获取特配需求展示内容
const getSpecialRequires = async() => {
  const orderNo = props.errorInsatnceList?.[0]['orderNo']
  const res = await getOrderConfigDetail({ orderNo })
  if(res.code == 800){
    requireInfos.value = res.data.orderInfo.reqInfos || []
    ifOrderSourceCN.value = res.data.orderInfo.orderSource == '国内CRM' ? true : false
    if( res.data.areaSaleConfigs[0]){
      areaSaleConfigId.value = res.data.areaSaleConfigs[0].areaConfigId
      const areaMsg = await getAreaSaleInfo({ areaConfigId: areaSaleConfigId.value })
      const areaConfigNo = areaMsg.data.areaConfigNo
      if(props.errorInsatnceList?.[0]?.['errorMsgs'].includes(areaConfigNo)){
        remark.value = areaMsg.data.remark
      }
    }
    if(!ifOrderSourceCN.value){
      getAreaMatchCountry()
    }
  }
}
// 模块需求里大区和国家简称转中文
const getAreaMatchCountry = async() => {
  const regionCode = moduleReqInfos.value.overSeaArea
  let regionId = ''
  const countryCode = moduleReqInfos.value.overSeaCountry
  const resArea = await getRegions({})
  if(resArea.code == 800){
    moduleReqInfos.value.overSeaArea = resArea.data.find((item) => item.regionCode == regionCode)?.regionName
    regionId = resArea.data.find((item) => item.regionCode == regionCode)?.regionId
  }
  if(regionId){
    const resCountry = await getCountry({ regionId })
    if(resCountry.code == 800){
      moduleReqInfos.value.overSeaCountry = resCountry.data.find((item) => item.countryCode == countryCode)?.countryName
    }
  }
  
}
onMounted(() => {
  // 基于订单Id获取配置识别码以及最后签审时间
  const params = {
    orderId: props.errorInsatnceList?.[0]?.orderId,
    procId: props.processInstance.id
  }
  if(params.orderId){
    getConfigIdenInfo(params).then(res => {
      configIdenInfo.value = res.data
    })
  }else{
    configIdenInfo.value = {
      configIden: ''
    }
  }
  // 特配需求
  getSpecialRequires()
})
</script>

<style lang="scss" scoped>
.order-config-process {
  width: 100%;
}

.error-info-card {
  margin: 10px;
  min-height: 100px;
  margin-right: 30px;
  width: calc(100% - 40px);
  max-width: calc(100% - 40px);
  box-sizing: border-box;
  overflow: hidden;
  .card-header{
    font-weight: 700;
  }
  :deep(.el-card__body) {
    padding: 16px;
    overflow: hidden;
  }
}

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
  background-color: #fef0f0;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #fbc4c4;
  box-sizing: border-box;
  display: block;
}
.moduleinfo{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
  &--item{
    display: flex;
    align-items: center;
    .itemkey{
      min-width: 80px;
      color: #7D8695;
    }
    .itemvalue{
      flex: 1;
      color: #161e2e;
    }
  }
}
</style>
