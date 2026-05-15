<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BasicInfo from './BasicInfo.vue'
import FormDesign from './FormDesign.vue'
import ProcessDesign from './ProcessDesign.vue'
import ExtraSettings from './ExtraSettings.vue'
import { useMessage } from '@/hooks/web/useMessage'
// import { useTagsViewStore } from '@/store/modules/tagsView'
import { useUserStore } from '@/store/modules/user'
import * as ModelApi from '@/api/bpm/model'
import * as FormApi from '@/api/bpm/form'
import type { CategoryVO } from '@/api/bpm/category'
import { CategoryApi } from '@/api/bpm/category'
// import { findDeptTree } from '@/api/system-manage/dept'
// import { findPagination, getUserfindList } from '@/api/system-manage/user'

// import type * as DeptApi from '@/api/system/dept'
import * as DefinitionApi from '@/api/bpm/definition'
import type { HttpRequestResponse } from '@/httpRequest/typings'
import { BpmAutoApproveType, BpmModelFormType, BpmModelType } from '@/utils/constants'
import { useDictStore } from '@/store/modules/dict'
import { DICT_TYPE } from '@/utils/dict'
// import { useTagsView } from '@/hooks/web/useTagsView'

const dictStore = useDictStore()

const { t } = useI18n() // 国际化
const router = useRouter()
// const { delView } = useTagsViewStore() // 视图操作
// const tagsView = useTagsView()
const route = useRoute()
const message = useMessage()

// 组件引用
const basicInfoRef = ref()
const formDesignRef = ref()
const processDesignRef = ref()
const extraSettingsRef = ref()

/** 步骤校验函数 */
async function validateBasic() {
  await basicInfoRef.value?.validate()
}

/** 表单设计校验 */
async function validateForm() {
  await formDesignRef.value?.validate()
}

/** 流程设计校验 */
async function validateProcess() {
  await processDesignRef.value?.validate()
}

const currentStep = ref(0) // 步骤控制。-1 用于，一开始全部不展示等当前页面数据初始化完成

const steps = [
  { title: t('基本信息'), validator: validateBasic },
  { title: t('表单设计'), validator: validateForm },
  { title: t('流程设计'), validator: validateProcess },
  { title: t('更多设置'), validator: null },
]

// 表单数据
const formData: any = ref({
  id: undefined,
  name: '',
  key: '',
  category: undefined,
  icon: undefined,
  description: '',
  type: BpmModelType.BPMN,
  formType: BpmModelFormType.NORMAL,
  formId: '',
  formCustomCreatePath: '',
  formCustomViewPath: '',
  visible: 'true',
  startUserType: undefined,
  startUserIds: [],
  startDeptIds: [],
  managerUserIds: [],
  allowCancelRunningProcess: true,
  processIdRule: {
    enable: false,
    prefix: '',
    infix: '',
    postfix: '',
    length: 5,
  },
  autoApprovalType: BpmAutoApproveType.NONE,
  titleSetting: {
    enable: false,
    title: '',
  },
  summarySetting: {
    enable: false,
    summary: [],
  },
})

// 流程数据
const processData = ref<any>()

provide('processData', processData)
provide('modelData', formData)

// 数据列表
const formList = ref([])
const categoryList = ref<CategoryVO[]>([])
const deptList = ref<[]>([])

/** 接口常为 number/boolean，字典单选为 int/string，与 el-radio 严格相等才能回显 */
function normalizeModelDictEcho(m: Record<string, any>) {
  if (m.type != null && m.type !== '') {
    const n = Number(m.type)
    if (!Number.isNaN(n)) m.type = n
  }
  if (m.visible === undefined || m.visible === null || m.visible === '') return

  const v = m.visible
  let wantTrue = false
  if (typeof v === 'boolean') wantTrue = v
  else if (typeof v === 'number') wantTrue = v === 1
  else {
    const s = String(v).trim().toLowerCase()
    wantTrue = s === '1' || s === 'true'
  }

  const opts = dictStore.getStrDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)
  const strVals = new Set(opts.map(o => String(o.value)))
  if (strVals.has('1') && strVals.has('0')) {
    m.visible = wantTrue ? '1' : '0'
  } else if (strVals.has('true') && strVals.has('false')) {
    m.visible = wantTrue ? 'true' : 'false'
  } else {
    m.visible = wantTrue ? 'true' : 'false'
  }
}

function visibleToApi(v: unknown): boolean {
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0
  const s = String(v).trim().toLowerCase()
  return s === 'true' || s === '1'
}

