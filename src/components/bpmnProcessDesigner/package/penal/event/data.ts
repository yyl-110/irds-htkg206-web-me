import StartEvent from './event-components/StartEvent.vue'
import EndEvent from './event-components/EndEvent.vue'
import IntermediateThrowEvent from './event-components/IntermediateThrowEvent.vue'
import IntermediateCatchEvent from './event-components/IntermediateCatchEvent.vue'
import BoundaryEvent from './event-components/BoundaryEvent1.vue'

export const installedEventComponent = {
  StartEvent: {
    name: '开始事件',
    component: StartEvent
  },
  EndEvent: {
    name: '结束事件',
    component: EndEvent
  },
  IntermediateThrowEvent: {
    name: '中间抛出事件',
    component: IntermediateThrowEvent
  },
  IntermediateCatchEvent: {
    name: '中间捕获事件',
    component: IntermediateCatchEvent
  },
  BoundaryEvent: {
    name: '边界事件',
    component: BoundaryEvent
  }
}

export const getEventCollapseItemName = (elementType) => {
  return installedEventComponent[elementType]?.name || '事件配置'
}

export const isEventCollapseItemShow = (elementType) => {
  return !!installedEventComponent[elementType]
}
