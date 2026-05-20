<template>
  <div class="panel-tab__content">
    <el-form label-width="100px" label-position="left" size="small">
      <el-form-item label="事件类型">
        <el-select v-model="eventDefinitionType" placeholder="请选择事件类型" @change="updateEventDefinition">
          <el-option label="定时捕获事件" value="bpmn:TimerEventDefinition" />
          <el-option label="消息捕获事件" value="bpmn:MessageEventDefinition" />
          <el-option label="信号捕获事件" value="bpmn:SignalEventDefinition" />
          <el-option label="条件捕获事件" value="bpmn:ConditionalEventDefinition" />
        </el-select>
      </el-form-item>

      <!-- 定时配置（复用开始事件的定时配置逻辑）-->
      <template v-if="eventDefinitionType === 'bpmn:TimerEventDefinition'">
        <el-form-item label="定时类型">
          <el-radio-group v-model="timerType" @change="handleTimerTypeChange">
            <el-radio label="date">日期</el-radio>
            <el-radio label="duration">持续时间</el-radio>
            <el-radio label="cycle">循环</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="timerLabel">
          <el-input v-model="timerValue"
          :placeholder="timerPlaceholder" @change="updateTimerDefinition" />
        </el-form-item>
      </template>

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

      <!-- 条件配置 -->
      <template v-if="eventDefinitionType === 'bpmn:ConditionalEventDefinition'">
        <el-form-item label="条件表达式">
          <el-input v-model="conditionExpression" type="textarea" :rows="3" placeholder="请输入条件表达式" @change="updateConditionalDefinition" />
        </el-form-item>
      </template>

      <el-form-item label="异步执行">
        <el-switch v-model="asyncBefore" @change="updateAsync('asyncBefore')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'IntermediateCatchEventConfig' })

const props = defineProps({
  id: String,
  type: String
})

const prefix = inject('prefix', 'flowable')
const bpmnInstances = () => (window as any)?.bpmnInstances
const bpmnElement = ref()
const eventDefinitionType = ref('')
const timerType = ref('date')
const timerValue = ref('')
const messageRef = ref('')
const signalRef = ref('')
const conditionExpression = ref('')
const asyncBefore = ref(false)
const messageList = ref([])
const signalList = ref([])

const timerLabel = computed(() => {
  const labelMap = { date: '日期', duration: '持续时间', cycle: '循环' }
  return labelMap[timerType.value]
})

const timerPlaceholder = computed(() => {
  const placeholderMap = {
    date: '例如: 2024-01-01T00:00:00',
    duration: '例如: PT5M (5分钟)',
    cycle: '例如: R3/PT10M (重复3次,每次间隔10分钟)'
  }
  return placeholderMap[timerType.value]
})

const resetEventConfig = () => {
  bpmnElement.value = bpmnInstances().bpmnElement
  const businessObject = bpmnElement.value.businessObject
  const eventDefinitions = businessObject.eventDefinitions || []

  if (eventDefinitions.length > 0) {
    const eventDef = eventDefinitions[0]
    eventDefinitionType.value = eventDef.$type

    if (eventDef.$type === 'bpmn:TimerEventDefinition') {
      if (eventDef.timeDate) {
        timerType.value = 'date'
        timerValue.value = eventDef.timeDate.body || ''
      } else if (eventDef.timeDuration) {
        timerType.value = 'duration'
        timerValue.value = eventDef.timeDuration.body || ''
      } else if (eventDef.timeCycle) {
        timerType.value = 'cycle'
        timerValue.value = eventDef.timeCycle.body || ''
      }
    } else if (eventDef.$type === 'bpmn:MessageEventDefinition') {
      messageRef.value = eventDef.messageRef?.id || ''
    } else if (eventDef.$type === 'bpmn:SignalEventDefinition') {
      signalRef.value = eventDef.signalRef?.id || ''
    } else if (eventDef.$type === 'bpmn:ConditionalEventDefinition') {
      conditionExpression.value = eventDef.condition?.body || ''
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
}

const handleTimerTypeChange = () => {
  // 切换定时类型时清空输入值
  timerValue.value = ''
  updateTimerDefinition()
}

const updateTimerDefinition = () => {
  const modeling = bpmnInstances().modeling
  const moddle = bpmnInstances().moddle
  const eventDefinitions = bpmnElement.value.businessObject.eventDefinitions || []
  if (eventDefinitions.length === 0) return

  const timerEventDefinition = eventDefinitions[0]

  // 创建表达式对象（即使值为空也创建，确保保存到XML）
  const formalExpression = timerValue.value
    ? moddle.create('bpmn:FormalExpression', { body: timerValue.value })
    : undefined

  // 构建更新属性对象
  const updateProps: any = {
    timeDate: undefined,
    timeDuration: undefined,
    timeCycle: undefined
  }

  // 根据类型设置对应属性
  if (timerType.value === 'date') {
    updateProps.timeDate = formalExpression
  } else if (timerType.value === 'duration') {
    updateProps.timeDuration = formalExpression
  } else if (timerType.value === 'cycle') {
    updateProps.timeCycle = formalExpression
  }

  // 使用 updateModdleProperties 更新定时器事件定义的属性
  modeling.updateModdleProperties(
    toRaw(bpmnElement.value),
    timerEventDefinition,
    updateProps
  )
}

const updateMessageDefinition = () => {
  const modeling = bpmnInstances().modeling
  const eventDefinitions = bpmnElement.value.businessObject.eventDefinitions || []
  if (eventDefinitions.length === 0) return

  const rootElements = bpmnInstances().modeler.getDefinitions().rootElements
  const message = rootElements.find((el) => el.id === messageRef.value)

  if (message) {
    eventDefinitions[0].messageRef = message
    modeling.updateProperties(bpmnElement.value, {
      eventDefinitions: [eventDefinitions[0]]
    })
  }
}

const updateSignalDefinition = () => {
  const modeling = bpmnInstances().modeling
  const eventDefinitions = bpmnElement.value.businessObject.eventDefinitions || []
  if (eventDefinitions.length === 0) return

  const rootElements = bpmnInstances().modeler.getDefinitions().rootElements
  const signal = rootElements.find((el) => el.id === signalRef.value)

  if (signal) {
    eventDefinitions[0].signalRef = signal
    modeling.updateProperties(bpmnElement.value, {
      eventDefinitions: [eventDefinitions[0]]
    })
  }
}

const updateConditionalDefinition = () => {
  const modeling = bpmnInstances().modeling
  const moddle = bpmnInstances().moddle
  const eventDefinitions = bpmnElement.value.businessObject.eventDefinitions || []
  if (eventDefinitions.length === 0) return

  if (conditionExpression.value) {
    const formalExpression = moddle.create('bpmn:FormalExpression', {
      body: conditionExpression.value
    })
    eventDefinitions[0].condition = formalExpression
  } else {
    eventDefinitions[0].condition = undefined
  }

  modeling.updateProperties(bpmnElement.value, {
    eventDefinitions: [eventDefinitions[0]]
  })
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

watch(() => props.id, () => {
  nextTick(() => resetEventConfig())
})
</script>
