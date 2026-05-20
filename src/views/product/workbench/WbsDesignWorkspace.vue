<script setup lang="ts">
/**
 * 兼容从 /internal/wbs-design-workspace 直达：拉取协同 COLLAB 流程树后进入与独立应用相同的设计页。
 */
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const projectId = String(route.query.projectId ?? '').trim()
  const taskId = String(route.query.taskId ?? '').trim()
  if (!projectId || !taskId) {
    message.warning('缺少 projectId 或 taskId')
    return
  }
  const hide = message.loading('正在进入协同设计工作台…', 0)
  try {
    const res = await AdminApiProjectTemp.wbsCollabProjectPages({ projectId, taskId })
    const payload = res?.data?.data as Record<string, unknown> | undefined
    if (!payload || typeof payload !== 'object') {
      message.error('协同流程数据为空（请确认任务已发布 COLLAB 版本）')
      return
    }
    const cacheKey = `designTaskCollabWorkspace:${projectId}:${taskId}:${Date.now()}`
    sessionStorage.setItem(cacheKey, JSON.stringify(payload))
    await router.replace({
      path: '/internal/design-task-app-workspace',
      query: {
        cacheKey,
        taskId,
        projectId,
        workspaceMode: 'wbs',
      },
    })
  }
  catch {
    message.error('加载协同设计工作台失败')
  }
  finally {
    hide()
  }
})
</script>

<template>
  <div class="wbs-design-redirect" />
</template>

<style scoped>
.wbs-design-redirect {
  min-height: 200px;
}
</style>
