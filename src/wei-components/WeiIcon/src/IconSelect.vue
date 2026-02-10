<script lang="ts" setup>
import { computed, ref, toRef } from 'vue'
import { get } from 'lodash-es'
import { IconJson } from './data'
import { WeiIcon } from '@/wei-components'

defineOptions({ name: 'WeiIconSelect' })

const props = defineProps({
  modelValue: {
    require: false,
    type: String,
  },
})

const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
const inputValue = toRef(props, 'modelValue')
const tabListNoTitle = [
  { tab: 'Element Plus', key: 'ep' },
  { tab: 'Font Awesome 4', key: 'fa' },
  { tab: 'Font Awesome 5 Solid', key: 'fa-solid' },
]

function getCurrentTab() {
  const value = inputValue.value?.split(':')
  return value && value.length ? (value[0] || tabListNoTitle[0].key) : tabListNoTitle[0].key
}

const noTitleKey = ref(getCurrentTab())
const onTabChange = (key: string) => noTitleKey.value = key
const currentIcons = computed(() => get(IconJson, `${noTitleKey.value}:`))
const onClickIcon = (icon: string) => emit('update:modelValue', icon)
</script>

<template>
  <a-popover title="" trigger="click">
    <template #content>
      <a-card
        size="small" :tab-list="tabListNoTitle" :active-tab-key="noTitleKey"
        @tab-change="onTabChange"
      >
        <div class="icon-list" style="width: 455px; height: 400px; overflow-y: auto; padding-right: 8px;">
          <a-card-grid v-for="(iconKey, index) in currentIcons" :key="index" class="w-[25px] h-[25px] flex justify-center items-center" @click="onClickIcon(`${noTitleKey}:${iconKey}`)">
            <WeiIcon :icon="`${noTitleKey}:${iconKey}`" />
          </a-card-grid>
        </div>
      </a-card>
    </template>
    <slot />
  </a-popover>
</template>
