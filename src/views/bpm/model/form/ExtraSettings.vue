<script setup lang="ts">
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { BpmAutoApproveType, BpmModelFormType } from '@/utils/constants'
import * as FormApi from '@/api/bpm/form'
import { parseFormFields } from '@/components/FormCreate/src/utils'
import { ProcessVariableEnum } from '@/components/SimpleProcessDesignerV2/src/consts'
import HttpRequestSetting from '@/components/SimpleProcessDesignerV2/src/nodes-config/components/HttpRequestSetting.vue'

const { t } = useI18n() // 国际化
const modelData = defineModel<any>()

/** 自定义 ID 流程编码 */
const timeOptions = ref([
  {
    value: '',
    label: t('无'),
  },
  {
    value: 'DAY',
    label: t('精确到日'),
  },
  {
    value: 'HOUR',
    label: t('精确到时'),
  },
  {
    value: 'MINUTE',
    label: t('精确到分'),
  },
  {
    value: 'SECOND',
    label: t('精确到秒'),
  },
])
const numberExample = computed(() => {
  if (modelData.value.processIdRule.enable) {
    let infix = ''
    switch (modelData.value.processIdRule.infix) {
      case 'DAY':
        infix = dayjs().format('YYYYMMDD')
        break
      case 'HOUR':
        infix = dayjs().format('YYYYMMDDHH')
        break
      case 'MINUTE':
        infix = dayjs().format('YYYYMMDDHHmm')
        break
      case 'SECOND':
        infix = dayjs().format('YYYYMMDDHHmmss')
        break
      default:
        break
    }
    return (
      modelData.value.processIdRule.prefix +
      infix +
      modelData.value.processIdRule.postfix +
      '1'.padStart(modelData.value.processIdRule.length - 1, '0')
    )
  } else {
    return ''
  }
})

/** 是否开启流程前置通知 */
const processBeforeTriggerEnable = ref(false)
function handleProcessBeforeTriggerEnableChange(val: boolean | string | number) {
  if (val) {
    modelData.value.processBeforeTriggerSetting = {
      url: '',
      header: [],
      body: [],
      response: [],
    }
  } else {
    modelData.value.processBeforeTriggerSetting = null
  }
}

/** 是否开启流程后置通知 */
const processAfterTriggerEnable = ref(false)
function handleProcessAfterTriggerEnableChange(val: boolean | string | number) {
  if (val) {
    modelData.value.processAfterTriggerSetting = {
      url: '',
      header: [],
      body: [],
      response: [],
    }
  } else {
    modelData.value.processAfterTriggerSetting = null
  }
}

/** 是否开启任务前置通知 */
const taskBeforeTriggerEnable = ref(false)
function handleTaskBeforeTriggerEnableChange(val: boolean | string | number) {
  if (val) {
    modelData.value.taskBeforeTriggerSetting = {
      url: '',
      header: [],
      body: [],
      response: [],
    }
  } else {
    modelData.value.taskBeforeTriggerSetting = null
  }
}

/** 是否开启任务后置通知 */
const taskAfterTriggerEnable = ref(false)
function handleTaskAfterTriggerEnableChange(val: boolean | string | number) {
  if (val) {
    modelData.value.taskAfterTriggerSetting = {
      url: '',
      header: [],
      body: [],
      response: [],
    }
  } else {
    modelData.value.taskAfterTriggerSetting = null
  }
}

/** 表单选项 */
const formField = ref<Array<{ field: string; title: string }>>([])
const formFieldOptions4Title = computed(() => {
  const cloneFormField = formField.value.map(item => {
    return {
      label: item.title,
      value: item.field,
    }
  })
  // 固定添加发起人 ID 字段
  cloneFormField.unshift({
    label: t('流程名称'),
    value: ProcessVariableEnum.PROCESS_DEFINITION_NAME,
  })
  cloneFormField.unshift({
    label: t('发起时间'),
    value: ProcessVariableEnum.START_TIME,
  })
  cloneFormField.unshift({
    label: t('发起人'),
    value: ProcessVariableEnum.START_USER_ID,
  })
  return cloneFormField
})
const formFieldOptions4Summary = computed(() => {
  return formField.value.map(item => {
    return {
      label: item.title,
      value: item.field,
    }
  })
})

/** 兼容以前未配置更多设置的流程 */
function initData() {
  if (!modelData.value.processIdRule) {
    modelData.value.processIdRule = {
      enable: false,
      prefix: '',
      infix: '',
      postfix: '',
      length: 5,
    }
  }
  if (!modelData.value.autoApprovalType) {
    modelData.value.autoApprovalType = BpmAutoApproveType.NONE
  }
  if (!modelData.value.titleSetting) {
    modelData.value.titleSetting = {
      enable: false,
      title: '',
    }
  }
  if (!modelData.value.summarySetting) {
    modelData.value.summarySetting = {
      enable: false,
      summary: [],
    }
  }
  if (modelData.value.processBeforeTriggerSetting) {
    processBeforeTriggerEnable.value = true
  }
  if (modelData.value.processAfterTriggerSetting) {
    processAfterTriggerEnable.value = true
  }
  if (modelData.value.taskBeforeTriggerSetting) {
    taskBeforeTriggerEnable.value = true
  }
  if (modelData.value.taskAfterTriggerSetting) {
    taskAfterTriggerEnable.value = true
  }
}
defineExpose({ initData })