/** 初始化数据 */
const actionType = route.params.type as string
async function initData() {
  if (!dictStore.isSetDict) {
    await dictStore.setDictMap()
  }
  if (actionType === 'definition') {
    // 情况一：流程定义场景（恢复）
    const definitionId = route.params.id as string
    const res = await DefinitionApi.getProcessDefinition(definitionId)
    const data = (res.data as HttpRequestResponse<Record<string, any>>).data
    // 将 definition => model，最终赋值
    data.type = data.modelType
    delete data.modelType
    data.id = data.modelId
    delete data.modelId
    if (data.simpleModel) {
      data.simpleModel = JSON.parse(data.simpleModel)
    }
    formData.value = data
    normalizeModelDictEcho(formData.value)
    formData.value.startUserType =
      formData.value.startUserIds?.length > 0 ? 1 : formData.value?.startDeptIds?.length > 0 ? 2 : 0
  } else if (['update', 'copy'].includes(actionType)) {
    // 情况二：修改场景/复制场景
    const modelId = route.params.id as string
    const res = await ModelApi.getModel(modelId)
    if (res.data.code === 200) {
      formData.value = res.data.data
      normalizeModelDictEcho(formData.value)
    }
    formData.value.startUserType =
      formData.value.startUserIds?.length > 0 ? 1 : formData.value?.startDeptIds?.length > 0 ? 2 : 0

    // 特殊：复制场景
    if (route.params.type === 'copy') {
      delete formData.value.id
      formData.value.name += '副本'
      formData.value.key += '_copy'
      // tagsView.setTitle('复制流程')
    }
  } else {
    // 情况三：新增场景
    formData.value.startUserType = 0 // 全体
    formData.value.managerUserIds.push(useUserStore().getUser.id)
  }
  // 获取表单列表
  formList.value = await FormApi.getFormSimpleList()
  // 获取分类列表
  categoryList.value = await CategoryApi.getCategorySimpleList()

  // 获取部门列表
  // const response = await findDeptTree({})
  // deptList.value = response.data

  // 最终，设置 currentStep 切换到第一步
  currentStep.value = 0

  // 兼容，以前未配置更多设置的流程
  extraSettingsRef.value.initData()
}

/** 根据类型切换流程数据 */
watch(
  async () => formData.value.type,
  () => {
    if (formData.value.type === BpmModelType.BPMN) {
      processData.value = formData.value.bpmnXml
    } else if (formData.value.type === BpmModelType.SIMPLE) {
      processData.value = formData.value.simpleModel
    }
  },
  {
    immediate: true,
  },
)

/** 校验所有步骤数据是否完整 */
async function validateAllSteps() {
  // 基本信息校验
  try {
    await validateBasic()
  } catch {
    currentStep.value = 0
    throw new Error(t('请完善基本信息'))
  }

  // 表单设计校验
  try {
    await validateForm()
  } catch {
    currentStep.value = 1
    throw new Error(t('请完善自定义表单信息'))
  }

  // 流程设计校验
  try {
    await validateProcess()
  } catch {
    currentStep.value = 2
    throw new Error(t('请设计流程'))
  }

  return true
}

/** 保存操作 */
async function handleSave() {
  try {
    // 保存前校验所有步骤的数据
    await validateAllSteps()

    // 更新表单数据
    const modelData = {
      ...formData.value,
      visible: visibleToApi(formData.value.visible),
    }

    if (actionType === 'definition') {
      // 情况一：流程定义场景（恢复）
      await ModelApi.updateModel(modelData)
      // 提示成功
      message.success(t('恢复成功，可点击【发布】按钮，进行发布模型'))
    } else if (actionType === 'update') {
      if (JSON.stringify(modelData.simpleModel) === '{}') {
        modelData.simpleModel = null
      }
      // 修改场景
      await ModelApi.updateModel(modelData)
      // 提示成功
      message.success(t('修改成功，可点击【发布】按钮，进行发布模型'))
    } else if (actionType === 'copy') {
      // 情况三：复制场景
      formData.value.id = await ModelApi.createModel(modelData)
      // 提示成功
      message.success(t('复制成功，可点击【发布】按钮，进行发布模型'))
    } else {
      // 情况四：新增场景
      formData.value.id = await ModelApi.createModel(modelData)
      // 提示成功
      message.success(t('新建成功，可点击【发布】按钮，进行发布模型'))
    }

    // 返回列表页（排除更新的情况）
    if (actionType !== 'update') {
      await router.push({ name: 'BpmModel' })
    }
  } catch (error: any) {
    console.error('保存失败:', error)
    message.warning(t(error.message) || t('请完善所有步骤的必填信息'))
  }
}

