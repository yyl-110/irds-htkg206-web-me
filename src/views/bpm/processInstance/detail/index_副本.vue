<template>
  <ContentWrap :bodyStyle="{ padding: '10px 20px 0' }" class="position-relative" v-loading="loadingFlag">
    <div class="processInstance-wrap-main">
      <el-scrollbar>
        <img class="position-absolute right-20px" width="150" :src="auditIconsMap[processInstance.status]" alt="" />
        <div class="text-#878c93 h-15px">{{ $t('编号：') }}{{ id }}</div>
        <el-divider class="!my-8px" />
        <div class="flex items-center gap-5 mb-10px h-40px">
          <div class="text-26px font-bold mb-5px">{{ processInstance.formVariables?.PROCESS_BUSINESS_TYPE_NAME }}</div>
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

        <el-tabs v-model="activeTab">
          <!-- 表单信息 -->
          <el-tab-pane :label="$t('审批详情')" name="form">
            <div class="form-scroll-area">
              <el-scrollbar>
                <el-row>
                  <el-col :span="17" class="!flex !flex-col formCol">
                    <!-- 表单信息 -->
                    <div v-loading="processInstanceLoading" class="form-box flex flex-col mb-30px flex-1">
                      <!-- 情况一：流程表单 -->
                      <!-- <el-col v-if="processDefinition?.formType === BpmModelFormType.NORMAL">
                        <form-create
                          v-model="detailForm.value"
                          v-model:api="fApi"
                          :option="detailForm.option"
                          :rule="detailForm.rule"
                        />
                      </el-col> -->
                      <!-- 情况二：业务表单 -->
                      <!-- <div v-if="processDefinition?.formType === BpmModelFormType.CUSTOM">
                        <BusinessFormComponent :id="processInstance.businessKey" />
                      </div> -->

                      <!-- 新增审批详情信息展示在提交页面提交后再进行展示 -->
                      <el-card
                        style="margin: 10px; min-height: 100px; margin-right: 30px"
                        v-if="
                          processInstance?.formVariables?.PROCESS_BUSINESS_TYPE !=
                            BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS &&
                          processInstance.formVariables?.PROCESS_BUSINESS_TYPE !=
                            BpmBusinessProcessTypeEnum.FORWARD_DATA_FAIL &&
                          processInstance.formVariables?.PROCESS_BUSINESS_TYPE !=
                            BpmBusinessProcessTypeEnum.STANDARD_BOM_RE &&
                          processInstance.formVariables?.PROCESS_BUSINESS_TYPE !=
                            BpmBusinessProcessTypeEnum.TASK_OWNER_NOTICE
                        ">
                        <template #header>
                          <div class="card-header">
                            <span>{{ $t('审批内容') }}</span>
                          </div>
                        </template>
                        <!-- {{titleList}} -->
                        <!-- v-for="(intstance,index2 ) in insatnceList" :key="index2" -->
                        <el-row class="intstance-row">
                          <!-- <el-form-item :label="item.value+':'" v-for="(item,index2) in titleList" :key="index2" class="i-r-l" >
                              <span style="font-weight: 300;" :style="handleStyle(item.key)" @click="handleDeatil(intstance,item.key)"> {{ intstance[item.key] }}</span>
                            </el-form-item> -->
                          <div style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 10px">
                            <el-input
                              v-model="content"
                              clearable
                              :placeholder="$t('请输入')"
                              style="width: 245px"
                              @clear="handleClear"></el-input>
                            <n-button
                              type="primary"
                              ghost
                              style="margin-left: 8px"
                              @click="getProcessLinkedBusinessList"
                              >{{ $t('查询') }}</n-button
                            >
                          </div>

                          <el-table
                            size="small"
                            header-cell-class-name="table-header-gray"
                            :data="opinion == '系统自动取消' ? insatnceList : approvalData"
                            height="300">
                            <el-table-column :label="$t('序号')" type="index" width="50px" />
                            <el-table-column
                              v-for="(item, index) in titleList"
                              :key="index"
                              :label="item.value"
                              :prop="item.key"
                              show-overflow-tooltip>
                              <template #default="scope">
                                <!-- state -->
                                <span v-if="item.key === 'state'">
                                  <n-tag :type="renderTableTagFun(scope.row[item.key])?.type">
                                    {{ scope.row[item.key] }}
                                    <template #icon>
                                      <gs-icon svg :icon="renderTableTagFun(scope.row[item.key])?.icon" size="16px" />
                                    </template>
                                  </n-tag>
                                </span>
                                <span v-else :style="handleStyle(item.key)" @click="handleDeatil(scope.row, item.key)">
                                  {{ scope.row[item.key] }}</span
                                >
                              </template>
                            </el-table-column>
                          </el-table>

                          <!---->
                        </el-row>
                      </el-card>

                      <el-card
                        style="margin: 10px; min-height: 100px; margin-right: 30px"
                        v-if="errorInsatnceList.length > 0">
                        <template #header>
                          <div class="card-header">
                            <span>{{ $t('审签信息') }}</span>
                          </div>
                        </template>
                        <div v-if="errorInsatnceList.length > 0">
                          <div v-for="(intstance, index2) in errorInsatnceList" :key="index2">
                            <div v-for="(item, index2) in errorTitleList" :key="index2">
                              <el-row class="intstance-row" v-if="intstance[item.key]">
                                <el-form-item :label="item.value + ':'" class="i-r-l">
                                  <span
                                    style="font-weight: 300"
                                    :style="handleStyle(item.key)"
                                    @click="handleDeatil(intstance, item.key)">
                                    {{ intstance[item.key] }}
                                  </span>
                                </el-form-item>
                              </el-row>
                            </div>
                          </div>
                        </div>

                        <div style="height: 300px" v-else>
                          <Empty text="暂无审核信息" />
                        </div>
                        <div
                          v-if="
                            todoTask?.name.includes('工艺审核') &&
                            processInstance.formVariables?.orderBomColorReq == true
                          ">
                          <gs-icon svg icon="icon_prompt" size="18px" style="margin-right: 5px" />
                          该订单涉及颜色需求，请基于该订单指定对应的颜色标识
                        </div>
                      </el-card>

                      <el-card
                        style="margin: 10px; min-height: 100px; margin-right: 30px"
                        v-if="processDefinitionList.length > 0 && !emainEnginePlants">
                        <template #header>
                          <div class="card-header">
                            <span>{{ $t('节点审批人员') }}</span>
                          </div>
                        </template>
                        <el-form-item
                          style="font-weight: 700"
                          :label="$t('流程节点:')"
                          v-for="(item, index) in processDefinitionList"
                          :key="index">
                          <span class="m-r20px font-medium w-160px"> {{ item.name }} </span>
                          <span class="m-l150px"> {{ $t('审批人：') }} </span>
                          <span class="w-100px">
                            {{ approveUser[index]?.nickname || approveUser[index]?.psnName }}
                          </span>
                          <el-button type="info" @click="handleShowUser(index)" v-if="editType === 1">
                            {{ $t('选择审批人') }}
                          </el-button>
                        </el-form-item>
                      </el-card>

                      <!-- 主机厂技术主管审批 -->
                      <el-card style="margin: 10px; min-height: 100px; margin-right: 30px" v-if="emainEnginePlants">
                        <template #header>
                          <div class="card-header">
                            <span>{{ $t('节点审批人员') }}</span>
                          </div>
                        </template>
                        <el-form-item
                          style="font-weight: 700"
                          :label="$t('流程节点:')"
                          v-for="(item, index) in processDefinitionList"
                          :key="index">
                          <span class="m-r20px font-medium w-160px"> {{ item.name }} </span>
                          <span class="m-l150px"> {{ $t('审批人：') }} </span>
                          <span class="w-100px">
                            {{
                              approvEmainEnginePlantsUser[index]?.nickname ||
                              approvEmainEnginePlantsUser[index]?.psnName
                            }}
                          </span>
                          <el-button type="info" @click="handleMainEngineShowUser(index)" v-if="editType === 1">
                            {{ $t('选择审批人') }}
                          </el-button>
                        </el-form-item>
                      </el-card>

                      <el-card style="margin: 10px; min-height: 100px; margin-right: 30px" v-if="aTab != 3">
                        <template #header>
                          <div class="card-header">
                            <span>{{ $t('处理意见') }}</span>
                          </div>
                        </template>
                        <el-row class="intstance-row" style="background-color: #ffffff">
                          <el-input v-model="opinion" type="textarea" :rows="4" :disabled="editType === 0"></el-input>
                        </el-row>
                      </el-card>

                      <el-card
                        style="margin: 10px; min-height: 60px; margin-right: 30px"
                        v-if="
                          aTab != 3 &&
                          taskType !== ETASKTYPE.ESTABLISHMENT &&
                          processInstance.formVariables?.PROCESS_BUSINESS_TYPE ===
                            BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE &&
                          showStatus
                        ">
                        <div class="card-header">
                          <span style="margin-right: 20px">{{ $t('是否手动更改销售配置') }}</span>
                          <el-radio-group v-model="isManual">
                            <el-radio :label="true">{{ $t('是') }}</el-radio>
                            <el-radio :label="false">{{ $t('否') }}</el-radio>
                          </el-radio-group>
                        </div>
                      </el-card>

                      <!-- v-if="aTab != 3 &&
                          (processInstance.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE
                          || processInstance.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.REGIONAL_SALES_CHANGE) && todoTaskStatus" -->
                      <el-card
                        style="margin: 10px; min-height: 60px; margin-right: 30px"
                        v-if="
                          aTab != 3 &&
                          (processInstance.formVariables?.PROCESS_BUSINESS_TYPE ===
                            BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE ||
                            processInstance.formVariables?.PROCESS_BUSINESS_TYPE ===
                              BpmBusinessProcessTypeEnum.REGIONAL_SALES_CHANGE ||
                            processInstance.formVariables?.PROCESS_BUSINESS_TYPE ===
                              BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE_TEM ||
                            processInstance.formVariables?.PROCESS_BUSINESS_TYPE ===
                              BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS) &&
                          todoTaskStatus
                        ">
                        <template #header>
                          <div class="card-header">
                            <span>{{ $t('流程状态选择') }}</span>
                          </div>
                        </template>
                        <div class="card-header" v-if="todoTask?.name === '标配Mbom确认'">
                          <div class="mr-20 w-120">{{ $t('标配Mbom确认') }}</div>
                          <el-radio-group v-model="areaSaleRelease.areaSaleRelease_genStMbomConfirm">
                            <el-radio
                              :label="true"
                              @click.native.prevent="handleRadioClick(true, 'areaSaleRelease_genStMbomConfirm')"
                              >{{ $t('无异常通过') }}</el-radio
                            >
                            <el-radio
                              :label="false"
                              @click.native.prevent="handleRadioClick(false, 'areaSaleRelease_genStMbomConfirm')"
                              >{{ $t('重新解算') }}</el-radio
                            >
                          </el-radio-group>
                        </div>
                        <div class="card-header" v-if="todoTask?.name === '重新推送'">
                          <div class="mr-20 w-120">{{ $t('重新推送') }}</div>
                          <el-radio-group v-model="areaSaleRelease.areaSaleRelease_rePushScpStMbomPre">
                            <el-radio
                              :label="true"
                              @click.native.prevent="handleRadioClick(true, 'areaSaleRelease_rePushScpStMbomPre')"
                              >{{ $t('完成') }}</el-radio
                            >
                            <el-radio
                              :label="false"
                              @click.native.prevent="handleRadioClick(false, 'areaSaleRelease_rePushScpStMbomPre')"
                              >{{ $t('重新推送') }}</el-radio
                            >
                          </el-radio-group>
                        </div>
                        <div class="card-header" v-if="todoTask?.name === '正式发布'">
                          <div class="mr-20 w-120">{{ $t('正式发布') }}</div>
                          <el-radio-group v-model="areaSaleRelease.areaSaleRelease_officiallyReleased">
                            <el-radio
                              :label="true"
                              @click.native.prevent="handleRadioClick(true, 'areaSaleRelease_officiallyReleased')"
                              >{{ $t('正式发布') }}</el-radio
                            >
                            <el-radio
                              :label="false"
                              @click.native.prevent="handleRadioClick(false, 'areaSaleRelease_officiallyReleased')"
                              >{{ $t('重新推送') }}</el-radio
                            >
                          </el-radio-group>
                        </div>
                        <div class="card-header" v-if="todoTask?.name === 'crm发布确认'">
                          <div class="mr-20 w-120">{{ $t('是否发布') }}</div>
                          <el-radio-group v-model="areaSaleRelease.crmRelease">
                            <el-radio :label="true" @click.native.prevent="handleRadioClick(true, 'crmRelease')">{{
                              $t('发布')
                            }}</el-radio>
                            <el-radio :label="false" @click.native.prevent="handleRadioClick(false, 'crmRelease')">{{
                              $t('取消')
                            }}</el-radio>
                          </el-radio-group>
                        </div>
                        <div class="card-header" v-if="todoTask?.name === '研发审核'">
                          <div class="mr-20 w-120">{{ $t('是否管理员处理') }}</div>
                          <el-radio-group v-model="areaSaleRelease.rdOwnerToAdmin">
                            <el-radio :label="true" @click.native.prevent="handleRadioClick(true, 'rdOwnerToAdmin')">{{
                              $t('是')
                            }}</el-radio>
                            <el-radio
                              :label="false"
                              @click.native.prevent="handleRadioClick(false, 'rdOwnerToAdmin')"
                              >{{ $t('否') }}</el-radio
                            >
                          </el-radio-group>
                        </div>
                        <div class="card-header" v-if="todoTask?.name === '工艺审核'">
                          <div style="display: flex; flex-direction: column">
                            <div style="display: inline-flex">
                              <div class="mr-20 w-120">{{ $t('是否管理员处理') }}</div>
                              <el-radio-group v-model="areaSaleRelease.processOwnerToAdmin">
                                <el-radio
                                  :label="true"
                                  @click.native.prevent="handleRadioClick2(true, 'processOwnerToAdmin')"
                                  >{{ $t('是') }}</el-radio
                                >
                                <el-radio
                                  :label="false"
                                  @click.native.prevent="handleRadioClick2(false, 'processOwnerToAdmin')"
                                  >{{ $t('否') }}</el-radio
                                >
                              </el-radio-group>
                            </div>
                            <div style="display: inline-flex">
                              <div class="mr-20 w-120">{{ $t('是否驳回研发处理') }}</div>
                              <el-radio-group v-model="areaSaleRelease.processOwnerToRdOwner">
                                <el-radio
                                  :label="true"
                                  @click.native.prevent="handleRadioClick2(true, 'processOwnerToRdOwner')">
                                  {{ $t('是') }}</el-radio
                                >
                                <el-radio
                                  :label="false"
                                  @click.native.prevent="handleRadioClick2(true, 'processOwnerToRdOwner')">
                                  {{ $t('否') }}</el-radio
                                >
                              </el-radio-group>
                            </div>
                          </div>
                        </div>
                      </el-card>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <!-- 审批记录时间线 -->
                    <ProcessInstanceTimeline :activity-nodes="activityNodes" />
                  </el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </el-tab-pane>

          <!-- 流程图 -->
          <el-tab-pane :label="$t('流程图')" name="diagram">
            <div class="form-scroll-area">
              <ProcessInstanceSimpleViewer
                v-show="processDefinition.modelType && processDefinition.modelType === BpmModelType.SIMPLE"
                :loading="processInstanceLoading"
                :model-view="processModelView" />
              <ProcessInstanceBpmnViewer
                v-show="processDefinition.modelType && processDefinition.modelType === BpmModelType.BPMN"
                :loading="processInstanceLoading"
                :model-view="processModelView" />
            </div>
          </el-tab-pane>

          <!-- 流转记录 -->
          <el-tab-pane :label="$t('流转记录')" name="record">
            <div class="form-scroll-area">
              <el-scrollbar>
                <ProcessInstanceTaskList :loading="processInstanceLoading" :id="id" />
              </el-scrollbar>
            </div>
          </el-tab-pane>

          <!-- 流转评论 TODO 待开发 -->
          <el-tab-pane :label="$t('流转评论')" name="comment" v-if="false">
            <div class="form-scroll-area">
              <el-scrollbar> {{ $t('流转评论') }} </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="b-t-solid border-t-1px border-[var(--el-border-color)]">
          <!-- 操作栏按钮 -->
          <!-- &&  processInstance.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE -->
          <ProcessInstanceOperationButtonCopy
            v-if="taskType !== ETASKTYPE.ESTABLISHMENT"
            ref="operationButtonRef"
            :process-instance="processInstance"
            :process-definition="processDefinition"
            :userOptions="userOptions"
            :normal-form="detailForm"
            :normal-form-api="fApi"
            :writable-fields="writableFields"
            :writableFieldsCopy="processVariablesList"
            @success="refresh"
            @handleLoading="handleLoading"
            :editType="editType"
            :opinion="opinion"
            :taskType="taskType"
            :pageIndex="route.query.pageIndex"
            :aTab="aTab"
            :isManual="isManual"
            :areaSaleRelease="areaSaleRelease"
            :firstTimeEditSubmit="firstTimeEditSubmit" />

          <!-- 选人  操作栏按钮 -->
          <ProcessInstanceSubButton
            v-else
            ref="operationButtonRef"
            :process-instance="processInstance"
            :process-definition="processDefinition"
            :normal-form="detailForm"
            :normal-form-api="fApi"
            :writable-fields="processVariablesList"
            @success="refresh"
            :editType="editType"
            :aTab="aTab"
            :opinion="opinion"
            :taskType="taskType"
            :areaSaleRelease="areaSaleRelease"
            :pageIndex="route.query.pageIndex"
            :firstTimeEditSubmit="firstTimeEditSubmit" />
        </div>
      </el-scrollbar>

      <!-- 用户选择弹窗 -->
      <!-- <UserSelectFormRadio ref="userSelectFormRef" @confirm="handleUserSelectConfirm" /> -->

      <FeatureDetailModal ref="FeatureDetailModalRef" />

      <BomOrderSet title="订单BOM" ref="OrderSetRef" />

      <CustomizeFeatureDetailModal ref="CustomizeFeatureDetailModalRef" />

      <ProjectConfigDeatil ref="projectConfigDeatilRef" />
      <!-- 一致率对比抽屉 -->
      <EpOnlyCompareDrawer
        v-model="showEpCompareDrawer"
        :configNo="configNo"
        :orderID="orderID"
        :orderNo="orderNo"
        :designModelId="designModelId" />
      <!-- 订单BOM与标配BOM版本对比抽屉 -->
      <VersionCompareDrawer ref="versionCompareDrawerRef" />
      <!-- 单车bom抽屉 -->
      <SuperBom ref="refSuperBom" />
    </div>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
