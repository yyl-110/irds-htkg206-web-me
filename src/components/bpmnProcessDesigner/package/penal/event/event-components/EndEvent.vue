<template>
  <div class="panel-tab__content">
    <el-form label-width="100px" label-position="left" size="small">
      <el-form-item label="事件类型">
        <el-select v-model="eventDefinitionType" placeholder="请选择事件类型" @change="updateEventDefinition">
          <el-option label="空结束事件" value="" />
          <el-option label="终止结束事件" value="bpmn:TerminateEventDefinition" />
          <el-option label="消息结束事件" value="bpmn:MessageEventDefinition" />
          <el-option label="信号结束事件" value="bpmn:SignalEventDefinition" />
          <el-option label="错误结束事件" value="bpmn:ErrorEventDefinition" />
          <el-option label="升级结束事件" value="bpmn:EscalationEventDefinition" />
        </el-select>
      </el-form-item>

      <!-- 消息结束事件配置 -->
      <template v-if="eventDefinitionType === 'bpmn:MessageEventDefinition'">
        <el-form-item label="消息引用">
          <el-select v-model="messageRef" placeholder="请选择消息" @change="updateMessageDefinition">
            <el-option
              v-for="msg in messageList"
              :key="msg.id"
              :label="msg.name"
              :value="msg.id"
            />
          </el-select>
        </el-form-item>
      </template>

      <!-- 信号结束事件配置 -->
      <template v-if="eventDefinitionType === 'bpmn:SignalEventDefinition'">
        <el-form-item label="信号引用">
          <el-select v-model="signalRef" placeholder="请选择信号" @change="updateSignalDefinition">
            <el-option
              v-for="sig in signalList"
              :key="sig.id"
              :label="sig.name"
              :value="sig.id"
            />
          </el-select>
        </el-form-item>
      </template>

      <!-- 错误结束事件配置 -->
      <template v-if="eventDefinitionType === 'bpmn:ErrorEventDefinition'">
        <el-form-item label="错误代码">
          <el-input
            v-model="errorCode"
            placeholder="请输入错误代码"
            @change="updateErrorDefinition"
          />
        </el-form-item>
        <el-form-item label="错误名称">
          <el-input
            v-model="errorName"
            placeholder="请输入错误名称"
            @change="updateErrorDefinition"
          />
        </el-form-item>
      </template>

      <!-- 升级结束事件配置 -->
      <template v-if="eventDefinitionType === 'bpmn:EscalationEventDefinition'">
        <el-form-item label="升级代码">
          <el-input
            v-model="escalationCode"
            placeholder="请输入升级代码"
            @change="updateEscalationDefinition"
          />
        </el-form-item>
      </template>

      <el-form-item label="异步执行">
        <el-switch v-model="asyncBefore" @change="updateAsync('asyncBefore')" />
      </el-form-item>
      <el-form-item label="异步后执行">
        <el-switch v-model="asyncAfter" @change="updateAsync('asyncAfter')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'EndEventConfig' })

const props = defineProps({
  id: String,
  type: String
})

const prefix = inject('prefix', 'flowable')
const bpmnInstances = () => (window as any)?.bpmnInstances
const bpmnElement = ref()
const eventDefinitionType = ref('')
const messageRef = ref('')
const signalRef = ref('')
const errorCode = ref('')
const errorName = ref('')
const escalationCode = ref('')
const asyncBefore = ref(false)
const asyncAfter = ref(false)
const messageList = ref([])
const signalList = ref([])

const resetEventConfig = () => {
  bpmnElement.value = bpmnInstances().bpmnElement
  const businessObject = bpmnElement.value.businessObject

  // 获取事件定义
  const eventDefinitions = businessObject.eventDefinitions || []
  if (eventDefinitions.length > 0) {
    const eventDef = eventDefinitions[0]
    eventDefinitionType.value = eventDef.$type

    // 消息事件
    if (eventDef.$type === 'bpmn:MessageEventDefinition') {
      messageRef.value = eventDef.messageRef?.id || ''
    }
    // 信号事件
    else if (eventDef.$type === 'bpmn:SignalEventDefinition') {
      signalRef.value = eventDef.signalRef?.id || ''
    }
    // 错误事件
    else if (eventDef.$type === 'bpmn:ErrorEventDefinition') {
      errorCode.value = eventDef.errorRef?.errorCode || ''
      errorName.value = eventDef.errorRef?.name || ''
    }
    // 升级事件
    else if (eventDef.$type === 'bpmn:EscalationEventDefinition') {
      escalationCode.value = eventDef.escalationRef?.escalationCode || ''
    }
  } else {
    eventDefinitionType.value = ''
  }

  // 异步配置
  asyncBefore.value = businessObject[`${prefix}:asyncBefore`] || false
  asyncAfter.value = businessObject[`${prefix}:asyncAfter`] || false

  // 获取消息和信号列表
  loadMessageAndSignalList()
}

