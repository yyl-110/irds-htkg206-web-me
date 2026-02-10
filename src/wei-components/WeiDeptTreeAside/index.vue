<script lang="ts" setup>
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useDeptTree } from './hooks/useDeptTree'
import type { AdminApiSystemDept } from '@/api/tags/管理后台部门'

defineOptions({ name: 'WeiDeptTreeAside' })
const props = defineProps<{
  /** 获取部门信息的接口 */
  getSimpleDepts?: typeof AdminApiSystemDept.getSimpleDepts
}>()

const emit = defineEmits<{
  /** 点击部门时触发 */
  handleSelect: [selectedKeys: Array<number>]
}>()

const { query, deptTreeData, deptTreeLoaded } = useDeptTree(props.getSimpleDepts)

/**
 * handle select dept
 * @param selectedKeys keys
 */
const onSelectDept = (selectedKeys: Array<number>) => emit('handleSelect', selectedKeys)

const mainRef = ref()
const { height } = useElementSize(mainRef)
</script>

<template>
  <header class="aside-header">
    <a-input-search
      v-model:value="query" style="margin-bottom: 8px" allow-clear
      :placeholder="$t('请输入部门名称')"
    />
  </header>
  <main ref="mainRef" class="aside-main">
    <a-tree v-if="deptTreeLoaded" :tree-data="deptTreeData" :default-expand-all="true" :height="height" @select="onSelectDept">
      <template #title="{ name, dataRef }">
        <main>
          <span v-if="name.indexOf(query) > -1">
            {{ name.substr(0, name.indexOf(query)) }}
            <span style="color: #f50">{{ query }}</span>
            {{ name.substr(name.indexOf(query) + query.length) }}
          </span>
          <span v-else>{{ name }}</span>
        </main>
        <footer v-if="query" style="line-height: 20px;">
          <span style="opacity: 0.6; font-size: 12px;">{{ dataRef.$superiorDepartmentNames.join(' - ') }}</span>
        </footer>
      </template>
    </a-tree>
  </main>
</template>

<style lang="less" scoped>
@indent: 12px;
@header-height: 40px;
:deep(.ant-tree-switcher) {
  width: @indent;
}
:deep(.ant-tree-indent-unit) {
  width: @indent;
}
.aside-header {
  height: @header-height;
}
.aside-main {
  height: calc(100% - @header-height);
  overflow-y: auto;
}
</style>