import { BpmModelType, BpmModelFormType } from '@/utils/constants'
import { setConfAndFields2 } from '@/utils/formCreate'
import { registerComponent } from '@/utils/routerHelper'
import type { ApiAttrs } from '@form-create/element-ui/types/config'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import * as UserApi from '@/api/system/user'
import ProcessInstanceBpmnViewer from './ProcessInstanceBpmnViewer.vue'
import ProcessInstanceSimpleViewer from './ProcessInstanceSimpleViewer.vue'
import ProcessInstanceTaskList from './ProcessInstanceTaskList.vue'
import ProcessInstanceOperationButtonCopy from './ProcessInstanceOperationButtonCopy.vue'
import ProcessInstanceSubButton from '../components/ProcessInstanceSubButton.vue'
import ProcessInstanceTimeline from './ProcessInstanceTimeline.vue'
import { FieldPermissionType } from '@/components/SimpleProcessDesignerV2/src/consts'
import FeatureDetailModal from '@/views/ProductMgt/SalesFeature/component/FeatureDetailModal.vue'
import BomOrderSet from '@/views/Order/component/BomOrderSet.vue'
import CustomizeFeatureDetailModal from '@/views/ProductMgt/TechnicalFeature/component/CustomizeFeatureDetailModal.vue'
import ProjectConfigDeatil from '@/components/ProjectConfigDetail/index.vue'
import EpOnlyCompareDrawer from '@/components/EpOnlyCompareDrawer'
import VersionCompareDrawer from '@/views/Order/component/VersionCompareDrawer.vue'
import SuperBom from '@/components/SuperBom'
import { getDesignModelByOrderId, getSingleCarEbomListParamFromOrder } from '@/api/productConfig'
import { ETASKTYPE } from '../components/config/constant.ts'
import { BpmBusinessProcessTypeEnum } from '@/components/config/consts'
import { TaskStatusEnum } from '@/api/bpm/task'
import runningSvg from '@/assets/svgs/bpm/running.svg'
import approveSvg from '@/assets/svgs/bpm/approve.svg'
import rejectSvg from '@/assets/svgs/bpm/reject.svg'
import cancelSvg from '@/assets/svgs/bpm/cancel.svg'
import { useI18n } from 'vue-i18n'
import { AdminApiSystemDept } from '@/api/tags/管理后台部门'
const { t } = useI18n() // 国际化
defineOptions({ name: 'BpmProcessInstanceDetail' })
const props = defineProps<{
  id: string // 流程实例的编号
  taskId?: string // 任务编号
  activityId?: string //流程活动编号，用于抄送查看
}>()
import { useMessage } from '@/hooks/web/useMessage'
const message = useMessage() // 消息弹窗
const processInstanceLoading = ref(false) // 流程实例的加载中
const processInstance = ref<any>({}) // 流程实例
const processDefinition = ref<any>({}) // 流程定义
const processModelView = ref<any>({}) // 流程模型视图
const operationButtonRef = ref() // 操作按钮组件 ref
const auditIconsMap = {
  [TaskStatusEnum.RUNNING]: runningSvg,
  [TaskStatusEnum.APPROVE]: approveSvg,
  [TaskStatusEnum.REJECT]: rejectSvg,
  [TaskStatusEnum.CANCEL]: cancelSvg,
}

