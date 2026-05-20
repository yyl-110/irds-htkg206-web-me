<template>
  <el-card
    style="margin: 10px; min-height: 100px; margin-right: 30px"
    v-if="errorInsatnceList.length > 0"
  >
    <template #header>
      <div class="card-header">
        <span>{{ $t('异常信息') }}</span>
      </div>
    </template>
    <div v-if="errorInsatnceList.length > 0">
      <div v-for="(intstance, index2) in errorInsatnceList" :key="index2">
        <div v-for="(item, index3) in errorTitleList" :key="index3">
          <el-row class="intstance-row" v-if="intstance[item.key]">
            <el-form-item :label="item.value + `${[':', '：'].includes(item.value.substr(-1)) ? '' : ':'}`" class="i-r-l">
              <span
                style="font-weight: 300"
                :style="handleStyle(item.key)"
                @click="handleClick(intstance, item.key)"
              >
                {{ intstance[item.key] }}
              </span>
            </el-form-item>
          </el-row>
        </div>
      </div>
    </div>

    <div style="height: 300px" v-else>
      <Empty text="暂无审核信息" />
    </div>
    <div
      v-if="showColorTip && todoTask?.name.includes('工艺审核') && orderBomColorReq"
    >
      <gs-icon svg icon="icon_prompt" size="18px" style="margin-right: 5px" />
      该订单涉及颜色需求，请基于该订单指定对应的颜色标识
    </div>
  </el-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  errorTitleList: any[]
  errorInsatnceList: any[]
  todoTask?: any
  orderBomColorReq?: boolean
  showColorTip?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', instance: any, key: string): void
}>()

const handleStyle = (field: any) => {
  return {
    color: ['name', 'orderNo', 'areaConfigName', 'designModel'].includes(field)
      ? '#0158F0'
      : '#ff0000',
    cursor: 'pointer',
    marginLeft: '10px',
    'text-decoration': ['name', 'orderNo', 'areaConfigName'].includes(field) ? 'underline' : 'none'
  }
}

const handleClick = (instance: any, key: string) => {
  emit('click', instance, key)
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label){
  font-weight: normal;
}
.card-header {
  font-weight: 600;
  display: flex;
}

.intstance-row {
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.i-r-l {
  margin-right: 15px;
  margin-bottom: 0px;
  font-weight: 600;
}
</style>
