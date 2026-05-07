<template>
  <el-card style="margin: 10px; min-height: 100px; margin-right: 30px" v-if="visible">
    <template #header>
      <div class="card-header">
        <span>{{ $t('处理意见') }}</span>
      </div>
    </template>
    <el-row class="intstance-row" style="background-color: #ffffff">
      <el-input
        :model-value="modelValue"
        @update:model-value="handleUpdate"
        type="textarea"
        :rows="4"
        :disabled="disabled"
      ></el-input>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
  disabled?: boolean
  visible?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleUpdate = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.card-header {
  font-weight: 600;
  display: flex;
}

.intstance-row {
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