// ========== 申请信息 ==========
const fApi = ref<ApiAttrs>() //
const detailForm = ref({
  rule: [],
  option: {},
  value: {},
}) // 流程实例的表单详情

const writableFields: Array<any> = [] // 表单可以编辑的字段
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const titleList = ref<any>([])
const insatnceList = ref<any>([])
const errorTitleList = ref<any>([])
const errorInsatnceList = ref<any>([])

const router = useRouter()

const FeatureDetailModalRef = ref(null)
const OrderSetRef = ref(null)
const CustomizeFeatureDetailModalRef = ref(null)
const projectConfigDeatilRef = ref(null)
const opinion = ref<any>('')
const approvalData = ref<any>([])
const content = ref<string>()
const isManual = ref<boolean>(false)
const showStatus = ref<boolean>(false)
const areaSaleRelease = ref<any>({
  areaSaleRelease_genStMbomConfirm: null,
  areaSaleRelease_rePushScpStMbomPre: null,
  areaSaleRelease_officiallyReleased: null,
  crmRelease: null,
  rdOwnerToAdmin: false, //研发审核
  processOwnerToAdmin: false, //工艺审核
  processOwnerToRdOwner: false, //工艺审核2
})
const refSuperBom = ref(null)
const versionCompareDrawerRef = ref(null)
const todoTask = ref<any>()
const todoTaskStatus = computed(() => {
  return ['标配Mbom确认', '重新推送', '正式发布', '研发审核', '工艺审核'].includes(todoTask.value?.name)
})

