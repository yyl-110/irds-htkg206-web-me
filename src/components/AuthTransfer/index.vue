<template>
  <a-transfer
    class="auth-transfer"
    v-bind="transferBindAttrs"
    :target-keys="targetKeys"
    :data-source="dataSource"
    :render="wrappedRender"
    :row-key="rowKeyFn"
    @change="onChange"
    @select-change="(...args) => emit('select-change', ...args)"
  >
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </a-transfer>
</template>

<script setup lang="ts">
import { computed, h, useAttrs, useSlots } from 'vue'

type TransferKey = string | number

const props = withDefaults(
  defineProps<{
    targetKeys: TransferKey[]
    dataSource: any[]
    rowKey?: string | ((item: any) => TransferKey)
    render?: (item: any) => string
    singleChoice?: boolean
  }>(),
  {
    targetKeys: () => [],
    dataSource: () => [],
    singleChoice: false,
  },
)

const emit = defineEmits<{
  'update:targetKeys': [keys: TransferKey[]]
  change: [targetKeys: TransferKey[], direction: 'left' | 'right', moveKeys: TransferKey[]]
  'select-change': [sourceSelectedKeys: TransferKey[], targetSelectedKeys: TransferKey[]]
}>()

const attrs = useAttrs()
const slots = useSlots()

const transferBindAttrs = computed(() => {
  const bind = { ...attrs } as Record<string, unknown>
  delete bind.class
  delete bind.targetKeys
  delete bind['target-keys']
  delete bind.dataSource
  delete bind['data-source']
  delete bind.render
  delete bind.rowKey
  delete bind['row-key']
  delete bind.singleChoice
  delete bind['single-choice']
  return bind
})

function resolveKey(item: any): string {
  if (typeof props.rowKey === 'function')
    return String(props.rowKey(item))
  if (typeof props.rowKey === 'string')
    return String(item[props.rowKey] ?? item.key ?? '')
  return String(item.key ?? item.id ?? '')
}

function defaultRender(item: any): string {
  const nickname = item.nickname ?? item.name
  const username = item.username
  if (nickname != null && username != null)
    return `${nickname} （${username}）`
  return String(item.title ?? item.name ?? nickname ?? '')
}

function rowKeyFn(item: any) {
  return resolveKey(item)
}

function wrappedRender(item: any) {
  const key = resolveKey(item)
  const onRight = props.targetKeys.map(String).includes(key)
  const label = props.render ? props.render(item) : defaultRender(item)
  return h(
    'span',
    {
      class: 'auth-transfer-item-label',
      onDblclick: (e: MouseEvent) => {
        e.stopPropagation()
        onItemDblClick(key, onRight)
      },
    },
    label,
  )
}

function onItemDblClick(key: string, fromRight: boolean) {
  const current = props.targetKeys.map(String)
  let next: string[]
  let direction: 'left' | 'right'
  const moveKeys: TransferKey[] = [key]

  if (fromRight) {
    next = current.filter(k => k !== key)
    direction = 'left'
  }
  else {
    next = props.singleChoice ? [key] : [...current, key]
    direction = 'right'
  }

  emitChange(next, direction, moveKeys)
}

function emitChange(
  nextKeys: TransferKey[],
  direction: 'left' | 'right',
  moveKeys: TransferKey[],
) {
  emit('update:targetKeys', nextKeys)
  emit('change', nextKeys, direction, moveKeys)
}

function onChange(
  nextTargetKeys: TransferKey[],
  direction: 'left' | 'right',
  moveKeys: TransferKey[],
) {
  let keys = nextTargetKeys
  if (props.singleChoice && keys.length > 1)
    keys = [keys[keys.length - 1]]
  emitChange(keys, direction, moveKeys)
}
</script>
