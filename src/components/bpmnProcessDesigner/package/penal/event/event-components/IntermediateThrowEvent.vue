<template>
  <div class="panel-tab__content">
    <el-form label-width="100px" label-position="left" size="small">
      <el-form-item label="事件类型">
        <el-select v-model="eventDefinitionType" placeholder="请选择事件类型" @change="updateEventDefinition">
          <el-option label="空抛出事件" value="" />
          <el-option label="消息抛出事件" value="bpmn:MessageEventDefinition" />
          <el-option label="信号抛出事件" value="bpmn:SignalEventDefinition" />
          <el-option label="升级抛出事件" value="bpmn:EscalationEventDefinition" />
          <el-option label="补偿抛出事件" value="bpmn:CompensateEventDefinition" />
        </el-select>
      </el-form-item>

      <!-- 消息配置 -->
      <template v-if="eventDefinitionType === 'bpmn:MessageEventDefinition'">
        <el-form-item label="消息引用">
          <el-select v-model="messageRef" placeholder="请选择消息" @change="updateMessageDefinition">
            <el-option v-for="msg in messageList" :key="msg.id" :label="msg.name" :value="msg.id" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 信号配置 -->
      <template v-if="eventDefinitionType === 'bpmn:SignalEventDefinition'">
        <el-form-item label="信号引用">
          <el-select v-model="signalRef" placeholder="请选择信号" @change="updateSignalDefinition">
            <el-option v-for="sig in signalList" :key="sig.id" :label="sig.name" :value="sig.id" />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="异步执行">
        <el-switch v-model="asyncBefore" @change="updateAsync('asyncBefore')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'IntermediateThrowEventConfig' })

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
const asyncBefore = ref(false)
const messageList = ref([])
const signalList = ref([])

const resetEventConfig = () => {
  bpmnElement.value = bpmnInstances().bpmnElement
  const businessObject = bpmnElement.value.businessObject
  const eventDefinitions = businessObject.eventDefinitions || []

  if (eventDefinitions.length > 0) {
    const eventDef = eventDefinitions[0]
    eventDefinitionType.value = eventDef.$type

    if (eventDef.$type === 'bpmn:MessageEventDefinition') {
      messageRef.value = eventDef.messageRef?.id || ''
    } else if (eventDef.$type === 'bpmn:SignalEventDefinition') {
      signalRef.value = eventDef.signalRef?.id || ''
    }
  } else {
    eventDefinitionType.value = ''
  }

  asyncBefore.value = businessObject[`${prefix}:asyncBefore`] || false
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

  modeling.updateProperties(bpmnElement.value, {
    eventDefinitions: []
  })

  if (!eventDefinitionType.value) return

  const eventDefinition = moddle.create(eventDefinitionType.value)
  modeling.updateProperties(bpmnElement.value, {
    eventDefinitions: [eventDefinition]
  })

  messageRef.value = ''
  signalRef.value = ''
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

const updateAsync = (type: string) => {
  const modeling = bpmnInstances().modeling
  modeling.updateProperties(bpmnElement.value, {
    [`${prefix}:${type}`]: asyncBefore.value
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