// 1:普通节点审批人员 1:主机厂所长审批人员
const userType = ref<any>('1')
const loadingFlag = ref<boolean>(false)
const showEpCompareDrawer = ref<boolean>(false)
const designModelId = ref<string>('')
const configNo = ref<string>('')
const orderID = ref()
const orderNo = ref()

const handleRadioClick = (val, key) => {
  areaSaleRelease.value[key] = areaSaleRelease.value[key] === val ? null : val
}

const handleRadioClick2 = (val, key) => {
  if (['processOwnerToAdmin'].includes(key)) {
    areaSaleRelease.value['processOwnerToRdOwner'] = val === true ? false : val
  } else {
    areaSaleRelease.value['processOwnerToAdmin'] = val === true ? false : val
  }
  areaSaleRelease.value[key] = areaSaleRelease.value[key] === val ? false : val
}

const handleshowEpCompareDrawer = async row => {
  // orderNo = '1759157739678905' //测试数据

  const res = await getDesignModelByOrderId({ orderId: row.orderId })
  if (res.code === 800) {
    designModelId.value = res.data.designModelId
    orderID.value = row.orderId
    configNo.value = res.data.configNo
    orderNo.value = row.orderNo
    // 显示对比抽屉
    showEpCompareDrawer.value = true
  }
}

