import UserTaskCustomConfig from './components/UserTaskCustomConfig.vue'
import BoundaryEventTimer from './components/BoundaryEventTimer.vue'
import ServiceTaskCustomConfig from './components/ServiceTaskCustomConfig.vue'

export const CustomConfigMap = {
  UserTask: {
    name: '用户任务',
    componet: UserTaskCustomConfig
  },
  ServiceTask: {
    name: '服务任务',
    componet: ServiceTaskCustomConfig
  },
  BoundaryEventTimerEventDefinition: {
    name: '定时边界事件(非中断)',
    componet: BoundaryEventTimer
  }
}