/** 监听表单 ID 变化，加载表单数据 */
watch(
  () => modelData.value.formId,
  async newFormId => {
    if (newFormId && modelData.value.formType === BpmModelFormType.NORMAL) {
      const res = await FormApi.getForm(newFormId)
      const result: Array<{ field: string; title: string }> = []
      const row = res.data?.data
      const fields = row?.fields
      if (Array.isArray(fields)) {
        fields.forEach((fieldStr: string) => {
          parseFormFields(JSON.parse(fieldStr), result)
        })
      }
      formField.value = result
    } else {
      formField.value = []
    }
  },
  { immediate: true },
)
</script>

<template>
  <el-form ref="formRef" :model="modelData" label-width="120px" class="mt-20px">
    <el-form-item class="mb-20px">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('提交人权限') }}
        </el-text>
      </template>
      <div class="flex flex-col">
        <el-checkbox v-model="modelData.allowCancelRunningProcess" :label="$t('允许撤销审批中的申请')" />
        <div class="ml-22px">
          <el-text type="info">
            {{ $t('第一个审批节点通过后，提交人仍可撤销申请') }}
          </el-text>
        </div>
      </div>
    </el-form-item>
    <el-form-item v-if="modelData.processIdRule" class="mb-20px bpm-process-id-rule">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('流程编码') }}
        </el-text>
      </template>
      <div class="flex flex-col gap-8px w-full min-w-0">
        <div
          class="bpm-process-id-rule__row flex flex-row flex-nowrap items-center gap-8px w-full min-w-0 overflow-x-auto">
          <el-input
            v-model="modelData.processIdRule.prefix"
            class="bpm-process-id-rule__prefix flex-shrink-0"
            :placeholder="$t('前缀')"
            :disabled="!modelData.processIdRule.enable">
            <template #prepend>
              <el-checkbox v-model="modelData.processIdRule.enable" />
            </template>
          </el-input>
          <el-select
            v-model="modelData.processIdRule.infix"
            class="bpm-process-id-rule__infix flex-shrink-0"
            :placeholder="$t('中缀')"
            :disabled="!modelData.processIdRule.enable">
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input
            v-model="modelData.processIdRule.postfix"
            class="bpm-process-id-rule__postfix flex-shrink-0"
            :placeholder="$t('后缀')"
            :disabled="!modelData.processIdRule.enable" />
          <el-input-number
            v-model="modelData.processIdRule.length"
            class="bpm-process-id-rule__length flex-shrink-0"
            :min="5"
            :disabled="!modelData.processIdRule.enable" />
        </div>
        <div v-if="modelData.processIdRule.enable">
          <el-text type="info"> {{ $t('编码示例：') }}{{ numberExample }} </el-text>
        </div>
      </div>
    </el-form-item>
    <el-form-item class="mb-20px">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('自动去重') }}
        </el-text>
      </template>
      <div class="flex flex-col">
        <div>
          <el-text> {{ $t('同一审批人在流程中重复出现时：') }} </el-text>
        </div>
        <el-radio-group v-model="modelData.autoApprovalType">
          <div class="flex flex-col">
            <el-radio :value="0">
              {{ $t('不自动通过') }}
            </el-radio>
            <el-radio :value="1">
              {{ $t('仅审批一次，后续重复的审批节点均自动通过') }}
            </el-radio>
            <el-radio :value="2">
              {{ $t('仅针对连续审批的节点自动通过') }}
            </el-radio>
          </div>
        </el-radio-group>
      </div>
    </el-form-item>
    <el-form-item v-if="modelData.titleSetting" class="mb-20px">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('标题设置') }}
        </el-text>
      </template>
      <div class="flex flex-col">
        <el-radio-group v-model="modelData.titleSetting.enable">
          <div class="flex flex-col">
            <el-radio :value="false">
              {{ $t('系统默认') }}
              <el-text type="info">
                {{ $t('展示流程名称') }}
              </el-text>
            </el-radio>
            <el-radio :value="true">
              {{ $t('自定义标题') }}
              <el-text>
                <el-tooltip :content="$t(`输入字符 '{' 即可插入表单字段`)" effect="light" placement="top">
                  <Icon icon="ep:question-filled" class="ml-5px" />
                </el-tooltip>
              </el-text>
            </el-radio>
          </div>
        </el-radio-group>
        <el-mention
          v-if="modelData.titleSetting.enable"
          v-model="modelData.titleSetting.title"
          type="textarea"
          prefix="{"
          split="}"
          whole
          :options="formFieldOptions4Title"
          :placeholder="$t(`请插入表单字段（输入 '{' 可以选择表单字段）或输入文本`)"
          class="w-600px!" />
      </div>
    </el-form-item>
    <el-form-item v-if="modelData.summarySetting && modelData.formType === BpmModelFormType.NORMAL" class="mb-20px">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('摘要设置') }}
        </el-text>
      </template>
      <div class="flex flex-col">
        <el-radio-group v-model="modelData.summarySetting.enable">
          <div class="flex flex-col">
            <el-radio :value="false">
              {{ $t('系统默认') }}
              <el-text type="info">
                {{ $t('展示表单前 3 个字段') }}
              </el-text>
            </el-radio>
            <el-radio :value="true">
              {{ $t('自定义摘要') }}
            </el-radio>
          </div>
        </el-radio-group>
        <el-select
          v-if="modelData.summarySetting.enable"
          v-model="modelData.summarySetting.summary"
          class="w-500px!"
          multiple
          :placeholder="$t('请选择要展示的表单字段')">
          <el-option
            v-for="item in formFieldOptions4Summary"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </div>
    </el-form-item>
    <el-form-item class="mb-20px">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('流程前置通知') }}
        </el-text>
      </template>
      <div class="flex flex-col w-100%">
        <div class="flex">
          <el-switch v-model="processBeforeTriggerEnable" @change="handleProcessBeforeTriggerEnableChange" />
          <div class="ml-80px">
            {{ $t('流程启动后通知') }}
          </div>
        </div>
        <HttpRequestSetting
          v-if="processBeforeTriggerEnable"
          v-model:setting="modelData.processBeforeTriggerSetting"
          :response-enable="true"
          form-item-prefix="processBeforeTriggerSetting" />
      </div>
    </el-form-item>
    <el-form-item class="mb-20px">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('流程后置通知') }}
        </el-text>
      </template>
      <div class="flex flex-col w-100%">
        <div class="flex">
          <el-switch v-model="processAfterTriggerEnable" @change="handleProcessAfterTriggerEnableChange" />
          <div class="ml-80px">
            {{ $t('流程结束后通知') }}
          </div>
        </div>
        <HttpRequestSetting
          v-if="processAfterTriggerEnable"
          v-model:setting="modelData.processAfterTriggerSetting"
          :response-enable="true"
          form-item-prefix="processAfterTriggerSetting" />
      </div>
    </el-form-item>
    <el-form-item class="mb-20px">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('任务前置通知') }}
        </el-text>
      </template>
      <div class="flex flex-col w-100%">
        <div class="flex">
          <el-switch v-model="taskBeforeTriggerEnable" @change="handleTaskBeforeTriggerEnableChange" />
          <div class="ml-80px">
            {{ $t('任务执行时通知') }}
          </div>
        </div>
        <HttpRequestSetting
          v-if="taskBeforeTriggerEnable"
          v-model:setting="modelData.taskBeforeTriggerSetting"
          :response-enable="true"
          form-item-prefix="taskBeforeTriggerSetting" />
      </div>
    </el-form-item>
    <el-form-item class="mb-20px">
      <template #label>
        <el-text size="large" tag="b">
          {{ $t('任务后置通知') }}
        </el-text>
      </template>
      <div class="flex flex-col w-100%">
        <div class="flex">
          <el-switch v-model="taskAfterTriggerEnable" @change="handleTaskAfterTriggerEnableChange" />
          <div class="ml-80px">
            {{ $t('任务结束后通知') }}
          </div>
        </div>
        <HttpRequestSetting
          v-if="taskAfterTriggerEnable"
          v-model:setting="modelData.taskAfterTriggerSetting"
          :response-enable="true"
          form-item-prefix="taskAfterTriggerSetting" />
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
/* 流程编码：标签与第一行控件顶部对齐（勿用 center，否则两行内容时标签会落到「编码示例」一侧） */
.bpm-process-id-rule {
  align-items: flex-start;

  :deep(.el-form-item__label) {
    align-self: flex-start;
    padding-top: 6px;
    line-height: var(--el-component-size-default);
  }

  :deep(.el-form-item__content) {
    min-width: 0;
  }
}

.bpm-process-id-rule__row {
  /* 单行不换行；内容过宽时横向滚动，避免数字步进器掉到第二行 */
  -webkit-overflow-scrolling: touch;
}

.bpm-process-id-rule__prefix {
  width: 176px;
  min-width: 176px;
  max-width: 100%;
}

.bpm-process-id-rule__infix {
  width: 128px;
  min-width: 128px;
  max-width: 100%;
}

.bpm-process-id-rule__postfix {
  width: 100px;
  min-width: 100px;
  max-width: 100%;
}

.bpm-process-id-rule__length {
  width: 112px;
  min-width: 112px;
  max-width: 100%;
}
</style>