// 打开订单BOM与标配BOM版本对比抽屉
const handleShowVersionCompare = async row => {
  const loadingMsg = window.$message?.loading('正在加载订单信息...', { duration: 0 })

  try {
    // 调用 getProcOrderInfo 接口获取订单信息
    const orderInfoRes = await getProcOrderInfo({
      orderNo: row.orderNo,
    })

    loadingMsg?.destroy()

    if (orderInfoRes.code === 805) {
      window.$message?.error('未找到订单信息')
      return
    }

    if (orderInfoRes.code === 800 && orderInfoRes.data && versionCompareDrawerRef.value) {
      const orderData = orderInfoRes.data

      // 构造版本对比需要的数据
      const itemData = {
        source: 'processFlow', // 标识来源为流程调用
        partNo: orderData.partNo || '', // 标配物料号（从订单信息接口获取）
        orderNo: orderData.orderNo || row.orderNo || '', // 订单BOM编号
        number: orderData.partNo || '', // 物料编号
        view: orderData.views || '', // 视图
        factoryView: orderData.views || '', // 工厂视图
      }

      versionCompareDrawerRef.value.show(itemData)
    } else {
      window.$message?.error('获取订单BOM信息失败')
    }
  } catch (error) {
    loadingMsg?.destroy()
    console.error('获取订单BOM信息失败:', error)
    window.$message?.error('获取订单BOM信息失败，请重试')
  }
}

// 在表单中添加对比按钮
const addCompareButtonToForm = () => {
  nextTick(() => {
    // 只在工艺审核节点显示按钮
    if (todoTask.value?.name !== '工艺审核') {
      return
    }

    // 查找包含"订单编号"标签的表单项
    const formItems = document.querySelectorAll('.el-form-item')

    formItems.forEach(item => {
      const label = item.querySelector('.el-form-item__label')
      if (label && label.textContent && label.textContent.includes('订单编号')) {
        // 查找输入框容器
        const inputContainer = item.querySelector('.el-form-item__content')
        if (inputContainer && !inputContainer.querySelector('.compare-btn')) {
          // 创建对比按钮容器
          const buttonContainer = document.createElement('div')
          buttonContainer.className = 'compare-btn-container'
          buttonContainer.style.cssText = `
            display: inline-flex;
            gap: 8px;
            margin-left: 8px;
            vertical-align: top;
          `

          // 创建订单BOM对比按钮
          const button1 = document.createElement('button')
          button1.className = 'el-button el-button--primary el-button--small is-plain compare-btn'
          button1.innerHTML = `
            <span class="el-icon">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor">
                <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.1 3.1 11.3 0l275.4-275.3c3.1-3.1 3.1-8.1 0-11.3l-39.6-39.6c-3.1-3.1-8.1-3.1-11.3 0l-230 229.1L461.4 404c-3.1-3.1-8.1-3.1-11.3 0L266.3 586.7c-3.1 3.1-3.1 8.1 0 11.3l39.5 39.7z"></path>
              </svg>
            </span>
            订单BOM对比
          `
          button1.style.cssText = `
            height: 24px;
            padding: 4px 8px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
          `

          // 添加点击事件
          button1.addEventListener('click', () => {
            const orderId = processInstance.value.formVariables?.orderId
            if (orderId) {
              handleshowEpCompareDrawer({
                orderId: orderId,
                orderNo: processInstance.value.formVariables?.orderNo,
              })
            }
          })

          // 创建订单BOM与标配BOM版本对比按钮
          const button2 = document.createElement('button')
          button2.className = 'el-button el-button--primary el-button--small is-plain version-compare-btn'
          button2.innerHTML = `
            <span class="el-icon">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor">
                <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.1 3.1 11.3 0l275.4-275.3c3.1-3.1 3.1-8.1 0-11.3l-39.6-39.6c-3.1-3.1-8.1-3.1-11.3 0l-230 229.1L461.4 404c-3.1-3.1-8.1-3.1-11.3 0L266.3 586.7c-3.1 3.1-3.1 8.1 0 11.3l39.5 39.7z"></path>
              </svg>
            </span>
            订单BOM与标配BOM对比
          `
          button2.style.cssText = `
            height: 24px;
            padding: 4px 8px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
          `

          // 添加点击事件
          button2.addEventListener('click', async () => {
            // 如果按钮已经是loading状态，则不处理
            if (button2.disabled) {
              return
            }

            const orderId = processInstance.value.formVariables?.orderId
            const orderNoValue = processInstance.value.formVariables?.orderNo
            if (orderId) {
              // 设置按钮为loading状态
              button2.disabled = true
              button2.classList.add('is-loading')

              try {
                await handleShowVersionCompare({ orderId, orderNo: orderNoValue })
              } finally {
                // 恢复按钮状态
                button2.disabled = false
                button2.classList.remove('is-loading')
              }
            }
          })

          // 将按钮添加到容器中
          buttonContainer.appendChild(button1)
          buttonContainer.appendChild(button2)
          inputContainer.appendChild(buttonContainer)
        }
      }
    })
  })
}

