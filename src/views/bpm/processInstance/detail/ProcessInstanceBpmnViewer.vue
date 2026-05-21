<template>
  <el-card v-loading="loading" class="box-card">
    <MyProcessViewer key="designer" :xml="view.bpmnXml" :view="view" class="process-viewer" @success="sucess" />
  </el-card>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { MyProcessViewer } from '@/components/bpmnProcessDesigner/package'

defineOptions({ name: 'BpmProcessInstanceBpmnViewer' })
const emit = defineEmits(['transferSuccess'])
const props = defineProps({
  loading: propTypes.bool.def(false), // 是否加载中
  bpmnXml: propTypes.string, // BPMN XML
  modelView: propTypes.object,
})

const view = ref({
  bpmnXml: '',
}) // BPMN 流程图数据

const sucess = () => {
  emit('transferSuccess')
}

/** 只有 loading 完成时，才去加载流程列表 */
watch(
  () => props.modelView,
  async newModelView => {
    // 加载最新
    if (newModelView) {
      //@ts-ignore
      view.value = newModelView
    }
  },
)

/** 监听 bpmnXml */
watch(
  () => props.bpmnXml,
  value => {
    view.value.bpmnXml = value
  },
)
</script>
<style lang="scss" scoped>
.box-card {
  height: 100%;
  width: 100%;
  min-height: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  flex: 1;

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  :deep(.process-viewer) {
    flex: 1;
    height: 100% !important;
    min-height: 0;
    width: 100%;
    overflow: hidden;
  }
}
</style>