/** 发布操作 */
async function handleDeploy() {
  try {
    // 修改场景下直接发布，新增场景下需要先确认
    if (!formData.value.id) {
      await message.confirm(t('是否确认发布该流程？'))
    }
    // 校验所有步骤
    await validateAllSteps()

    // 更新表单数据
    const modelData = {
      ...formData.value,
      visible: visibleToApi(formData.value.visible),
    }

    // 先保存所有数据
    if (formData.value.id) {
      await ModelApi.updateModel(modelData)
    } else {
      const result = await ModelApi.createModel(modelData)
      formData.value.id = result.id
    }

    // 发布
    await ModelApi.deployModel(formData.value.id)
    message.success(t('发布成功'))
    // 返回列表页
    await router.push({ name: 'BpmModel' })
  } catch (error: any) {
    console.error('发布失败:', error)
    message.warning(t(error.message) || t('发布失败'))
  }
}

/**
 * 步骤切换处理
 * @param index
 */
async function handleStepClick(index: number) {
  try {
    if (index !== 0) {
      await validateBasic()
    }
    if (index !== 1) {
      await validateForm()
    }
    if (index !== 2) {
      await validateProcess()
    }

    // 切换步骤
    currentStep.value = index

    // 如果切换到流程设计步骤，等待组件渲染完成后刷新设计器
    if (index === 2) {
      await nextTick()
      // 等待更长时间确保组件完全初始化
      await new Promise(resolve => setTimeout(resolve, 200))
      if (processDesignRef.value?.refresh) {
        await processDesignRef.value.refresh()
      }
    }
  } catch (error) {
    console.error('步骤切换失败:', error)
    message.warning(t('请先完善当前步骤必填信息'))
  }
}

/** 返回列表页 */
function handleBack() {
  // 先删除当前页签
  // delView(unref(router.currentRoute))
  // 跳转到列表页
  router.push({ name: 'BpmModel' })
}

/** 初始化 */
onMounted(async () => {
  await initData()
})

// 添加组件卸载前的清理代码
onBeforeUnmount(() => {
  // 清理所有的引用
  basicInfoRef.value = null
  formDesignRef.value = null
  processDesignRef.value = null
})
</script>

<template>
  <ContentWrap>
    <div class="mx-auto">
      <!-- 头部导航栏 -->
      <div class="top-0 left-0 right-0 h-50px bg-white border-bottom z-10 flex items-center px-20px">
        <!-- 左侧标题 -->
        <div class="w-200px flex items-center overflow-hidden">
          <Icon icon="ep:arrow-left" class="cursor-pointer flex-shrink-0" @click="handleBack" />
          <span class="ml-10px text-16px truncate" :title="formData.name || '创建流程'">
            {{ formData.name || '创建流程' }}
          </span>
        </div>

        <!-- 步骤条 -->
        <div class="flex-1 flex items-center justify-center h-full">
          <div class="w-400px flex items-center justify-between h-full">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex items-center cursor-pointer mx-15px relative h-full"
              :class="[
                currentStep === index ? 'text-[#3473ff] border-[#3473ff] border-b-2 border-b-solid' : 'text-gray-500',
              ]"
              @click="handleStepClick(index)">
              <div
                class="w-28px h-28px rounded-full flex items-center justify-center mr-8px border-2 border-solid text-15px"
                :class="[
                  currentStep === index
                    ? 'bg-[#3473ff] text-white border-[#3473ff]'
                    : 'border-gray-300 bg-white text-gray-500',
                ]">
                {{ index + 1 }}
              </div>
              <span class="text-16px font-bold whitespace-nowrap">{{ step.title }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧按钮 -->
        <div class="w-200px flex items-center justify-end gap-2">
          <el-button v-if="actionType === 'update'" type="success" @click="handleDeploy">
            {{ $t('发布') }}
          </el-button>
          <el-button type="primary" @click="handleSave">
            <span v-if="actionType === 'definition'">{{ $t('恢复') }}</span>
            <span v-else>{{ $t('保存') }}</span>
          </el-button>
        </div>
      </div>

      <!-- 主体内容 -->
      <div class="mt-2px">
        <!-- 第一步：基本信息 -->
        <div v-if="currentStep === 0" class="mx-auto w-560px">
          <BasicInfo ref="basicInfoRef" v-model="formData" :category-list="categoryList" :dept-list="deptList" />
        </div>

        <!-- 第二步：表单设计 -->
        <div v-if="currentStep === 1" class="mx-auto w-560px">
          <FormDesign ref="formDesignRef" v-model="formData" :form-list="formList" />
        </div>

        <!-- 第三步：流程设计 -->
        <ProcessDesign v-if="currentStep === 2" ref="processDesignRef" v-model="formData" />

        <!-- 第四步：更多设置 -->
        <div v-show="currentStep === 3" class="mx-auto w-700px">
          <ExtraSettings ref="extraSettingsRef" v-model="formData" />
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 1px solid #dcdfe6;
}

.text-primary {
  color: #3473ff;
}

.bg-primary {
  background-color: #3473ff;
}

.border-primary {
  border-color: #3473ff;
}
</style>
