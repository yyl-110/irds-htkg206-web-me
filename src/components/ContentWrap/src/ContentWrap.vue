<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'

interface Props {
  title?: string
  message?: string
  bodyStyle?: CSSProperties
}

defineOptions({ name: 'ContentWrap' })

withDefaults(defineProps<Props>(), {
  title: '',
  message: '',
  bodyStyle: () => ({ padding: '10px' }),
})

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-wrap')
</script>

<template>
  <ElCard :body-style="bodyStyle" class="mb-15px" :class="[prefixCls]" shadow="never" style="height: 100%">
    <template v-if="title" #header>
      <div class="flex items-center">
        <span class="text-16px font-700">{{ title }}</span>
        <ElTooltip v-if="message" effect="dark" placement="right">
          <template #content>
            <div class="max-w-200px">
              {{ message }}
            </div>
          </template>
          <Icon :size="14" class="ml-5px" icon="ep:question-filled" />
        </ElTooltip>
        <div class="flex flex-grow pl-20px">
          <slot name="header" />
        </div>
      </div>
    </template>
    <slot />
  </ElCard>
</template>