const loadMessageAndSignalList = () => {
  const rootElements = bpmnInstances().modeler.getDefinitions().rootElements
  messageList.value = []
  signalList.value = []

  rootElements.forEach((el) => {
    if (el.$type === 'bpmn:Message') {
      messageList.value.push({ id: el.id, name: el.name })
    }
    if (el.$type === 'bpmn:Signal') {
      signalList.value.push({ id: el.id, name: el.name })
    }
  })
}

const updateEventDefinition = () => {
  const modeling = bpmnInstances().modeling
  const moddle = bpmnInstances().moddle

  // 清除现有事件定义
  modeling.updateProperties(bpmnElement.value, {
    eventDefinitions: []
  })

  if (!eventDefinitionType.value) return

  // 创建新的事件定义
  const eventDefinition = moddle.create(eventDefinitionType.value)
  modeling.updateProperties(bpmnElement.value, {
    eventDefinitions: [eventDefinition]
  })

  // 重置相关配置
  messageRef.value = ''
  signalRef.value = ''
  errorCode.value = ''
  errorName.value = ''
  escalationCode.value = ''
}

const updateMessageDefinition = () => {
  const modeling = bpmnInstances().modeling
  const eventDefinitions = bpmnElement.value.businessObject.eventDefinitions || []

  if (eventDefinitions.length === 0) return

  const messageEventDefinition = eventDefinitions[0]
  const rootElements = bpmnInstances().modeler.getDefinitions().rootElements
  const message = rootElements.find((el) => el.id === messageRef.value)

  if (message) {
    messageEventDefinition.messageRef = message
    modeling.updateProperties(bpmnElement.value, {
      eventDefinitions: [messageEventDefinition]
    })
  }
}

const updateSignalDefinition = () => {
  const modeling = bpmnInstances().modeling
  const eventDefinitions = bpmnElement.value.businessObject.eventDefinitions || []

  if (eventDefinitions.length === 0) return

  const signalEventDefinition = eventDefinitions[0]
  const rootElements = bpmnInstances().modeler.getDefinitions().rootElements
  const signal = rootElements.find((el) => el.id === signalRef.value)

  if (signal) {
    signalEventDefinition.signalRef = signal
    modeling.updateProperties(bpmnElement.value, {
      eventDefinitions: [signalEventDefinition]
    })
  }
}

const updateErrorDefinition = () => {
  const modeling = bpmnInstances().modeling
  const moddle = bpmnInstances().moddle
  const eventDefinitions = bpmnElement.value.businessObject.eventDefinitions || []

  if (eventDefinitions.length === 0) return

  const errorEventDefinition = eventDefinitions[0]

  if (errorCode.value || errorName.value) {
    const errorRef = moddle.create('bpmn:Error', {
      errorCode: errorCode.value,
      name: errorName.value
    })
    errorEventDefinition.errorRef = errorRef
  } else {
    errorEventDefinition.errorRef = undefined
  }

  modeling.updateProperties(bpmnElement.value, {
    eventDefinitions: [errorEventDefinition]
  })
}

const updateEscalationDefinition = () => {
  const modeling = bpmnInstances().modeling
  const moddle = bpmnInstances().moddle
  const eventDefinitions = bpmnElement.value.businessObject.eventDefinitions || []

  if (eventDefinitions.length === 0) return

  const escalationEventDefinition = eventDefinitions[0]

  if (escalationCode.value) {
    const escalationRef = moddle.create('bpmn:Escalation', {
      escalationCode: escalationCode.value
    })
    escalationEventDefinition.escalationRef = escalationRef
  } else {
    escalationEventDefinition.escalationRef = undefined
  }

  modeling.updateProperties(bpmnElement.value, {
    eventDefinitions: [escalationEventDefinition]
  })
}

const updateAsync = (type: string) => {
  const modeling = bpmnInstances().modeling
  const value = type === 'asyncBefore' ? asyncBefore.value : asyncAfter.value
  modeling.updateProperties(bpmnElement.value, {
    [`${prefix}:${type}`]: value
  })
}

onMounted(() => {
  resetEventConfig()
})

watch(
  () => props.id,
  () => {
    nextTick(() => resetEventConfig())
  }
)
</script>