const handleshowSuperBomDrawer = async row => {
  debugger
  //传递orderId
  let areaSConfigId = ''
  let type = '' //0:研发审核点单签审流程  1:区域销售配置表变更审签流程
  if (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS) {
    areaSConfigId = row.orderId
    type = '0'
  } else {
    type = '1'
    areaSConfigId = row.areaSaleConfigId
  }
  try {
    const res = await getSingleCarEbomListParamFromOrder({ orderId: row.orderId })
    if (res.code === 800) {
      refSuperBom.value?.show(areaSConfigId, type, res.data)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 根据状态生成表格标签对象
 *
 * @param status 状态值
 * @param type 可选，标签类型
 * @returns 表格标签对象
 */
const renderTableTagFun = (status: any, type?: string) => {
  // 检查 status 参数
  if (!status) return null
  // 图标和类型映射
  const iconList = {
    审阅中: { icon: 'icon_examine', type: 'info' },
    设计中: { icon: 'nav_cppz', type: 'info', color: { textColor: '#834BF4' } },
    重新工作: { icon: 'icon_examine', type: 'info' },
    已发布: { icon: 'yfb', type: 'success' },
    已关闭: { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    已停售: { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    废弃: { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    发布异常: { icon: 'ygb', type: '', color: { textColor: '#555D6D' } },
  }

  return {
    bordered: false,
    type: iconList[status]?.type || type,
    size: 'small',
    color: iconList[status]?.color || undefined,
    icon: iconList[status]?.icon,
  }
}

const handleDeatil = (row: any, item) => {
  debugger
  if (['name', 'orderNo', 'areaConfigName', 'designModel'].includes(item)) {
    if (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.SALE_OPS) {
      FeatureDetailModalRef.value?.show(1, row.id, 'optional')
    } else if (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.ORDER_MBOM) {
      OrderSetRef.value?.show('detail', row.configureIden, 'process')
    } else if (
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE ||
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.REGIONAL_SALES_DISCONTINUED
    ) {
      router.push({
        path: '/salesconfig/salestabledetail',
        query: {
          modalType: 'detail',
          areaConfigId: row?.areaConfigId,
        },
      })
    } else if (
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_RELEASE ||
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE
    ) {
      projectConfigDeatilRef.value?.show(row.id)
    } else if (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.TEC_OPS) {
      CustomizeFeatureDetailModalRef.value?.show(3, row.id)
    } else if (
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE == BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS
    ) {
      // 根据任务名称进行判断
      if (todoTask.value?.name.includes('研发审核')) {
        handleshowSuperBomDrawer(row)
      } else if (todoTask.value?.name.includes('工艺审核')) {
        handleshowEpCompareDrawer(row)
      }
    }
  }
}

/**
 * 处理样式
 *
 * @param item 任意类型的项
 * @returns 返回一个包含样式的对象
 */
const handleStyle = (item: any) => {
  return {
    color: ['name', 'orderNo', 'areaConfigName', 'designModel'].includes(item) ? '#409EFF' : '#222222',
    cursor: 'pointer',
    marginLeft: '10px',
    'text-decoration': ['name', 'orderNo', 'areaConfigName'].includes(item) ? 'underline' : 'none',
  }
}

/** 获得详情 */
const getDetail = () => {
  // 获得审批详情
  getApprovalDetail()
  // 获得流程模型视图
  getProcessModelView()
}

/**
 * 清空内容并重新获取关联业务列表
 */
const handleClear = () => {
  content.value = ''
  getProcessLinkedBusinessList()
}

/**
 * 获取流程关联业务列表
 */
const getProcessLinkedBusinessList = () => {
  let data = {
    businessType: processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE,
    content: content.value,
    processId: props.id,
  }
  ProcessInstanceApi.getProcessLinkedBusiness(data).then(res => {
    approvalData.value = res.data
  })
}

/** 加载流程实例 */
const BusinessFormComponent = ref<any>(null) // 异步组件
/** 获取审批详情 */
const getApprovalDetail = async () => {
  processInstanceLoading.value = true
  try {
    const param = {
      processInstanceId: props.id || qId.value,
      activityId: props.activityId,
      taskId: props.taskId,
    }
    const data = await ProcessInstanceApi.getApprovalDetail(param)
    if (!data) {
      message.error(t('查询不到审批详情信息！'))
      return
    }
    if (!data.processDefinition || !data.processInstance) {
      message.error(t('查询不到流程信息！'))
      return
    }

    processInstance.value = data.processInstance
    processDefinition.value = data.processDefinition
    // type 类型判断  编辑、其他
    if (taskType.value === ETASKTYPE.ESTABLISHMENT || taskType.value === ETASKTYPE.MAIN_ENGINE_PLANTS) {
      await getprocessUserModel()
    }

    if (
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS &&
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.FORWARD_DATA_FAIL &&
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.STANDARD_BOM_RE &&
      processInstance.value?.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.TASK_OWNER_NOTICE
      // && processInstance.value?.formVariables?.PROCESS_BUSINESS_TYPE !=
      // BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE_TEM
    ) {
      await getProcessLinkedBusinessList()
    }

    if (processInstance.value.formVariables?.BUSINESS_COLLECTION_TITILE) {
      const obj = JSON.parse(processInstance.value.formVariables?.BUSINESS_COLLECTION_TITILE)
      titleList.value = Object.keys(obj).map(key => ({ key, value: obj[key] }))
    }

    if (processInstance.value.formVariables?.BUSINESS_COLLECTION_VALUE) {
      const list = JSON.parse(processInstance.value.formVariables?.BUSINESS_COLLECTION_VALUE)
      insatnceList.value = list
    }

    if (processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_TITILE) {
      const obj = JSON.parse(processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_TITILE)
      errorTitleList.value = Object.keys(obj).map(key => ({ key, value: obj[key] }))
    }

    if (processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_VALUE) {
      const list = JSON.parse(processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_VALUE)
      if (list) {
        list.forEach((item: any) => {
          item['orderId'] = processInstance.value.formVariables?.orderId
          item['areaSaleConfigId'] = processInstance.value.formVariables?.BUSINESS_KEY
        })
      }
      errorInsatnceList.value = list
    }

    // 设置表单信息
    if (processDefinition.value.formType === BpmModelFormType.NORMAL) {
      // 获取表单字段权限
      const formFieldsPermission = data.formFieldsPermission
      // 清空可编辑字段为空
      writableFields.splice(0)
      if (detailForm.value.rule?.length > 0) {
        // 避免刷新 form-create 显示不了
        detailForm.value.value = processInstance.value.formVariables
      } else {
        setConfAndFields2(
          detailForm,
          processDefinition.value.formConf,
          processDefinition.value.formFields,
          processInstance.value.formVariables,
        )
      }
      nextTick().then(() => {
        fApi.value?.btn.show(false)
        fApi.value?.resetBtn.show(false)
        //@ts-ignore
        fApi.value?.disabled(true)
        // 设置表单字段权限
        if (formFieldsPermission) {
          Object.keys(data.formFieldsPermission).forEach(item => {
            setFieldPermission(item, formFieldsPermission[item])
          })
        }

        // 在表单渲染完成后添加对比按钮
        addCompareButtonToForm()
      })
    } else {
      // 注意：data.processDefinition.formCustomViewPath 是组件的全路径，例如说：/crm/contract/detail/index.vue
      BusinessFormComponent.value = registerComponent(data.processDefinition.formCustomViewPath)
    }

    // 获取审批节点，显示 Timeline 的数据
    activityNodes.value = data.activityNodes
    todoTask.value = data.todoTask
    if (!taskType.value) {
      taskType.value = data.todoTask?.name
    }

    // 获取待办任务显示操作按钮
    operationButtonRef.value?.loadTodoTask(data.todoTask, toTaskId.value)
    if (data.todoTask?.name === '销售审批') {
      showStatus.value = true
    } else {
      showStatus.value = false
    }

    if (data.todoTask?.name === '主机厂技术主管审批') {
      emainEnginePlants.value = true
    } else {
      emainEnginePlants.value = false
    }
  } finally {
    processInstanceLoading.value = false
  }
}

/** 获取流程模型视图*/
const getProcessModelView = async () => {
  if (BpmModelType.BPMN === processDefinition.value?.modelType) {
    // 重置，解决 BPMN 流程图刷新不会重新渲染问题
    processModelView.value = {
      bpmnXml: '',
    }
  }
  const data = await ProcessInstanceApi.getProcessInstanceBpmnModelView(props.id)
  if (data) {
    processModelView.value = data
  }
}

// 审批节点信息
const activityNodes = ref<ProcessInstanceApi.ApprovalNodeInfo[]>([])
/**
 * 设置表单权限
 */
const setFieldPermission = (field: string, permission: string) => {
  if (permission === FieldPermissionType.READ) {
    //@ts-ignore
    fApi.value?.disabled(true, field)
  }
  if (permission === FieldPermissionType.WRITE) {
    //@ts-ignore
    fApi.value?.disabled(false, field)
    // 加入可以编辑的字段
    writableFields.push(field)
  }
  if (permission === FieldPermissionType.NONE) {
    //@ts-ignore
    fApi.value?.hidden(true, field)
  }
}

/**
 * 操作成功后刷新
 */
const refresh = () => {
  // 重新获取详情
  getDetail()
}

const handleLoading = (loading: boolean) => {
  loadingFlag.value = loading
}

/** 当前的Tab */
const activeTab = ref('form')

const taskType = ref('')
const qId = ref<any>('')
const processDefinitionId = ref<any>('') // 流程定义ID
const processDefinitionKey = ref<any>('') // 流程定义Key
const processDefinitionList = ref<any>([]) // 流程定义列表
const approveUser = ref<any>([]) // 审批人列表
const userSelectFormRef = ref()
const processVariablesList = ref<any[]>([])
import { UserVO } from '@/api/system/user'

import { getProcOrderInfo } from '@/api/orderBom'
const rowIndex = ref(0)
const processInstanceId = ref<any>('') // 流程实例ID
const editType = ref<any>(1) //0 查看 1编辑
const aTab = ref<any>('') // 默认表单
const firstTimeEditSubmit = ref(true) // true 第一次编辑提交标识   false 非第一次编辑提交标识

// 主机厂所长审批
const approvEmainEnginePlantsUser = ref<any>([]) // 审批人列表

const emainEnginePlants = ref<boolean>(false)

// getUserModel
async function getprocessUserModel() {
  if (!processDefinitionKey.value) {
    return
  }
  let data = {
    processDefinitionKey: processDefinitionKey.value,
    processInstanceId: processInstanceId.value,
    director:
      taskType.value === ETASKTYPE.ESTABLISHMENT &&
      (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE ||
        processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
          BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_RELEASE)
        ? ETASKTYPE.MAIN_ENGINE_PLANTS
        : '',
  }

  // 编制
  // 流程类型

  const res = await ProcessInstanceApi.getUserModel(data)
  //  编辑
  // if (taskType.value === ETASKTYPE.ESTABLISHMENT) {
  processDefinitionList.value = res
  if (processDefinitionList.value) {
    // 拼接提交数据结构
    processDefinitionList.value.map((item, index) => {
      if (item.userInfo) {
        if (taskType.value === ETASKTYPE.MAIN_ENGINE_PLANTS) {
          approvEmainEnginePlantsUser.value[index] = { ...item.userInfo }
        } else {
          approveUser.value[index] = { ...item.userInfo }
        }
        firstTimeEditSubmit.value = false
      }
      processVariablesList.value.push({
        [item?.assigneePlaceholder]: item.userInfo?.id || '',
      })
    })
  }
  // } else {

  // }
}

/**
 * 显示用户信息的处理函数
 */
const handleShowUser = (index: number) => {
  rowIndex.value = index
  //  currentSelectType.value = 'manager'
  let list = []
  if (approveUser.value[index]) {
    list = <any>[approveUser.value[index]]
  }
  userType.value = '1'
  userSelectFormRef.value.open(0, list)
}

/**
  主机厂技术主管审批
* 显示主引擎用户列表，并设置用户类型为'2'
*/
const handleMainEngineShowUser = (index: number) => {
  rowIndex.value = index
  // let list = approvEmainEnginePlantsUser.value

  let list = []
  if (approvEmainEnginePlantsUser.value[index]) {
    list = <any>[approvEmainEnginePlantsUser.value[index]]
  }
  userType.value = '2'
  userSelectFormRef.value.open(0, list)
}

/** 处理用户选择确认 */
const handleUserSelectConfirm = (_, users: UserVO[]) => {
  if (users) {
    window.$message.success('选择成功')
  }
  if (userType.value === '1') {
    approveUser.value[rowIndex.value] = users[0]
    // 提交数据结构赋值
    processVariablesList.value[rowIndex.value][processDefinitionList.value[rowIndex.value].assigneePlaceholder] =
      users[0].userId
  } else if (userType.value === '2') {
    approvEmainEnginePlantsUser.value[rowIndex.value] = users[0]
    // 变更流程
    // if (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE) {
    //    processVariablesListCopy.value[rowIndex.value][
    //     processDefinitionList.value[rowIndex.value].assigneePlaceholder
    //   ] = users[0].userId
    // } else {
    processVariablesList.value[rowIndex.value][processDefinitionList.value[rowIndex.value].assigneePlaceholder] =
      users[0].userId
    // }
  }
}

const toTaskId = ref<any>('')

/** 初始化 */
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表
const getDeptuseInfo = async () => {
  const res = await AdminApiSystemDept.getDeptInfo({})
  if (res.data.code === 200) {
    userOptions.value = res.data?.data?.adminUserResponseDTO || []
  }
}
onMounted(async () => {
  debugger
  const { id, pDefinitionId, pProcessDefinitionKey, type, pIId, readType, activeTab, tId, reason } = route.query

  taskType.value = type as string

  toTaskId.value = tId || ''

  qId.value = id || ('' as string)
  processDefinitionId.value = pDefinitionId || ('' as string)
  processDefinitionKey.value = pProcessDefinitionKey || ('' as string)
  processInstanceId.value = pIId || ('' as string)
  editType.value = Number(readType || (1 as number))
  aTab.value = activeTab || ('' as string)
  opinion.value = reason || ('' as string)
  loadingFlag.value = false
  getDetail()
  // 获得用户列表
  getDeptuseInfo()
})
</script>

<style lang="scss" scoped>
$wrap-padding-height: 20px;
$wrap-margin-height: 15px;
$button-height: 51px;
$process-header-height: 194px;

.processInstance-wrap-main {
  height: calc(100vh - var(--top-tool-height) - var(--tags-view-height) - var(--app-footer-height) - 35px);
  max-height: calc(100vh - var(--top-tool-height) - var(--tags-view-height) - var(--app-footer-height) - 35px);
  overflow: auto;

  .form-scroll-area {
    display: flex;
    height: calc(100vh - var(--top-tool-height) - 35px - $process-header-height - 40px);
    max-height: calc(100vh - var(--top-tool-height) - 35px - $process-header-height - 40px);
    overflow: auto;
    flex-direction: column;

    :deep(.box-card) {
      height: 100%;
      flex: 1;

      .el-card__body {
        height: 100%;
        padding: 0;
      }
    }
  }

  .card-header {
    font-weight: 600;
    display: flex;
  }

  .intstance-row {
    padding: 10px;
    //background-color: #fafafa;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .i-r-l {
    margin-right: 15px;
    margin-bottom: 0px;
    font-weight: 600;
  }
}

.form-box {
  :deep(.el-card) {
    border: none;
  }
}
</style>
