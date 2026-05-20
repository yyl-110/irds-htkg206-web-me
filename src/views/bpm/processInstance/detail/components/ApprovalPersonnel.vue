<template>
  <div>
    <!-- 普通节点审批人员 -->
    <el-card
      style="margin: 10px; min-height: 100px; margin-right: 30px"
      v-if="processDefinitionList.length > 0 && !isMainEnginePlants"
    >
      <template #header>
        <div class="card-header">
          <span>{{ $t('节点审批人员') }}</span>
        </div>
      </template>
      <el-form-item
        style="font-weight: 700"
        :label="$t('流程节点:')"
        v-for="(item, index) in processDefinitionList"
        :key="index"
      >
        <span class="m-r20px font-medium w-160px"> {{ item.name }} </span>
        <span class="m-l150px"> {{ $t('审批人：') }} </span>
        <span class="w-100px">
          {{ approveUser[index]?.nickname || approveUser[index]?.psnName }}
        </span>
        <el-button type="info" @click="handleSelectUser(index, 'normal')" v-if="editType === 1">
          {{ $t('选择审批人') }}
        </el-button>
      </el-form-item>
    </el-card>

    <!-- 主机厂技术主管审批 -->
    <el-card
      style="margin: 10px; min-height: 100px; margin-right: 30px"
      v-if="isMainEnginePlants"
    >
      <template #header>
        <div class="card-header">
          <span>{{ $t('节点审批人员') }}</span>
        </div>
      </template>
      <el-form-item
        style="font-weight: 700"
        :label="$t('流程节点:')"
        v-for="(item, index) in processDefinitionList"
        :key="index"
      >
        <span class="m-r20px font-medium w-160px"> {{ item.name }} </span>
        <span class="m-l150px"> {{ $t('审批人：') }} </span>
        <span class="w-100px">
          {{
            mainEnginePlantsUser[index]?.nickname || mainEnginePlantsUser[index]?.psnName
          }}
        </span>
        <el-button
          type="info"
          @click="handleSelectUser(index, 'mainEngine')"
          v-if="editType === 1"
        >
          {{ $t('选择审批人') }}
        </el-button>
      </el-form-item>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  processDefinitionList: any[]
  approveUser: any[]
  mainEnginePlantsUser: any[]
  isMainEnginePlants: boolean
  editType: number
}>()

const emit = defineEmits<{
  (e: 'select-user', index: number, type: 'normal' | 'mainEngine'): void
}>()

const handleSelectUser = (index: number, type: 'normal' | 'mainEngine') => {
  emit('select-user', index, type)
}
</script>

<style lang="scss" scoped>
.card-header {
  font-weight: 600;
  display: flex;
}
</style>
