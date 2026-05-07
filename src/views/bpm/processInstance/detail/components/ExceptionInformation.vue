<template>
  <div class="errormsg" v-if="ifErrorInfo">
    <el-card class="errormsg--card">
      <template #header>
        <div class="errormsg--card__header">
          <span>{{ $t('异常信息') }}</span>
        </div>
      </template>
      <div class="errormsg--card__content">
        {{ props.errorInsatnceList?.[0]?.['errorMsgs'] }}
        <div v-if="props.remark" class="remark-content">
          {{ $t('失败原因') }}: {{ props.remark }}
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  errorInsatnceList: {
    type: Array,
    default: []
  },
  remark: {
    type: String,
    default: ''
  }
})

const ifErrorInfo = computed(() => props.errorInsatnceList?.[0]?.['errorMsgs'] ? true : false)

watch( ()=> props.errorInsatnceList, (newVal) => {
}, {
  immediate: true,
  deep: true
})
</script>
<style lang="scss" scoped>
.errormsg{
  padding: 10px 30px 10px 10px;
  &--card {
    min-height: 100px;
    box-sizing: border-box;
    overflow: hidden;
    :deep(.el-card__body) {
      padding: 16px;
      overflow: hidden;
    }
    &__header{
      font-weight: 700;
    }
    &__content {
      max-width: 100%;
      width: 100%;
      word-break: break-all;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: pre-wrap;
      line-height: 1.4;
      font-size: 14px;
      font-weight: 700;
      color: #ff0000;
      padding: 8px;
      box-sizing: border-box;
      display: block;
    }
  }
}
.remark-content {
  margin-top: 8px;
  font-weight: normal;
  color: #ff0000;
}

</style>
